import { z } from "zod";
import type { User } from "../../../prisma/generated/client.js";

export const updateProfileSchema = z
  .object({
    name: z
      .string({
        error: (issue) =>
          issue.input === undefined ? undefined : "Name must be a string",
      })
      .min(2, { error: "Name must be at least 2 characters" })
      .max(50, { error: "Name must be at most 50 characters" })
      .trim()
      .optional(),

    lastName: z
      .string({
        error: (issue) =>
          issue.input === undefined ? undefined : "Last name must be a string",
      })
      .min(2, { error: "Last name must be at least 2 characters" })
      .max(50, { error: "Last name must be at most 50 characters" })
      .trim()
      .optional(),

    phone: z
      .string({
        error: (issue) =>
          issue.input === undefined ? undefined : "Phone must be a string",
      })
      .regex(/^[0-9]+$/, {
        error: "Phone must contain only numbers",
      })
      .min(8, { error: "Phone must be at least 8 characters" })
      .max(15, { error: "Phone must be at most 15 characters" })
      .optional(),

    photoUrl: z.url({ error: "Photo URL must be a valid URL" }).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided",
  });

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type UserResponseDto = Omit<User, "passwordHash">;

export const toUserResponseDto = (user: User): UserResponseDto => {
  const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
