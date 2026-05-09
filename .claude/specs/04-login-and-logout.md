# Spec: Login and Logout

## Overview

This feature adds credential-based login and client-side logout to Spendly. A returning user fills in their email and password on the `/login` page; the frontend posts to `POST /api/auth/login`; the backend verifies the credentials, generates a signed JWT, and returns the same `AuthResponse` shape used by registration. On success the frontend stores the token and user info in `localStorage` and navigates to `/dashboard`. Logout is a purely client-side operation — clearing `localStorage` and redirecting to `/login` — because the API is stateless JWT with no server sessions to invalidate. The feature also introduces `GuestRoute` (redirect to `/dashboard` if already logged in) and `PrivateRoute` (redirect to `/login` if not logged in) guards, and a minimal `DashboardPage` placeholder that proves the auth gate works end-to-end.

## Depends on

- Step 01 — Database Setup: `User` model, `UserRepository` interface, and all three DB adapters.
- Step 02 (Registration): `AuthResponse`, `UserResponse`, `JwtUtil`, `JwtAuthFilter`, `SecurityConfig`, `GlobalExceptionHandler`, `api.ts`, and `localStorage` auth-state conventions are all required.

## Routes

- `POST /api/auth/login` — verify email + password, return JWT + user info — public (no auth required)

No other new routes. Logout is a frontend-only operation (clear localStorage, redirect).

## Database changes

No database changes. The `User` model already stores `passwordHash`; `UserRepository.findByEmail` is already available.

## Templates

- **Create:**
  - `frontend/src/app/LoginPage.tsx` — login form (email, password fields; inline error on 401)
  - `frontend/src/app/DashboardPage.tsx` — placeholder authenticated page with user greeting and logout button
  - `frontend/src/app/GuestRoute.tsx` — wrapper that reads `localStorage.getItem('token')` and redirects to `/dashboard` if present
  - `frontend/src/app/PrivateRoute.tsx` — wrapper that reads `localStorage.getItem('token')` and redirects to `/login` if absent

- **Modify:**
  - `frontend/src/app/App.tsx` — replace `/login` placeholder with `<LoginPage />`; add `/dashboard` route wrapped in `<PrivateRoute>`; wrap `/login` and `/register` routes in `<GuestRoute>`

## Files to change

### Backend
- `backend/src/main/java/com/spendly/service/UserService.java` — add `AuthResponse login(LoginRequest req)` method
- `backend/src/main/java/com/spendly/service/UserServiceImpl.java` — implement `login`: look up by email, BCrypt match, throw `InvalidCredentialsException` on failure, generate JWT on success
- `backend/src/main/java/com/spendly/controller/AuthController.java` — add `@PostMapping("/auth/login")` returning 200
- `backend/src/main/java/com/spendly/exception/GlobalExceptionHandler.java` — map `InvalidCredentialsException` → 401 with `{ "error": "Invalid email or password" }`

### Frontend
- `frontend/src/app/App.tsx` — wire login, dashboard routes and route guards (see Templates → Modify)

## Files to create

### Backend
- `backend/src/main/java/com/spendly/dto/LoginRequest.java` — record with `email` (`@NotBlank @Email`) and `password` (`@NotBlank`) fields
- `backend/src/main/java/com/spendly/exception/InvalidCredentialsException.java` — `RuntimeException` subclass, no extra fields needed

### Frontend
- `frontend/src/app/LoginPage.tsx`
- `frontend/src/app/DashboardPage.tsx`
- `frontend/src/app/GuestRoute.tsx`
- `frontend/src/app/PrivateRoute.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- Controller → Service → Repository layering is strict; zero business logic in `AuthController`
- `UserServiceImpl.login` must call `userRepository.findByEmail` then `passwordEncoder.matches`; never expose which of email or password is wrong — always throw the same `InvalidCredentialsException`
- `InvalidCredentialsException` maps to HTTP 401, not 403
- `LoginRequest` must use Bean Validation (`@NotBlank`, `@Email`); a missing field returns 400, wrong credentials return 401
- `POST /api/auth/login` returns HTTP 200 (not 201) on success
- Logout must call `localStorage.removeItem('token')` and `localStorage.removeItem('user')` then navigate to `/login`
- `GuestRoute` and `PrivateRoute` must read `localStorage.getItem('token')` synchronously — no async calls
- `DashboardPage` reads the user display name from `JSON.parse(localStorage.getItem('user'))` — no additional API call at this stage
- `DashboardPage` is a placeholder only — no expense data, no charts; just a greeting and a logout button
- Use CSS variables — never hardcode hex colour values in frontend components
- Auth state stored in `localStorage` as key `token` (String) and `user` (JSON-serialised `UserResponse`) — same convention as registration

## Definition of done

- [ ] `POST /api/auth/login` with valid credentials returns HTTP 200, a signed JWT, and a `UserResponse` (no `passwordHash` field)
- [ ] `POST /api/auth/login` with a wrong password returns HTTP 401 with `{ "error": "Invalid email or password" }` — not 403 or 500
- [ ] `POST /api/auth/login` with an unknown email returns HTTP 401 with the same generic error message
- [ ] `POST /api/auth/login` with a blank email or password returns HTTP 400 (Bean Validation)
- [ ] `/login` page renders with email and password fields and a submit button
- [ ] Submitting valid credentials on `/login` navigates to `/dashboard` and stores `token` in `localStorage`
- [ ] Submitting wrong credentials shows the 401 error message inline on the page — no browser alert
- [ ] Visiting `/login` while already logged in (token in `localStorage`) redirects immediately to `/dashboard`
- [ ] Visiting `/dashboard` without a token redirects immediately to `/login`
- [ ] `/dashboard` displays the logged-in user's display name (read from `localStorage`)
- [ ] Clicking the logout button clears `localStorage` and redirects to `/login`
- [ ] After logout, visiting `/dashboard` redirects back to `/login`
- [ ] Backend starts without errors on `mvn spring-boot:run` (default MongoDB profile)
