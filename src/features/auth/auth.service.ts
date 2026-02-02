import { hashPassword, verifyPassword } from "./auth.password.js";
import { UnauthorizedError, ConflictError } from "../../errors/index.js";
import { signAccessToken } from "./auth.jwt.js";
import * as userRepository from "../user/user.repository.js";
import {
  type RegisterDto,
  type LoginDto,
  type AuthResponseDto,
} from "./auth.schema.js";
import { toUserResponseDto } from "../user/user.schema.js";

export const register = async (dto: RegisterDto): Promise<AuthResponseDto> => {
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

export const login = async (dto: LoginDto): Promise<AuthResponseDto> => {
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
