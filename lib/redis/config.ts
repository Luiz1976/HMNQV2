import Redis from 'ioredis';

// Configuração otimizada do Redis para alta performance
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),

  // Configurações de conexão otimizadas
  connectTimeout: 10000,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxLoadingTimeout: 5000,
  
  // Pool de conexões
  family: 4,
  keepAlive: true,
  
  // Configurações de retry
  retryDelayOnClusterDown: 300,
  enableOfflineQueue: false,
  
  // Configurações de performance
  commandTimeout: 5000,
  
  // Configurações de log
  showFriendlyErrorStack: process.env.NODE_ENV === 'development',
};

// Instância principal do Redis para cache
export const redis = new Redis(redisConfig);

// Instância separada para filas (BullMQ)
export const queueRedis = new Redis({
  ...redisConfig,
  maxRetriesPerRequest: null, // Necessário para BullMQ
  enableReadyCheck: false,
});

// Configuração de health check
export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
};

// Configuração de métricas
export const getRedisInfo = async () => {
  try {
    const info = await redis.info();
    const memory = await redis.info('memory');
    const stats = await redis.info('stats');
    
    return {
      info,
      memory,
      stats,
      connected: redis.status === 'ready'
    };
  } catch (error) {
    console.error('Failed to get Redis info:', error);
    return null;
  }
};

// Configuração de cache com TTL padrão
export const CACHE_TTL = {
  SHORT: 300, // 5 minutos
  MEDIUM: 1800, // 30 minutos
  LONG: 3600, // 1 hora
  VERY_LONG: 86400, // 24 horas
};

// Prefixos para diferentes tipos de cache
export const CACHE_KEYS = {
  TEST_RESULTS: 'test_results:',
  STATISTICS: 'stats:',
  USER_DATA: 'user:',
  QUEUE_METRICS: 'queue_metrics:',
  HEALTH_CHECK: 'health:',
};

// Configuração de eventos do Redis
redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('ready', () => {
  console.log('✅ Redis ready for operations');
});

redis.on('error', (error) => {
  console.error('❌ Redis connection error:', error);
});

redis.on('close', () => {
  console.log('⚠️ Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

// Configuração de eventos para fila Redis
queueRedis.on('connect', () => {
  console.log('✅ Queue Redis connected successfully');
});

queueRedis.on('error', (error) => {
  console.error('❌ Queue Redis connection error:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Closing Redis connections...');
  await redis.quit();
  await queueRedis.quit();
  console.log('✅ Redis connections closed');
});

export default redis;