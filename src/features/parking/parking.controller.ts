import * as parkingService from "./parking.service.js";
import { Request, Response, NextFunction } from "express";
import {
  ParkingParams,
  ParkingQuery,
  CreateParkingDto,
  UpdateParkingDto,
} from "./parking.schema.js";

export const create = async (
  req: Request<{}, {}, CreateParkingDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const ownerId = req.user.id;
    const dto = req.body;
    const parking = await parkingService.create(ownerId, dto);
    res.status(201).json(parking);
  } catch (error) {
    next(error);
  }
};

export const findAll = async (
  req: Request<{}, {}, {}, ParkingQuery>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await parkingService.findAllPaginated(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const findById = async (
  req: Request<ParkingParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const parking = await parkingService.findById(id);
    res.json(parking);
  } catch (error) {
    next(error);
  }
};

export const findMine = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const ownerId = req.user.id;
    const parkings = await parkingService.findByOwnerId(ownerId);
    res.json(parkings);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request<ParkingParams, {}, UpdateParkingDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;
    const dto = req.body;
    const parking = await parkingService.update(ownerId, id, dto);
    res.json(parking);
  } catch (error) {
    next(error);
  }
};
