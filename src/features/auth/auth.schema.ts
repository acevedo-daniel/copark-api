import { z } from "zod";
import { UserResponseDto } from "../user/user.schema.js";

export const registerSchema = z.object({
  email: z.email({ error: "Invalid email format" }).toLowerCase().trim(),

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string",
    })
    .min(8, { error: "Password must be at least 8 characters" })
    .max(100, { error: "Password must be less than 100 characters" }),

  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? undefined : "Name must be a string",
    })
    .min(2, { error: "Name must be at least 2 characters" })
    .max(50, { error: "Name must be at most 50 characters" })
    .trim()
    .optional(),
});

export const loginSchema = z.object({
  email: z.email({ error: "Invalid email format" }).toLowerCase().trim(),

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string",
    })
    .min(1, { error: "Password is required" }),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;

export interface AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
}
