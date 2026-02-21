# Architecture

## Purpose

Defines the runtime architecture and operational boundaries for `copark-api`.
This project is a technical demo of a SaaS parking management backend.

## System Snapshot

| Layer          | Decision                         |
| -------------- | -------------------------------- |
| Runtime        | Node.js 22 + TypeScript (strict) |
| Framework      | Express 5                        |
| Persistence    | PostgreSQL via Prisma            |
| Validation     | Zod                              |
| Authentication | JWT (HS256) + Argon2             |
| API Contract   | OpenAPI 3.1                      |
| API Docs UI    | Scalar                           |
| Logging        | Pino + pino-http                 |
| Testing        | Vitest + Supertest               |

## Entry Points

- `server.ts`: process bootstrap, HTTP lifecycle, graceful shutdown.
- `app.ts`: middleware pipeline, route mounting, and global error handling.
- `src/config/env.ts`: fail-fast environment validation with Zod.
- `src/config/openapi.ts`: OpenAPI generation and metadata registration.

## Request Pipeline

1. Request enters `app.ts`.
2. `requestLogger` creates or propagates `x-request-id`.
3. `helmet` applies security headers.
4. `cors` enforces origin policy by environment.
5. Body parsers apply limits (`json` and `urlencoded`, `10kb`).
6. Route middleware executes (`requireAuth`, `validateRequest`, rate limiters).
7. Controller handles HTTP concerns.
8. Service applies business rules.
9. Repository executes Prisma persistence operations.
10. Response is returned or global error middleware normalizes the error.

## Module Topology

```text
src/
  config/         env, prisma, openapi, api docs mount, rate limiting
  docs/           openapi registry and docs registration
  errors/         AppError base class and HTTP/domain subclasses
  features/       auth, user, parking, vehicle, booking, review
  lib/            logger and openapi bootstrap
  middlewares/    request logger, auth guard, validation, error handler
  scripts/        quality and smoke verification scripts
  types/          express type augmentation
  utils/          shared helpers
```

Each feature follows:

```text
feature/
  feature.routes.ts
  feature.controller.ts
  feature.service.ts
  feature.repository.ts
  feature.schema.ts
  feature.docs.ts
```

## Security Baseline

- `helmet()` enabled globally.
- `trust proxy` set to `1` for Render/proxy environments.
- CORS policy:
  - non-production: permissive.
  - production: allowlist from `CORS_ORIGINS`.
- Request body limits:
  - JSON: `10kb`
  - URL-encoded: `10kb`
- Auth rate limiting on `/auth/register` and `/auth/login`.
- Rate limiter configuration:
  - `AUTH_RATE_LIMIT_MAX`
  - `AUTH_RATE_LIMIT_WINDOW_MS`
  - optional `REDIS_URL` for distributed state.
- Docs exposure policy:
  - enabled by default in non-production.
  - in production, enabled only with `ENABLE_API_DOCS=true`.

## Error Model

- Expected HTTP/domain errors use `AppError` subclasses.
- Operational errors return their declared status (`4xx`) and are logged as warnings.
- Unexpected errors are normalized to `500` with safe message.
- Stable error response contract:

```json
{ "error": true, "message": "..." }
```

## Observability

- Structured JSON logging with Pino.
- Request logs with pino-http.
- Correlation via `x-request-id`.
- Unexpected runtime failures logged with stack metadata.

## Process Lifecycle

`server.ts` handles:

- `SIGINT`
- `SIGTERM`
- `unhandledRejection`
- `uncaughtException`

Shutdown sequence:

1. Stop accepting new connections.
2. Close HTTP server.
3. Disconnect Prisma.
4. Exit explicitly.
5. Force-exit after 10 seconds if shutdown stalls.

## Constraints

1. Route-vs-OpenAPI drift is not yet fully automated.
2. End-to-end integration coverage is still pending.
