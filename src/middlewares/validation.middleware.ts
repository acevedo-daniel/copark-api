import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../../shared/errors/app-error.js";

export const validate = (schema: z.ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      return next(new AppError(errorMessage, 400));
    }

    req.body = result.data;
    next();
  };
};
