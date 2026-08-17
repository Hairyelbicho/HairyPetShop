import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = join(__dirname, 'data');

mkdirSync(DATA_DIR, { recursive: true });

export function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(join(__dirname, '.env'));
loadEnv(join(__dirname, '..', '.env'));
if (!process.env.GROQ_API_KEY && process.env.VITE_GROQ_API_KEY) {
  process.env.GROQ_API_KEY = process.env.VITE_GROQ_API_KEY;
}

let dbAttempted = false;
let pool = null;

export async function getPool() {
  if (dbAttempted) return pool;
  dbAttempted = true;
  if (!process.env.DATABASE_URL) return null;
  try {
    const pg = await import('pg');
    pool = new pg.default.Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query('SELECT 1');
    return pool;
  } catch (error) {
    console.warn('Postgres no disponible, usando JSON local:', error.message);
    pool = null;
    return null;
  }
}

export function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

export function writeJson(file, rows) {
  writeFileSync(file, JSON.stringify(rows, null, 2));
}

export function appendJson(file, row) {
  const rows = readJson(file);
  rows.push(row);
  writeJson(file, rows);
}

export function ensureJson(file, fallback = []) {
  if (!existsSync(file)) writeJson(file, fallback);
}

export function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type, authorization',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  });
  res.end(payload);
}

export async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export function bearerToken(req) {
  const header = req.headers.authorization || '';
  return header.replace(/^Bearer\s+/i, '').trim() || null;
}
