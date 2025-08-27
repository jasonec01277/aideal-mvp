'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddDealForm() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<string>('');
  const [score, setScore] = useState<string>('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function addDeal() {
    setMsg('');
    const token = localStorage.getItem('token');
    try {
      const r = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          price: Number(price),
          score: Number(score),
        }),
      });
      if (!r.ok) {
        try { setMsg(`Add failed (${r.status}): ${JSON.stringify(await r.json())}`); }
        catch { setMsg(`Add failed (${r.status})`); }
        return;
      }
      setTitle(''); setPrice(''); setScore('');
      router.refresh(); // refresh server component data
    } catch (e: any) {
      setMsg(e?.message || 'Add error');
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input className="border rounded px-2 py-1 bg-transparent" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="border rounded px-2 py-1 bg-transparent" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input className="border rounded px-2 py-1 bg-transparent" placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} />
      <button className="px-3 py-1 border rounded" onClick={addDeal}>Add Deal</button>
      {msg && <span className="text-xs opacity-75">{msg}</span>}
    </div>
  );
}
