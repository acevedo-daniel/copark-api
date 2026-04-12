# ParkCore API

<p align="center">
  <img src="https://img.shields.io/badge/typescript-strict-111111?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/node.js-22-111111?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/express-5-111111?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/postgresql-prisma-111111?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/openapi-3.1-111111?style=flat-square&logo=openapiinitiative&logoColor=white" />
  <img src="https://img.shields.io/github/actions/workflow/status/acevedo-daniel/parkcore-api/ci.yml?style=flat-square&label=CI" />
</p>

Backend API for parking facility management. Built with TypeScript, Express 5, Prisma, and PostgreSQL.

---

## Technical Highlights

- Strict TypeScript across application, scripts, and tests
- Layered feature modules: `routes -> controller -> service -> repository`
- Zod validation schemas reused for OpenAPI generation
- OpenAPI 3.1 documentation served with Scalar
- JWT authentication with Argon2 password hashing
- In-memory auth rate limiting
- Serializable transaction for check-in race protection
- Express 5 async error handling through a global error middleware
- Structured Pino logging with `x-request-id` correlation
- Graceful shutdown for HTTP and Prisma

---

## Functional Coverage

| Module   | Capabilities                              |
| -------- | ----------------------------------------- |
| Auth     | Register, login, JWT access tokens        |
| Users    | Current user profile read/update          |
| Parkings | Create, list, read, update, owner listing |
| Vehicles | Create and lookup by plate per parking    |
| Bookings | Check-in, check-out, cancel, pagination   |
| Reviews  | Create, list, and parking rating stats    |
| System   | Health check and service metadata         |

---

## Stack

- Node.js 22
- TypeScript strict mode
- Express 5
- Prisma + PostgreSQL
- Zod
- OpenAPI 3.1 + Scalar
- Pino + pino-http
- Vitest + Supertest
- Docker Compose for local PostgreSQL and pgAdmin

---

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm docker:up
pnpm db:setup
pnpm dev
```

Default local services:

- API: `http://localhost:3000`
- PostgreSQL: `localhost:5432` (`parkcore-db`)
- pgAdmin: `http://localhost:5050`

Auth rate limit defaults:

- `AUTH_RATE_LIMIT_MAX=15`
- `AUTH_RATE_LIMIT_WINDOW_MS=900000`

---

## Design Decisions

Zod is used for validation and OpenAPI metadata so runtime input checks and generated API contracts share the same source of truth.

Argon2 is used for password hashing because it is memory-hard and better suited for password storage than fast general-purpose hashes.

Booking check-in uses a serializable Prisma transaction to prevent concurrent active bookings for the same vehicle.

Controllers rely on Express 5 native async error forwarding. Expected domain failures are thrown from controllers or services and normalized by the global error middleware.

---

## Testing Strategy

- Unit tests cover service-level business rules and error cases.
- Supertest smoke tests cover app wiring, health, route errors, and auth rate limiting.
- TypeScript and ESLint run as mandatory quality gates.
- OpenAPI generation and build artifact checks run in CI readiness commands.

---

## API Documentation

- Scalar UI: `/api-docs/docs`
- OpenAPI JSON: `/api-docs/openapi.json`
- Production API base URL: `https://parkcore-api.onrender.com`

API docs are enabled in development and test by default. In production, set `ENABLE_API_DOCS=true` to expose them.

---

## Quality & Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm quality:ci
pnpm release:readiness
```

---

## Architecture

```text
routes -> controller -> service -> repository
```

- Routes compose middleware and controller handlers.
- Controllers handle HTTP concerns only.
- Services enforce business rules and authorization checks.
- Repositories isolate Prisma persistence.
- Errors flow through a global handler with a stable response contract.

See [ARCHITECTURE.md](docs/ARCHITECTURE.md), [CONVENTIONS.md](docs/CONVENTIONS.md), and [API-DESIGN.md](docs/API-DESIGN.md) for details.

---

## CI

- Workflow: `.github/workflows/ci.yml`
- Gate: `quality-and-readiness`
- Checks: lint, typecheck, test coverage, OpenAPI generation, and build readiness
