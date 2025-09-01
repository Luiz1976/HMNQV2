import { redisConnection } from '../config/redis';
import { logger, logUtils } from '../utils/logger';
import { performanceMonitor } from '../monitoring/performance';
import { type CacheConfig as CacheConfigData } from '../validation/schemas';

// Configurações de cache
interface CacheConfig {
  ttl: number; // Time to live em segundos
  prefix: string;
  version: string;
  compress?: boolean;
  serialize?: boolean;
}

// Configurações padrão para diferentes tipos de cache
const CACHE_CONFIGS: Record<string, CacheConfig> = {
  user_results: {
    ttl: 300, // 5 minutos
    prefix: 'user_results',
    version: '1.0',
    serialize: true
  },
  company_results: {
    ttl: 600, // 10 minutos
    prefix: 'company_results',
    version: '1.0',
    serialize: true
  },
  test_result: {
    ttl: 1800, // 30 minutos
    prefix: 'test_result',
    version: '1.0',
    serialize: true
  },
  user_statistics: {
    ttl: 900, // 15 minutos
    prefix: 'user_stats',
    version: '1.0',
    serialize: true
  },
  company_statistics: {
    ttl: 1200, // 20 minutos
    prefix: 'company_stats',
    version: '1.0',
    serialize: true
  },
  test_categories: {
    ttl: 3600, // 1 hora
    prefix: 'test_categories',
    version: '1.0',
    serialize: true
  },
  available_tests: {
    ttl: 1800, // 30 minutos
    prefix: 'available_tests',
    version: '1.0',
    serialize: true
  },
  session_data: {
    ttl: 7200, // 2 horas
    prefix: 'session',
    version: '1.0',
    serialize: true
  }
};

// Classe principal do serviço de cache
class CacheService {
  private hitCount = 0;
  private missCount = 0;
  private errorCount = 0;

  constructor() {
    // Log de estatísticas a cada 5 minutos
    setInterval(() => {
      this.logCacheStatistics();
    }, 5 * 60 * 1000);
  }

  // Gerar chave de cache
  private generateKey(config: CacheConfig, key: string): string {
    return `${config.prefix}:${config.version}:${key}`;
  }

  // Serializar dados para cache
  private serialize(data: any, config: CacheConfig): string {
    if (!config.serialize) {
      return typeof data === 'string' ? data : JSON.stringify(data);
    }

    try {
      return JSON.stringify({
        data,
        timestamp: Date.now(),
        version: config.version
      });
    } catch (error) {
      logger.error('Erro ao serializar dados para cache', { error, data });
      throw error;
    }
  }

  // Deserializar dados do cache
  private deserialize(cachedData: string, config: CacheConfig): any {
    if (!config.serialize) {
      try {
        return JSON.parse(cachedData);
      } catch {
        return cachedData;
      }
    }

    try {
      const parsed = JSON.parse(cachedData);
      
      // Verificar versão
      if (parsed.version !== config.version) {
        logger.warn('Versão do cache incompatível', {
          expected: config.version,
          found: parsed.version
        });
        return null;
      }

      return parsed.data;
    } catch (error) {
      logger.error('Erro ao deserializar dados do cache', { error, cachedData });
      return null;
    }
  }

  // Obter dados do cache
  async get<T = any>(cacheType: keyof typeof CACHE_CONFIGS, key: string): Promise<T | null> {
    const config = CACHE_CONFIGS[cacheType];
    if (!config) {
      throw new Error(`Tipo de cache não configurado: ${cacheType}`);
    }

    const cacheKey = this.generateKey(config, key);
    const start = Date.now();

    try {
      const cachedData = await redisConnection.get(cacheKey);
      const duration = Date.now() - start;

      if (cachedData) {
        this.hitCount++;
        performanceMonitor.recordCacheOperation('hit', cacheKey, duration);
        
        const deserializedData = this.deserialize(cachedData, config);
        if (deserializedData !== null) {
          logger.debug('Cache hit', { cacheType, key, duration });
          return deserializedData;
        }
      }

      this.missCount++;
      performanceMonitor.recordCacheOperation('miss', cacheKey, duration);
      logger.debug('Cache miss', { cacheType, key, duration });
      
      return null;
    } catch (error) {
      this.errorCount++;
      const duration = Date.now() - start;
      
      logger.error('Erro ao obter dados do cache', {
        error: error instanceof Error ? error.message : String(error),
        cacheType,
        key,
        duration
      });
      
      return null;
    }
  }

