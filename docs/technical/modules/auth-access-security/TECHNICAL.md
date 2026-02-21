# Auth And Access Security Module - Technical Specification

## 1. Scope

This module covers authentication and access guard logic.

Included files:

- `src/features/auth/auth.schema.ts`
- `src/features/auth/auth.controller.ts`
- `src/features/auth/auth.service.ts`
- `src/features/auth/auth.password.ts`
- `src/features/auth/auth.jwt.ts`
- `src/features/auth/auth.routes.ts`
- `src/features/auth/auth.docs.ts`
- `src/middlewares/auth.middleware.ts`

Main objective:

- Keep authentication simple, secure, and consistent across runtime, DTOs, and API docs.

## 2. Audit Summary

Priority findings detected during module audit:

1. JWT verification did not explicitly pin allowed algorithms.
2. Registration could return unexpected 500 in concurrent requests for same email.
3. Auth DTO validation was slightly inconsistent (`trim` order and login password bounds).
4. Authorization header parsing accepted non-canonical formats.

## 3. Implemented Improvements

### 3.1 JWT hardening

File: `src/features/auth/auth.jwt.ts`

Changes:

- Added explicit token type in header: `typ: 'JWT'`.
- Added `setSubject(sub)` during signing.
- Restricted verification to `HS256` only with `jwtVerify(..., { algorithms: ['HS256'] })`.

Impact:

- Reduces algorithm confusion risk.
- Makes subject claim explicit and consistent.

### 3.2 Race-safe email conflict handling

File: `src/features/auth/auth.service.ts`

Changes:

- Added detection of Prisma unique constraint errors (`P2002`) targeting `email`.
- Translated those errors to `ConflictError('Email already in use')`.

Impact:

- Prevents leaking unexpected 500 on register race conditions.
- Keeps HTTP semantics stable (`409`) under concurrent requests.

### 3.3 DTO consistency and validation quality

File: `src/features/auth/auth.schema.ts`

Changes:

- Normalized email transformation order to `trim()` then `toLowerCase()`.
- Adjusted `name` chain to validate after `trim()`.
- Added login password bounds (`min(8)`, `max(100)`) aligned with register constraints.

Impact:

- Better input normalization.
- Avoids edge cases with padded strings and oversized password payloads.

### 3.4 Authorization header normalization

File: `src/middlewares/auth.middleware.ts`

Changes:

- Replaced simple `startsWith('Bearer ')` parsing with strict token extraction by parts.
- Rejects malformed values with extra segments.

Impact:

- More robust request parsing and less ambiguity in auth guard behavior.

## 4. Contract and Security Notes

- Runtime and OpenAPI remain aligned for `/auth/register` and `/auth/login`.
- Error contract remains standard: `{ error: true, message: string }`.
- Password hashing remains delegated to Argon2 (`src/features/auth/auth.password.ts`).

## 5. Residual Risks (Accepted for this module)

- No rate limiting yet on public auth endpoints (`/auth/login`, `/auth/register`).
- No refresh-token flow (single access token strategy).
- No auth-specific automated tests yet.

These are tracked as next-step hardening, not blockers for this module pass.

## 6. Closure Criteria Check

- Contract runtime and OpenAPI aligned: Yes.
- Critical security debt resolved in module scope: Yes (JWT verification + race conflict handling).
- Lint and typecheck: Executed after changes.
- Minimum test cases: Not present yet (explicit gap).
- Technical and learning docs updated: Yes.
