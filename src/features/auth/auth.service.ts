import { User } from "../../../prisma/generated/browser.js";
import { prisma } from "../../config/prisma.js";
import { signAccessToken } from "./jwt.js";
import { hashPassword, verifyPassword } from "./password.js";

interface loginAndRegisterParams {
  email: string;
  password: string;
}

interface authResponse {
  user: Pick<User, "id" | "email">;
  token: string;
}

export const register = async ({
  email,
  password,
}: loginAndRegisterParams): Promise<authResponse> => {
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true },
  });

  const token = await signAccessToken({ sub: user.id });

  return { user, token };
};

interface loginResponse {}

export const login = async ({
  email,
  password,
}: loginAndRegisterParams): Promise<authResponse> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true },
  });
  if (!user) throw new Error("INVALID_CREDENTIALS");
  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) throw new Error("INVALID_CREDENTIALS");

  const token = await signAccessToken({ sub: user.id });
  return { user: { id: user.id, email: user.email }, token };
};
