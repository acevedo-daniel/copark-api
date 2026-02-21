# CI/CD and Release Readiness

## Objetivo

Establecer un flujo minimo y efectivo de CI/CD para reducir riesgo de release con foco en:

- Performance (feedback rapido)
- Seguridad (gates antes de merge/release)
- Limpieza (checks centralizados y simples)
- Sin sobreingenieria

## Auditoria Inicial

Estado detectado antes de esta implementacion:

- No existia pipeline en `.github/workflows`.
- Existian checks locales (`quality`, `quality:ci`) pero no gate automatizado en PR/push.
- No habia check explicito de readiness de build de artefacto `dist`.
- Se generaba OpenAPI, pero faltaba un check estructural minimo del contrato.

## Implementacion Aplicada

### 1. Pipeline checks (CI)

Se creo `.github/workflows/ci.yml` con triggers en `push` y `pull_request` a `main`:

1. `pnpm install --frozen-lockfile`
2. `pnpm db:setup` (con PostgreSQL service en CI)
3. `pnpm quality:ci`
4. `pnpm release:readiness`

Incluye:

- permisos minimos (`contents: read`)
- cancelacion de ejecuciones en progreso por misma rama (concurrency)

### 2. Build/deploy checks

Nuevos scripts:

- `build:check`: `pnpm build && tsx src/scripts/check-build-artifact.ts`
- `release:readiness`: `pnpm openapi:check && pnpm build:check`

`check-build-artifact.ts` valida que `dist/app.js` cargue correctamente con entorno minimo controlado.

### 3. Salud de docs y contrato

Nuevo script:

- `openapi:check`: `tsx src/scripts/check-openapi.ts`

Validaciones minimas:

- presencia de `openapi` y `info.version`
- presencia de rutas criticas:
  - `/healthz`
  - `/auth/register`
  - `/auth/login`
  - `/reviews/parking/{parkingId}`
  - `/reviews/parking/{parkingId}/stats`
- presencia de `components.schemas.ErrorResponse`
- presencia de respuesta `404` en los endpoints de reviews

## Comandos de Verificacion Local

```bash
pnpm quality:ci
pnpm release:readiness
```

## Criterio Minimo de Release

Se considera "release-ready" cuando:

1. CI en verde (`quality:ci` + `release:readiness`)
2. Build de produccion genera `dist` importable
3. Contrato OpenAPI pasa `openapi:check`

## Siguiente Paso Recomendado (sin sobreingenieria)

Agregar branch protection en `main` para exigir CI verde antes de merge.