  // Definir dados no cache
  async set(cacheType: keyof typeof CACHE_CONFIGS, key: string, data: any, customTtl?: number): Promise<boolean> {
    const config = CACHE_CONFIGS[cacheType];
    if (!config) {
      throw new Error(`Tipo de cache não configurado: ${cacheType}`);
    }

    const cacheKey = this.generateKey(config, key);
    const ttl = customTtl || config.ttl;
    const start = Date.now();

    try {
      const serializedData = this.serialize(data, config);
      await redisConnection.setex(cacheKey, ttl, serializedData);
      
      const duration = Date.now() - start;
      performanceMonitor.recordCacheOperation('set', cacheKey, duration);
      
      logger.debug('Dados salvos no cache', {
        cacheType,
        key,
        ttl,
        size: serializedData.length,
        duration
      });
      
      return true;
    } catch (error) {
      this.errorCount++;
      const duration = Date.now() - start;
      
      logger.error('Erro ao salvar dados no cache', {
        error: error instanceof Error ? error.message : String(error),
        cacheType,
        key,
        duration
      });
      
      return false;
    }
  }

  // Deletar dados do cache
  async delete(cacheType: keyof typeof CACHE_CONFIGS, key: string): Promise<boolean> {
    const config = CACHE_CONFIGS[cacheType];
    if (!config) {
      throw new Error(`Tipo de cache não configurado: ${cacheType}`);
    }

    const cacheKey = this.generateKey(config, key);
    const start = Date.now();

    try {
      const result = await redisConnection.del(cacheKey);
      const duration = Date.now() - start;
      
      performanceMonitor.recordCacheOperation('delete', cacheKey, duration);
      
      logger.debug('Dados removidos do cache', {
        cacheType,
        key,
        found: result > 0,
        duration
      });
      
      return result > 0;
    } catch (error) {
      this.errorCount++;
      const duration = Date.now() - start;
      
      logger.error('Erro ao remover dados do cache', {
        error: error instanceof Error ? error.message : String(error),
        cacheType,
        key,
        duration
      });
      
      return false;
    }
  }

  // Invalidar múltiplas chaves por padrão
  async invalidatePattern(cacheType: keyof typeof CACHE_CONFIGS, pattern: string): Promise<number> {
    const config = CACHE_CONFIGS[cacheType];
    if (!config) {
      throw new Error(`Tipo de cache não configurado: ${cacheType}`);
    }

    const searchPattern = this.generateKey(config, pattern);
    const start = Date.now();

    try {
      const keys = await redisConnection.keys(searchPattern);
      
      if (keys.length === 0) {
        logger.debug('Nenhuma chave encontrada para invalidação', {
          cacheType,
          pattern,
          searchPattern
        });
        return 0;
      }

      const result = await redisConnection.del(...keys);
      const duration = Date.now() - start;
      
      logger.info('Chaves invalidadas por padrão', {
        cacheType,
        pattern,
        keysFound: keys.length,
        keysDeleted: result,
        duration
      });
      
      return result;
    } catch (error) {
      this.errorCount++;
      const duration = Date.now() - start;
      
      logger.error('Erro ao invalidar chaves por padrão', {
        error: error instanceof Error ? error.message : String(error),
        cacheType,
        pattern,
        duration
      });
      
      return 0;
    }
  }

  // Métodos específicos para diferentes tipos de dados

  // Cache de resultados de usuário
  async getUserResults(userId: string, filters?: any): Promise<any | null> {
    const key = filters ? `${userId}:${JSON.stringify(filters)}` : userId;
    return this.get('user_results', key);
  }

  async setUserResults(userId: string, data: any, filters?: any): Promise<boolean> {
    const key = filters ? `${userId}:${JSON.stringify(filters)}` : userId;
    return this.set('user_results', key, data);
  }

  async invalidateUserResults(userId: string): Promise<number> {
    return this.invalidatePattern('user_results', `${userId}*`);
  }

  // Cache de resultados de empresa
  async getCompanyResults(companyId: string, filters?: any): Promise<any | null> {
    const key = filters ? `${companyId}:${JSON.stringify(filters)}` : companyId;
    return this.get('company_results', key);
  }

  async setCompanyResults(companyId: string, data: any, filters?: any): Promise<boolean> {
    const key = filters ? `${companyId}:${JSON.stringify(filters)}` : companyId;
    return this.set('company_results', key, data);
  }

  async invalidateCompanyResults(companyId: string): Promise<number> {
    return this.invalidatePattern('company_results', `${companyId}*`);
  }

  // Cache de resultado específico de teste
  async getTestResult(resultId: string): Promise<any | null> {
    return this.get('test_result', resultId);
  }

  async setTestResult(resultId: string, data: any): Promise<boolean> {
    return this.set('test_result', resultId, data);
  }

  async invalidateTestResult(resultId: string): Promise<boolean> {
    return this.delete('test_result', resultId);
  }

  // Cache de estatísticas de usuário
  async getUserStatistics(userId: string): Promise<any | null> {
    return this.get('user_statistics', userId);
  }

  async setUserStatistics(userId: string, data: any): Promise<boolean> {
    return this.set('user_statistics', userId, data);
  }

