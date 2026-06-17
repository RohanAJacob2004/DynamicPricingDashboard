'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Zap,
  Calendar,
  TrendingUp,
  Package,
  Sun,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  {
    label: 'Agents',
    href: '/dashboard/agents',
    icon: Zap,
    subItems: [
      { label: 'Calendar', href: '/dashboard/agents/calendar', icon: Calendar },
      { label: 'Competitor', href: '/dashboard/agents/competitor', icon: TrendingUp },
      { label: 'Inventory', href: '/dashboard/agents/inventory', icon: Package },
      { label: 'Season', href: '/dashboard/agents/season', icon: Sun },
    ]
  },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedAgent, setExpandedAgent] = useState(false);

  const handleLogout = () => {
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen" style={{ background: '#f5f5f5' }}>
      <aside
        className={`${sidebarOpen ? 'w-72' : 'w-16'} flex flex-col transition-all duration-300 shrink-0`}
        style={{ background: '#1B5E5E' }}
      >
        <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-green-400 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-xl" style={{ color: '#ffffff' }}>
                  RetailPulse
                </h2>
                <p className="text-xs" style={{ color: '#7dd3c0' }}>AI</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 ">
          {navItems.map(item => {
            const active = isActive(item.href);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isAgentsSection = item.label === 'Agents';

            return (
              <div key={item.href}>
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      setExpandedAgent(!expandedAgent);
                    } else {
                      router.push(item.href);
                    }
                  }}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-lg transition-colors relative"
                  style={{
                    color: active || (expandedAgent && isAgentsSection) ? '#ffffff' : '#9db3c1',
                    background: active || (expandedAgent && isAgentsSection) ? '#2db8a8' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!active && !(expandedAgent && isAgentsSection)) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(45,184,168,0.1)';
                      (e.currentTarget as HTMLElement).style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active && !(expandedAgent && isAgentsSection)) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#9db3c1';
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </div>
                  {hasSubItems && sidebarOpen && (
                    <span>{expandedAgent ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span>
                  )}
                </button>

                {/* Sub-items for Agents */}
                {hasSubItems && expandedAgent && sidebarOpen && (
                  <div className="ml-2 mt-1 space-y-1 pb-2 border-l border-rgba(45,184,168,0.3)" style={{ borderLeft: '2px solid rgba(45,184,168,0.3)' }}>
                    {item.subItems.map(subItem => {
                      const subActive = isActive(subItem.href);
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                          style={{
                            color: subActive ? '#ffffff' : '#9db3c1',
                            background: subActive ? '#2db8a8' : 'transparent',
                            marginLeft: '8px'
                          }}
                          onMouseEnter={e => {
                            if (!subActive) {
                              (e.currentTarget as HTMLElement).style.background = 'rgba(45,184,168,0.1)';
                              (e.currentTarget as HTMLElement).style.color = '#ffffff';
                            }
                          }}
                          onMouseLeave={e => {
                            if (!subActive) {
                              (e.currentTarget as HTMLElement).style.background = 'transparent';
                              (e.currentTarget as HTMLElement).style.color = '#9db3c1';
                            }
                          }}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {sidebarOpen && (
            <div className="mb-3 px-2">
              <p className="text-xs" style={{ color: '#7dd3c0' }}>Logged in as</p>
              <p className="text-xs font-medium" style={{ color: '#9db3c1' }}>admin@retailpulse.ai</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: '#9db3c1' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.target as HTMLElement).style.color = '#ffffff'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = '#9db3c1'; }}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto" style={{ background: '#f5f5f5' }}>
        {children}
      </main>
    </div>
  );
}
