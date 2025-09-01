import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cacheService } from '../../../lib/cache/cacheService';
import { performanceMonitor } from '../../../lib/monitoring/performance';
import { logger } from '../../../lib/utils/logger';
// Removed unused imports: validateStatistics, StatisticsData

const prisma = new PrismaClient();

// Interface para filtros de estatísticas
interface StatisticsFilters {
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all';
  testIds?: string[];
  categoryIds?: string[];
  userIds?: string[];
  companyIds?: string[];
  startDate?: Date;
  endDate?: Date;
}

// Interface para resposta de estatísticas
interface StatisticsResponse {
  overview: {
    totalTests: number;
    totalResults: number;
    averageScore: number;
    completionRate: number;
    activeUsers: number;
    topPerformingTest: {
      id: string;
      name: string;
      averageScore: number;
      completions: number;
    } | null;
  };
  trends: {
    testsOverTime: Array<{
      period: string;
      count: number;
      averageScore: number;
    }>;
    userEngagement: Array<{
      period: string;
      activeUsers: number;
      newUsers: number;
    }>;
    categoryPerformance: Array<{
      categoryId: string;
      categoryName: string;
      averageScore: number;
      completions: number;
      trend: 'up' | 'down' | 'stable';
    }>;
  };
  distributions: {
    scoreDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
    testPopularity: Array<{
      testId: string;
      testName: string;
      completions: number;
      percentage: number;
    }>;
    userActivity: Array<{
      activityLevel: 'high' | 'medium' | 'low';
      userCount: number;
      percentage: number;
    }>;
  };
  comparisons: {
    periodComparison: {
      current: {
        period: string;
        totalResults: number;
        averageScore: number;
        activeUsers: number;
      };
      previous: {
        period: string;
        totalResults: number;
        averageScore: number;
        activeUsers: number;
      };
      changes: {
        resultsChange: number;
        scoreChange: number;
        usersChange: number;
      };
    };
    benchmarks: {
      industryAverage?: number;
      companyAverage?: number;
      departmentAverage?: number;
    };
  };
  insights: {
    topInsights: Array<{
      type: 'improvement' | 'concern' | 'achievement' | 'trend';
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      actionable: boolean;
    }>;
    recommendations: Array<{
      category: string;
      recommendation: string;
      priority: 'high' | 'medium' | 'low';
      estimatedImpact: string;
    }>;
  };
  metadata: {
    generatedAt: string;
    period: string;
    filters: StatisticsFilters;
    executionTime: number;
    cacheHit: boolean;
    dataFreshness: string;
  };
}