  async invalidateUserStatistics(userId: string): Promise<boolean> {
    return this.delete('user_statistics', userId);
  }

  // Cache de estatísticas de empresa
  async getCompanyStatistics(companyId: string): Promise<any | null> {
    return this.get('company_statistics', companyId);
  }

  async setCompanyStatistics(companyId: string, data: any): Promise<boolean> {
    return this.set('company_statistics', companyId, data);
  }

  async invalidateCompanyStatistics(companyId: string): Promise<boolean> {
    return this.delete('company_statistics', companyId);
  }

  // Cache de categorias de teste
  async getTestCategories(): Promise<any | null> {
    return this.get('test_categories', 'all');
  }

  async setTestCategories(data: any): Promise<boolean> {
    return this.set('test_categories', 'all', data);
  }

  async invalidateTestCategories(): Promise<boolean> {
    return this.delete('test_categories', 'all');
  }

  // Cache de testes disponíveis
  async getAvailableTests(companyId?: string): Promise<any | null> {
    const key = companyId || 'global';
    return this.get('available_tests', key);
  }

  async setAvailableTests(data: any, companyId?: string): Promise<boolean> {
    const key = companyId || 'global';
    return this.set('available_tests', key, data);
  }

  async invalidateAvailableTests(companyId?: string): Promise<boolean> {
    const key = companyId || 'global';
    return this.delete('available_tests', key);
  }

  // Cache de dados de sessão
  async getSessionData(sessionId: string): Promise<any | null> {
    return this.get('session_data', sessionId);
  }

  async setSessionData(sessionId: string, data: any): Promise<boolean> {
    return this.set('session_data', sessionId, data);
  }

  async invalidateSessionData(sessionId: string): Promise<boolean> {
    return this.delete('session_data', sessionId);
  }

  // Função para cache com fallback
  async getOrSet<T>(
    cacheType: keyof typeof CACHE_CONFIGS,
    key: string,
    fallbackFn: () => Promise<T>,
    customTtl?: number
  ): Promise<T> {
    // Tentar obter do cache primeiro
    const cached = await this.get<T>(cacheType, key);
    if (cached !== null) {
      return cached;
    }

    // Se não estiver no cache, executar função de fallback
    const start = Date.now();
    try {
      const data = await fallbackFn();
      const duration = Date.now() - start;
      
      // Salvar no cache
      await this.set(cacheType, key, data, customTtl);
      
      logger.debug('Dados obtidos via fallback e salvos no cache', {
        cacheType,
        key,
        duration
      });
      
      return data;
    } catch (error) {
      const duration = Date.now() - start;
      
      logger.error('Erro na função de fallback do cache', {
        error: error instanceof Error ? error.message : String(error),
        cacheType,
        key,
        duration
      });
      
      throw error;
    }
  }

  // Obter estatísticas do cache
  getCacheStatistics(): {
    hitCount: number;
    missCount: number;
    errorCount: number;
    hitRate: number;
    totalRequests: number;
  } {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;

    return {
      hitCount: this.hitCount,
      missCount: this.missCount,
      errorCount: this.errorCount,
      hitRate: Math.round(hitRate * 100) / 100,
      totalRequests
    };
  }

  // Log de estatísticas do cache
  private logCacheStatistics() {
    const stats = this.getCacheStatistics();
    
    logUtils.logPerformance('cache_statistics', stats.hitRate, {
      hitCount: stats.hitCount.toString(),
      missCount: stats.missCount.toString(),
      errorCount: stats.errorCount.toString(),
      totalRequests: stats.totalRequests.toString()
    });

    logger.info('Estatísticas do cache', stats);
  }

  // Limpar todo o cache
  async clearAll(): Promise<boolean> {
    try {
      await redisConnection.flushdb();
      
      // Reset counters
      this.hitCount = 0;
      this.missCount = 0;
      this.errorCount = 0;
      
      logger.info('Cache limpo completamente');
      return true;
    } catch (error) {
      logger.error('Erro ao limpar cache', {
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }

  // Health check do cache
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    latency: number;
    statistics: {
      hitCount: number;
      missCount: number;
      errorCount: number;
      hitRate: number;
      totalRequests: number;
    };
  }> {
    const start = Date.now();
    
    try {
      await redisConnection.ping();
      const latency = Date.now() - start;
      
      return {
        status: 'healthy',
        latency,
        statistics: this.getCacheStatistics()
      };
    } catch (error) {
      const latency = Date.now() - start;
      
      logger.error('Health check do cache falhou', {
        error: error instanceof Error ? error.message : String(error),
        latency
      });
      
      return {
        status: 'unhealthy',
        latency,
        statistics: this.getCacheStatistics()
      };
    }
  }
}

// Instância singleton do serviço de cache
export const cacheService = new CacheService();

export default cacheService;