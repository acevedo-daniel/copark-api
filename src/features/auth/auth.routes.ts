import { Router } from "express";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import * as authController from "./auth.controller.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest({ body: registerSchema }),
  authController.register,
);

authRouter.post(
  "/login",
  validateRequest({ body: loginSchema }),
  authController.login,
);

export { authRouter };
