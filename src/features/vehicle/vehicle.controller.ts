import * as vehiclesService from "./vehicle.service.js";
import type { Request, Response, NextFunction } from "express";
import type {
  CreateVehicleDto,
  VehicleParkingParams,
  VehiclePlateParams,
} from "./vehicle.schema.js";

export const create = async (
  req: Request<VehicleParkingParams, unknown, CreateVehicleDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { parkingId } = req.params;
    const dto = req.body;
    const vehicle = await vehiclesService.create(parkingId, dto);
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const findByPlate = async (
  req: Request<VehiclePlateParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { parkingId, plate } = req.params;
    const vehicle = await vehiclesService.findByPlate(plate, parkingId);
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};
