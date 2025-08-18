import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; questionNumber: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id: testId, questionNumber } = params
    const questionNum = parseInt(questionNumber)

    if (isNaN(questionNum) || questionNum < 1) {
      return NextResponse.json(
        { error: 'Número da pergunta inválido' },
        { status: 400 }
      )
    }

    // Verificar se o teste existe e está ativo
    const test = await db.test.findUnique({
      where: { id: testId },
      select: {
        id: true,
        name: true,
        isActive: true,
        questions: {
          orderBy: { questionNumber: 'asc' },
          select: {
            id: true,
            questionText: true,
            options: true
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

    if (!test.isActive) {
      return NextResponse.json(
        { error: 'Teste não está ativo' },
        { status: 400 }
      )
    }

    // Verificar se a pergunta existe
    if (questionNum > test.questions.length) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }

    // Retornar a pergunta específica (índice baseado em 1)
    const question = test.questions[questionNum - 1]

    return NextResponse.json({
      id: question.id,
      text: question.questionText,
      options: question.options || []
    })

  } catch (error) {
    console.error('Erro ao buscar pergunta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}