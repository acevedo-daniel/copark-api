import * as bookingService from "./bookings.service.js";

export const create = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const bookingData = req.body;
    const newBooking = await bookingService.createBooking(userId, bookingData);
    res.status(201).json(newBooking);
  } catch (error) {
    next(error);
  }
};

export const listMine = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const bookings = await bookingService.getMyBookings(userId);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { bookingId } = req.params;
    const result = await bookingService.cancelBooking(userId, bookingId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;
    const booking = await bookingService.getBookingById(userId, id);
    res.json(booking);
  } catch (error) {
    next(error);
  }
};
