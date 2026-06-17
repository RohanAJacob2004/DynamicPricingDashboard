'use client';

import { useState } from 'react';
import { calendarAgentData } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const calendarDetails: Record<string, any> = {
  'SKU-7230': {
    productName: 'Almond Milk 1L',
    upcomingEvent: 'Sustainability Week',
    daysUntilEvent: 8,
    historicalUplift: 22.5,
    confidenceScore: 0.89,
    eventDescription: 'Plant-based promotion focusing on sustainability-conscious shoppers',
    agentReasoning: 'Historical data indicates a consistent demand spike of +22.5% in the 7-day window preceding major promotional events. With Sustainability Week 8 days out, the Calendar Agent recommends a gradual price increase peaking on the event start date to capture early adopters. Confidence rated 0.89 based on 12 prior event cycles.',
    priceTrajectory: [
      { day: 'Mon', recommended: 3.49, baseline: 3.29 },
      { day: 'Tue', recommended: 3.58, baseline: 3.29 },
      { day: 'Wed', recommended: 3.65, baseline: 3.29 },
      { day: 'Thu', recommended: 3.72, baseline: 3.29 },
      { day: 'Fri', recommended: 3.79, baseline: 3.29 },
      { day: 'Sat', recommended: 3.85, baseline: 3.29 },
      { day: 'Sun', recommended: 3.68, baseline: 3.29 },
    ]
  },
  'SKU-1042': {
    productName: 'Cold Brew Coffee 12oz',
    upcomingEvent: 'Super Bowl Weekend',
    daysUntilEvent: 5,
    historicalUplift: 18.4,
    confidenceScore: 0.91,
    eventDescription: 'Major sporting event driving entertainment and gathering-related consumption',
    agentReasoning: 'Historical data indicates a consistent demand spike of +18.4% in the 7-day window preceding major sporting events. With Super Bowl Weekend 5 days out, the Calendar Agent recommends a graduated price increase peaking on Friday-Saturday (+32%) and normalizing Sunday evening. Confidence rated 0.91 based on 6 prior event cycles.',
    priceTrajectory: [
      { day: 'Mon', recommended: 3.99, baseline: 3.75 },
      { day: 'Tue', recommended: 4.08, baseline: 3.75 },
      { day: 'Wed', recommended: 4.18, baseline: 3.75 },
      { day: 'Thu', recommended: 4.45, baseline: 3.75 },
      { day: 'Fri', recommended: 4.85, baseline: 3.75 },
      { day: 'Sat', recommended: 4.95, baseline: 3.75 },
      { day: 'Sun', recommended: 4.45, baseline: 3.75 },
    ]
  }
};

export default function CalendarAgentPage() {
  const [selectedSku, setSelectedSku] = useState('SKU-1042');
  const data = calendarDetails[selectedSku];

  return (
    <div className="p-8 space-y-6 bg-[#f5f5f5] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white text-lg">📅</div>
            <div>
              <h1 className="text-3xl font-bold text-[#0f172a]">Calendar Agent</h1>
              <p className="text-[#64748b] text-sm">Date & event-driven price optimization</p>
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
            {Object.entries(calendarDetails).map(([sku, details]) => (
              <option key={sku} value={sku}>{sku} · {details.productName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Justification Card */}
      <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-1 h-6 bg-teal-600 rounded"></div>
          <h3 className="font-bold text-slate-900">Justification Card — {selectedSku}</h3>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-teal-600">📅</span>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">Upcoming Event</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{data.upcomingEvent}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-teal-600">⏱️</span>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">Days Until Event</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{data.daysUntilEvent} days</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-teal-600">📈</span>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">Historical Uplift</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">+{data.historicalUplift}%</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-teal-600">⭐</span>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">Confidence Score</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{data.confidenceScore.toFixed(2)}</p>
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

      {/* 7-Day Price Trajectory */}
      <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="font-bold text-slate-900">7-Day Price Trajectory</h3>
          <p className="text-sm text-slate-500 mt-1">Recommended vs Baseline — {selectedSku}</p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.priceTrajectory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value.toFixed(2)}`} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => `$${(value as number).toFixed(2)}`}
              cursor={false}
            />
            <Line
              type="monotone"
              dataKey="recommended"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              name="Recommended"
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#0f1b2d"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Baseline"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
