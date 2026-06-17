'use client';

import { useState } from 'react';
import { products } from '@/lib/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const inventoryDetails: Record<string, any> = {
  'SKU-1042': {
    productName: 'Cold Brew Coffee 12oz',
    unitsRemaining: 82,
    originalUnits: 340,
    daysToExpiry: 3,
    expiryDate: 'Feb 28, 2024',
    markdownDepth: -18.6,
    originalPrice: 3.99,
    markdownPrice: 3.25,
    stockCoverage: 24.1,
    wasteRisk: 'High',
    riskValue: '$327',
    riskUnits: '82 units',
    riskPrice: '$3.99',
    dailyVelocity: -28,
    velocityAvg: '7-day avg',
    unitsToClear: 82,
    daysToClear: 3,
    requiredVelocity: 27.3,
    agentReasoning: 'With 82 units remaining and expiry in 3 days, current daily velocity of ~28 units is borderline insufficient to clear stock. A ~18.6% markdown to $3.25 is projected to boost velocity by +40% to ~40 units/day, ensuring full clearance by expiry. Net recovered value: $266 vs $0 if wasted.',
    depletionData: [
      { week: 'Week -3', inventory: 340 },
      { week: 'Week -2', inventory: 280 },
      { week: 'Week -1', inventory: 200 },
      { week: 'This Week', inventory: 82 },
      { week: 'Projected', inventory: 15 },
    ]
  },
  'SKU-2187': {
    productName: 'Organic Whole Milk 1L',
    unitsRemaining: 28,
    originalUnits: 120,
    daysToExpiry: 4,
    expiryDate: 'Mar 2, 2024',
    markdownDepth: -12.0,
    originalPrice: 2.89,
    markdownPrice: 2.54,
    stockCoverage: 23.3,
    wasteRisk: 'Medium',
    riskValue: '$80',
    riskUnits: '28 units',
    riskPrice: '$2.89',
    dailyVelocity: -15,
    velocityAvg: '7-day avg',
    unitsToClear: 28,
    daysToClear: 4,
    requiredVelocity: 7.0,
    agentReasoning: 'Moderate spoilage risk with 28 units and 4 days until expiry. Recommend 12% markdown to accelerate clearance. Current velocity should suffice with modest price reduction.',
    depletionData: [
      { week: 'Week -3', inventory: 120 },
      { week: 'Week -2', inventory: 95 },
      { week: 'Week -1', inventory: 60 },
      { week: 'This Week', inventory: 28 },
      { week: 'Projected', inventory: 5 },
    ]
  },
};

export default function InventoryAgentPage() {
  const [selectedSku, setSelectedSku] = useState('SKU-1042');
  const data = inventoryDetails[selectedSku];
  const productName = products.find(p => p.id === selectedSku)?.name || data.productName;

  return (
    <div className="p-8 space-y-6 bg-[#f5f5f5] min-h-screen">
      {/* Header */}
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

      {/* SKU Selector */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-100">
        <span className="text-slate-600 font-medium">SKU Selector:</span>
        <select
          value={selectedSku}
          onChange={(e) => setSelectedSku(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {Object.entries(inventoryDetails).map(([sku, details]) => (
            <option key={sku} value={sku}>{sku} · {details.productName}</option>
          ))}
        </select>
      </div>

      {/* Alert Box */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
        <span className="text-orange-600 text-xl mt-0.5">⚠️</span>
        <div className="text-sm">
          <span className="font-semibold text-orange-900">Low Stock Alert: </span>
          <span className="text-orange-800">
            {selectedSku} has only <strong>{data.unitsRemaining} units</strong> remaining with expiry in <strong>{data.daysToExpiry} days</strong>. Markdown recommended to clear stock and minimize waste.
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600">⚙️</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Units Remaining</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{data.unitsRemaining}</div>
          <p className="text-xs text-slate-500 mt-1">of {data.originalUnits} original</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600">⏱️</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Days to Expiry</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{data.daysToExpiry} days</div>
          <p className="text-xs text-slate-500 mt-1">{data.expiryDate}</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600">📉</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Markdown Depth</span>
          </div>
          <div className="text-3xl font-bold text-rose-600">{data.markdownDepth}%</div>
          <p className="text-xs text-slate-500 mt-1">${data.originalPrice} - ${data.markdownPrice}</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600">📦</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock Coverage</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{data.stockCoverage}%</div>
          <p className="text-xs text-slate-500 mt-1">vs initial stock</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Justification Card */}
          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-1 h-6 bg-orange-400 rounded"></div>
              <h3 className="font-bold text-slate-900">Justification Card — {selectedSku}</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Waste Risk</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">{data.wasteRisk}</p>
                <p className="text-xs text-slate-600">{data.riskUnits} × {data.riskPrice} = {data.riskValue}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Daily Velocity</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">~{Math.abs(data.dailyVelocity)} units</p>
                <p className="text-xs text-slate-600">{data.velocityAvg}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Units to Clear</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">{data.unitsToClear} units</p>
                <p className="text-xs text-slate-600">in {data.daysToClear} days needed</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Required Velocity</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">{data.requiredVelocity}/day</p>
                <p className="text-xs text-slate-600">at current pace</p>
              </div>
            </div>
          </div>

          {/* Agent Reasoning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">🤖</span>
              <div>
                <h4 className="font-bold text-amber-900 mb-2">Agent Reasoning</h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  With <strong>{data.unitsRemaining} units</strong> remaining and expiry in <strong>{data.daysToExpiry} days</strong>, current daily velocity of ~{Math.abs(data.dailyVelocity)} units is borderline insufficient to clear stock. A <strong>{data.markdownDepth}% markdown</strong> to ${data.markdownPrice} is projected to boost velocity by +40% to ~40 units/day, ensuring full clearance by expiry. Net recovered value: <strong>$266 vs $0</strong> if wasted.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Stock Depletion Chart */}
          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-slate-900">Stock Depletion Curve</h3>
              <p className="text-sm text-slate-500 mt-1">{selectedSku} — Weekly inventory levels</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.depletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => `${value} units`}
                />
                <Bar dataKey="inventory" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Suggested Markdown Tiers */}
      <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider">Suggested Markdown Tiers</h3>
      </div>
    </div>
  );
}
