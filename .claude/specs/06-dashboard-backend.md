# Spec: Dashboard Backend

## Overview
This feature implements the expense REST API that the dashboard frontend consumes. It exposes five endpoints under `/api/expenses` — list, create, update, delete, and a per-category summary — all protected by Bearer token. The `ExpenseRepository` interface and all three DB adapters (MongoDB, PostgreSQL, SQL Server) are already in place from Step 01; this step adds the service layer (`ExpenseService` / `ExpenseServiceImpl`) and `ExpenseController` on top, making expense data accessible over HTTP. The `DataSeeder` already seeds 8 sample expenses for the demo user, so all endpoints can be tested immediately after starting the backend.

## Depends on
- Step 01 — Database Setup: `Expense` model, `ExpenseCategory` enum, `ExpenseRepository` interface, and all three DB adapters. `DataSeeder` seeds 8 sample expenses.
- Step 02 — Registration: `JwtUtil`, `JwtAuthFilter`, `SecurityConfig`, and the stateless JWT auth pipeline.
- Step 04 — Login and Logout: Convention that the Spring Security principal is the userId String set by `JwtAuthFilter`.
- Step 05 — Profile Page: `UserController` pattern for reading `(String) auth.getPrincipal()`.

## Routes
- `GET /api/expenses` — return all expenses for the authenticated user — logged-in (Bearer)
- `POST /api/expenses` — create a new expense for the authenticated user — logged-in (Bearer)
- `PATCH /api/expenses/{id}` — update an existing expense (ownership verified) — logged-in (Bearer)
- `DELETE /api/expenses/{id}` — delete an expense (ownership verified), returns 204 No Content — logged-in (Bearer)
- `GET /api/expenses/summary` — return per-category spending totals for the authenticated user — logged-in (Bearer)

## Database changes
No database changes. `ExpenseRepository`, `ExpenseMongoAdapter`, `ExpensePostgresAdapter`, and `ExpenseSqlServerAdapter` are all fully implemented. No new repository methods are needed.

## Templates
No templates — this is a pure REST API feature.

## Files to change
- `backend/src/main/java/com/spendly/exception/GlobalExceptionHandler.java` — add `@ExceptionHandler` for `ExpenseNotFoundException` → HTTP 404 `{ "error": "Expense not found" }`

## Files to create
- `backend/src/main/java/com/spendly/dto/ExpenseRequest.java` — record with `amount` (`@NotNull @Positive BigDecimal`), `category` (`@NotNull ExpenseCategory`), `date` (`@NotBlank String`), `description` (nullable `String`)
- `backend/src/main/java/com/spendly/dto/ExpenseResponse.java` — record mirroring the `Expense` domain model; static `from(Expense)` factory method
- `backend/src/main/java/com/spendly/dto/CategorySummary.java` — record with `category` (`String`) and `total` (`BigDecimal`)
- `backend/src/main/java/com/spendly/exception/ExpenseNotFoundException.java` — `RuntimeException` subclass, no extra fields
- `backend/src/main/java/com/spendly/service/ExpenseService.java` — interface declaring: `getExpenses`, `createExpense`, `updateExpense`, `deleteExpense`, `getSummary`
- `backend/src/main/java/com/spendly/service/ExpenseServiceImpl.java` — `@Service` implementation with ownership checks on mutating operations
- `backend/src/main/java/com/spendly/controller/ExpenseController.java` — `@RestController @RequestMapping("/expenses")` delegating entirely to `ExpenseService`

## New dependencies
No new dependencies.

## Rules for implementation
- Controller → Service → Repository layering is strict; zero business logic in `ExpenseController`
- `ExpenseController` reads userId via `(String) auth.getPrincipal()`, following the identical pattern as `UserController`
- `GET /api/expenses` returns HTTP 200 with `List<ExpenseResponse>`
- `POST /api/expenses` returns HTTP 201 Created with the new `ExpenseResponse`; use `@ResponseStatus(HttpStatus.CREATED)`
- `PATCH /api/expenses/{id}` returns HTTP 200 with the updated `ExpenseResponse`
- `DELETE /api/expenses/{id}` returns HTTP 204 No Content; use `@ResponseStatus(HttpStatus.NO_CONTENT)`
- `GET /api/expenses/summary` returns HTTP 200 with `List<CategorySummary>`
- Ownership check: `ExpenseServiceImpl.updateExpense` and `deleteExpense` call `expenseRepository.findById(id)`, then verify `expense.userId().equals(userId)`; if mismatch, throw `ExpenseNotFoundException` (404, does not leak existence to other users)
- `ExpenseServiceImpl.createExpense` must set `id = null` and `createdAt = LocalDateTime.now().toString()` before calling `expenseRepository.save()`
- `getSummary` groups the result of `findByUserId(userId)` by category in-memory using streams and sums `BigDecimal` amounts; no new repository methods are needed
- Apply `@Valid` to every `@RequestBody` in `ExpenseController` to activate Bean Validation
- `ExpenseResponse` should include all fields from the `Expense` domain record (`id`, `userId`, `amount`, `category`, `date`, `description`, `createdAt`)

## Definition of done
- [ ] `GET /api/expenses` with the demo user Bearer token returns HTTP 200 and a JSON array of 8 expenses
- [ ] `GET /api/expenses` without a token returns HTTP 403
- [ ] `POST /api/expenses` with `{ "amount": 20.00, "category": "FOOD", "date": "2025-05-10", "description": "Dinner" }` returns HTTP 201 with a generated `id` and `createdAt`
- [ ] `POST /api/expenses` with missing `amount` or `category` returns HTTP 400 (Bean Validation)
- [ ] `PATCH /api/expenses/{id}` with a valid expense id owned by the user returns HTTP 200 with updated fields reflected in the response
- [ ] `PATCH /api/expenses/{id}` with an id belonging to a different user returns HTTP 404
- [ ] `DELETE /api/expenses/{id}` with a valid owned id returns HTTP 204 with no response body
- [ ] `DELETE /api/expenses/{id}` with an id belonging to another user returns HTTP 404
- [ ] `GET /api/expenses/summary` returns HTTP 200 with one entry per category that has expenses; totals are arithmetically correct
- [ ] All five endpoints return HTTP 403 when called without a Bearer token
- [ ] Backend starts without errors on `mvn spring-boot:run` (default MongoDB profile)
