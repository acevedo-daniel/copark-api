import { UnauthorizedError } from '../errors/index.js';

interface RequestWithOptionalUser {
  user?: { id: string };
}

export function requireUser<TRequest extends RequestWithOptionalUser>(
  req: TRequest,
): asserts req is TRequest & { user: { id: string } } {
  if (!req.user) throw new UnauthorizedError();
}
