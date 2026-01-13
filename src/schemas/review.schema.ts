import { z } from "zod";

export const createReview = z.object({
  parkingId: z.string(),
  rating: z.int().min(1).max(5),
  comment: z.string().min(5).max(200).optional,
});
