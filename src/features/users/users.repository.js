import { prisma } from "../../config/prisma.js";

export const save = async (uid, userData) => {
  return await prisma.user.upsert({
    where: { id: uid },
    update: userData,
    create: { id: uid, ...userData },
  });
};

export const findById = async (uid) => {
  return await prisma.user.findUnique({
    where: { id: uid },
  });
};
