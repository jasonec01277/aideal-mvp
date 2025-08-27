import { headers } from 'next/headers';
import AddDealForm from './AddDealForm';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import AuthBar from './AuthBar';

type Deal = { id: number; title: string; price: number; score: number };

async function getDeals(searchParams: Record<string, string | string[] | undefined>) {
  const qs = new URLSearchParams();
  const pick = (k: string) => {
    const v = searchParams[k];
    if (typeof v === 'string' && v) qs.set(k, v);
  };
  ['search', 'ordering', 'price_min', 'price_max', 'score_min', 'score_max', 'page'].forEach(pick);

  const h = headers();
  const host = h.get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  const base = `${protocol}://${host}`;
  const url = `${base}/api/deals${qs.toString() ? `?${qs.toString()}` : ''}`;

  const r = await fetch(url, { cache: 'no-store' });
  const text = await r.text();
  const data = text ? JSON.parse(text) : { count: 0, results: [] };

  return {
    results: (data?.results ?? []) as Deal[],
    count: data?.count ?? 0,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  };
}

export default async function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { results: deals, count, next, previous } = await getDeals(searchParams);

  const mkUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    ['search', 'ordering', 'price_min', 'price_max', 'score_min', 'score_max'].forEach((k) => {
      const v = searchParams[k];
      if (typeof v === 'string' && v) params.set(k, v);
    });
    params.set('page', String(pageNum));
    const qs = params.toString();
    return qs ? `/?${qs}` : '/';
  };

  const currentPage = Number((typeof searchParams.page === 'string' ? searchParams.page : '1') ?? '1');
  const hasNext = Boolean(next);
  const hasPrev = Boolean(previous);

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deals</h1>
        <AuthBar />
      </div>

      <AddDealForm />

      {deals.length === 0 ? (
        <p className="opacity-70">No deals found.</p>
      ) : (
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.map((d) => (
              <li key={d.id} className="border rounded-xl p-4 shadow-sm bg-white/5 space-y-2">
                <h2 className="text-lg font-semibold">{d.title}</h2>
                <p>Price: {d.price}</p>
                <p className="text-sm opacity-75">Score: {d.score}</p>
                <div className="flex gap-3">
                  <EditButton id={d.id} currentTitle={d.title} currentPrice={d.price} currentScore={d.score} />
                  <DeleteButton id={d.id} />
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 pt-4">
            <a className={'px-3 py-2 rounded border ' + (hasPrev ? '' : 'opacity-40 pointer-events-none')} href={mkUrl(Math.max(1, currentPage - 1))}>
              ← Prev
            </a>
            <span className="text-sm opacity-75">Page {currentPage} • Total {count}</span>
            <a className={'px-3 py-2 rounded border ' + (hasNext ? '' : 'opacity-40 pointer-events-none')} href={mkUrl(currentPage + 1)}>
              Next →
            </a>
          </div>
        </>
      )}
    </main>
  );
}
