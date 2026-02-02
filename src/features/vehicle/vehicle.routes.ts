import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import {
  createVehicleSchema,
  vehicleParkingParamsSchema,
  vehiclePlateParamsSchema,
} from "./vehicle.schema.js";
import * as vehicleController from "./vehicle.controller.js";

const vehicleRouter = Router();

vehicleRouter.use(requireAuth);

vehicleRouter.post(
  "/:parkingId",
  validateRequest({
    params: vehicleParkingParamsSchema,
    body: createVehicleSchema,
  }),
  vehicleController.create,
);

vehicleRouter.get(
  "/:parkingId/plate/:plate",
  validateRequest({ params: vehiclePlateParamsSchema }),
  vehicleController.findByPlate,
);

export { vehicleRouter };
