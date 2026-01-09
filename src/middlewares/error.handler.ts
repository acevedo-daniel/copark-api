import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";

const ERROR_MAP: Record<string, number> = {
  USER_NOT_FOUND: 404,
  PARKING_NOT_FOUND: 404,
  VEHICLE_NOT_FOUND_OR_NOT_YOURS: 404,
  BOOKING_NOT_FOUND_OR_NOT_YOURS: 404,
  INVALID_DATA: 400,
  PERMISSION_DENIED: 403,
  INVALID_CREDENTIALS: 401,
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Unhandled Error", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode || 500,
  });

  const status = err.statusCode || ERROR_MAP[err.message] || 500;

  res.status(status).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
};
