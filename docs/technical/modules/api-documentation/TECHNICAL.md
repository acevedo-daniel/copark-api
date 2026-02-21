# API Documentation Module - Technical Specification

## 1. Scope

This document defines the technical architecture and operating model of the API documentation module.

Module objective:

- Generate OpenAPI 3.1 documentation from runtime schemas.
- Expose interactive docs and raw OpenAPI JSON.
- Keep API contract aligned with real Express routes.

## 2. Source of truth model

The module is schema-first:

1. Zod schemas validate runtime input/output contracts.
2. The same schemas add OpenAPI metadata via `.openapi()`.
3. Feature docs register endpoint paths and attach schemas.
4. A registry is assembled and converted into the final OpenAPI document.

This avoids duplicated contracts and reduces drift.

## 3. Runtime components

### 3.1 Zod OpenAPI bootstrap

- File: `src/lib/openapi-registry.ts`
- Responsibility: execute `extendZodWithOpenApi(z)`.
- Constraint: must run before schemas using `.openapi()` are evaluated.

### 3.2 OpenAPI document builder

- File: `src/config/openapi.ts`
- Responsibility:
  - instantiate `OpenAPIRegistry`
  - register global components
  - register all feature docs
  - generate OpenAPI 3.1 document

### 3.3 Global components

- File: `src/docs/register-global-components.ts`
- Responsibility: register shared OpenAPI components (for example `bearerAuth`).

### 3.4 Feature docs orchestrator

- File: `src/docs/register-feature-docs.ts`
- Responsibility: call each `registerXDocs(registry)` function.
- Registration strategy: by module, explicitly.

### 3.5 Error schema helper

- File: `src/docs/error-response.ts`
- Responsibility: standardize documented error responses.
- Contract:

```json
{ "error": true, "message": "..." }
```

### 3.6 Docs HTTP mount

- File: `src/config/api-docs.ts`
- Responsibility:
  - expose Scalar UI
  - expose OpenAPI JSON
  - maintain legacy redirects
  - isolate Helmet/CSP docs config from app global middleware

## 4. Exposed routes

Primary:

- `/api-docs/docs`
- `/api-docs/openapi.json`

Legacy compatibility:

- `/docs` -> `/api-docs/docs`
- `/openapi.json` -> `/api-docs/openapi.json`

## 5. Registration strategy (answer to: all-at-once or by parts)

Recommended and implemented strategy: **by parts (module by module) with a central assembler**.

Why:

1. Each feature owns its contract (`*.docs.ts`).
2. New modules are added by registering one function in `register-feature-docs.ts`.
3. Failures are isolated and review scope is smaller.
4. Avoids one giant docs file.

So: documentation is generated as a whole document, but registered in modular parts.

## 6. Security and consistency controls

Minimum controls:

1. If route auth changes, update OpenAPI `security` in the same change.
2. Use shared error response helper for 4xx/5xx consistency.
3. Keep documented paths equal to real composed Express routes.
4. Avoid undocumented public endpoints.

## 7. Operational checklist

When adding/changing endpoint docs:

1. Update module schema (`*.schema.ts`) if contract changed.
2. Update module docs (`*.docs.ts`).
3. If new module, register in `register-feature-docs.ts`.
4. Validate:
   - `pnpm typecheck`
   - `pnpm generate:openapi`
5. Manual check:
   - open `/api-docs/docs`
   - verify endpoint, auth, request/response and error schemas.

## 8. Current risks

1. No automated route-vs-openapi contract test yet.
2. Drift can still happen if route code changes without docs update.
3. UI availability depends on CSP allowances for Scalar assets.

## 9. Recommended next hardening

1. Add CI contract check for route coverage.
2. Add smoke test for docs endpoints.
3. Add PR checklist item: "route changed => docs updated".
