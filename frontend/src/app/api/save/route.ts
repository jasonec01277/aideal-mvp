import { NextRequest, NextResponse } from 'next/server';
const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function authHeaderFrom(req: NextRequest) {
  const h = req.headers.get('authorization');
  return h ? { Authorization: h } : {};
}

export async function GET(req: NextRequest) {
  const r = await fetch(`${BACKEND}/api/save/`, {
    headers: { ...authHeaderFrom(req) },
    cache: 'no-store',
  });
  const text = await r.text();
  return new NextResponse(text, { status: r.status, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const r = await fetch(`${BACKEND}/api/save/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaderFrom(req) },
    body,
  });
  const text = await r.text();
  return new NextResponse(text, { status: r.status, headers: { 'Content-Type': 'application/json' } });
}

