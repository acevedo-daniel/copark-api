# CoPark Roadmap (Technical Demo)

## Vision

Build a small, defensible, and production-aware API that can be explained clearly in technical interviews for first backend opportunities.

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
- End-to-end integration tests are still pending.
- Multi-region deployment behavior is not covered by automated smoke checks.

## Phases

### Phase A - Contract and functional consistency

Goal: keep runtime behavior and API contract aligned.

1. Audit and close modules using the current module quality checklist.
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
2. Keep rate limiting stable for proxied deployments and shared stores.
3. Keep docs exposure policy explicit and environment-based.

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

### Phase D - Demo release

Goal: final recruiter-facing demo presentation.

1. Finalize module technical/learning docs.
2. Keep README/architecture/conventions synchronized with code.
3. Verify stable Render deployment.

Exit criteria:

- end-to-end demo works reliably
- repo is consistent and demo-ready

## Immediate priority

1. Add route-vs-OpenAPI drift automation.
2. Add E2E integration coverage for critical user flows.
3. Keep branch protection requiring CI checks in `main`.
