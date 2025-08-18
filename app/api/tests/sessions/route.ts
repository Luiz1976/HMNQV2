import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// POST - Criar nova sessão de teste
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { testId } = await request.json()

    if (!testId) {
      return NextResponse.json(
        { error: 'testId é obrigatório' },
        { status: 400 }
      )
    }

    // Validar usuário autenticado existe no banco
    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado ou inativo' },
        { status: 401 }
      )
    }

    // Verificar se o teste existe e está ativo
    const test = await db.test.findUnique({
      where: { id: testId }
    })

    if (!test) {
      return NextResponse.json(
        { error: 'Teste não encontrado' },
        { status: 404 }
      )
    }

    if (!test.isActive) {
      return NextResponse.json(
        { error: 'Teste não está disponível' },
        { status: 403 }
      )
    }

    // Calcular total de questões (se disponível)
    const totalQuestions = await db.question.count({ where: { testId } })

    // Criar nova sessão de teste
    const testSession = await db.testSession.create({
      data: {
        testId: testId,
        userId: user.id,
        companyId: user.companyId ?? undefined,
        startedAt: new Date(),
        totalQuestions: totalQuestions || 0,
      }
    })

    return NextResponse.json({
      success: true,
      sessionId: testSession.id,
      message: 'Sessão de teste criada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao criar sessão de teste:', error)
    return NextResponse.json(
      { error: 'Falha ao criar sessão de teste' },
      { status: 500 }
    )
  }
}