# Spendly Deployment Architecture

## Overview

Spendly uses:

- React + Vite frontend
- Spring Boot backend
- GitHub Actions CI/CD
- Vercel frontend hosting
- Railway backend hosting

## Architecture Flow

Users
↓
Vercel Frontend
↓ HTTPS API Calls
Railway Spring Boot Backend
↓
Production Database

## CI/CD Flow

Feature Branch
↓
Pull Request
↓
GitHub Actions
├── Frontend Validation
├── Backend Validation
└── Build Verification
↓
Merge to Main
↓
Production Deployment

## Security

Frontend:
- No secrets in source code
- API URLs via env variables

Backend:
- JWT secret via env variables
- Database credentials secured
- Production CORS enabled