import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createReviewSchema } from "./review.schema.js";
import * as reviewController from "./reviews.controller.js";

export const reviewsRouter = Router();

reviewsRouter.post(
  "/",
  requireAuth,
  validate(createReviewSchema),
  reviewController.create,
);

reviewsRouter.get("/parking/:parkingId", reviewController.listByParking);
