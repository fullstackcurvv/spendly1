# Spec: Profile Page

## Overview

This feature adds a `/profile` page where logged-in users can view their account details, update their display name, and change their password. It also introduces the three `UserController` endpoints (`GET /api/users/me`, `PATCH /api/users/me`, `PATCH /api/users/me/password`) that are listed in CLAUDE.md but not yet implemented — the backend work is a prerequisite for the page. The `DashboardPage` placeholder gains a navigation link to `/profile`, turning the dashboard into a real jumping-off point for authenticated users.

## Depends on

- Step 01 — Database Setup: `User` model, `UserRepository` interface, and all three DB adapters.
- Step 02 (Registration): `UserResponse`, `JwtUtil`, `JwtAuthFilter`, `SecurityConfig`, `api.ts`, and `localStorage` auth-state conventions.
- Step 04 (Login and Logout): `PrivateRoute`, `DashboardPage`, and the `token` / `user` localStorage keys.

## Routes

- `GET /api/users/me` — return the authenticated user's profile — logged-in (Bearer)
- `PATCH /api/users/me` — update the authenticated user's display name — logged-in (Bearer)
- `PATCH /api/users/me/password` — change the authenticated user's password — logged-in (Bearer)

## Database changes

No database changes. The `User` model already has `name`, `email`, `passwordHash`, and `createdAt`. Updates use `UserRepository.save()` with a reconstructed `User` record.

## Templates

- **Create:**
  - `frontend/src/app/ProfilePage.tsx` — authenticated page with two sections: (1) update display name form, (2) change password form. Fetches fresh profile from `GET /api/users/me` on mount. Shows inline success/error per section.

- **Modify:**
  - `frontend/src/app/App.tsx` — add `/profile` route wrapped in `<PrivateRoute>`
  - `frontend/src/app/DashboardPage.tsx` — add a "Profile" navigation button/link that goes to `/profile`

## Files to change

### Backend
- `backend/src/main/java/com/spendly/service/UserService.java` — add `UserResponse getProfile(String userId)`, `UserResponse updateName(String userId, UpdateNameRequest req)`, `void changePassword(String userId, ChangePasswordRequest req)`
- `backend/src/main/java/com/spendly/service/UserServiceImpl.java` — implement the three new methods
- `backend/src/main/java/com/spendly/exception/GlobalExceptionHandler.java` — map `UserNotFoundException` → 404 `{ "error": "User not found" }`

### Frontend
- `frontend/src/app/App.tsx` — add `/profile` route
- `frontend/src/app/DashboardPage.tsx` — add Profile link/button

## Files to create

### Backend
- `backend/src/main/java/com/spendly/controller/UserController.java` — `@RestController @RequestMapping("/users")`; reads `userId` from `SecurityContextHolder.getContext().getAuthentication().getPrincipal()`
- `backend/src/main/java/com/spendly/dto/UpdateNameRequest.java` — record with `name` field (`@NotBlank`)
- `backend/src/main/java/com/spendly/dto/ChangePasswordRequest.java` — record with `currentPassword` (`@NotBlank`) and `newPassword` (`@NotBlank @Size(min=8)`) fields
- `backend/src/main/java/com/spendly/exception/UserNotFoundException.java` — `RuntimeException` subclass, no extra fields

### Frontend
- `frontend/src/app/ProfilePage.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- Controller → Service → Repository layering is strict; zero business logic in `UserController`
- `UserController` must cast the Spring Security principal to `String` (it is the userId String set by `JwtAuthFilter`)
- `GET /api/users/me` returns HTTP 200 with `UserResponse`
- `PATCH /api/users/me` returns HTTP 200 with the updated `UserResponse`
- `PATCH /api/users/me/password` returns HTTP 204 No Content on success
- `UserServiceImpl.changePassword` must verify `currentPassword` against the stored hash with `passwordEncoder.matches` before saving; if it doesn't match, throw `InvalidCredentialsException` (maps to 401)
- `UserServiceImpl.updateName` reconstructs the `User` record with the new name and calls `userRepository.save()`; the `User` record is immutable so always build a new instance
- `UserNotFoundException` maps to HTTP 404 (for the edge case where a valid JWT references a deleted user)
- `ProfilePage` must call `GET /api/users/me` via `api` (the axios instance with the Bearer interceptor) on mount to get fresh data — do not rely solely on localStorage
- After a successful name update, `ProfilePage` must also update `localStorage.setItem('user', JSON.stringify(updatedUser))` so the dashboard greeting stays in sync
- Both forms on `ProfilePage` show inline success messages and inline error messages; no browser alerts
- The change-password form has three fields: Current Password, New Password, Confirm New Password; the frontend validates that New Password and Confirm New Password match before submitting
- Use CSS variables — never hardcode hex colour values in frontend components
- Auth state stored in `localStorage` as key `token` (String) and `user` (JSON-serialised `UserResponse`) — same convention as registration and login

## Definition of done

- [ ] `GET /api/users/me` with a valid Bearer token returns HTTP 200 and the user's `id`, `name`, `email`, `createdAt` (no `passwordHash`)
- [ ] `GET /api/users/me` without a token returns HTTP 403
- [ ] `PATCH /api/users/me` with `{ "name": "New Name" }` returns HTTP 200 with the updated name in the response
- [ ] `PATCH /api/users/me` with a blank name returns HTTP 400 (Bean Validation)
- [ ] `PATCH /api/users/me/password` with correct current password and a valid new password returns HTTP 204
- [ ] `PATCH /api/users/me/password` with an incorrect current password returns HTTP 401 with `{ "error": "Invalid email or password" }`
- [ ] `PATCH /api/users/me/password` with a new password shorter than 8 characters returns HTTP 400
- [ ] `/profile` is accessible from the dashboard via a button or link
- [ ] `/profile` without a token redirects to `/login`
- [ ] `/profile` loads and displays the user's name and email fetched from the API
- [ ] Submitting the update-name form with a new name shows a success message and updates the displayed name
- [ ] Submitting the change-password form with mismatched new/confirm passwords shows a client-side error without calling the API
- [ ] Submitting the change-password form with a correct current password shows a success message
- [ ] Submitting the change-password form with a wrong current password shows the 401 error inline
- [ ] After a successful name update, navigating back to `/dashboard` shows the updated name in the greeting
- [ ] Backend starts without errors on `mvn spring-boot:run` (default MongoDB profile)
