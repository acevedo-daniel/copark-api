import { User } from "@prisma/client";

export type UserResponseDto = Omit<User, "passwordHash">;

export interface CreateUserData {
  email: string;
  passwordHash: string;
  name?: string;
  lastName?: string;
  phone?: string;
  photoUrl?: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  lastName?: string;
  phone?: string;
  photoUrl?: string;
}
