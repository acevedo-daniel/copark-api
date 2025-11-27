import { logger } from "firebase-functions";

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const user = req.user ? `[User: ${req.user.uid}]` : "[Guest]";
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    logger.info(`${method} ${url} ${status} - ${duration}ms ${user}`, {
      structuredData: true,
      method,
      url,
      status,
      duration,
      user: req.user ? req.user.uid : "guest",
    });
  });

  next();
};

export default requestLogger;
