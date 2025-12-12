import { SignJWT, jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const signAccessToken = async (payload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
};

export const verifyAccessToken = async (token) => {
  const { payload } = await jwtVerify(token, secret);
  return payload;
};
