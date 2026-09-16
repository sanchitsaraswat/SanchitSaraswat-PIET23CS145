# Engineering reasoning

## Requirement interpretation

The key product behavior is dependable daily logging and streaks that respect a habit’s schedule. The example 75-day challenge is context, not a product limitation, so habits are generic and multi-user from the data model upward.

## Architecture

I chose a modular monolith: a single deployable API has low operational cost while controller/service/repository/domain boundaries keep authentication, habit management, scheduling, and streaks independently maintainable. Controllers only translate HTTP; services enforce business rules; repositories encapsulate Prisma queries. This avoids both route-handler sprawl and needless microservices.

## Data model and isolation

`Habit` belongs to `User`; `HabitSchedule` has one row per chosen weekday; `HabitCompletion` has one row per calendar date; `RefreshToken` represents a revocable login session. A compound unique constraint on `(habitId, completionDate)` makes repeated completion idempotent even during concurrent requests. Every habit operation obtains the authenticated user from the access token and scopes the query by `id` and `userId`; URL identifiers never confer authority.

## Scheduling and streaks

Schedules are a small domain module. `isHabitScheduledForDate`, `getPreviousScheduledDate`, and `getNextScheduledDate` form the extension point for future schedule types. Current streak walks backward across scheduled occurrences until it reaches an uncompleted occurrence. Best streak evaluates that same rule at each completion date. Thus a Friday-to-Monday weekday completion remains consecutive while a missed scheduled Tuesday breaks the streak.

## Calendar dates and time zones

Completions are `DATE`, not timestamps. Internal date utilities work with `YYYY-MM-DD` keys at noon UTC to avoid accidental local-midnight shifts. “Today” is obtained with the saved user IANA timezone; the API does not blindly derive it with `toISOString()`.

## Authentication and security

Passwords use bcrypt. Access JWTs are short-lived and sent in an authorization header; a separate refresh JWT is an HTTP-only, same-site cookie. Only a hash of that refresh token is persisted, tokens rotate, and logout revokes the session. Zod validates boundary input, while rate limiting, Helmet, CORS, bounded bodies, safe error responses, request IDs, and structured request logging address common API risks.

## Trade-offs and future work

For a straightforward first release, best streak calculation loads a habit’s completion history when requested. At substantial history volumes, a projection or cached aggregate could optimize this read without changing the domain API. The UI delivers core daily use, creation, search, archive, and restore; a full edit/detail page, cursor pagination, CSRF hardening for cross-site cookie deployments, and database-backed integration-test isolation are the next planned increments.
