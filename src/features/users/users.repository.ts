import { User } from "../../../prisma/generated/client.js";
import { prisma } from "../../config/prisma.js";
import type { CreateUserData, UpdateUserData } from "./user.types.js";

export const create = async (data: CreateUserData): Promise<User> => {
  return await prisma.user.create({ data });
};

export const update = async (
  id: string,
  data: UpdateUserData,
): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const findById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const findByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const existsByEmail = async (email: string): Promise<boolean> => {
  const count = await prisma.user.count({
    where: { email },
  });
  return count > 0;
};
