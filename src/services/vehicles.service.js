import vehicleRepository from "../repositories/vehicles.repository.js";

const addVehicle = async (uid, vehicleData) => {
  const newVehicle = {
    ...vehicleData,
    userId: uid,
    createdAt: new Date().toISOString(),
  };
  return await vehicleRepository.create(newVehicle);
};

const getMyVehicles = async (uid) => {
  return await vehicleRepository.findByUserId(uid);
};

const removeVehicle = async (uid) => {
  return await vehicleRepository.deleteById(uid);
};

export default { addVehicle, getMyVehicles, removeVehicle };
