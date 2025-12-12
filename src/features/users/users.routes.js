import express from "express";
import * as userController from "./users.controller.js";
import userSchemas from "../../schemas/user.schema.js";
import validate from "../../middlewares/validation.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", requireAuth, userController.getMe);
router.patch(
  "/me",
  requireAuth,
  validate(userSchemas.updateProfile),
  userController.updateMe
);
router.get("/:id", requireAuth, userController.getUserById);

export const usersRouter = router;
