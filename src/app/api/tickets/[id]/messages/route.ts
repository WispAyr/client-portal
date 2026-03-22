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

  const messages = await prisma.ticketMessage.findMany({
    where: { ticketId: params.id },
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
  })

  return NextResponse.json({ messages })
}

export async function POST(
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

  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const ticketMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: params.id,
        userId: user.id,
        message,
        isStaff: user.role === 'ADMIN',
      },
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
    })

    return NextResponse.json({ message: ticketMessage }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
