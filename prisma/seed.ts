import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.ticketMessage.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.passwordReset.deleteMany()
  await prisma.user.deleteMany()
  await prisma.product.deleteMany()

  // Create products
  const pitchup = await prisma.product.create({
    data: {
      name: 'PitchUp',
      slug: 'pitchup',
      icon: '\uD83D\uDE9A',
      color: 'orange',
      description: 'Mobile pitch management and allocation system',
      monthlyPrice: 149.99,
    },
  })

  const parkwise = await prisma.product.create({
    data: {
      name: 'Parkwise',
      slug: 'parkwise',
      icon: '\uD83C\uDD7F\uFE0F',
      color: 'blue',
      description: 'Smart parking solutions and management',
      monthlyPrice: 199.99,
    },
  })

  const sentryflow = await prisma.product.create({
    data: {
      name: 'SentryFlow',
      slug: 'sentryflow',
      icon: '\uD83D\uDCF9',
      color: 'red',
      description: 'Advanced video surveillance and monitoring',
      monthlyPrice: 249.99,
    },
  })

  const airwave = await prisma.product.create({
    data: {
      name: 'AirWave',
      slug: 'airwave',
      icon: '\uD83D\uDCE1',
      color: 'purple',
      description: 'High-performance wireless connectivity solutions',
      monthlyPrice: 179.99,
    },
  })

  const controllog = await prisma.product.create({
    data: {
      name: 'ControlLog',
      slug: 'controllog',
      icon: '\uD83D\uDCCB',
      color: 'green',
      description: 'Access control and activity logging platform',
      monthlyPrice: 129.99,
    },
  })

  const broadcastStudio = await prisma.product.create({
    data: {
      name: 'Broadcast Studio',
      slug: 'broadcast-studio',
      icon: '\uD83D\uDCFA',
      color: 'violet',
      description: 'Professional live streaming and broadcast platform',
      monthlyPrice: 299.99,
    },
  })

  const sentinel = await prisma.product.create({
    data: {
      name: 'Sentinel',
      slug: 'sentinel',
      icon: '\uD83D\uDEE1\uFE0F',
      color: 'orange',
      description: 'Comprehensive security monitoring system',
      monthlyPrice: 219.99,
    },
  })

  const venueguard = await prisma.product.create({
    data: {
      name: 'VenueGuard',
      slug: 'venueguard',
      icon: '\uD83C\uDFDF\uFE0F',
      color: 'teal',
      description: 'Complete venue management and security system',
      monthlyPrice: 349.99,
    },
  })

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@local-connect.uk',
      passwordHash: await hash('LocalConnect2026!', 12),
      role: 'ADMIN',
    },
  })

  const joanna = await prisma.user.create({
    data: {
      name: 'Joanna',
      email: 'joanna@joannaschippy.co.uk',
      passwordHash: await hash('password123', 12),
      role: 'CLIENT',
      companyName: "Joanna's Chippy",
    },
  })

  const kyle = await prisma.user.create({
    data: {
      name: 'Kyle Rise',
      email: 'kyle@parkwise.tech',
      passwordHash: await hash('password123', 12),
      role: 'CLIENT',
      companyName: 'Parkwise Technologies',
    },
  })

  const ayr = await prisma.user.create({
    data: {
      name: 'Ayr Racecourse',
      email: 'events@ayrracecourse.co.uk',
      passwordHash: await hash('password123', 12),
      role: 'CLIENT',
      companyName: 'Ayr Racecourse',
    },
  })

  // Create subscriptions (renewalDate = 30 days from now)
  const renewalDate = new Date()
  renewalDate.setDate(renewalDate.getDate() + 30)

  await prisma.subscription.create({
    data: {
      userId: joanna.id,
      productId: pitchup.id,
      status: 'ACTIVE',
      renewalDate,
    },
  })

  await prisma.subscription.create({
    data: {
      userId: kyle.id,
      productId: parkwise.id,
      status: 'ACTIVE',
      renewalDate,
    },
  })

  await prisma.subscription.create({
    data: {
      userId: kyle.id,
      productId: sentryflow.id,
      status: 'ACTIVE',
      renewalDate,
    },
  })

  await prisma.subscription.create({
    data: {
      userId: kyle.id,
      productId: sentinel.id,
      status: 'ACTIVE',
      renewalDate,
    },
  })

  await prisma.subscription.create({
    data: {
      userId: ayr.id,
      productId: venueguard.id,
      status: 'ACTIVE',
      renewalDate,
    },
  })

  await prisma.subscription.create({
    data: {
      userId: ayr.id,
      productId: broadcastStudio.id,
      status: 'ACTIVE',
      renewalDate,
    },
  })

  // Create invoices
  await prisma.invoice.create({
    data: {
      userId: joanna.id,
      amount: 149.99,
      status: 'PAID',
      description: 'PitchUp - Monthly',
      paidAt: new Date(),
    },
  })

  await prisma.invoice.create({
    data: {
      userId: kyle.id,
      amount: 199.99,
      status: 'PAID',
      description: 'Parkwise - Monthly',
      paidAt: new Date(),
    },
  })

  await prisma.invoice.create({
    data: {
      userId: kyle.id,
      amount: 249.99,
      status: 'PENDING',
      description: 'SentryFlow - Monthly',
    },
  })

  await prisma.invoice.create({
    data: {
      userId: ayr.id,
      amount: 349.99,
      status: 'PAID',
      description: 'VenueGuard - Monthly',
      paidAt: new Date(),
    },
  })

  await prisma.invoice.create({
    data: {
      userId: ayr.id,
      amount: 299.99,
      status: 'OVERDUE',
      description: 'Broadcast Studio - Monthly',
    },
  })

  // Create tickets with messages
  // Ticket 1: Joanna - PitchUp login issue
  const ticket1 = await prisma.ticket.create({
    data: {
      userId: joanna.id,
      subject: 'PitchUp login issue',
      description: "I can't log into the PitchUp dashboard since this morning.",
      priority: 'HIGH',
      status: 'OPEN',
      category: 'Technical',
    },
  })

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket1.id,
      userId: joanna.id,
      message: "I can't log into the PitchUp dashboard since this morning.",
      isStaff: false,
    },
  })

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket1.id,
      userId: adminUser.id,
      message: "We're looking into this. Can you try clearing your browser cache?",
      isStaff: true,
    },
  })

  // Ticket 2: Kyle - Parkwise sensor malfunction
  const ticket2 = await prisma.ticket.create({
    data: {
      userId: kyle.id,
      subject: 'Parkwise sensor malfunction',
      description: 'Sensor B-14 in zone 3 is reporting incorrect readings.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      category: 'Hardware',
    },
  })

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket2.id,
      userId: kyle.id,
      message: 'Sensor B-14 in zone 3 is reporting incorrect readings.',
      isStaff: false,
    },
  })

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket2.id,
      userId: adminUser.id,
      message: "We've dispatched a technician to check the sensor.",
      isStaff: true,
    },
  })

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket2.id,
      userId: kyle.id,
      message: 'Thanks, when should I expect them?',
      isStaff: false,
    },
  })

  // Ticket 3: Ayr - Broadcast delay during event
  const ticket3 = await prisma.ticket.create({
    data: {
      userId: ayr.id,
      subject: 'Broadcast delay during event',
      description: "We experienced a 30-second delay during Saturday's race broadcast.",
      priority: 'CRITICAL',
      status: 'OPEN',
      category: 'Streaming',
    },
  })

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket3.id,
      userId: ayr.id,
      message: "We experienced a 30-second delay during Saturday's race broadcast.",
      isStaff: false,
    },
  })

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket3.id,
      userId: adminUser.id,
      message: "We're investigating the latency issue with our streaming infrastructure.",
      isStaff: true,
    },
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
