# Core Platform Module — Technical Specification

## 1. Scope

This module defines the runtime foundation of CoPark API. Everything that is **not** feature-specific business logic lives here.

### Files covered

| Layer           | File                                          | Responsibility                             |
| --------------- | --------------------------------------------- | ------------------------------------------ |
| Entry point     | `server.ts`                                   | Process bootstrap and lifecycle            |
| App composition | `app.ts`                                      | Middleware pipeline and route mounting     |
| Configuration   | `src/config/env.ts`                           | Env validation with Zod (fail-fast)        |
| Database        | `src/config/prisma.ts`                        | Prisma client with `@prisma/adapter-pg`    |
| API docs        | `src/config/api-docs.ts`                      | Scalar UI mount and CSP isolation          |
| OpenAPI         | `src/config/openapi.ts`                       | OpenAPI 3.1 document generation            |
| App logger      | `src/lib/logger.ts`                           | Pino structured logger with redaction      |
| Zod extension   | `src/lib/openapi-registry.ts`                 | `extendZodWithOpenApi(z)` side-effect      |
| HTTP logger     | `src/middlewares/logger.middleware.ts`        | Per-request structured logging (pino-http) |
| Error handler   | `src/middlewares/error-handler.middleware.ts` | Global error normalization and response    |
| Auth guard      | `src/middlewares/auth.middleware.ts`          | JWT Bearer verification                    |
| Validation      | `src/middlewares/validation.middleware.ts`    | Schema-based body/params/query validation  |
| Error hierarchy | `src/errors/app-error.ts`                     | Base `AppError` class                      |
| HTTP errors     | `src/errors/http-errors.ts`                   | `NotFoundError`, `BadRequestError`, etc.   |
| Error barrel    | `src/errors/index.ts`                         | Re-export                                  |
| Type augment    | `src/types/express.d.ts`                      | `req.user` declaration merge               |

### Design goals

- Deterministic, fail-fast bootstrap
- Secure baseline defaults without over-engineering
- Consistent error contract across all endpoints
- Structured request observability with correlation IDs
- Clean process lifecycle with graceful shutdown

---

## 2. Runtime Initialization Flow

```
1. server.ts              → import 'dotenv/config'  (loads .env)
2. src/config/env.ts      → Zod parse + fail-fast   (exits if invalid)
3. src/config/prisma.ts   → PrismaClient instantiation via PrismaPg adapter
4. app.ts                 → Middleware stack + route composition
5. server.ts              → app.listen(env.PORT)     (HTTP server starts)
6. server.ts              → Process event handlers   (SIGINT, SIGTERM, etc.)
```

The key constraint: **`env.ts` validates eagerly at import time.** If any variable is invalid, `process.exit(1)` fires before the HTTP server starts. This prevents the app from running with broken configuration.

---

## 3. App Composition (`app.ts`)

The middleware order is intentional and security-critical:

```
 1. app.set('trust proxy', 1)          ← Required for Render (reverse proxy)
 2. requestLogger (pino-http)          ← Logs start before anything else
 3. helmet()                           ← Security headers globally
 4. cors(corsOptions)                  ← Origin enforcement
 5. express.json({ limit: '10kb' })    ← Body parser with size limit
 6. express.urlencoded(...)            ← Form parser with size limit
 7. mountApiDocs(app, openApiSpec)     ← Scalar UI + OpenAPI JSON
 8. GET /healthz                       ← Health check (no auth)
 9. Feature routers                    ← /users, /vehicles, /parkings, etc.
10. Fallback 404                       ← NotFoundError('Route not found')
11. errorHandler                       ← Global error-to-response mapper
```

### Why this order

- **Security first:** Helmet and CORS apply before any business logic sees the request.
- **Observability early:** Every request gets logged and assigned an ID, even if it's rejected by CORS or a parser.
- **Docs before features:** API docs are accessible even if a feature router fails to load.
- **Error handling last:** Express requires the 4-argument middleware signature at the end of the stack.

### CORS strategy

```typescript
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Server-to-server / curl
    if (env.NODE_ENV !== 'production') return callback(null, true); // Open in dev
    if (corsOrigins.has(origin)) return callback(null, true); // Allowlist
    callback(new ForbiddenError('CORS origin not allowed')); // Reject
  },
};
```

