import { z } from "zod";

export const createReviewSchema = z.object({
  parkingId: z.uuid({
    error: (iss) => {
      if (iss.code === "invalid_type") return "Parking ID is required";

      return "Invalid parking ID";
    },
  }),

  rating: z
    .number({
      error: (iss) =>
        iss.input === undefined ? "Rating is required" : undefined,
    })
    .int({ error: "Rating must be an integer" })
    .min(1, { error: "Rating must be at least 1" })
    .max(5, { error: "Rating must be at most 5" }),

  comment: z
    .string()
    .min(5, { error: "Comment must be at least 5 characters" })
    .max(500, { error: "Comment must be at most 500 characters" })
    .trim()
    .optional(),
});

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int({ error: "Rating must be an integer" })
    .min(1, { error: "Rating must be at least 1" })
    .max(5, { error: "Rating must be at most 5" })
    .optional(),

  comment: z
    .string()
    .min(5, { error: "Comment must be at least 5 characters" })
    .max(500, { error: "Comment must be at most 500 characters" })
    .trim()
    .optional(),
});

export const reviewParamsSchema = z.object({
  id: z.uuid({ error: "Invalid review ID" }),
});

export const reviewQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  parkingId: z.string().optional(),
  minRating: z.string().optional(),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
export type UpdateReviewDto = z.infer<typeof updateReviewSchema>;
export type ReviewParams = z.infer<typeof reviewParamsSchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;
