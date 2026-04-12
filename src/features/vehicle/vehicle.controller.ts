import type { Request, Response } from 'express';
import type { CreateVehicle, VehicleParkingParams, VehiclePlateParams } from './vehicle.schema.js';
import * as vehiclesService from './vehicle.service.js';
import { requireUser } from '../../utils/require-user.js';

export const create = async (
  req: Request<VehicleParkingParams, unknown, CreateVehicle>,
  res: Response,
): Promise<void> => {
  requireUser(req);
  const vehicle = await vehiclesService.create(req.user.id, req.params.parkingId, req.body);
  res.status(201).json(vehicle);
};

export const findByPlate = async (
  req: Request<VehiclePlateParams>,
  res: Response,
): Promise<void> => {
  requireUser(req);
  const vehicle = await vehiclesService.findByPlate(
    req.user.id,
    req.params.plate,
    req.params.parkingId,
  );
  res.json(vehicle);
};
