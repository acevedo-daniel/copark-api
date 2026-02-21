# CoPark Roadmap (Portfolio Ready)

## Vision

Build a small, defensible, and production-aware API that can be explained clearly in technical interviews.

## Current status (February 21, 2026)

Completed baseline:

- Core API modules implemented (Auth, Users, Parkings, Vehicles, Bookings, Reviews).
- Layered architecture in place.
- Zod runtime validation and strict TypeScript.
- OpenAPI + Scalar docs running.
- Structured logging baseline with Pino/pino-http.
- Core platform hardening:
  - CORS policy by environment
  - body size limits
  - unified error contract
  - graceful shutdown flow

## Remaining gaps

- Route-vs-OpenAPI drift checks are still manual.
- Basic rate limiting is pending.
- API docs exposure policy by environment is pending.

## Phases

### Phase A - Contract and functional consistency

Goal: keep runtime behavior and API contract aligned.

1. Audit and close modules using `docs/technical/MODULE_AUDIT_PLAN.md`.
2. Fix route/docs mismatches when detected.
3. Keep lint/typecheck/openapi generation green.

Exit criteria:

- `pnpm typecheck` green
- `pnpm lint` green
- `pnpm generate:openapi` green
- audited modules documented and closed

### Phase B - Security and observability baseline

Goal: improve runtime safety without overengineering.

1. Keep Pino config stable and consistent across server/middlewares.
2. Add rate limiting for sensitive public endpoints (`auth`).
3. Decide docs exposure policy by environment.

Exit criteria:

- predictable structured logs with request correlation
- explicit security policy for public endpoints

### Phase C - Testing and automated quality

Goal: prevent regressions.

1. Integrate Vitest.
2. Add minimum critical tests:
   - Auth login/register
   - Booking check-in/check-out
   - error contract behavior
3. Add `pnpm test` and CI execution.

Exit criteria:

- tests runnable locally and in CI
- critical flows covered

### Phase D - Portfolio release

Goal: final recruiter-facing presentation.

1. Finalize module technical/learning docs.
2. Keep README/architecture/conventions synchronized with code.
3. Verify stable Render deployment.

Exit criteria:

- end-to-end demo works reliably
- repo is consistent and interview-ready

## Immediate priority

1. Complete active module audits and documentation.
2. Add minimal rate limiting.
3. Enable branch protection requiring CI checks in `main`.
