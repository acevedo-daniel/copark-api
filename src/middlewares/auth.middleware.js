import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = await verifyAccessToken(token);

    req.user = {
      uid: payload.sub,
    };
    next();
  } catch {
    return res.status(401).json({ message: "invalid or expired token" });
  }
};
