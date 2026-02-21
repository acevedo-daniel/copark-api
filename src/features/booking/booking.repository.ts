import { prisma } from '../../config/prisma.js';
import { Booking, Prisma, type BookingStatus } from '../../../prisma/generated/client.js';
import { BookingWithRelations } from './booking.types.js';

export const create = async (data: Prisma.BookingCreateInput): Promise<Booking> => {
  return await prisma.booking.create({
    data,
  });
};

export const findById = async (id: string): Promise<BookingWithRelations | null> => {
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

export const update = async (id: string, data: Prisma.BookingUpdateInput): Promise<Booking> => {
  return await prisma.booking.update({
    where: { id },
    data,
  });
};

export const findActiveByParking = async (parkingId: string): Promise<Booking[]> => {
  return await prisma.booking.findMany({
    where: {
      parkingId,
      status: 'CONFIRMED',
    },
    orderBy: { startTime: 'desc' },
  });
};

export const findByParking = async (
  parkingId: string,
  options: {
    skip: number;
    take: number;
    status?: BookingStatus;
  },
): Promise<{ data: Booking[]; total: number }> => {
  const where: Prisma.BookingWhereInput = {
    parkingId,
    ...(options.status ? { status: options.status } : {}),
  };
  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.booking.count({ where }),
  ]);
  return { data, total };
};

export const findActiveByVehicle = async (vehicleId: string): Promise<Booking | null> => {
  return await prisma.booking.findFirst({
    where: {
      vehicleId,
      status: 'CONFIRMED',
    },
  });
};

export const createConfirmedIfNoActive = async (
  parkingId: string,
  vehicleId: string,
): Promise<Booking | null> => {
  return await prisma.$transaction(
    async (tx) => {
      const activeBooking = await tx.booking.findFirst({
        where: {
          vehicleId,
          status: 'CONFIRMED',
        },
      });

      if (activeBooking) {
        return null;
      }

      return await tx.booking.create({
        data: {
          startTime: new Date(),
          status: 'CONFIRMED',
          parking: { connect: { id: parkingId } },
          vehicle: { connect: { id: vehicleId } },
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
};

export const completeIfConfirmed = async (
  id: string,
  endTime: Date,
  totalPrice: number,
): Promise<boolean> => {
  const result = await prisma.booking.updateMany({
    where: {
      id,
      status: 'CONFIRMED',
    },
    data: {
      endTime,
      totalPrice,
      status: 'COMPLETED',
    },
  });

  return result.count === 1;
};

export const cancel = async (id: string): Promise<Booking> => {
  return await prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });
};

export const cancelIfConfirmed = async (id: string): Promise<boolean> => {
  const result = await prisma.booking.updateMany({
    where: {
      id,
      status: 'CONFIRMED',
    },
    data: {
      status: 'CANCELLED',
    },
  });

  return result.count === 1;
};
