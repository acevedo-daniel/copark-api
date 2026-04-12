import { z } from 'zod';
import type { Booking } from '../../../prisma/generated/client.js';
import { paginationMetaSchema } from '../../utils/pagination.schema.js';
import { createVehicleSchema } from '../vehicle/vehicle.schema.js';

export const checkInSchema = createVehicleSchema;

export const checkOutParamsSchema = z.strictObject({
  bookingId: z.uuid({ error: 'Invalid ID' }).openapi({ description: 'Booking UUID' }),
});

export const bookingQuerySchema = z.strictObject({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1)
    .openapi({ description: 'Page number', example: 1 }),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10)
    .openapi({ description: 'Items per page', example: 10 }),
  status: z
    .enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
    .optional()
    .openapi({ description: 'Filter by status', example: 'PENDING' }),
});

export const parkingParamsSchema = z.strictObject({
  parkingId: z.uuid({ error: 'Invalid ID' }).openapi({ description: 'Parking Lot UUID' }),
});

export const bookingParamsSchema = z.strictObject({
  bookingId: z.uuid({ error: 'Invalid ID' }).openapi({ description: 'Booking UUID' }),
});

export const bookingResponseSchema = z
  .strictObject({
    id: z.uuid().openapi({ description: 'Booking UUID' }),
    startTime: z.date().openapi({ description: 'Start time' }),
    endTime: z.date().nullable().openapi({ description: 'End time' }),
    totalPrice: z.number().nullable().openapi({ description: 'Total price' }),
    status: z
      .enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
      .openapi({ description: 'Booking status' }),
    parkingId: z.uuid().openapi({ description: 'Parking UUID' }),
    vehicleId: z.uuid().openapi({ description: 'Vehicle UUID' }),
    createdAt: z.date().openapi({ description: 'Creation date' }),
    updatedAt: z.date().openapi({ description: 'Update date' }),
  })
  .openapi('BookingResponse');

export const bookingListResponseSchema = z
  .strictObject({
    data: z.array(bookingResponseSchema),
    meta: paginationMetaSchema,
  })
  .openapi('BookingListResponse');

export type CheckIn = z.infer<typeof checkInSchema>;
export type CheckOutParams = z.infer<typeof checkOutParamsSchema>;
export type BookingQuery = z.infer<typeof bookingQuerySchema>;
export type ParkingParams = z.infer<typeof parkingParamsSchema>;
export type BookingParams = z.infer<typeof bookingParamsSchema>;
export type BookingResponse = z.infer<typeof bookingResponseSchema>;
export type BookingListResponse = z.infer<typeof bookingListResponseSchema>;

export function toBookingResponse(booking: Booking): BookingResponse {
  return {
    id: booking.id,
    startTime: booking.startTime,
    endTime: booking.endTime,
    totalPrice: booking.totalPrice,
    status: booking.status,
    parkingId: booking.parkingId,
    vehicleId: booking.vehicleId,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}
