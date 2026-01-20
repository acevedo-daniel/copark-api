import { z } from "zod";
export const createVehicle = z.object({
  brand: z.string(),
  model: z.string(),
  plate: z.string().uppercase().min(6).max(7),
  type: z.enum(["CAR", "MOTORCYCLE", "BUS", "TRUCK"]),
});
