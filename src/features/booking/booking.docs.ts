import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { errorResponse } from '../../docs/error-response.js';
import {
  checkInSchema,
  checkOutParamsSchema,
  bookingResponseSchema,
  parkingParamsSchema,
  bookingQuerySchema,
  bookingListResponseSchema,
  bookingParamsSchema,
} from './booking.schema.js';

export function registerBookingDocs(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: 'post',
    path: '/parkings/{parkingId}/bookings/check-in',
    tags: ['Bookings'],
    summary: 'Check In',
    description: 'Check in a vehicle.',
    security: [{ bearerAuth: [] }],
    request: {
      params: parkingParamsSchema,
      body: {
        required: true,
        content: {
          'application/json': {
            schema: checkInSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Check in successful',
        content: {
          'application/json': {
            schema: bookingResponseSchema,
          },
        },
      },
      400: errorResponse('Validation error'),
      401: errorResponse('Unauthorized - Invalid token'),
      403: errorResponse('Forbidden - not the owner'),
      404: errorResponse('Parking not found'),
      409: errorResponse('Conflict (vehicle already inside, parking full, or parking inactive)'),
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/bookings/{bookingId}/check-out',
    tags: ['Bookings'],
    summary: 'Check Out',
    description: 'Check out a vehicle.',
    security: [{ bearerAuth: [] }],
    request: {
      params: checkOutParamsSchema,
    },
    responses: {
      200: {
        description: 'Check out successful',
        content: {
          'application/json': {
            schema: bookingResponseSchema,
          },
        },
      },
      400: errorResponse('Validation error'),
      401: errorResponse('Unauthorized - Invalid token'),
      403: errorResponse('Forbidden - not the owner'),
      404: errorResponse('Booking not found'),
      409: errorResponse('This booking is not active'),
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/parkings/{parkingId}/bookings/active',
    tags: ['Bookings'],
    summary: 'List Active Bookings',
    description: 'List active bookings for a parking lot.',
    security: [{ bearerAuth: [] }],
    request: {
      params: parkingParamsSchema,
    },
    responses: {
      200: {
        description: 'List of active bookings',
        content: {
          'application/json': {
            schema: bookingResponseSchema.array(),
          },
        },
      },
      401: errorResponse('Unauthorized'),
      403: errorResponse('Forbidden - not the owner'),
      404: errorResponse('Parking not found'),
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/parkings/{parkingId}/bookings',
    tags: ['Bookings'],
    summary: 'List Bookings',
    description: 'List all bookings for a parking lot.',
    security: [{ bearerAuth: [] }],
    request: {
      params: parkingParamsSchema,
      query: bookingQuerySchema,
    },
    responses: {
      200: {
        description: 'List of bookings',
        content: {
          'application/json': {
            schema: bookingListResponseSchema,
          },
        },
      },
      401: errorResponse('Unauthorized'),
      403: errorResponse('Forbidden - not the owner'),
      404: errorResponse('Parking not found'),
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/bookings/{bookingId}',
    tags: ['Bookings'],
    summary: 'Get Booking',
    description: 'Get booking details.',
    security: [{ bearerAuth: [] }],
    request: {
      params: bookingParamsSchema,
    },
    responses: {
      200: {
        description: 'Booking details',
        content: {
          'application/json': {
            schema: bookingResponseSchema,
          },
        },
      },
      403: errorResponse('Forbidden - not the owner'),
      404: errorResponse('Booking not found'),
      401: errorResponse('Unauthorized'),
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/bookings/{bookingId}/cancel',
    tags: ['Bookings'],
    summary: 'Cancel Booking',
    description: 'Cancel a booking.',
    security: [{ bearerAuth: [] }],
    request: {
      params: bookingParamsSchema,
    },
    responses: {
      200: {
        description: 'Booking cancelled',
        content: {
          'application/json': {
            schema: bookingResponseSchema,
          },
        },
      },
      403: errorResponse('Forbidden - not the owner'),
      404: errorResponse('Booking not found'),
      401: errorResponse('Unauthorized'),
      409: errorResponse('This booking is not active'),
    },
  });
}
