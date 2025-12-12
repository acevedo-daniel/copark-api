import { prisma } from "../config/prisma.js";

const save = async (uid, userData) => {
  return await prisma.user.upsert({
    where: { id: uid },
    update: userData,
    create: { id: uid, ...userData },
  });
};

const findById = async (uid) => {
  return await prisma.user.findUnique({
    where: { id: uid },
  });
};

export default { save, findById };
