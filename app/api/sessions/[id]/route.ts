import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const updateSessionSchema = z.object({
  sessionName: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED']).optional(),
  currentQuestion: z.number().min(0).optional(),
  timeSpent: z.number().min(0).optional(),
  metadata: z.record(z.any()).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params

    const testSession = await db.testSession.findUnique({
      where: { id },
      select: {
        id: true,
        testId: true,
        userId: true,
        status: true,
        currentQuestion: true,
        totalQuestions: true,
        timeSpent: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        completedAt: true,
        expiresAt: true,
        test: {
          select: {
            id: true,
            name: true,
            description: true,
            testType: true,
            estimatedDuration: true,
          }
        }
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

    return NextResponse.json({
      id: testSession.id,
      testId: testSession.testId,
      userId: testSession.userId,
      status: testSession.status,
      currentQuestion: testSession.currentQuestion,
      totalQuestions: testSession.totalQuestions,
      timeSpent: testSession.timeSpent,
      metadata: testSession.metadata,
      createdAt: testSession.createdAt,
      updatedAt: testSession.updatedAt,
      completedAt: testSession.completedAt,
      expiresAt: testSession.expiresAt,
      test: testSession.test
    })

  } catch (error) {
    console.error('Erro ao buscar sessão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const validatedData = updateSessionSchema.parse(body)

    // Verificar se a sessão existe e pertence ao usuário
    const existingSession = await db.testSession.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true
      }
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    if (existingSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Acesso negado à sessão' },
        { status: 403 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = {
      ...validatedData,
      updatedAt: new Date()
    }

    // Se o status está sendo alterado para COMPLETED, definir completedAt
    if (validatedData.status === 'COMPLETED' && existingSession.status !== 'COMPLETED') {
      updateData.completedAt = new Date()
    }

    // Atualizar a sessão
    const updatedSession = await db.testSession.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        testId: true,
        userId: true,
        status: true,
        currentQuestion: true,
        totalQuestions: true,
        timeSpent: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        completedAt: true,
        expiresAt: true
      }
    })

    return NextResponse.json(updatedSession)

  } catch (error) {
    console.error('Erro ao atualizar sessão:', error)
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params

    // Verificar se a sessão existe e pertence ao usuário
    const existingSession = await db.testSession.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true
      }
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    if (existingSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Acesso negado à sessão' },
        { status: 403 }
      )
    }

    // Deletar todas as respostas da sessão primeiro
    await db.answer.deleteMany({
      where: { sessionId: id }
    })

    // Deletar a sessão
    await db.testSession.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Sessão deletada com sucesso' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro ao deletar sessão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}