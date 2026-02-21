# CoPark Conventions

## Purpose

Mandatory engineering conventions for contributors and AI agents.

## Language

- Code, identifiers, and comments: English.
- Team discussion can be Spanish.
- Documentation must be concise and kept aligned with code.

## Architecture rules

1. Respect direction: `routes -> controller -> service -> repository`.
2. Controllers must not access Prisma directly.
3. Business rules belong in services.
4. Repositories are persistence-only.

## Typing rules

1. TypeScript strict mode is mandatory.
2. `any` and `ts-ignore` are not allowed.
3. Prefer explicit typing for request handlers.
4. Treat caught errors as `unknown` and normalize before use.

## Validation rules

1. Validate request body/params/query with Zod.
2. Use `validateRequest` for endpoints with input contracts.
3. Reuse schemas to avoid duplicated shapes.

## Error handling rules

1. Throw `AppError` subclasses for expected HTTP/domain errors.
2. Keep error response contract stable:

```json
{ "error": true, "message": "..." }
```

3. Unexpected errors must resolve to 500 with safe message.
4. Global error middleware is the single formatting point.

## Logging rules

1. Use Pino (`src/lib/logger.ts`) for application logs.
2. Use pino-http middleware for request/response logging.
3. Keep `x-request-id` correlation active.
4. Never log sensitive values (tokens, secrets, raw passwords).

## Security baseline rules

1. Keep `helmet()` enabled globally.
2. Enforce CORS policy by environment.
3. Keep request body limits configured.
4. For production, define `CORS_ORIGINS` explicitly.

## Documentation rules

1. Canonical docs published in this repository live in the root `docs/` directory:
   - `ARCHITECTURE.md`
   - `CONVENTIONS.md`
   - `AI-WORKFLOW.md`
   - `API-DESIGN.md`
2. Subfolders in `docs/` are local references and must not be part of the public repo surface.
3. Update docs in the same change when behavior changes.

## Change discipline

1. Prefer small, reviewable commits.
2. Avoid broad rewrites without clear need.
3. Prioritize maintainability over cleverness.
4. Keep `pnpm lint` and `pnpm typecheck` green.
