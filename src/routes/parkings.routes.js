import express from "express";
import parkingController from "../controllers/parkings.controller.js";
import parkingSchemas from "../schemas/parking.schema.js";
import validate from "../middlewares/validation.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", parkingController.listAll);
router.get("/me", requireAuth, parkingController.listMine);
router.get("/:id", parkingController.getById);

router.patch(
  "/:id",
  requireAuth,
  validate(parkingSchemas.updateParking),
  parkingController.update
);

router.post(
  "/",
  requireAuth,
  validate(parkingSchemas.publishParking),
  parkingController.publish
);

export default router;
