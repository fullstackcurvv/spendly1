# Plan: 01 — Database Setup

## Goal

Establish the data-layer foundation for Spendly: domain models, repository interfaces, and three pluggable DB adapters (MongoDB, PostgreSQL, SQL Server), plus seed data on startup.

---

## Files Created

### Maven build
| File | Purpose |
|---|---|
| `backend/pom.xml` | Spring Boot 3.3.0 parent; declares web, security, validation, data-mongodb, data-jpa, postgresql, mssql-jdbc, jjwt 0.12.6 |

### Application entry point
| File | Purpose |
|---|---|
| `backend/src/main/java/com/spendly/SpendlyApplication.java` | `@SpringBootApplication` bootstrap |

### Domain models (`model/`)
DB-agnostic Java records — no persistence annotations.

| File | Notes |
|---|---|
| `model/User.java` | `id, name, email, passwordHash, createdAt` — all `String` |
| `model/Expense.java` | `id, userId, amount (BigDecimal), category, date, description, createdAt` |
| `model/ExpenseCategory.java` | Enum: `FOOD TRANSPORT BILLS HEALTH ENTERTAINMENT SHOPPING OTHER` |

### Repository interfaces (`repository/`)
Define the contract; adapters provide the implementation.

| File | Methods |
|---|---|
| `repository/UserRepository.java` | `save, findById, findByEmail, findAll, deleteById, existsByEmail` |
| `repository/ExpenseRepository.java` | `save, findById, findByUserId, deleteById` |

### MongoDB adapter (`repository/mongodb/`)
Active when `spring.profiles.active=mongodb`.

| File | Role |
|---|---|
| `UserMongoDocument.java` | `@Document(collection="users")` with `@Indexed(unique=true)` on email |
| `UserMongoRepo.java` | `extends MongoRepository<UserMongoDocument, String>` (package-private) |
| `UserMongoAdapter.java` | `@Repository @Profile("mongodb")` — maps document ↔ domain `User` |
| `ExpenseMongoDocument.java` | `@Document(collection="expenses")` with `@Indexed` on `user_id` |
| `ExpenseMongoRepo.java` | `extends MongoRepository<ExpenseMongoDocument, String>` (package-private) |
| `ExpenseMongoAdapter.java` | `@Repository @Profile("mongodb")` — maps document ↔ domain `Expense` |

### JPA shared entities (`repository/jpa/`)
Used by both the PostgreSQL and SQL Server adapters.

| File | Notes |
|---|---|
| `UserJpaEntity.java` | `@Entity @Table(name="users")` — `id` is `Long IDENTITY`, unique constraint on `email` |
| `ExpenseJpaEntity.java` | `@Entity @Table(name="expenses")` — `@ManyToOne` FK to `UserJpaEntity` enforces referential integrity |
| `UserJpaRepo.java` | `extends JpaRepository<UserJpaEntity, Long>` — `findByEmail`, `existsByEmail` |
| `ExpenseJpaRepo.java` | `extends JpaRepository<ExpenseJpaEntity, Long>` — JPQL `findByUserId(Long)` traversing the `@ManyToOne` |

### PostgreSQL adapter (`repository/postgresql/`)
Active when `spring.profiles.active=postgresql`.

| File | Notes |
|---|---|
| `UserPostgresAdapter.java` | `@Profile("postgresql")` — converts `Long id` ↔ `String id` |
| `ExpensePostgresAdapter.java` | `@Profile("postgresql")` — looks up `UserJpaEntity` before saving to enforce FK |

### SQL Server adapter (`repository/sqlserver/`)
Active when `spring.profiles.active=sqlserver`. Same logic as PostgreSQL adapters; JPA entities are reused.

| File | Notes |
|---|---|
| `UserSqlServerAdapter.java` | `@Profile("sqlserver")` |
| `ExpenseSqlServerAdapter.java` | `@Profile("sqlserver")` |

### Config (`config/`)

| File | Purpose |
|---|---|
| `MongoConfig.java` | `@Profile("mongodb") @EnableMongoRepositories(basePackages="…mongodb")` — restricts MongoDB repo scan to the `mongodb` package |
| `JpaConfig.java` | `@Profile("postgresql","sqlserver") @EnableJpaRepositories(basePackages="…jpa")` — restricts JPA repo scan to the `jpa` package |
| `DataSeeder.java` | `ApplicationRunner` — on startup, if `demo@spendly.com` is absent, inserts 1 demo user (BCrypt-hashed password `demo1234`) + 8 sample expenses across all 7 categories |

### Resources

| File | Purpose |
|---|---|
| `application.yml` | Sets default active profile to `mongodb`; port 8080, context-path `/api` |
| `application-mongodb.yml` | MongoDB URI; excludes JPA/DataSource auto-configs so they don't fail without a JDBC URL |
| `application-postgresql.yml` | JDBC URL + Hibernate dialect; excludes MongoDB auto-configs |
| `application-sqlserver.yml` | JDBC URL (SQL Server) + Hibernate dialect; excludes MongoDB auto-configs |

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Domain models as Java records | Immutable, no-boilerplate value objects; adapters handle all mutation |
| `id` as `String` in domain models | Unifies MongoDB ObjectId (String) and SQL auto-increment (Long → String conversion in adapter) |
| JPA entities shared between postgres/sqlserver | Both adapters use identical DDL; only the dialect and driver differ |
| `@ManyToOne` on `ExpenseJpaEntity.user` | Gives JPA-managed FK constraint, enforcing referential integrity without manual DDL |
| `@EnableMongoRepositories` / `@EnableJpaRepositories` scoped by profile | Prevents Spring Boot from scanning and registering the wrong DB repos for the active profile |
| Auto-config exclusions in profile YAMLs | Ensures no failed DataSource or MongoDB auto-config attempts when the other DB type is active |
| `DataSeeder` idempotent check | Guards against duplicate seed data on repeated restarts |

---

## Definition of Done

- [x] Domain models (`User`, `Expense`, `ExpenseCategory`) created — DB-agnostic
- [x] `UserRepository` and `ExpenseRepository` interfaces defined
- [x] MongoDB adapter: documents, Spring Data repos, and adapters
- [x] JPA entities and Spring Data repos (shared by postgres + sqlserver)
- [x] PostgreSQL adapter
- [x] SQL Server adapter
- [x] `MongoConfig` and `JpaConfig` restrict repository scanning by profile
- [x] `DataSeeder` seeds demo user + 8 expenses on first startup (idempotent)
- [x] Four `application*.yml` files with correct DB config and auto-config exclusions
- [x] `pom.xml` with all required dependencies

---

## Next Steps

The following layers are not yet implemented and depend on this foundation:

1. **Auth layer** — `JwtAuthFilter`, `JwtUtil`, `SecurityConfig`, `AuthController`, `UserService`
2. **User API** — `UserController` (`GET /users/me`, `PATCH /users/me`, `PATCH /users/me/password`)
3. **Expense API** — `ExpenseController` + `ExpenseService` (endpoints not yet designed)
