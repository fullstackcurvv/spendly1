# Plan: CI/CD and Production Deployment (Spec 08)

## Context

Spendly had no CI/CD infrastructure. PRs merged to `main` without validation, the JWT secret was hardcoded in `application.yml`, and there were no deployment configuration files for Railway (backend) or Vercel (frontend). This plan established the full pipeline so that every PR is validated automatically and every `main` merge deploys to production safely.

---

## What Was Missing

| Asset | State Before |
|---|---|
| `.github/workflows/` | Did not exist |
| `backend/railway.toml` | Did not exist |
| `frontend/.env.example` | Did not exist |
| `docs/cicd/production-checklist.md` | Existed but incomplete (frontend only) |
| `docs/architecture/deployment-architecture.md` | Existed, skeleton only |
| `backend/src/main/resources/application.yml` | JWT secret hardcoded |

---

## Implementation Steps

### Step 1 — Externalize JWT Secret (`application.yml`)

Replace hardcoded `jwt.secret` with environment variable references using Spring's `${VAR:fallback}` syntax. The fallback keeps local dev working; Railway overrides it.

```yaml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:mongodb}

jwt:
  secret: ${JWT_SECRET:<dev-fallback>}
  expiration-ms: ${JWT_EXPIRATION:86400000}
```

**File:** `backend/src/main/resources/application.yml`

---

### Step 2 — GitHub Actions CI Workflow

**File:** `.github/workflows/ci.yml`

Triggers: `push` to any branch, `pull_request` targeting `main`.

Two parallel jobs:

**`frontend-ci`:**
- `actions/checkout@v4`
- `actions/setup-node@v4` (Node 20, npm cache)
- `npm ci`
- `npm run build` — catches TypeScript + Vite build failures

**`backend-ci`:**
- `actions/checkout@v4`
- `actions/setup-java@v4` (Java 17, Temurin)
- `actions/cache@v4` (Maven `~/.m2`)
- `mvn compile`
- `mvn package -DskipTests`

Branch protection for `main` must be configured manually in GitHub Settings → Branches.

---

### Step 3 — Railway Deployment Configuration

**File:** `backend/railway.toml`

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "java -jar target/*.jar"
healthcheckPath = "/api/auth/login"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

Railway environment variables:
- `SPRING_PROFILES_ACTIVE`, `JWT_SECRET`, `JWT_EXPIRATION`
- `DATABASE_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `FRONTEND_URL`

---

### Step 4 — Frontend Environment Variable Template

**File:** `frontend/.env.example`

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_ENV=development
VITE_ENABLE_ANALYTICS=false
```

In Vercel, set `VITE_API_BASE_URL` to the Railway backend URL.

---

### Step 5 — Documentation Files

| File | Contents |
|---|---|
| `docs/cicd/github-actions.md` | CI job structure, reading logs, branch protection setup |
| `docs/cicd/vercel-deployment.md` | Vercel setup, env vars, preview deployments, redeploy |
| `docs/cicd/railway-deployment.md` | Railway setup, database provisioning, env vars, logs |
| `docs/cicd/secrets-management.md` | Where secrets live per platform, rotation procedure |
| `docs/cicd/rollback-strategy.md` | Vercel/Railway rollback steps, git revert, DB caveats |
| `docs/cicd/production-checklist.md` | Updated with Backend, Secrets, Go-Live sections |

---

## Files Changed

| Action | File |
|---|---|
| Modified | `backend/src/main/resources/application.yml` |
| Created | `.github/workflows/ci.yml` |
| Created | `backend/railway.toml` |
| Created | `frontend/.env.example` |
| Created | `docs/cicd/github-actions.md` |
| Created | `docs/cicd/vercel-deployment.md` |
| Created | `docs/cicd/railway-deployment.md` |
| Created | `docs/cicd/secrets-management.md` |
| Created | `docs/cicd/rollback-strategy.md` |
| Modified | `docs/cicd/production-checklist.md` |

---

## Verification

| DoD Item | How to Verify |
|---|---|
| Frontend CI documented | `docs/cicd/github-actions.md` — frontend-ci job covered |
| Backend CI documented | `docs/cicd/github-actions.md` — backend-ci job covered |
| Railway deployment documented | `docs/cicd/railway-deployment.md` exists |
| Vercel deployment documented | `docs/cicd/vercel-deployment.md` exists |
| Secrets management documented | `docs/cicd/secrets-management.md` exists |
| Rollback strategy documented | `docs/cicd/rollback-strategy.md` exists |
| No secrets in repo | `application.yml` uses `${JWT_SECRET:fallback}` |
| CI workflow valid | Push a branch — GitHub Actions tab shows both jobs running |
