import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'COMPANY'].includes(session.user?.userType || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tests = await prisma.test.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(tests)
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}