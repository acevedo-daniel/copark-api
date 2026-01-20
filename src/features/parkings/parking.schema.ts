import { z } from "zod";

export const createParkingSchema = z.object({
  title: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Title is required" : undefined,
    })
    .min(5, { error: "Title must be at least 5 characters" })
    .max(100, { error: "Title must be at most 100 characters" })
    .trim(),

  description: z
    .string()
    .max(500, { error: "Description must be at most 500 characters" })
    .trim()
    .optional(),

  address: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Address is required" : undefined,
    })
    .min(5, { error: "Address must be at least 5 characters" })
    .max(200)
    .trim(),

  image: z.url({ error: "Image must be a valid URL" }).optional(),

  pricePerHour: z
    .number({
      error: (iss) =>
        iss.input === undefined ? "Price is required" : undefined,
    })
    .positive({ error: "Price must be greater than 0" }),

  totalSpaces: z
    .number({
      error: (iss) =>
        iss.input === undefined ? "Total spaces is required" : undefined,
    })
    .int({ error: "Total spaces must be an integer" })
    .positive({ error: "Total spaces must be at least 1" }),

  lat: z
    .number({
      error: (iss) =>
        iss.input === undefined ? "Latitude is required" : undefined,
    })
    .min(-90, { error: "Latitude must be between -90 and 90" })
    .max(90, { error: "Latitude must be between -90 and 90" }),

  lng: z
    .number({
      error: (iss) =>
        iss.input === undefined ? "Longitude is required" : undefined,
    })
    .min(-180, { error: "Longitude must be between -180 and 180" })
    .max(180, { error: "Longitude must be between -180 and 180" }),
});

export const updateParkingSchema = createParkingSchema.partial();

export const parkingParamsSchema = z.object({
  id: z.uuid({ error: "Invalid parking ID" }),
});

export const parkingQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  ownerId: z.uuid().optional(),
});

export type CreateParkingDto = z.infer<typeof createParkingSchema>;
export type UpdateParkingDto = z.infer<typeof updateParkingSchema>;
export type ParkingParams = z.infer<typeof parkingParamsSchema>;
export type ParkingQuery = z.infer<typeof parkingQuerySchema>;
