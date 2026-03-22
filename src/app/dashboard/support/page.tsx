'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MessageSquare, X } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  category: string | null;
  createdAt: string;
}

const priorityColors: Record<string, string> = {
  LOW: 'bg-slate-500/20 text-slate-400',
  MEDIUM: 'bg-blue-500/20 text-blue-400',
  HIGH: 'bg-orange-500/20 text-orange-400',
  CRITICAL: 'bg-red-500/20 text-red-400',
};

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-500/20 text-blue-400',
  IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400',
  RESOLVED: 'bg-green-500/20 text-green-400',
  CLOSED: 'bg-slate-500/20 text-slate-400',
};

export default function SupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  function fetchTickets() {
    fetch('/api/tickets')
      .then((r) => r.json())
      .then((data) => setTickets(data.tickets || []))
      .finally(() => setLoading(false));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          description,
          priority,
          category: category || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create ticket');
        return;
      }

      const data = await res.json();
      setTickets((prev) => [data.ticket, ...prev]);
      setShowForm(false);
      setSubject('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Support</h2>
          <p className="text-slate-400 mt-1">
            Create and manage your support tickets.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors text-sm"
        >
          <Plus size={16} />
          Create Ticket
        </button>
      </div>

      {/* Create Ticket Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Create Support Ticket
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent resize-none"
                  placeholder="Provide details about your issue..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="BILLING">Billing</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="ACCOUNT">Account</option>
                    <option value="PRODUCT">Product</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-slate-600 text-slate-300 hover:text-white font-medium rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket List */}
      {tickets.length === 0 ? (
        <div className="bg-[#1E293B] rounded-xl p-8 text-center">
          <MessageSquare
            size={40}
            className="text-slate-500 mx-auto mb-3"
          />
          <p className="text-slate-400">No support tickets yet.</p>
          <p className="text-slate-500 text-sm mt-1">
            Click &quot;Create Ticket&quot; to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => router.push(`/dashboard/support/${ticket.id}`)}
              className="w-full bg-[#1E293B] rounded-xl p-5 text-left hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="text-white font-medium truncate">
                    {ticket.subject}
                  </h4>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        statusColors[ticket.status] || statusColors.OPEN
                      }`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        priorityColors[ticket.priority] ||
                        priorityColors.MEDIUM
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    {ticket.category && (
                      <span className="text-xs text-slate-500">
                        {ticket.category}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-500 shrink-0">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
