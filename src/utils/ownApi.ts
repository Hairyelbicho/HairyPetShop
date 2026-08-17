export function getApiBase(): string {
  const env = import.meta.env.VITE_API_URL as string | undefined;
  if (env) return env.replace(/\/$/, '');
  return '';
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBase()}${normalized}`;
}

function sessionToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('hairy_session');
}

export async function ownApi<T = Record<string, unknown>>(
  path: string,
  body?: unknown,
  method?: string,
): Promise<T> {
  const token = sessionToken();
  const verb = method || (body === undefined ? 'GET' : 'POST');
  const response = await fetch(apiUrl(path), {
    method: verb,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined || verb === 'GET' ? undefined : JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok && payload?.error) {
    throw new Error(payload.error);
  }
  return payload as T;
}
