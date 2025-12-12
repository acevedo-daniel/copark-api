import { Router } from "express";
import * as bookingController from "./bookings.controller.js";
import bookingSchemas from "../../schemas/booking.schema.js";
import validate from "../../middlewares/validation.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

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
