import type { RequestHandler } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const typedHandler = (handler: Function) => handler as unknown as RequestHandler;
