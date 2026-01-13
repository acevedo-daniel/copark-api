import { z } from "zod";

export const createBooking = z.object({
  parkingId: z.string(),
  vehicleId: z.string().optional(),
  startTime: z.iso.date(),
  endTime: z.iso.date(),
});
