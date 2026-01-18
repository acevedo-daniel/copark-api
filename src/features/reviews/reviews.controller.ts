import * as reviewService from "./reviews.service.js";
import { Request, Response, NextFunction } from "express";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authorId = req.user.id;
    const reviewData = req.body;
    const newReview = await reviewService.addReview(authorId, reviewData);
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
};

export const listByParking = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { parkingId } = req.params;
    const reviews = await reviewService.getParkingReviews(parkingId);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
