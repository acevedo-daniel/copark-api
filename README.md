# CoPark API

REST API for parking management.

## Stack

- Node.js + TypeScript (strict)
- Express 5
- Prisma + PostgreSQL
- Zod (runtime validation)
- OpenAPI 3.1 + Scalar
- Pino + pino-http (structured logging)

## Core capabilities

- Layered architecture: controller -> service -> repository
- JWT auth with protected routes
- Unified error contract: `{ "error": true, "message": "..." }`
- Security baseline: `helmet`, CORS policy, request body limits
- Request tracing with `x-request-id`
- Graceful shutdown (SIGINT, SIGTERM, unhandledRejection, uncaughtException)

## Quick start (3 minutes)

1. Install dependencies

```bash
pnpm install
```

2. Configure environment

```bash
cp .env.example .env
```

3. Start local database

```bash
pnpm docker:up
```

4. Bootstrap database (generate + migrate + seed)

```bash
pnpm db:setup
```

5. Run API

```bash
pnpm dev
```

## Environment variables (core)

Required:

- `NODE_ENV` (`development` | `production` | `test`)
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET` (min 32 chars)
- `JWT_EXPIRES_IN`

Security/logging:

- `CORS_ORIGINS` (comma-separated; required in `production`)
- `LOG_LEVEL` (`fatal|error|warn|info|debug|trace`)
- `LOG_PRETTY` (`true|false`, recommended `true` only in local dev)

## API docs

- Scalar UI: `/api-docs/docs`
- OpenAPI JSON: `/api-docs/openapi.json`
- Legacy redirects:
  - `/docs` -> `/api-docs/docs`
  - `/openapi.json` -> `/api-docs/openapi.json`

## Quality commands

```bash
pnpm typecheck
pnpm lint
pnpm generate:openapi
pnpm quality:ci
pnpm release:readiness
pnpm smoke:local
```

## Smoke checks

Local API (health + docs):

```bash
pnpm smoke:local
```

Deployed API:

```bash
$env:SMOKE_BASE_URL='https://copark-api.onrender.com'
pnpm smoke:remote
```

Deployed API with auth flow (register + login):

```bash
$env:SMOKE_BASE_URL='https://copark-api.onrender.com'
$env:SMOKE_WITH_AUTH='true'
pnpm smoke:remote
```

## CI/CD

- Workflow: `.github/workflows/ci.yml`
- Ejecuta en `push` y `pull_request` a `main`
- Gates:
  - `pnpm db:setup`
  - `pnpm quality:ci`
  - `pnpm release:readiness`

## Portfolio-ready checklist

- `pnpm quality:ci` and `pnpm release:readiness` green
- `pnpm db:setup` green on local setup
- `pnpm smoke:local` green
- Remote smoke green against deployed environment
- Branch protection enabled on `main` requiring CI checks
- Public demo endpoints available:
  - `https://copark-api.onrender.com/healthz`
  - `https://copark-api.onrender.com/api-docs/docs`

## Technical docs

- Architecture: `docs/ARCHITECTURE.md`
- Conventions: `docs/CONVENTIONS.md`
- Roadmap: `docs/ROADMAP.md`
- Module audit plan: `docs/technical/MODULE_AUDIT_PLAN.md`
