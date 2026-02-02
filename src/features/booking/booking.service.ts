import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../errors/index.js";
import * as bookingRepository from "./booking.repository.js";
import * as parkingService from "../parking/parking.service.js";
import * as vehicleService from "../vehicle/vehicle.service.js";
import { Booking } from "../../../prisma/generated/client.js";
import type { CheckInDto, BookingQuery } from "./booking.schema.js";
import {
  type PaginationResult,
  createPaginatedResult,
} from "../../utils/pagination.js";

export const checkIn = async (
  ownerId: string,
  parkingId: string,
  dto: CheckInDto,
): Promise<Booking> => {
  const parking = await parkingService.findById(parkingId);
  if (parking.ownerId !== ownerId) {
    throw new ForbiddenError("You don't have access to this parking");
  }

  let vehicle = await vehicleService.findByPlate(dto.plate, parkingId);
  vehicle ??= await vehicleService.create(parkingId, {
    plate: dto.plate,
    type: dto.type,
    brand: dto.brand,
    model: dto.model,
    customerName: dto.customerName,
    customerPhone: dto.customerPhone,
    notes: dto.notes,
  });
  const activeBooking = await bookingRepository.findActiveByVehicle(vehicle.id);
  if (activeBooking) {
    throw new ConflictError("Vehicle is already in the parking");
  }

  return await bookingRepository.create({
    startTime: new Date(),
    status: "CONFIRMED",
    parking: { connect: { id: parkingId } },
    vehicle: { connect: { id: vehicle.id } },
  });
};

export const checkOut = async (
  ownerId: string,
  bookingId: string,
): Promise<Booking> => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.parking.ownerId !== ownerId) {
    throw new ForbiddenError("You don't have access to this booking");
  }

  if (booking.status !== "CONFIRMED") {
    throw new ConflictError("This booking is not active");
  }

  const endTime = new Date();
  const diffMs = endTime.getTime() - booking.startTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const hoursToCharge = Math.max(1, Math.ceil(diffHours));
  const totalPrice = hoursToCharge * booking.parking.pricePerHour;

  return await bookingRepository.update(bookingId, {
    endTime,
    totalPrice,
    status: "COMPLETED",
  });
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

export const getBookingById = async (
  ownerId: string,
  bookingId: string,
): Promise<Booking> => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.parking.ownerId !== ownerId) {
    throw new ForbiddenError("You don't have access to this booking");
  }

  return booking;
};

export const cancelBooking = async (
  ownerId: string,
  bookingId: string,
): Promise<Booking> => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.parking.ownerId !== ownerId) {
    throw new ForbiddenError("You don't have access to this booking");
  }

  if (booking.status !== "CONFIRMED") {
    throw new ConflictError("This booking is not active");
  }

  return await bookingRepository.cancel(bookingId);
};
