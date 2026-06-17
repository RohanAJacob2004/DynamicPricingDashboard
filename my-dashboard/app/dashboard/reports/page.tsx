'use client';

import { revenueByCategory, monthlySales } from '@/lib/data';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#10b981', '#0f1b2d', '#0f6b6b', '#0db8a8', '#64748b', '#cbd5e1'];

const salesData = [
  { month: 'Aug', actual: 42000, target: 40000 },
  { month: 'Sep', actual: 55000, target: 50000 },
  { month: 'Oct', actual: 48000, target: 52000 },
  { month: 'Nov', actual: 68000, target: 60000 },
  { month: 'Dec', actual: 78000, target: 70000 },
  { month: 'Jan', actual: 65000, target: 65000 },
  { month: 'Feb', actual: 72000, target: 70000 },
];

const revenueFormatted = revenueByCategory.map(cat => ({
  ...cat,
  displayName: cat.category,
  value: cat.revenue
}));

export default function ReportsPage() {
  const stats = [
    { label: 'Total Revenue (MTD)', value: '$63,240', icon: '$', change: '+8.2%', changeColor: 'text-emerald-500' },
    { label: 'Orders Processed', value: '4,821', icon: '🛒', change: '+12.4%', changeColor: 'text-emerald-500' },
    { label: 'Avg Basket Value', value: '$13.11', icon: '📊', change: '-1.2%', changeColor: 'text-rose-500' },
    { label: 'Price Accuracy', value: '94.3%', icon: '📈', change: '+2.1%', changeColor: 'text-emerald-500' },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f5f5f5] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">Reports & Analytics</h1>
          <p className="text-[#64748b] mt-1">Performance metrics and revenue breakdown</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600">⚙️</button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-lg border border-slate-100 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</span>
              <span className={`text-base font-semibold ${stat.changeColor}`}>{stat.change}</span>
            </div>
            <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sales Overview */}
        <div className="col-span-7 bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 text-base">Sales Overview</h3>
            <p className="text-sm text-slate-500 mt-1">Actual vs Target – last 7 months</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#ffffff' }}
                formatter={(value) => `$${(value as number).toLocaleString()}`}
              />
              <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
              <Line type="monotone" dataKey="target" stroke="#0f1b2d" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-600">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-slate-900"></div>
              <span className="text-slate-600">Target</span>
            </div>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="col-span-5 bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 text-base">Revenue by Category</h3>
            <p className="text-sm text-slate-500 mt-1">Current month distribution</p>
          </div>
          <div className="flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueFormatted}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="displayName"
                >
                  {revenueFormatted.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 text-sm">
            {revenueFormatted.map((cat, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-slate-600">{cat.displayName}</span>
                </div>
                <span className="font-semibold text-slate-900">32%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance Summary */}
      <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base">Agent Performance Summary</h3>
      </div>
    </div>
  );
}
