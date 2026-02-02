import { z } from "zod";

export const reviewParkingParamsSchema = z.object({
  parkingId: z.uuid({ error: "Invalid parking ID" }),
});

export const reviewQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type ReviewParkingParams = z.infer<typeof reviewParkingParamsSchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;
