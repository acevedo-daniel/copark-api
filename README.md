# CoPark API 🚀

> **Backend Service for CoPark Parking Management Platform**

**CoPark API** is a robust RESTful service capable of handling high-concurrency requests for parking reservations. Built with Scalable Architecture in mind, it provides the core logic for user authentication, parking management, booking processing, and vehicle registration.

---

## ✨ Key Features

*   **Security First**: JWT Authentication (Argon2 hashing), Helmet security headers, and CORS protection.
*   **Scalable Architecture**: Feature-Based (Vertical Slice) structure for easy maintenance and scaling.
*   **Database Management**: PostgreSQL + Prisma ORM for type-safe and efficient database operations.
*   **Smart Booking**: Concurrency-safe booking logic with status tracking (Pending, Confirmed, Completed).
*   **Geolocation**: Support for parking location coordinates (Lat/Lng).

## 🛠️ Tech Stack

*   **Runtime**: Node.js (v20+)
*   **Framework**: Express.js
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Validation**: Joi & Joi-Passport
*   **Architecture**: Modular Feature-Based (Controller-Service-Repository)

## ⚡ Getting Started

### Prerequisites
*   Node.js v18+
*   PostgreSQL Database
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/copark.git
    cd copark/copark-api
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    DATABASE_URL="postgresql://user:password@localhost:5432/copark_db"
    JWT_SECRET="your_super_secret_key"
    ```

4.  **Database Setup**
    ```bash
    # Run migrations
    npx prisma migrate dev --name init

    # Seed initial data (optional)
    npx prisma db seed
    ```

5.  **Run the Server**
    ```bash
    npm run dev   # Development Mode
    npm start     # Production Mode
    ```

## � Project Structure

The project is organized by **Features** (Vertical Slices) for better scalability:

```
src/
├── config/        # Environment and DB configuration
├── features/      # Business Logic by Feature
│   ├── auth/      # Authentication (Login/Register)
│   ├── bookings/  # Reservation Logic
│   ├── parkings/  # Parking Management
│   ├── users/     # User Profiles
│   └── vehicles/  # Vehicle Management
├── middlewares/   # Global middlewares (Auth, Error, Logger)
└── app.js         # App Entry Point
```

## 📜 Available Scripts

*   `npm run dev`: Starts the server with Nodemon (auto-restart).
*   `npm start`: Starts the production server.
*   `npm run lint`: Runs ESLint check.
*   `npx prisma studio`: Opens the visual database editor.

---
*Developed by Daniel for CoPark Platform.*
