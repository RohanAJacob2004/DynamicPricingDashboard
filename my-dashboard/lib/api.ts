import { SkuSummary, SkuDetail, InventoryAgentDetail } from './api-types';

export interface DashboardKpis {
  avg_gross_margin_pct: number;
  total_daily_revenue: number;
  avg_weeks_of_supply: number;
  high_risk_sku_count: number;
  total_estimated_waste_units: number;
  avg_price_index: number;
  total_sku_count: number;
}

export interface ProductKpi {
  sku_id: string;
  gross_margin_pct: number;
  daily_revenue: number;
  weeks_of_supply: number;
  days_to_expiry: number;
  is_high_risk: boolean;
  estimated_waste_units: number;
  avg_daily_sales_revenue: number;
  calculated_at: string;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export function getSkus(): Promise<SkuSummary[]> {
  console.log("Fetching SKUs...");
  return apiFetch('/api/skus');
}

export function getSkuDetail(sku: string): Promise<SkuDetail> {
  return apiFetch(`/api/skus/${encodeURIComponent(sku)}`);
}

export function getInventoryAgent(sku: string): Promise<InventoryAgentDetail> {
  return apiFetch(`/api/agents/inventory/${encodeURIComponent(sku)}`);
}


export async function getDashboardKpis(): Promise<DashboardKpis> {
  const res = await fetch(`/api/kpis/dashboard`);
  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard KPIs: ${res.status}`);
  }
  const json = await res.json();
  return (json.data ?? json) as DashboardKpis;
}

export async function getAllKpis(): Promise<ProductKpi[]> {
  const res = await fetch(`/api/kpis`);
  if (!res.ok) {
    throw new Error(`Failed to fetch KPIs: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function getKpiBySku(skuId: string): Promise<ProductKpi[]> {
  const res = await fetch(`/api/kpis/${skuId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch KPI for ${skuId}: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}
