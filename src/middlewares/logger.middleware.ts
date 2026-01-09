import type { NextFunction, Request, Response } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const user = req.user
      ? `[User: ${req.user.id || req.user.uid || "unknown"}]`
      : "[Guest]";
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    console.log(`${method} ${url} ${status} - ${duration}ms ${user}`);
  });

  next();
};
