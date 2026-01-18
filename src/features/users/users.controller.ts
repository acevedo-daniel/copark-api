import { NextFunction, Request, Response } from "express";
import { UpdateProfileDto } from "./user.schema.js";
import { getUser, updateUser } from "./users.service.js";
import type { UpdateUserData } from "./user.types.js";

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await getUser(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.user.id;
    const user = await getUser(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (
  req: Request<{}, {}, UpdateProfileDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.user.id;
    const data: UpdateUserData = req.body;
    const user = await updateUser(id, data);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
