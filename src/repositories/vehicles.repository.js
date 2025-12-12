import { prisma } from "../config/prisma.js";

const create = async (data) => {
  const vehicleData = { ...data };
  if (vehicleData.userId) {
    vehicleData.ownerId = vehicleData.userId;
    delete vehicleData.userId;
  }
  return await prisma.vehicle.create({
    data: vehicleData,
  });
};

const findByUserId = async (userId) => {
  return await prisma.vehicle.findMany({
    where: { ownerId: userId },
  });
};

const deleteById = async (vehicleId) => {
  return await prisma.vehicle.delete({
    where: { id: vehicleId },
  });
};

export default { create, findByUserId, deleteById };
