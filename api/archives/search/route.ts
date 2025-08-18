import { NextRequest, NextResponse } from 'next/server'
import TestResultRetriever from '@/archives/utils/retriever'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const testTypeParam = searchParams.get('testType')
    const statusParam = searchParams.get('status')
    
    const criteria = {
      userId: searchParams.get('userId') || undefined,
      testType: (testTypeParam && ['personalidade', 'psicossociais', 'outros'].includes(testTypeParam)) 
        ? testTypeParam as 'personalidade' | 'psicossociais' | 'outros' 
        : undefined,
      testId: searchParams.get('testId') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      status: (statusParam && ['completed', 'incomplete'].includes(statusParam)) 
        ? statusParam as 'completed' | 'incomplete' 
        : undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0')
    }

    // Remover campos undefined
    Object.keys(criteria).forEach(key => {
      if (criteria[key as keyof typeof criteria] === undefined) {
        delete criteria[key as keyof typeof criteria]
      }
    })
    
    const retriever = new TestResultRetriever()
    const results = await retriever.searchResults(criteria)
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Erro na busca de resultados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}