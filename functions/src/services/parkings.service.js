import parkingRepository from "../repositories/parkings.repository.js";

const publishParking = async (ownerId, parkingData) => {
  const newParking = {
    ...parkingData,
    ownerId,
    rating: 0,
    availableSpaces: parkingData.totalSpaces,
    createdAt: new Date().toISOString(),
  };
  return await parkingRepository.create(newParking);
};

const getAllParkings = async () => {
  return await parkingRepository.findAll();
};

const getParkingById = async (parkingId) => {
  const parking = await parkingRepository.findById(parkingId);
  if (!parking) throw new Error("PARKING_NOT_FOUND");
  return parking;
};

const getMyParkings = async (ownerId) => {
  return await parkingRepository.findByOwnerId(ownerId);
};

const updateParking = async (uid, parkingId, data) => {
  const parking = await parkingRepository.findById(parkingId);
  if (!parking) throw new Error("PARKING_NOT_FOUND");

  if (parking.ownerId !== uid) throw new Error("UNAUTHORIZED_ACCESS");

  return await parkingRepository.update(parkingId, data);
};

export default {
  publishParking,
  getAllParkings,
  getParkingById,
  getMyParkings,
  updateParking,
};
