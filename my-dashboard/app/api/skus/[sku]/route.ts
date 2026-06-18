import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  const { sku } = await params;
  const baseUrl = process.env.EXTERNAL_API_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: 'EXTERNAL_API_URL not configured' }, { status: 500 });
  }
  try {
    const res = await fetch(`${baseUrl}/skus/${encodeURIComponent(sku)}`, { next: { revalidate: 30 } });
    if (!res.ok) {
      return NextResponse.json({ error: `External API returned ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`GET /api/skus/${sku} failed:`, error);
    return NextResponse.json({ error: 'Failed to fetch SKU detail' }, { status: 502 });
  }
}
