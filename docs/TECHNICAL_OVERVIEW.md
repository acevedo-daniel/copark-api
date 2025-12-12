# CoPark API - Technical Overview 🏗️

This document details the internal architecture and design decisions of the CoPark API.

## 1. Architecture Pattern
The project strictly follows the **Controller-Service-Repository (CSR)** pattern:

*   **Controllers (`src/controllers`)**: Handle HTTP requests/responses, extract body/params, and call Services. **No business logic here.**
*   **Services (`src/services`)**: Contain the business logic (calculations, validations beyond syntax, rules). They interact with Repositories.
*   **Repositories (`src/repositories`)**: Encapsulate DB access using Prisma. They are the only layer touching the DB.

## 2. Database Schema (Prisma)
The core models are:

*   **User**: Stores auth info (`passwordHash`) and profile (`photoUrl`, `phone`).
*   **Parking**: Represents a parking spot. Contains `lat`, `lng` for maps and `image` for UI cards.
    *   *Relation*: Belongs to a **User** (Owner).
*   **Vehicle**: Cars/Motorcycles registered by drivers.
*   **Booking**: The transaction record.
    *   *Status Enum*: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`.
    *   *Relation*: Links `Driver`, `Parking`, and `Vehicle`.
*   **Review**: Ratings (1-5) left by drivers.

## 3. Data Seeding
We use a custom seed script (`prisma/seed.js`) that:
1.  Cleans the DB (`deleteMany`).
2.  Creates an Admin/Owner user.
3.  Creates 3 realistic Parking spots in Buenos Aires with **Unsplash/Pexels Images** for testing the UI.

## 4. Security Measures
*   **Helmet**: Sets secure HTTP headers.
*   **CORS**: Configured to accept requests from frontend origins.
*   **Argon2**: Industry-standard hashing for passwords.
*   **JWT**: Stateless authentication. Token expiration should be handled by client refresh logic (future improvement).
