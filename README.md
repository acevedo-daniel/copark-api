# CoPark API

<p align="center">
  <img src="https://img.shields.io/badge/typescript-strict-111111?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/node.js-22-111111?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/express-5-111111?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/postgresql-prisma-111111?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/openapi-3.1-111111?style=flat-square&logo=openapiinitiative&logoColor=white" />
  <img src="https://img.shields.io/github/actions/workflow/status/acevedo-daniel/copark-api/ci.yml?style=flat-square&label=CI" />
</p>

Backend API for a **SaaS parking management platform**. Technical demo focused on clean architecture, strict typing, and production-aware delivery.

---

## Technical Highlights

- **Layered architecture**: `controller -> service -> repository` across all modules
- **Validation-first contracts**: Zod schemas power runtime validation and OpenAPI generation
- **Unified error contract**: every error returns `{ "error": true, "message": "..." }`
- **JWT authentication** with Argon2 password hashing and rate-limited auth endpoints
- **Graceful shutdown** with signal handling and forced timeout
- **Structured logging** with Pino, pino-http, and request correlation via `x-request-id`
- **CI pipeline**: lint, typecheck, test, OpenAPI validation, and build checks
- **Security baseline**: Helmet, environment-based CORS policy, and body size limits
- **Configurable auth throttling** via env vars, with optional Redis-backed distributed limits

---

## Functional Coverage

| Module   | Capabilities                     |
| -------- | -------------------------------- |
| Auth     | Register, login, JWT tokens      |
| Parkings | CRUD, owner-scoped management    |
| Vehicles | Registry per parking lot         |
| Bookings | Check-in/out, cancel, pagination |
| Reviews  | Rating and feedback per parking  |
| Users    | Profile management               |

---

## Stack

- Node.js + TypeScript (strict)
- Express 5
- Prisma + PostgreSQL
- Zod (validation contracts)
- OpenAPI 3.1 + Scalar
- Pino (structured logging)
- Vitest + Supertest

---

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm docker:up
pnpm db:setup
pnpm dev
```

Auth rate limit defaults:
- `AUTH_RATE_LIMIT_MAX=15`
- `AUTH_RATE_LIMIT_WINDOW_MS=900000` (15 minutes)
- `REDIS_URL` optional (enables a shared rate-limit store across instances)

---

## API Documentation

- Scalar UI: `/api-docs/docs`
- OpenAPI JSON: `/api-docs/openapi.json`
- Production API base URL: `https://copark-api.onrender.com`
- Demo docs URL: `https://copark-api-demo.onrender.com/api-docs/docs`

> API docs are enabled in development by default.
> For demo/staging in production, set `ENABLE_API_DOCS=true`.

---

## Quality & Verification

```bash
pnpm lint              # ESLint strict + Prettier
pnpm typecheck         # TypeScript strict mode
pnpm test              # Vitest unit tests
pnpm quality:ci        # Full pipeline check
pnpm release:readiness # OpenAPI + build validation
```

---

## Architecture

```
controller -> service -> repository
```

- Controllers handle HTTP concerns
- Services enforce business rules
- Repositories isolate Prisma operations
- Errors flow through a global handler with a unified contract

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) and [CONVENTIONS.md](docs/CONVENTIONS.md) for details.

---

## CI

- Workflow: `.github/workflows/ci.yml`
- Gate: `quality-and-readiness` (lint + typecheck + test + openapi + build)
