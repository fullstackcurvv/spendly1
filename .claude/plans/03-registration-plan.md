# Implementation Plan: Registration (Spec 02)

Source spec: `.claude/specs/02-registration.md`
Branch: `feature/03-registration`

---

## Overview of build order

Files must be created in dependency order so the project compiles at every step.
The backend is built first (infrastructure → utilities → service → controller), then the frontend.

```
Config (jwt.secret)
  └─► DTOs (RegisterRequest, UserResponse, AuthResponse)
       └─► Exceptions (EmailAlreadyExistsException)
            └─► JwtUtil
                 └─► JwtAuthFilter
                      └─► SecurityConfig  (exposes BCryptPasswordEncoder bean)
                           └─► UserService interface
                                └─► UserServiceImpl
                                     └─► AuthController
                                          └─► GlobalExceptionHandler

Frontend
  api.ts
    └─► RegisterPage.tsx
         └─► App.tsx (modify)
```

---

## Phase 1 — Backend config

### Step 1 · Add JWT secret to `application.yml`

File: `backend/src/main/resources/application.yml`

Add under the existing keys:

```yaml
jwt:
  secret: <a-long-random-base64-string-at-least-32-bytes>
  expiration-ms: 86400000   # 24 hours
```

- The secret must never be hardcoded in Java; it is read by `JwtUtil` via `@Value("${jwt.secret}")`.
- Add the same key to `application-mongodb.yml`, `application-postgresql.yml`, and `application-sqlserver.yml` only if those files override the default; otherwise the default `application.yml` value is inherited by all profiles.

---

## Phase 2 — DTOs

All three DTO classes live in `com.spendly.dto`. They are plain Java records (or classes with fields). No Spring annotations needed here.

### Step 2 · `RegisterRequest.java`

Fields and constraints:
| Field | Type | Constraints |
|---|---|---|
| `name` | `String` | `@NotBlank` |
| `email` | `String` | `@NotBlank`, `@Email` |
| `password` | `String` | `@NotBlank`, `@Size(min = 8)` |

- Use a Java `record` so the fields are final and no setters are generated.
- The `@Valid` annotation in the controller triggers these constraints at request time.

### Step 3 · `UserResponse.java`

Fields:
| Field | Type |
|---|---|
| `id` | `String` |
| `name` | `String` |
| `email` | `String` |
| `createdAt` | `String` |

- **No `passwordHash` field** — this is the public-safe view of a user.
- Use a `record`.
- Add a static factory method `from(User user)` that maps `User` → `UserResponse` to keep mapping logic out of the service.

### Step 4 · `AuthResponse.java`

Fields:
| Field | Type |
|---|---|
| `token` | `String` |
| `user` | `UserResponse` |

- Use a `record`.
- This is the body returned by `POST /auth/register` (and later `POST /auth/login`).

---

## Phase 3 — Exception classes

### Step 5 · `EmailAlreadyExistsException.java`

Package: `com.spendly.exception`

- Extends `RuntimeException`.
- Constructor takes the duplicate email as a `String` and builds a readable message: `"Email already registered: " + email`.

---

## Phase 4 — JWT utility

### Step 6 · `JwtUtil.java`

Package: `com.spendly.util`
Annotation: `@Component`

Inject via `@Value`:
- `${jwt.secret}` → `String secret`
- `${jwt.expiration-ms}` → `long expirationMs`

Build the signing key once in a `@PostConstruct` method:
```
Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret))
```

Public methods:

| Method | Signature | Behaviour |
|---|---|---|
| `generateToken` | `String generateToken(String userId)` | Builds a JWT: subject = userId, issued-at = now, expiry = now + expirationMs, signed with HMAC-SHA256 |
| `extractUserId` | `String extractUserId(String token)` | Parses the token and returns the subject claim |
| `isTokenValid` | `boolean isTokenValid(String token)` | Returns true if the token parses without exception and is not expired; never throws |

- Use `jjwt` 0.12.x API (`Jwts.builder()`, `Jwts.parser()`, `parserBuilder()` is replaced by `parser()` in 0.12).
- `isTokenValid` must catch `JwtException` and return false — it must not propagate exceptions.

---

## Phase 5 — Security filter

### Step 7 · `JwtAuthFilter.java`

