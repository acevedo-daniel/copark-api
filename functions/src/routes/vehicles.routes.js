import { Router } from "express";
import vehicleController from "../controllers/vehicles.controller.js";
import vehicleSchemas from "../schemas/vehicle.schema.js";
import authorize from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";

const router = Router();

router.use(authorize);

router.post(
    "/",
    validate(vehicleSchemas.createVehicle),
    vehicleController.create,
);

router.get("/", vehicleController.listMine);

router.delete("/:id", vehicleController.remove);

export default router;
