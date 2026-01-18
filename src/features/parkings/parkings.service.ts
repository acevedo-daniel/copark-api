import * as parkingRepository from "./parkings.repository.js";
import { Parking } from "@prisma/client";

export const publishParking = async (ownerId: string, parkingData: Parking) => {
  const newParking = {
    ...parkingData,
    ownerId,
    createdAt: new Date(),
  };
  return await parkingRepository.create(newParking);
};

export const getAllParkings = async (): Promise<Parking[]> => {
  return await parkingRepository.findAll();
};

export const getParkingById = async (parkingId: string): Promise<Parking> => {
  const parking = await parkingRepository.findById(parkingId);
  if (!parking) throw new Error("PARKING_NOT_FOUND");
  return parking;
};

export const getMyParkings = async (ownerId: string): Promise<Parking[]> => {
  return await parkingRepository.findByOwnerId(ownerId);
};

export const updateParking = async (
  id: string,
  parkingId: string,
  data: Parking,
): Promise<Parking> => {
  const parking = await parkingRepository.findById(parkingId);
  if (!parking) throw new Error("PARKING_NOT_FOUND");

  if (parking.ownerId !== id) throw new Error("UNAUTHORIZED_ACCESS");

  return await parkingRepository.update(parkingId, data);
};
