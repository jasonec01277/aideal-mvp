import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

function authHeaderFrom(req: NextRequest) {
  const h = req.headers.get('authorization');
  return h ? { Authorization: h } : {};
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.text();
  const r = await fetch(`${BACKEND}/api/deals/${params.id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaderFrom(req),
    },
    body,
  });
  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const r = await fetch(`${BACKEND}/api/deals/${params.id}/`, {
    method: 'DELETE',
    headers: {
      ...authHeaderFrom(req),
    },
  });
  const text = await r.text();
  return new NextResponse(text || '', { status: r.status });
}
