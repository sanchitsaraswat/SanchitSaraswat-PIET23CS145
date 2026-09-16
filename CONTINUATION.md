# Continuation handoff

## Goal

Complete and validate the Habitly Codespaces submission from the supplied production-grade brief.

## Implemented

- Workspace monorepo with React/Vite/Tailwind frontend and Express/Prisma backend.
- PostgreSQL schema and checked-in initial migration.
- Registration, login, refresh-token rotation, logout, current-user endpoint.
- Ownership-scoped habit CRUD API foundations, archive/restore, server-side search and pagination, completion idempotency, dashboard endpoint.
- Pure schedule/date/streak modules and initial Vitest streak tests.
- React auth, dashboard, habits creation/search, archive/restore screens.
- Codespaces dev-container configuration, protected completion-history endpoint, and a habit edit/detail screen.
- Docker/Compose, environment template, README, reasoning, and AI-log placeholder.

## Before calling this complete

1. Run `npm install` from repository root (network access needed), then `npm run prisma:generate --workspace backend`. On 2026-09-16, a verification install was attempted but npm failed with `ECONNRESET` while downloading from `registry.npmjs.org`; no test or production build has therefore been executed.
2. Copy `.env.example` to `.env`; replace JWT example values with distinct secrets.
3. Run `docker compose up -d postgres`, then `npm run prisma:deploy --workspace backend`.
4. Run `npm test`, `npm run build`, and `npm run dev`; exercise registration/login, create, complete/undo, archive/restore, search, and persistence.
5. Fix any install/build issues caused by package-version drift.
6. Add API integration tests with a disposable PostgreSQL database. The UI habit edit/detail page is now implemented; validate it manually after dependencies install.
7. Paste the actual raw AI conversation into `AI_LOGS.md` only at submission time.

## Important known limitation

The dashboard uses a `limit: 100` active-habit query because it must evaluate schedule and streak data. A production scale follow-up should use a dedicated repository query that returns only habits scheduled for today and summarizes streak data efficiently.

## Verification performed without npm dependencies

- `node --check` passed for every backend source module.
- Direct domain execution confirmed Friday → Monday remains a consecutive weekday streak (`current: 2`, `best: 2`).
