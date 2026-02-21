import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { typedHandler } from '../../utils/typed-handler.js';
import { parkingBookingsRouter } from '../booking/booking.routes.js';
import * as parkingController from './parking.controller.js';
import {
  createParkingSchema,
  parkingParamsSchema,
  parkingQuerySchema,
  updateParkingSchema,
} from './parking.schema.js';

const parkingRouter = Router();

parkingRouter.use('/:parkingId/bookings', parkingBookingsRouter);

parkingRouter.get(
  '/',
  validateRequest({ query: parkingQuerySchema }),
  typedHandler(parkingController.findAll),
);
parkingRouter.get('/me', requireAuth, parkingController.findOwned);
parkingRouter.get(
  '/:id',
  validateRequest({ params: parkingParamsSchema }),
  parkingController.findById,
);

parkingRouter.patch(
  '/:id',
  requireAuth,
  validateRequest({ params: parkingParamsSchema, body: updateParkingSchema }),
  parkingController.update,
);

parkingRouter.post(
  '/',
  requireAuth,
  validateRequest({ body: createParkingSchema }),
  parkingController.create,
);

export { parkingRouter };
