# Secrets Management

## Rule

No secret is ever committed to the repository. All sensitive values are injected at runtime via environment variables.

## Secret Locations by Platform

### Local Development

Copy `frontend/.env.example` to `frontend/.env.local` (gitignored by Vite's default `.gitignore`).

The backend reads secrets from environment variables with fallback defaults defined in `application.yml`:

```yaml
jwt:
  secret: ${JWT_SECRET:c3BlbmRseS1...}   # fallback is a dev-only value
```

The fallback is safe for local development only. It must never be used in production.

### GitHub Actions

Secrets used by CI workflows are stored in **Settings → Secrets and variables → Actions** in the GitHub repository. The current CI pipeline does not deploy and therefore does not need any secrets. If a future deployment step is added to the workflow, add the required secrets there.

### Vercel (Frontend)

Set environment variables in **Settings → Environment Variables** in the Vercel project dashboard. Variables are encrypted and injected at build time. Never add secrets to `.env.production` or any committed file.

### Railway (Backend)

Set environment variables in the **Variables** tab of the Railway service. Railway encrypts them at rest and injects them as process environment variables at runtime. Never put secrets in `railway.toml`.

## Secret Rotation Procedure

1. Generate the new secret value.
2. Update the secret in Railway (or Vercel) via the dashboard.
3. Trigger a redeploy — Railway and Vercel automatically restart when variables change.
4. Verify the service is healthy before considering the rotation complete.
5. If the old secret was also stored in GitHub Actions secrets, update it there too.

## What Counts as a Secret

| Value | Secret? |
|---|---|
| `JWT_SECRET` | Yes — rotate if exposed |
| `DB_PASSWORD` | Yes |
| `DATABASE_URL` (contains credentials) | Yes |
| `VITE_API_BASE_URL` | No — public URL |
| `SPRING_PROFILES_ACTIVE` | No — not sensitive |
| `JWT_EXPIRATION` | No — not sensitive |
