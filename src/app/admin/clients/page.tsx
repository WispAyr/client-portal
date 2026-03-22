'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'

interface Client {
  id: string
  name: string
  companyName: string | null
  email: string
  subscriptions: { id: string }[]
  createdAt: string
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/clients')
      .then((res) => res.json())
      .then((data) => setClients(data))
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Users size={16} />
          <span>{clients.length} total</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No clients found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Subscriptions
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr
                  key={client.id}
                  onClick={() => router.push(`/admin/clients/${client.id}`)}
                  className="border-b border-slate-700/50 cursor-pointer hover:bg-slate-700/30 transition-colors"
                  style={{
                    backgroundColor: index % 2 === 1 ? 'rgba(30, 41, 59, 0.5)' : 'transparent',
                  }}
                >
                  <td className="px-6 py-4 text-sm text-white font-medium">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{client.companyName || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{client.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#3B82F620', color: '#3B82F6' }}
                    >
                      {client.subscriptions?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{formatDate(client.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
