import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { join } from 'node:path';
import { DATA_DIR, getPool, readJson, writeJson, ensureJson, bearerToken } from './db.mjs';

const USERS_FILE = join(DATA_DIR, 'users.json');
const SESSIONS_FILE = join(DATA_DIR, 'sessions.json');
const WALLETS_FILE = join(DATA_DIR, 'wallets.json');
const TX_FILE = join(DATA_DIR, 'wallet_transactions.json');

ensureJson(USERS_FILE);
ensureJson(SESSIONS_FILE);
ensureJson(WALLETS_FILE);
ensureJson(TX_FILE);

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, 'hex');
  return next.length === prev.length && timingSafeEqual(next, prev);
}

function newToken() {
  return randomBytes(32).toString('hex');
}

async function findUserByEmail(email) {
  const db = await getPool();
  if (db) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }
  return readJson(USERS_FILE).find((u) => u.email === email) || null;
}

async function findUserById(id) {
  const db = await getPool();
  if (db) {
    const { rows } = await db.query('SELECT id, email, created_at FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }
  const user = readJson(USERS_FILE).find((u) => String(u.id) === String(id));
  if (!user) return null;
  return { id: user.id, email: user.email, created_at: user.created_at };
}

async function createUser(email, password) {
  const password_hash = hashPassword(password);
  const db = await getPool();
  if (db) {
    const { rows } = await db.query(
      'INSERT INTO users (email, password_hash) VALUES ($1,$2) RETURNING id, email, created_at',
      [email, password_hash],
    );
    return rows[0];
  }
  const users = readJson(USERS_FILE);
  const user = {
    id: Date.now(),
    email,
    password_hash,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  writeJson(USERS_FILE, users);
  return { id: user.id, email: user.email, created_at: user.created_at };
}

async function createSession(userId) {
  const token = newToken();
  const db = await getPool();
  if (db) {
    await db.query('INSERT INTO sessions (token, user_id) VALUES ($1,$2)', [token, userId]);
    return token;
  }
  const sessions = readJson(SESSIONS_FILE);
  sessions.push({ token, user_id: userId, created_at: new Date().toISOString() });
  writeJson(SESSIONS_FILE, sessions);
  return token;
}

export async function userFromRequest(req) {
  const token = bearerToken(req);
  if (!token) return null;
  const db = await getPool();
  if (db) {
    const { rows } = await db.query(
      'SELECT u.id, u.email, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = $1',
      [token],
    );
    return rows[0] || null;
  }
  const session = readJson(SESSIONS_FILE).find((s) => s.token === token);
  if (!session) return null;
  return findUserById(session.user_id);
}

async function getWallet(userId) {
  const db = await getPool();
  if (db) {
    const { rows } = await db.query(
      'SELECT address, wallet_type, encrypted_private_key FROM wallet_addresses WHERE user_id = $1 LIMIT 1',
      [userId],
    );
    return rows[0] || null;
  }
  return readJson(WALLETS_FILE).find((w) => String(w.user_id) === String(userId)) || null;
}

export async function handleAuth(path, method, req, body) {
  if (path === '/api/auth/register' && method === 'POST') {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!email || password.length < 8) {
      return { status: 400, body: { success: false, error: 'Email y contraseña de al menos 8 caracteres' } };
    }
    if (await findUserByEmail(email)) {
      return { status: 400, body: { success: false, error: 'Ese email ya está registrado' } };
    }
    const user = await createUser(email, password);
    const token = await createSession(user.id);
    return { status: 200, body: { success: true, token, user } };
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const user = await findUserByEmail(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return { status: 401, body: { success: false, error: 'Email o contraseña incorrectos' } };
    }
    const token = await createSession(user.id);
    const wallet = await getWallet(user.id);
    return {
      status: 200,
      body: {
        success: true,
        token,
        user: { id: user.id, email: user.email },
        wallet: wallet || null,
      },
    };
  }

  if (path === '/api/auth/session' && method === 'GET') {
    const user = await userFromRequest(req);
    if (!user) return { status: 401, body: { success: false, error: 'Sin sesión' } };
    return { status: 200, body: { success: true, user } };
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    const token = bearerToken(req);
    if (token) {
      const db = await getPool();
      if (db) {
        await db.query('DELETE FROM sessions WHERE token = $1', [token]);
      } else {
        writeJson(SESSIONS_FILE, readJson(SESSIONS_FILE).filter((s) => s.token !== token));
      }
    }
    return { status: 200, body: { success: true } };
  }

  if (path === '/api/wallet-addresses' && method === 'GET') {
    const user = await userFromRequest(req);
    if (!user) return { status: 401, body: { success: false, error: 'Sin sesión' } };
    const wallet = await getWallet(user.id);
    return { status: 200, body: { success: true, address: wallet?.address || null, ...wallet } };
  }

  if (path === '/api/wallet-addresses' && method === 'POST') {
    const user = await userFromRequest(req);
    if (!user) return { status: 401, body: { success: false, error: 'Sin sesión' } };
    const address = String(body.address || '');
    const wallet_type = body.wallet_type || 'phantom';
    const encrypted_private_key = body.encrypted_private_key || null;
    const db = await getPool();
    if (db) {
      await db.query(
        `INSERT INTO wallet_addresses (user_id, address, wallet_type, encrypted_private_key, updated_at)
         VALUES ($1,$2,$3,$4,NOW())
         ON CONFLICT (user_id) DO UPDATE SET address = $2, wallet_type = $3, encrypted_private_key = COALESCE($4, wallet_addresses.encrypted_private_key), updated_at = NOW()`,
        [user.id, address, wallet_type, encrypted_private_key],
      );
    } else {
      const wallets = readJson(WALLETS_FILE).filter((w) => String(w.user_id) !== String(user.id));
      wallets.push({
        user_id: user.id,
        address,
        wallet_type,
        encrypted_private_key,
        updated_at: new Date().toISOString(),
      });
      writeJson(WALLETS_FILE, wallets);
    }
    return { status: 200, body: { success: true, address } };
  }

  if (path === '/api/wallet-addresses' && method === 'DELETE') {
    const user = await userFromRequest(req);
    if (!user) return { status: 401, body: { success: false, error: 'Sin sesión' } };
    const db = await getPool();
    if (db) {
      await db.query('DELETE FROM wallet_addresses WHERE user_id = $1', [user.id]);
    } else {
      writeJson(WALLETS_FILE, readJson(WALLETS_FILE).filter((w) => String(w.user_id) !== String(user.id)));
    }
    return { status: 200, body: { success: true } };
  }

  if (path === '/api/wallet-transactions' && method === 'GET') {
    const user = await userFromRequest(req);
    if (!user) return { status: 401, body: { success: false, error: 'Sin sesión' } };
    const db = await getPool();
    if (db) {
      const { rows } = await db.query(
        'SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
        [user.id],
      );
      return { status: 200, body: { success: true, transactions: rows } };
    }
    const rows = readJson(TX_FILE).filter((t) => String(t.user_id) === String(user.id));
    return { status: 200, body: { success: true, transactions: rows } };
  }

  return null;
}
