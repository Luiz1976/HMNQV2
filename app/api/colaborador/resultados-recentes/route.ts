import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { readArchivedResults, formatArchivedResult, getArchivedResultsStats } from '@/lib/archive-reader'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar todos os resultados do usuário do banco de dados
    const testResults = await db.testResult.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        test: {
          select: {
            name: true,
            estimatedDuration: true,
            category: {
              select: {
                name: true
              }
            }
          }
        },
        aiAnalyses: {
          select: {
            analysis: true,
            confidence: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Buscar resultados arquivados do usuário
    const archivedResults = await readArchivedResults(session.user.id)

    // Transformar os dados do banco para o formato esperado pelo frontend
    const formattedDatabaseResults = testResults.map(result => {
      const insights = []
      
      // Extrair insights da análise de IA
      if (result.aiAnalyses && result.aiAnalyses.length > 0) {
        try {
          const latestAnalysis = result.aiAnalyses[0]
          if (latestAnalysis.analysis) {
            // Extrair insights básicos da análise
            const analysisText = latestAnalysis.analysis
            insights.push(analysisText.substring(0, 100) + '...')
            if (latestAnalysis.confidence) {
              insights.push(`Confiança: ${latestAnalysis.confidence}%`)
            }
          }
        } catch (e) {
          console.error('Erro ao processar análise de IA:', e)
        }
      }

      // Usar duração do resultado ou tempo estimado do teste
      let duration = result.duration || result.test?.estimatedDuration || 15
      // Converter de segundos para minutos se necessário
      if (duration > 1000) {
        duration = Math.round(duration / 60)
      }

      // Determinar status - TestResult sempre representa testes completados
      const status = 'completed'

      // Usar pontuação do resultado se disponível
      let score = undefined
      if (result.overallScore && typeof result.overallScore === 'number') {
        score = Math.round(result.overallScore)
      }

      return {
        id: result.id,
        testName: result.test?.name || 'Teste Desconhecido',
        category: result.test?.category?.name || 'Geral',
        status,
        score,
        completedAt: result.completedAt || result.createdAt,
        duration,
        insights: insights.length > 0 ? insights : [
          'Análise em processamento...',
          'Resultados serão atualizados em breve'
        ],
        isArchived: false
      }
    })

    // Transformar os dados arquivados para o formato esperado pelo frontend
    const formattedArchivedResults = archivedResults.map(formatArchivedResult)

    // Combinar resultados do banco e arquivados
    const allResults = [...formattedDatabaseResults, ...formattedArchivedResults]

    // Ordenar todos os resultados por data de conclusão (mais recente primeiro)
    const formattedResults = allResults.sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )

    // Estatísticas adicionais
    const archivedStats = getArchivedResultsStats(archivedResults)
    const stats = {
      total: formattedResults.length,
      completed: formattedResults.filter(r => r.status === 'completed').length,
      inProgress: formattedResults.filter(r => r.status === 'in_progress').length,
      averageScore: formattedResults.filter(r => r.score).length > 0
        ? Math.round(
            formattedResults
              .filter(r => r.score)
              .reduce((acc, r) => acc + (r.score || 0), 0) / 
            formattedResults.filter(r => r.score).length
          )
        : 0,
      database: {
        total: formattedDatabaseResults.length,
        averageScore: formattedDatabaseResults.filter(r => r.score).length > 0
          ? Math.round(
              formattedDatabaseResults
                .filter(r => r.score)
                .reduce((acc, r) => acc + (r.score || 0), 0) / 
              formattedDatabaseResults.filter(r => r.score).length
            )
          : 0
      },
      archived: {
        total: archivedStats.total,
        averageScore: archivedStats.averageScore,
        byCategory: archivedStats.byCategory,
        oldestResult: archivedStats.oldestResult,
        newestResult: archivedStats.newestResult
      }
    }

    return NextResponse.json({
      success: true,
      results: formattedResults,
      stats,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro ao buscar resultados recentes:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}

// Endpoint para operações adicionais nos resultados
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Operação realizada com sucesso'
    })

  } catch (error) {
    console.error('Erro na operação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}