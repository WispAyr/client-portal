'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Calendar, DollarSign } from 'lucide-react';

interface Subscription {
  id: string;
  status: string;
  renewalDate: string;
  product: {
    id: string;
    name: string;
    icon: string;
    color: string;
    monthlyPrice: number;
  };
}

interface Invoice {
  id: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  paidAt: string | null;
}

export default function BillingPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/subscriptions').then((r) => r.json()),
      fetch('/api/invoices').then((r) => r.json()),
    ])
      .then(([subData, invData]) => {
        setSubscriptions(subData.subscriptions || []);
        setInvoices(invData.invoices || []);
      })
      .finally(() => setLoading(false));
  }, []);

  function statusBadge(status: string) {
    switch (status) {
      case 'PAID':
        return 'bg-green-500/20 text-green-400';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'OVERDUE':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Billing</h2>
        <p className="text-slate-400 mt-1">
          Manage your subscriptions and view invoices.
        </p>
      </div>

      {/* Subscription Summary */}
      {subscriptions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Active Subscriptions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#1E293B] rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: sub.product.color + '20',
                    }}
                  >
                    {sub.product.icon}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {sub.product.name}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        sub.status === 'ACTIVE'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-slate-400">Renewal:</span>
                    <span className="text-slate-300">
                      {new Date(sub.renewalDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={14} className="text-slate-400" />
                    <span className="text-slate-400">Monthly:</span>
                    <span className="text-white font-medium">
                      ${sub.product.monthlyPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Invoices</h3>
        {invoices.length === 0 ? (
          <div className="bg-[#1E293B] rounded-xl p-8 text-center">
            <CreditCard
              size={40}
              className="text-slate-500 mx-auto mb-3"
            />
            <p className="text-slate-400">No invoices found.</p>
          </div>
        ) : (
          <div className="bg-[#1E293B] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-sm font-medium text-slate-400 px-5 py-3">
                      Description
                    </th>
                    <th className="text-left text-sm font-medium text-slate-400 px-5 py-3">
                      Amount
                    </th>
                    <th className="text-left text-sm font-medium text-slate-400 px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-sm font-medium text-slate-400 px-5 py-3">
                      Date
                    </th>
                    <th className="text-left text-sm font-medium text-slate-400 px-5 py-3">
                      Paid Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, idx) => (
                    <tr
                      key={invoice.id}
                      className={`border-b border-slate-700/50 ${
                        idx % 2 === 1 ? 'bg-slate-800/30' : ''
                      }`}
                    >
                      <td className="px-5 py-3 text-sm text-white">
                        {invoice.description}
                      </td>
                      <td className="px-5 py-3 text-sm text-white font-medium">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-300">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-300">
                        {invoice.paidAt
                          ? new Date(invoice.paidAt).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
