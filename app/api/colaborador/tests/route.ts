import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userTests = await prisma.test.findMany({
      where: {
        category: {
          name: 'Testes Psicossociais'
        }
      },
      include: {
        sessions: {
          where: {
            userId: session.user.id
          },
          orderBy: {
            completedAt: 'desc'
          },
          take: 1,
          include: {
            result: true
          }
        }
      }
    })

    const formattedTests = userTests.map(test => {
      const session = test.sessions[0]
      let status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' = 'NOT_STARTED'
      if (session) {
        if (session.status === 'COMPLETED') {
          status = 'COMPLETED'
        } else {
          status = 'IN_PROGRESS'
        }
      }

      return {
        id: test.id,
        name: test.name,
        description: test.description,
        estimatedDuration: test.estimatedDuration,
        status,
        progress: session ? (session.currentQuestion / session.totalQuestions) * 100 : 0,
        lastAttempt: session?.completedAt?.toISOString(),
        result: session?.result ? {
          overallScore: session.result.overallScore,
          riskLevel: session.result.riskLevel
        } : undefined
      }
    })

    return NextResponse.json(formattedTests)
  } catch (error) {
    console.error('Error fetching psychosocial tests:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}