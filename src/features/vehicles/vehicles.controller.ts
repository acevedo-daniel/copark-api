import * as vehiclesService from "./vehicles.service.js";
import { Request, Response, NextFunction } from "express";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.user.id;
    const vehicleData = req.body;
    const newVehicle = await vehiclesService.addVehicle(id, vehicleData);
    res.status(201).json(newVehicle);
  } catch (error) {
    next(error);
  }
};

export const listMine = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.user.id;
    const vehicles = await vehiclesService.getMyVehicles(id);
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.user.id;
    const { vehicleId } = req.params;
    await vehiclesService.removeVehicle(id, vehicleId);
    res.json({
      success: true,
      message: "Vehicle Removed",
    });
  } catch (error) {
    next(error);
  }
};
