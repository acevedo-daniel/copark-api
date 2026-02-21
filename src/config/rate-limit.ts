import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient, type RedisClientType } from 'redis';
import { env } from './env.js';
import { logger } from '../lib/logger.js';

let redisClient: RedisClientType | null = null;
let redisStore: RedisStore | null = null;
let redisErrorListenerBound = false;

function getRateLimitStore(): RedisStore | undefined {
  if (!env.REDIS_URL) {
    return undefined;
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

  if (!redisStore) {
    const client = redisClient;
    redisStore = new RedisStore({
      prefix: 'copark:rl:',
      sendCommand: (...args: string[]) => client.sendCommand(args),
    });
  }

  return redisStore;
}

function buildAuthRateLimitMessage() {
  return { error: true, message: 'Too many requests, try again later' };
}

export function createAuthRateLimiter() {
  const store = getRateLimitStore();

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