Package: `com.spendly.filter`
Extends: `OncePerRequestFilter`
Annotation: `@Component`

Inject: `JwtUtil jwtUtil`

`doFilterInternal` logic:
1. Read the `Authorization` header.
2. If header is null or does not start with `"Bearer "`, call `filterChain.doFilter(request, response)` and return (pass through — no auth context set).
3. Extract the token: `header.substring(7)`.
4. Call `jwtUtil.isTokenValid(token)`.
5. If valid:
   - Extract `userId = jwtUtil.extractUserId(token)`.
   - Create `UsernamePasswordAuthenticationToken(userId, null, emptyList())`.
   - Set `authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request))`.
   - Set in `SecurityContextHolder.getContext().setAuthentication(authentication)`.
6. Continue the chain: `filterChain.doFilter(request, response)`.

**Key constraint**: the filter must never query the database. It only reads the token.

---

## Phase 6 — Security configuration

### Step 8 · `SecurityConfig.java`

Package: `com.spendly.config`
Annotations: `@Configuration`, `@EnableWebSecurity`

Inject: `JwtAuthFilter jwtAuthFilter`

Beans to expose:
- `BCryptPasswordEncoder passwordEncoder()` — used by `UserServiceImpl` and `DataSeeder`

`SecurityFilterChain` setup:
1. Disable CSRF (`csrf.disable()`) — stateless API.
2. Set session management to `STATELESS`.
3. Authorise requests:
   - Permit all on `/auth/**` (public endpoints).
   - Require authentication on everything else (`anyRequest().authenticated()`).
4. Add `jwtAuthFilter` before `UsernamePasswordAuthenticationFilter`.

> **Note**: `DataSeeder` currently instantiates `BCryptPasswordEncoder` directly with `new`. After this step, change it to inject the `BCryptPasswordEncoder` bean from `SecurityConfig` instead, to avoid two separate encoder instances.

---

## Phase 7 — Service layer

### Step 9 · `UserService.java` (interface)

Package: `com.spendly.service`

```java
public interface UserService {
    AuthResponse register(RegisterRequest req);
}
```

This interface will be extended in step 03 (Login) with a `login` method.

### Step 10 · `UserServiceImpl.java`

Package: `com.spendly.service`
Annotations: `@Service`

Inject:
- `UserRepository userRepository`
- `BCryptPasswordEncoder passwordEncoder`
- `JwtUtil jwtUtil`

`register(RegisterRequest req)` logic:
1. Call `userRepository.existsByEmail(req.email())`.
2. If true, throw `EmailAlreadyExistsException(req.email())`.
3. Hash the password: `passwordEncoder.encode(req.password())`.
4. Build a `User` record: `new User(null, req.name(), req.email(), hashedPassword, LocalDateTime.now().toString())`.
5. Persist: `User saved = userRepository.save(user)`.
6. Generate token: `String token = jwtUtil.generateToken(saved.id())`.
7. Map to response: `UserResponse userResponse = UserResponse.from(saved)`.
8. Return `new AuthResponse(token, userResponse)`.

**Raw password must not be logged or stored** — only the hash goes into the `User` record.

---

## Phase 8 — Controller

### Step 11 · `AuthController.java`

Package: `com.spendly.controller`
Annotations: `@RestController`, `@RequestMapping("/auth")`

Inject: `UserService userService`

Endpoint:

```
@PostMapping("/register")
@ResponseStatus(HttpStatus.CREATED)
public AuthResponse register(@Valid @RequestBody RegisterRequest req)
```

- Delegates entirely to `userService.register(req)` — no logic here.
- `@Valid` triggers Bean Validation; validation failures throw `MethodArgumentNotValidException` automatically, caught by `GlobalExceptionHandler`.
- Returns `AuthResponse` directly; Spring serialises it as JSON.

---

## Phase 9 — Exception handler

### Step 12 · `GlobalExceptionHandler.java`

Package: `com.spendly.exception`
Annotation: `@RestControllerAdvice`

Handlers:

| Exception | HTTP status | Response body shape |
|---|---|---|
| `EmailAlreadyExistsException` | 409 Conflict | `{ "error": "<message>" }` |
| `MethodArgumentNotValidException` | 400 Bad Request | `{ "errors": { "fieldName": "message", ... } }` |

