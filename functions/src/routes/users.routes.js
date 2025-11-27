import express from "express";
import userController from "../controllers/users.controller.js";
import userSchemas from "../schemas/user.schema.js";
import authorize from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";

const router = express.Router();

router.get("/me", authorize, userController.getMe);
router.patch(
    "/me",
    authorize,
    validate(userSchemas.updateProfile),
    userController.updateMe,
);
router.get("/:id", authorize, userController.getUserById);

export default router;
