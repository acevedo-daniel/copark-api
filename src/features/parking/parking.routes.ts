import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import {
  createParkingSchema,
  updateParkingSchema,
  parkingQuerySchema,
} from "./parking.schema.js";
import * as parkingController from "./parking.controller.js";
import { parkingBookingsRouter } from "../booking/booking.routes.js";

const parkingRouter = Router();

parkingRouter.use("/:parkingId/bookings", parkingBookingsRouter);

parkingRouter.get(
  "/",
  validateRequest({ query: parkingQuerySchema }),
  parkingController.findAll,
);
parkingRouter.get("/me", requireAuth, parkingController.findOwned);
parkingRouter.get("/:id", parkingController.findById);

parkingRouter.patch(
  "/:id",
  requireAuth,
  validateRequest({ body: updateParkingSchema }),
  parkingController.update,
);

parkingRouter.post(
  "/",
  requireAuth,
  validateRequest({ body: createParkingSchema }),
  parkingController.create,
);

export { parkingRouter };