// GET - Buscar estatísticas completas
export async function GET(request: NextRequest) {
  const start = Date.now();
  let cacheHit = false;

  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Extrair parâmetros da query
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    // Construir filtros
    const filters: StatisticsFilters = {
      period: (queryParams.period as any) || 'month',
      testIds: queryParams.testIds ? queryParams.testIds.split(',') : undefined,
      categoryIds: queryParams.categoryIds ? queryParams.categoryIds.split(',') : undefined,
      userIds: queryParams.userIds ? queryParams.userIds.split(',') : undefined,
      companyIds: queryParams.companyIds ? queryParams.companyIds.split(',') : undefined,
      startDate: queryParams.startDate ? new Date(queryParams.startDate) : undefined,
      endDate: queryParams.endDate ? new Date(queryParams.endDate) : undefined
    };

    // Calcular período baseado no filtro
    const { startDate, endDate } = calculatePeriod(filters.period || 'month', filters.startDate, filters.endDate);
    filters.startDate = startDate;
    filters.endDate = endDate;

    // Gerar chave de cache
    const cacheKey = `statistics:${JSON.stringify({
      userId: session.user.id,
      userRole: session.user.userType,
      filters
    })}`;

    // Tentar buscar do cache
    const cachedResult = await cacheService.get<StatisticsResponse>('user_statistics', cacheKey);
    if (cachedResult) {
      cacheHit = true;
      
      performanceMonitor.recordMetric(
        'statistics_request_duration',
        Date.now() - start,
        'ms',
        { cache_hit: 'true', user_id: session.user.id }
      );

      return NextResponse.json({
        ...cachedResult,
        metadata: {
          ...cachedResult.metadata,
          executionTime: Date.now() - start,
          cacheHit: true
        }
      });
    }

    // Construir cláusula WHERE baseada em permissões
    const whereClause = buildWhereClause(filters, session.user.id, session.user.userType);

    // Executar todas as queries em paralelo para melhor performance
    const [overview, trends, distributions, comparisons] = await Promise.all([
      generateOverview(whereClause, filters),
      generateTrends(whereClause, filters),
      generateDistributions(whereClause, filters),
      generateComparisons(whereClause, filters, session.user.userType)
    ]);

    // Gerar insights baseados nos dados
    const insights = await generateInsights(overview, trends, distributions, comparisons);

    // Construir resposta completa
    const response: StatisticsResponse = {
      overview,
      trends,
      distributions,
      comparisons,
      insights,
      metadata: {
        generatedAt: new Date().toISOString(),
        period: `${filters.startDate?.toISOString().split('T')[0]} - ${filters.endDate?.toISOString().split('T')[0]}`,
        filters,
        executionTime: Date.now() - start,
        cacheHit: false,
        dataFreshness: 'real-time'
      }
    };

    // Salvar no cache (TTL de 10 minutos para estatísticas)
    await cacheService.set('user_statistics', cacheKey, response, 600);

    // Registrar métricas
    performanceMonitor.recordMetric(
      'statistics_request_duration',
      response.metadata.executionTime,
      'ms',
      { 
        cache_hit: 'false', 
        user_id: session.user.id,
        period: filters.period || 'month'
      }
    );

    logger.info('Estatísticas geradas com sucesso', {
      userId: session.user.id,
      period: filters.period,
      executionTime: response.metadata.executionTime,
      cacheHit: false
    });

    return NextResponse.json(response);

  } catch (error) {
    const executionTime = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    performanceMonitor.recordMetric(
      'statistics_request_duration',
      executionTime,
      'ms',
      { 
        cache_hit: cacheHit.toString(),
        success: 'false',
        error: errorMessage
      }
    );

    logger.error('Erro ao gerar estatísticas', {
      error: errorMessage,
      executionTime,
      cacheHit
    });

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// Calcular período baseado no filtro
function calculatePeriod(period: string, customStart?: Date, customEnd?: Date) {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = customEnd || now;

  if (customStart && customEnd) {
    return { startDate: customStart, endDate: customEnd };
  }

  switch (period) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterStart, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'all':
    default:
      startDate = new Date(2020, 0, 1); // Data arbitrária no passado
      break;
  }

  return { startDate, endDate };
}

// Construir cláusula WHERE
function buildWhereClause(filters: StatisticsFilters, userId: string, userRole?: string) {
  const where: any = {};

  // Filtro de segurança
  if (userRole !== 'ADMIN' && userRole !== 'COMPANY_ADMIN') {
    where.userId = userId;
  }

  // Filtros de data
  if (filters.startDate || filters.endDate) {
    where.completedAt = {};
    if (filters.startDate) where.completedAt.gte = filters.startDate;
    if (filters.endDate) where.completedAt.lte = filters.endDate;
  }

  // Outros filtros
  if (filters.testIds?.length) {
    where.testId = { in: filters.testIds };
  }

  if (filters.categoryIds?.length) {
    where.test = {
      categoryId: { in: filters.categoryIds }
    };
  }

  if (filters.userIds?.length && (userRole === 'ADMIN' || userRole === 'COMPANY_ADMIN')) {
    where.userId = { in: filters.userIds };
  }

  if (filters.companyIds?.length && userRole === 'ADMIN') {
    where.companyId = { in: filters.companyIds };
  }

  return where;
}

