'use client';

import { useState, useEffect } from 'react';
import { getCompetitorSkus, getCompetitorAgent } from '@/lib/api';
import { CompetitorSkuSummary, CompetitorAgentDetail } from '@/lib/api-types';

export default function CompetitorAgentPage() {
  const [skus, setSkus] = useState<CompetitorSkuSummary[]>([]);
  const [selectedSku, setSelectedSku] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState<CompetitorAgentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompetitorSkus()
      .then(list => {
        setSkus(list);
        if (list.length > 0 && !selectedSku) {
          setSelectedSku(list[0].sku);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!selectedSku) return;
    setLoading(true);
    getCompetitorAgent(selectedSku)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [selectedSku]);

  return (
    <div className="p-8 space-y-6 bg-[#f5f5f5] min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-[#0f172a]">Competitor Agent</h1>
              <p className="text-[#64748b] text-sm">Real-time competitive pricing intelligence</p>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">⚙️</button>
      </div>



      <div className="bg-white p-4 rounded-xl border border-slate-100 w-fit">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Type to search SKU..."
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {skus
                .filter(s => s.sku.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(s => (
                  <div
                    key={s.sku}
                    onMouseDown={() => { setSelectedSku(s.sku); setSearchQuery(s.sku); setShowDropdown(false); }}
                    className={`px-3 py-2 cursor-pointer text-sm hover:bg-teal-50 ${selectedSku === s.sku ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-700'}`}
                  >
                    {s.sku}
                  </div>
                ))}
              {skus.filter(s => s.sku.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="px-3 py-2 text-sm text-slate-400">No SKUs found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-slate-500 text-center py-12">Loading competitor data...</div>
      )}

      {!loading && !data && (
        <div className="text-slate-500 text-center py-12">No competitor data available for {selectedSku}</div>
      )}

      {data && (
        <>
         

          <div className="mt-6 bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
             
              <div>
                <h4 className="font-bold text-teal-900 mb-2">Agent Reasoning</h4>
                <p className="text-sm text-teal-800 leading-relaxed">{data.reasoning}</p>
                <p className="text-xs text-teal-600 mt-2">Confidence: {(data.confidence * 100).toFixed(0)}% {data.fallback_used ? '(fallback)' : ''}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-teal-600 text-lg">$</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Our Price</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">${data.our_current_price.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Current</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-teal-600 text-lg">🏪</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Competitor Price</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">${data.competitor_price.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Market competitor</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-teal-600 text-lg">📈</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price Difference</span>
              </div>
              <div className={`text-3xl font-bold ${data.price_difference_pct < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {data.price_difference_pct > 0 ? '+' : ''}{data.price_difference_pct.toFixed(1)}%
              </div>
              <p className="text-xs text-slate-500 mt-1">vs competitor</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-teal-600 text-lg">🎯</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</span>
              </div>
              <div className={`text-lg font-bold ${data.status === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'}`}>{data.status}</div>
              <p className="text-xs text-slate-500 mt-1">Agent run status</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-1 h-6 bg-teal-600 rounded"></div>
                  <h3 className="font-bold text-slate-900">Justification Card — {selectedSku}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Suggested Action</p>
                    <p className={`text-2xl font-bold mb-1 ${data.alert.suggested_action === 'DISCOUNT' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {data.alert.suggested_action}
                    </p>
                    <p className="text-xs text-slate-600">recommended</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Modifier</p>
                    <p className={`text-2xl font-bold mb-1 ${data.alert.modifier_pct < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {data.alert.modifier_pct > 0 ? '+' : ''}{data.alert.modifier_pct.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-600">price adjustment</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Our Price / Competitor</p>
                    <p className="text-2xl font-bold text-slate-900 mb-1">${data.metrics.our_current_price.toFixed(2)} / ${data.competitor_price.toFixed(2)}</p>
                    <p className="text-xs text-slate-600">{data.price_difference_pct > 0 ? '+' : ''}{data.price_difference_pct.toFixed(1)}% delta</p>
                  </div>
                </div>

              </div>
            </div>

            <div>
              <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-1 h-6 bg-teal-600 rounded"></div>
                  <h3 className="font-bold text-slate-900">Competitive Analysis</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-sm text-slate-600">Our Price</span>
                    <span className="text-sm font-bold text-slate-900">${data.metrics.our_current_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-sm text-slate-600">Competitor Price</span>
                    <span className="text-sm font-bold text-slate-900">${data.metrics.competitor_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-sm text-slate-600">Price Difference</span>
                    <span className={`text-sm font-bold ${data.metrics.price_difference_pct < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {data.metrics.price_difference_pct > 0 ? '+' : ''}{data.metrics.price_difference_pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-sm text-slate-600">Suggested Action</span>
                    <span className={`text-sm font-bold ${data.alert.suggested_action === 'DISCOUNT' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {data.alert.suggested_action}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-sm text-slate-600">Modifier</span>
                    <span className={`text-sm font-bold ${data.alert.modifier_pct < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {data.alert.modifier_pct > 0 ? '+' : ''}{data.alert.modifier_pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-sm text-slate-600">Confidence Score</span>
                    <span className="text-sm font-bold text-slate-900">{(data.alert.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-slate-600">Status</span>
                    <span className={`text-sm font-bold ${data.status === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'}`}>{data.status}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">Last updated: {new Date(data.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
