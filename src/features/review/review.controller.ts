import * as reviewService from "./review.service.js";
import type { Request, Response, NextFunction } from "express";
import type { ReviewParkingParams, ReviewQuery } from "./review.schema.js";

export const listByParking = async (
  req: Request<ReviewParkingParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { parkingId } = req.params;
    const { page, limit } = res.locals.validatedQuery as ReviewQuery;
    const result = await reviewService.getParkingReviews(
      parkingId,
      page,
      limit,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  req: Request<ReviewParkingParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { parkingId } = req.params;
    const stats = await reviewService.getParkingStats(parkingId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
