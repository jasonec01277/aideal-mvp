'use client';
import { useEffect, useState } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => { setToken(localStorage.getItem('token')); }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await r.json();
      if (!r.ok || !data?.token) {
        setMsg(data?.detail || 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setMsg('Logged in');
      setUsername(''); setPassword('');
    } catch (e: any) {
      setMsg(e?.message || 'login error');
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    setMsg('Logged out');
  }

  return (
    <div className="flex items-center gap-2">
      {token ? (
        <>
          <span className="text-sm text-gray-600">Signed in</span>
          <button className="px-2 py-1 border rounded" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <form onSubmit={handleLogin} className="flex items-center gap-2">
          <input className="border rounded px-2 py-1" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="border rounded px-2 py-1" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="px-2 py-1 border rounded" type="submit">Login</button>
        </form>
      )}
      {msg && <span className="text-xs text-gray-500">{msg}</span>}
    </div>
  );
}
