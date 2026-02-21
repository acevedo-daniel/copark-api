import { Router } from 'express';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { typedHandler } from '../../utils/typed-handler.js';
import * as reviewController from './review.controller.js';
import { reviewParkingParamsSchema, reviewQuerySchema } from './review.schema.js';

const reviewRouter = Router();

reviewRouter.get(
  '/parking/:parkingId',
  validateRequest({
    params: reviewParkingParamsSchema,
    query: reviewQuerySchema,
  }),
  typedHandler(reviewController.listByParking),
);

reviewRouter.get(
  '/parking/:parkingId/stats',
  validateRequest({ params: reviewParkingParamsSchema }),
  reviewController.getStats,
);

export { reviewRouter };
