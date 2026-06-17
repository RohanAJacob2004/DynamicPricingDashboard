'use client';

import Link from 'next/link';

const agents = [
  { id: 1, name: 'Calendar Agent', humanTrustScore: 0.85 },
  { id: 2, name: 'Season Agent', humanTrustScore: 0.72 },
  { id: 3, name: 'Competitor Agent', humanTrustScore: 0.91 },
  { id: 4, name: 'Inventory Agent', humanTrustScore: 0.68 },
];

const agentIcons: Record<string, string> = {
  'Calendar Agent': '📅',
  'Season Agent': '🌤️',
  'Competitor Agent': '🏪',
  'Inventory Agent': '📦',
};

const agentRoutes: Record<string, string> = {
  'Calendar Agent': '/dashboard/agents/calendar',
  'Season Agent': '/dashboard/agents/season',
  'Competitor Agent': '/dashboard/agents/competitor',
  'Inventory Agent': '/dashboard/agents/inventory',
};

export default function AgentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#1E293B' }}>Pricing Agents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map(agent => (
          <Link
            key={agent.id}
            href={agentRoutes[agent.name]}
            className="theme-card p-5 transition-all hover:shadow-md flex items-center gap-4"
          >
            <span className="text-3xl">{agentIcons[agent.name]}</span>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: '#1E293B' }}>{agent.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs" style={{ color: '#94A3B8' }}>Trust Score:</span>
                <div className="progress-track flex-1 max-w-24">
                  <div
                    className={agent.humanTrustScore >= 0.8 ? 'progress-fill-success' : agent.humanTrustScore >= 0.6 ? 'progress-fill-warning' : 'progress-fill-danger'}
                    style={{ width: `${agent.humanTrustScore * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium" style={{ color: '#2563EB' }}>
                  {(agent.humanTrustScore * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <span className="text-xl" style={{ color: '#94A3B8' }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
