import * as vehiclesService from "./vehicles.service.js";

export const create = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const vehicleData = req.body;
    const newVehicle = await vehiclesService.addVehicle(uid, vehicleData);
    return res.status(201).json(newVehicle);
  } catch (error) {
    next(error);
  }
};

export const listMine = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const vehicles = await vehiclesService.getMyVehicles(uid);
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;
    await vehiclesService.removeVehicle(uid, id);
    res.json({
      success: true,
      message: "Vehicle Removed",
    });
  } catch (error) {
    next(error);
  }
};
