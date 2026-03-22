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

  const tickets = await prisma.ticket.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          companyName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ tickets })
}
