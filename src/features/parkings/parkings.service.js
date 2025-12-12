import * as parkingRepository from "./parkings.repository.js";

export const publishParking = async (ownerId, parkingData) => {
  const newParking = {
    ...parkingData,
    ownerId,
    createdAt: new Date().toISOString(),
  };
  return await parkingRepository.create(newParking);
};

export const getAllParkings = async () => {
  return await parkingRepository.findAll();
};

export const getParkingById = async (parkingId) => {
  const parking = await parkingRepository.findById(parkingId);
  if (!parking) throw new Error("PARKING_NOT_FOUND");
  return parking;
};

export const getMyParkings = async (ownerId) => {
  return await parkingRepository.findByOwnerId(ownerId);
};

export const updateParking = async (uid, parkingId, data) => {
  const parking = await parkingRepository.findById(parkingId);
  if (!parking) throw new Error("PARKING_NOT_FOUND");

  if (parking.ownerId !== uid) throw new Error("UNAUTHORIZED_ACCESS");

  return await parkingRepository.update(parkingId, data);
};
