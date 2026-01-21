import { prisma } from "../../config/prisma.js";
import { Booking, Prisma } from "../../../prisma/generated/client.js";

type BookingWithParking = Prisma.BookingGetPayload<{
  include: { parking: { select: { ownerId: true } } };
}>;

export const create = async (data: Booking): Promise<Booking> => {
  return await prisma.booking.create({
    data: data,
  });
};

export const findByUserId = async (id: string): Promise<Booking[]> => {
  return await prisma.booking.findMany({
    where: { driverId: id },
  });
};

export const cancel = async (bookingId: string): Promise<Booking> => {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });
};

export const findById = async (
  bookingId: string,
): Promise<BookingWithParking | null> => {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      parking: {
        select: {
          ownerId: true,
        },
      },
    },
  });
};
