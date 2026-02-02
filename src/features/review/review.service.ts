import * as reviewRepository from "./review.repository.js";
import type { Review } from "../../../prisma/generated/client.js";
import type { PaginationResult } from "../../utils/pagination.js";

export const getParkingReviews = async (
  parkingId: string,
  page: number,
  limit: number,
): Promise<PaginationResult<Review>> => {
  return await reviewRepository.findByParkingId(parkingId, page, limit);
};

export const getParkingStats = async (
  parkingId: string,
): Promise<{ averageRating: number; totalReviews: number }> => {
  return await reviewRepository.getStats(parkingId);
};
