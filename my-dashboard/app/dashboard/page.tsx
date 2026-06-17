'use client';

import { useState } from 'react';
import { products as initialProducts, priceHistory as initialPriceHistory, getNextRunData, Product } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardHome() {
  const [products, setProducts] = useState(initialProducts);
  const [priceHistory, setPriceHistory] = useState(initialPriceHistory);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentRun, setCurrentRun] = useState(1);
  const [agentScores, setAgentScores] = useState<Record<string, number>>({
    'Calendar': 0.91,
    'Season': 0.87,
    'Competitor': 0.84,
    'Inventory': 0.79,
  });

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

  return (
    <div className="p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">Dynamic Pricing Dashboard</h1>
          <p className="text-[#64748b] mt-1">AI-driven price recommendations · Run {currentRun} of 3</p>
        </div>
        {/* <button 
          onClick={handleAdvance}
          className="bg-[#02383c] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm hover:bg-[#034d52] transition-colors shadow-sm uppercase tracking-tight"
        >
          <span className="text-base">🔄</span> Advance to Next Run
        </button> */}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total SKUs', value: '7', icon: 'ⓘ', color: 'text-slate-400' },
          { label: 'Recommended Down', value: '5', icon: '📉', color: 'text-rose-500' },
          { label: 'Recommended Up', value: '2', icon: '📈', color: 'text-emerald-500' },
          { label: 'Avg Delta', value: '-0.17', icon: '∨', color: 'text-slate-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</span>
              <span className={`text-base ${stat.color}`}>{stat.icon}</span>
            </div>
            <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">Price Recommendation Table</h2>
              <span className="text-slate-400 text-sm">{selectedIds.length} selected</span>
            </div>
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
              <div className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-200 uppercase tracking-wider">
                Simulation Run {currentRun}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-slate-900">1-Hour Price History</h3>
              <p className="text-xs text-slate-400 mt-1">SKU-1042 · Cold Brew Coffee</p>
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
