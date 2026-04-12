import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { validateRequest } from './validation.middleware.js';

describe('validateRequest middleware', () => {
  it('replaces Express 5 query getter with validated query data', async () => {
    const app = express();
    const querySchema = z.strictObject({
      page: z.coerce.number().int().positive().default(1),
    });

    app.get('/items', validateRequest({ query: querySchema }), (req, res) => {
      res.json({ page: req.query.page });
    });

    const response = await request(app).get('/items?page=2');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ page: 2 });
  });
});
