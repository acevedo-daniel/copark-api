import * as reviewRepository from './review.repository.js';
import * as parkingRepository from '../parking/parking.repository.js';
import type { Review } from '../../../prisma/generated/client.js';
import { NotFoundError } from '../../errors/index.js';
import type { PaginationResult } from '../../utils/pagination.js';
import type { CreateReview } from './review.schema.js';

const ensureParkingExists = async (parkingId: string): Promise<void> => {
  const parking = await parkingRepository.findById(parkingId);

  if (!parking) {
    throw new NotFoundError('Parking not found');
  }
};

export const createReview = async (parkingId: string, dto: CreateReview): Promise<Review> => {
  await ensureParkingExists(parkingId);
  return await reviewRepository.create({
    ...dto,
    parking: { connect: { id: parkingId } },
  });
};
export const getParkingReviews = async (
  parkingId: string,
  page: number,
  limit: number,
): Promise<PaginationResult<Review>> => {
  await ensureParkingExists(parkingId);
  return await reviewRepository.findByParkingId(parkingId, page, limit);
};

export const getParkingStats = async (
  parkingId: string,
): Promise<{ averageRating: number; totalReviews: number }> => {
  await ensureParkingExists(parkingId);
  return await reviewRepository.getStats(parkingId);
};
