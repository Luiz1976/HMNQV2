// HumaniQ AI - API de Gerenciamento de Resultados de Teste
// Rotas RESTful completas para CRUD de resultados de teste com persistência SQLite

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import TestResultArchiver from '@/archives/utils/archiver'

export const dynamic = 'force-dynamic'

// Schema de validação para criação de resultado
const createResultSchema = z.object({
  testId: z.string().min(1, 'ID do teste é obrigatório'),
  sessionId: z.string().min(1, 'ID da sessão é obrigatório'),
  duration: z.number().int().min(0, 'Duração deve ser positiva'),
  overallScore: z.number().min(0).max(100).optional(),
  dimensionScores: z.record(z.number()).optional(),
  interpretation: z.string().optional(),
  recommendations: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

// Schema de validação para atualização de resultado
const updateResultSchema = z.object({
  overallScore: z.number().min(0).max(100).optional(),
  dimensionScores: z.record(z.number()).optional(),
  interpretation: z.string().optional(),
  recommendations: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

// GET - Listar todos os resultados ou filtrar por testId
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /test-results] GET - Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('testId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'completedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const includeAnalysis = searchParams.get('includeAnalysis') === 'true'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Validar parâmetros de paginação
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Parâmetros de paginação inválidos' },
        { status: 400 }
      )
    }

    // Construir filtros
    const where: any = {
      userId: session.user.id
    }

    if (testId) {
      where.testId = testId
    }

    // Filtros de data
    if (dateFrom || dateTo) {
      where.completedAt = {}
      if (dateFrom) {
        where.completedAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.completedAt.lte = new Date(dateTo)
      }
    }

    // Construir ordenação
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Buscar resultados com paginação
    const [results, totalCount] = await Promise.all([
      db.testResult.findMany({
        where,
        include: {
          test: {
            select: {
              id: true,
              name: true,
              description: true,
              testType: true,
              estimatedDuration: true,
              category: {
                select: {
                  name: true,
                  color: true
                }
              }
            }
          },
          session: {
            select: {
              id: true,
              startedAt: true,
              completedAt: true,
              currentQuestion: true,
              totalQuestions: true,
              metadata: true
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
          aiAnalyses: includeAnalysis ? {
            select: {
              id: true,
              analysisType: true,
              analysis: true,
              confidence: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          } : false
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      db.testResult.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    // Calcular estatísticas básicas
    const stats = await db.testResult.aggregate({
      where,
      _avg: {
        overallScore: true,
        duration: true
      },
      _max: {
        overallScore: true,
        duration: true
      },
      _min: {
        overallScore: true,
        duration: true
      }
    })

    console.log(`[API /test-results] GET - Listados ${results.length} resultados para usuário ${session.user.id}`)

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      statistics: {
        averageScore: stats._avg.overallScore,
        averageDuration: stats._avg.duration,
        maxScore: stats._max.overallScore,
        minScore: stats._min.overallScore,
        maxDuration: stats._max.duration,
        minDuration: stats._min.duration
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /test-results] GET - Erro ao listar resultados:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor ao listar resultados',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Função auxiliar para arquivar resultado de teste
async function archiveTestResultFromAPI(testResult: any) {
  const archiver = new TestResultArchiver()
  
  // Converter resultado do Prisma para formato do arquivador
  const archiveData = {
    id: testResult.id,
    userId: testResult.userId,
    testType: (testResult.test?.testType?.toLowerCase().includes('bolie') ? 'personalidade' : testResult.test?.testType) || 'outros' as 'personalidade' | 'psicossociais' | 'outros',
    testId: testResult.testId,
    completedAt: testResult.completedAt || testResult.createdAt,
    score: testResult.overallScore,
    status: 'completed' as 'completed' | 'incomplete',
    sessionId: testResult.sessionId,
    overallScore: testResult.overallScore,
    dimensionScores: testResult.dimensionScores,
    interpretation: testResult.interpretation,
    recommendations: testResult.recommendations,
    metadata: testResult.metadata,
    createdAt: testResult.createdAt,
    updatedAt: testResult.updatedAt
  }
  
  await archiver.archiveTestResult(archiveData)
}

// POST - Criar novo resultado de teste
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /test-results] POST - Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validar dados de entrada
    const validationResult = createResultSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('[API /test-results] POST - Dados inválidos:', validationResult.error.errors)
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { testId, sessionId, duration, overallScore, dimensionScores, interpretation, recommendations, metadata } = validationResult.data

    // Verificar se o teste existe
    const test = await db.test.findUnique({
      where: { id: testId }
    })

    if (!test) {
      console.log(`[API /test-results] POST - Teste não encontrado: ${testId}`)
      return NextResponse.json(
        { error: 'Teste não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se a sessão existe e pertence ao usuário
    const testSession = await db.testSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
        testId
      }
    })

    if (!testSession) {
      console.log(`[API /test-results] POST - Sessão não encontrada: ${sessionId}`)
      return NextResponse.json(
        { error: 'Sessão de teste não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se já existe resultado para esta sessão
    const existingResult = await db.testResult.findFirst({
      where: {
        sessionId,
        userId: session.user.id
      }
    })

    if (existingResult) {
      console.log(`[API /test-results] POST - Resultado já existe para sessão: ${sessionId}`)
      return NextResponse.json(
        {
          error: 'Resultado já existe para esta sessão',
          existingResultId: existingResult.id
        },
        { status: 409 }
      )
    }

    // Criar novo resultado em transação
    const result = await db.$transaction(async (tx) => {
      // Criar resultado
      const newResult = await tx.testResult.create({
        data: {
          testId,
          sessionId,
          userId: session.user.id,
          duration,
          overallScore,
          dimensionScores,
          interpretation,
          recommendations,
          metadata,
          completedAt: new Date()
        },
        include: {
          test: {
            select: {
              id: true,
              name: true,
              description: true,
              testType: true,
              category: {
                select: {
                  name: true,
                  color: true
                }
              }
            }
          },
          session: {
            select: {
              id: true,
              startedAt: true,
              currentQuestion: true,
              totalQuestions: true
            }
          }
        }
      })

      // Atualizar status da sessão para COMPLETED
      await tx.testSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      return newResult
    })

    // Arquivar resultado automaticamente
    try {
      await archiveTestResultFromAPI(result)
    } catch (archiveError) {
      console.error('[API /test-results] POST - Erro ao arquivar resultado (não crítico):', archiveError)
      // Não interromper o fluxo principal se o arquivamento falhar
    }

    console.log(`[API /test-results] POST - Novo resultado criado: ${result.id} para teste ${testId}`)

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Resultado criado com sucesso',
      timestamp: new Date().toISOString()
    }, { status: 201 })

  } catch (error) {
    console.error('[API /test-results] POST - Erro ao criar resultado:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor ao criar resultado',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// PUT - Atualizar resultado existente
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /test-results] PUT - Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const resultId = searchParams.get('id')

    if (!resultId) {
      return NextResponse.json(
        { error: 'ID do resultado é obrigatório' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validar dados de entrada
    const validationResult = updateResultSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('[API /test-results] PUT - Dados inválidos:', validationResult.error.errors)
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
        id: resultId,
        userId: session.user.id
      }
    })

    if (!existingResult) {
      console.log(`[API /test-results] PUT - Resultado não encontrado: ${resultId}`)
      return NextResponse.json(
        { error: 'Resultado não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar resultado
    const updatedResult = await db.testResult.update({
      where: { id: resultId },
      data: {
        ...validationResult.data,
        updatedAt: new Date()
      },
      include: {
        test: {
          select: {
            id: true,
            name: true,
            description: true,
            testType: true,
            category: {
              select: {
                name: true,
                color: true
              }
            }
          }
        },
        session: {
          select: {
            id: true,
            startedAt: true,
            completedAt: true
          }
        }
      }
    })

    console.log(`[API /test-results] PUT - Resultado atualizado: ${resultId}`)

    return NextResponse.json({
      success: true,
      data: updatedResult,
      message: 'Resultado atualizado com sucesso',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /test-results] PUT - Erro ao atualizar resultado:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor ao atualizar resultado',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// PATCH - Atualização parcial de resultado
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /test-results] PATCH - Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const resultId = searchParams.get('id')

    if (!resultId) {
      return NextResponse.json(
        { error: 'ID do resultado é obrigatório' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Verificar se o resultado existe e pertence ao usuário
    const existingResult = await db.testResult.findFirst({
      where: {
        id: resultId,
        userId: session.user.id
      }
    })

    if (!existingResult) {
      console.log(`[API /test-results] PATCH - Resultado não encontrado: ${resultId}`)
      return NextResponse.json(
        { error: 'Resultado não encontrado' },
        { status: 404 }
      )
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {
      updatedAt: new Date()
    }

    if (body.overallScore !== undefined) {
      updateData.overallScore = body.overallScore
    }
    
    if (body.dimensionScores !== undefined) {
      updateData.dimensionScores = body.dimensionScores
    }
    
    if (body.interpretation !== undefined) {
      updateData.interpretation = body.interpretation
    }
    
    if (body.recommendations !== undefined) {
      updateData.recommendations = body.recommendations
    }
    
    if (body.metadata !== undefined) {
      updateData.metadata = {
        ...(existingResult.metadata as Record<string, any> || {}),
        ...body.metadata
      }
    }

    // Atualizar resultado
    const updatedResult = await db.testResult.update({
      where: { id: resultId },
      data: updateData
    })

    console.log(`[API /test-results] PATCH - Resultado atualizado parcialmente: ${resultId}`)

    return NextResponse.json({
      success: true,
      data: updatedResult,
      message: 'Resultado atualizado com sucesso',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /test-results] PATCH - Erro ao atualizar resultado:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor ao atualizar resultado',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// DELETE - Excluir resultado
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /test-results] DELETE - Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const resultId = searchParams.get('id')

    if (!resultId) {
      return NextResponse.json(
        { error: 'ID do resultado é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o resultado existe e pertence ao usuário
    const existingResult = await db.testResult.findFirst({
      where: {
        id: resultId,
        userId: session.user.id
      },
      include: {
        aiAnalyses: true
      }
    })

    if (!existingResult) {
      console.log(`[API /test-results] DELETE - Resultado não encontrado: ${resultId}`)
      return NextResponse.json(
        { error: 'Resultado não encontrado' },
        { status: 404 }
      )
    }

    // Excluir resultado e análises relacionadas em transação
    await db.$transaction(async (tx) => {
      // Excluir análises de IA relacionadas
      if (existingResult.aiAnalyses.length > 0) {
        await tx.aIAnalysis.deleteMany({
          where: { testResultId: resultId }
        })
      }

      // Excluir resultado
      await tx.testResult.delete({
        where: { id: resultId }
      })
    })

    console.log(`[API /test-results] DELETE - Resultado excluído: ${resultId}`)

    return NextResponse.json({
      success: true,
      message: 'Resultado excluído com sucesso',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /test-results] DELETE - Erro ao excluir resultado:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor ao excluir resultado',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}