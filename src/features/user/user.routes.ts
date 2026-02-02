import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { updateProfileSchema } from "./user.schema.js";
import * as userController from "./user.controller.js";

const userRouter = Router();

userRouter.get("/me", requireAuth, userController.findCurrent);
userRouter.patch(
  "/me",
  requireAuth,
  validateRequest({ body: updateProfileSchema }),
  userController.updateCurrent,
);

export { userRouter };
