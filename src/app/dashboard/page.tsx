'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  FileText,
  MessageSquare,
  Shield,
} from 'lucide-react';

interface DashboardData {
  stats: {
    activeSubscriptions: number;
    pendingInvoices: number;
    openTickets: number;
  };
  recentActivity: Array<{
    type: 'invoice' | 'ticket';
    id: string;
    description: string;
    status: string;
    date: string;
  }>;
}

interface Subscription {
  id: string;
  status: string;
  product: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
    description: string;
  };
}

interface UserInfo {
  name: string;
  email: string;
  companyName?: string;
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then((r) => r.json()),
      fetch('/api/subscriptions').then((r) => r.json()),
      fetch('/api/auth/me').then((r) => r.json()),
    ])
      .then(([dashData, subData, userData]) => {
        setDashboard(dashData);
        setSubscriptions(subData.subscriptions || []);
        setUser(userData.user);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Active Products',
      value: dashboard?.stats.activeSubscriptions ?? 0,
      icon: Package,
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      label: 'Pending Invoices',
      value: dashboard?.stats.pendingInvoices ?? 0,
      icon: FileText,
      color: 'bg-yellow-500/20 text-yellow-400',
    },
    {
      label: 'Open Tickets',
      value: dashboard?.stats.openTickets ?? 0,
      icon: MessageSquare,
      color: 'bg-green-500/20 text-green-400',
    },
    {
      label: 'Account Status',
      value: 'Active',
      icon: Shield,
      color: 'bg-purple-500/20 text-purple-400',
      isText: true,
    },
  ];

  function statusColor(status: string) {
    switch (status) {
      case 'PAID':
      case 'RESOLVED':
      case 'ACTIVE':
        return 'bg-green-500/20 text-green-400';
      case 'PENDING':
      case 'IN_PROGRESS':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'OVERDUE':
        return 'bg-red-500/20 text-red-400';
      case 'OPEN':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome back, {user?.name || 'User'}
        </h2>
        <p className="text-slate-400 mt-1">
          Here&apos;s an overview of your account.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#1E293B] rounded-xl p-6 flex items-start gap-4"
            >
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.color}`}
              >
                <Icon size={22} />
              </div>
              <div>
                <p
                  className={`text-2xl font-bold text-white ${
                    stat.isText ? 'text-lg' : ''
                  }`}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscribed Products */}
      {subscriptions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Your Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#1E293B] rounded-xl p-5 flex items-center gap-4"
              >
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: sub.product.color + '20' }}
                >
                  {sub.product.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {sub.product.name}
                  </p>
                  <p className="text-sm text-slate-400">
                    {sub.product.description}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(
                    sub.status
                  )}`}
                >
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {dashboard?.recentActivity && dashboard.recentActivity.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Activity
          </h3>
          <div className="bg-[#1E293B] rounded-xl divide-y divide-slate-700">
            {dashboard.recentActivity.slice(0, 8).map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="px-5 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      item.type === 'invoice'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {item.type === 'invoice' ? (
                      <FileText size={14} />
                    ) : (
                      <MessageSquare size={14} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">
                      {item.description}
                    </p>
                    <p className="text-xs text-slate-400">
                      {item.type === 'invoice' ? 'Invoice' : 'Ticket'} -{' '}
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-3 ${statusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
