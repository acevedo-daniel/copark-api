# Conventions

- Code, identifiers, commits, and public docs are written in English.
- Keep the dependency flow: routes, controllers, services, repositories.
- Controllers handle HTTP only.
- Services own business rules and authorization checks.
- Repositories own Prisma persistence.
- Validate all external input with Zod.
- Do not expose `passwordHash` in user responses.
- Use `AppError` subclasses for expected HTTP/domain failures.
- Keep logs free of secrets, password hashes, tokens, and authorization headers.
- Keep these gates green before merge:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm release:readiness
```
