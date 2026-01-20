import { z } from "zod";

const vehicleTypes = ["CAR", "MOTORCYCLE", "LARGE"] as const;

export const createVehicleSchema = z.object({
  brand: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Brand is required" : undefined,
    })
    .min(2, { error: "Brand must be at least 2 characters" })
    .max(50, { error: "Brand must be at most 50 characters" })
    .trim(),

  model: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Model is required" : undefined,
    })
    .min(1, { error: "Model is required" })
    .max(50, { error: "Model must be at most 50 characters" })
    .trim(),

  plate: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Plate is required" : undefined,
    })
    .min(6, { error: "Plate must be at least 6 characters" })
    .max(10, { error: "Plate must be at most 10 characters" })
    .toUpperCase()
    .trim(),

  type: z.enum(vehicleTypes, { error: "Invalid vehicle type" }),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const vehicleParamsSchema = z.object({
  id: z.uuid({ error: "Invalid vehicle ID" }),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
export type VehicleParams = z.infer<typeof vehicleParamsSchema>;
