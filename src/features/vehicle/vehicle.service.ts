import { Vehicle } from "../../../prisma/generated/client.js";
import * as vehicleRepository from "./vehicle.repository.js";
import type { CreateVehicleDto } from "./vehicle.schema.js";

export const create = async (
  parkingId: string,
  dto: CreateVehicleDto,
): Promise<Vehicle> => {
  return vehicleRepository.create({
    ...dto,
    parking: { connect: { id: parkingId } },
  });
};

export const findByPlate = async (
  plate: string,
  parkingId: string,
): Promise<Vehicle | null> => {
  return await vehicleRepository.findByPlate(plate, parkingId);
};
