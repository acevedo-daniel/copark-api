# 🎓 Guía de Aprendizaje — Módulo de Documentación OpenAPI

> **Objetivo:** Que entiendas cada pieza del sistema de documentación de CoPark, de principio a fin.
> **Requisito previo:** Conocimiento básico de TypeScript, Express, y Zod.

---

## El Concepto Central: "Una Sola Fuente de Verdad"

En CoPark, **un schema Zod hace tres cosas a la vez:**

```
1. VALIDA datos en runtime    → validateRequest middleware
2. GENERA tipos TypeScript    → z.infer<typeof schema>
3. PRODUCE docs OpenAPI       → .openapi('SchemaName')
```

Esto elimina la desincronización entre código y documentación: **si cambiás el schema, la documentación se actualiza automáticamente.**

---

## La Cadena Completa en 5 Pasos

```mermaid
graph LR
    A["1️⃣ Schema Zod"] --> B["2️⃣ Feature Docs"]
    B --> C["3️⃣ Registry"]
    C --> D["4️⃣ Generator"]
    D --> E["5️⃣ Scalar UI"]

    style A fill:#3b82f6,color:#fff
    style B fill:#6366f1,color:#fff
    style C fill:#8b5cf6,color:#fff
    style D fill:#a855f7,color:#fff
    style E fill:#d946ef,color:#fff
```

---

## Paso 1: El Schema Zod (`.schema.ts`)

