# ParkCore Finalization Roadmap

This file tracks the completed cleanup and release verification for `parkcore-api`.

## Completed Scope

- Rebranded the project and public documentation to ParkCore.
- Removed obsolete workspace and workflow documentation.
- Standardized controller error handling around Express 5 async forwarding.
- Consolidated booking response shaping and repository-owned relation types.
- Added review creation support to runtime code, OpenAPI docs, and tests.
- Renamed local and CI database resources to `parkcore-db`.
- Regenerated Prisma migrations from a clean database baseline.
- Removed external cache dependency from auth rate limiting.

## Phase 9 - Final Verification & Ship

### 9.1 Full Pipeline

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm generate:openapi
pnpm release:readiness
```

### 9.2 Manual Checks

- [ ] `pnpm docker:up && pnpm db:setup && pnpm dev` works
- [ ] `/healthz` returns `{ "status": "ok" }`
- [ ] `/` returns `{ "status": "ok", "service": "parkcore-api" }`
- [ ] `/api-docs/docs` loads Scalar UI with all endpoints
- [ ] `POST /auth/register` returns `201`
- [ ] `POST /auth/login` returns `200`
- [ ] `GET /parkings` returns `200` with pagination metadata
- [ ] `POST /reviews/parking/:id` returns `201`
- [ ] Invalid route returns `404` with `{ "error": true, "message": "Route not found" }`
- [ ] No unsafe never casts in any test file
- [ ] No legacy typed handler helper references anywhere
- [ ] No legacy brand references in source code, tests, config, or docs

### 9.3 Commit

```bash
git add -A
git commit -m "refactor: rebrand to parkcore, clean architecture, standardize patterns"
```

### 9.4 Repository Rename

1. Rename the remote repository to `parkcore-api`.
2. Update local remote: `git remote set-url origin git@github.com:acevedo-daniel/parkcore-api.git`
3. Push: `git push origin main`
