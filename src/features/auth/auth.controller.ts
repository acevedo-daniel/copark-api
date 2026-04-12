import type { Request, Response } from 'express';
import * as authService from './auth.service.js';
import type { Register, Login } from './auth.schema.js';

export const register = async (
  req: Request<unknown, unknown, Register>,
  res: Response,
): Promise<void> => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
};

export const login = async (
  req: Request<unknown, unknown, Login>,
  res: Response,
): Promise<void> => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
};
