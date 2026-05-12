# SWE Development Process Playbook

This playbook captures the exact workflow used to deliver features safely in this repo.

## 1) Define the outcome before writing code

### What
Convert a broad request into a concrete outcome with clear acceptance signals.

### Why
If success is vague, engineering drifts. Clear outcomes reduce rework and make validation objective.

### How
- Rewrite the request into deliverables.
- Identify role, data, API, UI, and test impact.
- Set success checks before coding.

Example outcome pattern:
- Feature works for all required user roles.
- API behavior and DB schema are aligned.
- Frontend renders expected state.
- Tests pass and no regressions are introduced.

## 2) Map the system surface area

### What
Discover all files that participate in the feature.

### Why
Most bugs come from partial updates across backend, frontend, and schema boundaries.

### How
- Inspect workspace structure first.
- Locate related models, controllers, routes, services, UI pages, and tests.
- Confirm run scripts for migration, seed, and tests.

Checklist:
- Prisma schema and migrations
- Backend model/controller/route layers
- Frontend service + page components
- Test files for all affected paths

## 3) Implement schema-first for cross-cutting features

### What
Start with Prisma model/enum/relations and then wire app logic.

### Why
Data model shape drives API contracts and UI states.

### How
- Update schema with new enums/tables/relations.
- Add migration.
- Regenerate/restart services as needed.
- Only then implement backend business logic.

## 4) Build backend by responsibility layers

### What
Implement backend in strict sequence: model -> controller -> route -> middleware policy.

### Why
This keeps code testable and avoids leaking transport concerns into data logic.

### How
- Model: validation + database access.
- Controller: request/response mapping and orchestration.
- Route: endpoint definitions and guards.
- Middleware: auth and role enforcement.

## 5) Add observability and UX continuity

### What
Add notifications/status updates where user state changes.

### Why
Operational visibility is part of feature completeness, not a nice-to-have.

### How
- Generate notifications on creation/status/assignment events.
- Scope recipients by role.
- Provide read/unread workflows.
- Poll or subscribe from frontend on an interval suitable for the app.

## 6) Implement frontend integration after API contracts stabilize

### What
Integrate service layer first, then UI rendering.

### Why
Separating transport from presentation makes failures easier to debug and test.

### How
- Add/extend API service methods.
- Wire page-level data loaders and state handling.
- Render role-aware controls and summaries.
- Add resilient UI fallbacks for optional assets (for example image load errors).

## 7) Use data ingestion scripts with normalization rules

### What
For scraping/import tasks, normalize names and keep an alias map.

### Why
External data rarely matches internal naming exactly; alias maps prevent silent misses.

### How
- Scrape source attributes (for example name/image/price).
- Normalize text keys.
- Resolve via alias map before DB updates.
- Log successes/failures with counts.
- Persist a machine-readable map artifact for traceability.

## 8) Validate in layers (script, API, UI, tests)

### What
Run narrow validations first, then full test suites.

### Why
Layered checks isolate failures quickly and reduce debugging time.

### How
- Run scripts directly and inspect counters/logs.
- Validate DB state after writes.
- Confirm frontend display behavior.
- Run backend and frontend tests.

Validation pattern:
- No syntax/runtime errors.
- Expected update counts present.
- Endpoints authorize correctly.
- UI renders correct role-dependent state.

## 9) Commit in small, reviewable batches

### What
Group commits by concern, not by time.

### Why
Small commits simplify review, rollback, and cherry-picking.

### How
- Stage only related files.
- Use specific commit messages.
- Verify each commit content with git show.

Recommended commit shape:
- Schema/foundation
- Backend feature logic
- Frontend integration
- Data assets/scripts
- Test updates

## 10) Keep the tree clean and protect local-only artifacts

### What
Ignore transient local files and temporary validation scripts.

### Why
Noise in git history reduces signal and causes accidental commits.

### How
- Add local scratch files to .gitignore.
- Keep documentation and production artifacts tracked.
- Re-check git status before and after each commit.

## Practical "Think Like an SWE" loop

1. Clarify outcomes and constraints.
2. Map affected boundaries (DB, API, UI, tests).
3. Implement from foundation to edges.
4. Validate with measurable checks.
5. Commit in focused slices.
6. Leave a reproducible trail (docs + logs + clean git state).
