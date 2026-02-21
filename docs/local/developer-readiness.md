# 📌 Developer Readiness Framework — 2026 (Actualizado)

> Guía personalizada para conseguir tu primer trabajo como backend developer en 2026.
> Basada en el mercado laboral real, tendencias de contratación, y tu stack actual (TypeScript + Node.js + Express + Prisma).

---

## 🚨 Realidad del Mercado 2026 — Lo que Nadie te Dice

El mercado para juniors está en su punto más difícil de la historia:

- Las posiciones junior representan solo ~**8%** de todas las ofertas de software
- Las ofertas entry-level bajaron ~**40%** comparado con pre-2022
- Una posición junior puede recibir **miles de aplicantes**
- La IA está automatizando las tareas que antes hacían los juniors

**¿Qué significa esto para vos?**

> No basta con "saber programar". Tenés que demostrar que podés **entrar a un equipo y ser productivo desde el día 1**. Tu proyecto CoPark es tu arma principal para esto.

---

## 🎯 Respuestas Directas a tus Preguntas

### ¿TypeScript o JavaScript para pruebas técnicas?

**TypeScript. Sin dudas.**

| Dato                              | Detalle                                                    |
| --------------------------------- | ---------------------------------------------------------- |
| Adopción en proyectos nuevos 2026 | **>80%** (especialmente SaaS y startups)                   |
| Job postings que lo requieren     | ~**30%** explícitamente, el resto lo pone como "preferred" |
| Node.js como runtime              | #1 en backend, **~48.7%** de developers lo usan            |

- Si dominás TS, ya sabés JS (es un superset)
- Lo contrario NO aplica
- Tu CoPark ya está en TS — practicá con él
- Si te piden JS en una prueba, solo quitás los tipos

### ¿Es normal olvidar sintaxis de cosas que no usás?

**Sí, 100% normal.** Hasta seniors googlean SQL, regex, y sintaxis de lenguajes que no tocan a diario.

Lo que importa en la entrevista:

| ❌ No importa                    | ✅ Sí importa                                                  |
| -------------------------------- | -------------------------------------------------------------- |
| Escribir SQL perfecto de memoria | Saber qué JOIN necesitás y **por qué**                         |
| Recordar toda la API de Prisma   | Entender ORM, N+1, relaciones                                  |
| Conocer cada método de Express   | Explicar el flujo request → middleware → controller → response |
| Memorizar flags de Docker        | Saber **por qué** usás contenedores                            |

**Lo que sí tenés que poder hacer sin googlear:**

- Explicar la arquitectura de tu proyecto
- Describir el flujo de un request de principio a fin
- Justificar por qué elegiste Prisma, Zod, Express, etc.
- Hablar de errores que tuviste y cómo los resolviste

---

## 🧠 1. Mentalidad Profesional — Qué Cambió

En 2026:

- **No evalúan solo código.** Evalúan capacidad de resolver problemas reales
- **IA es una skill evaluada.** No saberla usar es tan malo como no saber Git
- **Ownership > tutorial knowledge.** Quieren ver que sos dueño de tu código
- **Comunicación técnica** es tan importante como el código
- **Comprensión de arquitectura básica** es obligatoria

> 🎯 **Objetivo:** "Puedo construir software confiable con herramientas modernas"
> ❌ **No:** "Puedo escribir código desde cero sin ayuda en un cuarto oscuro"

---

## 🛠️ 2. Fundamentos Técnicos — Lo que Tenés que Poder Hacer Solo

Esto es **obligatorio**. Si no podés hacerlo sin IA, es red flag en entrevista.

### Backend Core ⭐ (Tu punto fuerte — CoPark lo demuestra)

- [x] CRUD completo sin scaffolding
- [x] Arquitectura en capas (Controller → Service → Repository)
- [x] DTOs y transformación de datos
- [x] Validaciones de entrada (Zod)
- [x] Manejo de errores centralizado
- [x] Paginación
- [x] Filtros básicos (query params)
- [x] Relaciones entre entidades

> 💡 **Tu CoPark ya cubre todo esto.** No necesitás otro proyecto de CRUD. Lo que necesitás es poder **explicar cada decisión** y **replicar el flujo sin copiar**.

