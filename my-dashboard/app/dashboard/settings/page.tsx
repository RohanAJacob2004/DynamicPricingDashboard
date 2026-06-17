'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Store Profile' },
    { id: 'staff', label: 'Staff Data' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: '#1E293B' }}>Settings</h1>

      <div className="flex gap-1 bg-white rounded-lg p-1" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)', width: 'fit-content' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors"
            style={{
              background: activeTab === tab.id ? '#2563EB' : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : '#475569',
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) (e.target as HTMLElement).style.background = '#F8FAFC';
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) (e.target as HTMLElement).style.background = 'transparent';
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="theme-card p-6">
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1E293B' }}>Store Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Store Name', value: 'FreshMart Downtown' },
                { label: 'Store ID', value: 'ST-001' },
                { label: 'Location', value: '123 Main Street, Downtown' },
                { label: 'Contact', value: '+1 (555) 123-4567' },
                { label: 'Store Type', value: 'Supermarket' },
                { label: 'Operating Hours', value: '07:00 - 22:00' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs mb-1" style={{ color: '#94A3B8' }}>{f.label}</label>
                  <p className="font-medium" style={{ color: '#1E293B' }}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1E293B' }}>Staff Data</h3>
            <div className="overflow-x-auto">
              <table className="theme-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'EMP-001', name: 'John Smith', role: 'Store Manager', dept: 'Management' },
                    { id: 'EMP-002', name: 'Sarah Johnson', role: 'Assistant Manager', dept: 'Management' },
                    { id: 'EMP-003', name: 'Mike Williams', role: 'Cashier', dept: 'Sales' },
                    { id: 'EMP-004', name: 'Emily Davis', role: 'Stock Clerk', dept: 'Inventory' },
                    { id: 'EMP-005', name: 'David Brown', role: 'Pricing Specialist', dept: 'Pricing' },
                  ].map(staff => (
                    <tr key={staff.id}>
                      <td style={{ color: '#475569' }}>{staff.id}</td>
                      <td style={{ fontWeight: 500 }}>{staff.name}</td>
                      <td style={{ color: '#475569' }}>{staff.role}</td>
                      <td style={{ color: '#475569' }}>{staff.dept}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1E293B' }}>Alerts</h3>
            <div className="space-y-3">
              {[
                { level: 'high', msg: 'Organic Bananas stock expiring tomorrow - markdown required' },
                { level: 'medium', msg: 'Competitor price drop detected on Dairy products' },
                { level: 'low', msg: 'Seasonal weather alert: Heatwave expected next week' },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border text-sm"
                  style={{
                    background: alert.level === 'high' ? '#FEE2E2' : alert.level === 'medium' ? '#FEF3C7' : '#DBEAFE',
                    borderColor: alert.level === 'high' ? '#DC2626' : alert.level === 'medium' ? '#D97706' : '#2563EB',
                    color: alert.level === 'high' ? '#DC2626' : alert.level === 'medium' ? '#D97706' : '#2563EB',
                  }}
                >
                  <span className="font-bold uppercase text-xs mr-2">[{alert.level}]</span>
                  {alert.msg}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1E293B' }}>Security</h3>
            <div className="space-y-4">
              {[
                { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security', badge: 'Enabled', badgeColor: '#16A34A', badgeBg: '#DCFCE7' },
                { title: 'Session Timeout', desc: 'Auto-logout after inactivity', value: '30 minutes' },
                { title: 'Last Password Change', desc: 'Update your password regularly', value: '15 days ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#F8FAFC' }}>
                  <div>
                    <p className="font-medium" style={{ color: '#1E293B' }}>{item.title}</p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>{item.desc}</p>
                  </div>
                  {item.badge ? (
                    <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: item.badgeBg, color: item.badgeColor }}>
                      {item.badge}
                    </span>
                  ) : (
                    <span className="text-sm" style={{ color: '#475569' }}>{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
