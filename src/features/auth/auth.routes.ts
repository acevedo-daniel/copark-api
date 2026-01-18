import { Router } from "express";
import { validate } from "../../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import * as authController from "./auth.controller.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validate(registerSchema),
  authController.register
);

authRouter.post(
  "/login",
  validate(loginSchema),
  authController.login
);

export { authRouter };
