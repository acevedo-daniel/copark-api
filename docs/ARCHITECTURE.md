# Architecture

ParkCore API is organized around a small layered backend structure:

```text
routes -> controller -> service -> repository
```

## Runtime

- `server.ts` starts the HTTP server and handles graceful shutdown.
- `app.ts` builds the Express app, middleware pipeline, routes, docs, and error handler.
- `src/config/env.ts` validates environment variables on startup.
- `src/config/prisma.ts` creates the Prisma client.

## Request Flow

1. Request logger attaches or propagates `x-request-id`.
2. `helmet` and CORS run before body parsing.
3. JSON and URL-encoded bodies are limited to `10kb`.
4. Route middleware validates params, query, and body with Zod.
5. Controllers handle HTTP concerns only.
6. Services enforce authorization and business rules.
7. Repositories isolate Prisma persistence.
8. Errors are normalized by the global error handler.

## Feature Shape

Each feature follows:

```text
feature.routes.ts
feature.controller.ts
feature.service.ts
feature.repository.ts
feature.schema.ts
feature.docs.ts
```

## Key Decisions

- Express 5 async errors are forwarded to the global error handler.
- Auth-required controllers call `requireUser(req)` before reading `req.user`.
- Zod schemas validate inputs and generate OpenAPI contracts.
- Booking check-in keeps capacity and active-vehicle checks inside a serializable transaction.
- Logs use Pino with redaction for passwords, tokens, and authorization headers.
