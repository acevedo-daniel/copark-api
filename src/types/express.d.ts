declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }

    interface Locals {
      validatedQuery?: Record<string, unknown>;
    }
  }
}

export {};
