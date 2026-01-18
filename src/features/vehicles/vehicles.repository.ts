import { Vehicle, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export const create = async (
  data: Prisma.VehicleCreateInput,
): Promise<Vehicle> => {
  return await prisma.vehicle.create({
    data,
  });
};

export const findByUserId = async (userId: string): Promise<Vehicle[]> => {
  return await prisma.vehicle.findMany({
    where: { ownerId: userId },
  });
};

export const deleteById = async (vehicleId: string): Promise<Vehicle> => {
  return await prisma.vehicle.delete({
    where: { id: vehicleId },
  });
};
