# API Design

## Purpose

Defines the API contract conventions, behavior patterns, and consistency rules for `copark-api`.

## Error Contract

All error responses use:

```json
{ "error": true, "message": "Human-readable description" }
```

### Error Hierarchy

```text
AppError (base)
  |- BadRequestError     400
  |- UnauthorizedError   401
  |- ForbiddenError      403
  |- NotFoundError       404
  `- ConflictError       409
```

Rules:

- `4xx` errors are operational and logged as warnings.
- Unexpected failures are normalized to `500 Internal Server Error`.
- Internal details are never exposed in response bodies.
- Malformed JSON returns `400 Invalid JSON payload`.
- Oversized payloads return `413 Payload too large`.

## Authentication Contract

- Scheme: Bearer JWT (HS256 via `jose`).
- Password hashing: Argon2.
- Guard middleware: `requireAuth`.
- Auth context: `req.user.id`.
- Env configuration:
  - `JWT_SECRET` (minimum 32 chars)
  - `JWT_EXPIRES_IN` (default `24h`)

## Rate Limiting Contract

Applied to:

- `POST /auth/register`
- `POST /auth/login`

Configuration:

| Variable                    | Default  |
| --------------------------- | -------- |
| `AUTH_RATE_LIMIT_MAX`       | `15`     |
| `AUTH_RATE_LIMIT_WINDOW_MS` | `900000` |
| `REDIS_URL`                 | optional |

Behavior:

- In-memory limiting by default.
- Redis-backed limiting when `REDIS_URL` is configured.
- Independent buckets for register and login flows.
- Standard headers enabled (`draft-8`).
- Throttle response: `429` with message `Too many requests, try again later`.

## Validation Contract

- All external input must be validated with Zod.
- Schema mode is strict (`strictObject`) where applicable.
- `validateRequest({ body?, params?, query? })` is the canonical middleware.
- Schema types are inferred with `z.infer` and reused in service/controller layers.

Reference pattern:

```typescript
export const createParkingSchema = z.strictObject({ ... }).openapi('CreateParkingRequest');
export type CreateParking = z.infer<typeof createParkingSchema>;

router.post('/', requireAuth, validateRequest({ body: createParkingSchema }), controller.create);
```

## Pagination Contract

Paginated resources return:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

Standard query parameters:

- `page` (default `1`)
- `limit` (default `10`, resource-specific max)

## OpenAPI and Docs Contract

- OpenAPI version: `3.1.0`.
- Generator: `@asteasolutions/zod-to-openapi`.
- UI endpoint: `/api-docs/docs`.
- JSON endpoint: `/api-docs/openapi.json`.
- Production docs are gated by `ENABLE_API_DOCS=true`.
- Current server entries generated:
  - `http://localhost:3000` (Development)
  - `https://copark-api.onrender.com` (Production)
- Feature endpoints are registered in each `feature.docs.ts`.
- Global components/system endpoints are registered under `src/docs/`.

## Response Conventions

Common successful status codes:

| Action        | Status |
| ------------- | ------ |
| Create        | `201`  |
| Read/List     | `200`  |
| Update        | `200`  |
| Delete/Cancel | `200`  |

Data handling:

- User responses never expose `passwordHash`.
- Booking responses strip internal relation payloads not required by API consumers.
