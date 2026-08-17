import { ownApi } from './ownApi';

type AuthUser = { id: string | number; email: string };

function saveSession(token: string, user: AuthUser) {
  localStorage.setItem('hairy_session', token);
  localStorage.setItem('hairy_user_email', user.email);
  localStorage.setItem('hairy_user_id', String(user.id));
}

export function clearSession() {
  localStorage.removeItem('hairy_session');
  localStorage.removeItem('hairy_user_email');
  localStorage.removeItem('hairy_user_id');
}

export async function ownRegister(email: string, password: string) {
  const data = await ownApi<{ success: boolean; token: string; user: AuthUser; error?: string }>(
    '/api/auth/register',
    { email, password },
  );
  if (!data.success || !data.token) {
    throw new Error(data.error || 'Error al registrarse');
  }
  saveSession(data.token, data.user);
  return data;
}

export async function ownLogin(email: string, password: string) {
  const data = await ownApi<{
    success: boolean;
    token: string;
    user: AuthUser;
    wallet?: { address?: string; encrypted_private_key?: string };
    error?: string;
  }>('/api/auth/login', { email, password });
  if (!data.success || !data.token) {
    throw new Error(data.error || 'Error al iniciar sesión');
  }
  saveSession(data.token, data.user);
  if (data.wallet?.address) {
    localStorage.setItem('hairy_wallet_address', data.wallet.address);
  }
  if (data.wallet?.encrypted_private_key) {
    localStorage.setItem('hairy_wallet_encrypted', data.wallet.encrypted_private_key);
  }
  return data;
}

export async function ownSession() {
  const token = localStorage.getItem('hairy_session');
  if (!token) return null;
  try {
    const data = await ownApi<{ success: boolean; user?: AuthUser }>('/api/auth/session');
    return data.success ? data.user || null : null;
  } catch {
    return null;
  }
}

export async function ownLogout() {
  try {
    await ownApi('/api/auth/logout', {});
  } catch {
    /* local session still cleared */
  }
  clearSession();
}

export async function getWalletAddress(): Promise<string | null> {
  const local = localStorage.getItem('hairy_wallet_address');
  if (local) return local;
  if (!localStorage.getItem('hairy_session')) return null;
  try {
    const data = await ownApi<{ success: boolean; address?: string }>('/api/wallet-addresses');
    return data.address || null;
  } catch {
    return null;
  }
}

export async function saveWalletAddress(address: string, walletType = 'phantom') {
  localStorage.setItem('hairy_wallet_address', address);
  try {
    await ownApi('/api/wallet-addresses', { address, wallet_type: walletType });
  } catch {
    /* local copy is enough for HairyWallet */
  }
}

export async function deleteWalletAddress() {
  localStorage.removeItem('hairy_wallet_address');
  localStorage.removeItem('hairy_wallet_encrypted');
  try {
    await ownApi('/api/wallet-addresses', undefined, 'DELETE');
  } catch {
    /* ignore */
  }
}

export async function getWalletTransactions() {
  try {
    const data = await ownApi<{ success: boolean; transactions?: unknown[] }>('/api/wallet-transactions');
    return data.transactions || [];
  } catch {
    return [];
  }
}
