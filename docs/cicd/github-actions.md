# GitHub Actions CI Pipeline

## Overview

The CI pipeline lives at `.github/workflows/ci.yml` and runs on every push and on every pull request targeting `main`. It has two independent jobs that run in parallel.

## Jobs

### `frontend-ci` — Frontend Validation

| Step | What it does |
|---|---|
| `actions/checkout@v4` | Checks out the repository |
| `actions/setup-node@v4` (Node 20) | Installs Node.js with npm cache |
| `npm ci` | Installs exact dependency versions from lockfile |
| `npm run build` | Runs `tsc -b && vite build` — catches TypeScript errors and Vite build failures |

A failure here means a type error or a broken import exists in the frontend code.

### `backend-ci` — Backend Validation

| Step | What it does |
|---|---|
| `actions/checkout@v4` | Checks out the repository |
| `actions/setup-java@v4` (Java 17, Temurin) | Installs JDK |
| `actions/cache@v4` | Caches `~/.m2` to speed up dependency downloads |
| `mvn compile` | Validates Java compilation |
| `mvn package -DskipTests` | Builds the executable JAR |

A failure here means a compilation error exists in the backend code.

## Reading Workflow Logs

1. Go to the repository on GitHub.
2. Click the **Actions** tab.
3. Select the failing workflow run from the list.
4. Expand the failing job and step to see the full error output.

## Setting Up Branch Protection (Required)

Branch protection ensures PRs cannot merge unless both CI jobs pass.

1. Go to **Settings → Branches** in the GitHub repository.
2. Click **Add branch protection rule**.
3. Set **Branch name pattern** to `main`.
4. Enable **Require status checks to pass before merging**.
5. Search for and add both `Frontend Validation` and `Backend Validation`.
6. Enable **Require branches to be up to date before merging**.
7. Click **Save changes**.

After this, GitHub blocks the merge button until CI is green.
