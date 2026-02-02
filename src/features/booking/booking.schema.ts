import { z } from "zod";
import { createVehicleSchema } from "../vehicle/vehicle.schema.js";

export const checkInSchema = createVehicleSchema;

export const checkOutParamsSchema = z.object({
  bookingId: z.uuid({ error: "Invalid booking ID" }),
});

export const bookingQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
});

export const parkingParamsSchema = z.object({
  parkingId: z.uuid({ error: "Invalid parking ID" }),
});

export const bookingParamsSchema = z.object({
  bookingId: z.uuid({ error: "Invalid booking ID" }),
});

export type CheckInDto = z.infer<typeof checkInSchema>;
export type CheckOutParams = z.infer<typeof checkOutParamsSchema>;
export type BookingQuery = z.infer<typeof bookingQuerySchema>;
export type ParkingParams = z.infer<typeof parkingParamsSchema>;
export type BookingParams = z.infer<typeof bookingParamsSchema>;
