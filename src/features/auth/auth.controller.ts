import type { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service.js";
import type { RegisterDto, LoginDto } from "./auth.schema.js";

export const register = async (
  req: Request<unknown, unknown, RegisterDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const dto = req.body;
    const result = await authService.register(dto);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<unknown, unknown, LoginDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const dto = req.body;
    const result = await authService.login(dto);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
