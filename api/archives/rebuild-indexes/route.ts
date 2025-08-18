import { NextRequest, NextResponse } from 'next/server'
import TestResultIndexer from '@/archives/utils/indexer'

export async function POST(request: NextRequest) {
  try {
    const indexer = new TestResultIndexer()
    await indexer.rebuildAllIndexes()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Índices reconstruídos com sucesso' 
    })
  } catch (error) {
    console.error('Erro ao reconstruir índices:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}