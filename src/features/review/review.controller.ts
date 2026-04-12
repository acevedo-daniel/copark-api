import * as reviewService from './review.service.js';
import type { Request, Response } from 'express';
import type { CreateReview, ReviewParkingParams, ReviewQuery } from './review.schema.js';

export const create = async (
  req: Request<ReviewParkingParams, unknown, CreateReview>,
  res: Response,
): Promise<void> => {
  const { parkingId } = req.params;
  const review = await reviewService.createReview(parkingId, req.body);
  res.status(201).json(review);
};

export const listByParking = async (
  req: Request<ReviewParkingParams, unknown, unknown, ReviewQuery>,
  res: Response,
): Promise<void> => {
  const { parkingId } = req.params;
  const { page, limit } = req.query;
  const result = await reviewService.getParkingReviews(parkingId, page, limit);
  res.json(result);
};

export const getStats = async (req: Request<ReviewParkingParams>, res: Response): Promise<void> => {
  const stats = await reviewService.getParkingStats(req.params.parkingId);
  res.json(stats);
};
