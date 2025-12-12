import express from "express";
import cors from "cors";
import helmet from "helmet";

import requestLogger from "./src/middlewares/logger.middleware.js";
import errorHandler from "./src/middlewares/error.handler.js";

import userRoutes from "./src/routes/users.routes.js";
import vehiclesRoutes from "./src/routes/vehicles.routes.js";
import parkingsRoutes from "./src/routes/parkings.routes.js";
import bookingsRoutes from "./src/routes/bookings.routes.js";
import reviewsRoutes from "./src/routes/reviews.routes.js";
import { authRouter } from "./src/routes/auth.routes.js";

const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/users", userRoutes);
app.use("/vehicles", vehiclesRoutes);
app.use("/parkings", parkingsRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
