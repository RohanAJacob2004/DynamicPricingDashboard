import { SkuSummary, SkuDetail, InventoryAgentDetail } from './api-types';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export function getSkus(): Promise<SkuSummary[]> {
  return apiFetch('/api/skus');
}

export function getSkuDetail(sku: string): Promise<SkuDetail> {
  return apiFetch(`/api/skus/${encodeURIComponent(sku)}`);
}

export function getInventoryAgent(sku: string): Promise<InventoryAgentDetail> {
  return apiFetch(`/api/agents/inventory/${encodeURIComponent(sku)}`);
}
