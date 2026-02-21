import { NotFoundError, ForbiddenError, ConflictError } from '../../errors/index.js';
import * as bookingRepository from './booking.repository.js';
import * as parkingService from '../parking/parking.service.js';
import * as vehicleService from '../vehicle/vehicle.service.js';
import { Booking, Prisma } from '../../../prisma/generated/client.js';
import type { CheckIn, BookingQuery } from './booking.schema.js';
import { type PaginationResult, createPaginatedResult } from '../../utils/pagination.js';

export const checkIn = async (
  ownerId: string,
  parkingId: string,
  dto: CheckIn,
): Promise<Booking> => {
  const parking = await parkingService.findById(parkingId);
  if (parking.ownerId !== ownerId) {
    throw new ForbiddenError("You don't have access to this parking");
  }

  if (!parking.isActive) {
    throw new ConflictError('Parking is inactive');
  }

  const activeBookings = await bookingRepository.findActiveByParking(parkingId);
  if (activeBookings.length >= parking.totalSpaces) {
    throw new ConflictError('Parking is full');
  }

  let vehicle;
  try {
    vehicle = await vehicleService.findByPlate(ownerId, dto.plate, parkingId);
  } catch (error) {
    if (!(error instanceof NotFoundError)) {
      throw error;
    }

    vehicle = await vehicleService.create(ownerId, parkingId, {
      plate: dto.plate,
      type: dto.type,
      brand: dto.brand,
      model: dto.model,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      notes: dto.notes,
    });
  }
  try {
    const booking = await bookingRepository.createConfirmedIfNoActive(parkingId, vehicle.id);
    if (!booking) {
      throw new ConflictError('Vehicle is already in the parking');
    }
    return booking;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      throw new ConflictError('Vehicle is already in the parking');
    }
    throw error;
  }
};

export const checkOut = async (ownerId: string, bookingId: string): Promise<Booking> => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.parking.ownerId !== ownerId) {
    throw new ForbiddenError("You don't have access to this booking");
  }

  const endTime = new Date();
  const diffMs = endTime.getTime() - booking.startTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const hoursToCharge = Math.max(1, Math.ceil(diffHours));
  const totalPrice = hoursToCharge * booking.parking.pricePerHour;

  const updated = await bookingRepository.completeIfConfirmed(bookingId, endTime, totalPrice);
  if (!updated) {
    throw new ConflictError('This booking is not active');
  }

  const updatedBooking = await bookingRepository.findById(bookingId);
  if (!updatedBooking) {
    throw new NotFoundError('Booking not found');
  }
  const { vehicle: _vehicle, parking: _parking, ...bookingData } = updatedBooking;
  return bookingData;
};

export const getActiveBookingsByParking = async (
  ownerId: string,
  parkingId: string,
): Promise<Booking[]> => {
  const parking = await parkingService.findById(parkingId);
  if (parking.ownerId !== ownerId) {
    throw new ForbiddenError("You don't have access to this parking");
  }

  return await bookingRepository.findActiveByParking(parkingId);
};

export const getBookingsByParking = async (
  ownerId: string,
  parkingId: string,
  query: BookingQuery,
): Promise<PaginationResult<Booking>> => {
  const parking = await parkingService.findById(parkingId);
  if (parking.ownerId !== ownerId) {
    throw new ForbiddenError("You don't have access to this parking");
  }

  const { page, limit, status } = query;
  const skip = (page - 1) * limit;

  const result = await bookingRepository.findByParking(parkingId, {
    skip,
    take: limit,
    status,
  });

  return createPaginatedResult(result.data, result.total, page, limit);
};

export const getBookingById = async (ownerId: string, bookingId: string): Promise<Booking> => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.parking.ownerId !== ownerId) {
    throw new ForbiddenError("You don't have access to this booking");
  }

  const { vehicle: _vehicle, parking: _parking, ...bookingData } = booking;
  return bookingData;
};

export const cancelBooking = async (ownerId: string, bookingId: string): Promise<Booking> => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.parking.ownerId !== ownerId) {
    throw new ForbiddenError("You don't have access to this booking");
  }

  const cancelled = await bookingRepository.cancelIfConfirmed(bookingId);
  if (!cancelled) {
    throw new ConflictError('This booking is not active');
  }

  const cancelledBooking = await bookingRepository.findById(bookingId);
  if (!cancelledBooking) {
    throw new NotFoundError('Booking not found');
  }
  const { vehicle: _vehicle, parking: _parking, ...bookingData } = cancelledBooking;
  return bookingData;
};
