import { z } from "zod";

const vehicleTypes = ["CAR", "MOTORCYCLE", "LARGE"] as const;

export const createVehicleSchema = z.object({
  plate: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Plate is required" : undefined,
    })
    .min(4, { error: "Plate must be at least 4 characters" })
    .max(10, { error: "Plate must be at most 10 characters" })
    .toUpperCase()
    .trim(),

  type: z.enum(vehicleTypes, { error: "Invalid vehicle type" }).default("CAR"),

  brand: z
    .string()
    .max(50, { error: "Brand must be at most 50 characters" })
    .trim()
    .optional(),

  model: z
    .string()
    .max(50, { error: "Model must be at most 50 characters" })
    .trim()
    .optional(),

  customerName: z
    .string()
    .max(100, { error: "Customer name must be at most 100 characters" })
    .trim()
    .optional(),

  customerPhone: z
    .string()
    .max(20, { error: "Customer phone must be at most 20 characters" })
    .trim()
    .optional(),

  notes: z
    .string()
    .max(500, { error: "Notes must be at most 500 characters" })
    .trim()
    .optional(),
});

export const updateVehicleSchema = createVehicleSchema
  .partial()
  .omit({ plate: true });

export const vehicleParamsSchema = z.object({
  id: z.uuid({ error: "Invalid vehicle ID" }),
});

export const vehicleParkingParamsSchema = z.object({
  parkingId: z.uuid({ error: "Invalid parking ID" }),
});

export const vehiclePlateParamsSchema = z.object({
  parkingId: z.uuid({ error: "Invalid parking ID" }),
  plate: z.string().min(4).max(10),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
export type VehicleParams = z.infer<typeof vehicleParamsSchema>;
export type VehicleParkingParams = z.infer<typeof vehicleParkingParamsSchema>;
export type VehiclePlateParams = z.infer<typeof vehiclePlateParamsSchema>;