For `MethodArgumentNotValidException`, iterate `ex.getBindingResult().getFieldErrors()` and build a `Map<String, String>` of field → defaultMessage.

Use a simple response record or `Map` — no need for a dedicated error class.

---

## Phase 10 — Frontend

### Step 13 · `frontend/src/lib/api.ts`

Create an axios instance:
- `baseURL: '/api'` (Vite proxies this to `localhost:8080`)
- Request interceptor: if `localStorage.getItem('token')` is non-null, attach `Authorization: Bearer <token>` header.

Export the instance as the default export. All API calls in the app use this instance — never a raw `axios` import.

### Step 14 · `frontend/src/app/RegisterPage.tsx`

Component structure:
- Full-page layout matching the landing page's visual style (CSS variables for all colours).
- Spendly logo / branding at the top.
- Form fields: **Full name**, **Email**, **Password**, **Confirm password**.
- Submit button: "Create account".
- Link at the bottom: "Already have an account? Sign in" → `/login`.

State:
- One state object for all field values: `name`, `email`, `password`, `confirmPassword`.
- `error: string | null` — inline error message.
- `loading: boolean` — disables submit button while request is in flight.

Submit handler logic:
1. Client-side guard: if `password !== confirmPassword`, set `error = "Passwords do not match"` and return.
2. Set `loading = true`, clear `error`.
3. Call `api.post('/auth/register', { name, email, password })`.
4. On success (201):
   - Store `localStorage.setItem('token', response.data.token)`.
   - Store `localStorage.setItem('user', JSON.stringify(response.data.user))`.
   - Navigate to `/dashboard` using `useNavigate()`.
5. On error:
   - 409: set `error` to the message from `response.data.error`.
   - 400: set `error` to the first field error from `response.data.errors`.
   - Other: set `error = "Something went wrong. Please try again."`.
6. Set `loading = false`.

Style rules:
- Use only CSS variables (`var(--brand-green)`, `var(--page-bg)`, `var(--destructive)`, `var(--border)`) — no hardcoded hex values.
- Error message rendered in `var(--destructive)` colour below the form.

### Step 15 · Modify `frontend/src/app/App.tsx`

- Import `RegisterPage` from `./RegisterPage`.
- Replace:
  ```tsx
  <Route path="/register" element={<div style={{ padding: '2rem' }}>Register page — coming soon</div>} />
  ```
  with:
  ```tsx
  <Route path="/register" element={<RegisterPage />} />
  ```
- No other changes to `App.tsx`.

---

## Phase 11 — Verification

Run through each item in the spec's **Definition of done** checklist in order:

1. Start the backend: `cd backend && mvn spring-boot:run` — confirm no startup errors.
2. Test `POST /api/auth/register` (e.g. with curl or Postman):
   - Valid payload → 201, JWT in `token`, `user` object without `passwordHash`.
   - Same email again → 409 with `error` message.
   - Missing `name` → 400 with `errors.name` field.
   - `password` shorter than 8 chars → 400 with `errors.password` field.
3. Start the frontend: `cd frontend && npm run dev`.
4. Navigate to `http://localhost:5173/register` — form renders correctly.
5. Submit with valid data — check `localStorage` in DevTools for `token` and `user`, check redirect to `/dashboard`.
6. Submit with a duplicate email — error appears inline on the page, no browser alert.
7. Submit with empty fields — validation error shown.
8. Navigate to `/register` without a token — page loads (not a 401 redirect).

---

## Risk notes

- **`DataSeeder` uses `new BCryptPasswordEncoder()`** — after `SecurityConfig` exposes the bean, inject it instead to avoid two encoder instances.
- **jjwt 0.12 API** differs from 0.11 (`parserBuilder()` is gone; use `Jwts.parser()`). Verify against the exact version in `pom.xml` (0.12.6).
- **CORS**: Vite's dev proxy handles CORS in development. No CORS config is needed in Spring for local dev, but adding `@CrossOrigin` or a `CorsConfigurationSource` bean may be needed when deploying to production — out of scope for this step.
- **`/dashboard` route**: the spec says redirect there on success, but the route doesn't exist yet. The redirect will hit the catch-all in `App.tsx`. This is acceptable for this step; the dashboard is a future feature.
