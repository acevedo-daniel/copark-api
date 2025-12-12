## 1. Descripción General

**CoPark** es una plataforma de gestión de alquiler de estacionamientos diseñada bajo una arquitectura serverless. El sistema expone una API RESTful construida sobre **Firebase Cloud Functions** utilizando **Express.js**. Su objetivo es conectar propietarios de cocheras con conductores, gestionando usuarios, vehículos, publicaciones, reservas y reseñas.

El proyecto se estructura en dos fases:
1.  **v1 (Entrega Académica):** MVP funcional con 17 endpoints y lógica de negocio core.
2.  **v2 (Portfolio Ready):** Visión extendida con características avanzadas para un producto de nivel profesional.

## 2. Arquitectura

El proyecto implementa un patrón de diseño en **tres capas** para garantizar el desacoplamiento y la mantenibilidad.

`Request` → `Controller` → `Service` → `Repository` → `Database`

### Componentes
- **Controllers:** Capa de entrada. Valida esquemas (Joi), extrae datos y delega al servicio.
- **Services:** Lógica de negocio pura. Agnóstico a la base de datos.
- **Repositories:** Acceso a datos (Firebase RTDB). Único punto de contacto con la BD.
- **Middlewares:** Autenticación (JWT), validación y manejo de errores centralizado.

## 3. Tecnologías

- **Core:** Node.js (v22), Express.js.
- **Cloud:** Firebase Cloud Functions (v2), Firebase Authentication.
- **Database:** Firebase Realtime Database.
- **Calidad:** ESLint, Joi (Validación), Helmet (Seguridad).

## 4. Alcance v1 (Actual)

La versión actual implementa el flujo completo de alquiler con **17 Endpoints** y **2 Cloud Functions**.

### API Endpoints

#### Users
- `GET /users/me`: Perfil propio.
- `PATCH /users/me`: Actualizar perfil.
- `GET /users/:id`: Perfil público.

#### Vehicles
- `POST /vehicles`: Registrar vehículo.
- `GET /vehicles`: Listar mis vehículos.
- `DELETE /vehicles/:id`: Eliminar vehículo.

#### Parkings
- `POST /parkings`: Publicar cochera.
- `GET /parkings`: Listar todas (filtros básicos).
- `GET /parkings/me`: Listar mis cocheras (Dueño).
- `GET /parkings/:id`: Detalle de cochera.
- `PATCH /parkings/:id`: Editar cochera.

#### Bookings
- `POST /bookings`: Crear reserva.
- `GET /bookings`: Historial de reservas.
- `GET /bookings/:id`: Detalle de reserva.
- `PATCH /bookings/:id/cancel`: Cancelar reserva.

#### Reviews
- `POST /reviews`: Crear reseña.
- `GET /reviews/parking/:parkingId`: Ver reseñas de una cochera.

### Background Triggers
- **`onBookingCreate`:** Notificación simulada al dueño tras nueva reserva.
- **`onReviewCreate`:** Recálculo automático del rating promedio de la cochera.

## 5. Roadmap v2 (Portfolio Vision)

Para llevar este proyecto a un nivel profesional de portfolio, se planean las siguientes mejoras:

### Mejoras Técnicas
- **Testing:** Implementación de Tests Unitarios (Jest) y de Integración.
- **CI/CD:** Pipelines de despliegue automático con GitHub Actions.
- **TypeScript:** Migración gradual para mayor robustez de tipos.

### Nuevas Funcionalidades
- **Pagos Reales:** Integración con Stripe/MercadoPago.
- **Geolocalización:** Búsqueda de cocheras por cercanía (GeoFire).
- **Chat:** Comunicación en tiempo real entre conductor y dueño.
- **Admin Panel:** Dashboard para moderación de contenido.

## 6. Estructura de Carpetas

```text
functions/
├── server.js                 # Punto de entrada
├── .env                      # Variables de entorno
├── src/
│   ├── controllers/          # Controladores (Request/Response)
│   ├── services/             # Lógica de Negocio
│   ├── repositories/         # Acceso a Datos (RTDB)
│   ├── routes/               # Definición de rutas Express
│   ├── schemas/              # Esquemas de validación Joi
│   ├── triggers/             # Cloud Functions (Background)
│   └── utils/                # Utilidades compartidas
└── middlewares/              # Auth, Error Handler, Logger
```
