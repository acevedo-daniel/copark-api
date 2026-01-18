import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../features/auth/jwt.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing token" });
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
    res.status(401).json({ message: "invalid or expired token" });
  }
};
