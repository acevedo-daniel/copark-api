export {};

export interface UserPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}
