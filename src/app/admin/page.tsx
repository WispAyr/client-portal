'use client'

import { useState, useEffect } from 'react'
import { Users, CreditCard, MessageSquare, PoundSterling } from 'lucide-react'

interface Stats {
  totalClients: number
  activeSubscriptions: number
  openTickets: number
  revenue: number
}

const statCards = [
  {
    key: 'totalClients' as const,
    label: 'Total Clients',
    icon: Users,
    accent: '#3B82F6',
  },
  {
    key: 'activeSubscriptions' as const,
    label: 'Active Subscriptions',
    icon: CreditCard,
    accent: '#10B981',
  },
  {
    key: 'openTickets' as const,
    label: 'Open Tickets',
    icon: MessageSquare,
    accent: '#F59E0B',
  },
  {
    key: 'revenue' as const,
    label: 'Revenue',
    icon: PoundSterling,
    accent: '#8B5CF6',
  },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatValue = (key: string, value: number) => {
    if (key === 'revenue') return `\u00A3${value.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`
    return value.toString()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-6 animate-pulse"
              style={{ backgroundColor: '#1E293B', height: 140 }}
            />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.key}
                className="rounded-xl p-6 border border-slate-700"
                style={{ backgroundColor: '#1E293B' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${card.accent}20` }}
                  >
                    <Icon size={20} style={{ color: card.accent }} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatValue(card.key, stats[card.key])}
                </p>
                <p className="text-sm text-slate-400 mt-1">{card.label}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-slate-400">Failed to load stats.</p>
      )}
    </div>
  )
}
