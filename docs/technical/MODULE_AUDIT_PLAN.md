# CoPark - Plan Modular de Auditoria y Modernizacion

Objetivo: modernizar la API sin sobre-ingenieria, trabajando por partes y cerrando cada modulo con evidencia tecnica.

## Metodo de trabajo por modulo

Cada modulo se recorre con la misma secuencia:

1. Auditoria
2. Mejora / edicion / refactor
3. Documentacion tecnica
4. Documento de aprendizaje
5. Criterio de cierre

Plantilla de criterio de cierre por modulo:

- Contrato runtime y OpenAPI alineado.
- Sin deuda critica de seguridad.
- Lint y typecheck en verde.
- Casos minimos cubiertos en tests (cuando aplique).
- Documentacion tecnica y aprendizaje actualizada.

## Modulos de la API (orden recomendado)

### 0. Core de plataforma (arranque, config, middlewares base)

Incluye:

- `app.ts`, `server.ts`
- `src/config/*`
- `src/middlewares/*`
- `src/errors/*`
- `src/types/express.d.ts`

Enfoque:

- Orden de inicializacion, simplicidad del bootstrap, manejo uniforme de errores, limites de seguridad base (helmet/cors/json size).

### 1. Documentacion de API (OpenAPI + Scalar)

Incluye:

- `src/config/openapi.ts`
- `src/config/api-docs.ts`
- `src/docs/*`
- `src/features/*/*.docs.ts`
- `src/scripts/generate-openapi.ts`

Enfoque:

- Alineacion ruta real vs contrato, seguridad declarada, consistencia de respuestas.

### 2. Auth y seguridad de acceso

Incluye:

- `src/features/auth/*`
- `src/middlewares/auth.middleware.ts`

Enfoque:

- Fortalecimiento JWT, expiracion, mensajes de error, riesgo de abuso, hardening de endpoints publicos.

### 3. Users

Incluye:

- `src/features/user/*`

Enfoque:

- Perfil, consistencia de DTOs, validaciones, y sanitizacion de salida.

### 4. Parkings

Incluye:

- `src/features/parking/*`

Enfoque:

- Paginacion/filtros reales, ownership, performance de queries y coherencia de contrato.

### 5. Vehicles

Incluye:

- `src/features/vehicle/*`

Enfoque:

- Reglas de dominio (placa unica por parking), semantica HTTP correcta, manejo de no encontrados.

### 6. Bookings

Incluye:

- `src/features/booking/*`

Enfoque:

- Flujo check-in/check-out, conflictos de concurrencia, consistencia de estados y precio.

### 7. Reviews

Incluye:

- `src/features/review/*`

Enfoque:

- Contrato de estadisticas, modelo read-only actual, consistencia con docs.

### 8. Persistencia y Prisma

Incluye:

- `prisma/schema.prisma`
- `src/config/prisma.ts`
- migraciones y generated client

Enfoque:

- indices, restricciones, integridad de datos, costo de consultas.

### 9. Logging y observabilidad profesional

Incluye:

- reemplazo/mejora de logger actual
- trazabilidad minima por request

Enfoque:

- logger estructurado, niveles, correlacion basica y formato apto produccion.

### 10. Testing y calidad automatizada

Incluye:

- Vitest setup
- tests por modulo critico
- scripts de calidad

Enfoque:

- test minimo efectivo, no exhaustivo innecesario.

### 11. CI/CD y release readiness

Incluye:

- pipeline checks
- build/deploy checks
- salud de docs y contrato

Enfoque:

- evitar regresiones antes de enviar CVs.

## Entregable por modulo

Por cada modulo se generan 2 archivos:

1. `docs/technical/modules/<modulo>/TECHNICAL.md`
2. `docs/technical/modules/<modulo>/LEARNING.md`

## Regla de ritmo

No abrir mas de 1 modulo a la vez.  
Cerrar un modulo completo antes de pasar al siguiente.

