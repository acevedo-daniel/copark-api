# API Design

## Error Contract

All error responses use:

```json
{ "error": true, "message": "Human-readable message" }
```

Expected domain failures use `AppError` subclasses and return `4xx` responses. Unexpected failures return `500 Internal Server Error`.

## Authentication

- Scheme: Bearer JWT
- Signing: HS256 through `jose`
- Password hashing: Argon2
- Auth middleware sets `req.user.id`

## Validation

All external input is validated through:

```typescript
validateRequest({ params, query, body });
```

Schemas are colocated with their feature modules and inferred with `z.infer`.

## Pagination

Paginated responses use:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

## Rate Limiting

Rate limiting is applied to:

- `POST /auth/register`
- `POST /auth/login`
- `POST /reviews/parking/:parkingId`

Configuration:

| Variable                    | Default  |
| --------------------------- | -------- |
| `AUTH_RATE_LIMIT_MAX`       | `15`     |
| `AUTH_RATE_LIMIT_WINDOW_MS` | `900000` |

## OpenAPI

- UI: `/api-docs/docs`
- JSON: `/api-docs/openapi.json`
- Production docs require `ENABLE_API_DOCS=true`
