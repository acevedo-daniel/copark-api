# System Architecture

## 1. Overview
**CoPark** is a parking rental management platform designed to connect parking owners with drivers. The system exposes a RESTful API built with **Express.js** and designed to be scalable and maintainable.

## 2. Architecture Pattern
The project implements a **Layered Architecture** (Controller-Service-Repository) to ensure separation of concerns and maintainability.

`Request` → `Router` → `Controller` → `Service` → `Repository` → `Database`

### Components
- **Controllers:** Entry point. Handles HTTP requests/responses, validates schemas (Joi), and delegates to services.
- **Services:** Pure business logice. Database agnostic.
- **Repositories:** Data Access Layer. Abstract the database implementation (PostgreSQL/Prisma).
- **Middlewares:** Cross-cutting concerns like Authentication (JWT), Error Handling, and Logging.

## 3. Technology Stack
- **Runtime:** Node.js (v22+)
- **Framework:** Express.js (v5)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (using `jose` library) + Argon2 (hashing)
- **Quality:** ESLint, Joi (Validation), Helmet (Security).

## 4. Folder Structure (Clean Architecture)
```text
src/
├── controllers/          # Request Handlers
├── services/             # Business Logic
├── repositories/         # Data Access (Prisma)
├── routes/               # Route Definitions
├── middlewares/          # Auth, ErrorHandlers
├── schemas/              # Joi Validation Schemas
└── utils/                # Shared Utilities (JWT, etc.)
```

## 5. Security Features
- **Stateless Auth:** JWT-based authentication.
- **Secure Headers:** Implemented via `helmet`.
- **CORS:** Configured for controlled access.
- **Input Validation:** Strict request validation using `Joi`.
- **Password Hashing:** Industry-standard Argon2 algorithm.
