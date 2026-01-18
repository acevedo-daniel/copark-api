import * as bookingService from "./bookings.service.js";
import { Request, Response, NextFunction } from "express";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.id;
    const bookingData = req.body;
    const newBooking = await bookingService.createBooking(userId, bookingData);
    res.status(201).json(newBooking);
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
    const userId = req.user.id;
    const bookings = await bookingService.getMyBookings(userId);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const cancel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const result = await bookingService.cancelBooking(userId, bookingId);
    res.json(result);
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
    const userId = req.user.id;
    const { id } = req.params;
    const booking = await bookingService.getBookingById(userId, id);
    res.json(booking);
  } catch (error) {
    next(error);
  }
};
