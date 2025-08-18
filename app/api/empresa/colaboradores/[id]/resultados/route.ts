// HumaniQ AI - API de Resultados de Colaboradores para Empresas
// Permite que empresas visualizem os resultados de testes de seus colaboradores

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Listar todos os resultados de um colaborador específico (acesso da empresa)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.userType !== 'COMPANY') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas empresas podem acessar estes dados.' },
        { status: 403 }
      )
    }

    const { id: colaboradorId } = params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const testType = searchParams.get('testType')
    const categoryId = searchParams.get('categoryId')
    const includeAI = searchParams.get('includeAI') === 'true'
    const sortBy = searchParams.get('sortBy') || 'completedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Verificar se a empresa tem acesso ao colaborador
    const company = await prisma.company.findFirst({
      where: {
        ownerId: session.user.id,
        isActive: true
      }
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa não encontrada ou inativa' },
        { status: 404 }
      )
    }

    // Verificar se o colaborador pertence à empresa
    const colaborador = await prisma.user.findFirst({
      where: {
        id: colaboradorId,
        companyId: company.id,
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userType: true,
        createdAt: true
      }
    })

    if (!colaborador) {
      return NextResponse.json(
        { error: 'Colaborador não encontrado ou não pertence à sua empresa' },
        { status: 404 }
      )
    }

    // Construir filtros para os resultados
    const where: any = {
      userId: colaboradorId
    }

    if (testType) {
      where.test = {
        testType
      }
    }

    if (categoryId) {
      where.test = {
        ...where.test,
        categoryId
      }
    }

    if (search) {
      where.test = {
        ...where.test,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
    }

    // Filtros de data
    if (dateFrom || dateTo) {
      where.completedAt = {}
      if (dateFrom) {
        where.completedAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.completedAt.lte = new Date(dateTo)
      }
    }

    // Calcular offset
    const offset = (page - 1) * limit

    // Buscar resultados com paginação
    const [testResults, totalCount] = await Promise.all([
      prisma.testResult.findMany({
        where,
        include: {
          test: {
            include: {
              category: true
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          session: {
            select: {
              id: true,
              startedAt: true,
              completedAt: true,
              timeSpent: true
            }
          },
          ...(includeAI && {
            aiAnalyses: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          })
        },
        orderBy: {
          [sortBy]: sortOrder as 'asc' | 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.testResult.count({ where })
    ])

    // Calcular estatísticas gerais do colaborador
    const statistics = await calculateColaboradorStatistics(colaboradorId)

    // Formatar resultados
    const formattedResults = testResults.map(result => ({
      id: result.id,
      testId: result.testId,
      testName: result.test.name,
      testType: result.test.testType,
      category: result.test.category?.name || 'Sem categoria',
      completedAt: result.completedAt,
      duration: result.duration,
      overallScore: result.overallScore,
      dimensionScores: result.dimensionScores,
      interpretation: result.interpretation,
      recommendations: result.recommendations,
      session: result.session,
      aiAnalysis: includeAI && result.aiAnalyses?.[0] ? {
        id: result.aiAnalyses[0].id,
        analysis: result.aiAnalyses[0].analysis,
        
        createdAt: result.aiAnalyses[0].createdAt
      } : null,
      status: mapStatusToPortuguese(getResultStatus(result))
    }))

    // Calcular paginação
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        colaborador,
        results: formattedResults,
        statistics,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPreviousPage,
          limit
        }
      }
    })

  } catch (error) {
    console.error('Erro ao buscar resultados do colaborador:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para calcular estatísticas do colaborador
async function calculateColaboradorStatistics(colaboradorId: string) {
  try {
    // Buscar todos os resultados do colaborador
    const allResults = await prisma.testResult.findMany({
      where: {
        userId: colaboradorId
      },
      include: {
        test: {
          include: {
            category: true
          }
        },
        aiAnalyses: true
      }
    })

    // Calcular estatísticas básicas
    const totalTests = allResults.length
    const completedTests = allResults.filter(r => r.overallScore !== null).length
    const completionRate = totalTests > 0 ? (completedTests / totalTests) * 100 : 0

    // Calcular pontuação média
    const scoresWithValues = allResults.filter(r => r.overallScore !== null)
    const averageScore = scoresWithValues.length > 0 
      ? scoresWithValues.reduce((sum, r) => sum + (r.overallScore || 0), 0) / scoresWithValues.length
      : 0

    // Estatísticas por categoria
    const categoriesStats: { [key: string]: any } = {}
    allResults.forEach(result => {
      const categoryName = result.test.category?.name || 'Sem categoria'
      if (!categoriesStats[categoryName]) {
        categoriesStats[categoryName] = {
          total: 0,
          completed: 0,
          averageScore: 0,
          scores: []
        }
      }
      categoriesStats[categoryName].total++
      if (result.overallScore !== null) {
        categoriesStats[categoryName].completed++
        categoriesStats[categoryName].scores.push(result.overallScore)
      }
    })

    // Calcular médias por categoria
    Object.keys(categoriesStats).forEach(category => {
      const stats = categoriesStats[category]
      stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
      stats.averageScore = stats.scores.length > 0 
        ? stats.scores.reduce((sum: number, score: number) => sum + score, 0) / stats.scores.length
        : 0
      delete stats.scores // Remove array de scores para não enviar dados desnecessários
    })

    // Análises de IA
    const totalAIAnalyses = allResults.reduce((sum, r) => sum + r.aiAnalyses.length, 0)
    

    // Últimos testes realizados
    const recentTests = allResults
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 5)
      .map(result => ({
        id: result.id,
        testName: result.test.name,
        category: result.test.category?.name || 'Sem categoria',
        completedAt: result.completedAt,
        overallScore: result.overallScore
      }))

    return {
      totalTests,
      completedTests,
      completionRate: Math.round(completionRate * 100) / 100,
      averageScore: Math.round(averageScore * 100) / 100,
      categoriesStats,
      aiAnalyses: {
        total: totalAIAnalyses,

      },
      recentTests,
      lastTestDate: allResults.length > 0 
        ? allResults.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0].completedAt
        : null
    }

  } catch (error) {
    console.error('Erro ao calcular estatísticas do colaborador:', error)
    return {
      totalTests: 0,
      completedTests: 0,
      completionRate: 0,
      averageScore: 0,
      categoriesStats: {},
      aiAnalyses: { total: 0 },
      recentTests: [],
      lastTestDate: null
    }
  }
}

// Função para determinar o status do resultado
function getResultStatus(result: any): string {
  if (!result.completedAt) return 'PENDING'
  if (result.overallScore === null) return 'INCOMPLETE'
  return 'COMPLETED'
}

function mapStatusToPortuguese(status: string): string {
  const statusMap: { [key: string]: string } = {
    'COMPLETED': 'Concluído',
    'IN_PROGRESS': 'Em Progresso',
    'STARTED': 'Iniciado',
    'ABANDONED': 'Abandonado',
    'EXPIRED': 'Expirado',
    'PENDING': 'Pendente',
    'INCOMPLETE': 'Incompleto'
  }
  return statusMap[status] || status
}