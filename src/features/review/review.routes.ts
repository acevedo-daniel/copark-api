import { Router } from "express";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import {
  reviewParkingParamsSchema,
  reviewQuerySchema,
} from "./review.schema.js";
import * as reviewController from "./review.controller.js";

const reviewRouter = Router();

reviewRouter.get(
  "/parking/:parkingId",
  validateRequest({
    params: reviewParkingParamsSchema,
    query: reviewQuerySchema,
  }),
  reviewController.listByParking,
);

reviewRouter.get(
  "/parking/:parkingId/stats",
  validateRequest({ params: reviewParkingParamsSchema }),
  reviewController.getStats,
);

export { reviewRouter };
