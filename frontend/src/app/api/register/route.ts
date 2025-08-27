export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function authHeader() {
  const t = getToken();
  return t ? { Authorization: `Token ${t}` } : {};
}

export function jsonHeaders() {
  return { 'Content-Type': 'application/json', ...authHeader() };
}

export async function apiFetch(url: string, init: RequestInit = {}) {
  const headers = { ...(init.headers || {}), ...authHeader() };
  const r = await fetch(url, { ...init, headers });
  const text = await r.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* keep text if not json */ }
  if (!r.ok) {
    const detail = data?.detail || text || `HTTP ${r.status}`;
    throw new Error(detail);
  }
  return data;
}
