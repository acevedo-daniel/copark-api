import { UserResponseDto } from "../users/user.types.js";

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponseDto;
  accessToken: string;
}
