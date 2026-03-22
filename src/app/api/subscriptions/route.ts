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

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: user.id },
    include: { product: true },
  })

  return NextResponse.json({ subscriptions })
}
