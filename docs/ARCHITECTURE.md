# CoPark Architecture

## Scope

Runtime architecture for `copark-api` with focus on a portfolio-ready backend.

## System model

- API style: REST
- Runtime: Node.js + Express 5
- Language: TypeScript strict mode
- Persistence: PostgreSQL via Prisma
- Validation: Zod
- Auth: JWT Bearer
- Documentation: OpenAPI 3.1 + Scalar
- Logging: Pino + pino-http

## Bootstrap model

- `server.ts`: process bootstrap, server lifecycle, graceful shutdown
- `app.ts`: express composition (middlewares, routes, error handling)
- `src/config/env.ts`: validated runtime config (fail-fast)

## Request lifecycle

1. Request enters `app.ts`.
2. `requestLogger` (pino-http) assigns/propagates `x-request-id`.
3. Security and parsing middlewares run (`helmet`, `cors`, `json/urlencoded` limits).
4. Route-level middlewares apply (`requireAuth`, `validateRequest`).
5. Controller delegates to service.
6. Service enforces business rules and calls repository.
7. Repository performs Prisma operations.
8. Response is sent, or errors flow into global `errorHandler`.

## Folder layout

```text
src/
  config/         # env, prisma, openapi, docs mount
  docs/           # openapi registry helpers
  errors/         # AppError and HTTP subclasses
  features/       # auth, user, parking, vehicle, booking, review
  lib/            # logger and openapi extension bootstrap
  middlewares/    # logger, auth, validation, error handler
  scripts/        # openapi generation utilities
  types/          # express type augmentation
  utils/          # shared helpers
```

## Error architecture

- Domain and HTTP errors are represented by `AppError` and subclasses.
- 4xx errors are treated as operational.
- Unexpected errors are normalized to 500 with safe message.
- Response contract is always:

```json
{ "error": true, "message": "..." }
```

## Security baseline

- `helmet()` globally enabled.
- CORS policy by environment:
  - non-production: permissive
  - production: only allow `CORS_ORIGINS`
- Request body limits:
  - JSON: `10kb`
  - URL-encoded: `10kb`
- `trust proxy` enabled for Render/proxy deployments.

## Observability baseline

- Structured logs with Pino.
- HTTP access logs through pino-http.
- Request correlation via `x-request-id`.
- Error middleware logs operational and unexpected errors.

## Process lifecycle

`server.ts` handles:

- `SIGINT`
- `SIGTERM`
- `unhandledRejection`
- `uncaughtException`

Shutdown flow:

1. Stop accepting HTTP traffic.
2. Disconnect Prisma.
3. Exit with explicit status code.
4. Force-exit timeout after 10 seconds.

## Known constraints

1. No automated route-vs-openapi contract tests yet.
2. Rate limiting is pending for sensitive endpoints.
3. API docs exposure is currently always on.
