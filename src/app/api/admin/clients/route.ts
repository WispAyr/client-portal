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

  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: {
      id: true,
      email: true,
      name: true,
      companyName: true,
      phone: true,
      createdAt: true,
      _count: {
        select: { subscriptions: true },
      },
      tickets: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          subject: true,
          status: true,
          priority: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ clients })
}
