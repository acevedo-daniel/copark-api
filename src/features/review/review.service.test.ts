import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../parking/parking.repository.js', () => ({
  findById: vi.fn(),
}));

vi.mock('./review.repository.js', () => ({
  create: vi.fn(),
  findByParkingId: vi.fn(),
  getStats: vi.fn(),
}));

import type { Parking, Review } from '../../../prisma/generated/client.js';
import { NotFoundError } from '../../errors/index.js';
import type { PaginationResult } from '../../utils/pagination.js';
import * as parkingRepository from '../parking/parking.repository.js';
import * as reviewRepository from './review.repository.js';
import { createReview, getParkingReviews, getParkingStats } from './review.service.js';

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

const buildParking = (overrides?: Partial<Parking>): Parking => {
  const now = new Date('2026-02-21T12:00:00.000Z');

  return {
    id: 'parking-1',
    title: 'Main Parking',
    description: null,
    image: null,
    address: '123 Test St',
    pricePerHour: 2000,
    totalSpaces: 20,
    lat: -34.6037,
    lng: -58.3816,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ownerId: 'owner-1',
    ...(overrides ?? {}),
  };
};

describe('review.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates review when parking exists', async () => {
    const dto = {
      rating: 4,
      comment: 'Great parking spot',
      authorName: 'Daniel',
    };
    const createdReview = buildReview({
      rating: dto.rating,
      comment: dto.comment,
      authorName: dto.authorName,
    });

    vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking({ id: 'parking-1' }));
    vi.mocked(reviewRepository.create).mockResolvedValue(createdReview);

    const result = await createReview('parking-1', dto);

    expect(parkingRepository.findById).toHaveBeenCalledWith('parking-1');
    expect(reviewRepository.create).toHaveBeenCalledWith({
      ...dto,
      parking: { connect: { id: 'parking-1' } },
    });
    expect(result).toEqual(createdReview);
  });

  it('throws NotFoundError when parking does not exist for review creation', async () => {
    vi.mocked(parkingRepository.findById).mockResolvedValue(null);

    const promise = createReview('missing-parking', {
      rating: 5,
      authorName: 'Daniel',
    });

    await expect(promise).rejects.toBeInstanceOf(NotFoundError);
    await expect(promise).rejects.toThrow('Parking not found');
    expect(reviewRepository.create).not.toHaveBeenCalled();
  });

  it('propagates unexpected errors from create repository', async () => {
    vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking({ id: 'parking-1' }));
    vi.mocked(reviewRepository.create).mockRejectedValue(new Error('db failed'));

    await expect(
      createReview('parking-1', {
        rating: 5,
        authorName: 'Daniel',
      }),
    ).rejects.toThrow('db failed');
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

    vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking({ id: 'parking-1' }));
    vi.mocked(reviewRepository.findByParkingId).mockResolvedValue(paginated);

    const result = await getParkingReviews('parking-1', 1, 10);

    expect(parkingRepository.findById).toHaveBeenCalledWith('parking-1');
    expect(reviewRepository.findByParkingId).toHaveBeenCalledWith('parking-1', 1, 10);
    expect(result).toEqual(paginated);
  });

  it('returns parking rating stats', async () => {
    const stats = { averageRating: 4.5, totalReviews: 20 };
    vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking({ id: 'parking-1' }));
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
    vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking({ id: 'parking-1' }));
    vi.mocked(reviewRepository.getStats).mockRejectedValue(new Error('db failed'));

    await expect(getParkingStats('parking-1')).rejects.toThrow('db failed');
  });
});
