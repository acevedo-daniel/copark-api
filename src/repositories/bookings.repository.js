import { prisma } from "../config/prisma.js";

const create = async (data) => {
  return await prisma.booking.create({
    data: data,
  });
};

const findByUserId = async (uid) => {
  return await prisma.booking.findMany({
    where: { driverId: uid },
  });
};

const cancel = async (bookingId) => {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });
};

export default { create, findByUserId, cancel };
