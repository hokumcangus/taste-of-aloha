# Backend, Frontend, and DB Connectivity Incident Report

## Summary
Local and remote database connectivity checks were failing in mixed ways:
- Backend health endpoint could start, but menu API calls failed.
- Frontend API proxy could not reliably reach backend in local runs.
- PostgreSQL authentication and schema state mismatches caused runtime 500 errors.

## What the problem was
1. Backend process behavior was inconsistent.
- The backend server was being started twice in development, which created confusing runtime behavior.

2. Environment resolution was conflicting.
- Values from shell/session, `.env`, and `.env.local` were not being used predictably.
- Local development values were mixed with cloud values, causing wrong host/port/credential usage at runtime.

3. Local host database routing was conflicting.
- Host port `5432` had overlapping listeners (Docker and a local PostgreSQL service), which made local credential checks unreliable.

4. Neon database schema was not aligned with app expectations.
- Backend authenticated to Neon successfully, but `/api/menu` failed because the required table (`public.Menu`) was missing.

## Why it was like that
1. Startup code issue
- Duplicate `app.listen(...)` created multiple server starts in development.

2. Config layering issue
- Environment files and shell variables were not clearly prioritized for local development and cloud testing.

3. Infra overlap
- Multiple services listening on the same local DB port can route traffic unpredictably.

4. Migration/state issue
- Target Neon database was non-empty but not in the expected Prisma-managed schema state, so normal migration deploy did not apply directly.

## How we fixed it
1. Backend startup fix
- Removed duplicate backend server start so the app listens once.

2. Frontend local proxy fix
- Updated frontend local API target behavior for local development.

3. Environment handling fix
- Added local override file for backend:
  - `apps/backend/.env.local`
- Added/updated local frontend env override:
  - `apps/web/.env.local`
- Updated backend env-loading so session-scoped vars can take precedence when needed.

4. Session-scoped cloud credentials
- Set `PGUSER`, `PGPASSWORD`, and `DATABASE_URL` in the active PowerShell session for Neon testing.

5. Database schema/data fix for Neon
- Applied schema sync with Prisma (`db push`) for the target DB state.
- Seeded menu data (`db:seed`) so API endpoints return expected records.

## Validation performed
1. Backend health endpoint returned `200`.
2. Backend menu endpoint returned `200` with menu records.
3. Data was returned from Neon after schema sync + seed.

## Final state
- Backend is running and responding.
- Backend menu API is connected to the configured Neon database and returns seeded data.
- Local env flow is documented and repeatable via `.env.local` plus session overrides when needed.

## Follow-up recommendations
1. Keep local-only values in `.env.local` and avoid mixing cloud secrets in shared local files.
2. Reserve local `5432` ownership to one DB service to avoid routing confusion.
3. Add a short runbook section in project docs for:
- local Docker DB mode
- Neon mode
- required commands for schema sync and seeding

## Command Runbook (What / Why / How)

### Local Docker DB mode

What: Run with local Docker PostgreSQL.
Why: Stable local troubleshooting path.
How:

```powershell
npm run dev:db
npm run dev:backend
npm run dev:web
```

### Neon mode

What: Run backend against Neon.
Why: Cloud parity and deployment confidence.
How:

```powershell
$env:PGUSER = "<your_user>"
$env:PGPASSWORD = "<your_password>"
$env:DATABASE_URL = "postgresql://<your_user>:<your_password>@<host>/<db>?sslmode=require&channel_binding=require"

npm run dev:backend
npx prisma db push
npm --workspace apps/backend run db:seed
```
