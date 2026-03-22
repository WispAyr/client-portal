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

  if (user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  const [totalClients, activeSubscriptions, openTickets, paidInvoices] =
    await Promise.all([
      prisma.user.count({
        where: { role: 'CLIENT' },
      }),
      prisma.subscription.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.ticket.count({
        where: { status: 'OPEN' },
      }),
      prisma.invoice.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
    ])

  return NextResponse.json({
    stats: {
      totalClients,
      activeSubscriptions,
      openTickets,
      totalRevenue: paidInvoices._sum.amount || 0,
    },
  })
}
