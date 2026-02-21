import type { RequestHandler } from 'express';
import * as z from 'zod';
import { BadRequestError } from '../errors/index.js';

export interface ValidateRequestSchemas {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
}

export function validateRequest(schemas: ValidateRequestSchemas): RequestHandler {
  return async (req, res, next) => {
    if (schemas.body) {
      const result = await schemas.body.safeParseAsync(req.body);
      if (!result.success) {
        const msg = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
        next(new BadRequestError(msg));
        return;
      }
      req.body = result.data;
    }

    if (schemas.params) {
      const result = await schemas.params.safeParseAsync(req.params);
      if (!result.success) {
        const msg = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
        next(new BadRequestError(msg));
        return;
      }
      req.params = result.data as typeof req.params;
    }

    if (schemas.query) {
      const result = await schemas.query.safeParseAsync(req.query);
      if (!result.success) {
        const msg = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
        next(new BadRequestError(msg));
        return;
      }

      req.query = result.data as typeof req.query;
    }

    next();
  };
}
