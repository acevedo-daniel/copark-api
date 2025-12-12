import { prisma } from "../config/prisma.js";

const create = async (data) => {
  return await prisma.parking.create({
    data: data,
  });
};

const findAll = async () => {
  return await prisma.parking.findMany();
};

const findById = async (parkingId) => {
  return await prisma.parking.findUnique({
    where: { id: parkingId },
  });
};

const findByOwnerId = async (ownerId) => {
  return await prisma.parking.findMany({
    where: { ownerId: ownerId },
  });
};

const update = async (parkingId, data) => {
  return await prisma.parking.update({
    where: { id: parkingId },
    data: data,
  });
};

export default { create, findAll, findById, findByOwnerId, update };
