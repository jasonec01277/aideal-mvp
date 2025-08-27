'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function FilterBar() {
  const router = useRouter();
  const sp = useSearchParams();

  const [search, setSearch] = useState(sp.get('search') ?? '');
  const [priceMin, setPriceMin] = useState(sp.get('price_min') ?? '');
  const [priceMax, setPriceMax] = useState(sp.get('price_max') ?? '');
  const [scoreMin, setScoreMin] = useState(sp.get('score_min') ?? '');
  const [scoreMax, setScoreMax] = useState(sp.get('score_max') ?? '');

  useEffect(() => {
    setSearch(sp.get('search') ?? '');
    setPriceMin(sp.get('price_min') ?? '');
    setPriceMax(sp.get('price_max') ?? '');
    setScoreMin(sp.get('score_min') ?? '');
    setScoreMax(sp.get('score_max') ?? '');
  }, [sp]);

  function apply() {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (priceMin) params.set('price_min', priceMin);
    if (priceMax) params.set('price_max', priceMax);
    if (scoreMin) params.set('score_min', scoreMin);
    if (scoreMax) params.set('score_max', scoreMax);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : '/');
  }

  function reset() {
    setSearch('');
    setPriceMin('');
    setPriceMax('');
    setScoreMin('');
    setScoreMax('');
    router.replace('/');
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
      <input className="border rounded p-2" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
      <input className="border rounded p-2" placeholder="Min price" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
      <input className="border rounded p-2" placeholder="Max price" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
      <input className="border rounded p-2" placeholder="Min score" value={scoreMin} onChange={(e) => setScoreMin(e.target.value)} />
      <input className="border rounded p-2" placeholder="Max score" value={scoreMax} onChange={(e) => setScoreMax(e.target.value)} />
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded border" onClick={apply}>Apply</button>
        <button className="px-3 py-2 rounded border" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

