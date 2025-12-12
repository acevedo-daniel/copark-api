const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const user = req.user
      ? `[User: ${req.user.id || req.user.uid || "unknown"}]`
      : "[Guest]";
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    console.log(`${method} ${url} ${status} - ${duration}ms ${user}`);
  });

  next();
};

export default requestLogger;
