import reviewRepository from "../repositories/reviews.repository.js";
import parkingService from "./parkings.service.js";

const addReview = async (authorId, reviewData) => {
  await parkingService.getDetail(reviewData.parkingId);

  const newReview = {
    ...reviewData,
    authorId,
    createdAt: new Date().toISOString(),
  };

  return await reviewRepository.create(newReview);
};

const getParkingReviews = async (parkingId) => {
  return await reviewRepository.findByParkingId(parkingId);
};

export default { addReview, getParkingReviews };
