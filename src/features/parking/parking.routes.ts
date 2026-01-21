import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createParkingSchema, updateParkingSchema } from "./parking.schema.js";
import * as parkingController from "./parking.controller.js";

const router = express.Router();

router.get("/", parkingController.findAll);
router.get("/me", requireAuth, parkingController.findMine);
router.get("/:id", parkingController.findById);

router.patch(
  "/:id",
  requireAuth,
  validate(updateParkingSchema),
  parkingController.update,
);

router.post(
  "/",
  requireAuth,
  validate(createParkingSchema),
  parkingController.create,
);

export const parkingRouter = router;
