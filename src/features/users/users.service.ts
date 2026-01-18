import { User } from "@prisma/client";
import { NotFoundError } from "../../../shared/errors/index.js";
import { UserResponseDto, UpdateUserData } from "./user.types.js";
import * as userRepository from "./users.repository.js";

const toUserResponseDto = ({
  passwordHash: _,
  ...user
}: User): UserResponseDto => user;

export const getUser = async (id: string): Promise<UserResponseDto> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return toUserResponseDto(user);
};

export const getUserByEmail = async (
  email: string,
): Promise<UserResponseDto> => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return toUserResponseDto(user);
};

export const updateUser = async (
  id: string,
  data: UpdateUserData,
): Promise<UserResponseDto> => {
  const user = await userRepository.update(id, data);
  return toUserResponseDto(user);
};
