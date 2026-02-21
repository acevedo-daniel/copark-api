import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../parking/parking.repository.js', () => ({
  findById: vi.fn(),
}));

vi.mock('./review.repository.js', () => ({
  findByParkingId: vi.fn(),
  getStats: vi.fn(),
}));

import type { Review } from '../../../prisma/generated/client.js';
import { NotFoundError } from '../../errors/index.js';
import type { PaginationResult } from '../../utils/pagination.js';
import * as parkingRepository from '../parking/parking.repository.js';
import * as reviewRepository from './review.repository.js';
import { getParkingReviews, getParkingStats } from './review.service.js';

const buildReview = (overrides?: Partial<Review>): Review => {
  const now = new Date('2026-02-21T12:00:00.000Z');

  return {
    id: 'review-1',
    rating: 5,
    comment: 'Great parking',
    authorName: 'Daniel',
    parkingId: 'parking-1',
    createdAt: now,
    updatedAt: now,
    ...(overrides ?? {}),
  };
};

describe('review.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns paginated parking reviews', async () => {
    const paginated: PaginationResult<Review> = {
      data: [buildReview({ id: 'review-1' }), buildReview({ id: 'review-2', rating: 4 })],
      meta: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    vi.mocked(parkingRepository.findById).mockResolvedValue({ id: 'parking-1' } as never);
    vi.mocked(reviewRepository.findByParkingId).mockResolvedValue(paginated);

    const result = await getParkingReviews('parking-1', 1, 10);

    expect(parkingRepository.findById).toHaveBeenCalledWith('parking-1');
    expect(reviewRepository.findByParkingId).toHaveBeenCalledWith('parking-1', 1, 10);
    expect(result).toEqual(paginated);
  });

  it('returns parking rating stats', async () => {
    const stats = { averageRating: 4.5, totalReviews: 20 };
    vi.mocked(parkingRepository.findById).mockResolvedValue({ id: 'parking-1' } as never);
    vi.mocked(reviewRepository.getStats).mockResolvedValue(stats);

    const result = await getParkingStats('parking-1');

    expect(parkingRepository.findById).toHaveBeenCalledWith('parking-1');
    expect(reviewRepository.getStats).toHaveBeenCalledWith('parking-1');
    expect(result).toEqual(stats);
  });

  it('throws NotFoundError when parking does not exist for reviews', async () => {
    vi.mocked(parkingRepository.findById).mockResolvedValue(null);
    const promise = getParkingReviews('missing-parking', 1, 10);

    await expect(promise).rejects.toBeInstanceOf(NotFoundError);
    await expect(promise).rejects.toThrow('Parking not found');
    expect(reviewRepository.findByParkingId).not.toHaveBeenCalled();
  });

  it('throws NotFoundError when parking does not exist for stats', async () => {
    vi.mocked(parkingRepository.findById).mockResolvedValue(null);
    const promise = getParkingStats('missing-parking');

    await expect(promise).rejects.toBeInstanceOf(NotFoundError);
    await expect(promise).rejects.toThrow('Parking not found');
    expect(reviewRepository.getStats).not.toHaveBeenCalled();
  });

  it('propagates unexpected errors from stats repository', async () => {
    vi.mocked(parkingRepository.findById).mockResolvedValue({ id: 'parking-1' } as never);
    vi.mocked(reviewRepository.getStats).mockRejectedValue(new Error('db failed'));

    await expect(getParkingStats('parking-1')).rejects.toThrow('db failed');
  });
});
