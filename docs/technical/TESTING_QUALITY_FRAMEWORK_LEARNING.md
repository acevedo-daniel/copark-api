# CoPark - Aprendizaje del Marco de Testing (Paso 1 al 4)

## Contexto

Este documento explica que se implemento en los pasos 1 y 2 del marco de testing, por que se hace, y como se usa sin sobreingenieria.

## Paso 1 - Dependencias instaladas

### `vitest`

Que es:
- Runner de tests rapido para Node/TypeScript.

Por que se eligio:
- Arranque rapido.
- Buena integracion con ESM y TypeScript.
- API de mocks simple para tests unitarios por modulo.

Que problema evita:
- Evita tener un stack pesado para un backend pequeno/mediano.

### `@vitest/coverage-v8`

Que es:
- Plugin de coverage usando el motor V8 de Node.

Por que se eligio:
- Menor sobrecarga que instrumentos externos.
- Reportes utiles para CI y para detectar huecos de riesgo.

Que problema evita:
- Evita medir cobertura de forma manual o inconsistente.

### `supertest`

Que es:
- Cliente HTTP para testear app Express sin levantar servidor real en puerto.

Por que se eligio:
- Permite smoke tests e integracion minima de rutas.
- Muy util para validar contratos HTTP (`status`, `body`, headers).

Que problema evita:
- Evita tests fragiles con llamadas reales de red.

### `@types/supertest`

Que es:
- Tipos TypeScript para `supertest`.

Por que se eligio:
- Mantiene strict typing en tests.

Que problema evita:
- Evita perdida de tipado y errores de DX al escribir pruebas.

## Paso 2 - Archivos base creados

### `vitest.config.ts`

Que hace:
- Define el comportamiento global del runner.

Puntos clave:
- `environment: "node"`: backend puro, sin DOM.
- `clearMocks` y `restoreMocks`: aislamiento entre tests.
- `setupFiles`: ejecuta preparacion comun antes de correr pruebas.
- `include`: detecta tests en `src/**` y `tests/**`.
- `coverage` con provider `v8` y exclusiones utiles.

Aprendizaje:
- Una configuracion unica reduce ruido por modulo y evita configuraciones duplicadas.

### `vitest.setup.ts`

Que hace:
- Inyecta valores de entorno por defecto para modo test.

Por que es importante en este repo:
- `src/config/env.ts` valida variables al importar modulos.
- Sin defaults de test, varios imports fallarian al inicio.

Aprendizaje:
- Preparar `process.env` en setup desacopla tests de tu `.env` local y mejora reproducibilidad.

### `tests/helpers/builders.ts`

Que hace:
- Define factories pequenas para datos de prueba (`register`, `login`, `parking`, `vehicle`).

Por que es importante:
- Evita repetir objetos hardcodeados en cada test.
- Facilita modificar fixtures en un solo lugar.

Aprendizaje:
- Builders simples aumentan legibilidad sin crear una capa compleja de fixtures.

### `tests/helpers/mocks.ts`

Que hace:
- Expone utilidades para `Request`, `Response`, `NextFunction` de Express.

Por que es importante:
- Permite testear middlewares/controladores sin boot completo de app.
- Acelera ejecucion y reduce dependencias.

Aprendizaje:
- Mockear contrato de Express es suficiente para unit tests de seguridad y errores.

## Validacion ejecutada

Se verifico el arranque del framework con:

- `pnpm exec vitest run --passWithNoTests`

Resultado:
- Vitest inicia correctamente con la configuracion actual.
- No falla aunque aun no existan tests implementados por modulo.

## Paso 3 - Scripts de calidad

### `test`

Script:
- `vitest run`

Aprendizaje:
- Es el modo no interactivo para pipeline local/CI.
- Falla cuando no hay tests, lo cual fuerza disciplina de cobertura real.

### `test:watch`

Script:
- `vitest`

Aprendizaje:
- Optimiza feedback en desarrollo, re-ejecutando al guardar cambios.

### `test:coverage`

Script:
- `vitest run --coverage`

Aprendizaje:
- Da visibilidad cuantitativa de riesgo de regresion.
- Ayuda a decidir donde agregar tests sin sobre-testear.

### `quality`

Script:
- `pnpm lint && pnpm typecheck && pnpm test`

Aprendizaje:
- Ordena puertas de calidad de menor costo a mayor costo:
  - estilo/errores estaticos
  - tipos
  - comportamiento
- Si una puerta falla, corta rapido y reduce tiempo perdido.

### `quality:ci`

Script:
- `pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm generate:openapi`

Aprendizaje:
- Suma contrato OpenAPI para detectar drift entre runtime y docs.
- Asegura que CI valide codigo + pruebas + contrato.

## Paso 4 - Politica minima de coverage

Thresholds aplicados en `vitest.config.ts`:

- `lines: 70`
- `functions: 70`
- `branches: 60`
- `statements: 70`

Aprendizaje:
- Umbral moderado inicial para no bloquear adopcion temprana.
- `branches` mas bajo al inicio porque suele ser lo mas costoso cubrir.
- Objetivo: subir thresholds despues de cerrar modulos criticos.