// Gerar visão geral
async function generateOverview(whereClause: any, filters: StatisticsFilters) {
  const [totalTests, totalResults, avgScore, completionData, activeUsers, topTest] = await Promise.all([
    // Total de testes disponíveis
    prisma.test.count({
      where: filters.categoryIds?.length ? {
        categoryId: { in: filters.categoryIds }
      } : undefined
    }),
    
    // Total de resultados
    prisma.testResult.count({ where: whereClause }),
    
    // Pontuação média
    prisma.testResult.aggregate({
      where: whereClause,
      _avg: { overallScore: true }
    }),
    
    // Dados de conclusão
    prisma.testSession.aggregate({
      where: {
        ...whereClause,
        status: { in: ['COMPLETED', 'IN_PROGRESS'] }
      },
      _count: { id: true }
    }),
    
    // Usuários ativos
    prisma.testResult.findMany({
      where: whereClause,
      select: { userId: true },
      distinct: ['userId']
    }),
    
    // Teste com melhor performance
    prisma.testResult.groupBy({
      by: ['testId'],
      where: whereClause,
      _avg: { overallScore: true },
      _count: { id: true },
      orderBy: { _avg: { overallScore: 'desc' } },
      take: 1
    })
  ]);

  let topPerformingTest = null;
  if (topTest.length > 0) {
    const testDetails = await prisma.test.findUnique({
      where: { id: topTest[0].testId },
      select: { id: true, name: true }
    });
    
    if (testDetails) {
      topPerformingTest = {
        id: testDetails.id,
        name: testDetails.name,
        averageScore: Math.round(topTest[0]._avg.overallScore || 0),
        completions: topTest[0]._count.id
      };
    }
  }

  return {
    totalTests,
    totalResults,
    averageScore: Math.round(avgScore._avg.overallScore || 0),
    completionRate: totalTests > 0 ? Math.round((totalResults / totalTests) * 100) : 0,
    activeUsers: activeUsers.length,
    topPerformingTest
  };
}

// Gerar tendências
async function generateTrends(whereClause: any, filters: StatisticsFilters) {
  const period = filters.period || 'month';
  const dateFormat = getDateFormat(period);
  
  const [testsOverTime, userEngagement, categoryPerformance] = await Promise.all([
    // Testes ao longo do tempo
    prisma.$queryRaw`
      SELECT 
        ${dateFormat} as period,
        COUNT(*) as count,
        AVG(overall_score) as averageScore
      FROM test_results 
        WHERE completed_at >= ${filters.startDate} 
          AND completed_at <= ${filters.endDate}
      GROUP BY period
      ORDER BY period ASC
    `,
    
    // Engajamento de usuários
    prisma.$queryRaw`
      SELECT 
        ${dateFormat} as period,
        COUNT(DISTINCT user_id) as activeUsers,
        COUNT(DISTINCT CASE WHEN created_at >= ${filters.startDate} THEN user_id END) as newUsers
      FROM test_results 
      WHERE completed_at >= ${filters.startDate} 
        AND completed_at <= ${filters.endDate}
      GROUP BY period
      ORDER BY period ASC
    `,
    
    // Performance por categoria
    prisma.testResult.groupBy({
      by: ['testId'],
      where: whereClause,
      _avg: { overallScore: true },
      _count: { id: true }
    })
  ]);

  // Processar performance por categoria
  const categoryData = await Promise.all(
    categoryPerformance.map(async (item: any) => {
      const test = await prisma.test.findUnique({
        where: { id: item.testId },
        include: { category: true }
      });
      
      return {
        categoryId: test?.category?.id || '',
        categoryName: test?.category?.name || 'Sem categoria',
        averageScore: Math.round(item._avg.overallScore || 0),
        completions: item._count.id,
        trend: 'stable' as const // Simplificado - poderia calcular tendência real
      };
    })
  );

  return {
    testsOverTime: testsOverTime as any[],
    userEngagement: userEngagement as any[],
    categoryPerformance: categoryData
  };
}

