import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { updateProfileSchema } from "./user.schema.js";
import { getMe, getUserById, updateMe } from "./users.controller.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, validate(updateProfileSchema), updateMe);
router.get("/:id", requireAuth, getUserById);

export const usersRouter = router;
