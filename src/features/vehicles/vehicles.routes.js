import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createVehicle } from "../../schemas/vehicle.schema.js";
import * as vehicleController from "./vehicles.controller.js";

const router = Router();

router.use(requireAuth);

router.post("/", validate(createVehicle), vehicleController.create);

router.get("/", vehicleController.listMine);

router.delete("/:id", vehicleController.remove);

export const vehiclesRouter = router;
