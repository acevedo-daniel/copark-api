import { prisma } from "../../config/prisma.js";
import type { Review } from "../../../prisma/generated/client.js";
import {
  createPaginatedResult,
  type PaginationResult,
} from "../../utils/pagination.js";

export const findByParkingId = async (
  parkingId: string,
  page: number,
  limit: number,
): Promise<PaginationResult<Review>> => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where: { parkingId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.count({ where: { parkingId } }),
  ]);

  return createPaginatedResult(data, total, page, limit);
};

export const getStats = async (
  parkingId: string,
): Promise<{ averageRating: number; totalReviews: number }> => {
  const stats = await prisma.review.aggregate({
    where: { parkingId },
    _avg: { rating: true },
    _count: true,
  });

  return {
    averageRating: Math.round((stats._avg.rating ?? 0) * 10) / 10,
    totalReviews: stats._count,
  };
};
