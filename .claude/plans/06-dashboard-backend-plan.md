# Plan: Dashboard Backend (Step 06)

## Context
The Spendly dashboard frontend (already built in `feature/06-dashboard`) needs live expense data from the API. The `ExpenseRepository` interface and all three DB adapters (MongoDB, PostgreSQL, SQL Server) already exist. This step wires up the missing service layer (`ExpenseService` / `ExpenseServiceImpl`) and `ExpenseController` to expose five `/api/expenses` endpoints. No DB schema changes are needed; the `DataSeeder` already seeds 8 sample expenses for the demo user.

---

## Files to Create

| File | Role |
|---|---|
| `dto/ExpenseRequest.java` | Validated request body for create/update |
| `dto/ExpenseResponse.java` | Response DTO with `from(Expense)` factory |
| `dto/CategorySummary.java` | Per-category totals DTO |
| `exception/ExpenseNotFoundException.java` | RuntimeException → HTTP 404 |
| `service/ExpenseService.java` | Interface: 5 method signatures |
| `service/ExpenseServiceImpl.java` | `@Service` implementation |
| `controller/ExpenseController.java` | `@RestController @RequestMapping("/expenses")` |

## Files to Modify

| File | Change |
|---|---|
| `exception/GlobalExceptionHandler.java` | Add `@ExceptionHandler(ExpenseNotFoundException.class)` → 404 |

---

## Existing Patterns to Follow

- **DTOs**: Java records; response DTOs have `static T from(DomainModel)` (see `UserResponse.java`)
- **Request DTOs**: Records with Jakarta validation annotations + explicit messages (see `RegisterRequest.java`)
- **Exceptions**: `RuntimeException` subclass, no-arg constructor, hardcoded message (see `UserNotFoundException.java`)
- **GlobalExceptionHandler**: Returns `Map<String, String>` for errors (see existing handlers)
- **Controller**: Injects `UserService`; reads `(String) auth.getPrincipal()` for userId (see `UserController.java`)
- **Service**: `@Service` with constructor injection, implements interface (see `UserServiceImpl.java`)
- **Security**: `anyRequest().authenticated()` in `SecurityConfig` already protects `/expenses/**` — no changes needed

---

## Implementation Split (3 Parallel Subagents)

Work is divided so each subagent owns distinct files with no write conflicts.

### Subagent 1 — Transaction History Routes
**Owns**: foundation DTOs + exception + CRUD endpoints

Files to create:
- `dto/ExpenseRequest.java`
- `dto/ExpenseResponse.java`
- `exception/ExpenseNotFoundException.java`
- `service/ExpenseService.java` (full interface, all 5 signatures)
- `service/ExpenseServiceImpl.java` — implement 4 CRUD methods only; stub `getSummary` as `throw new UnsupportedOperationException()`
- `controller/ExpenseController.java` — 4 CRUD endpoints only

Files to modify:
- `exception/GlobalExceptionHandler.java` — add ExpenseNotFoundException handler

Endpoints delivered:
- `GET /api/expenses` → `expenseService.getExpenses(userId)` → 200 `List<ExpenseResponse>`
- `POST /api/expenses` → `expenseService.createExpense(userId, req)` → 201 `ExpenseResponse`
- `PATCH /api/expenses/{id}` → `expenseService.updateExpense(userId, id, req)` → 200 `ExpenseResponse`
- `DELETE /api/expenses/{id}` → `expenseService.deleteExpense(userId, id)` → 204

### Subagent 2 — Summary Stats Route
**Owns**: `CategorySummary` DTO + fills in `getSummary` in `ExpenseServiceImpl` + adds summary endpoint to `ExpenseController`

Files to create:
- `dto/CategorySummary.java` — record: `String category`, `BigDecimal total`

Files to modify (distinct sections — no overlap with SA1):
- `service/ExpenseServiceImpl.java` — replace the stubbed `getSummary` with real implementation: `expenseRepository.findByUserId(userId)` → stream → `Collectors.groupingBy(category, Collectors.reducing(BigDecimal.ZERO, Expense::amount, BigDecimal::add))` → map to `List<CategorySummary>`
- `controller/ExpenseController.java` — add `GET /api/expenses/summary` endpoint method

