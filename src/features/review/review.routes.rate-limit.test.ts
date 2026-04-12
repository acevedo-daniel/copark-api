import express from 'express';
import type { Request, Response } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createControllerMock = vi.fn((_req: Request, res: Response) => {
  res.status(201).json({ ok: true });
});

const validBody = {
  rating: 5,
  comment: 'Clean parking spot',
};

async function createReviewTestApp(maxRequests: number) {
  vi.resetModules();
  process.env.AUTH_RATE_LIMIT_MAX = String(maxRequests);
  process.env.AUTH_RATE_LIMIT_WINDOW_MS = '60000';

  vi.doMock('./review.controller.js', () => ({
    create: createControllerMock,
    listByParking: vi.fn((_req: Request, res: Response) => {
      res.status(200).json({ data: [], meta: {} });
    }),
    getStats: vi.fn((_req: Request, res: Response) => {
      res.status(200).json({ averageRating: 0, totalReviews: 0 });
    }),
  }));

  const { reviewRouter } = await import('./review.routes.js');
  const app = express();
  app.use(express.json());
  app.use('/reviews', reviewRouter);
  return app;
}

describe('review routes rate limit', () => {
  beforeEach(() => {
    createControllerMock.mockClear();
  });

  it('returns 429 after exceeding the configured create review limit', async () => {
    const app = await createReviewTestApp(1);
    const path = '/reviews/parking/11111111-1111-4111-8111-111111111111';

    const first = await request(app).post(path).send(validBody);
    const second = await request(app).post(path).send(validBody);

    expect(first.status).toBe(201);
    expect(second.status).toBe(429);
    expect(second.body).toEqual({
      error: true,
      message: 'Too many requests, try again later',
    });
  });
});
