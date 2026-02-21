import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient, type RedisClientType } from 'redis';
import { env } from './env.js';
import { logger } from '../lib/logger.js';

let redisClient: RedisClientType | null = null;
let redisErrorListenerBound = false;

function getRedisClient(): RedisClientType | null {
  if (!env.REDIS_URL) {
    return null;
  }

  redisClient ??= createClient({ url: env.REDIS_URL });

  if (!redisErrorListenerBound) {
    redisClient.on('error', (error) => {
      logger.error({ err: error }, 'Redis client error for rate limiting');
    });
    redisErrorListenerBound = true;
  }

  if (!redisClient.isOpen) {
    redisClient.connect().catch((error: unknown) => {
      logger.error({ err: error }, 'Failed to connect Redis for rate limiting');
    });
  }

  return redisClient;
}

function buildAuthRateLimitMessage() {
  return { error: true, message: 'Too many requests, try again later' };
}

export function createAuthRateLimiter(scope: 'register' | 'login') {
  const client = getRedisClient();
  const store = client
    ? new RedisStore({
        prefix: `copark:rl:auth:${scope}:`,
        sendCommand: (...args: string[]) => client.sendCommand(args),
      })
    : undefined;

  return rateLimit({
    windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
    limit: env.AUTH_RATE_LIMIT_MAX,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    passOnStoreError: true,
    message: buildAuthRateLimitMessage(),
    ...(store ? { store } : {}),
  });
}
