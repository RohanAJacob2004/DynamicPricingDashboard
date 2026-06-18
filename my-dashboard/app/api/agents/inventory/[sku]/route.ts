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
    const res = await fetch(`${baseUrl}/agents/inventory/${encodeURIComponent(sku)}`, { next: { revalidate: 30 } });
    if (!res.ok) {
      return NextResponse.json({ error: `External API returned ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`GET /api/agents/inventory/${sku} failed:`, error);
    return NextResponse.json({ error: 'Failed to fetch inventory agent' }, { status: 502 });
  }
}
