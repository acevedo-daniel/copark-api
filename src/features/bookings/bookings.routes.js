import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import bookingSchemas from "../../schemas/booking.schema.js";
import * as bookingController from "./bookings.controller.js";

export const bookingsRouter = Router();

bookingsRouter.use(requireAuth);

bookingsRouter.post(
  "/",
  validate(bookingSchemas.createBooking),
  bookingController.create
);

bookingsRouter.get("/", bookingController.listMine);

bookingsRouter.patch("/:bookingId/cancel", bookingController.cancel);

bookingsRouter.get("/:id", bookingController.getById);
