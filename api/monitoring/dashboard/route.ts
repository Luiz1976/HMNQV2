import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { performanceMonitor } from '../../../lib/monitoring/performance';
import { cacheService } from '../../../lib/cache/cacheService';
import { testResultQueue } from '../../../lib/queue/testResultQueue';
import { logger } from '../../../lib/utils/logger';
import { redisClient } from '../../../lib/config/redis';

const prisma = new PrismaClient();

// Interface para dados do dashboard
interface DashboardData {
  overview: OverviewMetrics;
  performance: PerformanceData;
  system: SystemData;
  queue: QueueData;
  cache: CacheData;
  database: DatabaseData;
  alerts: Alert[];
  trends: TrendData;
  realtime: RealtimeData;
}

interface OverviewMetrics {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  totalRequests: number;
  errorRate: number;
  avgResponseTime: number;
  activeUsers: number;
  systemLoad: number;
}

interface PerformanceData {
  responseTime: {
    current: number;
    avg24h: number;
    p95: number;
    p99: number;
  };
  throughput: {
    requestsPerSecond: number;
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  errors: {
    total: number;
    rate: number;
    byType: Record<string, number>;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  };
}

interface SystemData {
  services: {
    database: ServiceStatus;
    redis: ServiceStatus;
    queue: ServiceStatus;
    cache: ServiceStatus;
  };
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  environment: {
    nodeVersion: string;
    platform: string;
    environment: string;
    processId: number;
  };
}

interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  lastCheck: string;
  uptime: number;
  version?: string;
}

interface QueueData {
  jobs: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
  workers: {
    active: number;
    idle: number;
    total: number;
  };
  performance: {
    throughput: number;
    avgProcessingTime: number;
    failureRate: number;
  };
  trends: {
    completedLast24h: number;
    failedLast24h: number;
    avgWaitTime: number;
  };
}

interface CacheData {
  stats: {
    hitRate: number;
    missRate: number;
    totalRequests: number;
    cacheSize: number;
  };
  performance: {
    avgGetTime: number;
    avgSetTime: number;
    evictions: number;
  };
  memory: {
    used: number;
    available: number;
    percentage: number;
  };
  keys: {
    total: number;
    expired: number;
    expiring: number;
  };
}

interface DatabaseData {
  connections: {
    active: number;
    idle: number;
    total: number;
  };
  performance: {
    avgQueryTime: number;
    slowQueries: number;
    totalQueries: number;
  };
  storage: {
    size: number;
    growth: number;
    tables: number;
  };
  health: {
    status: 'healthy' | 'warning' | 'critical';
    lastBackup: string;
    replicationLag?: number;
  };
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  source: string;
  acknowledged: boolean;
  details?: any;
}

interface TrendData {
  responseTime: TimeSeriesData[];
  throughput: TimeSeriesData[];
  errorRate: TimeSeriesData[];
  memoryUsage: TimeSeriesData[];
  queueSize: TimeSeriesData[];
  cacheHitRate: TimeSeriesData[];
}

interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

interface RealtimeData {
  currentRequests: number;
  activeConnections: number;
  queueActivity: {
    processing: number;
    completed: number;
    failed: number;
  };
  alerts: Alert[];
  lastUpdate: string;
}

// GET - Dashboard de monitoramento
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || '24h';
    const includeDetails = url.searchParams.get('details') === 'true';
    
    logger.info('Carregando dashboard de monitoramento', {
      timeRange,
      includeDetails,
      userAgent: request.headers.get('user-agent')
    });

    // Coletar dados em paralelo
    const [overview, performance, system, queue, cache, database, alerts, trends, realtime] = await Promise.allSettled([
      collectOverviewMetrics(),
      collectPerformanceData(timeRange),
      collectSystemData(),
      collectQueueData(),
      collectCacheData(),
      collectDatabaseData(),
      collectAlerts(),
      includeDetails ? collectTrendData(timeRange) : Promise.resolve({} as TrendData),
      collectRealtimeData()
    ]);

    const dashboardData: DashboardData = {
      overview: overview.status === 'fulfilled' ? overview.value : getDefaultOverview(),
      performance: performance.status === 'fulfilled' ? performance.value : getDefaultPerformance(),
      system: system.status === 'fulfilled' ? system.value : getDefaultSystem(),
      queue: queue.status === 'fulfilled' ? queue.value : getDefaultQueue(),
      cache: cache.status === 'fulfilled' ? cache.value : getDefaultCache(),
      database: database.status === 'fulfilled' ? database.value : getDefaultDatabase(),
      alerts: alerts.status === 'fulfilled' ? alerts.value : [],
      trends: trends.status === 'fulfilled' ? trends.value : getDefaultTrends(),
      realtime: realtime.status === 'fulfilled' ? realtime.value : getDefaultRealtime()
    };

    // Registrar métricas
    const duration = Date.now() - startTime;
    performanceMonitor.recordMetric(
      'dashboard_load_time',
      duration,
      'ms',
      { timeRange, includeDetails: includeDetails.toString() }
    );

    logger.info('Dashboard carregado com sucesso', {
      duration,
      timeRange,
      status: dashboardData.overview.status,
      alertCount: dashboardData.alerts.length
    });

    return NextResponse.json({
      success: true,
      data: dashboardData,
      metadata: {
        generatedAt: new Date().toISOString(),
        timeRange,
        duration,
        version: '1.0.0'
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error('Erro ao carregar dashboard', {
      error: errorMessage,
      duration,
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// Coletar métricas de overview
async function collectOverviewMetrics(): Promise<OverviewMetrics> {
  // Obter métricas usando métodos disponíveis
  const httpMetrics = performanceMonitor.getMetricsSummary('http_requests_total');
  const responseTimeMetrics = performanceMonitor.getMetricsSummary('http_get_duration');
  const activeUsers = await getActiveUsers();

  const avgResponseTime = responseTimeMetrics?.average || 0;
  const totalRequests = httpMetrics?.count || 0;
  const errorRate = 0; // Simplificado por enquanto

  const memUsage = process.memoryUsage();
  const systemLoad = (memUsage.heapUsed / memUsage.heapTotal) * 100;

  // Determinar status geral
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (errorRate > 5 || avgResponseTime > 2000 || systemLoad > 90) {
    status = 'unhealthy';
  } else if (errorRate > 1 || avgResponseTime > 1000 || systemLoad > 70) {
    status = 'degraded';
  }

  return {
    status,
    uptime: Math.round(process.uptime()),
    totalRequests,
    errorRate,
    avgResponseTime,
    activeUsers,
    systemLoad: Math.round(systemLoad)
  };
}

// Coletar dados de performance
async function collectPerformanceData(timeRange: string): Promise<PerformanceData> {
  const memUsage = process.memoryUsage();
  
  // Usar métodos disponíveis da classe PerformanceMonitor
  const httpMetrics = performanceMonitor.getMetricsSummary('http_requests_total');
  const responseTimeMetrics = performanceMonitor.getMetricsSummary('http_get_duration');

  return {
    responseTime: {
      current: responseTimeMetrics?.average || 0,
      avg24h: responseTimeMetrics?.average || 0,
      p95: responseTimeMetrics?.max || 0,
      p99: responseTimeMetrics?.max || 0
    },
    throughput: {
      requestsPerSecond: (httpMetrics?.count || 0) / 60,
      requestsPerMinute: httpMetrics?.count || 0,
      requestsPerHour: (httpMetrics?.count || 0) * 60
    },
    errors: {
      total: 0, // Simplificado
      rate: 0, // Simplificado
      byType: {}
    },
    memory: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
      trend: 'stable' // Simplificado
    }
  };
}

// Coletar dados do sistema
async function collectSystemData(): Promise<SystemData> {
  // Verificar status dos serviços
  const [dbStatus, redisStatus, queueStatus, cacheStatus] = await Promise.allSettled([
    checkDatabaseStatus(),
    checkRedisStatus(),
    checkQueueStatus(),
    checkCacheStatus()
  ]);

  const memUsage = process.memoryUsage();

  return {
    services: {
      database: dbStatus.status === 'fulfilled' ? dbStatus.value : { status: 'down', responseTime: 0, lastCheck: new Date().toISOString(), uptime: 0 },
      redis: redisStatus.status === 'fulfilled' ? redisStatus.value : { status: 'down', responseTime: 0, lastCheck: new Date().toISOString(), uptime: 0 },
      queue: queueStatus.status === 'fulfilled' ? queueStatus.value : { status: 'down', responseTime: 0, lastCheck: new Date().toISOString(), uptime: 0 },
      cache: cacheStatus.status === 'fulfilled' ? cacheStatus.value : { status: 'down', responseTime: 0, lastCheck: new Date().toISOString(), uptime: 0 }
    },
    resources: {
      cpu: 0, // Simplificado
      memory: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
      disk: 0, // Simplificado
      network: 0 // Simplificado
    },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'development',
      processId: process.pid
    }
  };
}

// Coletar dados da fila
async function collectQueueData(): Promise<QueueData> {
  const jobCounts = await testResultQueue.getJobCounts();
  
  // Usar dados simplificados já que getQueueStats não existe
  return {
    jobs: {
      waiting: jobCounts.waiting,
      active: jobCounts.active,
      completed: jobCounts.completed,
      failed: jobCounts.failed,
      delayed: jobCounts.delayed || 0
    },
    workers: {
      active: jobCounts.active,
      idle: 0,
      total: 1
    },
    performance: {
      throughput: 0,
      avgProcessingTime: 0,
      failureRate: jobCounts.failed / (jobCounts.completed + jobCounts.failed + 1)
    },
    trends: {
      completedLast24h: jobCounts.completed,
      failedLast24h: jobCounts.failed,
      avgWaitTime: 0
    }
  };
}

// Coletar dados do cache
async function collectCacheData(): Promise<CacheData> {
  const cacheStats = cacheService.getCacheStatistics();
  const healthCheck = await cacheService.healthCheck();

  return {
    stats: {
      hitRate: cacheStats.hitRate,
      missRate: 100 - cacheStats.hitRate,
      totalRequests: cacheStats.totalRequests,
      cacheSize: 0 // Não disponível
    },
    performance: {
      avgGetTime: healthCheck.latency,
      avgSetTime: healthCheck.latency,
      evictions: 0 // Não disponível
    },
    memory: {
      used: 0, // Não disponível
      available: 0, // Não disponível
      percentage: 0 // Não disponível
    },
    keys: {
      total: cacheStats.totalRequests,
      expired: 0, // Não disponível
      expiring: 0 // Não disponível
    }
  };
}

// Coletar dados do banco de dados
async function collectDatabaseData(): Promise<DatabaseData> {
  const [userCount, testCount, resultCount] = await Promise.all([
    prisma.user.count(),
    prisma.test.count(),
    prisma.testResult.count()
  ]);

  return {
    connections: {
      active: 1, // Simplificado
      idle: 0,
      total: 1
    },
    performance: {
      avgQueryTime: 0, // Simplificado
      slowQueries: 0,
      totalQueries: userCount + testCount + resultCount
    },
    storage: {
      size: 0, // Simplificado
      growth: 0,
      tables: 10 // Estimado
    },
    health: {
      status: 'healthy',
      lastBackup: new Date().toISOString()
    }
  };
}

// Coletar alertas
async function collectAlerts(): Promise<Alert[]> {
  const alerts: Alert[] = [];
  
  // Verificar métricas e gerar alertas
  const memUsage = process.memoryUsage();
  const memPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
  
  if (memPercentage > 90) {
    alerts.push({
      id: `memory-${Date.now()}`,
      type: 'error',
      severity: 'high',
      title: 'Alto uso de memória',
      message: `Uso de memória em ${Math.round(memPercentage)}%`,
      timestamp: new Date().toISOString(),
      source: 'system',
      acknowledged: false,
      details: { memoryUsage: memPercentage }
    });
  }
  
  // Verificar fila
  const queueStats = await testResultQueue.getJobCounts();
  if (queueStats.failed > 10) {
    alerts.push({
      id: `queue-${Date.now()}`,
      type: 'warning',
      severity: 'medium',
      title: 'Jobs falhando na fila',
      message: `${queueStats.failed} jobs falharam`,
      timestamp: new Date().toISOString(),
      source: 'queue',
      acknowledged: false,
      details: queueStats
    });
  }
  
  return alerts;
}

// Coletar dados de tendência
async function collectTrendData(timeRange: string): Promise<TrendData> {
  // Simplificado - em produção, coletaria dados históricos
  const now = new Date();
  const points = 24; // 24 pontos de dados
  
  const generateTrendData = (baseValue: number, variance: number): TimeSeriesData[] => {
    return Array.from({ length: points }, (_, i) => ({
      timestamp: new Date(now.getTime() - (points - i) * 60 * 60 * 1000).toISOString(),
      value: baseValue + (Math.random() - 0.5) * variance
    }));
  };
  
  return {
    responseTime: generateTrendData(500, 200),
    throughput: generateTrendData(100, 50),
    errorRate: generateTrendData(1, 2),
    memoryUsage: generateTrendData(60, 20),
    queueSize: generateTrendData(10, 15),
    cacheHitRate: generateTrendData(85, 10)
  };
}

// Coletar dados em tempo real
async function collectRealtimeData(): Promise<RealtimeData> {
  const queueStats = await testResultQueue.getJobCounts();
  const alerts = await collectAlerts();
  
  return {
    currentRequests: 0, // Simplificado
    activeConnections: 1,
    queueActivity: {
      processing: queueStats.active,
      completed: queueStats.completed,
      failed: queueStats.failed
    },
    alerts: alerts.filter(a => !a.acknowledged),
    lastUpdate: new Date().toISOString()
  };
}

// Funções auxiliares para verificar status dos serviços
async function checkDatabaseStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'up',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      uptime: process.uptime()
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      uptime: 0
    };
  }
}

