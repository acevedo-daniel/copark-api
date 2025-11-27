import express from "express";
import bookingController from "../controllers/bookings.controller.js";
import bookingSchemas from "../schemas/booking.schema.js";
import authorize from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";

const router = express.Router();

router.use(authorize);

router.post(
    "/",
    validate(bookingSchemas.createBooking),
    bookingController.create,
);

router.get("/", bookingController.listMine);

router.patch("/:id/cancel", bookingController.cancel);

export default router;
