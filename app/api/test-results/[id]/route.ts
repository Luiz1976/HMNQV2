// HumaniQ AI - API de Resultado de Teste Específico
// Operações RESTful para um resultado específico por ID

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Schema de validação para atualização parcial
const patchTestResultSchema = z.object({
  overallScore: z.number().optional(),
  dimensionScores: z.any().optional(),
  interpretation: z.string().optional(),
  recommendations: z.string().optional(),
  metadata: z.any().optional()
})

// GET - Obter resultado específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /test-results/[id]] GET - Acesso negado - usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params
    const { searchParams } = new URL(request.url)
    const includeAI = searchParams.get('includeAI') === 'true'
    const includeAnswers = searchParams.get('includeAnswers') === 'true'

    // Buscar resultado específico
    const testResult = await db.testResult.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        test: {
          include: {
            category: {
              select: {
                name: true,
                color: true,
                icon: true
              }
            },
            questions: includeAnswers
          }
        },
        session: {
          include: {
            answers: includeAnswers ? {
              include: {
                question: true
              },
              orderBy: {
                createdAt: 'asc'
              }
            } : false
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        aiAnalyses: includeAI ? {
          orderBy: {
            createdAt: 'desc'
          }
        } : false
      }
    })

    if (!testResult) {
      console.log(`[API /test-results/[id]] GET - Resultado não encontrado: ${id}`)
      return NextResponse.json(
        { error: 'Resultado não encontrado' },
        { status: 404 }
      )
    }

    console.log(`[API /test-results/[id]] GET - Resultado encontrado: ${id}`)

    // Importar dados dos subtipos se for teste do Eneagrama
    let subtypeData = null
    const metadata = testResult.metadata as any
    if (testResult.test.testType === 'PERSONALITY' && metadata?.subtype) {
      try {
        const { getSubtypeByCode } = await import('@/data/enneagram-subtypes')
        subtypeData = getSubtypeByCode(metadata.subtype.code)
      } catch (error) {
        console.log('Erro ao carregar dados do subtipo:', error)
      }
    }

    // Formatar resposta
    const response = {
      id: testResult.id,
      test: {
        id: testResult.test.id,
        name: testResult.test.name,
        description: testResult.test.description,
        testType: testResult.test.testType,
        estimatedDuration: testResult.test.estimatedDuration,
        category: testResult.test.category,
        questions: includeAnswers ? testResult.test.questions : undefined
      },
      session: {
        id: testResult.session.id,
        startedAt: testResult.session.startedAt,
        completedAt: testResult.session.completedAt,
        status: testResult.session.status,
        timeSpent: testResult.session.timeSpent,
        answers: includeAnswers ? testResult.session.answers?.map(answer => ({
          id: answer.id,
          questionId: answer.questionId,
          question: 'question' in answer ? answer.question : undefined,
          answerValue: answer.answerValue,
          timeSpent: answer.timeSpent,
          isSkipped: answer.isSkipped,
          createdAt: answer.createdAt
        })) : undefined
      },
      user: testResult.user,
      completedAt: testResult.completedAt,
      duration: testResult.duration,
      overallScore: testResult.overallScore,
      dimensionScores: testResult.dimensionScores,
      interpretation: testResult.interpretation,
      recommendations: testResult.recommendations,
      metadata: testResult.metadata,
      subtype: subtypeData, // Dados detalhados do subtipo
      createdAt: testResult.createdAt,
      updatedAt: testResult.updatedAt,
      aiAnalyses: includeAI ? testResult.aiAnalyses?.map(analysis => ({
        id: analysis.id,
        analysisType: analysis.analysisType,
        analysis: analysis.analysis,
        confidence: analysis.confidence,
        metadata: analysis.metadata,
        createdAt: analysis.createdAt
      })) : undefined
    }

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /test-results/[id]] GET - Erro ao buscar resultado:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// PATCH - Atualização parcial do resultado
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /test-results/[id]] PATCH - Acesso negado - usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    
    // Validar dados de entrada
    const validationResult = patchTestResultSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('[API /test-results/[id]] PATCH - Dados inválidos:', validationResult.error.errors)
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    // Verificar se o resultado existe e pertence ao usuário
    const existingResult = await db.testResult.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingResult) {
      console.log(`[API /test-results/[id]] PATCH - Resultado não encontrado: ${id}`)
      return NextResponse.json(
        { error: 'Resultado não encontrado ou não autorizado' },
        { status: 404 }
      )
    }

    // Filtrar apenas campos que foram fornecidos
    const updateData = Object.fromEntries(
      Object.entries(validationResult.data).filter(([_, value]) => value !== undefined)
    )

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo válido fornecido para atualização' },
        { status: 400 }
      )
    }

    // Atualizar resultado
    const updatedResult = await db.testResult.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        test: {
          select: {
            id: true,
            name: true,
            description: true,
            testType: true
          }
        },
        session: {
          select: {
            id: true,
            startedAt: true,
            status: true
          }
        }
      }
    })

    console.log(`[API /test-results/[id]] PATCH - Resultado atualizado com sucesso: ${id}`)
    console.log(`[API /test-results/[id]] PATCH - Campos atualizados:`, Object.keys(updateData))

    return NextResponse.json({
      success: true,
      data: {
        id: updatedResult.id,
        test: updatedResult.test,
        session: updatedResult.session,
        completedAt: updatedResult.completedAt,
        duration: updatedResult.duration,
        overallScore: updatedResult.overallScore,
        dimensionScores: updatedResult.dimensionScores,
        interpretation: updatedResult.interpretation,
        recommendations: updatedResult.recommendations,
        metadata: updatedResult.metadata,
        updatedAt: updatedResult.updatedAt
      },
      updatedFields: Object.keys(updateData),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /test-results/[id]] PATCH - Erro ao atualizar resultado:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// DELETE - Deletar resultado específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /test-results/[id]] DELETE - Acesso negado - usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params

    // Verificar se o resultado existe e pertence ao usuário
    const existingResult = await db.testResult.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        aiAnalyses: true,
        test: {
          select: {
            name: true
          }
        }
      }
    })

    if (!existingResult) {
      console.log(`[API /test-results/[id]] DELETE - Resultado não encontrado: ${id}`)
      return NextResponse.json(
        { error: 'Resultado não encontrado ou não autorizado' },
        { status: 404 }
      )
    }

    // Deletar análises de IA relacionadas primeiro (devido às foreign keys)
    if (existingResult.aiAnalyses.length > 0) {
      await db.aIAnalysis.deleteMany({
        where: {
          testResultId: id
        }
      })
      console.log(`[API /test-results/[id]] DELETE - ${existingResult.aiAnalyses.length} análises de IA deletadas`)
    }

    // Deletar o resultado
    await db.testResult.delete({
      where: { id }
    })

    console.log(`[API /test-results/[id]] DELETE - Resultado deletado com sucesso: ${id} (${existingResult.test.name})`)

    return NextResponse.json({
      success: true,
      message: 'Resultado deletado com sucesso',
      deletedResult: {
        id: existingResult.id,
        testName: existingResult.test.name,
        completedAt: existingResult.completedAt
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /test-results/[id]] DELETE - Erro ao deletar resultado:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}