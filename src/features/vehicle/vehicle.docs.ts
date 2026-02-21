import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { errorResponse } from '../../docs/error-response.js';
import {
  createVehicleSchema,
  vehicleParkingParamsSchema,
  vehiclePlateParamsSchema,
  vehicleResponseSchema,
} from './vehicle.schema.js';

export function registerVehicleDocs(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: 'post',
    path: '/vehicles/{parkingId}',
    tags: ['Vehicles'],
    summary: 'Create Vehicle',
    description: 'Register a new vehicle in a parking lot.',
    security: [{ bearerAuth: [] }],
    request: {
      params: vehicleParkingParamsSchema,
      body: {
        required: true,
        content: {
          'application/json': {
            schema: createVehicleSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Vehicle created successfully',
        content: {
          'application/json': {
            schema: vehicleResponseSchema,
          },
        },
      },
      400: errorResponse('Validation error'),
      401: errorResponse('Unauthorized'),
      403: errorResponse('Forbidden - not the owner'),
      404: errorResponse('Parking not found'),
      409: errorResponse('Vehicle plate already exists in this parking'),
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/vehicles/{parkingId}/plate/{plate}',
    tags: ['Vehicles'],
    summary: 'Find by Plate',
    description: 'Find a vehicle by license plate in a specific parking lot.',
    security: [{ bearerAuth: [] }],
    request: {
      params: vehiclePlateParamsSchema,
    },
    responses: {
      200: {
        description: 'Vehicle details',
        content: {
          'application/json': {
            schema: vehicleResponseSchema,
          },
        },
      },
      401: errorResponse('Unauthorized'),
      403: errorResponse('Forbidden - not the owner'),
      404: errorResponse('Vehicle not found'),
    },
  });
}
