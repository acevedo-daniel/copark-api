import { Router } from 'express';
import type { RequestHandler } from 'express';
import { createReviewRateLimiter } from '../../config/rate-limit.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import * as reviewController from './review.controller.js';
import {
  reviewParkingParamsSchema,
  reviewQuerySchema,
  createReviewSchema,
} from './review.schema.js';

const reviewRouter = Router();
const reviewLimiter = createReviewRateLimiter();

reviewRouter.post(
  '/parking/:parkingId',
  reviewLimiter,
  validateRequest({
    params: reviewParkingParamsSchema,
    body: createReviewSchema,
  }),
  reviewController.create as unknown as RequestHandler,
);
reviewRouter.get(
  '/parking/:parkingId',
  validateRequest({
    params: reviewParkingParamsSchema,
    query: reviewQuerySchema,
  }),
  reviewController.listByParking as unknown as RequestHandler,
);

reviewRouter.get(
  '/parking/:parkingId/stats',
  validateRequest({ params: reviewParkingParamsSchema }),
  reviewController.getStats,
);

export { reviewRouter };
