import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError && err.isOperational) {
    console.error("Operational Error:", {
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
    });
    return res.status(err.statusCode).json({
      error: true,
      message: err.message,
    });
  }
  console.error("CRITICAL - Unexpected Error:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });
  return res.status(500).json({
    error: true,
    message: "Internal Server Error",
  });
};