// Gerar distribuições
async function generateDistributions(whereClause: any, filters: StatisticsFilters) {
  const [scoreDistribution, testPopularity, userActivityData] = await Promise.all([
    // Distribuição de pontuações
    prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN overall_score >= 90 THEN '90-100'
        WHEN overall_score >= 80 THEN '80-89'
        WHEN overall_score >= 70 THEN '70-79'
        WHEN overall_score >= 60 THEN '60-69'
        WHEN overall_score >= 50 THEN '50-59'
          ELSE '0-49'
        END as range,
        COUNT(*) as count
      FROM test_results 
      WHERE completed_at >= ${filters.startDate} 
        AND completed_at <= ${filters.endDate}
      GROUP BY range
      ORDER BY range DESC
    `,
    
    // Popularidade dos testes
    prisma.testResult.groupBy({
      by: ['testId'],
      where: whereClause,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    }),
    
    // Atividade dos usuários
    prisma.$queryRaw`
      SELECT 
        user_id as userId,
        COUNT(*) as testCount
      FROM test_results 
      WHERE completed_at >= ${filters.startDate} 
        AND completed_at <= ${filters.endDate}
      GROUP BY user_id
    `
  ]);

  // Processar popularidade dos testes
  const testPopularityData = await Promise.all(
    (testPopularity as any[]).map(async (item) => {
      const test = await prisma.test.findUnique({
        where: { id: item.testId },
        select: { id: true, name: true }
      });
      
      return {
        testId: item.testId,
        testName: test?.name || 'Teste não encontrado',
        completions: item._count.id,
        percentage: 0 // Será calculado depois
      };
    })
  );

  // Calcular percentuais
  const totalCompletions = testPopularityData.reduce((sum, item) => sum + item.completions, 0);
  testPopularityData.forEach(item => {
    item.percentage = totalCompletions > 0 ? Math.round((item.completions / totalCompletions) * 100) : 0;
  });

  // Processar atividade dos usuários
  const userActivity = (userActivityData as any[]).reduce((acc, user) => {
    const testCount = user.testCount;
    let level: 'high' | 'medium' | 'low';
    
    if (testCount >= 10) level = 'high';
    else if (testCount >= 3) level = 'medium';
    else level = 'low';
    
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  const totalUsers = Object.values(userActivity).reduce((sum: number, count: any) => sum + count, 0);
  const userActivityArray = Object.entries(userActivity).map(([level, count]: [string, any]) => ({
    activityLevel: level as 'high' | 'medium' | 'low',
    userCount: count,
    percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
  }));

  return {
    scoreDistribution: (scoreDistribution as any[]).map(item => ({
      ...item,
      percentage: Math.round((item.count / (scoreDistribution as any[]).reduce((sum, i) => sum + i.count, 0)) * 100)
    })),
    testPopularity: testPopularityData,
    userActivity: userActivityArray
  };
}

// Gerar comparações
async function generateComparisons(whereClause: any, filters: StatisticsFilters, userRole?: string) {
  // Calcular período anterior
  const { startDate: prevStart, endDate: prevEnd } = calculatePreviousPeriod(filters.startDate!, filters.endDate!);
  
  const prevWhereClause = {
    ...whereClause,
    completedAt: {
      gte: prevStart,
      lte: prevEnd
    }
  };

  const [currentStats, previousStats] = await Promise.all([
    // Estatísticas do período atual
    prisma.testResult.aggregate({
      where: whereClause,
      _count: { id: true },
      _avg: { overallScore: true }
    }),
    
    // Estatísticas do período anterior
    prisma.testResult.aggregate({
      where: prevWhereClause,
      _count: { id: true },
      _avg: { overallScore: true }
    })
  ]);

  const [currentUsers, previousUsers] = await Promise.all([
    prisma.testResult.findMany({
      where: whereClause,
      select: { userId: true },
      distinct: ['userId']
    }),
    prisma.testResult.findMany({
      where: prevWhereClause,
      select: { userId: true },
      distinct: ['userId']
    })
  ]);

  const current = {
    period: `${filters.startDate?.toISOString().split('T')[0]} - ${filters.endDate?.toISOString().split('T')[0]}`,
    totalResults: currentStats._count.id,
    averageScore: Math.round(currentStats._avg.overallScore || 0),
    activeUsers: currentUsers.length
  };

  const previous = {
    period: `${prevStart.toISOString().split('T')[0]} - ${prevEnd.toISOString().split('T')[0]}`,
    totalResults: previousStats._count.id,
    averageScore: Math.round(previousStats._avg.overallScore || 0),
    activeUsers: previousUsers.length
  };

  const changes = {
    resultsChange: previous.totalResults > 0 
      ? Math.round(((current.totalResults - previous.totalResults) / previous.totalResults) * 100)
      : 0,
    scoreChange: previous.averageScore > 0 
      ? Math.round(((current.averageScore - previous.averageScore) / previous.averageScore) * 100)
      : 0,
    usersChange: previous.activeUsers > 0 
      ? Math.round(((current.activeUsers - previous.activeUsers) / previous.activeUsers) * 100)
      : 0
  };

  return {
    periodComparison: {
      current,
      previous,
      changes
    },
    benchmarks: {
      industryAverage: 75, // Valor exemplo
      companyAverage: current.averageScore,
      departmentAverage: current.averageScore
    }
  };
}

// Gerar insights
async function generateInsights(overview: any, trends: any, distributions: any, comparisons: any) {
  const insights = [];
  const recommendations = [];

  // Análise de performance
  if (overview.averageScore >= 85) {
    insights.push({
      type: 'achievement' as const,
      title: 'Excelente Performance',
      description: `A pontuação média de ${overview.averageScore}% está acima da média esperada.`,
      impact: 'high' as const,
      actionable: false
    });
  } else if (overview.averageScore < 60) {
    insights.push({
      type: 'concern' as const,
      title: 'Performance Abaixo do Esperado',
      description: `A pontuação média de ${overview.averageScore}% indica necessidade de melhoria.`,
      impact: 'high' as const,
      actionable: true
    });
    
    recommendations.push({
      category: 'Treinamento',
      recommendation: 'Implementar programa de capacitação focado nas áreas com menor performance.',
      priority: 'high' as const,
      estimatedImpact: 'Aumento de 15-25% na pontuação média'
    });
  }

  // Análise de engajamento
  if (overview.activeUsers < 10) {
    insights.push({
      type: 'concern' as const,
      title: 'Baixo Engajamento',
      description: `Apenas ${overview.activeUsers} usuários ativos no período.`,
      impact: 'medium' as const,
      actionable: true
    });
    
    recommendations.push({
      category: 'Engajamento',
      recommendation: 'Criar campanhas de incentivo e gamificação para aumentar participação.',
      priority: 'medium' as const,
      estimatedImpact: 'Aumento de 30-50% no engajamento'
    });
  }

  // Análise de tendências
  if (comparisons.periodComparison.changes.resultsChange > 20) {
    insights.push({
      type: 'improvement' as const,
      title: 'Crescimento Significativo',
      description: `Aumento de ${comparisons.periodComparison.changes.resultsChange}% nos testes realizados.`,
      impact: 'high' as const,
      actionable: false
    });
  }

  return {
    topInsights: insights.slice(0, 5),
    recommendations: recommendations.slice(0, 3)
  };
}

// Utilitários
function getDateFormat(period: string): string {
  switch (period) {
    case 'day':
      return 'DATE(completedAt)';
    case 'week':
      return 'YEARWEEK(completedAt)';
    case 'month':
      return 'DATE_FORMAT(completedAt, "%Y-%m")';
    case 'quarter':
      return 'CONCAT(YEAR(completedAt), "-Q", QUARTER(completedAt))';
    case 'year':
      return 'YEAR(completedAt)';
    default:
      return 'DATE_FORMAT(completedAt, "%Y-%m")';
  }
}

function calculatePreviousPeriod(startDate: Date, endDate: Date) {
  const duration = endDate.getTime() - startDate.getTime();
  const prevEnd = new Date(startDate.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - duration);
  
  return { startDate: prevStart, endDate: prevEnd };
}