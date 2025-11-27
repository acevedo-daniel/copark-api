import express from "express";
import devController from "../controllers/dev.controller.js";

const router = express.Router();

router.post("/seed", devController.seedDatabase);

export default router;
