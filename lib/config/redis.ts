// Bridge module to centralize Redis exports in expected names across the codebase
// It adapts the newer lib/redis/config to the legacy import paths used elsewhere

export { CACHE_KEYS, CACHE_TTL, checkRedisHealth, getRedisInfo } from '../redis/config';

// Re-export Redis clients with legacy-friendly names
import redisDefault, { redis as coreRedis, queueRedis as coreQueueRedis } from '../redis/config';

// Primary Redis client for general operations (legacy alias: redisConnection)
export const redisClient = coreRedis;
export const redisConnection = coreRedis; // alias maintained for backward compatibility

// Dedicated Redis client for BullMQ queues
export const queueRedisClient = coreQueueRedis;

// Keep default export for convenience (maps to primary Redis client)
export default redisDefault;