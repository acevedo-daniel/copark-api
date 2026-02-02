<p align="center">
  <h1 align="center">🅿️ CoPark API</h1>
  <p align="center">
    <strong>Parking Management System for Administrators</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#api-endpoints">API</a>
  </p>
</p>

---

## Features

- 🔐 **Authentication** — JWT-based auth with secure password hashing
- 🚗 **Parking Management** — Full CRUD with pagination and filters
- 📋 **Booking System** — Vehicle check-in/check-out flow
- ⭐ **Reviews** — Rating system with statistics
- ✅ **Type-Safe** — End-to-end TypeScript with Zod validation

---

## Tech Stack

| Category   | Technology   |
| ---------- | ------------ |
| Runtime    | Node.js 22   |
| Framework  | Express.js   |
| Database   | PostgreSQL   |
| ORM        | Prisma       |
| Validation | Zod          |
| Auth       | JWT + Argon2 |

---

## Quick Start

```bash
# Clone & install
git clone https://github.com/yourusername/copark-api.git
cd copark-api
pnpm install

# Setup database
docker-compose up -d
pnpm prisma migrate dev

# Run
pnpm dev
```

---

## API Endpoints

### Auth

```
POST /auth/register    # Create account
POST /auth/login       # Get JWT token
```

### Parkings

```
GET    /parkings       # List all (public)
GET    /parkings/me    # List owned (auth)
POST   /parkings       # Create (auth)
PATCH  /parkings/:id   # Update (auth)
```

### Bookings

```
POST /parkings/:id/bookings/check-in     # Register vehicle entry
GET  /parkings/:id/bookings/active       # List active bookings
GET  /parkings/:id/bookings              # List all with pagination
POST /bookings/:id/check-out             # Register vehicle exit
```

### Reviews

```
GET /reviews/parking/:id         # List reviews
GET /reviews/parking/:id/stats   # Get rating stats
```

---

## Project Structure

```
src/
├── features/      # Feature modules (auth, booking, parking...)
├── middlewares/   # Auth, validation, error handling
├── errors/        # Custom error classes
└── utils/         # Helpers (pagination)
```

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/yourusername">Daniel</a>
</p>
