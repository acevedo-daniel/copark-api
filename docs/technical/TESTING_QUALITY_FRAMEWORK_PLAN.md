# CoPark - Implementacion de Marco de Testing y Calidad

## Objetivo

Implementar un marco de testing y calidad automatizado con enfoque en:

- Performance
- Seguridad
- Limpieza
- Sin sobreingenieria

Estrategia: test minimo efectivo, priorizando flujos de riesgo y regresiones frecuentes.

## Principios de diseno

- Tests rapidos por defecto: unitarios de servicios y middlewares con mocks.
- Integracion acotada: solo smoke checks y contratos criticos.
- Cero dependencia de red externa en tests.
- Feedback corto para desarrollo local y gate estricto para CI.

## Fase 0 - Marco base (primero)

### 1. Dependencias

Agregar en `devDependencies`:

- `vitest`
- `@vitest/coverage-v8`
- `supertest`
- `@types/supertest`

### 2. Archivos base

Crear:

- `vitest.config.ts`
- `vitest.setup.ts`
- `tests/helpers/builders.ts`
- `tests/helpers/mocks.ts`

Configuracion recomendada en `vitest.config.ts`:

- `environment: "node"`
- `globals: false`
- `clearMocks: true`
- `restoreMocks: true`
- `include: ["src/**/*.test.ts", "tests/**/*.test.ts"]`
- `coverage.provider: "v8"`
- `coverage.reportsDirectory: "coverage"`
- `coverage.reporter: ["text", "html", "lcov"]`
- `coverage.exclude`: `prisma/generated`, `**/*.docs.ts`, `src/scripts/**`

### 3. Scripts de calidad

Agregar en `package.json`:

- `test`: `vitest run`
- `test:watch`: `vitest`
- `test:coverage`: `vitest run --coverage`
- `quality`: `pnpm lint && pnpm typecheck && pnpm test`
- `quality:ci`: `pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm generate:openapi`

### 4. Politica minima de coverage

Aplicar threshold global inicial moderado:

- Lines >= 70
- Functions >= 70
- Branches >= 60
- Statements >= 70

Subir umbrales despues de cerrar los modulos criticos.

## Fase 1+ - Modulos en orden de creacion de tests

Orden propuesto por riesgo tecnico y seguridad:

1. **Auth + Auth Middleware**
2. **Error Handler + Env Config**
3. **Booking Service**
4. **Vehicle Service**
5. **Parking Service**
6. **User Service**
7. **Review Service**
8. **Core app smoke (`app.ts`)**

## Alcance minimo por modulo

### 1) Auth + Auth Middleware

- `auth.service.ts`:
  - register exitoso
  - register con email duplicado
  - login exitoso
  - login con credenciales invalidas
- `auth.middleware.ts`:
  - token ausente o mal formado
  - token invalido/expirado
  - token valido setea `req.user.id`

Motivo: mayor impacto en seguridad de acceso.

### 2) Error Handler + Env Config

- `error-handler.middleware.ts`:
  - `AppError` operativo conserva status y mensaje
  - error inesperado retorna 500 sin filtrar detalles internos
  - JSON invalido retorna 400
  - payload grande retorna 413
- `env.ts`:
  - rechaza config invalida de produccion (CORS/JWT)

Motivo: seguridad de errores y robustez operativa.

### 3) Booking Service

- `checkIn`:
  - ownership invalido => `ForbiddenError`
  - crea vehiculo si no existe
  - conflicto de concurrencia devuelve `ConflictError`
- `checkOut`:
  - calcula `hoursToCharge` correcto (minimo 1h)
  - booking no activo => `ConflictError`

Motivo: modulo con mayor complejidad y costo de regresion.

### 4) Vehicle Service

- ownership de parking
- `NotFoundError` cuando parking/vehiculo no existe
- `ConflictError` por placa duplicada por parking

Motivo: regla de integridad clave (`plate + parkingId`).

### 5) Parking Service

- filtros de busqueda/precio en `findAll`
- ownership en update
- paginacion estable

Motivo: performance funcional de listados.

### 6) User Service

- lectura de perfil propio
- actualizacion de datos validos
- no exponer campos sensibles

Motivo: consistencia de contrato.

### 7) Review Service

- lectura/estadisticas basicas
- errores esperados por recurso inexistente

Motivo: menor criticidad, mantener cobertura funcional.

### 8) Core app smoke

- `GET /healthz` devuelve 200
- ruta inexistente devuelve contrato de error estandar

Motivo: validar bootstrap sin costo alto.

## Regla de implementacion por modulo

1. Escribir tests unitarios del servicio/middleware.
2. Ejecutar `pnpm test` local.
3. Corregir regresiones.
4. Ejecutar `pnpm quality`.
5. Cerrar modulo y pasar al siguiente.

No abrir mas de un modulo a la vez.

## Criterio de cierre del marco

- Vitest operativo en local y CI.
- Scripts `test`, `test:coverage`, `quality`, `quality:ci` funcionando.
- Primer modulo critico (Auth) cerrado con tests verdes.