- `CORS_ORIGINS` is parsed into a `Set<string>` for O(1) lookup.
- Production requires explicit origins (enforced by env validation).
- Development allows all origins for convenience.

---

## 4. Configuration Model (`src/config/env.ts`)

### Schema definition

```typescript
const envSchema = z.object({
  LOG_LEVEL:      z.enum([...]).default('info'),
  LOG_PRETTY:     z.coerce.boolean().default(false),
  NODE_ENV:       z.enum(['development', 'production', 'test']).default('development'),
  PORT:           z.coerce.number().default(3000),
  API_BASE_URL:   z.url().optional(),
  CORS_ORIGINS:   z.string().optional(),
  DATABASE_URL:   z.string().min(1),
  JWT_SECRET:     z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('24h'),
});
```

### Production guard (`.superRefine`)

When `NODE_ENV=production`, the schema enforces that `CORS_ORIGINS` contains at least one non-empty value. This prevents accidentally deploying with open CORS.

### Fail-fast behavior

```typescript
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(z.treeifyError(parsed.error));
  process.exit(1);
}
```

- Uses `safeParse` (no exceptions) + `process.exit(1)` for deterministic failure.
- `z.treeifyError()` provides human-readable error output.
- The exported `env` object is frozen and typed: `Env = z.infer<typeof envSchema>`.

---

## 5. Logging Model

### Application logger (`src/lib/logger.ts`)

Built with Pino:

```typescript
export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'copark-api', env: env.NODE_ENV },
  redact: {
    paths: [
      'req.headers.authorization', 'req.headers.cookie',
      'req.body.password', 'req.body.token',
      '*.password', '*.token',
    ],
    remove: true,
  },
  transport: isPretty ? { target: 'pino-pretty', ... } : undefined,
});
```

Key decisions:

- **`redact.remove: true`** → Sensitive fields are **deleted** from logs, not masked.
- **`base`** → Every log line includes `service` and `env` for filtering in aggregators.
- **`pino-pretty`** → Only in dev when `LOG_PRETTY=true`. Production uses raw JSON for machine parsing.

### HTTP logger (`src/middlewares/logger.middleware.ts`)

Built with `pino-http`, sharing the same Pino instance:

- **Request ID:** Uses incoming `x-request-id` header or generates a `randomUUID()`.
- **Response header:** Sets `x-request-id` on every response for correlation.
- **Custom props:** Attaches `req.ip` to every log entry.
- **Auto-logging:** Logs method, URL, status code, and response time automatically.

---

## 6. Error Model

### Class hierarchy

```
Error (native)
  └── AppError (base)
        ├── BadRequestError   (400)
        ├── UnauthorizedError  (401)
        ├── ForbiddenError     (403)
        ├── NotFoundError      (404)
        └── ConflictError      (409)
```

### `AppError` design

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = statusCode < 500) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

- **`isOperational`** → `true` for 4xx (expected), `false` for 5xx (bugs). The error handler uses this to decide whether to log as `warn` or `error`.
- **`captureStackTrace`** → Removes the constructor from the stack trace for cleaner debugging.
- HTTP subclasses only set `message` and `statusCode`. No additional logic.

### Global error handler (`src/middlewares/error-handler.middleware.ts`)

Processing order:

| Priority | Condition                    | Response                                      | Log level |
| -------- | ---------------------------- | --------------------------------------------- | --------- |
| 1        | `res.headersSent`            | delegate to Express default                   | —         |
| 2        | Entity too large (`413`)     | `{ error, message: 'Payload too large' }`     | —         |
| 3        | JSON syntax error (`400`)    | `{ error, message: 'Invalid JSON payload' }`  | —         |
| 4        | `AppError` + `isOperational` | `{ error, message }` with `statusCode`        | `warn`    |
| 5        | Anything else (unexpected)   | `{ error, message: 'Internal Server Error' }` | `error`   |

Safety features:

- **`toErrorWithStatus()`** normalizes non-Error throws (plain objects, strings) into proper Error instances.
- **Generic 500 message** prevents leaking internal details to clients.
- **`headersSent` guard** prevents "Cannot set headers after they are sent" crashes.

### Response contract

