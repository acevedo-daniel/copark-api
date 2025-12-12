import { prisma } from "../../config/prisma.js";

export const create = async (data) => {
  return await prisma.review.create({
    data: data,
  });
};

export const findByParkingId = async (parkingId) => {
  return await prisma.review.findMany({
    where: { parkingId: parkingId },
  });
};
