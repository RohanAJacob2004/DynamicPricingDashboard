'use client';

import { useState } from 'react';
import { competitorAgentData, products } from '@/lib/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const competitorDetails: Record<string, any> = {
  'SKU-1042': {
    productName: 'Cold Brew Coffee 12oz',
    ourPrice: 3.99,
    marketMedian: 3.89,
    competitorDelta: 0.10,
    marketPosition: '#3 of 6',
    priceGapToWalmart: 0.20,
    walmartPrice: 3.79,
    volumeImpact: -3.2,
    recommendedAdjustment: -0.10,
    recommendedPrice: 3.89,
    agentReasoning: 'Scrape detected Walmart dropped Cold Brew 12oz to $3.79 (~$0.20 vs us). Current positioning at $3.99 places RetailPulse as 3rd most expensive of 6 tracked competitors. Competitor delta of +$0.10 above median suggests mild volume risk. The Competitor Agent recommends a ~$0.10 adjustment to $3.89 to match the market median and protect market share without entering a price war.',
    competitorComparison: [
      { retailer: 'RetailPulse', price: 3.99, fill: '#10b981' },
      { retailer: 'Walmart', price: 3.79, fill: '#0f6b6b' },
      { retailer: 'Target', price: 4.19, fill: '#0f1b2d' },
      { retailer: 'Kroger', price: 3.99, fill: '#0db8a8' },
      { retailer: 'Costco', price: 3.49, fill: '#cbd5e1' },
      { retailer: 'Whole Foods', price: 4.49, fill: '#0f1b2d' },
    ]
  },
  'SKU-2187': {
    productName: 'Organic Whole Milk 1L',
    ourPrice: 2.59,
    marketMedian: 2.69,
    competitorDelta: -0.10,
    marketPosition: '#2 of 5',
    priceGapToWalmart: -0.10,
    walmartPrice: 2.69,
    volumeImpact: +1.5,
    recommendedAdjustment: 0.00,
    recommendedPrice: 2.59,
    agentReasoning: 'Current pricing at $2.59 positions us competitively below the market median of $2.69. This ~$0.10 delta below median suggests strong volume opportunity. Walmart matches median at $2.69. No adjustment recommended at this time as current position provides competitive advantage without sacrificing margin.',
    competitorComparison: [
      { retailer: 'RetailPulse', price: 2.59, fill: '#10b981' },
      { retailer: 'Walmart', price: 2.69, fill: '#0f6b6b' },
      { retailer: 'Target', price: 2.79, fill: '#0f1b2d' },
      { retailer: 'Kroger', price: 2.89, fill: '#0db8a8' },
      { retailer: 'Whole Foods', price: 3.19, fill: '#0f1b2d' },
    ]
  }
};

export default function CompetitorAgentPage() {
  const [selectedSku, setSelectedSku] = useState('SKU-1042');
  const data = competitorDetails[selectedSku];

  return (
    <div className="p-8 space-y-6 bg-[#f5f5f5] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-700 flex items-center justify-center text-white text-lg">📊</div>
            <div>
              <h1 className="text-3xl font-bold text-[#0f172a]">Competitor Agent</h1>
              <p className="text-[#64748b] text-sm">Real-time competitive pricing intelligence</p>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">⚙️</button>
      </div>

      {/* SKU Selector */}
      <div className="flex items-center justify-end w-fit bg-white p-4 rounded-lg border border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-medium">SKU Selector:</span>
          <select
            value={selectedSku}
            onChange={(e) => setSelectedSku(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {Object.entries(competitorDetails).map(([sku, details]) => (
              <option key={sku} value={sku}>{sku} · {details.productName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600 text-lg">$</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Our Price</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">${data.ourPrice.toFixed(2)}</div>
          <p className="text-xs text-slate-500 mt-1">Current</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600 text-lg">📊</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Market Median</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">${data.marketMedian.toFixed(2)}</div>
          <p className="text-xs text-slate-500 mt-1">vs 5 competitors</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600 text-lg">📈</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Competitor Delta</span>
          </div>
          <div className={`text-3xl font-bold ${data.competitorDelta >= 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
            +${data.competitorDelta.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">above median</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600 text-lg">🎯</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Market Position</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{data.marketPosition}</div>
          <p className="text-xs text-slate-500 mt-1">by price rank</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Justification Card */}
          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-1 h-6 bg-teal-600 rounded"></div>
              <h3 className="font-bold text-slate-900">Justification Card — {selectedSku}</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Competitor Delta</p>
                <p className={`text-2xl font-bold mb-1 ${data.competitorDelta >= 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  +${data.competitorDelta.toFixed(2)}
                </p>
                <p className="text-xs text-slate-600">above market median</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Price Gap to Walmart</p>
                <p className={`text-2xl font-bold mb-1 ${data.priceGapToWalmart > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                  +${Math.abs(data.priceGapToWalmart).toFixed(2)}
                </p>
                <p className="text-xs text-slate-600">highest volume competitor</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Est. Volume Impact</p>
                <p className={`text-2xl font-bold mb-1 ${data.volumeImpact < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {data.volumeImpact > 0 ? '+' : ''}{data.volumeImpact}%
                </p>
                <p className="text-xs text-slate-600">if no price change</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Rec. Adjustment</p>
                <p className={`text-2xl font-bold mb-1 ${data.recommendedAdjustment < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {data.recommendedAdjustment > 0 ? '+' : ''}-${Math.abs(data.recommendedAdjustment).toFixed(2)}
                </p>
                <p className="text-xs text-slate-600">match market median</p>
              </div>
            </div>
          </div>

          {/* Agent Reasoning */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">📊</span>
              <div>
                <h4 className="font-bold text-teal-900 mb-2">Agent Reasoning</h4>
                <p className="text-sm text-teal-800 leading-relaxed">
                  {data.agentReasoning}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Competitor Price Comparison */}
          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-slate-900">Competitor Price Comparison</h3>
              <p className="text-sm text-slate-500 mt-1">{selectedSku} — Live market data</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.competitorComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="retailer" stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value.toFixed(2)}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => `$${(value as number).toFixed(2)}`}
                  cursor={false}
                />
                <Bar barSize={50} dataKey="price" fill="#10b981" radius={40}>
                  {data.competitorComparison.map((entry: { retailer: string; price: number; fill: string }, idx: number) => (
                    <Bar key={`bar-${idx}`} dataKey="price" fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
