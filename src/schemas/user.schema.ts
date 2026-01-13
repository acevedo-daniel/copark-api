import { z } from "zod";

export const updateProfile = z
  .object({
    name: z
      .string({ message: "Name must be text" })
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50)
      .trim(),

    lastName: z
      .string({ message: "Last name must be text" })
      .min(2, { message: "Last name must be at least 2 characters" })
      .max(50)
      .trim(),

    phone: z
      .string()
      .regex(/^[0-9]+$/, { message: "Phone must contain only numbers" })
      .min(8)
      .max(15)
      .trim(),

    photoUrl: z.url().optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });
