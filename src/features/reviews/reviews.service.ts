import * as reviewRepository from "./reviews.repository.js";
import * as parkingService from "../parking/parking.service.js";
import { Review } from "../../../prisma/generated/client.js";

export const addReview = async (
  authorId: string,
  reviewData: Review,
): Promise<Review> => {
  await parkingService.findById(reviewData.parkingId);

  const newReview = {
    ...reviewData,
    authorId,
    createdAt: new Date(),
  };

  return await reviewRepository.create(newReview);
};

export const getParkingReviews = async (
  parkingId: string,
): Promise<Review[]> => {
  return await reviewRepository.findByParkingId(parkingId);
};
