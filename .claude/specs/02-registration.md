# Spec: Registration

## Overview

This feature implements user account creation for Spendly. A visitor fills in their name, email, and password on the `/register` page; the frontend posts to `POST /api/auth/register`; the backend validates the input, hashes the password with BCrypt, persists the user via the existing `UserRepository`, issues a signed JWT, and returns the token together with public user info. On success the frontend stores the token in `localStorage` and redirects to `/dashboard` (placeholder for now). This is the first step that brings the API layer — controllers, services, DTOs, JWT utilities, Spring Security config, and the `JwtAuthFilter` — into existence. Everything built here is reused by Login (step 03) and all authenticated endpoints.

## Depends on

- Step 01 — Database Setup: `User` model, `UserRepository` interface, and all three DB adapters must be in place.

## Routes

- `POST /api/auth/register` — create a new account, return JWT + user info — public (no auth required)

## Database changes

No database changes. The `User` model, `UserRepository` interface, and all three adapters (MongoDB, PostgreSQL, SQL Server) are already implemented. `existsByEmail` is already available for duplicate-email detection.

## Templates

- **Create:**
  - `frontend/src/app/RegisterPage.tsx` — registration form (name, email, password, confirm-password fields)
  - `frontend/src/lib/api.ts` — shared axios instance (baseURL `/api`, attaches `Authorization` header from `localStorage` when present)

- **Modify:**
  - `frontend/src/app/App.tsx` — replace the `/register` placeholder `<div>` with `<RegisterPage />`

## Files to change

- `frontend/src/app/App.tsx` — wire `RegisterPage` into the `/register` route

## Files to create

### Backend
- `backend/src/main/java/com/spendly/dto/RegisterRequest.java` — `name`, `email`, `password` fields with Bean Validation constraints
- `backend/src/main/java/com/spendly/dto/UserResponse.java` — `id`, `name`, `email`, `createdAt` (never exposes `passwordHash`)
- `backend/src/main/java/com/spendly/dto/AuthResponse.java` — `token` (String) + `user` (UserResponse)
- `backend/src/main/java/com/spendly/service/UserService.java` — interface: `AuthResponse register(RegisterRequest req)`
- `backend/src/main/java/com/spendly/service/UserServiceImpl.java` — BCrypt hash, `UserRepository.save`, `JwtUtil.generate`
- `backend/src/main/java/com/spendly/controller/AuthController.java` — `@PostMapping("/auth/register")`, calls `UserService.register`, returns 201
- `backend/src/main/java/com/spendly/util/JwtUtil.java` — generate token (userId as subject, 24 h expiry, HMAC-SHA256); also expose `extractUserId` and `isTokenValid` for the filter
- `backend/src/main/java/com/spendly/filter/JwtAuthFilter.java` — `OncePerRequestFilter`; reads `Authorization: Bearer <token>`, calls `JwtUtil.isTokenValid`, sets `UsernamePasswordAuthenticationToken` in `SecurityContextHolder`
- `backend/src/main/java/com/spendly/config/SecurityConfig.java` — `@EnableWebSecurity`; permit `/auth/**` publicly; all other routes require authentication; register `JwtAuthFilter` before `UsernamePasswordAuthenticationFilter`; disable CSRF (stateless API); expose `BCryptPasswordEncoder` bean
- `backend/src/main/java/com/spendly/exception/EmailAlreadyExistsException.java` — `RuntimeException` subclass
- `backend/src/main/java/com/spendly/exception/GlobalExceptionHandler.java` — `@RestControllerAdvice`; map `EmailAlreadyExistsException` → 409, `MethodArgumentNotValidException` → 400 with field-error list

### Frontend
- `frontend/src/app/RegisterPage.tsx`
- `frontend/src/lib/api.ts`

## New dependencies

No new dependencies. All required libraries are already declared in `pom.xml`:
- `spring-boot-starter-security`
- `spring-boot-starter-validation`
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (version 0.12.6)

## Rules for implementation

- Controller → Service → Repository layering is strict; zero business logic in `AuthController`
- `UserService` depends only on the `UserRepository` interface — never import a concrete adapter
- Passwords hashed with `BCryptPasswordEncoder` (bean from `SecurityConfig`); raw password never stored or logged
- JWT signed with HMAC-SHA256; secret loaded from `application.yml` property `jwt.secret`; expiry 24 h
- `JwtAuthFilter` must be stateless — it only reads the token, never touches the DB
- `UserResponse` must never include `passwordHash`
- All Bean Validation constraints on `RegisterRequest`: `@NotBlank` on name/email/password, `@Email` on email, `@Size(min=8)` on password
- Use CSS variables — never hardcode hex colours in the frontend
- Auth state stored in `localStorage` as key `token` (String) and `user` (JSON-serialised `UserResponse`)
- On 409 Conflict, the frontend shows the error message inline (not a browser alert)
- The JWT secret must not be hardcoded in Java source — read from config only

## Definition of done

- [ ] `POST /api/auth/register` with valid payload returns HTTP 201, a signed JWT, and a `UserResponse` (no `passwordHash` field)
- [ ] `POST /api/auth/register` with a duplicate email returns HTTP 409 with a readable error message
- [ ] `POST /api/auth/register` with missing or invalid fields returns HTTP 400 with per-field validation errors
- [ ] Registered user is persisted and retrievable via `UserRepository.findByEmail`
- [ ] Password stored in the DB is a BCrypt hash (not plaintext)
- [ ] `/register` page renders in the browser with name, email, password, and confirm-password fields
- [ ] Submitting the form with valid data navigates the user away from `/register` and stores `token` in `localStorage`
- [ ] Submitting the form with an already-registered email shows a 409 error message inline on the page
- [ ] Submitting the form with an empty field or password shorter than 8 characters shows a validation error (either client-side or from the 400 response)
- [ ] Backend starts without errors when running with `mvn spring-boot:run` (default MongoDB profile)
- [ ] The `/register` route is publicly accessible — hitting it without a JWT does not redirect or return 401
