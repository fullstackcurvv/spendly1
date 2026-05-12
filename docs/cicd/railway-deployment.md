# Railway Deployment Guide

## Overview

The Spring Boot backend is deployed on Railway. Every push to `main` triggers an automatic build and deployment using the configuration in `backend/railway.toml`.

## Initial Setup

### 1. Create a Railway Project

1. Log in at [railway.app](https://railway.app) and click **New Project**.
2. Select **Deploy from GitHub repo** and choose the `spendly` repository.
3. Set the **Root Directory** to `backend`.
4. Railway detects the Maven project via Nixpacks and uses `railway.toml` for build/start config.

### 2. Provision a Database

For the PostgreSQL adapter:

1. In the Railway project, click **New → Database → PostgreSQL**.
2. Railway creates a managed Postgres instance and exposes `DATABASE_URL` as a linked variable.
3. In the backend service, go to **Variables** and add a reference to `${{Postgres.DATABASE_URL}}`.

For MongoDB, use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) and paste the connection string as `DATABASE_URL`.

### 3. Configure Environment Variables

In the Railway backend service, go to **Variables** and set:

| Variable | Value |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `postgresql` (or `mongodb`) |
| `JWT_SECRET` | A strong random secret (min 32 chars) — see secrets guide |
| `JWT_EXPIRATION` | `86400000` (24 hours in ms) |
| `DATABASE_URL` | Auto-linked from Railway Postgres, or Atlas URI |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `FRONTEND_URL` | `https://<your-vercel-app>.vercel.app` |

These variables override the fallback values in `application.yml`.

### `railway.toml` Reference

```toml
[build]
builder = "NIXPACKS"          # Railway auto-detects Maven

[deploy]
startCommand = "java -jar target/*.jar"
healthcheckPath = "/api/auth/login"   # Public endpoint used as health probe
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

## Automatic Deployments

Every push to `main` triggers a new Railway build. The previous deployment stays live until the new one passes its health check.

## Manual Redeploy

1. Go to the Railway service.
2. Click **Deployments**.
3. Click **Deploy** on any previous successful deployment to reuse it.

## Viewing Logs

1. Open the Railway service.
2. Click **Logs** to see real-time stdout/stderr from the Spring Boot process.
3. Use the search bar to filter by log level (e.g. `ERROR`).
