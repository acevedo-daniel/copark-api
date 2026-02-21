# Conventions

## Purpose

Defines mandatory engineering conventions for contributors and AI agents.
These rules are normative and apply to all changes.

## Language and Communication

1. Code, identifiers, commit messages, and documentation must be in English.
2. Team discussion may be in Spanish.
3. Public documentation must stay concise and synchronized with runtime behavior.

## Architecture Rules

1. Respect dependency flow: `routes -> controller -> service -> repository`.
2. Controllers handle HTTP only.
3. Services own business rules and orchestration.
4. Repositories contain persistence logic only.
5. Route files compose middleware and controller wiring only.

## Type Safety Rules

1. TypeScript strict mode is mandatory.
2. `any` and `@ts-ignore` are prohibited.
3. Prefer explicit function signatures for handlers and services.
4. Treat caught errors as `unknown` and normalize before branching on shape.

## Validation Rules

1. Validate all external inputs (`body`, `params`, `query`) with Zod.
2. Use `validateRequest` middleware for validated endpoints.
3. Keep schema definitions close to their feature module.
4. Reuse schema fragments to avoid divergence.

## Error Handling Rules

1. Throw `AppError` subclasses for expected domain/HTTP failures.
2. Keep the canonical error response contract:

```json
{ "error": true, "message": "..." }
```

3. Do not leak internal implementation details in responses.
4. The global error middleware is the single formatting layer.

## Logging Rules

1. Use the shared Pino logger from `src/lib/logger.ts`.
2. Keep request logging enabled through pino-http middleware.
3. Preserve request correlation via `x-request-id`.
4. Never log secrets, password hashes, tokens, or authorization headers.

## Security Rules

1. Keep `helmet()` globally enabled.
2. Keep environment-aware CORS policy enforced in `app.ts`.
3. Preserve body size limits unless there is a justified product requirement.
4. In production, require explicit `CORS_ORIGINS`.
5. Keep auth rate limiting active and configuration-driven.

## Documentation Rules

1. Public docs in this repository are the root files in `docs/`:
   - `ARCHITECTURE.md`
   - `CONVENTIONS.md`
   - `AI-WORKFLOW.md`
   - `API-DESIGN.md`
2. `docs/` subfolders are local reference material and are not part of the public surface.
3. Documentation changes must ship in the same change set as behavior changes.

## Change Discipline

1. Prefer small, reviewable commits.
2. Avoid broad rewrites without a clear technical reason.
3. Prioritize clarity and maintainability over clever abstractions.
4. Keep quality gates green before pushing:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test`
