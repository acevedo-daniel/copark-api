# CoPark API Technical Reference

## 1. Visión General
**CoPark** es una plataforma de gestión de alquiler de estacionamientos que conecta a propietarios de cocheras con conductores. La API RESTful permite la gestión completa de usuarios, vehículos, publicaciones de estacionamiento, reservas y reseñas.

## 2. Arquitectura del Sistema
El backend está construido sobre **Firebase Cloud Functions** utilizando **Express.js** como framework web. Se sigue un patrón de arquitectura en capas para asegurar la separación de responsabilidades:

1.  **Router Layer (`/routes`)**: Define los endpoints y asigna middlewares (auth, validación).
2.  **Controller Layer (`/controllers`)**: Maneja la entrada/salida HTTP, valida datos y llama a los servicios.
3.  **Service Layer (`/services`)**: Contiene la lógica de negocio pura.
4.  **Repository Layer (`/repositories`)**: Abstrae el acceso a la base de datos (Firebase Realtime Database).

## 3. Stack Tecnológico
-   **Runtime**: Node.js v22
-   **Framework**: Express.js v5
-   **Cloud Platform**: Google Cloud / Firebase
-   **Compute**: Firebase Cloud Functions (Gen 2)
-   **Database**: Firebase Realtime Database
-   **Authentication**: Firebase Authentication
-   **Validation**: Joi
-   **Security**: Helmet, CORS
-   **Logging**: Custom Middleware

## 4. Seguridad y Autenticación
La API utiliza **Firebase Authentication** para la gestión de identidad.
-   **Método**: Bearer Token en el header `Authorization`.
-   **Formato**: `Authorization: Bearer <FIREBASE_ID_TOKEN>`
-   **Middleware**: `authorize` verifica el token y adjunta el usuario al request (`req.user`).

## 5. Modelos de Datos (Schemas)

### User
-   `uid` (string): ID único de Firebase.
-   `email` (string): Correo electrónico.
-   `name` (string): Nombre (min 2, max 50).
-   `lastName` (string): Apellido (min 2, max 50).
-   `phone` (string): Teléfono (numérico, 8-15 dígitos).
-   `photoUrl` (string, opcional): URL de la foto de perfil.
-   `role` (string): `DRIVER` | `OWNER` (implícito por uso).

### Vehicle
-   `id` (string): UUID.
-   `userId` (string): Dueño del vehículo.
-   `brand` (string): Marca.
-   `model` (string): Modelo.
-   `plate` (string): Patente (6-7 caracteres, mayúsculas).
-   `type` (string): `CAR` | `MOTORCYCLE` | `BUS` | `TRUCK`.

### Parking
-   `id` (string): UUID.
-   `userId` (string): Dueño de la cochera.
-   `title` (string): Título de la publicación (5-50 caracteres).
-   `address` (string): Dirección física.
-   `pricePerHour` (number): Precio por hora (>= 0).
-   `totalSpaces` (number): Espacios totales (>= 1).
-   `lat` (number): Latitud (-90 a 90).
-   `lng` (number): Longitud (-180 a 100).
-   `rating` (number): Promedio de calificaciones.
-   `reviewCount` (number): Cantidad de reseñas.

### Booking
-   `id` (string): UUID.
-   `parkingId` (string): ID de la cochera.
-   `vehicleId` (string): ID del vehículo.
-   `userId` (string): Usuario que reserva.
-   `startTime` (ISO Date): Inicio de reserva (futuro).
-   `endTime` (ISO Date): Fin de reserva (posterior a inicio).
-   `status` (string): `ACTIVE` | `CANCELLED` | `COMPLETED`.
-   `totalPrice` (number): Precio calculado.

### Review
-   `id` (string): UUID.
-   `parkingId` (string): ID de la cochera evaluada.
-   `userId` (string): Autor de la reseña.
-   `rating` (number): Puntuación (1-5).
-   `comment` (string): Comentario (5-200 caracteres).
-   `createdAt` (ISO Date): Fecha de creación.

---

## 6. Referencia de API

### Usuarios (`/users`)

