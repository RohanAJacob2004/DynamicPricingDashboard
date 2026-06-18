'use client';

import { useState, useEffect } from 'react';
import { getSkus, getSkuDetail } from '@/lib/api';
import { SkuSummary, SkuDetail } from '@/lib/api-types';
import { products as fallbackProducts, priceHistory as fallbackPriceHistory, getNextRunData, Product } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardHome() {
  const [skus, setSkus] = useState<SkuSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [priceHistory, setPriceHistory] = useState(fallbackPriceHistory);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentRun, setCurrentRun] = useState(1);
  const [agentScores, setAgentScores] = useState<Record<string, number>>({
    'Calendar': 0.91,
    'Season': 0.87,
    'Competitor': 0.84,
    'Inventory': 0.79,
  });

  useEffect(() => {
    getSkus()
      .then(data => {
        setSkus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API fetch failed, using fallback data:', err);
        setError('Could not load live data. Showing fallback data.');
        setUseFallback(true);
        setLoading(false);
      });
  }, []);

  const openSkus = skus.filter(s => s.final_modifier > 0);
  const downSkus = skus.filter(s => s.final_modifier < 0);
  const avgModifier = skus.length
    ? +(skus.reduce((sum, s) => sum + s.final_modifier, 0) / skus.length).toFixed(4)
    : 0;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAdvance = () => {
    setCurrentRun(prev => prev + 1);
    setProducts(getNextRunData(products));
  };

  const handleAction = (type: 'accept' | 'reject') => {
    if (selectedIds.length === 0) return;
    const delta = type === 'accept' ? 0.02 : -0.05;
    const newScores = { ...agentScores };
    selectedIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        newScores[product.agent] = +(newScores[product.agent] + delta).toFixed(2);
      }
    });
    setAgentScores(newScores);
    setSelectedIds([]);
  };

  const getDeltaColor = (predicted: number, final: number) => {
    return final >= predicted ? 'text-emerald-500' : 'text-rose-500';
  };

  const getAgentTagColor = (agent: string) => {
    switch (agent) {
      case 'Season': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Inventory': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Competitor': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Calendar': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'failed': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActionColor = (action: string) => {
    switch (action?.toLowerCase()) {
      case 'discount': return 'text-rose-500';
      case 'markup': return 'text-emerald-500';
      default: return 'text-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-slate-500 text-lg">Loading pricing data...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">Dynamic Pricing Dashboard</h1>
          <p className="text-[#64748b] mt-1">AI-driven price recommendations
            {!useFallback ? ` · ${skus.length} SKUs loaded` : ''}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total SKUs</span>
            <span className="text-base text-slate-400">ⓘ</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{useFallback ? products.length : skus.length}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recommended Down</span>
            <span className="text-base text-rose-500">📉</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{useFallback ? 5 : downSkus.length}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recommended Up</span>
            <span className="text-base text-emerald-500">📈</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{useFallback ? 2 : openSkus.length}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Avg Modifier</span>
            <span className="text-base text-slate-400">∨</span>
          </div>
          <div className={`text-3xl font-bold ${useFallback ? 'text-slate-800' : avgModifier < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {useFallback ? '-0.17' : avgModifier.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">
                {useFallback ? 'Price Recommendation Table' : 'SKU Pricing Summary'}
              </h2>
              <span className="text-slate-400 text-sm">{selectedIds.length} selected</span>
            </div>

            {useFallback ? (
              <table className="w-full text-left">
                <thead className="bg-[#fcfdfe] text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4"><input type="checkbox" className="rounded" /></th>
                    <th className="px-6 py-4">Product ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Units</th>
                    <th className="px-6 py-4">Expiry</th>
                    <th className="px-6 py-4">Predicted</th>
                    <th className="px-6 py-4">Final</th>
                    <th className="px-6 py-4">Δ Price</th>
                    <th className="px-6 py-4">Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p) => {
                    const delta = +(p.finalPrice - p.predictedPrice).toFixed(2);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(p.id)}
                            onChange={() => toggleSelect(p.id)}
                            className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{p.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{p.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{p.units}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{p.expiryDate}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">${p.predictedPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">${p.finalPrice.toFixed(2)}</td>
                        <td className={`px-6 py-4 text-sm font-medium ${getDeltaColor(p.predictedPrice, p.finalPrice)}`}>
                          {delta > 0 ? '▲' : delta < 0 ? '▼' : ''} {delta === 0 ? '0.00' : Math.abs(delta).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getAgentTagColor(p.agent)}`}>
                            {p.agent}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#fcfdfe] text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Modifier</th>
                    <th className="px-6 py-4">Confidence</th>
                    <th className="px-6 py-4">Review</th>
                    <th className="px-6 py-4">Inventory</th>
                    <th className="px-6 py-4">Competitor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {skus.map((s) => (
                    <tr key={s.sku} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{s.sku}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(s.final_status)}`}>
                          {s.final_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${getActionColor(s.final_action)}`}>
                          {s.final_action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {(s.final_modifier * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${s.final_confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">{(s.final_confidence * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {s.needs_review ? (
                          <span className="text-amber-500 font-bold">⚠</span>
                        ) : (
                          <span className="text-emerald-500">✓</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{s.inventory_action}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {(s.competitor_modifier * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="p-6 bg-[#fcfdfe] border-t border-slate-50 flex justify-between items-center">
              <div className="flex gap-3">
                <span className="text-slate-400 text-sm mt-2 mr-2 font-bold uppercase tracking-tight">Actions:</span>
                <button
                  onClick={() => handleAction('accept')}
                  className="bg-[#10b981] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-2"
                >
                  <span className="bg-white/20 rounded-full p-0.5 px-1.5">✓</span> Accept (+0.02)
                </button>
                <button
                  onClick={() => handleAction('reject')}
                  className="bg-[#ef4444] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-rose-600 transition-colors shadow-sm flex items-center gap-2"
                >
                  <span className="bg-white/20 rounded-full p-0.5 px-1.5 font-mono">✕</span> Reject (-0.05)
                </button>
                <button className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
                  <span className="opacity-50">👁</span> Flag for Review
                </button>
              </div>
              {useFallback && (
                <div className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-200 uppercase tracking-wider">
                  Simulation Run {currentRun}
                </div>
              )}
            </div>
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
