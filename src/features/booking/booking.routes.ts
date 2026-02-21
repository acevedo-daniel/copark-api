import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { typedHandler } from '../../utils/typed-handler.js';
import * as bookingController from './booking.controller.js';
import {
  bookingParamsSchema,
  bookingQuerySchema,
  checkInSchema,
  parkingParamsSchema,
} from './booking.schema.js';

export const parkingBookingsRouter = Router({ mergeParams: true });
parkingBookingsRouter.use(requireAuth);

parkingBookingsRouter.post(
  '/check-in',
  validateRequest({ params: parkingParamsSchema, body: checkInSchema }),
  bookingController.checkIn,
);

parkingBookingsRouter.get(
  '/active',
  validateRequest({ params: parkingParamsSchema }),
  bookingController.listActive,
);

parkingBookingsRouter.get(
  '/',
  validateRequest({ params: parkingParamsSchema, query: bookingQuerySchema }),
  typedHandler(bookingController.findAll),
);

export const bookingRouter = Router();
bookingRouter.use(requireAuth);

bookingRouter.post(
  '/:bookingId/check-out',
  validateRequest({ params: bookingParamsSchema }),
  bookingController.checkOut,
);

bookingRouter.get(
  '/:bookingId',
  validateRequest({ params: bookingParamsSchema }),
  bookingController.findById,
);

bookingRouter.patch(
  '/:bookingId/cancel',
  validateRequest({ params: bookingParamsSchema }),
  bookingController.cancel,
);
