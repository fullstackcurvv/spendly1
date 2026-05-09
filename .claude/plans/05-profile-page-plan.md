# Implementation Plan: 05 — Profile Page

## Context

The spec calls for a `/profile` page where authenticated users can view their account details, update their display name, and change their password. This also requires implementing the three `UserController` endpoints listed in `CLAUDE.md` but not yet written (`GET /api/users/me`, `PATCH /api/users/me`, `PATCH /api/users/me/password`). The `DashboardPage` placeholder gains a Profile link so users have a way to reach the page.

Save this plan also to `.claude/plans/05-profile-page-plan.md` after approval.

---

## Implementation Order

Backend first (API must exist before the page can call it), then frontend.

---

## Backend

### 1. `UserNotFoundException.java` (new)
**Path:** `backend/src/main/java/com/spendly/exception/UserNotFoundException.java`

- Extend `RuntimeException`
- No-arg constructor, hardcoded message `"User not found"`
- Pattern: identical to `InvalidCredentialsException.java`

### 2. `UpdateNameRequest.java` (new)
**Path:** `backend/src/main/java/com/spendly/dto/UpdateNameRequest.java`

- Java record
- Single field: `@NotBlank(message = "Name is required") String name`
- Pattern: identical to `RegisterRequest.java` field style

### 3. `ChangePasswordRequest.java` (new)
**Path:** `backend/src/main/java/com/spendly/dto/ChangePasswordRequest.java`

- Java record
- Fields:
  - `@NotBlank(message = "Current password is required") String currentPassword`
  - `@NotBlank(message = "New password is required") @Size(min = 8, message = "New password must be at least 8 characters") String newPassword`

### 4. `GlobalExceptionHandler.java` (modify)
**Path:** `backend/src/main/java/com/spendly/exception/GlobalExceptionHandler.java`

- Add one handler method after the existing `handleInvalidCredentials` handler:
  ```
  @ExceptionHandler(UserNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Map<String, String> handleUserNotFound(UserNotFoundException ex) {
      return Map.of("error", ex.getMessage());
  }
  ```

### 5. `UserService.java` (modify)
**Path:** `backend/src/main/java/com/spendly/service/UserService.java`

Add three method signatures to the interface:
```
UserResponse getProfile(String userId);
UserResponse updateName(String userId, UpdateNameRequest req);
void changePassword(String userId, ChangePasswordRequest req);
```

### 6. `UserServiceImpl.java` (modify)
**Path:** `backend/src/main/java/com/spendly/service/UserServiceImpl.java`

Implement the three methods:

**`getProfile`:**
- `userRepository.findById(userId).orElseThrow(UserNotFoundException::new)`
- Return `UserResponse.from(user)`

**`updateName`:**
- `userRepository.findById(userId).orElseThrow(UserNotFoundException::new)`
- Reconstruct: `new User(user.id(), req.name(), user.email(), user.passwordHash(), user.createdAt())`
- `userRepository.save(updated)`
- Return `UserResponse.from(saved)`

**`changePassword`:**
- `userRepository.findById(userId).orElseThrow(UserNotFoundException::new)`
- `if (!passwordEncoder.matches(req.currentPassword(), user.passwordHash())) throw new InvalidCredentialsException()`
- Encode: `String newHash = passwordEncoder.encode(req.newPassword())`
- Reconstruct: `new User(user.id(), user.name(), user.email(), newHash, user.createdAt())`
- `userRepository.save(updated)`
- No return value (void)

### 7. `UserController.java` (new)
**Path:** `backend/src/main/java/com/spendly/controller/UserController.java`

```
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    // constructor injection

    @GetMapping("/me")
    public UserResponse getProfile(Authentication auth) {
        return userService.getProfile((String) auth.getPrincipal());
    }

    @PatchMapping("/me")
    public UserResponse updateName(@Valid @RequestBody UpdateNameRequest req, Authentication auth) {
        return userService.updateName((String) auth.getPrincipal(), req);
    }

    @PatchMapping("/me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@Valid @RequestBody ChangePasswordRequest req, Authentication auth) {
        userService.changePassword((String) auth.getPrincipal(), req);
    }
}
```

Notes:
- Inject `Authentication` as a method parameter — Spring MVC resolves it from the SecurityContext automatically; cleaner than calling `SecurityContextHolder` manually
- `GET /me` → 200, `PATCH /me` → 200, `PATCH /me/password` → 204
- Zero business logic in the controller

---

## Frontend

### 8. `ProfilePage.tsx` (new)
**Path:** `frontend/src/app/ProfilePage.tsx`

**Imports:** `useState`, `useEffect` from react; `Link`, `useNavigate` from react-router; `axios` from axios; `api` from `../lib/api`; `SpendlyLogo` from components.

**State:**
- `profile: { id, name, email, createdAt } | null` — fetched from API on mount
- `nameForm: { name: string }` — pre-filled with current name once loaded
- `nameLoading: boolean`, `nameError: string | null`, `nameSuccess: string | null`
- `pwForm: { currentPassword, newPassword, confirmPassword }` — always starts empty
- `pwLoading: boolean`, `pwError: string | null`, `pwSuccess: string | null`

**Mount effect:**
- `api.get('/users/me')` → set `profile` and pre-fill `nameForm.name`
- On error: if 401/403, navigate to `/login`

