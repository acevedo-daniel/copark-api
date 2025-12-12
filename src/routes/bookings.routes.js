import express from "express";
import bookingController from "../controllers/bookings.controller.js";
import bookingSchemas from "../schemas/booking.schema.js";
import validate from "../middlewares/validation.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post(
  "/",
  validate(bookingSchemas.createBooking),
  bookingController.create
);

router.get("/", bookingController.listMine);

router.patch("/:id/cancel", bookingController.cancel);

export default router;
