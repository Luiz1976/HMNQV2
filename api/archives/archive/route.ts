import { NextRequest, NextResponse } from 'next/server'
import TestResultArchiver from '@/archives/utils/archiver'
import { TestResult } from '@/archives/utils/indexer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados obrigatórios
    const requiredFields = ['id', 'userId', 'testType', 'testId', 'completedAt', 'status']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório ausente: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validar tipo de teste
    const validTestTypes = ['personalidade', 'psicossociais', 'outros']
    if (!validTestTypes.includes(body.testType)) {
      return NextResponse.json(
        { error: 'Tipo de teste inválido' },
        { status: 400 }
      )
    }

    // Validar status
    const validStatuses = ['completed', 'incomplete']
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    const testResult: Omit<TestResult, 'filePath'> = {
      id: body.id,
      userId: body.userId,
      testType: body.testType,
      testId: body.testId,
      completedAt: body.completedAt,
      score: body.score,
      status: body.status,
      metadata: body.metadata
    }
    
    const archiver = new TestResultArchiver()
    const filePath = await archiver.archiveTestResult(testResult, {
      autoIndex: true,
      createDirectories: true,
      overwrite: body.overwrite || false
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resultado arquivado com sucesso',
      filePath 
    })
  } catch (error) {
    console.error('Erro ao arquivar resultado:', error)
    
    if (error instanceof Error && error.message.includes('já existe')) {
      return NextResponse.json(
        { error: 'Arquivo já existe. Use overwrite=true para substituir.' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!Array.isArray(body.results)) {
      return NextResponse.json(
        { error: 'Campo "results" deve ser um array' },
        { status: 400 }
      )
    }

    const archiver = new TestResultArchiver()
    const archivedPaths = await archiver.archiveMultipleResults(body.results, {
      autoIndex: true,
      createDirectories: true,
      overwrite: body.overwrite || false
    })
    
    return NextResponse.json({ 
      success: true, 
      message: `${archivedPaths.length} resultados arquivados com sucesso`,
      archivedPaths 
    })
  } catch (error) {
    console.error('Erro ao arquivar múltiplos resultados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}