import type { NextFunction, Request, Response } from 'express';
import type { UpdateProfile } from './user.schema.js';
import * as userService from './user.service.js';
import { UnauthorizedError } from '../../errors/index.js';

export const findCurrent = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError();
    const ownerId = req.user.id;
    const user = await userService.getById(ownerId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateCurrent = async (
  req: Request<unknown, unknown, UpdateProfile>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError();
    const ownerId = req.user.id;
    const data: UpdateProfile = req.body;
    const user = await userService.updateProfile(ownerId, data);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
