# Habitly — secure habit tracking SaaS

Habitly is a modular-monolith habit tracker with user accounts, schedule-aware completion logging, archive/restore, server-side search, pagination, and streaks that count scheduled occurrences rather than naïve calendar days.

## Stack and architecture

- `frontend/`: React, Vite, Tailwind CSS, React Router, TanStack Query.
- `backend/`: Express REST API arranged by controller, service, repository, validation, domain, and middleware layers.
- PostgreSQL and Prisma: normalized users, habits, scheduled weekdays, completions, and revocable refresh tokens.

The API is a horizontally scalable, stateless modular monolith. PostgreSQL owns all persistent state and integrity rules.

## Prerequisites

Node.js 20+, npm, Docker/Compose, and a PostgreSQL-compatible database. In Codespaces, Docker is already available.

## Quick start

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npm run prisma:generate --workspace backend
npm run prisma:deploy --workspace backend
npm run dev
```

Visit the frontend URL printed by Vite (normally `http://localhost:5173`). The API runs on port 4000. Codespaces will offer a forwarded-port link.

### GitHub Codespaces

Open the repository with **Code → Create codespace on main**. The included dev-container configuration starts PostgreSQL and forwards the API and Vite ports. In the Codespaces terminal, run the Quick start commands above; use the forwarded **5173** preview URL in your browser.

For first-time local development, `npm run prisma:migrate --workspace backend` creates an interactive Prisma migration; the checked-in migration is applied by `prisma:deploy`.

## Environment

Copy `.env.example` to `.env`. Set strong, distinct JWT secrets (32+ characters) before a real deployment. `FRONTEND_URL` must be the browser origin allowed by CORS. The frontend can use `VITE_API_URL` when the API is hosted on a different origin.

## Commands

```bash
npm run dev                 # frontend and API together
npm test                    # unit/component tests
npm run build               # production frontend build + Prisma client
npm run prisma:generate --workspace backend
npm run prisma:deploy --workspace backend
```

## API overview

Authentication: `POST /api/auth/register`, `login`, `refresh`, `logout`; `GET /api/auth/me`.

Habits: `GET/POST /api/habits`, `GET/PATCH /api/habits/:id`, `POST /:id/archive`, `POST /:id/restore`, `POST /:id/completions`, and `DELETE /:id/completions/:date`. Collections accept `page`, `limit`, `q`, and `archived`. `GET /api/dashboard/today` returns only habits scheduled for the authenticated user’s current local day. `GET /health` checks service and database reachability.

## Security

Passwords use bcrypt with 12 rounds. Access tokens are short lived; refresh tokens live in an HTTP-only cookie, are stored only as SHA-256 hashes, rotated on refresh, and revoked on logout. User identity comes solely from a verified access token; every habit lookup is scoped by that identity. Zod validates input, Helmet sets HTTP headers, CORS is explicit, request bodies are bounded, and authentication endpoints are rate limited.

## Scaling notes

The database indexes ownership, archive status, schedule lookup, and completion date. The API paginates habit collections. The dashboard only returns active habits for today; future optimisation can precompute streak projections or add a cache without changing API boundaries.

## Troubleshooting

- **Prisma cannot connect:** wait for `docker compose ps` to report PostgreSQL healthy, verify `DATABASE_URL`, then rerun migration deploy.
- **CORS/auth cookie problem:** set `FRONTEND_URL` to the exact Vite or forwarded Codespaces URL and use HTTPS in production.
- **Prisma client missing:** run `npm run prisma:generate --workspace backend`.
- **Port busy:** change `PORT` or stop the process already using it.

Dockerfiles are included for independent API and frontend production images; `docker-compose.yml` intentionally keeps local development simple by managing PostgreSQL only.
