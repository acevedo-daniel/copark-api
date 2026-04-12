# Architecture

## Purpose

Defines the runtime architecture and operational boundaries for `parkcore-api`.
This project is a technical demo of a parking facility management backend.

## System Snapshot

| Layer          | Decision                         |
| -------------- | -------------------------------- |
| Runtime        | Node.js 22 + TypeScript strict   |
| Framework      | Express 5                        |
| Persistence    | PostgreSQL via Prisma            |
| Validation     | Zod                              |
| Authentication | JWT HS256 + Argon2               |
| API Contract   | OpenAPI 3.1                      |
| API Docs UI    | Scalar                           |
| Logging        | Pino + pino-http                 |
| Testing        | Vitest + Supertest               |

## Entry Points

- `server.ts`: process bootstrap, HTTP lifecycle, graceful shutdown.
- `app.ts`: middleware pipeline, route mounting, API docs, and global error handling.
- `src/config/env.ts`: fail-fast environment validation with Zod.
- `src/config/openapi.ts`: OpenAPI generation and metadata registration.
- `src/config/rate-limit.ts`: auth rate limiter factory.

## Request Pipeline

1. Request enters `app.ts`.
2. `requestLogger` creates or propagates `x-request-id`.
3. `helmet` applies security headers.
4. `cors` enforces the environment-aware origin policy.
5. JSON and URL-encoded parsers apply `10kb` body limits.
6. Route middleware executes, such as `requireAuth`, `validateRequest`, and auth rate limiters.
7. Controller handles HTTP concerns and may call `requireUser(req)`.
8. Service applies business rules and authorization checks.
9. Repository executes Prisma persistence operations.
10. Response is returned, or Express 5 forwards async errors to the global error middleware.

## Module Topology

```text
src/
  config/         env, prisma, openapi, api docs mount, rate limiting
  docs/           OpenAPI registry and docs registration
  errors/         AppError base class and HTTP/domain subclasses
  features/       auth, user, parking, vehicle, booking, review
  lib/            logger and OpenAPI bootstrap
  middlewares/    request logger, auth guard, validation, error handler
  scripts/        quality, build, OpenAPI, and smoke verification scripts
  types/          Express request augmentation
  utils/          pagination helpers and requireUser
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

## Controller Pattern

Controllers are async Express handlers without local `try/catch` wrappers. Express 5 forwards rejected promises to the global error middleware.

Auth-required controllers call `requireUser(req)` before reading `req.user.id`. Public controllers, such as auth and review listing, do not call it.

## Response Shaping

Feature schema files own response DTO helpers when persistence models contain internal fields or loaded relations. Booking responses use `toBookingResponse()` to return only public booking fields.

## Security Baseline

- `helmet()` is enabled globally.
- `trust proxy` is set to `1` for Render/proxy environments.
- Non-production CORS is permissive.
- Production CORS uses the `CORS_ORIGINS` allowlist.
- Request body limits are `10kb`.
- Auth rate limiting is active on `/auth/register` and `/auth/login`.
- Auth rate limiting uses in-memory buckets.
- API docs are enabled by default outside production and gated by `ENABLE_API_DOCS=true` in production.

## Error Model

- Expected HTTP/domain failures use `AppError` subclasses.
- Operational errors return their declared `4xx` status and are logged as warnings.
- Unexpected errors are normalized to `500` with a safe message.
- Stable error response contract:

```json
{ "error": true, "message": "..." }
```

## Observability

- Structured JSON logging with Pino.
- Request logging through pino-http.
- Correlation via `x-request-id`.
- Unexpected runtime failures are logged with error metadata.

## Process Lifecycle

`server.ts` handles:

- `SIGINT`
- `SIGTERM`
- `unhandledRejection`
- `uncaughtException`

Shutdown sequence:

1. Stop accepting new connections.
2. Close the HTTP server.
3. Disconnect Prisma.
4. Exit explicitly.
5. Force-exit after 10 seconds if shutdown stalls.
