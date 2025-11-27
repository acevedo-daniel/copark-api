import { admin } from "../config/firebase.js";
import { logger } from "firebase-functions";

const authorize = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer")) {
      return next({
        statusCode: 401,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authorization.split("Bearer ")[1];

    // --- DEV BYPASS START ---
    if (token === "owner_1") {
      req.user = { uid: "owner_1", email: "juan@park.com" };
      return next();
    }
    if (token === "driver_1") {
      req.user = { uid: "driver_1", email: "pepe@drive.com" };
      return next();
    }
    // --- DEV BYPASS END ---

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
    logger.error("Auth Error", {
      structuredData: true,
      error: error.message,
      stack: error.stack,
    });
    next({
      statusCode: 403,
      message: "Unauthorized: Invalid token",
    });
  }
};

export default authorize;
