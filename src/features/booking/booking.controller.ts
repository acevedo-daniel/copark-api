import * as bookingService from "./booking.service.js";
import type { Request, Response, NextFunction } from "express";
import type {
  CheckInDto,
  BookingQuery,
  ParkingParams,
  BookingParams,
} from "./booking.schema.js";
import { UnauthorizedError } from "../../errors/http.errors.js";

export const checkIn = async (
  req: Request<ParkingParams, unknown, CheckInDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError();
    const ownerId = req.user.id;
    const { parkingId } = req.params;
    const dto = req.body;
    const booking = await bookingService.checkIn(ownerId, parkingId, dto);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const checkOut = async (
  req: Request<BookingParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError();
    const ownerId = req.user.id;
    const { bookingId } = req.params;
    const booking = await bookingService.checkOut(ownerId, bookingId);
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const listActive = async (
  req: Request<ParkingParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError();
    const ownerId = req.user.id;
    const { parkingId } = req.params;
    const bookings = await bookingService.getActiveBookingsByParking(
      ownerId,
      parkingId,
    );
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const findAll = async (
  req: Request<ParkingParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError();
    const ownerId = req.user.id;
    const { parkingId } = req.params;
    const query = res.locals.validatedQuery as BookingQuery;
    const result = await bookingService.getBookingsByParking(
      ownerId,
      parkingId,
      query,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const findById = async (
  req: Request<BookingParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError();
    const ownerId = req.user.id;
    const { bookingId } = req.params;
    const booking = await bookingService.getBookingById(ownerId, bookingId);
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const cancel = async (
  req: Request<BookingParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError();
    const ownerId = req.user.id;
    const { bookingId } = req.params;
    const booking = await bookingService.cancelBooking(ownerId, bookingId);
    res.json(booking);
  } catch (error) {
    next(error);
  }
};
