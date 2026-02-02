import { SignJWT, jwtVerify, type JWTPayload } from "jose";

interface AccessTokenPayload extends JWTPayload {
  sub: string;
}

const rawSecret = process.env.JWT_SECRET;

if (!rawSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(rawSecret);

export const signAccessToken = async (
  payload: AccessTokenPayload,
): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
};

export const verifyAccessToken = async (
  token: string,
): Promise<AccessTokenPayload> => {
  const { payload } = await jwtVerify(token, secret);

  if (typeof payload.sub !== "string" || payload.sub.length === 0)
    throw new Error("Invalid access token payload");

  return payload as AccessTokenPayload;
};
