import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: {
      messages: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          companyName: true,
        },
      },
    },
  })

  if (!ticket) {
    return NextResponse.json(
      { error: 'Ticket not found' },
      { status: 404 }
    )
  }

  if (ticket.userId !== user.id && user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Not authorized' },
      { status: 403 }
    )
  }

  return NextResponse.json({ ticket })
}
