// HumaniQ AI - API de Testes
// Operações RESTful para gerenciamento de testes usando Prisma

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { TestType } from '@prisma/client'
import { getTestQuestionsCount } from '@/config/test-questions-count'

export const dynamic = 'force-dynamic'

// Schema de validação para criação de teste
const createTestSchema = z.object({
  name: z.string().min(1, 'Nome do teste é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  testType: z.enum(['PSYCHOSOCIAL', 'PERSONALITY', 'GRAPHOLOGY', 'CORPORATE']),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  estimatedDuration: z.number().int().min(1, 'Duração estimada deve ser maior que 0'),
  isActive: z.boolean().default(true),
  instructions: z.string().optional(),
  metadata: z.any().optional()
})

// Schema de validação para atualização de teste
const updateTestSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  testType: z.enum(['PSYCHOSOCIAL', 'PERSONALITY', 'GRAPHOLOGY', 'CORPORATE']).optional(),
  categoryId: z.string().optional(),
  estimatedDuration: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
  instructions: z.string().optional(),
  metadata: z.any().optional()
})

// GET - Listar todos os testes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const category = searchParams.get('category')
    const testType = searchParams.get('testType')
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    // Construir filtros
    const where: any = {}
    
    if (category) {
      where.category = {
        name: {
          contains: category,
          mode: 'insensitive'
        }
      }
    }
    
    if (testType) {
      where.testType = testType
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Buscar testes com paginação
    const [tests, totalCount] = await Promise.all([
      db.test.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true
            }
          },
          questions: {
            select: {
              id: true
            }
          },
          _count: {
            select: {
              sessions: true,
              results: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.test.count({ where })
    ])

    // Adicionar contagem de questões e formatar dados
    const testsWithQuestionCount = tests.map(test => {
      const questionsCount = test.questions.length || getTestQuestionsCount(test.id)
      
      // Log para monitoramento
      console.log(`[API /tests] Test: ${test.id}, Questions Count: ${questionsCount}`)
      
      return {
        id: test.id,
        title: test.name,
        description: test.description,
        category: test.category.name,
        type: test.testType.toLowerCase(),
        estimatedDuration: test.estimatedDuration,
        available: test.isActive,
        icon: test.category.icon || 'activity',
        questionsCount,
        sessionsCount: test._count.sessions,
        resultsCount: test._count.results,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt
      }
    })

    return NextResponse.json({
      success: true,
      data: testsWithQuestionCount,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[API /tests] Error fetching tests:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Falha ao buscar testes',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// POST - Criar novo teste
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se é admin ou empresa
    if (session.user.userType !== 'ADMIN' && session.user.userType !== 'COMPANY') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores e empresas podem criar testes.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Verificar se é uma busca por teste específico (compatibilidade com implementação anterior)
    if (body.testId) {
      return await getSpecificTest(body.testId)
    }
    
    // Validar dados de entrada para criação
    const validationResult = createTestSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('[API /tests] POST - Dados inválidos:', validationResult.error.errors)
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { categoryId, ...testData } = validationResult.data

    // Verificar se a categoria existe
    const category = await db.testCategory.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      console.log(`[API /tests] POST - Categoria não encontrada: ${categoryId}`)
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se já existe um teste com o mesmo nome
    const existingTest = await db.test.findFirst({
      where: {
        name: testData.name
      }
    })

    if (existingTest) {
      console.log(`[API /tests] POST - Teste já existe: ${testData.name}`)
      return NextResponse.json(
        { error: 'Já existe um teste com este nome' },
        { status: 409 }
      )
    }

    // Criar novo teste
    const newTest = await db.test.create({
      data: {
        ...testData,
        categoryId,
        companyId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            description: true
          }
        },
        _count: {
          select: {
            questions: true
          }
        }
      }
    })

    console.log(`[API /tests] POST - Novo teste criado: ${newTest.id} (${newTest.name})`)

    return NextResponse.json({
      success: true,
      data: {
        id: newTest.id,
        name: newTest.name,
        description: newTest.description,
        testType: newTest.testType,
        category: newTest.category,
        estimatedDuration: newTest.estimatedDuration,
        isActive: newTest.isActive,
        instructions: newTest.instructions,
        configuration: newTest.configuration,
        createdAt: newTest.createdAt,
        updatedAt: newTest.updatedAt,
        questionsCount: newTest._count.questions
      },
      message: 'Teste criado com sucesso',
      timestamp: new Date().toISOString()
    }, { status: 201 })

  } catch (error) {
    console.error('[API /tests] POST - Erro ao criar teste:', error)
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

// PUT - Atualizar teste completo
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se é admin
    if (!session?.user?.id || session.user.userType !== 'ADMIN') {
      console.log('[API /tests] PUT - Acesso negado - usuário não é admin')
      return NextResponse.json(
        { error: 'Acesso negado - apenas administradores podem atualizar testes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { testId, ...updateData } = body
    
    if (!testId) {
      return NextResponse.json(
        { error: 'ID do teste é obrigatório' },
        { status: 400 }
      )
    }

    // Validar dados de entrada
    const validationResult = updateTestSchema.safeParse(updateData)
    if (!validationResult.success) {
      console.log('[API /tests] PUT - Dados inválidos:', validationResult.error.errors)
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    // Verificar se o teste existe
    const existingTest = await db.test.findUnique({
      where: { id: testId }
    })

    if (!existingTest) {
      console.log(`[API /tests] PUT - Teste não encontrado: ${testId}`)
      return NextResponse.json(
        { error: 'Teste não encontrado' },
        { status: 404 }
      )
    }

    // Se categoryId foi fornecido, verificar se existe
    if (validationResult.data.categoryId) {
      const category = await db.testCategory.findUnique({
        where: { id: validationResult.data.categoryId }
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Categoria não encontrada' },
          { status: 404 }
        )
      }
    }

    // Atualizar teste
    const updatedTest = await db.test.update({
      where: { id: testId },
      data: {
        ...validationResult.data,
        updatedAt: new Date()
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            description: true
          }
        },
        _count: {
          select: {
            questions: true,
            sessions: true,
            results: true
          }
        }
      }
    })

    console.log(`[API /tests] PUT - Teste atualizado com sucesso: ${testId}`)

    return NextResponse.json({
      success: true,
      data: {
        id: updatedTest.id,
        name: updatedTest.name,
        description: updatedTest.description,
        testType: updatedTest.testType,
        category: updatedTest.category,
        estimatedDuration: updatedTest.estimatedDuration,
        isActive: updatedTest.isActive,
        instructions: updatedTest.instructions,
        configuration: updatedTest.configuration,
        updatedAt: updatedTest.updatedAt,
        questionsCount: updatedTest._count.questions,
        stats: {
          questionsCount: updatedTest._count.questions,
          sessionsCount: updatedTest._count.sessions,
          resultsCount: updatedTest._count.results
        }
      },
      message: 'Teste atualizado com sucesso',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /tests] PUT - Erro ao atualizar teste:', error)
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

// DELETE - Deletar teste
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se é admin
    if (!session?.user?.id || session.user.userType !== 'ADMIN') {
      console.log('[API /tests] DELETE - Acesso negado - usuário não é admin')
      return NextResponse.json(
        { error: 'Acesso negado - apenas administradores podem deletar testes' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('testId')
    const force = searchParams.get('force') === 'true'
    
    if (!testId) {
      return NextResponse.json(
        { error: 'ID do teste é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o teste existe
    const existingTest = await db.test.findUnique({
      where: { id: testId },
      include: {
        questions: true,
        sessions: true,
        results: {
          include: {
            aiAnalyses: true
          }
        }
      }
    })

    if (!existingTest) {
      console.log(`[API /tests] DELETE - Teste não encontrado: ${testId}`)
      return NextResponse.json(
        { error: 'Teste não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se existem dados relacionados
    const hasRelatedData = existingTest.sessions.length > 0 || existingTest.results.length > 0
    
    if (hasRelatedData && !force) {
      return NextResponse.json(
        { 
          error: 'Não é possível deletar teste com dados relacionados. Use force=true para forçar a exclusão.',
          relatedData: {
            questions: existingTest.questions.length,
            sessions: existingTest.sessions.length,
            results: existingTest.results.length,
            aiAnalyses: existingTest.results.reduce((sum, r) => sum + r.aiAnalyses.length, 0)
          }
        },
        { status: 409 }
      )
    }

    let deletedCounts = {
      questions: 0,
      sessions: 0,
      results: 0,
      aiAnalyses: 0
    }

    if (force && hasRelatedData) {
      // Deletar análises de IA
      for (const result of existingTest.results) {
        if (result.aiAnalyses.length > 0) {
          await db.aIAnalysis.deleteMany({
            where: { testResultId: result.id }
          })
          deletedCounts.aiAnalyses += result.aiAnalyses.length
        }
      }

      // Deletar resultados
      if (existingTest.results.length > 0) {
        await db.testResult.deleteMany({
          where: { testId }
        })
        deletedCounts.results = existingTest.results.length
      }

      // Deletar respostas das sessões
      for (const session of existingTest.sessions) {
        await db.answer.deleteMany({
          where: { sessionId: session.id }
        })
      }

      // Deletar sessões
      if (existingTest.sessions.length > 0) {
        await db.testSession.deleteMany({
          where: { testId }
        })
        deletedCounts.sessions = existingTest.sessions.length
      }

      // Deletar questões
      if (existingTest.questions.length > 0) {
        await db.question.deleteMany({
          where: { testId }
        })
        deletedCounts.questions = existingTest.questions.length
      }
    }

    // Deletar o teste
    await db.test.delete({
      where: { id: testId }
    })

    console.log(`[API /tests] DELETE - Teste deletado com sucesso: ${testId} (${existingTest.name})`)
    if (force) {
      console.log(`[API /tests] DELETE - Dados relacionados deletados:`, deletedCounts)
    }

    return NextResponse.json({
      success: true,
      message: 'Teste deletado com sucesso',
      deletedTest: {
        id: existingTest.id,
        name: existingTest.name,
        testType: existingTest.testType
      },
      deletedCounts: force ? deletedCounts : undefined,
      force,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API /tests] DELETE - Erro ao deletar teste:', error)
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

// Função auxiliar para buscar teste específico (compatibilidade)
async function getSpecificTest(testId: string) {
  try {
    const test = await db.test.findUnique({
      where: { id: testId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            description: true
          }
        },
        questions: {
          select: {
            id: true,
            questionText: true,
            questionType: true,
            options: true,
            questionNumber: true,
            isRequired: true,
          },
          orderBy: {
              questionNumber: 'asc'
            }
        },
        _count: {
          select: {
            questions: true,
            sessions: true,
        results: true
          }
        }
      }
    })
    
    if (!test) {
      console.log(`[API /tests] POST - Teste não encontrado: ${testId}`)
      return NextResponse.json(
        {
          success: false,
          error: 'Teste não encontrado'
        },
        { status: 404 }
      )
    }

    console.log(`[API /tests] POST - Teste específico encontrado: ${testId}`)
    
    return NextResponse.json({
      success: true,
      data: {
        id: test.id,
        name: test.name,
        description: test.description,
        testType: test.testType,
        category: test.category,
        estimatedDuration: test.estimatedDuration,
        isActive: test.isActive,
        instructions: test.instructions,
        configuration: test.configuration,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
        questionsCount: test._count.questions,
        questions: test.questions,
        stats: {
          questionsCount: test._count.questions,
          sessionsCount: test._count.sessions,
        resultsCount: test._count.results
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[API /tests] Erro ao buscar teste específico:', error)
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