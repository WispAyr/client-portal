'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'

interface Message {
  id: string
  message: string
  isStaff: boolean
  createdAt: string
  user: {
    name: string
  }
}

interface Ticket {
  id: string
  subject: string
  priority: string
  status: string
  category: string | null
  createdAt: string
  user: {
    name: string
    companyName: string | null
  }
  messages: Message[]
}

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/tickets')
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const statusColor = (status: string) => {
    switch (status) {
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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Tickets</h1>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <MessageSquare size={16} />
          <span>{tickets.length} total</span>
        </div>
      </div>

      <div
        className="rounded-xl border border-slate-700 overflow-hidden"
        style={{ backgroundColor: '#1E293B' }}
      >
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No tickets found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Subject
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="w-10 px-4 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const sc = statusColor(ticket.status)
                const pc = priorityColor(ticket.priority)
                const isExpanded = expandedId === ticket.id
                return (
                  <>
                    <tr
                      key={ticket.id}
                      onClick={() => toggleExpand(ticket.id)}
                      className="border-b border-slate-700/50 cursor-pointer hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {ticket.user.name}
                        {ticket.user.companyName && (
                          <span className="text-slate-500 ml-1">({ticket.user.companyName})</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: pc.bg, color: pc.text }}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${ticket.id}-detail`}>
                        <td colSpan={6} className="px-6 py-4" style={{ backgroundColor: '#0F172A' }}>
                          <div className="space-y-3 max-w-2xl">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-2">
                              Messages ({ticket.messages?.length || 0})
                            </p>
                            {ticket.messages?.map((msg) => (
                              <div
                                key={msg.id}
                                className="rounded-lg p-3 border"
                                style={{
                                  backgroundColor: msg.isStaff ? '#1E3A5F' : '#1E293B',
                                  borderColor: msg.isStaff ? '#3B82F640' : '#334155',
                                }}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium" style={{ color: msg.isStaff ? '#3B82F6' : '#94A3B8' }}>
                                    {msg.user.name}
                                    {msg.isStaff && (
                                      <span className="text-xs ml-2 px-1.5 py-0.5 rounded" style={{ backgroundColor: '#3B82F620', color: '#3B82F6' }}>
                                        Staff
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-xs text-slate-500">{formatDateTime(msg.createdAt)}</span>
                                </div>
                                <p className="text-sm text-slate-300">{msg.message}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
