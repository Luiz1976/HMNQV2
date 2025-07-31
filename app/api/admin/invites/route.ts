
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invites = await prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        company: true,
        inviter: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        test: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(invites)
  } catch (error) {
    console.error('Error fetching invites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
