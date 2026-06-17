'use client';

import { useState } from 'react';
import { seasonAgentData } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const seasonDetails: Record<string, any> = {
  'SKU-1042': {
    productName: 'Cold Brew Coffee 12oz',
    currentTemp: 38,
    tempUnit: '°F',
    tempDescription: 'Cold snap',
    weatherEvent: 'Polar Vortex',
    weatherDescription: 'Severe cold advisory',
    demandIndex: 1.34,
    demandDescription: 'vs seasonal norm',
    precipitation: 60,
    precipDescription: 'Snow forecast',
    seasonPhase: 'Peak Winter',
    hotDrinkUplift: 34,
    priceElasticity: -0.42,
    agentReasoning: 'Polar Vortex event detected with temperatures dropping to 34°F. Historical analysis shows hot beverage demand increases +34% during cold snaps below 40°F. With low price elasticity (-0.42) for this SKU in winter, the Season Agent recommends a +$0.40 premium with minimal demand loss. Revenue upside estimated at $1,240 per store/day.',
    recommendedAction: '+$0.40',
    priceRange: '$3.99 - $4.39',
    revenueUpside: '+$1,240/day',
    confidence: 0.87,
    duration: '3 days',
    demandVsTemp: [
      { hour: '12am', demand: 45, temp: 28 },
      { hour: '4am', demand: 38, temp: 26 },
      { hour: '8am', demand: 62, temp: 30 },
      { hour: '12pm', demand: 78, temp: 34 },
      { hour: '4pm', demand: 85, temp: 36 },
      { hour: '8pm', demand: 72, temp: 32 },
      { hour: '12am', demand: 55, temp: 28 },
    ]
  },
  'SKU-4450': {
    productName: 'Sparkling Water 6-pack',
    currentTemp: 88,
    tempUnit: '°F',
    tempDescription: 'Heatwave',
    weatherEvent: 'Extreme Heat',
    weatherDescription: 'Heat advisory',
    demandIndex: 2.15,
    demandDescription: 'vs seasonal norm',
    precipitation: 5,
    precipDescription: 'Clear skies',
    seasonPhase: 'Summer Peak',
    hotDrinkUplift: 78,
    priceElasticity: -0.58,
    agentReasoning: 'Extreme heat conditions with temperatures reaching 88°F. Sparkling water and refreshing beverages see +78% demand uplift. Price elasticity of -0.58 suggests moderate sensitivity, but the Season Agent recommends a +$0.25 premium to capture the demand spike while managing volume impact. Projected revenue increase of $950/day.',
    recommendedAction: '+$0.25',
    priceRange: '$5.99 - $6.24',
    revenueUpside: '+$950/day',
    confidence: 0.82,
    duration: '5 days',
    demandVsTemp: [
      { hour: '12am', demand: 25, temp: 72 },
      { hour: '4am', demand: 20, temp: 70 },
      { hour: '8am', demand: 55, temp: 78 },
      { hour: '12pm', demand: 92, temp: 88 },
      { hour: '4pm', demand: 105, temp: 92 },
      { hour: '8pm', demand: 78, temp: 84 },
      { hour: '12am', demand: 35, temp: 76 },
    ]
  }
};

export default function SeasonAgentPage() {
  const [selectedSku, setSelectedSku] = useState('SKU-1042');
  const data = seasonDetails[selectedSku];

  return (
    <div className="p-8 space-y-6 bg-[#f5f5f5] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white text-lg">🌡️</div>
            <div>
              <h1 className="text-3xl font-bold text-[#0f172a]">Season Agent</h1>
              <p className="text-[#64748b] text-sm">Weather & seasonal demand intelligence</p>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">⚙️</button>
      </div>

      {/* SKU Selector */}
      <div className="flex items-center justify-end bg-white p-4 rounded-lg border border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-medium">SKU Selector:</span>
          <select
            value={selectedSku}
            onChange={(e) => setSelectedSku(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {Object.entries(seasonDetails).map(([sku, details]) => (
              <option key={sku} value={sku}>{sku} · {details.productName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600 text-lg">🌡️</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Temp</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{data.currentTemp}{data.tempUnit}</div>
          <p className="text-xs text-slate-500 mt-1">{data.tempDescription}</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600 text-lg">🌪️</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Weather Event</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{data.weatherEvent}</div>
          <p className="text-xs text-slate-500 mt-1">{data.weatherDescription}</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600 text-lg">📈</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Demand Index</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{data.demandIndex}x</div>
          <p className="text-xs text-slate-500 mt-1">{data.demandDescription}</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600 text-lg">💧</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Precipitation</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{data.precipitation}%</div>
          <p className="text-xs text-slate-500 mt-1">{data.precipDescription}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="col-span-2 space-y-6">
          {/* Justification Card */}
          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-1 h-6 bg-teal-600 rounded"></div>
              <h3 className="font-bold text-slate-900">Justification Card — {selectedSku}</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Season Phase</p>
                <p className="text-2xl font-bold text-slate-900">{data.seasonPhase}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Weather Event</p>
                <p className="text-2xl font-bold text-slate-900">{data.weatherEvent}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Hot Drink Uplift</p>
                <p className="text-2xl font-bold text-emerald-600">+{data.hotDrinkUplift}%</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Price Elasticity</p>
                <p className="text-2xl font-bold text-slate-900">{data.priceElasticity}</p>
              </div>
            </div>
          </div>

          {/* Agent Reasoning */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">🤖</span>
              <div>
                <h4 className="font-bold text-emerald-900 mb-2">Agent Reasoning</h4>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  {data.agentReasoning}
                </p>
              </div>
            </div>
          </div>

          {/* Demand vs Temperature Chart */}
          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-slate-900">Demand vs Temperature Today</h3>
              <p className="text-sm text-slate-500 mt-1">{selectedSku} — Hourly pattern</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.demandVsTemp}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="demand" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div>
          {/* Recommendation Box */}
          <div className="bg-gradient-to-br from-teal-700 to-teal-900 p-6 rounded-lg text-white shadow-lg sticky top-8">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Recommended Action</p>
            <div className="text-4xl font-bold mb-2">{data.recommendedAction}</div>
            <p className="text-sm font-medium mb-6 pb-6 border-b border-white/20">{data.priceRange}</p>

            <div className="space-y-4">
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wide mb-1">Revenue upside</p>
                <p className="text-lg font-bold">{data.revenueUpside}</p>
              </div>
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wide mb-1">Confidence</p>
                <p className="text-lg font-bold">{data.confidence.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wide mb-1">Duration</p>
                <p className="text-lg font-bold">{data.duration}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
