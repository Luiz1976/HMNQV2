import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params

    // Buscar o resultado do teste
    const testResult = await db.testResult.findFirst({
      where: {
        id: id,
        userId: session.user.id
      },
      include: {
        test: {
          select: {
            id: true,
            name: true,
            testType: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    if (!testResult) {
      return NextResponse.json(
        { error: 'Resultado não encontrado' },
        { status: 404 }
      )
    }

    // Retornar o resultado formatado
    return NextResponse.json({
      id: testResult.id,
      userId: testResult.userId,
      testId: testResult.testId,
      test: testResult.test,
      user: testResult.user,
      overallScore: testResult.overallScore,
      dimensionScores: testResult.dimensionScores,
      metadata: testResult.metadata,
      interpretation: testResult.interpretation,
      completedAt: testResult.completedAt,
      createdAt: testResult.createdAt,
      updatedAt: testResult.updatedAt
    })

  } catch (error) {
    console.error('Erro ao buscar resultado do teste:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}