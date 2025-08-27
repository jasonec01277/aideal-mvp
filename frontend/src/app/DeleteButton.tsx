'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [msg, setMsg] = useState('');

  async function del() {
    setMsg('');
    const token = localStorage.getItem('token');
    try {
      const r = await fetch(`/api/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      });
      if (!r.ok) {
        try { setMsg(`Delete failed (${r.status}): ${JSON.stringify(await r.json())}`); }
        catch { setMsg(`Delete failed (${r.status})`); }
        return;
      }
      router.refresh();
    } catch (e: any) {
      setMsg(e?.message || 'Delete error');
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button className="px-2 py-1 border rounded" onClick={del}>Delete</button>
      {msg && <span className="text-xs opacity-75">{msg}</span>}
    </div>
  );
}
