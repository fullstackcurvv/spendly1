# Spendly Production Deployment Checklist

## Frontend (Vercel)

- [ ] Vercel project connected to GitHub repo, root directory set to `frontend`
- [ ] `VITE_API_BASE_URL` set to Railway backend URL
- [ ] `VITE_APP_ENV` set to `production`
- [ ] `VITE_ENABLE_ANALYTICS` configured
- [ ] Production build succeeds (`npm run build`)
- [ ] Preview deployments enabled for PRs

## Backend (Railway)

- [ ] Railway project connected to GitHub repo, root directory set to `backend`
- [ ] `SPRING_PROFILES_ACTIVE` set (`postgresql` or `mongodb`)
- [ ] `JWT_SECRET` set to a strong random value (not the dev fallback)
- [ ] `JWT_EXPIRATION` set
- [ ] `DATABASE_URL`, `DB_USERNAME`, `DB_PASSWORD` configured
- [ ] `FRONTEND_URL` set to Vercel production URL
- [ ] Health check passing on Railway deploy

## CI / GitHub Actions

- [ ] `.github/workflows/ci.yml` merged to `main`
- [ ] `Frontend Validation` job passes on a test PR
- [ ] `Backend Validation` job passes on a test PR
- [ ] Branch protection rule enabled for `main` requiring both jobs

## Secrets

- [ ] No secrets committed to source control
- [ ] `JWT_SECRET` rotated from dev fallback value
- [ ] `.env.local` added to `.gitignore` (Vite default covers this)

## Go-Live

- [ ] Backend accessible at Railway URL (e.g. `POST /api/auth/login` returns 200)
- [ ] Frontend accessible at Vercel URL
- [ ] Login flow works end-to-end in production
- [ ] CORS allows requests from Vercel domain
