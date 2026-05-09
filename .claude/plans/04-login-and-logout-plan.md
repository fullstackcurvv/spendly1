# Implementation Plan: Login and Logout

## Context

Step 04 of the Spendly roadmap. Registration (step 03) built the full auth stack — JwtUtil, JwtAuthFilter, SecurityConfig, AuthResponse, the localStorage convention — but left `/login` as a placeholder div and `/dashboard` unreachable. This step closes those gaps: a real login endpoint on the backend, a matching LoginPage on the frontend, client-side logout, and GuestRoute / PrivateRoute guards that enforce the auth boundary throughout the app.

---

## Files created

### Backend
- `backend/src/main/java/com/spendly/dto/LoginRequest.java` — record: `@NotBlank @Email email`, `@NotBlank password`
- `backend/src/main/java/com/spendly/exception/InvalidCredentialsException.java` — generic message, no param constructor

### Frontend
- `frontend/src/app/LoginPage.tsx` — login form, 401 inline error, mirrors RegisterPage style
- `frontend/src/app/DashboardPage.tsx` — placeholder: greeting from localStorage + logout button
- `frontend/src/app/GuestRoute.tsx` — redirects to `/dashboard` if token present
- `frontend/src/app/PrivateRoute.tsx` — redirects to `/login` if token absent

## Files modified

### Backend
- `backend/src/main/java/com/spendly/service/UserService.java` — added `AuthResponse login(LoginRequest req)`
- `backend/src/main/java/com/spendly/service/UserServiceImpl.java` — implemented `login`: findByEmail → BCrypt match → generateToken
- `backend/src/main/java/com/spendly/controller/AuthController.java` — added `POST /auth/login` (HTTP 200)
- `backend/src/main/java/com/spendly/exception/GlobalExceptionHandler.java` — mapped `InvalidCredentialsException` → 401

### Frontend
- `frontend/src/app/App.tsx` — wired LoginPage, DashboardPage; wrapped `/login` + `/register` in GuestRoute; added `/dashboard` in PrivateRoute

---

## Key implementation decisions

- `login` uses `.orElseThrow(InvalidCredentialsException::new)` for missing email — same exception as wrong password, to avoid leaking which field is wrong
- `POST /auth/login` returns HTTP 200 (no `@ResponseStatus`) — contrast with register which returns 201
- `SecurityConfig` already permits `/auth/**`; no changes needed
- Logout is purely client-side: `localStorage.removeItem('token')` + `removeItem('user')` + navigate to `/login`
- Route guards read `localStorage.getItem('token')` synchronously — no async auth state

---

## Verification checklist

### Backend
- [ ] `mvn compile` passes with no errors
- [ ] `POST /api/auth/login` valid → 200 + JWT + UserResponse (no passwordHash)
- [ ] `POST /api/auth/login` wrong password → 401 `{ "error": "Invalid email or password" }`
- [ ] `POST /api/auth/login` unknown email → 401 same message
- [ ] `POST /api/auth/login` blank email → 400 validation error

### Frontend
- [ ] `npm run dev` starts with no TS errors
- [ ] `/login` renders email + password fields
- [ ] Valid credentials → navigate to `/dashboard`, token stored
- [ ] Wrong credentials → inline error message
- [ ] `/dashboard` without token → redirect to `/login`
- [ ] `/login` with token → redirect to `/dashboard`
- [ ] Logout clears localStorage and redirects to `/login`
- [ ] `/register` with token → redirect to `/dashboard`
