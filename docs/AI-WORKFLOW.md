# AI Workflow

## Purpose

Operational playbook for AI agents and automation contributors.
This document defines how to work in the repository with predictable quality.

## Required Read Order

1. `docs/CONVENTIONS.md`
2. `docs/ARCHITECTURE.md`
3. `docs/API-DESIGN.md`
4. `README.md`

## Mission

Maintain a high-signal technical demo API with:

- stable architecture boundaries,
- strict typing and validation,
- and synchronized documentation.

## Working Loop

1. Discover:
   - inspect target module and adjacent dependencies.
   - verify current runtime behavior in code, not assumptions.
2. Plan:
   - define minimal change set.
   - identify docs and tests affected by the change.
3. Implement:
   - keep architecture direction (`routes -> controller -> service -> repository`).
   - avoid broad rewrites unless explicitly requested.
4. Verify:
   - run required quality commands.
   - confirm no contract regressions.
5. Document:
   - update public docs in the same change set.

## Runtime Truth (Source of Record)

When docs disagree with code, code is authoritative.

- Error response contract: `{ error: true, message: string }`.
- Auth: JWT bearer with `requireAuth` middleware.
- Auth endpoints are rate-limited:
  - `/auth/register`
  - `/auth/login`
  - defaults: `15` requests per `15` minutes.
  - optional distributed storage via `REDIS_URL`.
- Docs mounting policy:
  - enabled in non-production by default.
  - enabled in production only when `ENABLE_API_DOCS=true`.
  - UI: `/api-docs/docs`
  - JSON: `/api-docs/openapi.json`
- System endpoints:
  - `/` -> service status payload.
  - `/healthz` -> health probe.
- OpenAPI servers are currently generated with:
  - `http://localhost:3000` (Development)
  - `https://copark-api.onrender.com` (Production)

## Required Verification Commands

Run after any relevant change:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm openapi:check
pnpm release:readiness
```

For full CI parity:

```bash
pnpm quality:ci
```

## Change Checklist

1. If env behavior changes, update:
   - `src/config/env.ts`
   - `.env.example`
   - relevant docs in `docs/`
2. If route behavior changes, update:
   - corresponding `*.docs.ts`
   - OpenAPI verification output
3. If architectural behavior changes, update:
   - `docs/ARCHITECTURE.md`
   - `docs/API-DESIGN.md`
   - `README.md` only if public-facing behavior changed
