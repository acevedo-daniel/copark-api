import { NotFoundError } from "../../errors/index.js";
import * as userRepository from "./user.repository.js";
import {
  type UserResponseDto,
  type UpdateProfileDto,
  toUserResponseDto,
} from "./user.schema.js";

export const getById = async (id: string): Promise<UserResponseDto> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return toUserResponseDto(user);
};

export const getByEmail = async (email: string): Promise<UserResponseDto> => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return toUserResponseDto(user);
};

export const updateProfile = async (
  id: string,
  data: UpdateProfileDto,
): Promise<UserResponseDto> => {
  const user = await userRepository.update(id, data);
  return toUserResponseDto(user);
};
