'use client';

import { useState, useEffect } from 'react';
import { getAllKpis, getSkuDetail, getCustomerItem, getSkus, ProductKpi } from '@/lib/api';
import { SkuDetail, CustomerItem } from '@/lib/api-types';

export default function DashboardHome() {
  const [kpis, setKpis] = useState<ProductKpi[]>([]);
  const [customerItems, setCustomerItems] = useState<CustomerItem[]>([]);
  const [customerItemsLoading, setCustomerItemsLoading] = useState(true);
  const [kpiError, setKpiError] = useState<string | null>(null);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [selectedSkuId, setSelectedSkuId] = useState<string>('');
  const [skuDetails, setSkuDetails] = useState<Record<string, SkuDetail>>({});
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'needs_review'>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    getAllKpis()
      .then(data => {
        setKpis(data);
        if (data.length > 0) {
          setSelectedSkuId(data[0].sku_id);
        }
      })
      .catch(err => {
        console.error('Failed to load KPI details:', err);
        setKpiError('Could not load KPI metrics.');
      })
      .finally(() => setKpisLoading(false));
  }, []);

  useEffect(() => {
    getSkus()
      .then(skus => {
        return Promise.allSettled(
          skus.map(s => getCustomerItem(s.sku).then(item => item).catch(() => null))
        );
      })
      .then(results => {
        const items: CustomerItem[] = [];
        results.forEach(r => {
          if (r.status === 'fulfilled' && r.value) {
            items.push(r.value);
          }
        });
        setCustomerItems(items);
      })
      .catch(err => console.error('Failed to load customer items:', err))
      .finally(() => setCustomerItemsLoading(false));
  }, []);

  useEffect(() => {
    if (kpis.length === 0) return;
    Promise.allSettled(
      kpis.map(k => getSkuDetail(k.sku_id).then(d => ({ sku: k.sku_id, detail: d })))
    ).then(results => {
      const map: Record<string, SkuDetail> = {};
      results.forEach(r => {
        if (r.status === 'fulfilled') {
          map[r.value.sku] = r.value.detail;
        }
      });
      setSkuDetails(map);
      setDetailsLoading(false);
    });
  }, [kpis]);

  const selectedKpi = kpis.find(k => k.sku_id === selectedSkuId) || kpis[0];

  const needsReviewSet = new Set(
    Object.entries(skuDetails)
      .filter(([, d]) => d.final_price.final_recommendation.confidence === 0 || d.inventory.recommendation.confidence === 0)
      .map(([sku]) => sku)
  );

  const filteredKpis = filterMode === 'needs_review'
    ? kpis.filter(k => needsReviewSet.has(k.sku_id))
    : kpis;

    if (kpisLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-slate-500 text-lg">Loading KPIs...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">Dynamic Pricing Dashboard</h1>
          <p className="text-[#64748b] mt-1">AI-driven price recommendations · {kpis.length} SKUs</p>
        </div>
      </div>

      {kpiError && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
          {kpiError}
        </div>
      )}

   





      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Gross Margin</span>
            <span className="text-base text-slate-400">📊</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">
            {selectedKpi ? `${selectedKpi.gross_margin_pct.toFixed(1)}%` : '—'}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Daily Revenue</span>
            <span className="text-base text-slate-400">💰</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">
            {selectedKpi ? `$${selectedKpi.daily_revenue.toFixed(2)}` : '—'}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Weeks of Supply</span>
            <span className="text-base text-slate-400">📦</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">
            {selectedKpi ? selectedKpi.weeks_of_supply.toFixed(1) : '—'}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Days to Expiry</span>
            <span className="text-base text-slate-400">⏳</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">
            {selectedKpi ? selectedKpi.days_to_expiry : '—'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-900">Customer Items</h2>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">
              {customerItems.length} items
            </span>
            <button
              onClick={() => setFilterMode(f => f === 'all' ? 'needs_review' : 'all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filterMode === 'needs_review'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              {filterMode === 'needs_review' ? 'Show All' : `Needs Review (${needsReviewSet.size})`}
            </button>
          </div>
        </div>

        {customerItemsLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading items...</div>
        ) : (
        <table className="w-full text-left">
          <thead className="bg-[#fcfdfe] text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Unit</th>
              <th className="px-6 py-4">Days to Expire</th>
              
              <th className="px-6 py-4">New Price</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {customerItems.map((item) => (
              <tr key={item.sku_id} className={`hover:bg-slate-50/50 transition-colors ${selectedSkuId === item.sku_id ? 'bg-teal-50/50' : ''}`}>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.sku_id}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{item.item_name}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{item.item_category.toUpperCase()}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{item.unit}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{item.time_to_expire != null ? item.time_to_expire.toFixed(1) : '—'}</td>
                
                <td className="px-6 py-4 text-sm text-slate-700">{item.new_price != null ? `$${item.new_price.toFixed(2)}` : '—'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedSkuId(item.sku_id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedSkuId === item.sku_id
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-teal-100 hover:text-teal-700'
                    }`}
                  >
                    {selectedSkuId === item.sku_id ? 'Selected' : 'Select'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-slate-900">SKU Details</h2>
          <div className="flex items-center gap-3">
            {needsReviewSet.size > 0 && (
              <button
                onClick={() => setFilterMode(f => f === 'all' ? 'needs_review' : 'all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  filterMode === 'needs_review'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600'
                }`}
              >
                {filterMode === 'needs_review' ? 'Show All' : `${needsReviewSet.size} need review`}
              </button>
            )}
          </div>
        </div>
        {detailsLoading && (
          <div className="text-slate-400 text-sm text-center py-12">Loading details...</div>
        )}
        {!detailsLoading && Object.keys(skuDetails).length === 0 && (
          <div className="text-slate-400 text-sm text-center py-12">No details available</div>
        )}
        {!detailsLoading && (
          <div className="grid grid-cols-2 gap-4">
            {filteredKpis.map(k => {
              const d = skuDetails[k.sku_id];
              if (!d) return null;
              const needsReview = d.final_price.final_recommendation.confidence === 0 || d.inventory.recommendation.confidence === 0;
              const isExpanded = expandedCard === d.sku;
              return (
                <div
                  key={k.sku_id}
                  className={`rounded-lg border transition-colors ${
                    selectedSkuId === k.sku_id
                      ? 'border-teal-300 bg-teal-50/50'
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="p-5 cursor-pointer" onClick={() => setSelectedSkuId(k.sku_id)}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{d.sku}</span>
                        {needsReview && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-bold">⚠</span>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        d.final_price.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {d.final_price.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Action</p>
                        <span className={`text-sm font-bold ${d.final_price.final_recommendation.action === 'DISCOUNT' ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {d.final_price.final_recommendation.action}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Modifier</p>
                        <span className="text-sm font-bold text-slate-900">
                          {(d.final_price.final_recommendation.suggested_modifier * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Confidence</p>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${d.final_price.final_recommendation.confidence === 0 ? 'bg-amber-400' : 'bg-teal-500'}`}
                              style={{ width: `${Math.max(d.final_price.final_recommendation.confidence * 100, 5)}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            {d.final_price.final_recommendation.confidence === 0 ? '—' : `${(d.final_price.final_recommendation.confidence * 100).toFixed(0)}%`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-3">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Inventory</p>
                        <span className={`text-sm font-medium ${d.inventory.recommendation.action === 'DISCOUNT' ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {d.inventory.recommendation.action ?? '—'} {(d.inventory.recommendation.suggested_modifier * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Competitor</p>
                        <span className="text-sm font-medium text-slate-700">
                          {(d.competitor.recommendation.suggested_modifier * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Calendar</p>
                        <span className={`text-sm font-medium ${d.calendar?.recommendation.action === 'DISCOUNT' ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {d.calendar ? `${d.calendar.recommendation.action} ${(d.calendar.recommendation.suggested_modifier * 100).toFixed(1)}%` : '—'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedCard(isExpanded ? null : d.sku); }}
                      className="mt-4 w-full text-xs text-slate-400 hover:text-slate-600 font-medium"
                    >
                      {isExpanded ? '▲ Hide Reasoning' : '▼ Show Reasoning'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-4 border-t border-slate-50 pt-4">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Inventory Agent</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{d.inventory.rationale}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Competitor Agent</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{d.competitor.rationale}</p>
                      </div>
                      {d.calendar && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Calendar Agent</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{d.calendar.rationale}</p>
                      </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Pricing Agent</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{d.final_price.rationale}</p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); alert(`Approved ${d.sku}`); }}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); alert(`Rejected ${d.sku}`); }}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {!detailsLoading && filterMode === 'needs_review' && filteredKpis.length === 0 && (
          <div className="text-slate-400 text-sm text-center py-12">No items need review</div>
        )}
      </div>
    </div>
  );
}