**Name update submit:**
- `api.patch('/users/me', { name: nameForm.name })`
- On success: update `profile` state, update `localStorage.setItem('user', JSON.stringify(data.user))` where `data` is the `UserResponse` returned (wrap in `{ id, name, email, createdAt }` shape that matches stored user), set `nameSuccess = 'Name updated successfully'`
- On 400 validation error: show first field error
- On other error: generic message

**Password change submit:**
- Client-side check: if `pwForm.newPassword !== pwForm.confirmPassword` → set `pwError = 'Passwords do not match'`, return early (no API call)
- `api.patch('/users/me/password', { currentPassword, newPassword })`
- On success (204): clear form, set `pwSuccess = 'Password changed successfully'`
- On 401: show `'Current password is incorrect'`
- On 400 validation error: show first field error

**Layout:**
- Same full-page centered flex layout as other pages (`minHeight: '100vh'`, `backgroundColor: 'var(--page-bg)'`)
- Single `maxWidth: '480px'` container
- Logo at top linking back to `/`
- One card (`backgroundColor: 'var(--card-bg)'`, `border: '1px solid var(--border)'`, `borderRadius: '16px'`, `padding: '36px 32px'`)
- Page title "Profile" + user's email as subtitle (read from `profile` state)
- Section 1: "Display name" — label, text input, success/error message, Save button
- Divider between sections (`borderTop: '1px solid var(--border)'`, `margin: '28px 0'`)
- Section 2: "Change password" — three password inputs (Current, New, Confirm), success/error message, Change password button
- Back link to `/dashboard` below the card (using `<Link>` styled with `var(--brand-green)`)
- All colours via CSS variables only; no hardcoded hex

### 9. `App.tsx` (modify)
**Path:** `frontend/src/app/App.tsx`

- Add import: `import { ProfilePage } from './ProfilePage'`
- Add route after `/dashboard`:
  ```tsx
  <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
  ```

### 10. `DashboardPage.tsx` (modify)
**Path:** `frontend/src/app/DashboardPage.tsx`

- Add import: `import { Link } from 'react-router'`
- Add a Profile link button inside the card, above the Log out button:
  ```tsx
  <Link
    to="/profile"
    style={{
      display: 'block',
      padding: '10px 24px',
      fontSize: '0.95rem',
      fontWeight: 600,
      color: 'var(--btn-primary-text)',
      backgroundColor: 'var(--btn-primary-bg)',
      border: 'none',
      borderRadius: '8px',
      textDecoration: 'none',
      marginBottom: '12px',
    }}
  >
    Profile
  </Link>
  ```

---

## Critical Files

| File | Action |
|---|---|
| `backend/.../exception/UserNotFoundException.java` | Create |
| `backend/.../dto/UpdateNameRequest.java` | Create |
| `backend/.../dto/ChangePasswordRequest.java` | Create |
| `backend/.../exception/GlobalExceptionHandler.java` | Modify — add UserNotFoundException handler |
| `backend/.../service/UserService.java` | Modify — add 3 method signatures |
| `backend/.../service/UserServiceImpl.java` | Modify — implement 3 methods |
| `backend/.../controller/UserController.java` | Create |
| `frontend/src/app/ProfilePage.tsx` | Create |
| `frontend/src/app/App.tsx` | Modify — add /profile route |
| `frontend/src/app/DashboardPage.tsx` | Modify — add Profile link |

---

## Patterns to Reuse

- Exception class structure → `InvalidCredentialsException.java`
- DTO record structure → `RegisterRequest.java`, `LoginRequest.java`
- Controller structure → `AuthController.java` (constructor injection, `@Valid`, return DTOs)
- Service method structure → `UserServiceImpl.login()` (find → verify → reconstruct → save)
- Frontend form pattern → `RegisterPage.tsx` (FormState, handleChange, try/catch/finally, inline error)
- Axios error handling → `LoginPage.tsx` (isAxiosError check, status-specific messages)
- Page layout → `DashboardPage.tsx` / `LoginPage.tsx` (centered flex, card, CSS variables)

---

## Verification

1. **Backend compile:** `cd backend && mvn compile` — must succeed with no errors
2. **Run backend:** `mvn spring-boot:run` — must start cleanly
3. **API smoke tests (curl or Postman):**
   - `POST /api/auth/login` with `demo@spendly.com` / `demo1234` → capture token
   - `GET /api/users/me` with Bearer token → 200, no passwordHash
   - `GET /api/users/me` without token → 403
   - `PATCH /api/users/me` `{"name":"New Name"}` → 200, updated name in response
   - `PATCH /api/users/me` `{"name":""}` → 400
   - `PATCH /api/users/me/password` correct current pw, new pw ≥8 chars → 204
   - `PATCH /api/users/me/password` wrong current pw → 401
   - `PATCH /api/users/me/password` new pw < 8 chars → 400
4. **Frontend:** `cd frontend && npm run dev`
   - Log in → dashboard shows Profile link → click Profile
   - Profile page loads with current name/email
   - Update name → success message → back to dashboard → greeting shows new name
   - Change password with mismatched confirm → client error, no API call
   - Change password with wrong current → inline 401 error
   - Change password correctly → success message, can log in with new password
   - Visit `/profile` without token → redirects to `/login`
