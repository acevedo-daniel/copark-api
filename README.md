# CoPark API

**CoPark** is a robust RESTful API designed to manage parking rentals, connecting parking owners with drivers in an efficient and scalable way. Built with modern technologies, it ensures secure data handling, real-time availability, and a seamless user experience.

## 🚀 Key Features

*   **User Management**: Secure registration and authentication for drivers and parking owners using JWT.
*   **Parking Operations**: Full CRUD capabilities for parking listings, including geolocation and availability management.
*   **Vehicle Management**: Drivers can register and manage multiple vehicles.
*   **Booking System**: efficient booking flow with status tracking (Pending, Confirmed, Cancelled, Completed).
*   **Review System**: Feedback loop with ratings and comments to ensure service quality.
*   **Security**: Implements best practices including Helmet for headers, CORS handling, and strict input validation.

## 🛠 Tech Stack

*   **Runtime**: [Node.js](https://nodejs.org/) (v22)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Authentication**: JWT (JSON Web Tokens) with Argon2 hashing
*   **Validation**: Joi
*   **Security**: Helmet, CORS

## 📂 Project Structure

The project follows a clean **Controller-Service-Repository** architecture to separate concerns and improve maintainability:

```
src/
├── controllers/  # Request handling and response formatting
├── services/     # Business logic and domain rules
├── repositories/ # Data access layer (Prisma)
├── routes/       # API route definitions
├── schemas/      # Joi validation schemas
├── middlewares/  # Auth, logging, and error handling
└── utils/        # Helper functions
```

## ⚡ Getting Started

### Prerequisites

*   Node.js v18+
*   PostgreSQL
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/copark-api.git
    cd copark-api
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    PORT=3001
    DATABASE_URL="postgresql://user:password@localhost:5432/copark_db?schema=public"
    JWT_SECRET="your_secure_jwt_secret"
    ```

4.  **Database Migration**
    Apply the Prisma schema to your database:
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Start the Server**
    ```bash
    # Development mode
    npm run dev
    
    # Production
    npm start
    ```

## 📝 API Documentation

Authentication is required for most endpoints via Bearer Token.

### Main Endpoints

*   **Auth**: `POST /auth/login`, `POST /auth/register`
*   **Parkings**: `GET /parkings`, `POST /parkings`, `GET /parkings/:id`
*   **Bookings**: `POST /bookings`, `GET /bookings/user/:userId`
*   **Vehicles**: `POST /vehicles`, `GET /vehicles/user/:userId`

---
*Developed by Daniel. Open for collaboration and improvements.*
