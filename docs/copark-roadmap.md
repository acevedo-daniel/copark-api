## Fase 0 – Bootstrap de repositorios (sin monorepo)

- Crear **dos repos separados**: `copark-api/` (backend) y `copark-mobile/` (Expo/React Native).
    
- En `copark-api/`: configurar Git + `.gitignore` Node; agregar `README.md`.
    
- En `copark-mobile/`: configurar Git + `.gitignore` Expo; agregar `README.md`.
    
- Documentar estructura inicial y comandos básicos por repo (`npm i`, `npm run dev` / `firebase emulators:start`).
    
- Testear: ejecutar `npm run lint` (si aplica) y confirmar instalación limpia en **cada** repo.
    

---

## Fase 1 – Setup de Backend Serverless (Firebase Functions + Express)

- Inicializar Firebase en `copark-api/functions` con Functions (Node), Firestore y Realtime Database.
    
- Crear `index.js` para montar Express y exportar functions HTTP.
    
- Instalar dependencias: `express`, `firebase-admin`, `dotenv`, `cors`, `express-rate-limit`, `zod`, `eslint`, `prettier`.
    
- Crear `.env.example` con claves requeridas; documentar variables.
    
- Testear: `firebase emulators:start` y `curl` a `/health`.
    

---

## Fase 2 – Esqueleto de arquitectura en 3 capas

- Crear carpetas: `modules/`, `src/services/`, `src/repositories/`, `src/utils/`.
    
- Añadir plantillas de archivos: `auth.middleware.js`, `error.middleware.js`, `validation.js`, `firebase.js`, `httpstatuscode.js`.
    
- Definir routers mínimos (`users.js`, `parkings.js`, `bookings.js`) con handlers vacíos.
    
- Documentar diagrama de flujo request→modules→services→repositories→Firebase.
    
- Testear: rutas dummy responden 200 con JSON.
    

---

## Fase 3 – Modelado de datos y reglas (Firestore + RTDB)

- Documentar modelos `User`, `Parking`, `Booking` con tipos y claves primarias/relaciones.
    
- Crear validaciones Zod por entidad y mapeo request→modelo.
    
- Implementar repositorios: `users.repository.js`, `parkings.repository.js`, `bookings.repository.js` (CRUD base).
    
- Definir colecciones/paths y referencias (Firestore para persistencia; RTDB para estado dinámico si se requiere).
    
- Testear: operaciones CRUD en emulador con datos de ejemplo.
    

---

## Fase 4 – Middlewares transversales

- Implementar `Auth` (verificación de JWT Firebase en backend).
    
- Implementar `Validation` (Zod por ruta).
    
- Configurar `Rate limit` y `CORS` por origen.
    
- Implementar `Error Handler` unificado con códigos estándar.
    
- Testear: rutas públicas vs protegidas; respuestas de error consistentes.
    

---

## Fase 5 – Módulo de Usuarios (OWNER/DRIVER)

- Rutas: `GET /me`, `PUT /me`, `GET /users/:uid`.
    
- Servicios: alta/actualización de perfil con `role`, `phone`.
    
- Repositorio: lectura/escritura por `uid`.
    
- Documentar ejemplos de request/response.
    
- Testear: flujo sign-in client→token→`/me`.
    

---

## Fase 6 – Módulo de Parkings

- Rutas: `POST /parkings`, `GET /parkings`, `GET /parkings/:id`, `PUT /parkings/:id`, `DELETE /parkings/:id`.
    
- Servicios: crear/actualizar con `lat`, `lng`, `pricePerHour`, `totalSpaces` y sync de `availableSpaces`.
    
- Repositorio: índices por `ownerId` y consultas geográficas (búsqueda simple por bounding box en MVP).
    
- Testear: creación, listado filtrado por proximidad (aprox.), borrado idempotente.
    

---

## Fase 7 – Módulo de Reservas (flujo MVP)

- Rutas: `POST /bookings`, `GET /bookings/:id`, `GET /bookings?driverId=`, `PATCH /bookings/:id/end`, `PATCH /bookings/:id/cancel`.
    
- Servicio `createBooking`: validar disponibilidad, crear reserva, decrementar `availableSpaces`.
    
- Servicio `endBooking`: calcular costo por hora, liberar espacio, setear `status`.
    
