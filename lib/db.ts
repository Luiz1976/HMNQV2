
// HumaniQ AI - Database Connection
// Prisma client with connection pooling

import { PrismaClient } from '@prisma/client'

declare global {
  var __db__: PrismaClient | undefined
}

// Initialize Prisma Client
export const db = globalThis.__db__ || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
})

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.__db__ = db
}

// Database utilities
export async function connectDB() {
  try {
    await db.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

export async function disconnectDB() {
  try {
    await db.$disconnect()
    console.log('✅ Database disconnected successfully')
  } catch (error) {
    console.error('❌ Database disconnection failed:', error)
    throw error
  }
}

// Transaction wrapper
export async function withTransaction<T>(
  fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
): Promise<T> {
  return await db.$transaction(fn)
}

// Health check
export async function checkDBHealth(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// Cleanup function for graceful shutdown
export async function cleanup() {
  await disconnectDB()
}

// Handle process termination
if (typeof process !== 'undefined') {
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
  process.on('beforeExit', cleanup)
}
