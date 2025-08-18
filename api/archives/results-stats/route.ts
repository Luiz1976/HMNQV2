import { NextRequest, NextResponse } from 'next/server'
import TestResultRetriever from '@/archives/utils/retriever'

export async function GET(request: NextRequest) {
  try {
    const retriever = new TestResultRetriever()
    const stats = await retriever.getResultsStatistics()
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao obter estatísticas dos resultados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}