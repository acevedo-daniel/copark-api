import express from "express";
import parkingController from "../controllers/parkings.controller.js";
import parkingSchemas from "../schemas/parking.schema.js";
import authorize from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";

const router = express.Router();

router.get("/", parkingController.listAll);
router.get("/me", authorize, parkingController.listMine);
router.get("/:id", parkingController.getById);

router.patch(
    "/:id",
    authorize,
    validate(parkingSchemas.updateParking),
    parkingController.update,
);

router.post(
    "/",
    authorize,
    validate(parkingSchemas.publishParking),
    parkingController.publish,
);

export default router;
