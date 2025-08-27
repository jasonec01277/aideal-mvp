'use client';

import { useState } from 'react';

const BACKEND = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

type Props = { onAuthChange?: (token: string | null) => void };

export default function AuthBar({ onAuthChange }: Props) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [msg, setMsg] = useState<string>('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function postJSON(url: string, body: any) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res;
  }

  async function handleLogin() {
    setMsg('');
    try {
      const r = await postJSON(`${BACKEND}/api/login/`, { username: u, password: p });
      if (!r.ok) {
        try { setMsg(`Login failed: ${(await r.json())?.detail ?? r.status}`); }
        catch { setMsg(`Login failed: HTTP ${r.status}`); }
        return;
      }
      const data = await r.json();
      localStorage.setItem('token', data.token);
      setMsg('Logged in');
      onAuthChange?.(data.token);
    } catch (e: any) {
      setMsg(e?.message || 'Login error');
    }
  }

  async function handleRegister() {
    setMsg('');
    try {
      const r = await postJSON(`${BACKEND}/api/register/`, { username: u, password: p });
      if (!r.ok) {
        try { setMsg(`Register failed: ${(await r.json())?.detail ?? r.status}`); }
        catch { setMsg(`Register failed: HTTP ${r.status}`); }
        return;
      }
      const data = await r.json();
      localStorage.setItem('token', data.token);
      setMsg('Registered & logged in');
      onAuthChange?.(data.token);
    } catch (e: any) {
      setMsg(e?.message || 'Register error');
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setMsg('Logged out');
    onAuthChange?.(null);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className="border rounded px-2 py-1 bg-transparent"
        placeholder="username"
        value={u}
        onChange={(e) => setU(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1 bg-transparent"
        placeholder="password"
        type="password"
        value={p}
        onChange={(e) => setP(e.target.value)}
      />
      {token ? (
        <button className="px-2 py-1 border rounded" onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <button className="px-2 py-1 border rounded" onClick={handleLogin}>Login</button>
          <button className="px-2 py-1 border rounded" onClick={handleRegister}>Sign up</button>
        </>
      )}
      {msg && <span className="text-xs opacity-75">{msg}</span>}
    </div>
  );
}
