import { User } from "@prisma/client";
import {
  hashPassword,
  verifyPassword,
} from "../../../shared/utils/password.js";
import {
  UnauthorizedError,
  ConflictError,
} from "../../../shared/errors/index.js";
import { UserResponseDto } from "../users/user.types.js";
import { signAccessToken } from "./jwt.js";
import type { RegisterDto, LoginDto, AuthResponse } from "./auth.types.js";
import * as userRepository from "../users/users.repository.js";

const toUserResponseDto = ({
  passwordHash: _,
  ...user
}: User): UserResponseDto => user;

export const register = async (dto: RegisterDto): Promise<AuthResponse> => {
  const existing = await userRepository.findByEmail(dto.email);
  if (existing) {
    throw new ConflictError("Email already in use");
  }

  const passwordHash = await hashPassword(dto.password);

  const user = await userRepository.create({
    email: dto.email,
    passwordHash,
    name: dto.name,
  });

  const accessToken = await signAccessToken({ sub: user.id });

  return {
    user: toUserResponseDto(user),
    accessToken,
  };
};

export const login = async (dto: LoginDto): Promise<AuthResponse> => {
  const user = await userRepository.findByEmail(dto.email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isValidPassword = await verifyPassword(user.passwordHash, dto.password);
  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const accessToken = await signAccessToken({ sub: user.id });

  return {
    user: toUserResponseDto(user),
    accessToken,
  };
};
