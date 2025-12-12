import * as vehicleRepository from "./vehicles.repository.js";

export const addVehicle = async (uid, vehicleData) => {
  const newVehicle = {
    ...vehicleData,
    userId: uid,
    createdAt: new Date().toISOString(),
  };
  return await vehicleRepository.create(newVehicle);
};

export const getMyVehicles = async (uid) => {
  return await vehicleRepository.findByUserId(uid);
};

export const removeVehicle = async (uid, vehicleId) => {

  
  return await vehicleRepository.deleteById(vehicleId);
};
