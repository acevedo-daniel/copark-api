import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z.string().min(2).max(50).trim().optional(),
    lastName: z.string().min(2).max(50).trim().optional(),
    phone: z
      .string()
      .regex(/^[0-9]+$/)
      .min(8)
      .max(15)
      .optional(),
    photoUrl: z.url().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