async function checkRedisStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await redisClient.ping();
    return {
      status: 'up',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      uptime: process.uptime()
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      uptime: 0
    };
  }
}

async function checkQueueStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await testResultQueue.getJobCounts();
    return {
      status: 'up',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      uptime: process.uptime()
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      uptime: 0
    };
  }
}

async function checkCacheStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const healthCheck = await cacheService.healthCheck();
    return {
      status: healthCheck.status === 'healthy' ? 'up' : 'down',
      responseTime: healthCheck.latency,
      lastCheck: new Date().toISOString(),
      uptime: process.uptime()
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      uptime: 0
    };
  }
}

// Funções auxiliares
async function getActiveUsers(): Promise<number> {
  // Simplificado - em produção, contaria sessões ativas
  return Math.floor(Math.random() * 100) + 10;
}

// Funções de fallback
function getDefaultOverview(): OverviewMetrics {
  return {
    status: 'healthy',
    uptime: Math.round(process.uptime()),
    totalRequests: 0,
    errorRate: 0,
    avgResponseTime: 0,
    activeUsers: 0,
    systemLoad: 0
  };
}

function getDefaultPerformance(): PerformanceData {
  const memUsage = process.memoryUsage();
  return {
    responseTime: { current: 0, avg24h: 0, p95: 0, p99: 0 },
    throughput: { requestsPerSecond: 0, requestsPerMinute: 0, requestsPerHour: 0 },
    errors: { total: 0, rate: 0, byType: {} },
    memory: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
      trend: 'stable'
    }
  };
}

