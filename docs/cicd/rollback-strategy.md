# Rollback Strategy

## When to Roll Back

Roll back when a production deployment causes a regression, outage, or security incident that cannot be hotfixed quickly.

## Frontend Rollback (Vercel)

Every Vercel deployment is immutable and retained indefinitely.

1. Go to the Vercel project dashboard.
2. Click **Deployments**.
3. Find the last known-good deployment.
4. Click **⋮ → Promote to Production**.

This instantly switches the production domain to the selected deployment. No rebuild occurs — it is instantaneous.

## Backend Rollback (Railway)

1. Go to the Railway backend service.
2. Click **Deployments**.
3. Find the last known-good deployment (green checkmark).
4. Click it, then click **Redeploy**.

Railway rebuilds and restarts from the selected deployment's image. The previous deployment remains live until the redeployed one passes its health check.

## Git-Level Rollback

For a clean audit trail, prefer reverting over force-pushing:

```bash
git revert <bad-commit-sha>
git push origin main
```

This creates a new commit that undoes the bad change, which then triggers a fresh CI run and deployment. Force-pushing to `main` should be avoided — it rewrites history visible to other contributors.

## Database Rollback

Spendly does not yet use a database migration framework (Flyway/Liquibase). Until one is introduced:

- All schema changes must be **additive and backward-compatible** (add columns/collections, never rename or drop while old code may still be running).
- If a bad migration is deployed, rolling back the application code is safe only if the migration did not remove or rename data that the previous version requires.
- A destructive migration requires a manual database restore from a backup before rolling back the application.

This is a known gap. Introducing Flyway or Liquibase in a future spec will enable automated, reversible migrations.
