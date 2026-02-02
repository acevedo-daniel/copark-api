import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../features/auth/auth.jwt.js";
import { AppError } from "../errors/app-error.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new AppError("Missing token", 401));
    return;
  }

  const token = header.split(" ")[1];

  try {
    const payload = await verifyAccessToken(token);

    req.user = {
      id: payload.sub,
    };

    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};
