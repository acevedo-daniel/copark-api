import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { publishParking, updateParking } from "./parking.schema.js";
import * as parkingController from "./parkings.controller.js";

const router = express.Router();

router.get("/", parkingController.listAll);
router.get("/me", requireAuth, parkingController.listMine);
router.get("/:id", parkingController.getById);

router.patch(
  "/:id",
  requireAuth,
  validate(updateParking),
  parkingController.update,
);

router.post(
  "/",
  requireAuth,
  validate(publishParking),
  parkingController.publish,
);

export const parkingsRouter = router;
