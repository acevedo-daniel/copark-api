import * as reviewRepository from "./reviews.repository.js";
import * as parkingService from "../parkings/parkings.service.js";

export const addReview = async (authorId, reviewData) => {
  await parkingService.getParkingById(reviewData.parkingId);

  const newReview = {
    ...reviewData,
    authorId,
    createdAt: new Date().toISOString(),
  };

  return await reviewRepository.create(newReview);
};

export const getParkingReviews = async (parkingId) => {
  return await reviewRepository.findByParkingId(parkingId);
};
