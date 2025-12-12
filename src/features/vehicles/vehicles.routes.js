import { Router } from "express";
import * as vehicleController from "./vehicles.controller.js";
import vehicleSchemas from "../../schemas/vehicle.schema.js";
import validate from "../../middlewares/validation.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  validate(vehicleSchemas.createVehicle),
  vehicleController.create
);

router.get("/", vehicleController.listMine);

router.delete("/:id", vehicleController.remove);

export const vehiclesRouter = router;
