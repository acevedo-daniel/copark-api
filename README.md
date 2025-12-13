# CoPark API 🚀

> **Backend REST API for CoPark Parking Management Platform**

A robust RESTful service built with Node.js and Express.js, designed to handle parking reservations, user management, and real-time booking operations.

---

## ✨ Features

- **JWT Authentication** - Secure token-based authentication with Argon2 password hashing
- **Feature-Based Architecture** - Modular structure for scalability and maintainability
- **PostgreSQL Database** - Type-safe database operations with Prisma ORM
- **Input Validation** - Request validation using Joi schemas
- **Error Handling** - Centralized error handling middleware
- **Security** - Helmet security headers and CORS protection

## 🛠️ Tech Stack

- **Runtime**: Node.js v20+
- **Framework**: Express.js v4
- **Database**: PostgreSQL
- **ORM**: Prisma v7
- **Authentication**: JWT (jose library)
- **Validation**: Joi v17
- **Security**: Helmet, CORS, Argon2

## ⚡ Quick Start

### Prerequisites

- Node.js v18 or higher
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and navigate**
   ```bash
   git clone https://github.com/your-username/copark.git
   cd copark/copark-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://user:password@localhost:5432/copark_db"
   JWT_SECRET="your_super_secret_key_here"
   ```

4. **Setup database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run the server**
   ```bash
   npm run dev    # Development mode with auto-reload
   npm start      # Production mode
   ```

The API will be available at `http://localhost:3000`

## 📂 Project Structure

```
src/
├── config/          # Database and environment configuration
├── features/        # Feature modules (Vertical Slices)
│   ├── auth/        # Authentication (login, register)
│   ├── bookings/    # Booking management
│   ├── parkings/    # Parking listings
│   ├── reviews/     # Review system
│   ├── users/       # User profiles
│   └── vehicles/    # Vehicle management
├── middlewares/     # Global middlewares (auth, validation, error handling)
├── schemas/         # Joi validation schemas
├── utils/           # Utility functions (JWT, password hashing)
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

## 📜 Available Scripts

- `npm run dev` - Start development server with Nodemon
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Run database migrations
- `npx prisma db seed` - Seed database with sample data

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Users
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update current user profile
- `GET /users/:id` - Get user by ID

### Vehicles
- `POST /vehicles` - Register vehicle
- `GET /vehicles` - List user vehicles
- `DELETE /vehicles/:id` - Delete vehicle

### Parkings
- `GET /parkings` - List all parkings
- `GET /parkings/me` - List user's parkings
- `GET /parkings/:id` - Get parking details
- `POST /parkings` - Create parking listing
- `PATCH /parkings/:id` - Update parking

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - List user bookings
- `GET /bookings/:id` - Get booking details
- `PATCH /bookings/:id/cancel` - Cancel booking

### Reviews
- `POST /reviews` - Create review
- `GET /reviews/parking/:parkingId` - Get parking reviews

## 🔒 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |

## 🐳 Docker Support

```bash
npm run docker:up    # Start PostgreSQL container
npm run docker:down   # Stop container
npm run docker:logs   # View container logs
```

## 📚 Documentation

For detailed API documentation, see the endpoint descriptions above or check the source code in `src/features/`.

---

*Built with ❤️ for CoPark Platform*
