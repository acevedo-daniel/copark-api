import { prisma } from "../config/prisma.js";

const create = async (data) => {
  return await prisma.review.create({
    data: data,
  });
};

const findByParkingId = async (parkingId) => {
  return await prisma.review.findMany({
    where: { parkingId: parkingId },
  });
};

export default { create, findByParkingId };
