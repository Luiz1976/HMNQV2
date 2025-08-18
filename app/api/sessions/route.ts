// HumaniQ AI - API de Gerenciamento de Sessões de Teste
// Rotas RESTful completas para CRUD de sessões de teste com persistência SQLite

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Schema de validação para criação de sessão
const createSessionSchema = z.object({
  testId: z.string().min(1, 'ID do teste é obrigatório'),
  sessionName: z.string().min(1, 'Nome da sessão é obrigatório').max(255, 'Nome muito longo'),
  metadata: z.record(z.any()).optional()
})

// Schema de validação para atualização de sessão
const updateSessionSchema = z.object({
  sessionName: z.string().min(1, 'Nome da sessão é obrigatório').max(255, 'Nome muito longo').optional(),
  status: z.enum(['STARTED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'EXPIRED']).optional(),
  currentQuestion: z.number().int().min(1).optional(),
  timeSpent: z.number().int().min(0).optional(),
  metadata: z.record(z.any()).optional()
})

// GET - Listar todas as sessões do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /sessions] GET - Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const testId = searchParams.get('testId')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

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

    if (status) {
      where.status = status
    }

    if (testId) {
      where.testId = testId
    }

    // Construir ordenação
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Buscar sessões com paginação
    const [sessions, totalCount] = await Promise.all([
      db.testSession.findMany({
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
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          company: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      db.testSession.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    console.log(`[API /sessions] GET - Listadas ${sessions.length} sessões para usuário ${session.user.id}`)

    return NextResponse.json({
      success: true,
      data: sessions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /sessions] GET - Erro ao listar sessões:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor ao listar sessões',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// POST - Criar nova sessão de teste
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /sessions] POST - Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validar dados de entrada
    const validationResult = createSessionSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('[API /sessions] POST - Dados inválidos:', validationResult.error.errors)
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { testId, sessionName, metadata } = validationResult.data

    // Verificar se o teste existe
    const test = await db.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          select: { id: true }
        }
      }
    })

    if (!test) {
      console.log(`[API /sessions] POST - Teste não encontrado: ${testId}`)
      return NextResponse.json(
        { error: 'Teste não encontrado' },
        { status: 404 }
      )
    }

    if (!test.isActive) {
      console.log(`[API /sessions] POST - Teste inativo: ${testId}`)
      return NextResponse.json(
        { error: 'Teste não está ativo' },
        { status: 400 }
      )
    }

    // Verificar se já existe uma sessão ativa para este teste
    const existingSession = await db.testSession.findFirst({
      where: {
        userId: session.user.id,
        testId,
        status: {
          in: ['STARTED', 'IN_PROGRESS']
        }
      }
    })

    if (existingSession) {
      console.log(`[API /sessions] POST - Sessão ativa já existe: ${existingSession.id}`)
      return NextResponse.json(
        {
          error: 'Já existe uma sessão ativa para este teste',
          existingSessionId: existingSession.id
        },
        { status: 409 }
      )
    }

    // Criar nova sessão
    const totalQuestions = test.questions.length
    const expiresAt = new Date(Date.now() + (test.estimatedDuration * 60 * 1000 * 2)) // 2x tempo estimado

    const newSession = await db.testSession.create({
      data: {
        testId,
        userId: session.user.id,
        status: 'STARTED',
        currentQuestion: 1,
        totalQuestions,
        timeSpent: 0,
        expiresAt,
        metadata: {
          sessionName,
          ...metadata
        }
      },
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
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    console.log(`[API /sessions] POST - Nova sessão criada: ${newSession.id} para teste ${testId}`)

    return NextResponse.json({
      success: true,
      data: newSession,
      message: 'Sessão criada com sucesso',
      timestamp: new Date().toISOString()
    }, { status: 201 })

  } catch (error) {
    console.error('[API /sessions] POST - Erro ao criar sessão:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor ao criar sessão',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// PUT - Atualizar sessão existente
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /sessions] PUT - Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID da sessão é obrigatório' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validar dados de entrada
    const validationResult = updateSessionSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('[API /sessions] PUT - Dados inválidos:', validationResult.error.errors)
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    // Verificar se a sessão existe e pertence ao usuário
    const existingSession = await db.testSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id
      }
    })

    if (!existingSession) {
      console.log(`[API /sessions] PUT - Sessão não encontrada: ${sessionId}`)
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = {}
    const { sessionName, status, currentQuestion, timeSpent, metadata } = validationResult.data

    if (sessionName !== undefined) {
      updateData.metadata = {
        ...(existingSession.metadata as Record<string, any> || {}),
        sessionName
      }
    }

    if (status !== undefined) {
      updateData.status = status
      
      // Se completando a sessão, definir completedAt
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date()
      }
    }

    if (currentQuestion !== undefined) {
      updateData.currentQuestion = currentQuestion
    }

    if (timeSpent !== undefined) {
      updateData.timeSpent = timeSpent
    }

    if (metadata !== undefined) {
      updateData.metadata = {
        ...(existingSession.metadata as Record<string, any> || {}),
        ...metadata
      }
    }

    // Atualizar sessão
    const updatedSession = await db.testSession.update({
      where: { id: sessionId },
      data: updateData,
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
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    console.log(`[API /sessions] PUT - Sessão atualizada: ${sessionId}`)

    return NextResponse.json({
      success: true,
      data: updatedSession,
      message: 'Sessão atualizada com sucesso',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /sessions] PUT - Erro ao atualizar sessão:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor ao atualizar sessão',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// DELETE - Excluir sessão
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /sessions] DELETE - Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID da sessão é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a sessão existe e pertence ao usuário
    const existingSession = await db.testSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id
      },
      include: {
        answers: true,
        results: true
      }
    })

    if (!existingSession) {
      console.log(`[API /sessions] DELETE - Sessão não encontrada: ${sessionId}`)
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se a sessão pode ser excluída
    if (existingSession.status === 'COMPLETED' && existingSession.results.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir sessão com resultados salvos' },
        { status: 400 }
      )
    }

    // Excluir sessão e dados relacionados em transação
    await db.$transaction(async (tx) => {
      // Excluir respostas
      if (existingSession.answers.length > 0) {
        await tx.answer.deleteMany({
          where: { sessionId }
        })
      }

      // Excluir resultados (se houver)
      if (existingSession.results.length > 0) {
        await tx.testResult.deleteMany({
          where: { sessionId }
        })
      }

      // Excluir sessão
      await tx.testSession.delete({
        where: { id: sessionId }
      })
    })

    console.log(`[API /sessions] DELETE - Sessão excluída: ${sessionId}`)

    return NextResponse.json({
      success: true,
      message: 'Sessão excluída com sucesso',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /sessions] DELETE - Erro ao excluir sessão:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor ao excluir sessão',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// PATCH - Atualização parcial de sessão (alternativa ao PUT)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('[API /sessions] PATCH - Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID da sessão é obrigatório' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Verificar se a sessão existe e pertence ao usuário
    const existingSession = await db.testSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id
      }
    })

    if (!existingSession) {
      console.log(`[API /sessions] PATCH - Sessão não encontrada: ${sessionId}`)
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar apenas campos fornecidos
    const updateData: any = {}
    
    if (body.currentQuestion !== undefined) {
      updateData.currentQuestion = body.currentQuestion
    }
    
    if (body.timeSpent !== undefined) {
      updateData.timeSpent = body.timeSpent
    }
    
    if (body.status !== undefined) {
      updateData.status = body.status
      if (body.status === 'COMPLETED') {
        updateData.completedAt = new Date()
      }
    }

    if (body.metadata !== undefined) {
      updateData.metadata = {
        ...(existingSession.metadata as Record<string, any> || {}),
        ...body.metadata
      }
    }

    // Atualizar sessão
    const updatedSession = await db.testSession.update({
      where: { id: sessionId },
      data: updateData
    })

    console.log(`[API /sessions] PATCH - Sessão atualizada parcialmente: ${sessionId}`)

    return NextResponse.json({
      success: true,
      data: updatedSession,
      message: 'Sessão atualizada com sucesso',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /sessions] PATCH - Erro ao atualizar sessão:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor ao atualizar sessão',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}