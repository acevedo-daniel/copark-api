import { z } from 'zod';
import { paginationMetaSchema } from '../../utils/pagination.schema.js';

const vehicleTypes = ['CAR', 'MOTORCYCLE', 'LARGE'] as const;

export const createVehicleSchema = z
  .strictObject({
    plate: z
      .string({ error: 'Required' })
      .trim()
      .min(4, { error: 'Min 4 chars' })
      .max(10, { error: 'Max 10 chars' })
      .toUpperCase()
      .openapi({ description: 'Vehicle license plate', example: 'ABC-123' }),

    type: z
      .enum(vehicleTypes, { error: 'Invalid type' })
      .default('CAR')
      .openapi({ description: 'Vehicle type', example: 'CAR' }),

    brand: z
      .string()
      .max(50, { error: 'Max 50 chars' })
      .trim()
      .optional()
      .openapi({ description: 'Vehicle brand', example: 'Toyota' }),

    model: z
      .string()
      .max(50, { error: 'Max 50 chars' })
      .trim()
      .optional()
      .openapi({ description: 'Vehicle model', example: 'Corolla' }),

    customerName: z
      .string()
      .max(100, { error: 'Max 100 chars' })
      .trim()
      .optional()
      .openapi({ description: 'Owner name', example: 'Jane Doe' }),

    customerPhone: z
      .string()
      .max(20, { error: 'Max 20 chars' })
      .trim()
      .optional()
      .openapi({ description: 'Owner phone', example: '+1234567890' }),

    notes: z
      .string()
      .max(500, { error: 'Max 500 chars' })
      .trim()
      .optional()
      .openapi({ description: 'Additional notes', example: 'Scratch on left door' }),
  })
  .openapi('CreateVehicleRequest');

export const vehicleResponseSchema = z
  .strictObject({
    id: z.uuid({ error: 'Invalid ID' }).openapi({ description: 'Vehicle UUID' }),
    plate: z.string().openapi({ description: 'Vehicle license plate' }),
    type: z.enum(vehicleTypes).openapi({ description: 'Vehicle type' }),
    brand: z.string().nullable().openapi({ description: 'Vehicle brand' }),
    model: z.string().nullable().openapi({ description: 'Vehicle model' }),
    customerName: z.string().nullable().openapi({ description: 'Owner name' }),
    customerPhone: z.string().nullable().openapi({ description: 'Owner phone' }),
    notes: z.string().nullable().openapi({ description: 'Additional notes' }),
    createdAt: z.date().openapi({ description: 'Creation date' }),
    updatedAt: z.date().openapi({ description: 'Update date' }),
  })
  .openapi('VehicleResponse');

export const vehicleListResponseSchema = z
  .strictObject({
    data: z.array(vehicleResponseSchema),
    meta: paginationMetaSchema,
  })
  .openapi('VehicleListResponse');

export const updateVehicleSchema = createVehicleSchema
  .partial()
  .omit({ plate: true })
  .openapi('UpdateVehicleRequest');

export const vehicleParamsSchema = z.strictObject({
  id: z.uuid({ error: 'Invalid ID' }).openapi({ description: 'Vehicle UUID' }),
});

export const vehicleParkingParamsSchema = z.strictObject({
  parkingId: z.uuid({ error: 'Invalid ID' }).openapi({ description: 'Parking Lot UUID' }),
});

export const vehiclePlateParamsSchema = z.strictObject({
  parkingId: z.uuid({ error: 'Invalid ID' }).openapi({ description: 'Parking Lot UUID' }),
  plate: z
    .string({ error: 'Required' })
    .trim()
    .min(4, { error: 'Min 4 chars' })
    .max(10, { error: 'Max 10 chars' })
    .toUpperCase()
    .openapi({ description: 'License Plate' }),
});

export type CreateVehicle = z.infer<typeof createVehicleSchema>;
export type UpdateVehicle = z.infer<typeof updateVehicleSchema>;
export type VehicleResponse = z.infer<typeof vehicleResponseSchema>;
export type VehicleListResponse = z.infer<typeof vehicleListResponseSchema>;
export type VehicleParams = z.infer<typeof vehicleParamsSchema>;
export type VehicleParkingParams = z.infer<typeof vehicleParkingParamsSchema>;
export type VehiclePlateParams = z.infer<typeof vehiclePlateParamsSchema>;
