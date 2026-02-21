import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { errorResponse } from '../../docs/error-response.js';

import {
  reviewParkingParamsSchema,
  reviewQuerySchema,
  reviewListResponseSchema,
  reviewStatsResponseSchema,
} from './review.schema.js';

export function registerReviewDocs(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: 'get',
    path: '/reviews/parking/{parkingId}',
    tags: ['Reviews'],
    summary: 'Get Reviews',
    description: 'Get reviews for a parking spot.',
    request: {
      params: reviewParkingParamsSchema,
      query: reviewQuerySchema,
    },
    responses: {
      200: {
        description: 'Reviews retrieved successfully',
        content: {
          'application/json': {
            schema: reviewListResponseSchema,
          },
        },
      },
      400: errorResponse('Validation error'),
      404: errorResponse('Parking not found'),
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/reviews/parking/{parkingId}/stats',
    tags: ['Reviews'],
    summary: 'Get Review Stats',
    description: 'Get review statistics for a parking spot.',
    request: {
      params: reviewParkingParamsSchema,
    },
    responses: {
      200: {
        description: 'Review statistics retrieved successfully',
        content: {
          'application/json': {
            schema: reviewStatsResponseSchema,
          },
        },
      },
      400: errorResponse('Validation error'),
      404: errorResponse('Parking not found'),
    },
  });
}
