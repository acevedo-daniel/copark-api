import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { updateProfile } from "../../schemas/user.schema.js";
import * as userController from "./users.controller.js";

const router = express.Router();

router.get("/me", requireAuth, userController.getMe);
router.patch(
  "/me",
  requireAuth,
  validate(updateProfile),
  userController.updateMe
);
router.get("/:id", requireAuth, userController.getUserById);

export const usersRouter = router;
