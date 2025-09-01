import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cacheService } from '../../../lib/cache/cacheService';
import { performanceMonitor } from '../../../lib/monitoring/performance';
import { logger } from '../../../lib/utils/logger';
import { 
  validateResultsQuery, 
  PaginationSchema,
  type ResultsQuery,
  type Pagination 
} from '../../../lib/validation/schemas';

const prisma = new PrismaClient();

// Interface para filtros avançados
interface AdvancedFilters {
  testIds?: string[];
  categoryIds?: string[];
  scoreRange?: { min: number; max: number };
  dateRange?: { start: Date; end: Date };
  userIds?: string[];
  companyIds?: string[];
  status?: string[];
  hasAiAnalysis?: boolean;
  tags?: string[];
}

// Interface para ordenação
interface SortOptions {
  field: 'score' | 'completedAt' | 'createdAt' | 'testName' | 'userName';
  direction: 'asc' | 'desc';
}

// Interface para agregações
interface AggregationOptions {
  includeStats?: boolean;
  includeDistribution?: boolean;
  includeTimeSeries?: boolean;
  groupBy?: 'test' | 'category' | 'user' | 'company' | 'month' | 'week';
}

// Interface para resposta da API
interface AdvancedResultsResponse {
  results: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  aggregations?: {
    stats?: {
      avgScore: number;
      minScore: number;
      maxScore: number;
      totalResults: number;
    };
    distribution?: Array<{ range: string; count: number }>;
    timeSeries?: Array<{ period: string; count: number; avgScore: number }>;
    groupedData?: Record<string, any>;
  };
  filters: AdvancedFilters;
  sort: SortOptions;
  executionTime: number;
  cacheHit: boolean;
}

