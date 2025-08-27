'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  id: number;
  currentTitle: string;
  currentPrice: number;
  currentScore: number;
};

export default function EditButton({ id, currentTitle, currentPrice, currentScore }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [price, setPrice] = useState(String(currentPrice));
  const [score, setScore] = useState(String(currentScore));
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function save() {
    setMsg('');
    const token = localStorage.getItem('token');
    try {
      const r = await fetch(`/api/${id}`, {
        method: 'PUT',
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
        try { setMsg(`Save failed (${r.status}): ${JSON.stringify(await r.json())}`); }
        catch { setMsg(`Save failed (${r.status})`); }
        return;
      }
      setOpen(false);
      router.refresh();
    } catch (e: any) {
      setMsg(e?.message || 'Save error');
    }
  }

  return (
    <div>
      <button className="px-2 py-1 border rounded" onClick={() => setOpen(!open)}>Edit</button>
      {open && (
        <div className="mt-2 flex items-center gap-2">
          <input className="border rounded px-2 py-1 bg-transparent" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="border rounded px-2 py-1 bg-transparent" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input className="border rounded px-2 py-1 bg-transparent" value={score} onChange={(e) => setScore(e.target.value)} />
          <button className="px-2 py-1 border rounded" onClick={save}>Save</button>
          <button className="px-2 py-1 border rounded" onClick={() => setOpen(false)}>Cancel</button>
          {msg && <span className="text-xs opacity-75">{msg}</span>}
        </div>
      )}
    </div>
  );
}
