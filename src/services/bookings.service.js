import bookingRepository from "../repositories/bookings.repository.js";
import parkingService from "./parkings.service.js";
import vehicleService from "./vehicles.service.js";

const createBooking = async (userId, bookingData) => {
  const parking = await parkingService.getParkingById(bookingData.parkingId);
  const userVehicles = await vehicleService.getMyVehicles(userId);
  const myVehicle = userVehicles.find((v) => v.id === bookingData.vehicleId);

  if (!myVehicle) throw new Error("VEHICLE_NOT_FOUND_OR_NOT_YOURS");

  const start = new Date(bookingData.startTime);
  const end = new Date(bookingData.endTime);
  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  const hoursToCharge = Math.max(1, Math.ceil(diffHours));
  const totalPrice = hoursToCharge * parking.pricePerHour;

  const newBooking = {
    ...bookingData,
    driverId: userId,
    totalPrice,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    vehicleSnapshot: {
      brand: myVehicle.brand,
      model: myVehicle.model,
      plate: myVehicle.plate,
    },
  };

  return await bookingRepository.create(newBooking);
};

const getMyBookings = async (userId) => {
  return await bookingRepository.findByUserId(userId);
};

const cancelBooking = async (driverId, bookingId) => {
  const myBookings = await bookingRepository.findByUserId(driverId);
  const booking = myBookings.find((b) => b.id === bookingId);

  if (!booking) throw new Error("BOOKING_NOT_FOUND_OR_NOT_YOURS");

  return await bookingRepository.cancel(bookingId);
};

const getBookingById = async (uid, bookingId) => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new Error("BOOKING_NOT_FOUND");
  }

  if (booking.driverId !== uid && booking.ownerId !== uid) {
    throw new Error("UNAUTHORIZED_ACCESS");
  }

  return booking;
};

export default { createBooking, getMyBookings, cancelBooking, getBookingById };
