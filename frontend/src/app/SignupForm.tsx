'use client';

import { useState } from 'react';

export default function RegisterForm() {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [msg, setMsg] = useState<string>('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    try {
      const r = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await r.json();
      if (!r.ok) {
        setMsg(data?.detail || 'Register failed');
        return;
      }
      // store token and be “logged in”
      localStorage.setItem('token', data.token);
      setMsg('Registered & logged in ✔');
    } catch (err: any) {
      setMsg(err?.message || 'Register error');
    }
  }

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-2 p-3 border rounded max-w-sm">
      <h3 className="font-semibold">Create an account</h3>
      <input
        className="border rounded px-2 py-1"
        placeholder="username"
        value={username}
        onChange={(e) => setU(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setP(e.target.value)}
      />
      <button className="px-2 py-1 border rounded" type="submit">Register</button>
      {msg && <span className="text-xs text-gray-500">{msg}</span>}
    </form>
  );
}
