import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Obter parâmetros da URL
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('testId')

    if (!testId) {
      return NextResponse.json(
        { error: 'testId é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar questões do teste
    const questions = await prisma.question.findMany({
      where: {
        testId: testId
      },
      orderBy: {
        questionNumber: 'asc'
      },
      select: {
        id: true,
        questionText: true,
        questionNumber: true,
        questionType: true,
        test: {
          select: {
            name: true
          }
        }
      }
    })

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma questão encontrada para este teste' },
        { status: 404 }
      )
    }

    // Mapear questões para o formato esperado pelo frontend
    const formattedQuestions = questions.map(question => ({
      id: question.id,
      text: question.questionText,
      questionNumber: question.questionNumber,
      type: question.questionType,
      dimension: '',
      test: getTestAbbreviation(''),
      testName: question.test?.name || 'Teste não identificado'
    }))

    return NextResponse.json({
      success: true,
      questions: formattedQuestions,
      total: questions.length
    })

  } catch (error) {
    console.error('Erro ao buscar questões:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função auxiliar para mapear dimensões para abreviações de teste
function getTestAbbreviation(dimension: string): string {
  const dimensionToTest: Record<string, string> = {
    'Reconhecimento Emocional': 'TOHE',
    'Compreensão de Causas': 'TOHE',
    'Tomada de Perspectiva': 'TOHE',
    'Reação Rápida': 'VE',
    'Tomada de Decisão Emocional': 'VE',
    'Autorregulação': 'QORE',
    'Redirecionamento Positivo': 'QORE',
    'Empatia Cognitiva': 'QOE',
    'Empatia Emocional': 'QOE'
  }
  
  return dimensionToTest[dimension] || 'BOLIE'
}