import express from "express";
import reviewController from "../controllers/reviews.controller.js";
import reviewSchemas from "../schemas/review.schema.js";
import validate from "../middlewares/validation.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post(
  "/",
  requireAuth,
  validate(reviewSchemas.createReview),
  reviewController.create
);

router.get("/parking/:parkingId", reviewController.listByParking);

export default router;
