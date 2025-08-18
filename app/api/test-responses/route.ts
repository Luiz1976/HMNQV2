import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const createResponseSchema = z.object({
  sessionId: z.string().min(1, 'ID da sessão é obrigatório'),
  questionId: z.string().min(1, 'ID da pergunta é obrigatório'),
  selectedOptionId: z.string().min(1, 'ID da opção selecionada é obrigatório'),
  questionNumber: z.number().min(1, 'Número da pergunta deve ser maior que 0'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createResponseSchema.parse(body)

    const { sessionId, questionId, selectedOptionId, questionNumber } = validatedData

    // Verificar se a sessão existe e pertence ao usuário
    const testSession = await db.testSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        userId: true,
        testId: true,
        status: true,
        currentQuestion: true
      }
    })

    if (!testSession) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    if (testSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Acesso negado à sessão' },
        { status: 403 }
      )
    }

    if (testSession.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Sessão já foi completada' },
        { status: 400 }
      )
    }

    // Verificar se a pergunta existe
    const question = await db.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        testId: true,
        options: true
      }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }

    if (question.testId !== testSession.testId) {
      return NextResponse.json(
        { error: 'Pergunta não pertence ao teste da sessão' },
        { status: 400 }
      )
    }

    // Verificar se a opção selecionada existe (options é um campo JSON)
    const options = question.options as any[]
    const selectedOption = options?.find(option => option.id === selectedOptionId)
    if (!selectedOption) {
      return NextResponse.json(
        { error: 'Opção selecionada não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se já existe uma resposta para esta pergunta nesta sessão
    const existingResponse = await db.answer.findFirst({
      where: {
        sessionId: sessionId,
        questionId: questionId
      }
    })

    let response

    if (existingResponse) {
      // Atualizar resposta existente
      response = await db.answer.update({
        where: { id: existingResponse.id },
        data: {
          answerValue: { selectedOptionId, questionNumber },
          metadata: selectedOption.metadata || {},
          updatedAt: new Date()
        }
      })
    } else {
      // Criar nova resposta
      response = await db.answer.create({
        data: {
          sessionId: sessionId,
          questionId: questionId,
          userId: session.user.id,
          answerValue: { selectedOptionId, questionNumber },
          metadata: selectedOption.metadata || {}
        }
      })
    }

    return NextResponse.json({
      id: response.id,
      sessionId: response.sessionId,
      questionId: response.questionId,
      userId: response.userId,
      answerValue: response.answerValue,
      metadata: response.metadata,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt
    })

  } catch (error) {
    console.error('Erro ao salvar resposta:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID da sessão é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a sessão existe e pertence ao usuário
    const testSession = await db.testSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        userId: true
      }
    })

    if (!testSession) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    if (testSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Acesso negado à sessão' },
        { status: 403 }
      )
    }

    // Buscar todas as respostas da sessão
    const responses = await db.answer.findMany({
      where: { sessionId: sessionId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        questionId: true,
        userId: true,
        answerValue: true,
        timeSpent: true,
        isSkipped: true,
        metadata: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(responses)

  } catch (error) {
    console.error('Erro ao buscar respostas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}