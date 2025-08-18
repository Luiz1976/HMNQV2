import { NextRequest, NextResponse } from 'next/server'
import TestResultRetriever from '@/archives/utils/retriever'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const format = searchParams.get('format') || 'csv'
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
      limit: 10000 // Limite alto para exportação
    }

    // Remover campos undefined
    Object.keys(criteria).forEach(key => {
      if (criteria[key as keyof typeof criteria] === undefined) {
        delete criteria[key as keyof typeof criteria]
      }
    })
    
    const retriever = new TestResultRetriever()
    
    if (format === 'csv') {
      const csvContent = await retriever.exportToCSV(criteria)
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="resultados_${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else if (format === 'json') {
      const results = await retriever.searchResults(criteria)
      
      return new NextResponse(JSON.stringify(results.results, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="resultados_${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Formato não suportado' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Erro na exportação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}