export interface PaginationParams {
  page?: number;
  limit?: number;
}

export type PaginationResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const parsePaginationParams = (query: {
  page?: string;
  limit?: string;
}): { skip: number; take: number; page: number; limit: number } => {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.min(100, parseInt(query.limit || "10", 10));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
};

export const createPaginatedResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResult<T> => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
