import { Router } from 'express';
import { createAuthRateLimiter } from '../../config/rate-limit.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import * as authController from './auth.controller.js';

const registerLimiter = createAuthRateLimiter();
const loginLimiter = createAuthRateLimiter();

const authRouter = Router();

authRouter.post(
  '/register',
  registerLimiter,
  validateRequest({ body: registerSchema }),
  authController.register,
);

authRouter.post(
  '/login',
  loginLimiter,
  validateRequest({ body: loginSchema }),
  authController.login,
);

export { authRouter };
