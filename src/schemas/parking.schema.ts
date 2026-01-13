import { z } from "zod";

export const publishParking = z.object({
  title: z.string().min(5).max(50),
  address: z.string(),
  pricePerHour: z.number().min(0),
  totalSpaces: z.int().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(100),
});

export const updateParking = publishParking.partial();
