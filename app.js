import express from "express";
import cors from "cors";
import helmet from "helmet";

import requestLogger from "./src/middlewares/logger.middleware.js";
import errorHandler from "./src/middlewares/error.handler.js";

import { usersRouter } from "./src/features/users/users.routes.js";
import { vehiclesRouter } from "./src/features/vehicles/vehicles.routes.js";
import { parkingsRouter } from "./src/features/parkings/parkings.routes.js";
import { bookingsRouter } from "./src/features/bookings/bookings.routes.js";
import { reviewsRouter } from "./src/features/reviews/reviews.routes.js";
import { authRouter } from "./src/features/auth/auth.routes.js";

const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10kb" }));

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/users", usersRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/parkings", parkingsRouter);
app.use("/bookings", bookingsRouter);
app.use("/reviews", reviewsRouter);
app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
