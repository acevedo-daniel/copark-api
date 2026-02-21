import type { NextFunction, Request, Response } from 'express';
import { vi } from 'vitest';

export const createMockRequest = (overrides?: Partial<Request>): Request => {
  const base: Partial<Request> = {
    headers: {},
  };

  return {
    ...base,
    ...(overrides ?? {}),
  } as Request;
};

export const createMockResponse = (): Response => {
  const res = {} as Response;

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);

  return res;
};

export const createNext = (): NextFunction => {
  return vi.fn() as unknown as NextFunction;
};