**Archivo ejemplo:** [auth.schema.ts](file:///d:/Users/Daniel/01_Projects/copark/copark-api/src/features/auth/auth.schema.ts)

```typescript
// El schema define la forma del dato + validación + metadata OpenAPI
export const loginSchema = z
  .strictObject({
    email: z
      .email({ error: 'Invalid email' })
      .openapi({ description: 'User email address', example: 'user@example.com' }),
    password: z
      .string({ error: 'Required' })
      .openapi({ description: 'Password', example: 'Str0ngP@ssw0rd!' }),
  })
  .openapi('LoginRequest'); // ← Este nombre aparece en components/schemas
```

**Lo que pasa aquí:**

- `.strictObject({})` → Define la forma del dato (como un `interface` pero con validación)
- `.openapi({ description, example })` → Agrega metadata para la documentación
- `.openapi('LoginRequest')` → **Registra el schema como componente reutilizable** en OpenAPI. En la spec generada aparecerá como `$ref: '#/components/schemas/LoginRequest'`

> [!TIP]
> Hay schemas separados para **request** (`loginSchema`) y para **response** (`authResponseSchema`). Nunca uses uno donde va el otro.

---

## Paso 2: Feature Docs (`.docs.ts`)

**Archivo ejemplo:** [auth.docs.ts](file:///d:/Users/Daniel/01_Projects/copark/copark-api/src/features/auth/auth.docs.ts)

```typescript
export function registerAuthDocs(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: 'post', // Método HTTP
    path: '/auth/login', // Ruta exacta (con parámetros como {id})
    tags: ['Auth'], // Agrupación en la UI
    summary: 'Login', // Título corto
    description: 'User authentication.',
    request: {
      body: {
        content: {
          'application/json': {
            schema: loginSchema, // ← Schema Zod de REQUEST
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: authResponseSchema, // ← Schema Zod de RESPONSE
          },
        },
      },
      401: errorResponse('Invalid credentials'), // ← Helper de error
    },
  });
}
```

**Lo que pasa aquí:**

- `registry.registerPath()` registra un endpoint en el catálogo OpenAPI
- Los schemas Zod que pasás se convierten automáticamente a JSON Schema
- `errorResponse()` es un helper que genera `{ error: true, message: string }` con la descripción dada

**Cómo mapear a las rutas reales:** La estructura del path en docs debe coincidir exactamente con cómo Express ve la ruta final:

| Express                                                      | Docs                                              |
| ------------------------------------------------------------ | ------------------------------------------------- |
| `app.use('/auth', authRouter)` + `router.post('/login')`     | `path: '/auth/login'`                             |
| `app.use('/parkings', parkingRouter)` + `router.get('/:id')` | `path: '/parkings/{id}'`                          |
| Router con `mergeParams: true`                               | `path: '/parkings/{parkingId}/bookings/check-in'` |

---

## Paso 3: El Registry

**Archivo:** [openapi.ts](file:///d:/Users/Daniel/01_Projects/copark/copark-api/src/config/openapi.ts)

```typescript
function createRegistry(): OpenAPIRegistry {
  const registry = new OpenAPIRegistry();
  registerGlobalComponents(registry); // bearerAuth
  registerFeatureDocs(registry); // todos los endpoints
  return registry;
}
```

El `OpenAPIRegistry` es un **contenedor que acumula definiciones**. Funciona como una lista donde cada feature agrega sus paths y schemas.

**El orquestador** [register-feature-docs.ts](file:///d:/Users/Daniel/01_Projects/copark/copark-api/src/docs/register-feature-docs.ts) simplemente llama a las 6 funciones:

```typescript
registerAuthDocs(registry);
registerBookingDocs(registry);
registerParkingDocs(registry);
registerReviewDocs(registry);
registerUserDocs(registry);
registerVehicleDocs(registry);
```

---

## Paso 4: El Generador

```typescript
export function generateOpenApiDocument() {
  const registry = createRegistry();
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: '3.1.0',
    info: { title: 'CoPark API', version: '1.0.0', ... },
    servers: [...],
    tags: [...],
  });
}
```

`OpenApiGeneratorV31` toma todas las definiciones acumuladas y **genera un objeto JSON** que cumple con el estándar OpenAPI 3.1. Este objeto contiene:

- `paths` → Todos los endpoints con sus métodos, params, bodies, responses
- `components/schemas` → Todos los schemas nombrados (`LoginRequest`, `AuthResponse`, etc.)
- `components/securitySchemes` → `bearerAuth`
- `info`, `servers`, `tags`

---

## Paso 5: Montaje y UI

**Archivo:** [api-docs.ts](file:///d:/Users/Daniel/01_Projects/copark/copark-api/src/config/api-docs.ts)

```typescript
export function mountApiDocs(app: Express, openApiSpec: object): void {
  // UI interactiva (Scalar)
  app.use(docsUiPath, docsHelmet, apiReference({
    content: openApiSpec,
    theme: 'purple',
    darkMode: true,
  }));

  // JSON crudo
  app.get(docsSpecPath, docsHelmet, (_req, res) => {
    res.json(openApiSpec);
  });

  // Redirects de conveniencia
  app.get('/docs', redirect → '/api-docs/docs');
  app.get('/openapi.json', redirect → '/api-docs/openapi.json');
}
```

**Resultado final:**

- `http://localhost:3000/docs` → UI interactiva con theme purple
- `http://localhost:3000/openapi.json` → JSON spec para herramientas externas

---

## El Requisito Invisible: `extendZodWithOpenApi`

**Archivo:** [openapi-registry.ts](file:///d:/Users/Daniel/01_Projects/copark/copark-api/src/lib/openapi-registry.ts)

```typescript
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);
```

Esta línea **agrega el método `.openapi()` a todos los tipos de Zod**. Sin esto, `z.string().openapi(...)` tiraría error. Se importa como side-effect en `openapi.ts` con:

```typescript
import '../lib/openapi-registry.js';
```

---

## El Helper de Errores

**Archivo:** [error-response.ts](file:///d:/Users/Daniel/01_Projects/copark/copark-api/src/docs/error-response.ts)

```typescript
// Define el schema una vez
export const errorResponseSchema = z
  .strictObject({
    error: z.literal(true),
    message: z.string(),
  })
  .openapi('ErrorResponse');

// Función helper para usar en docs
export function errorResponse(description: string) {
  return {
    description,
    content: { 'application/json': { schema: errorResponseSchema } },
  };
}
```

Se usa así en los docs: `401: errorResponse('Unauthorized')`. Esto genera una referencia `$ref` al schema `ErrorResponse`, sin duplicar la definición.

---

## 🧪 Auto-Evaluación

Respondé estas preguntas para verificar tu comprensión:

1. **¿Por qué los schemas Zod usan `.openapi('NombreDeLSchema')`?**
   - Para registrarlos como componentes reutilizables en `components/schemas` de la spec

2. **¿Qué pasa si creás un endpoint nuevo pero NO agregás su `.docs.ts`?**
   - El endpoint funciona pero no aparece en la documentación

3. **¿Qué pasa si cambiás un campo en el schema Zod?**
   - La validación Y la documentación se actualizan automáticamente (single source of truth)

4. **¿Por qué `api-docs.ts` tiene su propio `helmet()` separado?**
   - Porque Scalar UI necesita cargar scripts/fonts desde CDNs externos, y el helmet global los bloquería

5. **¿Cuál es la diferencia entre `registerSchema` y `authResponseSchema` en auth?**
   - `registerSchema` es para REQUEST (lo que el cliente envía), `authResponseSchema` es para RESPONSE (lo que la API devuelve)

---

## 🛠️ Ejercicio Práctico: Agregar un Nuevo Endpoint

Imaginá que querés documentar `DELETE /parkings/{id}`. Los pasos serían:

**1. Verificar que existe el schema de params** (ya existe: `parkingParamsSchema`)

**2. Agregar al docs en** `parking.docs.ts`:

```typescript
registry.registerPath({
  method: 'delete',
  path: '/parkings/{id}',
  tags: ['Parkings'],
  summary: 'Delete Parking',
  description: 'Delete a parking facility.',
  security: [{ bearerAuth: [] }],
  request: {
    params: parkingParamsSchema,
  },
  responses: {
    204: { description: 'Parking deleted successfully' },
    401: errorResponse('Unauthorized'),
    403: errorResponse('Forbidden - not the owner'),
    404: errorResponse('Parking not found'),
  },
});
```

**3. No hay paso 3.** El orquestador ya importa `registerParkingDocs`, así que aparecerá automáticamente en la UI al reiniciar el server.
