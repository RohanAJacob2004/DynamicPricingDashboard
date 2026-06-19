'use client';

import { useState, useEffect } from 'react';
import { getAllKpis, ProductKpi } from '@/lib/api';
import { priceHistory as fallbackPriceHistory } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardHome() {
  const [priceHistory] = useState(fallbackPriceHistory);
  const [kpis, setKpis] = useState<ProductKpi[]>([]);
  const [kpiError, setKpiError] = useState<string | null>(null);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [selectedSkuId, setSelectedSkuId] = useState<string>('');
  const [agentScores] = useState<Record<string, number>>({
    'Calendar': 0.91,
    'Season': 0.87,
    'Competitor': 0.84,
    'Inventory': 0.79,
  });

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

  const selectedKpi = kpis.find(k => k.sku_id === selectedSkuId) || kpis[0];

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

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">SKU KPI Overview</h2>
              <span className="text-slate-400 text-sm">{kpis.length} SKUs</span>
            </div>

            <table className="w-full text-left">
              <thead className="bg-[#fcfdfe] text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Gross Margin</th>
                  <th className="px-6 py-4">Daily Revenue</th>
                  <th className="px-6 py-4">Weeks of Supply</th>
                  <th className="px-6 py-4">Days to Expiry</th>
                  <th className="px-6 py-4">Risk</th>
                  <th className="px-6 py-4">Est. Waste</th>
                  <th className="px-6 py-4">Avg Daily Sales</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {kpis.map((k) => (
                  <tr key={k.sku_id} className={`hover:bg-slate-50/50 transition-colors ${selectedSkuId === k.sku_id ? 'bg-teal-50/50' : ''}`}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{k.sku_id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{k.gross_margin_pct.toFixed(1)}%</td>
                    <td className="px-6 py-4 text-sm text-slate-700">${k.daily_revenue.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{k.weeks_of_supply.toFixed(1)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{k.days_to_expiry}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${k.is_high_risk ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {k.is_high_risk ? 'High' : 'Low'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{k.estimated_waste_units}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">${k.avg_daily_sales_revenue.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedSkuId(k.sku_id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          selectedSkuId === k.sku_id
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-teal-100 hover:text-teal-700'
                        }`}
                      >
                        {selectedSkuId === k.sku_id ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-span-4 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-slate-900">1-Hour Price History</h3>
              <p className="text-xs text-slate-400 mt-1">Sample SKU</p>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis hide domain={['dataMin - 0.2', 'dataMax + 0.2']} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-6">Agent Trust Scores</h3>
            <div className="space-y-6">
              {Object.entries(agentScores).sort((a, b) => b[1] - a[1]).map(([agent, score]) => (
                <div key={agent} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">{agent}</span>
                    <span className="font-bold text-slate-900">{score.toFixed(2)}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10b981] transition-all duration-500" style={{ width: `${score * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