Endpoint delivered:
- `GET /api/expenses/summary` → `expenseService.getSummary(userId)` → 200 `List<CategorySummary>`

### Subagent 3 — Category Breakdown Route
**Owns**: category-filtered expense list endpoint

Files to modify (distinct section — no overlap with SA1 or SA2):
- `service/ExpenseService.java` — add `List<ExpenseResponse> getExpensesByCategory(String userId, ExpenseCategory category)` signature
- `service/ExpenseServiceImpl.java` — implement: `findByUserId(userId)` → filter by category → map to `ExpenseResponse`
- `controller/ExpenseController.java` — add `GET /api/expenses?category={CATEGORY}` as an optional query param on the list endpoint (use `@RequestParam(required = false) ExpenseCategory category`); if present filter, else return all

Endpoint delivered:
- `GET /api/expenses?category=FOOD` → 200 filtered `List<ExpenseResponse>`

> Note: SA3's work extends SA1's list endpoint with an optional query param rather than a new route — zero conflict with SA1's endpoint method since SA3 replaces it with the extended version.

---

## Detailed Specs

### ExpenseRequest.java
```java
public record ExpenseRequest(
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    BigDecimal amount,

    @NotNull(message = "Category is required")
    ExpenseCategory category,

    @NotBlank(message = "Date is required")
    String date,

    String description
) {}
```

### ExpenseResponse.java
```java
public record ExpenseResponse(
    String id, String userId, BigDecimal amount,
    ExpenseCategory category, String date, String description, String createdAt
) {
    public static ExpenseResponse from(Expense e) {
        return new ExpenseResponse(e.id(), e.userId(), e.amount(),
            e.category(), e.date(), e.description(), e.createdAt());
    }
}
```

### ExpenseService interface (all 5 methods)
```java
List<ExpenseResponse> getExpenses(String userId);
ExpenseResponse createExpense(String userId, ExpenseRequest req);
ExpenseResponse updateExpense(String userId, String id, ExpenseRequest req);
void deleteExpense(String userId, String id);
List<CategorySummary> getSummary(String userId);
```

### Ownership / ownership check pattern (updateExpense, deleteExpense)
```java
Expense expense = expenseRepository.findById(id)
    .orElseThrow(ExpenseNotFoundException::new);
if (!expense.userId().equals(userId)) throw new ExpenseNotFoundException();
```

### getSummary in-memory aggregation
```java
return expenseRepository.findByUserId(userId).stream()
    .collect(Collectors.groupingBy(
        e -> e.category().name(),
        Collectors.reducing(BigDecimal.ZERO, Expense::amount, BigDecimal::add)
    ))
    .entrySet().stream()
    .map(entry -> new CategorySummary(entry.getKey(), entry.getValue()))
    .toList();
```

---

## Execution Order

Because SA2 and SA3 modify files SA1 creates, the order must be:

1. **SA1 runs first** — creates all new files with CRUD methods + stubs for SA2/SA3 sections
2. **SA2 and SA3 run in parallel** — each fills in its own stub section (no file conflicts between them)

---

## Verification

1. Start backend: `cd backend && mvn spring-boot:run`
2. Login as demo user → copy Bearer token
3. `GET /api/expenses` → 200, array of 8
4. `POST /api/expenses` with `{ "amount": 20, "category": "FOOD", "date": "2025-05-10" }` → 201
5. `PATCH /api/expenses/{newId}` with `{ "amount": 25, "category": "FOOD", "date": "2025-05-10" }` → 200
6. `DELETE /api/expenses/{newId}` → 204
7. `GET /api/expenses/summary` → 200, list with correct per-category totals
8. `GET /api/expenses?category=FOOD` → 200, filtered list
9. All endpoints without token → 403
10. `POST /api/expenses` without `amount` → 400 with validation errors

Also save to project `.claude/plans/06-dashboard-backend-plan.md` after exiting plan mode.