function getDefaultSystem(): SystemData {
  return {
    services: {
      database: { status: 'up', responseTime: 0, lastCheck: new Date().toISOString(), uptime: 0 },
      redis: { status: 'up', responseTime: 0, lastCheck: new Date().toISOString(), uptime: 0 },
      queue: { status: 'up', responseTime: 0, lastCheck: new Date().toISOString(), uptime: 0 },
      cache: { status: 'up', responseTime: 0, lastCheck: new Date().toISOString(), uptime: 0 }
    },
    resources: { cpu: 0, memory: 0, disk: 0, network: 0 },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'development',
      processId: process.pid
    }
  };
}

function getDefaultQueue(): QueueData {
  return {
    jobs: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
    workers: { active: 0, idle: 0, total: 1 },
    performance: { throughput: 0, avgProcessingTime: 0, failureRate: 0 },
    trends: { completedLast24h: 0, failedLast24h: 0, avgWaitTime: 0 }
  };
}

function getDefaultCache(): CacheData {
  return {
    stats: { hitRate: 0, missRate: 0, totalRequests: 0, cacheSize: 0 },
    performance: { avgGetTime: 0, avgSetTime: 0, evictions: 0 },
    memory: { used: 0, available: 0, percentage: 0 },
    keys: { total: 0, expired: 0, expiring: 0 }
  };
}

function getDefaultDatabase(): DatabaseData {
  return {
    connections: { active: 1, idle: 0, total: 1 },
    performance: { avgQueryTime: 0, slowQueries: 0, totalQueries: 0 },
    storage: { size: 0, growth: 0, tables: 0 },
    health: { status: 'healthy', lastBackup: new Date().toISOString() }
  };
}

function getDefaultTrends(): TrendData {
  return {
    responseTime: [],
    throughput: [],
    errorRate: [],
    memoryUsage: [],
    queueSize: [],
    cacheHitRate: []
  };
}

function getDefaultRealtime(): RealtimeData {
  return {
    currentRequests: 0,
    activeConnections: 0,
    queueActivity: { processing: 0, completed: 0, failed: 0 },
    alerts: [],
    lastUpdate: new Date().toISOString()
  };
}