import * as parkingsService from "./parkings.service.js";
import { Request, Response, NextFunction } from "express";

export const publish = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const uid = req.user.id;
    const parkingData = req.body;
    const newParking = await parkingsService.publishParking(uid, parkingData);
    res.status(201).json(newParking);
  } catch (error) {
    next(error);
  }
};

export const listAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parkings = await parkingsService.getAllParkings();
    res.json(parkings);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const parking = await parkingsService.getParkingById(id);
    res.json(parking);
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
    const ownerId = req.user.id;
    const parkings = await parkingsService.getMyParkings(ownerId);
    res.json(parkings);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;
    const data = req.body;
    const updatedParking = await parkingsService.updateParking(
      ownerId,
      id,
      data,
    );
    res.json(updatedParking);
  } catch (error) {
    next(error);
  }
};
