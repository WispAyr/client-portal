'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Building2, Calendar, Package, FileText, MessageSquare } from 'lucide-react'

interface Subscription {
  id: string
  status: string
  startDate: string
  renewalDate: string
  product: {
    name: string
    icon: string
    monthlyPrice: number
  }
}

interface Invoice {
  id: string
  amount: number
  status: string
  description: string
  createdAt: string
  paidAt: string | null
}

interface Ticket {
  id: string
  subject: string
  priority: string
  status: string
  category: string | null
  createdAt: string
}

interface Client {
  id: string
  name: string
  companyName: string | null
  email: string
  phone: string | null
  website: string | null
  address: string | null
  createdAt: string
  subscriptions: Subscription[]
  invoices: Invoice[]
  tickets: Ticket[]
}

export default function ClientDetail() {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    fetch('/api/admin/clients')
      .then((res) => res.json())
      .then((data: Client[]) => {
        const found = data.find((c) => c.id === id)
        if (found) setClient(found)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { bg: '#10B98120', text: '#10B981' }
      case 'PAID':
        return { bg: '#10B98120', text: '#10B981' }
      case 'PENDING':
        return { bg: '#F59E0B20', text: '#F59E0B' }
      case 'OVERDUE':
        return { bg: '#EF444420', text: '#EF4444' }
      case 'OPEN':
        return { bg: '#3B82F620', text: '#3B82F6' }
      case 'IN_PROGRESS':
        return { bg: '#F59E0B20', text: '#F59E0B' }
      case 'CLOSED':
        return { bg: '#6B728020', text: '#6B7280' }
      default:
        return { bg: '#6B728020', text: '#6B7280' }
    }
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return { bg: '#EF444420', text: '#EF4444' }
      case 'HIGH':
        return { bg: '#F59E0B20', text: '#F59E0B' }
      case 'MEDIUM':
        return { bg: '#3B82F620', text: '#3B82F6' }
      case 'LOW':
        return { bg: '#10B98120', text: '#10B981' }
      default:
        return { bg: '#6B728020', text: '#6B7280' }
    }
  }

  if (loading) {
    return (
      <div className="text-slate-400 text-center py-12">Loading client...</div>
    )
  }

  if (!client) {
    return (
      <div>
        <button
          onClick={() => router.push('/admin/clients')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Back to Clients
        </button>
        <p className="text-slate-400 text-center py-12">Client not found.</p>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => router.push('/admin/clients')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        Back to Clients
      </button>

      {/* Client Info Card */}
      <div
        className="rounded-xl p-6 border border-slate-700 mb-8"
        style={{ backgroundColor: '#1E293B' }}
      >
        <h1 className="text-2xl font-bold text-white mb-1">{client.name}</h1>
        {client.companyName && (
          <div className="flex items-center gap-2 text-slate-300 mb-4">
            <Building2 size={16} />
            <span>{client.companyName}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Mail size={16} />
            <span>{client.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Calendar size={16} />
            <span>Joined {formatDate(client.createdAt)}</span>
          </div>
          {client.phone && (
            <div className="text-slate-400 text-sm">{client.phone}</div>
          )}
        </div>
      </div>

      {/* Subscriptions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Package size={20} style={{ color: '#3B82F6' }} />
          Subscriptions ({client.subscriptions?.length || 0})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {client.subscriptions?.map((sub) => {
            const sc = statusColor(sub.status)
            return (
              <div
                key={sub.id}
                className="rounded-xl p-5 border border-slate-700"
                style={{ backgroundColor: '#1E293B' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sub.product.icon}</span>
                    <span className="text-white font-medium">{sub.product.name}</span>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: sc.bg, color: sc.text }}
                  >
                    {sub.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  {'\u00A3'}{sub.product.monthlyPrice.toFixed(2)}/mo
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Renews {formatDate(sub.renewalDate)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Invoices */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={20} style={{ color: '#3B82F6' }} />
          Invoices ({client.invoices?.length || 0})
        </h2>
        <div
          className="rounded-xl border border-slate-700 overflow-hidden"
          style={{ backgroundColor: '#1E293B' }}
        >
          {client.invoices?.length ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">
                    Description
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {client.invoices.map((inv) => {
                  const sc = statusColor(inv.status)
                  return (
                    <tr key={inv.id} className="border-b border-slate-700/50">
                      <td className="px-6 py-3 text-sm text-white">{inv.description}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">
                        {'\u00A3'}{inv.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-400">{formatDate(inv.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-slate-400">No invoices.</div>
          )}
        </div>
      </div>

      {/* Tickets */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare size={20} style={{ color: '#3B82F6' }} />
          Tickets ({client.tickets?.length || 0})
        </h2>
        <div
          className="rounded-xl border border-slate-700 overflow-hidden"
          style={{ backgroundColor: '#1E293B' }}
        >
          {client.tickets?.length ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">
                    Subject
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">
                    Priority
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {client.tickets.map((ticket) => {
                  const sc = statusColor(ticket.status)
                  const pc = priorityColor(ticket.priority)
                  return (
                    <tr key={ticket.id} className="border-b border-slate-700/50">
                      <td className="px-6 py-3 text-sm text-white">{ticket.subject}</td>
                      <td className="px-6 py-3">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: pc.bg, color: pc.text }}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-400">{formatDate(ticket.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-slate-400">No tickets.</div>
          )}
        </div>
      </div>
    </div>
  )
}
