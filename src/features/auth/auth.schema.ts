import { z } from "zod";

/**
 * Schema para validar el registro de usuario
 */
export const registerSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" })
    .toLowerCase()
    .trim(),

  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100),

  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50)
    .trim()
    .optional(),
});

/**
 * Schema para validar el login de usuario
 */
export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" })
    .toLowerCase()
    .trim(),

  password: z
    .string({ message: "Password is required" })
    .min(1, { message: "Password is required" }),
});
