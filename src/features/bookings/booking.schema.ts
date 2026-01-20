import { z } from "zod";

export const createBookingSchema = z
  .object({
    parkingId: z.uuid({
      error: (iss) => {
        if (iss.code === "invalid_type") return "Parking ID is required";

        return "Invalid parking ID";
      },
    }),
    vehicleId: z.uuid({
      error: (iss) => {
        if (iss.code === "invalid_type") return "Vehicle ID is required";

        return "Invalid vehicle ID";
      },
    }),
    startTime: z.iso.date({
      error: (iss) => {
        if (iss.code === "invalid_type") return "Start time is required";

        return "Invalid start time";
      },
    }),
    endTime: z.iso.date({
      error: (iss) => {
        if (iss.code === "invalid_type") return "End time is required";

        return "Invalid end time";
      },
    }),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    error: "End time must be after start time",
    path: ["endTime"],
  });
export const updateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});
export const bookingParamsSchema = z.object({
  id: z.uuid({ error: "Invalid booking ID" }),
});

export const bookingQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  parkingId: z.uuid().optional(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusDto = z.infer<typeof updateBookingStatusSchema>;
export type BookingParams = z.infer<typeof bookingParamsSchema>;
export type BookingQuery = z.infer<typeof bookingQuerySchema>;
