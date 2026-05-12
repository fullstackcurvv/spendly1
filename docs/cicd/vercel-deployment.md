# Vercel Deployment Guide

## Overview

The React frontend is deployed on Vercel. Every push to `main` triggers an automatic production deployment. Every pull request gets an isolated preview deployment with its own URL.

## Initial Setup

### 1. Create a Vercel Project

1. Log in at [vercel.com](https://vercel.com) and click **Add New → Project**.
2. Import the GitHub repository (`spendly`).
3. Set **Root Directory** to `frontend`.
4. Vercel auto-detects Vite — confirm the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm ci`
5. Click **Deploy**.

### 2. Configure Environment Variables

In the Vercel project, go to **Settings → Environment Variables** and add:

| Variable | Value | Environments |
|---|---|---|
| `VITE_API_BASE_URL` | `https://<your-railway-app>.up.railway.app` | Production |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Development, Preview |
| `VITE_APP_ENV` | `production` | Production |
| `VITE_APP_ENV` | `development` | Development, Preview |
| `VITE_ENABLE_ANALYTICS` | `false` | All |

Do **not** use `.env` files for production secrets — Vercel's environment variables are encrypted at rest.

## Automatic Deployments

| Trigger | Result |
|---|---|
| Push to `main` | New production deployment |
| Push to any other branch / open PR | Preview deployment with unique URL |

## Manual Redeploy

1. Go to the Vercel project dashboard.
2. Click **Deployments**.
3. Find the desired deployment and click **⋮ → Redeploy**.

## Preview Deployments

Every PR automatically gets a preview URL (e.g. `https://spendly-git-feature-branch.vercel.app`). Vercel posts the URL as a GitHub PR comment. The preview uses the Preview environment variables configured above.
