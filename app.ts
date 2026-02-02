import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandler } from "./src/middlewares/error-handler.middleware.js";
import { requestLogger } from "./src/middlewares/logger.middleware.js";

import { authRouter } from "./src/features/auth/auth.routes.js";
import { bookingRouter } from "./src/features/booking/booking.routes.js";
import { parkingRouter } from "./src/features/parking/parking.routes.js";
import { reviewRouter } from "./src/features/review/review.routes.js";
import { userRouter } from "./src/features/user/user.routes.js";
import { vehicleRouter } from "./src/features/vehicle/vehicle.routes.js";

const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10kb" }));

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/users", userRouter);
app.use("/vehicles", vehicleRouter);
app.use("/parkings", parkingRouter);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRouter);
app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
