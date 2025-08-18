import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getTestQuestionsCount } from '@/config/test-questions-count'

// GET - Obter teste específico por ID
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

    const testId = params.id

    if (!testId) {
      return NextResponse.json(
        { error: 'ID do teste é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar teste no banco de dados
    const test = await db.test.findUnique({
      where: { id: testId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true
          }
        },
        company: {
          select: {
            id: true,
            name: true
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
      return NextResponse.json(
        { error: 'Teste não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissões de acesso
    const canAccess = 
      session.user.userType === 'ADMIN' ||
      test.isActive ||
      (session.user.userType === 'COMPANY' && test.companyId && session.user.userType === 'COMPANY')

    if (!canAccess) {
      return NextResponse.json(
        { error: 'Acesso negado ao teste' },
        { status: 403 }
      )
    }

    // Obter contagem de questões usando a função existente
    const questionsCount = getTestQuestionsCount(testId) || test._count.questions

    console.log(`[API /tests/${testId}] GET - Teste encontrado: ${test.name}, Questions: ${questionsCount}`)

    // Formatar resposta compatível com o sistema existente
    const formattedTest = {
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
      updatedAt: test.updatedAt,
      // Dados adicionais para compatibilidade
      categoryId: test.categoryId,
      testType: test.testType,
      isActive: test.isActive,
      company: test.company
    }

    return NextResponse.json({
      success: true,
      data: formattedTest,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error(`[API /tests/${params.id}] GET - Erro ao buscar teste:`, error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Falha ao buscar dados do teste',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// PUT - Atualizar teste específico
export async function PUT(
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

    const testId = params.id
    const body = await request.json()

    // Verificar se o teste existe
    const existingTest = await db.test.findUnique({
      where: { id: testId },
      include: { company: true }
    })

    if (!existingTest) {
      return NextResponse.json(
        { error: 'Teste não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissões
    if (session.user.userType !== 'ADMIN' && 
        (session.user.userType !== 'COMPANY' || !existingTest.companyId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = {}
    
    if (body.name) updateData.name = body.name
    if (body.description) updateData.description = body.description
    if (body.testType) updateData.testType = body.testType
    if (body.categoryId) updateData.categoryId = body.categoryId
    if (body.estimatedDuration) updateData.estimatedDuration = body.estimatedDuration
    if (typeof body.isActive === 'boolean') updateData.isActive = body.isActive
    
    updateData.updatedAt = new Date()

    // Se categoryId foi fornecido, verificar se existe
    if (updateData.categoryId) {
      const category = await db.testCategory.findUnique({
        where: { id: updateData.categoryId }
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
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true
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

    const questionsCount = getTestQuestionsCount(testId) || updatedTest._count.questions

    console.log(`[API /tests/${testId}] PUT - Teste atualizado: ${updatedTest.name}`)

    return NextResponse.json({
      success: true,
      data: {
        id: updatedTest.id,
        title: updatedTest.name,
        description: updatedTest.description,
        category: updatedTest.category.name,
        type: updatedTest.testType.toLowerCase(),
        estimatedDuration: updatedTest.estimatedDuration,
        available: updatedTest.isActive,
        icon: updatedTest.category.icon || 'activity',
        questionsCount,
        sessionsCount: updatedTest._count.sessions,
        resultsCount: updatedTest._count.results,
        createdAt: updatedTest.createdAt,
        updatedAt: updatedTest.updatedAt
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error(`[API /tests/${params.id}] PUT - Erro ao atualizar teste:`, error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Falha ao atualizar teste',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// DELETE - Deletar teste específico
export async function DELETE(
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

    const testId = params.id

    // Verificar se o teste existe
    const existingTest = await db.test.findUnique({
      where: { id: testId },
      include: {
        _count: {
          select: {
            sessions: true,
            results: true
          }
        }
      }
    })

    if (!existingTest) {
      return NextResponse.json(
        { error: 'Teste não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissões
    if (session.user.userType !== 'ADMIN' && 
        (session.user.userType !== 'COMPANY' || !existingTest.companyId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Verificar se há sessões ou resultados associados
    if (existingTest._count.sessions > 0 || existingTest._count.results > 0) {
      return NextResponse.json(
        { 
          error: 'Não é possível deletar teste com sessões ou resultados associados',
          details: {
            sessions: existingTest._count.sessions,
            results: existingTest._count.results
          }
        },
        { status: 409 }
      )
    }

    // Deletar teste
    await db.test.delete({
      where: { id: testId }
    })

    console.log(`[API /tests/${testId}] DELETE - Teste deletado: ${testId}`)

    return NextResponse.json({
      success: true,
      message: 'Teste deletado com sucesso',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error(`[API /tests/${params.id}] DELETE - Erro ao deletar teste:`, error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Falha ao deletar teste',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}