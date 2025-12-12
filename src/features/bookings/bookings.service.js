import * as bookingRepository from "./bookings.repository.js";
import * as parkingService from "../parkings/parkings.service.js";
import * as vehicleService from "../vehicles/vehicles.service.js";

export const createBooking = async (userId, bookingData) => {
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
  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  const hoursToCharge = Math.max(1, Math.ceil(diffHours));
  const totalPrice = hoursToCharge * parking.pricePerHour;

  const newBooking = {
    ...bookingData,
    driverId: userId,
    vehicleId: myVehicle.id,
    totalPrice,
    status: "CONFIRMED",
    createdAt: new Date(),
  };

  return await bookingRepository.create(newBooking);
};

export const getMyBookings = async (userId) => {
  return await bookingRepository.findByUserId(userId);
};

export const cancelBooking = async (driverId, bookingId) => {
  const myBookings = await bookingRepository.findByUserId(driverId);
  const booking = myBookings.find((b) => b.id === bookingId);

  if (!booking) throw new Error("BOOKING_NOT_FOUND_OR_NOT_YOURS");

  return await bookingRepository.cancel(bookingId);
};

export const getBookingById = async (uid, bookingId) => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new Error("BOOKING_NOT_FOUND");
  }

  if (booking.driverId !== uid && booking.ownerId !== uid) {
    throw new Error("UNAUTHORIZED_ACCESS");
  }

  return booking;
};
