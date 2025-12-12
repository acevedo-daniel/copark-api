import { prisma } from "../../config/prisma.js";

export const create = async (data) => {
  return await prisma.parking.create({
    data: data,
  });
};

export const findAll = async () => {
  return await prisma.parking.findMany();
};

export const findById = async (parkingId) => {
  return await prisma.parking.findUnique({
    where: { id: parkingId },
  });
};

export const findByOwnerId = async (ownerId) => {
  return await prisma.parking.findMany({
    where: { ownerId: ownerId },
  });
};

export const update = async (parkingId, data) => {
  return await prisma.parking.update({
    where: { id: parkingId },
    data: data,
  });
};
