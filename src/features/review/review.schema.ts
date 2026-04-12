import { z } from 'zod';
import { paginationMetaSchema } from '../../utils/pagination.schema.js';

export const createReviewSchema = z
  .strictObject({
    rating: z
      .int({ error: 'Required' })
      .min(1)
      .max(5)
      .openapi({ description: 'Rating (1-5)', example: 4 }),
    comment: z
      .string()
      .trim()
      .max(500, { error: 'Max 500 chars' })
      .optional()
      .openapi({ description: 'Review comment', example: 'Great parking spot' }),
    authorName: z
      .string()
      .trim()
      .min(2, { error: 'Min 2 chars' })
      .max(50, { error: 'Max 50 chars' })
      .optional()
      .openapi({ description: 'Author name', example: 'Daniel' }),
  })
  .openapi('CreateReviewRequest');

export const reviewParkingParamsSchema = z.strictObject({
  parkingId: z.uuid({ error: 'Invalid ID' }).openapi({ description: 'Parking Lot UUID' }),
});

export const reviewQuerySchema = z.strictObject({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1)
    .openapi({ description: 'Page number', example: 1 }),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(50)
    .default(10)
    .openapi({ description: 'Reviews per page', example: 10 }),
});

export const reviewResponseSchema = z
  .strictObject({
    id: z.uuid().openapi({ description: 'Review UUID' }),
    rating: z.int().min(1).max(5).openapi({ description: 'Rating (1-5)', example: 5 }),
    comment: z.string().nullable().openapi({ description: 'Review comment' }),
    authorName: z.string().openapi({ description: 'Author name' }),
    parkingId: z.uuid().openapi({ description: 'Parking UUID' }),
    createdAt: z.iso.datetime().openapi({ description: 'Creation date' }),
    updatedAt: z.iso.datetime().openapi({ description: 'Update date' }),
  })
  .openapi('ReviewResponse');

export const reviewListResponseSchema = z
  .strictObject({
    data: z.array(reviewResponseSchema),
    meta: paginationMetaSchema,
  })
  .openapi('ReviewListResponse');

export const reviewStatsResponseSchema = z
  .strictObject({
    averageRating: z.number().openapi({ description: 'Average rating' }),
    totalReviews: z.int().nonnegative().openapi({ description: 'Total number of reviews' }),
  })
  .openapi('ReviewStatsResponse');

export type ReviewParkingParams = z.infer<typeof reviewParkingParamsSchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
export type ReviewListResponse = z.infer<typeof reviewListResponseSchema>;
export type CreateReview = z.infer<typeof createReviewSchema>;