All errors follow this format:

```json
{ "error": true, "message": "..." }
```

---

## 7. Security Baseline

| Control                | Implementation                                    | File                 |
| ---------------------- | ------------------------------------------------- | -------------------- |
| HTTP security headers  | `helmet()` globally                               | `app.ts`             |
| CORS enforcement       | Allowlist in production, open in dev              | `app.ts`             |
| Body size limit        | `10kb` on JSON and urlencoded parsers             | `app.ts`             |
| Proxy awareness        | `trust proxy = 1` for Render                      | `app.ts`             |
| Auth middleware        | JWT Bearer token via `requireAuth`                | `auth.middleware.ts` |
| Log redaction          | Passwords, tokens, auth headers removed from logs | `logger.ts`          |
| CSP isolation for docs | Separate `helmet()` config for Scalar UI          | `api-docs.ts`        |

---

## 8. Validation Middleware (`src/middlewares/validation.middleware.ts`)

```typescript
export function validateRequest(schemas: ValidateRequestSchemas): RequestHandler;
```

Accepts optional `body`, `params`, and `query` Zod schemas. For each:

1. Runs `safeParseAsync` on the corresponding `req` property.
2. On failure: formats errors as `path: message` and passes `BadRequestError` to `next()`.
3. On success: **replaces** `req.body`/`req.params`/`req.query` with the parsed (coerced, stripped) data.

This ensures controllers always receive validated, correctly-typed data.

---

## 9. Auth Middleware (`src/middlewares/auth.middleware.ts`)

```typescript
export const requireAuth = async (req, res, next): Promise<void>
```

1. Extracts `Authorization: Bearer <token>` from headers.
2. Calls `verifyAccessToken(token)` (from auth feature).
3. On success: sets `req.user = { id: payload.sub }`.
4. On failure: passes `UnauthorizedError` to `next()`.

### Type augmentation (`src/types/express.d.ts`)

```typescript
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}
```

This declaration merge makes `req.user` available across the entire app without casting.

---

## 10. Database Client (`src/config/prisma.ts`)

```typescript
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

- Uses `@prisma/adapter-pg` for direct PostgreSQL connection (driver adapter pattern).
- Single `PrismaClient` instance exported for the entire app.
- Disconnected in `server.ts` during graceful shutdown via `prisma.$disconnect()`.

---

## 11. Server Lifecycle and Shutdown (`server.ts`)

### Handled events

| Event                | Behavior                                             |
| -------------------- | ---------------------------------------------------- |
| `SIGINT`             | Graceful shutdown (Ctrl+C / local dev)               |
| `SIGTERM`            | Graceful shutdown (Render / container orchestrators) |
| `unhandledRejection` | Log + graceful shutdown                              |
| `uncaughtException`  | Log + graceful shutdown                              |

### Shutdown sequence

```
1. Guard: if already shutting down, return (prevents duplicate execution)
2. Start force-close timer (10s timeout → process.exit(1))
3. timer.unref() → don't keep event loop alive just for the timer
4. server.close() → stop accepting new connections, drain active ones
5. prisma.$disconnect() → close DB connection pool
6. Clear timeout
7. process.exit(0) → clean exit
```

On error during shutdown: `process.exit(1)`.

### Key detail: `forceCloseTimer.unref()`

Without `.unref()`, the 10-second timer would keep the process alive even after all connections are drained. With it, Node.js can exit naturally if shutdown completes before the timer fires.

---

## 12. API Documentation Integration

Two files handle OpenAPI docs within the core platform:

- **`src/config/openapi.ts`** → Creates registry, registers global components + feature docs, generates OpenAPI 3.1 document.
- **`src/config/api-docs.ts`** → Mounts Scalar UI at `/api-docs/docs`, JSON spec at `/api-docs/openapi.json`, and legacy redirects from `/docs` and `/openapi.json`.

Scalar UI gets its own `helmet()` with relaxed CSP (allows CDN scripts/fonts). This is isolated from the global Helmet to avoid loosening security for the entire API.

---

## 13. Quality Gates

- `pnpm typecheck` — All files must compile without errors.
- `pnpm lint` — ESLint must pass.
- Documentation must reflect runtime behavior (middleware order, env variables, error contract).
