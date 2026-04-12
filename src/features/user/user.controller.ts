import type { Request, Response } from 'express';
import type { UpdateProfile } from './user.schema.js';
import * as userService from './user.service.js';
import { requireUser } from '../../utils/require-user.js';

export const findCurrent = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
): Promise<void> => {
  requireUser(req);
  const user = await userService.getById(req.user.id);
  res.json(user);
};

export const updateCurrent = async (
  req: Request<unknown, unknown, UpdateProfile>,
  res: Response,
): Promise<void> => {
  requireUser(req);
  const user = await userService.updateProfile(req.user.id, req.body);
  res.json(user);
};
