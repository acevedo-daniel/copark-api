import * as bookingRepository from "./bookings.repository.js";
import * as parkingService from "../parkings/parkings.service.js";
import * as vehicleService from "../vehicles/vehicles.service.js";
import { Booking } from "@prisma/client";

export const createBooking = async (
  userId: string,
  bookingData: Booking,
): Promise<Booking> => {
  const parking = await parkingService.getParkingById(bookingData.parkingId);
  let myVehicle;

  if (bookingData.vehicleId) {
    const userVehicles = await vehicleService.getMyVehicles(userId);
    myVehicle = userVehicles.find((v) => v.id === bookingData.vehicleId);
    if (!myVehicle) throw new Error("VEHICLE_NOT_FOUND_OR_NOT_YOURS");
  } else {
    const userVehicles = await vehicleService.getMyVehicles(userId);
    if (userVehicles.length > 0) {
      myVehicle = userVehicles[0];
    } else {
      myVehicle = await vehicleService.addVehicle(userId, {
        brand: "Generic",
        model: "Visitor",
        plate: `WALK-${userId.substring(0, 5).toUpperCase()}`,
        type: "CAR",
      });
    }
  }

  const start = new Date(bookingData.startTime);
  const end = new Date(bookingData.endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const hoursToCharge = Math.max(1, Math.ceil(diffHours));
  const totalPrice = hoursToCharge * parking.pricePerHour;

  const newBooking = {
    ...bookingData,
    driverId: userId,
    vehicleId: myVehicle.id,
    totalPrice,
    status: "CONFIRMED" as const,
    createdAt: new Date(),
  };

  return await bookingRepository.create(newBooking);
};

export const getMyBookings = async (userId: string): Promise<Booking[]> => {
  return await bookingRepository.findByUserId(userId);
};

export const cancelBooking = async (
  driverId: string,
  bookingId: string,
): Promise<Booking> => {
  const myBookings = await bookingRepository.findByUserId(driverId);
  const booking = myBookings.find((b) => b.id === bookingId);

  if (!booking) throw new Error("BOOKING_NOT_FOUND_OR_NOT_YOURS");

  return await bookingRepository.cancel(bookingId);
};

export const getBookingById = async (id: string, bookingId: string) => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new Error("BOOKING_NOT_FOUND");
  }

  const ownerId = booking.parking?.ownerId;
  if (booking.driverId !== id && ownerId !== id) {
    throw new Error("UNAUTHORIZED_ACCESS");
  }

  return booking;
};
