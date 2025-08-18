// HumaniQ AI - API de Colaboradores da Empresa
// Lista todos os colaboradores da empresa com status de testes e estatísticas

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Listar todos os colaboradores da empresa com status de testes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.userType !== 'COMPANY') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas empresas podem acessar estes dados.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const department = searchParams.get('department')
    const status = searchParams.get('status') // pending, completed, risk, all
    const sortBy = searchParams.get('sortBy') || 'firstName'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Verificar se a empresa existe e está ativa
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

    // Construir filtros para colaboradores
    const where: any = {
      companyId: company.id,
      isActive: true,
      userType: {
        in: ['EMPLOYEE', 'CANDIDATE']
      }
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Calcular offset
    const offset = (page - 1) * limit

    // Buscar colaboradores
    const [colaboradores, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          userType: true,
          createdAt: true,
          lastLoginAt: true,
          erpEmployee: {
            select: {
              department: true,
              position: true
            }
          },
          testResults: {
            select: {
              id: true,
              completedAt: true,
              overallScore: true,
              test: {
                select: {
                  id: true,
                  name: true,
                  testType: true,
                  category: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            },
            orderBy: {
              completedAt: 'desc'
            }
          },
          testSessions: {
            select: {
              id: true,
              status: true,
              startedAt: true,
              test: {
                select: {
                  id: true,
                  name: true,
                  testType: true
                }
              }
            },
            where: {
              status: {
                in: ['STARTED', 'IN_PROGRESS']
              }
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder as 'asc' | 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    // Processar dados dos colaboradores
    const processedColaboradores = await Promise.all(
      colaboradores.map(async (colaborador) => {
        // Calcular estatísticas do colaborador
        const stats = calculateColaboradorStats(colaborador)
        
        // Determinar status geral
        const overallStatus = determineOverallStatus(colaborador)
        
        // Determinar nível de risco
        const riskLevel = determineRiskLevel(colaborador)
        
        return {
          id: colaborador.id,
          name: `${colaborador.firstName} ${colaborador.lastName}`,
          firstName: colaborador.firstName,
          lastName: colaborador.lastName,
          email: colaborador.email,
          userType: colaborador.userType,
          department: colaborador.erpEmployee?.department || 'Não informado',
          position: colaborador.erpEmployee?.position || 'Não informado',
          createdAt: colaborador.createdAt,
          lastLoginAt: colaborador.lastLoginAt,
          status: mapStatusToPortuguese(overallStatus),
          riskLevel,
          statistics: stats,
          lastEvaluation: stats.lastTestDate,
          avatar: null // Pode ser implementado futuramente
        }
      })
    )

    // Aplicar filtro de status se especificado
    let filteredColaboradores = processedColaboradores
    if (status && status !== 'all') {
      filteredColaboradores = processedColaboradores.filter(c => c.status === status)
    }

    // Aplicar filtro de departamento se especificado
    if (department && department !== 'all') {
      filteredColaboradores = filteredColaboradores.filter(c => 
        c.department.toLowerCase().includes(department.toLowerCase())
      )
    }

    // Calcular estatísticas gerais da empresa
    const companyStats = calculateCompanyStatistics(processedColaboradores)

    // Calcular paginação
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    // Garantir que sempre retornamos uma estrutura consistente
    return NextResponse.json({
      success: true,
      data: {
        colaboradores: filteredColaboradores || [],
        statistics: companyStats || {
          total: 0,
          byStatus: { completed: 0, pending: 0, inProgress: 0, risk: 0 },
          byRiskLevel: { low: 0, medium: 0, high: 0 },
          overallAverageScore: 0,
          overallCompletionRate: 0,
          departmentStats: {},
          lastUpdated: new Date().toISOString()
        },
        pagination: {
          currentPage: page,
          totalPages: totalPages || 1,
          totalCount: totalCount || 0,
          hasNextPage,
          hasPreviousPage,
          limit
        }
      }
    })

  } catch (error) {
    console.error('Erro ao buscar colaboradores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para calcular estatísticas do colaborador
function calculateColaboradorStats(colaborador: any) {
  const testResults = colaborador.testResults || []
  const testSessions = colaborador.testSessions || []
  
  const totalCompleted = testResults.length
  const totalInProgress = testSessions.length
  const totalTests = totalCompleted + totalInProgress
  
  const completionRate = totalTests > 0 ? (totalCompleted / totalTests) * 100 : 0
  
  // Calcular pontuação média
  const scoresWithValues = testResults.filter((r: any) => r.overallScore !== null)
  const averageScore = scoresWithValues.length > 0 
    ? scoresWithValues.reduce((sum: number, r: any) => sum + (r.overallScore || 0), 0) / scoresWithValues.length
    : 0
  
  // Último teste realizado
  const lastTestDate = testResults.length > 0 
    ? testResults[0].completedAt // Já ordenado por completedAt desc
    : null
  
  // Estatísticas por categoria
  const categoriesStats: { [key: string]: number } = {}
  testResults.forEach((result: any) => {
    const categoryName = result.test.category?.name || 'Sem categoria'
    categoriesStats[categoryName] = (categoriesStats[categoryName] || 0) + 1
  })
  
  return {
    totalTests,
    totalCompleted,
    totalInProgress,
    completionRate: Math.round(completionRate * 100) / 100,
    averageScore: Math.round(averageScore * 100) / 100,
    lastTestDate,
    categoriesStats
  }
}

// Função para determinar status geral do colaborador
function determineOverallStatus(colaborador: any): string {
  const testResults = colaborador.testResults || []
  const testSessions = colaborador.testSessions || []
  
  // Se tem testes em andamento
  if (testSessions.length > 0) {
    return 'in_progress'
  }
  
  // Se não tem nenhum teste
  if (testResults.length === 0) {
    return 'pending'
  }
  
  // Se tem testes concluídos, verificar se há algum com pontuação baixa
  const lowScoreTests = testResults.filter((r: any) => r.overallScore && r.overallScore < 40)
  if (lowScoreTests.length > 0) {
    return 'risk'
  }
  
  // Se tem testes concluídos sem problemas
  return 'completed'
}

// Função para determinar nível de risco
function determineRiskLevel(colaborador: any): string | null {
  const testResults = colaborador.testResults || []
  
  if (testResults.length === 0) {
    return null
  }
  
  // Calcular pontuação média
  const scoresWithValues = testResults.filter((r: any) => r.overallScore !== null)
  if (scoresWithValues.length === 0) {
    return null
  }
  
  const averageScore = scoresWithValues.reduce((sum: number, r: any) => sum + (r.overallScore || 0), 0) / scoresWithValues.length
  
  if (averageScore >= 70) {
    return 'low'
  } else if (averageScore >= 50) {
    return 'medium'
  } else {
    return 'high'
  }
}

// Função para calcular estatísticas gerais da empresa
function mapStatusToPortuguese(status: string): string {
  const statusMap: { [key: string]: string } = {
    'completed': 'Concluído',
    'in_progress': 'Em Progresso', 
    'pending': 'Pendente',
    'risk': 'Risco'
  }
  return statusMap[status] || status
}

function calculateCompanyStatistics(colaboradores: any[]) {
  const total = colaboradores.length
  const completed = colaboradores.filter(c => c.status === 'completed').length
  const pending = colaboradores.filter(c => c.status === 'pending').length
  const inProgress = colaboradores.filter(c => c.status === 'in_progress').length
  const risk = colaboradores.filter(c => c.status === 'risk').length
  
  // Níveis de risco
  const lowRisk = colaboradores.filter(c => c.riskLevel === 'low').length
  const mediumRisk = colaboradores.filter(c => c.riskLevel === 'medium').length
  const highRisk = colaboradores.filter(c => c.riskLevel === 'high').length
  
  // Pontuação média geral
  const colaboradoresWithScores = colaboradores.filter(c => c.statistics.averageScore > 0)
  const overallAverageScore = colaboradoresWithScores.length > 0
    ? colaboradoresWithScores.reduce((sum, c) => sum + c.statistics.averageScore, 0) / colaboradoresWithScores.length
    : 0
  
  // Taxa de conclusão geral
  const totalTests = colaboradores.reduce((sum, c) => sum + c.statistics.totalTests, 0)
  const totalCompleted = colaboradores.reduce((sum, c) => sum + c.statistics.totalCompleted, 0)
  const overallCompletionRate = totalTests > 0 ? (totalCompleted / totalTests) * 100 : 0
  
  // Departamentos
  const departmentStats: { [key: string]: number } = {}
  colaboradores.forEach(c => {
    const dept = c.department || 'Não informado'
    departmentStats[dept] = (departmentStats[dept] || 0) + 1
  })
  
  return {
    total,
    byStatus: {
      completed,
      pending,
      inProgress,
      risk
    },
    byRiskLevel: {
      low: lowRisk,
      medium: mediumRisk,
      high: highRisk
    },
    overallAverageScore: Math.round(overallAverageScore * 100) / 100,
    overallCompletionRate: Math.round(overallCompletionRate * 100) / 100,
    departmentStats,
    lastUpdated: new Date().toISOString()
  }
}