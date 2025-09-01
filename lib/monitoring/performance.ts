import { logger, performanceLogger, logUtils } from '../utils/logger';
import { redisConnection } from '../config/redis';

// Interface para métricas de performance
interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

// Interface para estatísticas de operação
interface OperationStats {
  count: number;
  totalDuration: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  successCount: number;
  errorCount: number;
  successRate: number;
}

// Classe para monitoramento de performance
class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private operationStats: Map<string, OperationStats> = new Map();
  private readonly maxMetricsPerType = 1000;
  private readonly metricsRetentionMs = 24 * 60 * 60 * 1000; // 24 horas

  constructor() {
    // Limpar métricas antigas a cada hora
    setInterval(() => {
      this.cleanOldMetrics();
    }, 60 * 60 * 1000);
  }

  // Registrar métrica de performance
  recordMetric(name: string, value: number, unit: string = 'ms', tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      tags
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metrics = this.metrics.get(name)!;
    metrics.push(metric);

    // Manter apenas as métricas mais recentes
    if (metrics.length > this.maxMetricsPerType) {
      metrics.splice(0, metrics.length - this.maxMetricsPerType);
    }

    // Log da métrica
    logUtils.logPerformance(name, value, { unit, tags });

    // Salvar no Redis para persistência
    this.saveMetricToRedis(metric);
  }

  // Registrar processamento de job
  recordJobProcessing(jobType: string, duration: number, status: 'success' | 'error') {
    const operationKey = `job_${jobType}`;
    
    if (!this.operationStats.has(operationKey)) {
      this.operationStats.set(operationKey, {
        count: 0,
        totalDuration: 0,
        averageDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        successCount: 0,
        errorCount: 0,
        successRate: 0
      });
    }

    const stats = this.operationStats.get(operationKey)!;
    stats.count++;
    stats.totalDuration += duration;
    stats.averageDuration = stats.totalDuration / stats.count;
    stats.minDuration = Math.min(stats.minDuration, duration);
    stats.maxDuration = Math.max(stats.maxDuration, duration);

    if (status === 'success') {
      stats.successCount++;
    } else {
      stats.errorCount++;
    }

    stats.successRate = (stats.successCount / stats.count) * 100;

    // Registrar métrica
    this.recordMetric(`${operationKey}_duration`, duration, 'ms', { status });
    this.recordMetric(`${operationKey}_success_rate`, stats.successRate, '%');
  }

  // Registrar operação de banco de dados
  recordDatabaseOperation(operation: string, table: string, duration: number, success: boolean) {
    const operationKey = `db_${operation}_${table}`;
    const status = success ? 'success' : 'error';
    
    this.recordMetric(`${operationKey}_duration`, duration, 'ms', { status, table });
    
    logUtils.logDatabaseOperation(operation, table, duration, success);
  }

  // Registrar operação de cache
  recordCacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', key: string, duration?: number) {
    const operationKey = `cache_${operation}`;
    
    if (duration !== undefined) {
      this.recordMetric(`${operationKey}_duration`, duration, 'ms', { key });
    }
    
    this.recordMetric(`${operationKey}_count`, 1, 'count', { key });
    
    logUtils.logCacheOperation(operation, key, duration);
  }

  // Registrar requisição HTTP
  recordHttpRequest(method: string, path: string, statusCode: number, duration: number) {
    const operationKey = `http_${method.toLowerCase()}`;
    const statusClass = Math.floor(statusCode / 100) * 100;
    
    this.recordMetric(`${operationKey}_duration`, duration, 'ms', { 
      path, 
      status_code: statusCode.toString(),
      status_class: `${statusClass}xx`
    });
    
    this.recordMetric(`http_requests_total`, 1, 'count', {
      method,
      path,
      status_code: statusCode.toString()
    });
  }

  // Registrar uso de memória
  recordMemoryUsage() {
    const memUsage = process.memoryUsage();
    
    this.recordMetric('memory_rss', memUsage.rss / 1024 / 1024, 'MB');
    this.recordMetric('memory_heap_used', memUsage.heapUsed / 1024 / 1024, 'MB');
    this.recordMetric('memory_heap_total', memUsage.heapTotal / 1024 / 1024, 'MB');
    this.recordMetric('memory_external', memUsage.external / 1024 / 1024, 'MB');
  }

  // Registrar uso de CPU
  recordCpuUsage() {
    const cpuUsage = process.cpuUsage();
    
    this.recordMetric('cpu_user', cpuUsage.user / 1000, 'ms');
    this.recordMetric('cpu_system', cpuUsage.system / 1000, 'ms');
  }

  // Obter estatísticas de uma operação
  getOperationStats(operationKey: string): OperationStats | undefined {
    return this.operationStats.get(operationKey);
  }

  // Obter todas as estatísticas
  getAllOperationStats(): Record<string, OperationStats> {
    const stats: Record<string, OperationStats> = {};
    for (const [key, value] of this.operationStats.entries()) {
      stats[key] = { ...value };
    }
    return stats;
  }

  // Obter métricas por nome
  getMetrics(name: string, limit?: number): PerformanceMetric[] {
    const metrics = this.metrics.get(name) || [];
    return limit ? metrics.slice(-limit) : metrics;
  }

  // Obter resumo de métricas
  getMetricsSummary(name: string, timeRangeMs?: number): {
    count: number;
    average: number;
    min: number;
    max: number;
    latest: number;
  } | null {
    const metrics = this.getMetrics(name);
    
    if (metrics.length === 0) {
      return null;
    }

    let filteredMetrics = metrics;
    if (timeRangeMs) {
      const cutoff = new Date(Date.now() - timeRangeMs);
      filteredMetrics = metrics.filter(m => m.timestamp >= cutoff);
    }

    if (filteredMetrics.length === 0) {
      return null;
    }

    const values = filteredMetrics.map(m => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      count: filteredMetrics.length,
      average: sum / filteredMetrics.length,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: values[values.length - 1]
    };
  }

  // Obter health check do sistema
  async getHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, { status: string; message?: string; duration?: number }>;
    timestamp: string;
  }> {
    const checks: Record<string, { status: string; message?: string; duration?: number }> = {};
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Check Redis
    try {
      const start = Date.now();
      await redisConnection.ping();
      const duration = Date.now() - start;
      checks.redis = { status: 'healthy', duration };
    } catch (error) {
      checks.redis = { 
        status: 'unhealthy', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
      overallStatus = 'unhealthy';
    }

    // Check Memory
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
    const memoryUsagePercent = (heapUsedMB / heapTotalMB) * 100;
    
    if (memoryUsagePercent > 90) {
      checks.memory = { status: 'unhealthy', message: `Memory usage: ${memoryUsagePercent.toFixed(1)}%` };
      overallStatus = 'unhealthy';
    } else if (memoryUsagePercent > 75) {
      checks.memory = { status: 'degraded', message: `Memory usage: ${memoryUsagePercent.toFixed(1)}%` };
      if (overallStatus === 'healthy') overallStatus = 'degraded';
    } else {
      checks.memory = { status: 'healthy', message: `Memory usage: ${memoryUsagePercent.toFixed(1)}%` };
    }

    // Check Queue Performance
    const queueStats = this.getOperationStats('job_save-test-result');
    if (queueStats) {
      if (queueStats.successRate < 95) {
        checks.queue = { status: 'unhealthy', message: `Success rate: ${queueStats.successRate.toFixed(1)}%` };
        overallStatus = 'unhealthy';
      } else if (queueStats.successRate < 99) {
        checks.queue = { status: 'degraded', message: `Success rate: ${queueStats.successRate.toFixed(1)}%` };
        if (overallStatus === 'healthy') overallStatus = 'degraded';
      } else {
        checks.queue = { status: 'healthy', message: `Success rate: ${queueStats.successRate.toFixed(1)}%` };
      }
    } else {
      checks.queue = { status: 'healthy', message: 'No queue activity' };
    }

    return {
      status: overallStatus,
      checks,
      timestamp: new Date().toISOString()
    };
  }

  // Salvar métrica no Redis
  private async saveMetricToRedis(metric: PerformanceMetric) {
    try {
      const key = `metrics:${metric.name}:${Date.now()}`;
      await redisConnection.setex(key, 86400, JSON.stringify(metric)); // 24 horas TTL
    } catch (error) {
      logger.error('Erro ao salvar métrica no Redis', { error, metric });
    }
  }

  // Limpar métricas antigas
  private cleanOldMetrics() {
    const cutoff = new Date(Date.now() - this.metricsRetentionMs);
    
    for (const [name, metrics] of this.metrics.entries()) {
      const filteredMetrics = metrics.filter(m => m.timestamp >= cutoff);
      this.metrics.set(name, filteredMetrics);
    }

    logger.info('Métricas antigas limpas', { 
      totalMetricTypes: this.metrics.size,
      cutoffTime: cutoff.toISOString()
    });
  }

  // Iniciar coleta automática de métricas do sistema
  startSystemMetricsCollection() {
    // Coletar métricas de sistema a cada 30 segundos
    setInterval(() => {
      this.recordMemoryUsage();
      this.recordCpuUsage();
    }, 30000);

    logger.info('Coleta automática de métricas do sistema iniciada');
  }

  // Gerar relatório de performance
  generatePerformanceReport(timeRangeMs: number = 60 * 60 * 1000): {
    summary: Record<string, any>;
    topSlowOperations: Array<{ operation: string; avgDuration: number }>;
    errorRates: Array<{ operation: string; errorRate: number }>;
    systemMetrics: Record<string, any>;
  } {
    const summary: Record<string, any> = {};
    const topSlowOperations: Array<{ operation: string; avgDuration: number }> = [];
    const errorRates: Array<{ operation: string; errorRate: number }> = [];

    // Analisar estatísticas de operações
    for (const [operation, stats] of this.operationStats.entries()) {
      summary[operation] = {
        totalRequests: stats.count,
        averageDuration: Math.round(stats.averageDuration),
        successRate: Math.round(stats.successRate * 100) / 100
      };

      if (stats.averageDuration > 100) { // Operações lentas (>100ms)
        topSlowOperations.push({
          operation,
          avgDuration: Math.round(stats.averageDuration)
        });
      }

      if (stats.successRate < 99) { // Taxa de erro > 1%
        errorRates.push({
          operation,
          errorRate: Math.round((100 - stats.successRate) * 100) / 100
        });
      }
    }

    // Ordenar por duração (mais lentas primeiro)
    topSlowOperations.sort((a, b) => b.avgDuration - a.avgDuration);
    
    // Ordenar por taxa de erro (maiores primeiro)
    errorRates.sort((a, b) => b.errorRate - a.errorRate);

    // Métricas do sistema
    const memoryMetrics = this.getMetricsSummary('memory_heap_used', timeRangeMs);
    const cpuMetrics = this.getMetricsSummary('cpu_user', timeRangeMs);

    const systemMetrics = {
      memory: memoryMetrics ? {
        current: Math.round(memoryMetrics.latest),
        average: Math.round(memoryMetrics.average),
        peak: Math.round(memoryMetrics.max)
      } : null,
      cpu: cpuMetrics ? {
        average: Math.round(cpuMetrics.average),
        peak: Math.round(cpuMetrics.max)
      } : null
    };

    return {
      summary,
      topSlowOperations: topSlowOperations.slice(0, 10),
      errorRates: errorRates.slice(0, 10),
      systemMetrics
    };
  }
}

// Instância singleton do monitor de performance
export const performanceMonitor = new PerformanceMonitor();

// Iniciar coleta automática de métricas
performanceMonitor.startSystemMetricsCollection();

// Middleware para monitoramento de requisições
export const performanceMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    performanceMonitor.recordHttpRequest(
      req.method,
      req.route?.path || req.path,
      res.statusCode,
      duration
    );
  });
  
  next();
};

// Função para criar timer de performance
export const createPerformanceTimer = (operationName: string) => {
  const start = Date.now();
  
  return {
    end: (success: boolean = true, tags?: Record<string, string>) => {
      const duration = Date.now() - start;
      performanceMonitor.recordMetric(
        `${operationName}_duration`,
        duration,
        'ms',
        { success: success.toString(), ...tags }
      );
      return duration;
    }
  };
};

export default performanceMonitor;