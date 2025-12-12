import { Router } from "express";
import * as reviewController from "./reviews.controller.js";
import reviewSchemas from "../../schemas/review.schema.js";
import validate from "../../middlewares/validation.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

export const reviewsRouter = Router();

reviewsRouter.post(
  "/",
  requireAuth,
  validate(reviewSchemas.createReview),
  reviewController.create
);

reviewsRouter.get("/parking/:parkingId", reviewController.listByParking);
