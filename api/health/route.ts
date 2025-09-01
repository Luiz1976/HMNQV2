import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { redisClient, queueRedisClient } from '../../lib/config/redis';
import { testResultQueue } from '../../lib/queue/testResultQueue';
import { cacheService } from '../../lib/cache/cacheService';
import { performanceMonitor } from '../../lib/monitoring/performance';
import { logger } from '../../lib/utils/logger';
import { HealthCheckSchema, type HealthCheck as HealthCheckData } from '../../lib/validation/schemas';

const prisma = new PrismaClient();

// Interface para resposta de health check
interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: ServiceHealth;
    redis: ServiceHealth;
    queue: ServiceHealth;
    cache: ServiceHealth;
    storage: ServiceHealth;
  };
  metrics: {
    performance: PerformanceMetrics;
    system: SystemMetrics;
    application: ApplicationMetrics;
  };
  checks: HealthCheck[];
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warningChecks: number;
    overallHealth: number;
  };
}

interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  lastCheck: string;
  details?: any;
  error?: string;
}

interface PerformanceMetrics {
  avgResponseTime: number;
  requestsPerMinute: number;
  errorRate: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  cpuUsage?: number;
}

interface SystemMetrics {
  nodeVersion: string;
  platform: string;
  architecture: string;
  processId: number;
  startTime: string;
}

interface ApplicationMetrics {
  activeConnections: number;
  queueSize: number;
  cacheHitRate: number;
  totalUsers: number;
  totalTests: number;
  totalResults: number;
}

interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  duration: number;
  message: string;
  details?: any;
}

// GET - Health check completo
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const checks: HealthCheck[] = [];
  
  try {
    // Informações básicas do sistema
    const systemInfo = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    // Executar todos os health checks em paralelo
    const [databaseHealth, redisHealth, queueHealth, cacheHealth, storageHealth] = await Promise.allSettled([
      checkDatabase(),
      checkRedis(),
      checkQueue(),
      checkCache(),
      checkStorage()
    ]);

    // Processar resultados dos health checks
    const services = {
      database: processHealthResult(databaseHealth, 'database', checks),
      redis: processHealthResult(redisHealth, 'redis', checks),
      queue: processHealthResult(queueHealth, 'queue', checks),
      cache: processHealthResult(cacheHealth, 'cache', checks),
      storage: processHealthResult(storageHealth, 'storage', checks)
    };

    // Coletar métricas
    const [performanceMetrics, systemMetrics, applicationMetrics] = await Promise.allSettled([
      collectPerformanceMetrics(),
      collectSystemMetrics(),
      collectApplicationMetrics()
    ]);

    const metrics = {
      performance: performanceMetrics.status === 'fulfilled' ? performanceMetrics.value : getDefaultPerformanceMetrics(),
      system: systemMetrics.status === 'fulfilled' ? systemMetrics.value : getDefaultSystemMetrics(),
      application: applicationMetrics.status === 'fulfilled' ? applicationMetrics.value : getDefaultApplicationMetrics()
    };

    // Executar verificações adicionais
    await runAdditionalChecks(checks);

    // Calcular resumo
    const summary = calculateSummary(checks, services);
    
    // Determinar status geral
    const overallStatus = determineOverallStatus(services, summary.overallHealth);

    const response: HealthCheckResponse = {
      status: overallStatus,
      ...systemInfo,
      services,
      metrics,
      checks,
      summary
    };

    // Registrar métricas de health check
    const duration = Date.now() - startTime;
    performanceMonitor.recordMetric(
      'health_check_duration',
      duration,
      'ms',
      { 
        status: overallStatus,
        failed_services: Object.values(services).filter(s => s.status === 'down').length.toString()
      }
    );

    // Log baseado no status
    if (overallStatus === 'healthy') {
      logger.info('Health check executado com sucesso', {
        status: overallStatus,
        duration,
        summary
      });
    } else {
      logger.warn('Health check detectou problemas', {
        status: overallStatus,
        duration,
        summary,
        failedServices: Object.entries(services)
          .filter(([_, service]) => service.status === 'down')
          .map(([name, _]) => name)
      });
    }

    // Retornar resposta com status HTTP apropriado
    const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;
    
    return NextResponse.json(response, { status: httpStatus });

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    performanceMonitor.recordMetric(
      'health_check_duration',
      duration,
      'ms',
      { status: 'error', error: errorMessage }
    );

    logger.error('Erro durante health check', {
      error: errorMessage,
      duration
    });

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 503 }
    );
  }
}