### Base de Datos 🔶 (Punto a reforzar mecánicamente)

- [x] Modelado relacional correcto ✅ (lo entendés)
- [x] PK / FK bien definidas ✅
- [x] Normalización básica ✅
- [ ] **Queries SQL manuales** ⚠️ — Practicá escribir SELECT, JOIN, WHERE, GROUP BY
- [x] Saber explicar un JOIN ✅ (concepto claro)
- [x] Evitar N+1 conceptualmente ✅

> ⚠️ **Acción:** Dedicá 1-2 sesiones a escribir queries SQL directas. No necesitás ser un DBA, pero sí escribir un `SELECT con JOIN` sin buscar la sintaxis. Usá [SQLBolt](https://sqlbolt.com/) o [SQLZoo](https://sqlzoo.net/) — 2 horas y estás.

### API Design ⭐ (Otro punto fuerte)

- [x] REST coherente
- [x] Status codes correctos
- [x] Idempotencia
- [x] Manejo de errores estructurado
- [x] OpenAPI/Swagger documentado

---

## 🔐 3. Auth & Seguridad — Lo que te Van a Preguntar Sí o Sí

Esto es lo más preguntado en entrevistas backend 2026:

### Obligatorio saber explicar:

- **JWT:** Qué es, cómo funciona, access vs refresh token, dónde se guarda
- **Hashing:** Por qué bcrypt y no SHA256. Qué es un salt
- **Middleware de auth:** Cómo proteger rutas. Tu CoPark lo tiene
- **CORS:** Qué es y por qué existe
- **Helmet:** Qué headers agrega y por qué importan

### Preguntas típicas de entrevista:

1. _"¿Qué pasa si alguien roba un JWT?"_
2. _"¿Por qué no guardar el JWT en localStorage?"_
3. _"¿Cómo invalidás un token antes de que expire?"_
4. _"¿Qué diferencia hay entre autenticación y autorización?"_

> 💡 **Tu CoPark tiene auth con JWT + bcrypt + middleware.** Repasá el flujo completo y podé explicarlo en voz alta.

---

## 🧩 4. Código Limpio — Lo que MÁS Miran en Entrevistas

No solo que funcione. Que se **lea bien**:

- Nombres claros (no abreviaciones crípticas)
- Métodos pequeños y enfocados
- Separación de responsabilidades
- **Cero** lógica de negocio en controllers
- No mezclar infraestructura con dominio
- Evitar "God classes"
- Código legible > código clever

> 💡 Tu CoPark sigue este patrón. **Eso es tu diferenciador.** Muchos juniors tiran todo en el controller.

---

## 🧪 5. Testing — Lo Justo y Necesario

No buscan 100% coverage. Buscan **criterio**.

### Lo que tenés que saber:

- **Qué testear:** Lógica de negocio en servicios
- **Qué NO testear:** Controllers directamente, getters/setters triviales
- **Cómo:** Tests unitarios con Vitest o Jest
- **Mocking:** Mockear el repositorio/DB para testear servicios aislados
- **Casos:** Happy path + 2-3 error cases

### Práctica concreta:

```
Escribí tests para tu BookingService:
- checkIn con vehículo existente → éxito
- checkIn con datos inválidos → error
- checkOut exitoso
- checkOut de booking que no existe → error
```

> ⚠️ **Acción:** Si tu CoPark no tiene tests, agregá al menos 5-10 tests de servicios. Es lo que más impresiona para un junior.

---

## 🧰 6. Uso Profesional de IA — Nueva Skill Evaluada

Hoy **se evalúa activamente** cómo usás IA:

### ✅ Buen uso (lo que quieren ver):

- Usarla como asistente, no como reemplazo
- Validar y refactorizar lo que genera
- Detectar errores conceptuales en sus respuestas
- Iterar con prompts claros y específicos
- Tener configuración de IA en tu proyecto (CLAUDE.md, rules, etc.)

### ❌ Mal uso (red flag inmediata):

- "IA, haceme todo y yo copio y pego"
- No poder explicar código que "escribiste"
- No detectar bugs en código generado

> 💡 Vos ya tenés `CLAUDE.md` y `RULES.md` en CoPark. **Eso demuestra uso profesional de IA.** Pocos juniors lo hacen.

---

## 🏗️ 7. Arquitectura — Nivel Junior Real

No quieren un arquitecto. Quieren que entiendas:

- **Por qué separar capas** (y poder explicarlo)
- **Qué pasa si el sistema crece** (escalabilidad conceptual)
- **Qué es stateless** y por qué importa
- **Dónde iría un cache** (Redis, conceptualmente)
- **Diferencia entre lógica de negocio y técnica**
- **Qué es un middleware** y cuándo usarlo

### Preguntas que te pueden hacer:

1. _"¿Por qué separaste service de repository?"_
2. _"¿Qué pasaría si tu API recibe 10.000 requests por segundo?"_
3. _"¿Dónde pondrías cache en tu proyecto?"_

---

## 🔍 8. Debugging — Skill MUY Evaluada

Muchos candidatos fallan acá. Te pueden dar código roto y pedir que lo arregles.

### Lo que tenés que poder hacer:

- Leer un error **sin entrar en pánico**
- Seguir el flujo del request paso a paso
- Identificar **dónde** se rompe algo
- Usar `console.log` / logs inteligentemente
- **Pensar antes de tocar código**
- Leer stack traces de Node.js

> � **Práctica:** Rompé algo en tu CoPark a propósito y arreglalo sin IA. Hacelo varias veces. Esto construye músculo.

---

## 🐳 9. DevOps Básico — Lo Mínimo que Piden

No necesitás ser DevOps, pero sí saber:

| Tema                     | Nivel requerido                                                    |
| ------------------------ | ------------------------------------------------------------------ |
| **Docker**               | Saber qué es, leer un Dockerfile, correr `docker-compose up`       |
| **Docker Compose**       | Entender tu `docker-compose.yml` de CoPark (PostgreSQL)            |
| **Variables de entorno** | `.env`, por qué no se commitean, cómo se usan                      |
| **Git**                  | Branches, commits limpios, pull requests. **Esto es obligatorio.** |
| **CI/CD**                | Saber qué es conceptualmente. No necesitás configurarlo            |

> ⚠️ **Acción:** Asegurate de poder explicar tu `docker-compose.yml` línea por línea.

---

## 📄 10. Documentación — Lo que Demuestra Profesionalismo

Tu proyecto debe tener:

### README serio ✅ (ya lo tenés)

- Qué hace el proyecto
- Cómo levantarlo (`docker-compose up`, `pnpm dev`)
- Stack tecnológico
- Decisiones técnicas clave
- Qué mejorarías si fuera producción real

### Bonus que impresiona:

- **OpenAPI/Swagger** funcionando ✅ (ya lo tenés)
- Diagrama de la base de datos
- Sección "Trade-offs" en el README

---

## 🗣️ 11. Inglés Técnico Funcional

No académico. No perfecto. **Funcional.**

Tenés que poder:

- **Explicar decisiones:** _"I separated the service layer to keep business logic isolated from HTTP concerns."_
- **Describir un problema:** _"The endpoint was returning 500 because the validation middleware wasn't catching invalid UUIDs."_
- **Leer documentación** sin traductor
- **Entender errores** en inglés
- **Comunicarte en daily standups** básicos

**Nivel real esperado: B1 funcional**

> ⚠️ **Acción:** Practicá explicando tu proyecto en inglés en voz alta. 5 minutos por día.

---

## 📋 12. Qué Esperar en una Prueba Técnica

### Formato típico 2026:

1. **Live coding (1-2 horas):** Te dan un problema y lo resolvés compartiendo pantalla
2. **Take-home project (3-8 horas):** Construir una mini API con requerimientos específicos
3. **Code review:** Te muestran código y pedís que lo mejores o encontrés bugs
4. **System design light:** Diseñar la arquitectura de algo simple (ej: un sistema de reservas)

### Lo que van a evaluar:

| Aspecto                         | Peso |
| ------------------------------- | ---- |
| ¿Funciona?                      | 25%  |
| ¿Está bien estructurado?        | 30%  |
| ¿Maneja errores correctamente?  | 20%  |
| ¿Puede explicar sus decisiones? | 25%  |

### Prueba técnica típica de ejemplo:

> _"Construí una API REST para un sistema de gestión de tareas (TODO). Debe tener: CRUD de tareas, autenticación JWT, validaciones, paginación, y al menos 3 tests unitarios. Tenés 5 horas."_

**Si podés hacer eso con los ojos semicerrados, estás listo.**

---

## 🧮 13. Lo que YA NO es Prioridad (No Gastés Tiempo en Esto)

| ❌ Ya no importa tanto                    | ✅ En su lugar, enfocate en           |
| ----------------------------------------- | ------------------------------------- |
| LeetCode hardcore (arrays, trees, graphs) | Resolver problemas de negocio reales  |
| Memorizar algoritmos complejos            | Saber cuándo usar un Map vs Array     |
| Patrones de diseño recitados              | Saber aplicar Repository y Middleware |
| Saber 10 frameworks                       | Dominar 1 stack completo (el tuyo)    |
| Optimización prematura                    | Código claro que funciona             |
| Frontend avanzado                         | Tu backend sólido es tu diferenciador |

---

## ✅ 14. Tu Plan de Acción Concreto

### Semana 1-2: Reforzar Puntos Débiles

- [ ] Practicar SQL manual — [SQLBolt](https://sqlbolt.com/) (2-3 horas total)
- [ ] Agregar 5-10 tests unitarios a CoPark
- [ ] Repasar el flujo completo de auth JWT (explicarlo en voz alta)

### Semana 3-4: Simular Pruebas Técnicas

- [ ] Construir un CRUD con auth desde cero **sin copiar código** — cronometrar
- [ ] Repetir hasta hacerlo en < 2 horas
- [ ] Practicar explicar tu proyecto en inglés (5 min/día)

### Semana 5-6: Preparar Entrevistas

- [ ] Preparar respuestas a las preguntas típicas de la sección 3 y 7
- [ ] Hacer un "mock interview" con alguien o grabarte explicando CoPark
- [ ] Revisar tu README y GitHub profile
- [ ] Tener CoPark **corriendo y demostrable** en cualquier momento

### Continuo:

- [ ] Aplicar a posiciones — **no esperes a sentirte "listo"**
- [ ] Cada rechazo te da info sobre qué reforzar
- [ ] Mantené CoPark actualizado como tu portafolio vivo

---

## ✅ 15. Qué Define a un Buen Junior en 2026

Un buen junior es alguien que:

- ✔ Puede construir algo **mantenible**
- ✔ Puede aprender dentro de un equipo
- ✔ Usa IA **sin depender** de ella
- ✔ Pregunta bien (no preguntas vagas)
- ✔ No rompe cosas sin entender
- ✔ Puede **explicar** lo que hizo y **por qué**
- ✔ Tiene criterio técnico básico
- ✔ Demuestra ownership de su proyecto

---

## 📍 Veredicto Final sobre tu Documento Original

### Lo que estaba bien ✅

- La estructura general y las categorías estaban correctas
- La sección de mentalidad profesional sigue siendo válida
- El enfoque en código limpio y debugging

### Lo que le faltaba o cambié ⚠️

- **Datos concretos del mercado** (ahora incluidos)
- **Auth & Seguridad** como sección propia (es lo más preguntado)
- **DevOps básico** (Docker, Git, CI/CD conceptual)
- **Qué esperar en una prueba técnica** (formatos reales)
- **Plan de acción concreto** con semanas
- **Personalización a tu stack** (CoPark, TS, Express, Prisma)
- **Respuestas directas a tus preguntas** (TS vs JS, olvidar sintaxis)

---

> 💡 **Recordá:** No necesitás ser perfecto. Necesitás ser **suficientemente bueno para ser productivo en un equipo** y **demostrar que podés aprender rápido.** Tu CoPark ya te pone por delante del 80% de los juniors que solo tienen proyectos de tutorial.
