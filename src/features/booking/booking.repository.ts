import { prisma } from "../../config/prisma.js";
import { Booking, Prisma } from "../../../prisma/generated/client.js";
import { BookingWithRelations } from "./booking.types.js";

export const create = async (
  data: Prisma.BookingCreateInput,
): Promise<Booking> => {
  return await prisma.booking.create({
    data,
    include: {
      vehicle: true,
      parking: { select: { title: true, pricePerHour: true } },
    },
  });
};

export const findById = async (
  id: string,
): Promise<BookingWithRelations | null> => {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
      vehicle: true,
      parking: {
        select: { id: true, title: true, pricePerHour: true, ownerId: true },
      },
    },
  });
};

export const update = async (
  id: string,
  data: Prisma.BookingUpdateInput,
): Promise<Booking> => {
  return await prisma.booking.update({
    where: { id },
    data,
    include: {
      vehicle: true,
      parking: { select: { title: true, pricePerHour: true } },
    },
  });
};

export const findActiveByParking = async (
  parkingId: string,
): Promise<Booking[]> => {
  return await prisma.booking.findMany({
    where: {
      parkingId,
      status: "CONFIRMED",
    },
    include: { vehicle: true },
    orderBy: { startTime: "desc" },
  });
};

export const findByParking = async (
  parkingId: string,
  options: {
    skip: number;
    take: number;
    status?: string;
  },
): Promise<{ data: Booking[]; total: number }> => {
  const where: Prisma.BookingWhereInput = {
    parkingId,
    ...(options.status && {
      status: options.status as Prisma.EnumBookingStatusFilter,
    }),
  };
  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip: options.skip,
      take: options.take,
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.count({ where }),
  ]);
  return { data, total };
};

export const findActiveByVehicle = async (
  vehicleId: string,
): Promise<Booking | null> => {
  return await prisma.booking.findFirst({
    where: {
      vehicleId,
      status: "CONFIRMED",
    },
  });
};

export const cancel = async (id: string): Promise<Booking> => {
  return await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};