// GET - Buscar resultados com filtros avançados
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
    
    // Validar parâmetros de paginação
    const paginationData = {
      page: parseInt(queryParams.page || '1'),
      limit: Math.min(parseInt(queryParams.limit || '20'), 100), // Máximo 100 por página
      offset: 0
    };
    paginationData.offset = (paginationData.page - 1) * paginationData.limit;

    try {
      PaginationSchema.parse({
        page: paginationData.page,
        limit: paginationData.limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      });
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Parâmetros de paginação inválidos',
          details: error
        },
        { status: 400 }
      );
    }

    // Construir filtros avançados
    const filters: AdvancedFilters = {
      testIds: queryParams.testIds ? queryParams.testIds.split(',') : undefined,
      categoryIds: queryParams.categoryIds ? queryParams.categoryIds.split(',') : undefined,
      scoreRange: queryParams.minScore || queryParams.maxScore ? {
        min: parseInt(queryParams.minScore || '0'),
        max: parseInt(queryParams.maxScore || '100')
      } : undefined,
      dateRange: queryParams.startDate || queryParams.endDate ? {
        start: queryParams.startDate ? new Date(queryParams.startDate) : new Date(0),
        end: queryParams.endDate ? new Date(queryParams.endDate) : new Date()
      } : undefined,
      userIds: queryParams.userIds ? queryParams.userIds.split(',') : undefined,
      companyIds: queryParams.companyIds ? queryParams.companyIds.split(',') : undefined,
      status: queryParams.status ? queryParams.status.split(',') : undefined,
      hasAiAnalysis: queryParams.hasAiAnalysis === 'true',
      tags: queryParams.tags ? queryParams.tags.split(',') : undefined
    };

    // Configurar ordenação
    const sort: SortOptions = {
      field: (queryParams.sortBy as any) || 'completedAt',
      direction: (queryParams.sortDir as 'asc' | 'desc') || 'desc'
    };

    // Configurar agregações
    const aggregations: AggregationOptions = {
      includeStats: queryParams.includeStats === 'true',
      includeDistribution: queryParams.includeDistribution === 'true',
      includeTimeSeries: queryParams.includeTimeSeries === 'true',
      groupBy: queryParams.groupBy as any
    };

    // Gerar chave de cache
    const cacheKey = `advanced_results:${JSON.stringify({
      userId: session.user.id,
      filters,
      sort,
      pagination: paginationData,
      aggregations
    })}`;

    // Tentar buscar do cache
    const cachedResult = await cacheService.get<AdvancedResultsResponse>('user_results', cacheKey);
    if (cachedResult) {
      cacheHit = true;
      
      performanceMonitor.recordMetric(
        'advanced_results_request_duration',
        Date.now() - start,
        'ms',
        { cache_hit: 'true', user_id: session.user.id }
      );

      return NextResponse.json({
        ...cachedResult,
        executionTime: Date.now() - start,
        cacheHit: true
      });
    }

    // Construir query do Prisma
    const whereClause = await buildWhereClause(filters, session.user.id, session.user.userType);
    const orderByClause = buildOrderByClause(sort);

    // Executar queries em paralelo
    const [results, totalCount, aggregationData] = await Promise.all([
      // Buscar resultados
      prisma.testResult.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip: paginationData.offset,
        take: paginationData.limit,
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
              status: true,
              company: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          aiAnalyses: {
            select: {
              id: true,
              analysis: true,
              createdAt: true
            }
          }
        }
      }),
      
      // Contar total
      prisma.testResult.count({
        where: whereClause
      }),
      
      // Buscar agregações se solicitado
      aggregations.includeStats || aggregations.includeDistribution || aggregations.includeTimeSeries
        ? buildAggregations(whereClause, aggregations)
        : Promise.resolve({})
    ]);

    // Calcular paginação
    const totalPages = Math.ceil(totalCount / paginationData.limit);
    const pagination = {
      page: paginationData.page,
      limit: paginationData.limit,
      total: totalCount,
      totalPages,
      hasNext: paginationData.page < totalPages,
      hasPrev: paginationData.page > 1
    };

    // Construir resposta
    const response: AdvancedResultsResponse = {
      results,
      pagination,
      aggregations: Object.keys(aggregationData).length > 0 ? aggregationData : undefined,
      filters,
      sort,
      executionTime: Date.now() - start,
      cacheHit: false
    };

    // Salvar no cache (TTL de 5 minutos)
    await cacheService.set('user_results', cacheKey, response, 300);

    // Registrar métricas
    performanceMonitor.recordMetric(
      'advanced_results_request_duration',
      response.executionTime,
      'ms',
      { 
        cache_hit: 'false', 
        user_id: session.user.id,
        result_count: results.length.toString(),
        total_count: totalCount.toString()
      }
    );

    logger.info('Resultados avançados buscados com sucesso', {
      userId: session.user.id,
      resultCount: results.length,
      totalCount,
      executionTime: response.executionTime,
      filters,
      cacheHit: false
    });

    return NextResponse.json(response);

  } catch (error) {
    const executionTime = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    performanceMonitor.recordMetric(
      'advanced_results_request_duration',
      executionTime,
      'ms',
      { 
        cache_hit: cacheHit.toString(),
        success: 'false',
        error: errorMessage
      }
    );

    logger.error('Erro ao buscar resultados avançados', {
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

// Construir cláusula WHERE do Prisma
async function buildWhereClause(filters: AdvancedFilters, userId: string, userType?: string) {
  const where: any = {};

  // Filtro de segurança - usuários só veem seus próprios resultados (exceto admins)
  if (userType !== 'ADMIN' && userType !== 'COMPANY') {
    where.userId = userId;
  }

  // Filtros por IDs de teste
  if (filters.testIds && filters.testIds.length > 0) {
    where.testId = {
      in: filters.testIds
    };
  }

  // Filtros por categorias
  if (filters.categoryIds && filters.categoryIds.length > 0) {
    where.test = {
      categoryId: {
        in: filters.categoryIds
      }
    };
  }

  // Filtro por faixa de pontuação
  if (filters.scoreRange) {
    where.score = {
      gte: filters.scoreRange.min,
      lte: filters.scoreRange.max
    };
  }

  // Filtro por faixa de data
  if (filters.dateRange) {
    where.completedAt = {
      gte: filters.dateRange.start,
      lte: filters.dateRange.end
    };
  }

  // Filtros por usuários (apenas para admins)
  if (filters.userIds && filters.userIds.length > 0 && (userType === 'ADMIN' || userType === 'COMPANY')) {
    where.userId = {
      in: filters.userIds
    };
  }

  // Filtros por empresas (apenas para admins)
  if (filters.companyIds && filters.companyIds.length > 0 && userType === 'ADMIN') {
    where.companyId = {
      in: filters.companyIds
    };
  }

  // Filtro por análise de IA
  if (filters.hasAiAnalysis !== undefined) {
    if (filters.hasAiAnalysis) {
      where.aiAnalyses = {
        some: {}
      };
    } else {
      where.aiAnalyses = {
        none: {}
      };
    }
  }

  return where;
}

// Construir cláusula ORDER BY do Prisma
function buildOrderByClause(sort: SortOptions) {
  const orderBy: any = {};

  switch (sort.field) {
    case 'score':
      orderBy.overallScore = sort.direction;
      break;
    case 'completedAt':
      orderBy.completedAt = sort.direction;
      break;
    case 'createdAt':
      orderBy.createdAt = sort.direction;
      break;
    case 'testName':
      orderBy.test = {
        name: sort.direction
      };
      break;
    case 'userName':
      orderBy.user = {
        name: sort.direction
      };
      break;
    default:
      orderBy.completedAt = 'desc';
  }

  return orderBy;
}

// Construir agregações
async function buildAggregations(whereClause: any, options: AggregationOptions) {
  const aggregations: any = {};

  try {
    // Estatísticas básicas
    if (options.includeStats) {
      const stats = await prisma.testResult.aggregate({
        where: whereClause,
        _avg: {
          overallScore: true
        },
        _min: {
          overallScore: true
        },
        _max: {
          overallScore: true
        },
        _count: {
          id: true
        }
      });

      aggregations.stats = {
        avgScore: Math.round(stats._avg.overallScore || 0),
        minScore: stats._min.overallScore || 0,
        maxScore: stats._max.overallScore || 0,
        totalResults: stats._count.id
      };
    }

    // Distribuição de pontuações
    if (options.includeDistribution) {
      const distribution = await prisma.$queryRaw`
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
        WHERE ${whereClause ? Object.keys(whereClause).map(key => `${key} = ${whereClause[key]}`).join(' AND ') : '1=1'}
        GROUP BY range
        ORDER BY range DESC
      `;

      aggregations.distribution = distribution;
    }

    // Série temporal
    if (options.includeTimeSeries) {
      const timeSeries = await prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(completed_at, '%Y-%m') as period,
          COUNT(*) as count,
          AVG(overall_score) as avgScore
        FROM test_results 
        WHERE ${whereClause ? Object.keys(whereClause).map(key => `${key} = ${whereClause[key]}`).join(' AND ') : '1=1'}
          AND completed_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY period
        ORDER BY period ASC
      `;

      aggregations.timeSeries = timeSeries;
    }

    // Agrupamento personalizado
    if (options.groupBy) {
      switch (options.groupBy) {
        case 'test':
          const byTest = await prisma.testResult.groupBy({
            by: ['testId'],
            where: whereClause,
            _count: {
              id: true
            },
            _avg: {
              overallScore: true
            }
          });
          aggregations.groupedData = byTest;
          break;
          
        case 'category':
          const byCategory = await prisma.testResult.groupBy({
            by: ['testId'],
            where: whereClause,
            _count: {
              id: true
            },
            _avg: {
              overallScore: true
            }
          });
          aggregations.groupedData = byCategory;
          break;
      }
    }

    return aggregations;
  } catch (error) {
    logger.warn('Erro ao construir agregações', {
      error: error instanceof Error ? error.message : String(error),
      options
    });
    return {};
  }
}

// POST - Exportar resultados
export async function POST(request: NextRequest) {
  const start = Date.now();

  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { filters, format = 'json', includeDetails = false } = body;

    // Validar formato
    if (!['json', 'csv', 'xlsx'].includes(format)) {
      return NextResponse.json(
        { error: 'Formato não suportado' },
        { status: 400 }
      );
    }

    // Construir query
    const whereClause = await buildWhereClause(filters || {}, session.user.id, session.user.userType);
    
    // Buscar resultados (limitado a 10000 para exportação)
    const results = await prisma.testResult.findMany({
      where: whereClause,
      take: 10000,
      include: includeDetails ? {
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
          include: {
            company: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        aiAnalyses: true
      } : {
        test: {
          select: {
            name: true,
            category: {
              select: {
                name: true
              }
            }
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        session: {
          select: {
            company: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    const executionTime = Date.now() - start;

    // Registrar métricas
    performanceMonitor.recordMetric(
      'export_results_duration',
      executionTime,
      'ms',
      { 
        format,
        result_count: results.length.toString(),
        include_details: includeDetails.toString()
      }
    );

    logger.info('Resultados exportados', {
      userId: session.user.id,
      format,
      resultCount: results.length,
      includeDetails,
      executionTime
    });

    // Retornar dados baseado no formato
    switch (format) {
      case 'json':
        return NextResponse.json({
          results,
          exportInfo: {
            format,
            count: results.length,
            exportedAt: new Date().toISOString(),
            executionTime
          }
        });
        
      case 'csv':
        const csv = convertToCSV(results);
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="test-results-${new Date().toISOString().split('T')[0]}.csv"`
          }
        });
        
      default:
        return NextResponse.json({
          results,
          exportInfo: {
            format,
            count: results.length,
            exportedAt: new Date().toISOString(),
            executionTime
          }
        });
    }

  } catch (error) {
    const executionTime = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    performanceMonitor.recordMetric(
      'export_results_duration',
      executionTime,
      'ms',
      { success: 'false', error: errorMessage }
    );

    logger.error('Erro ao exportar resultados', {
      error: errorMessage,
      executionTime
    });

    return NextResponse.json(
      { error: 'Erro ao exportar resultados' },
      { status: 500 }
    );
  }
}

// Converter resultados para CSV
function convertToCSV(results: any[]): string {
  if (results.length === 0) {
    return 'Nenhum resultado encontrado';
  }

  const headers = [
    'ID',
    'Usuário',
    'Email',
    'Empresa',
    'Teste',
    'Categoria',
    'Pontuação',
    'Data de Conclusão',
    'Tem Análise IA'
  ];

  const rows = results.map(result => [
    result.id,
    `${result.user?.firstName || ''} ${result.user?.lastName || ''}`.trim(),
    result.user?.email || '',
    result.session?.company?.name || '',
    result.test?.name || '',
    result.test?.category?.name || '',
    result.overallScore,
    result.completedAt?.toISOString() || '',
    result.aiAnalyses && result.aiAnalyses.length > 0 ? 'Sim' : 'Não'
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}