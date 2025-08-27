'use client';
import { useState } from 'react';

export default function SaveButton({ dealId }: { dealId: number }) {
  const [msg, setMsg] = useState<string>('');

  async function onClick() {
    setMsg('');
    const token = localStorage.getItem('token') || '';
    try {
      const r = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        body: JSON.stringify({ id: dealId }),
      });
      const text = await r.text();
      if (!r.ok) {
        setMsg(`Save failed (${r.status}): ${text || '{}'}`);
        return;
      }
      setMsg('saved!');
    } catch (e: any) {
      setMsg(e?.message || 'save error');
    } finally {
      setTimeout(() => setMsg(''), 2000);
    }
  }

  return (
    <button className="px-2 py-1 border rounded" onClick={onClick} title="Save to profile">
      Save
      {msg && <span className="ml-2 text-xs text-gray-500">{msg}</span>}
    </button>
  );
}
