import type { NextFunction, Request, Response } from 'express';
import type { CreateVehicle, VehicleParkingParams, VehiclePlateParams } from './vehicle.schema.js';
import * as vehiclesService from './vehicle.service.js';
import { UnauthorizedError } from '../../errors/index.js';

export const create = async (
  req: Request<VehicleParkingParams, unknown, CreateVehicle>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError();
    const ownerId = req.user.id;
    const { parkingId } = req.params;
    const dto = req.body;
    const vehicle = await vehiclesService.create(ownerId, parkingId, dto);
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
    if (!req.user) throw new UnauthorizedError();
    const ownerId = req.user.id;
    const { parkingId, plate } = req.params;
    const vehicle = await vehiclesService.findByPlate(ownerId, plate, parkingId);
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};
