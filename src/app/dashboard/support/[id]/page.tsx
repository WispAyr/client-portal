'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';

interface TicketMessage {
  id: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

interface TicketDetail {
  id: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  category: string | null;
  createdAt: string;
  messages: TicketMessage[];
  user: {
    id: string;
    name: string;
    email: string;
    companyName: string | null;
  };
}

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-500/20 text-blue-400',
  IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400',
  RESOLVED: 'bg-green-500/20 text-green-400',
  CLOSED: 'bg-slate-500/20 text-slate-400',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-slate-500/20 text-slate-400',
  MEDIUM: 'bg-blue-500/20 text-blue-400',
  HIGH: 'bg-orange-500/20 text-orange-400',
  CRITICAL: 'bg-red-500/20 text-red-400',
};

export default function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/tickets/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => setTicket(data.ticket))
      .catch(() => router.push('/dashboard/support'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${params.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setTicket((prev) =>
          prev
            ? { ...prev, messages: [...prev.messages, data.message] }
            : prev
        );
        setMessage('');
      }
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Ticket not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => router.push('/dashboard/support')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        Back to tickets
      </button>

      {/* Ticket header */}
      <div className="bg-[#1E293B] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-3">
          {ticket.subject}
        </h2>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              statusColors[ticket.status] || statusColors.OPEN
            }`}
          >
            {ticket.status.replace('_', ' ')}
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              priorityColors[ticket.priority] || priorityColors.MEDIUM
            }`}
          >
            {ticket.priority}
          </span>
          {ticket.category && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-600/30 text-slate-300">
              {ticket.category}
            </span>
          )}
          <span className="text-xs text-slate-500">
            Created {new Date(ticket.createdAt).toLocaleDateString()} at{' '}
            {new Date(ticket.createdAt).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-slate-300 text-sm">{ticket.description}</p>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Messages</h3>

        {ticket.messages.length === 0 ? (
          <div className="bg-[#1E293B] rounded-xl p-6 text-center">
            <p className="text-slate-400 text-sm">
              No messages yet. Send a reply below.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ticket.messages.map((msg) => {
              const isStaffMessage = msg.isStaff;
              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isStaffMessage ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-4 ${
                      isStaffMessage
                        ? 'bg-[#3B82F6]/20 border border-[#3B82F6]/30'
                        : 'bg-[#1E293B]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-sm font-medium ${
                          isStaffMessage ? 'text-blue-400' : 'text-white'
                        }`}
                      >
                        {msg.user.name}
                      </span>
                      {isStaffMessage && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          Staff
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reply form */}
      {ticket.status !== 'CLOSED' && (
        <form
          onSubmit={handleSendMessage}
          className="bg-[#1E293B] rounded-xl p-4"
        >
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your reply..."
            className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent resize-none"
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              <Send size={16} />
              {sending ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
