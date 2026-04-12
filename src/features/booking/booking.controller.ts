import * as bookingService from './booking.service.js';
import type { Request, Response } from 'express';
import type { CheckIn, BookingQuery, ParkingParams, BookingParams } from './booking.schema.js';
import { requireUser } from '../../utils/require-user.js';

export const checkIn = async (
  req: Request<ParkingParams, unknown, CheckIn>,
  res: Response,
): Promise<void> => {
  requireUser(req);
  const booking = await bookingService.checkIn(req.user.id, req.params.parkingId, req.body);
  res.status(201).json(booking);
};

export const checkOut = async (req: Request<BookingParams>, res: Response): Promise<void> => {
  requireUser(req);
  const booking = await bookingService.checkOut(req.user.id, req.params.bookingId);
  res.json(booking);
};

export const listActive = async (req: Request<ParkingParams>, res: Response): Promise<void> => {
  requireUser(req);
  const bookings = await bookingService.getActiveBookingsByParking(
    req.user.id,
    req.params.parkingId,
  );
  res.json(bookings);
};

export const findAll = async (
  req: Request<ParkingParams, unknown, unknown, BookingQuery>,
  res: Response,
): Promise<void> => {
  requireUser(req);
  const result = await bookingService.getBookingsByParking(
    req.user.id,
    req.params.parkingId,
    req.query,
  );
  res.json(result);
};

export const findById = async (req: Request<BookingParams>, res: Response): Promise<void> => {
  requireUser(req);
  const booking = await bookingService.getBookingById(req.user.id, req.params.bookingId);
  res.json(booking);
};

export const cancel = async (req: Request<BookingParams>, res: Response): Promise<void> => {
  requireUser(req);
  const booking = await bookingService.cancelBooking(req.user.id, req.params.bookingId);
  res.json(booking);
};