- Repositorio: transacciones/commit para consistencia en `availableSpaces`.
    
- Testear: casos concurrencia básica en emulador; simulación de pago (placeholder).
    

---

## Fase 8 – Endpoints de soporte (salud, métricas y semillas)

- `GET /health`, `GET /version`.
    
- Script de semillas (usuarios/parkings demo).
    
- Hook de logging simple en middleware (tiempos, ruta, user).
    
- Testear: integridad de datos sembrados y respuestas 200.
    

---

## Fase 9 – Seguridad y hardening

- Enforzar verificación estricta de JWT; rotación/uso correcto de `.env`.
    
- Sanitización de inputs; límites de payload; headers de seguridad básicos.
    
- Revisar exposición de datos (no enviar sensibles al client).
    
- Testear: rate-limit bajo estrés; rutas maliciosas; validaciones Zod.
    

---

## Fase 10 – Observabilidad local y DX

- Colección de logs en backend; formateo legible.
    
- Scripts en `copark-api`: `dev`, `lint`, `test` (si aplica).
    
- Colecciones **Postman/Thunder** con ejemplos por módulo.
    
- Testear: requests reproducibles con variables de entorno.
    

---

## Fase 11 – Criterios de MVP y corte (V1)

- Verificar alcance: login/roles, publicación de cocheras, reserva básica, precio por hora, simulación de pago.
    
- Confirmar exclusiones: selección de lugar por butacas, pagos reales, reviews/chat, IoT.
    
- Testear: recorrido end-to-end DRIVER y OWNER.
    

---

## Fase 12 – Endurecimiento final y preparación de release

- Auditoría de seguridad: CORS, rate-limit, validaciones, manejo de errores.
    
- Revisar `.env` segregado y rotación; limpiar datos demo.
    
- Documentar y ejecutar **deploy** de Functions + reglas de Firestore/RTDB.
    
- Smoke tests post-deploy (endpoints críticos).
    

---

## Fase 13 – Documentación y manuales

- `README` de **copark-api** con setup, scripts, env y troubleshooting.
    
- Especificaciones de endpoints (tabla rutas, parámetros, ejemplos).
    
- Notas de arquitectura (3 capas, decisiones clave, trade-offs).
    
- Guía de desarrollo local (emuladores, Postman, cuentas de prueba).
    

---

## 🟩 **API MVP finalizado y listo para presentación**

Backend funcional, probado y documentado (Postman + emuladores).  
Se puede presentar el MVP completo sin necesidad de app móvil.

---

## Fase 14 – App móvil (Expo + RN) — repo `copark-mobile/`

- Inicializar `copark-mobile` con Expo y TypeScript opcional.
    
- Instalar `firebase` (SDK client), `expo-location`, `react-native-maps`, `react-navigation`.
    
- Configurar Firebase Auth (email/password o proveedor elegido).
    
- Testear: login/logout + persistencia de sesión.
    

---

## Fase 15 – Integración Auth + API (mobile)

- Implementar fetcher con `Authorization: Bearer <idToken>`.
    
- Guardas de navegación por `role` (OWNER/DRIVER).
    
- Pantallas: Onboarding, Login, Perfil.
    
- Testear: acceso a rutas protegidas; `/me` sincroniza perfil.
    

---

## Fase 16 – Mapa, geolocalización y listado (mobile)

- Pedir permisos de ubicación; obtener `coords`.
    
- Renderizar mapa con `react-native-maps`; marcadores de parkings desde la API.
    
- Listado cercano (orden por distancia simple).
    
- Testear: render en Android/iOS, centrar mapa, selección de parking.
    

---

## Fase 17 – Flujo de reserva en la app (mobile)

- Pantallas: Detalle de Parking → Confirmación → Activa.
    
- Acciones: `POST /bookings`, vista de tiempo/costo estimado, `end/cancel`.
    
- Estado: indicador de disponibilidad en tiempo real (opcional RTDB para MVP).
    
- Testear: reserva completa; contador; finalización con costo.
    

---

## Fase 18 – Backlog técnico post-MVP (exploratorio)

- Búsqueda geoespacial mejorada (Geoqueries/algoritmos).
    
- Pagos reales (Mercado Pago) y conciliación.
    
- Métricas/monitorización (trazabilidad básica).
    
- Hardening de concurrencia en `availableSpaces` y pruebas de carga.