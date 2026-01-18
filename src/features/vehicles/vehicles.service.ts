import { Vehicle } from "@prisma/client";
import * as vehicleRepository from "./vehicles.repository.js";

export const addVehicle = async (
  id: string,
  vehicleData: Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "ownerId">,
): Promise<Vehicle> => {
  const newVehicle = {
    ...vehicleData,
    owner: { connect: { id } },
    createdAt: new Date(),
  };
  return await vehicleRepository.create(newVehicle);
};

export const getMyVehicles = async (id: string): Promise<Vehicle[]> => {
  return await vehicleRepository.findByUserId(id);
};

export const removeVehicle = async (
  id: string,
  vehicleId: string,
): Promise<Vehicle> => {
  return await vehicleRepository.deleteById(vehicleId);
};
