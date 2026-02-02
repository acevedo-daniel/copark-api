import * as z from "zod";
import type { RequestHandler } from "express";
import { AppError } from "../errors/app-error.js";

interface Schemas {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
}

export function validateRequest(schemas: Schemas): RequestHandler {
  return async (req, res, next) => {
    if (schemas.body) {
      const result = await schemas.body.safeParseAsync(req.body);
      if (!result.success) {
        const msg = result.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(", ");
        next(new AppError(msg, 400));
        return;
      }
      req.body = result.data;
    }

    if (schemas.params) {
      const result = await schemas.params.safeParseAsync(req.params);
      if (!result.success) {
        const msg = result.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(", ");
        next(new AppError(msg, 400));
        return;
      }
      req.params = result.data as typeof req.params;
    }

    if (schemas.query) {
      const result = await schemas.query.safeParseAsync(req.query);
      if (!result.success) {
        const msg = result.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(", ");
        next(new AppError(msg, 400));
        return;
      }

      res.locals.validatedQuery = result.data as Record<string, unknown>;
    }

    next();
  };
}