// Verificar saúde do banco de dados
async function checkDatabase(): Promise<ServiceHealth> {
  const start = Date.now();
  
  try {
    // Teste de conectividade simples
    await prisma.$queryRaw`SELECT 1`;
    
    // Teste de operação básica
    const userCount = await prisma.user.count();
    
    const responseTime = Date.now() - start;
    
    return {
      status: responseTime < 1000 ? 'up' : 'degraded',
      responseTime,
      lastCheck: new Date().toISOString(),
      details: {
        userCount,
        connectionPool: 'active'
      }
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Verificar saúde do Redis
async function checkRedis(): Promise<ServiceHealth> {
  const start = Date.now();
  
  try {
    // Teste de conectividade
    await redisClient.ping();
    
    // Teste de operação básica
    const testKey = `health_check_${Date.now()}`;
    await redisClient.set(testKey, 'test', 'EX', 10);
    const value = await redisClient.get(testKey);
    await redisClient.del(testKey);
    
    if (value !== 'test') {
      throw new Error('Redis read/write test failed');
    }
    
    const responseTime = Date.now() - start;
    
    // Obter informações do Redis
    const info = await redisClient.info('memory');
    const memoryInfo = parseRedisInfo(info);
    
    return {
      status: responseTime < 500 ? 'up' : 'degraded',
      responseTime,
      lastCheck: new Date().toISOString(),
      details: {
        memoryUsed: memoryInfo.used_memory_human,
        connectedClients: memoryInfo.connected_clients,
        version: memoryInfo.redis_version
      }
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Verificar saúde das filas
async function checkQueue(): Promise<ServiceHealth> {
  const start = Date.now();
  
  try {
    // Verificar conectividade com Redis das filas
    await queueRedisClient.ping();
    
    // Obter estatísticas das filas
    const queueStats = await testResultQueue.getJobCounts();
    
    const responseTime = Date.now() - start;
    
    // Verificar se há muitos jobs falhando
    const failureRate = queueStats.failed / (queueStats.completed + queueStats.failed + 1);
    const isHealthy = failureRate < 0.1 && queueStats.waiting < 1000;
    
    return {
      status: isHealthy ? 'up' : 'degraded',
      responseTime,
      lastCheck: new Date().toISOString(),
      details: {
        waiting: queueStats.waiting,
        active: queueStats.active,
        completed: queueStats.completed,
        failed: queueStats.failed,
        failureRate: Math.round(failureRate * 100)
      }
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Verificar saúde do cache
async function checkCache(): Promise<ServiceHealth> {
  const start = Date.now();
  
  try {
    // Teste de operação de cache
    const testKey = `cache_health_${Date.now()}`;
    const testData = { test: true, timestamp: Date.now() };
    
    await cacheService.set('session_data', testKey, testData, 10);
    const cachedData = await cacheService.get('session_data', testKey);
    await cacheService.delete('session_data', testKey);
    
    if (!cachedData || cachedData.test !== true) {
      throw new Error('Cache read/write test failed');
    }
    
    const responseTime = Date.now() - start;
    
    // Obter estatísticas do cache
    const cacheStats = cacheService.getCacheStatistics();
    
    return {
      status: responseTime < 200 ? 'up' : 'degraded',
      responseTime,
      lastCheck: new Date().toISOString(),
      details: {
        hitRate: cacheStats.hitRate,
        totalRequests: cacheStats.totalRequests,
        hitCount: cacheStats.hitCount,
        missCount: cacheStats.missCount
      }
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Verificar saúde do armazenamento
async function checkStorage(): Promise<ServiceHealth> {
  const start = Date.now();
  
  try {
    // Verificar espaço em disco (simulado)
    const fs = require('fs');
    const stats = fs.statSync(process.cwd());
    
    const responseTime = Date.now() - start;
    
    return {
      status: 'up',
      responseTime,
      lastCheck: new Date().toISOString(),
      details: {
        available: true,
        path: process.cwd()
      }
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Coletar métricas de performance
async function collectPerformanceMetrics(): Promise<PerformanceMetrics> {
  const memUsage = process.memoryUsage();
  
  // Obter métricas de HTTP requests
  const httpMetrics = performanceMonitor.getMetricsSummary('http_requests_total');
  const responseTimeMetrics = performanceMonitor.getMetricsSummary('http_get_duration');
  
  return {
    avgResponseTime: responseTimeMetrics?.average || 0,
    requestsPerMinute: httpMetrics?.count || 0,
    errorRate: 0, // Simplificado por enquanto
    memoryUsage: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
    }
  };
}

// Coletar métricas do sistema
async function collectSystemMetrics(): Promise<SystemMetrics> {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    processId: process.pid,
    startTime: new Date(Date.now() - process.uptime() * 1000).toISOString()
  };
}

// Coletar métricas da aplicação
async function collectApplicationMetrics(): Promise<ApplicationMetrics> {
  const [userCount, testCount, resultCount, queueStats] = await Promise.all([
    prisma.user.count(),
    prisma.test.count(),
    prisma.testResult.count(),
    testResultQueue.getJobCounts()
  ]);
  
  const cacheStats = cacheService.getCacheStatistics();
  
  return {
    activeConnections: 1, // Simplificado
    queueSize: queueStats.waiting + queueStats.active,
    cacheHitRate: cacheStats.hitRate,
    totalUsers: userCount,
    totalTests: testCount,
    totalResults: resultCount
  };
}

// Executar verificações adicionais
async function runAdditionalChecks(checks: HealthCheck[]) {
  // Verificar se há jobs antigos na fila
  const start1 = Date.now();
  try {
    const queueStats = await testResultQueue.getJobCounts();
    const hasOldJobs = queueStats.waiting > 100;
    
    checks.push({
      name: 'queue_backlog',
      status: hasOldJobs ? 'warn' : 'pass',
      duration: Date.now() - start1,
      message: hasOldJobs ? `${queueStats.waiting} jobs aguardando processamento` : 'Fila processando normalmente',
      details: queueStats
    });
  } catch (error) {
    checks.push({
      name: 'queue_backlog',
      status: 'fail',
      duration: Date.now() - start1,
      message: 'Erro ao verificar backlog da fila',
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }
  
  // Verificar uso de memória
  const start2 = Date.now();
  const memUsage = process.memoryUsage();
  const memPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
  
  checks.push({
    name: 'memory_usage',
    status: memPercentage > 90 ? 'warn' : memPercentage > 95 ? 'fail' : 'pass',
    duration: Date.now() - start2,
    message: `Uso de memória: ${Math.round(memPercentage)}%`,
    details: {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      percentage: Math.round(memPercentage)
    }
  });
}

// Processar resultado de health check
function processHealthResult(
  result: PromiseSettledResult<ServiceHealth>, 
  serviceName: string, 
  checks: HealthCheck[]
): ServiceHealth {
  if (result.status === 'fulfilled') {
    checks.push({
      name: serviceName,
      status: result.value.status === 'up' ? 'pass' : result.value.status === 'degraded' ? 'warn' : 'fail',
      duration: result.value.responseTime,
      message: result.value.error || `${serviceName} funcionando normalmente`,
      details: result.value.details
    });
    return result.value;
  } else {
    const errorHealth: ServiceHealth = {
      status: 'down',
      responseTime: 0,
      lastCheck: new Date().toISOString(),
      error: result.reason instanceof Error ? result.reason.message : String(result.reason)
    };
    
    checks.push({
      name: serviceName,
      status: 'fail',
      duration: 0,
      message: `Erro ao verificar ${serviceName}`,
      details: { error: errorHealth.error }
    });
    
    return errorHealth;
  }
}

// Calcular resumo
function calculateSummary(checks: HealthCheck[], services: any) {
  const totalChecks = checks.length;
  const passedChecks = checks.filter(c => c.status === 'pass').length;
  const failedChecks = checks.filter(c => c.status === 'fail').length;
  const warningChecks = checks.filter(c => c.status === 'warn').length;
  
  const serviceHealthScores = Object.values(services).map((service: any) => {
    switch (service.status) {
      case 'up': return 100;
      case 'degraded': return 70;
      case 'down': return 0;
      default: return 0;
    }
  });
  
  const overallHealth = serviceHealthScores.length > 0 
    ? Math.round(serviceHealthScores.reduce((sum: number, score: number) => sum + score, 0) / serviceHealthScores.length)
    : 0;
  
  return {
    totalChecks,
    passedChecks,
    failedChecks,
    warningChecks,
    overallHealth
  };
}

// Determinar status geral
function determineOverallStatus(services: any, overallHealth: number): 'healthy' | 'degraded' | 'unhealthy' {
  const downServices = Object.values(services).filter((service: any) => service.status === 'down').length;
  const degradedServices = Object.values(services).filter((service: any) => service.status === 'degraded').length;
  
  if (downServices > 0) {
    return 'unhealthy';
  } else if (degradedServices > 0 || overallHealth < 80) {
    return 'degraded';
  } else {
    return 'healthy';
  }
}

// Utilitários
function parseRedisInfo(info: string): any {
  const lines = info.split('\r\n');
  const result: any = {};
  
  lines.forEach(line => {
    if (line.includes(':')) {
      const [key, value] = line.split(':');
      result[key] = value;
    }
  });
  
  return result;
}

function getDefaultPerformanceMetrics(): PerformanceMetrics {
  const memUsage = process.memoryUsage();
  return {
    avgResponseTime: 0,
    requestsPerMinute: 0,
    errorRate: 0,
    memoryUsage: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
    }
  };
}

function getDefaultSystemMetrics(): SystemMetrics {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    processId: process.pid,
    startTime: new Date(Date.now() - process.uptime() * 1000).toISOString()
  };
}

function getDefaultApplicationMetrics(): ApplicationMetrics {
  return {
    activeConnections: 0,
    queueSize: 0,
    cacheHitRate: 0,
    totalUsers: 0,
    totalTests: 0,
    totalResults: 0
  };
}