#### Obtener mi perfil
-   **GET** `/users/me`
-   **Auth**: Requerido
-   **Descripción**: Retorna la información del usuario autenticado.

#### Actualizar mi perfil
-   **PATCH** `/users/me`
-   **Auth**: Requerido
-   **Body**:
    ```json
    {
      "name": "Daniel",       // min 2, max 50
      "lastName": "Acevedo",  // min 2, max 50
      "phone": "123456789",   // numérico, 8-15 chars
      "photoUrl": "https://..."
    }
    ```
-   **Descripción**: Actualiza parcialmente los datos del usuario. Al menos un campo es requerido.

#### Obtener perfil público
-   **GET** `/users/:id`
-   **Auth**: Requerido
-   **Descripción**: Obtiene información básica de otro usuario.

---

### Vehículos (`/vehicles`)

#### Registrar vehículo
-   **POST** `/vehicles`
-   **Auth**: Requerido
-   **Body**:
    ```json
    {
      "brand": "Toyota",
      "model": "Corolla",
      "plate": "ABC1234",     // 6-7 chars, mayúsculas
      "type": "CAR"           // CAR, MOTORCYCLE, BUS, TRUCK
    }
    ```

#### Listar mis vehículos
-   **GET** `/vehicles`
-   **Auth**: Requerido
-   **Descripción**: Lista todos los vehículos registrados por el usuario actual.

#### Eliminar vehículo
-   **DELETE** `/vehicles/:id`
-   **Auth**: Requerido
-   **Descripción**: Elimina un vehículo por su ID. Solo el dueño puede eliminarlo.

---

### Cocheras (`/parkings`)

#### Publicar cochera
-   **POST** `/parkings`
-   **Auth**: Requerido
-   **Body**:
    ```json
    {
      "title": "Cochera Centro",
      "address": "Av. Principal 123",
      "pricePerHour": 500,
      "totalSpaces": 2,
      "lat": -34.6037,
      "lng": -58.3816
    }
    ```

#### Listar todas las cocheras
-   **GET** `/parkings`
-   **Auth**: Opcional (Público)
-   **Descripción**: Retorna todas las cocheras disponibles.

#### Listar mis cocheras
-   **GET** `/parkings/me`
-   **Auth**: Requerido
-   **Descripción**: Retorna las cocheras publicadas por el usuario autenticado.

#### Obtener detalle de cochera
-   **GET** `/parkings/:id`
-   **Auth**: Opcional (Público)
-   **Descripción**: Retorna información detallada de una cochera específica.

#### Actualizar cochera
-   **PATCH** `/parkings/:id`
-   **Auth**: Requerido (Solo dueño)
-   **Body**: (Cualquier campo de publicación es opcional)
    ```json
    {
      "pricePerHour": 600
    }
    ```

---

### Reservas (`/bookings`)

#### Crear reserva
-   **POST** `/bookings`
-   **Auth**: Requerido
-   **Body**:
    ```json
    {
      "parkingId": "uuid-parking",
      "vehicleId": "uuid-vehicle",
      "startTime": "2023-12-25T10:00:00Z", // ISO 8601, futuro
      "endTime": "2023-12-25T12:00:00Z"    // ISO 8601, > startTime
    }
    ```

#### Listar mis reservas
-   **GET** `/bookings`
-   **Auth**: Requerido
-   **Descripción**: Retorna el historial de reservas del usuario (como conductor).

#### Cancelar reserva
-   **PATCH** `/bookings/:id/cancel`
-   **Auth**: Requerido
-   **Descripción**: Cancela una reserva activa.

---

### Reseñas (`/reviews`)

#### Crear reseña
-   **POST** `/reviews`
-   **Auth**: Requerido
-   **Body**:
    ```json
    {
      "parkingId": "uuid-parking",
      "rating": 5,            // 1-5 entero
      "comment": "Excelente!" // 5-200 chars
    }
    ```

#### Listar reseñas de una cochera
-   **GET** `/reviews/parking/:parkingId`
-   **Auth**: Opcional
-   **Descripción**: Retorna todas las reseñas asociadas a una cochera.
