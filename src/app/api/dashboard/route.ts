import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const [activeSubscriptions, pendingInvoices, openTickets, recentInvoices, recentTickets] =
    await Promise.all([
      prisma.subscription.count({
        where: { userId: user.id, status: 'ACTIVE' },
      }),
      prisma.invoice.count({
        where: { userId: user.id, status: 'PENDING' },
      }),
      prisma.ticket.count({
        where: { userId: user.id, status: 'OPEN' },
      }),
      prisma.invoice.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.ticket.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

  const recentActivity = [
    ...recentInvoices.map((inv) => ({
      type: 'invoice' as const,
      id: inv.id,
      description: inv.description,
      status: inv.status,
      date: inv.createdAt,
    })),
    ...recentTickets.map((ticket) => ({
      type: 'ticket' as const,
      id: ticket.id,
      description: ticket.subject,
      status: ticket.status,
      date: ticket.createdAt,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return NextResponse.json({
    stats: {
      activeSubscriptions,
      pendingInvoices,
      openTickets,
    },
    recentActivity,
  })
}
