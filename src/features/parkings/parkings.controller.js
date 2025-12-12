import * as parkingsService from "./parkings.service.js";

export const publish = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const parkingData = req.body;
    const newParking = await parkingsService.publishParking(uid, parkingData);
    return res.status(201).json(newParking);
  } catch (error) {
    next(error);
  }
};

export const listAll = async (req, res, next) => {
  try {
    const parkings = await parkingsService.getAllParkings();
    return res.json(parkings);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parking = await parkingsService.getParkingById(id);
    return res.json(parking);
  } catch (error) {
    next(error);
  }
};

export const listMine = async (req, res, next) => {
  try {
    const ownerId = req.user.uid;
    const parkings = await parkingsService.getMyParkings(ownerId);
    res.json(parkings);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const ownerId = req.user.uid;
    const { id } = req.params;
    const data = req.body;
    const updatedParking = await parkingsService.updateParking(
      ownerId,
      id,
      data
    );
    res.json(updatedParking);
  } catch (error) {
    next(error);
  }
};
