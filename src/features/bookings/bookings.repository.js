import { prisma } from "../../config/prisma.js";

export const create = async (data) => {
  return await prisma.booking.create({
    data: data,
  });
};

export const findByUserId = async (uid) => {
  return await prisma.booking.findMany({
    where: { driverId: uid },
  });
};

export const cancel = async (bookingId) => {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });
};

export const findById = async (bookingId) => {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      parking: {
        select: {
          ownerId: true,
        },
      },
    },
  });
};
