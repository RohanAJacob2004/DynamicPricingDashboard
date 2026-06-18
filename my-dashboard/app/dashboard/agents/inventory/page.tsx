'use client';

import { useState, useEffect } from 'react';
import { getSkus, getInventoryAgent } from '@/lib/api';
import { SkuSummary, InventoryAgentDetail } from '@/lib/api-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InventoryAgentPage() {
  const [skus, setSkus] = useState<SkuSummary[]>([]);
  const [selectedSku, setSelectedSku] = useState('');
  const [data, setData] = useState<InventoryAgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [skuListLoading, setSkuListLoading] = useState(true);

  useEffect(() => {
    getSkus()
      .then(list => {
        setSkus(list);
        setSkuListLoading(false);
        if (list.length > 0 && !selectedSku) {
          setSelectedSku(list[0].sku);
        }
      })
      .catch(() => setSkuListLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSku) return;
    setLoading(true);
    getInventoryAgent(selectedSku)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [selectedSku]);

  return (
    <div className="p-8 space-y-6 bg-[#f5f5f5] min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white text-lg">⚙️</div>
            <div>
              <h1 className="text-3xl font-bold text-[#0f172a]">Inventory Agent</h1>
              <p className="text-[#64748b] text-sm">Stock-level driven markdown optimization</p>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">⚙️</button>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-100">
        <span className="text-slate-600 font-medium">SKU Selector:</span>
        <select
          value={selectedSku}
          onChange={(e) => setSelectedSku(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {skus.map(s => (
            <option key={s.sku} value={s.sku}>{s.sku}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-slate-500 text-center py-12">Loading inventory data...</div>
      )}

      {!loading && !data && (
        <div className="text-slate-500 text-center py-12">No inventory data available for {selectedSku}</div>
      )}

      {data && (
        <>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <span className="text-orange-600 text-xl mt-0.5">⚠️</span>
            <div className="text-sm">
              <span className="font-semibold text-orange-900">{data.alert.severity} Stock Alert: </span>
              <span className="text-orange-800">
                {selectedSku} has only <strong>{data.alert.units_remaining} units</strong> remaining with expiry in <strong>{data.alert.days_to_expiry} days</strong>. {data.alert.recommended_action} recommended to clear stock and minimize waste.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-teal-600">⚙️</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Units Remaining</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">{data.metrics.units_remaining}</div>
              <p className="text-xs text-slate-500 mt-1">of {data.metrics.original_stock_estimate} original</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-teal-600">⏱️</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Days to Expiry</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">{data.metrics.days_to_expiry} days</div>
              <p className="text-xs text-slate-500 mt-1">{data.metrics.expiry_date ?? 'N/A'}</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-teal-600">📉</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Markdown Depth</span>
              </div>
              <div className="text-3xl font-bold text-rose-600">{data.metrics.markdown_pct}%</div>
              <p className="text-xs text-slate-500 mt-1">cost price ${data.metrics.cost_price}</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-teal-600">📦</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock Coverage</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">{data.metrics.stock_coverage_pct}%</div>
              <p className="text-xs text-slate-500 mt-1">vs initial stock</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-1 h-6 bg-orange-400 rounded"></div>
                  <h3 className="font-bold text-slate-900">Justification Card — {selectedSku}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Waste Risk</p>
                    <p className="text-2xl font-bold text-slate-900 mb-1">{data.justification.waste_risk_tier}</p>
                    <p className="text-xs text-slate-600">{data.justification.units_at_risk} units × ${data.metrics.cost_price} = ${data.justification.cost_basis_value_at_risk}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Daily Velocity</p>
                    <p className="text-2xl font-bold text-slate-900 mb-1">~{data.justification.daily_velocity} units</p>
                    <p className="text-xs text-slate-600">current rate</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Units to Clear</p>
                    <p className="text-2xl font-bold text-slate-900 mb-1">{data.justification.units_to_clear} units</p>
                    <p className="text-xs text-slate-600">before expiry</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Required Velocity</p>
                    <p className="text-2xl font-bold text-slate-900 mb-1">{data.justification.required_velocity}/day</p>
                    <p className="text-xs text-slate-600">to clear stock</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">🤖</span>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">Agent Reasoning</h4>
                    <p className="text-sm text-amber-800 leading-relaxed">{data.reasoning}</p>
                    <p className="text-xs text-amber-600 mt-2">Confidence: {(data.confidence * 100).toFixed(0)}% {data.fallback_used ? '(fallback)' : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                <div className="mb-6">
                  <h3 className="font-bold text-slate-900">Stock Depletion Curve</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedSku} — {data.product_name}</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.depletion_curve.map(d => ({ ...d, isProjected: d.is_projected }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="label" stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => `${value} units`}
                    />
                    <Bar dataKey="stock_on_hand" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider">Suggested Markdown Tiers</h3>
          </div>
        </>
      )}
    </div>
  );
}
