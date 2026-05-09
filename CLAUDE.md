
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Spendly is a personal expense-tracking web app. Users register, log in, and view their spending by category. The backend is a Spring Boot REST API; the frontend is a React SPA. Authentication is stateless JWT. The database layer is fully abstracted behind repository interfaces with three adapters (MongoDB, PostgreSQL, SQL Server) selectable via Spring profiles.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite 6 + Tailwind CSS v4 |
| UI components | shadcn/ui (Radix UI primitives) — do not edit directly |
| HTTP client | axios — calls `/api/...`, proxied by Vite to `localhost:8080` |
| Routing | react-router v7 |
| Backend | Spring Boot 3.3.0, Java 17 |
| Auth | Spring Security (stateless) + jjwt 0.12.6 (HMAC-SHA256, 24 h) |
| Validation | Jakarta Bean Validation (`spring-boot-starter-validation`) |
| MongoDB adapter | Spring Data MongoDB |
| SQL adapters | Spring Data JPA + `postgresql` / `mssql-jdbc` drivers |
| Build (frontend) | Vite |
| Build (backend) | Maven (`pom.xml`) |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│   React SPA  (localhost:5173 in dev)                │
│   App.tsx · GuestRoute · PrivateRoute               │
│   Pages: Landing, Register, Login, Dashboard,       │
│          Profile, Terms, Privacy                    │
└────────────────────┬────────────────────────────────┘
                     │  axios  /api/**
                     │  Vite dev proxy → localhost:8080
                     ▼
┌─────────────────────────────────────────────────────┐
│   Spring Boot  (context-path /api, port 8080)       │
│                                                     │
│   JwtAuthFilter  (OncePerRequestFilter)             │
│        ↓                                            │
│   Controller Layer (@RestController)                │
│   AuthController  · UserController                  │
│        ↓                                            │
│   Service Layer (@Service)                          │
│   UserService / UserServiceImpl                     │
│        ↓                                            │
│   Repository Interface                              │
│   UserRepository · ExpenseRepository               │
│        ↓  (@Profile selects one adapter)            │
│   ┌──────────┬──────────────┬────────────┐          │
│   │ MongoDB  │  PostgreSQL  │ SQL Server │          │
│   │  Impl   │    Impl      │   Impl     │          │
│   └──────────┴──────────────┴────────────┘          │
└─────────────────────────────────────────────────────┘
```

## Architecture Principles

1. **Clean layering** — Controller → Service → Repository. Zero business logic in controllers.
2. **Dependency Inversion** — Service depends on `UserRepository` / `ExpenseRepository` interfaces, never on concrete DB classes.
3. **Adapter Pattern** — Each DB has its own implementation annotated `@Profile("mongodb|postgresql|sqlserver")`. Exactly one is active at runtime.
4. **Stateless JWT auth** — No sessions. `JwtAuthFilter` validates the `Authorization: Bearer <token>` header on every request and sets the userId as the Spring Security principal.
5. **Config-driven DB switching** — Set `spring.profiles.active` to swap the entire data layer with no code changes.

## Database Architecture

### Domain models (DB-agnostic)
- `User`: `id` (String), `name`, `email`, `passwordHash`, `createdAt`
- `Expense`: `id` (String), `userId`, `amount` (BigDecimal), `category` (enum), `date` (String YYYY-MM-DD), `description`, `createdAt`
- `ExpenseCategory` enum: `FOOD TRANSPORT BILLS HEALTH ENTERTAINMENT SHOPPING OTHER`

### Repository interfaces
- `UserRepository` — save, findById, findByEmail, findAll, deleteById, existsByEmail
- `ExpenseRepository` — (defined; expense API endpoints not yet implemented)

### DB adapters
Each interface has three implementations under `repository/{mongodb,postgresql,sqlserver}/`. SQL adapters delegate to a Spring Data JPA repository (`*JpaRepository`). MongoDB adapters delegate to a Spring Data MongoDB repository (`*MongoRepository`).

### Profile config files
```
backend/src/main/resources/
├── application.yml              default profile: mongodb
├── application-mongodb.yml
├── application-postgresql.yml
└── application-sqlserver.yml
```

### Seed data (`DataSeeder`)
On startup, if `demo@spendly.com` does not exist, inserts 1 demo user and 8 sample expenses. Safe to restart — skips if already seeded.

- Demo credentials: `demo@spendly.com` / `demo1234`

## Backend Structure

```
backend/src/main/java/com/spendly/
├── SpendlyApplication.java
├── config/
├── controller/
├── dto/                          Request/response bodies (never expose passwordHash)
├── exception/
├── filter/
├── model/
├── repository/
├── service/
└── util/
```

### Implemented API endpoints
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create account |
| POST | `/api/auth/login` | public | Returns JWT + user info |
| GET | `/api/users/me` | Bearer | Fetch current user profile |
| PATCH | `/api/users/me` | Bearer | Update display name |
| PATCH | `/api/users/me/password` | Bearer | Change password |

## Frontend Structure

```
frontend/src/
├── main.tsx
├── app/
│   ├── App.tsx              BrowserRouter · all routes · LandingPage
│   └── components/
│       ├── figma/ImageWithFallback.tsx
│       └── ui/              shadcn/ui — do not edit, regenerate via shadcn CLI
├── imports/                 Static assets
└── styles/
    ├── index.css            Entry: imports fonts, tailwind, theme
    ├── theme.css            CSS custom properties
    ├── tailwind.css
    ├── fonts.css
    └── globals.css
```

### Key CSS variables (theme.css)
```
--brand-green: #2ca85a      primary action colour
--page-bg:     #f8f6f4      warm off-white page background
--destructive: #d4183d      error states
--border:      rgba(0,0,0,0.1)
```

### Auth state (localStorage)


### Axios pattern

## Developer Workflows

### Run frontend (dev)
```bash
cd frontend
npm install       # first time
npm run dev       # Vite dev server → http://localhost:5173
```
Vite proxies `/api/**` to `http://localhost:8080` — backend must be running.

### Run backend
```bash
cd backend

# MongoDB (default)
mvn spring-boot:run

# PostgreSQL
mvn spring-boot:run -Dspring-boot.run.profiles=postgresql

# SQL Server
mvn spring-boot:run -Dspring-boot.run.profiles=sqlserver
```

### Build frontend (production)
```bash
cd frontend
npm run build
```

### Compile backend only
```bash
cd backend
mvn compile
```

## Commands

| Command | Directory | Description |
|---|---|---|
| `npm run dev` | `frontend/` | Start Vite dev server (port 5173) |
| `npm run build` | `frontend/` | Production build |
| `mvn spring-boot:run` | `backend/` | Run backend (mongodb profile) |
| `mvn compile` | `backend/` | Compile only |

## Notes
