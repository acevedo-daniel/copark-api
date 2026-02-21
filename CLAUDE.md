# CoPark Agent Context

Read in this order:

1. `docs/CONVENTIONS.md`
2. `docs/ARCHITECTURE.md`
3. `docs/ROADMAP.md`

## Mission

Build and maintain the API with clean architecture, strict typing, and accurate documentation.

## Stack

- Node.js + TypeScript (strict)
- Express 5
- Prisma 7 + PostgreSQL
- Zod 4
- OpenAPI 3.1 + Scalar UI

## Non-negotiable rules

1. Keep dependency flow: controller -> service -> repository.
2. Validate all external input with Zod.
3. Do not use `any` or `ts-ignore`.
4. Keep docs aligned with code in the same change.
5. Prefer small, verifiable increments.

## Runtime truth (important)

- Success responses are usually raw JSON payloads from controllers.
- Error responses use `{ error: true, message: string }` from central error middleware.
- Auth uses Bearer JWT via `requireAuth` middleware.
- API docs are exposed at:
  - `/api-docs/docs`
  - `/api-docs/openapi.json`

## Working style for agents

1. Before edits, inspect module structure in `src/features/<module>/`.
2. When changing routes, update matching docs in `*.docs.ts`.
3. Run verification commands when possible:
   - `pnpm typecheck`
   - `pnpm generate:openapi`
4. If behavior is unclear, prefer code reality over stale docs and update docs.
