import * as parkingService from './parking.service.js';
import type { Request, Response } from 'express';
import { ParkingParams, ParkingQuery, CreateParking, UpdateParking } from './parking.schema.js';
import { requireUser } from '../../utils/require-user.js';

export const create = async (
  req: Request<unknown, unknown, CreateParking>,
  res: Response,
): Promise<void> => {
  requireUser(req);
  const parking = await parkingService.create(req.user.id, req.body);
  res.status(201).json(parking);
};

export const findAll = async (
  req: Request<unknown, unknown, unknown, ParkingQuery>,
  res: Response,
): Promise<void> => {
  const result = await parkingService.findAll(req.query);
  res.json(result);
};

export const findById = async (req: Request<ParkingParams>, res: Response): Promise<void> => {
  const parking = await parkingService.findById(req.params.id);
  res.json(parking);
};

export const findOwned = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
): Promise<void> => {
  requireUser(req);
  const parkings = await parkingService.findOwned(req.user.id);
  res.json(parkings);
};

export const update = async (
  req: Request<ParkingParams, unknown, UpdateParking>,
  res: Response,
): Promise<void> => {
  requireUser(req);
  const parking = await parkingService.update(req.user.id, req.params.id, req.body);
  res.json(parking);
};
