# Taste of Aloha Implementation Instructions

## 1) MVP Dashboard Contract (Implemented vs Future)

### Implemented MVP (current release target)
- Customer: menu browsing, cart updates, order placement, order tracking.
- Admin: order oversight, lifecycle transitions, driver assignment.
- Kitchen: preparing queue + ready-for-pickup transitions.
- Driver: delivery queue actions + location pings.
- Backend contracts: REST APIs for menu/cart/orders/auth plus SSE stream for realtime updates.

### Future Platform Vision (explicitly out of MVP)
- Multi-tenant operations.
- Advanced analytics/reporting modules.
- Dynamic dispatch optimization.
- Complex notification orchestration.
- Fully offline-first dashboard clients.

## 2) Canonical Lifecycle State Machine

States:
1. `CART_SUBMITTED`
2. `CONFIRMED`
3. `PREPARING`
4. `READY_FOR_PICKUP`
5. `OUT_FOR_DELIVERY`
6. `DELIVERED`
7. `CANCELLED`

Allowed transitions and ownership:
- `CART_SUBMITTED -> CONFIRMED` (admin/system)
- `CART_SUBMITTED -> CANCELLED` (customer/admin)
- `CONFIRMED -> PREPARING` (kitchen/admin)
- `CONFIRMED -> CANCELLED` (admin)
- `PREPARING -> READY_FOR_PICKUP` (kitchen/admin)
- `PREPARING -> CANCELLED` (admin)
- `READY_FOR_PICKUP -> OUT_FOR_DELIVERY` (driver/admin; requires active driver assignment)
- `READY_FOR_PICKUP -> CANCELLED` (admin)
- `OUT_FOR_DELIVERY -> DELIVERED` (driver/admin)
- `OUT_FOR_DELIVERY -> CANCELLED` (admin)

Terminal states:
- `DELIVERED`
- `CANCELLED`

Every transition must create one `OrderStatusHistory` row with:
- `fromStatus`
- `toStatus`
- `actorRole`
- `actorUserId`
- `note`
- `createdAt`

## 3) Data Model and Migration Plan

New persistent models:
- `Order`
- `OrderItem`
- `OrderStatusHistory`
- `DeliveryAssignment`
- `DriverLocationPing`

Extended existing model:
- `User` with `role`, `passwordHash`, `createdAt`, `updatedAt`

Primary indexing requirements:
- Order dashboards: status/time indexes.
- Transition history: order/time index.
- Active deliveries: `(orderId, isActive)` and `(driverId, isActive)`.
- Driver telemetry streams: driver/order/time indexes.

Migration sequence:
1. Apply schema migration for enums + new tables.
2. Backfill users with default `CUSTOMER` role as needed.
3. Deploy backend with Prisma-backed order service.
4. Retire in-memory order handlers.
5. Verify transition writes and assignment lookups.

Backward compatibility notes:
- Existing `/api/orders` endpoint remains REST-compatible.
- New lifecycle and driver endpoints augment, not replace, existing list/get/create semantics.

## 4) Auth/RBAC Matrix

Auth mechanism:
- Login endpoint returns JWT token with `{ sub, email, role }` claims.
- Token required for role-scoped routes and dashboards.

Route-level policy:
- Customer: own order create/read, self-tracking.
- Kitchen: kitchen queue reads + prep/ready transitions.
- Driver: delivery transitions + location updates for assigned orders.
- Admin: full order management, assignment, cancellation, status overrides.

Frontend route protection:
- `/dashboard/customer` => CUSTOMER only
- `/dashboard/admin` => ADMIN only
- `/dashboard/kitchen` => KITCHEN only
- `/dashboard/driver` => DRIVER only

## 5) Realtime Architecture

Strategy:
- Server-Sent Events (SSE) as single realtime transport for order + location updates.

Published event types:
- `order.created`
- `order.transitioned`
- `order.driver_assigned`
- `driver.location`
- `order.deleted`

Reconnect/replay/idempotency behavior:
- Event IDs are monotonic.
- Client reconnects with `Last-Event-ID`.
- Server replays buffered events after provided ID.
- Clients de-duplicate by event `id`.
- REST endpoints remain fallback for missed realtime messages.

## 6) Driver Location Pipeline

Flow:
1. Driver receives active assignment.
2. Driver app posts GPS ping to `/api/orders/:id/driver/location`.
3. Backend validates active assignment ownership.
4. Ping persisted in `DriverLocationPing`.
5. Realtime `driver.location` event broadcast to subscribers.
6. Dashboards can fallback to REST reads when stream unavailable.

## 7) Environment and Deploy Matrix

### Local development
- Start DB: `npm run dev:db`
- Apply migrations: `npm --workspace apps/backend run db:migrate`
- Seed data: `npm --workspace apps/backend run db:seed`
- Run backend: `npm run dev:backend`
- Run frontend: `npm run dev:web`

### Build/runtime variables
- Required:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `PORT` (backend defaults to `3000`)
- Build fallback:
  - `PRISMA_FALLBACK_DB_USER`
  - `PRISMA_FALLBACK_DB_PASSWORD`
  - `PRISMA_FALLBACK_DB_HOST`
  - `PRISMA_FALLBACK_DB_PORT`
  - `PRISMA_FALLBACK_DB_NAME`

## 8) Deployment Order and Rollback

Deploy order:
1. Deploy migration artifacts.
2. Run `prisma migrate deploy`.
3. Seed only if required for baseline users/menu.
4. Deploy backend (auth/order/realtime enabled).
5. Deploy frontend dashboards.
6. Run smoke verification.

Rollback:
1. Revert backend/frontend deployment to previous image.
2. Disable new transitions if partial migration state detected.
3. Restore from DB backup if incompatible writes occurred.
4. Re-run smoke checks against restored version.

## 9) Test Commands and Verification Checklist

Commands:
- Lint: `npm run lint`
- Backend tests: `npm --workspace apps/backend run test`
- Frontend tests: `npm --workspace apps/web run test`
- Frontend build: `npm --workspace apps/web run build`
- Backend smoke: `npm --workspace apps/backend run smoke`

Checklist:
- [ ] Can login and obtain role token.
- [ ] Customer can place order and see status.
- [ ] Kitchen queue reflects preparing orders.
- [ ] Admin can assign driver and move lifecycle.
- [ ] Driver can send location for assigned order only.
- [ ] Realtime stream emits lifecycle and location events.
- [ ] REST fallback remains functional when SSE disconnected.

## 10) Known Risks

- Existing seed data does not yet provision all role accounts by default.
- Lifecycle hard-stops rely on strict role mapping; misconfigured role claims can block order flow.
- SSE is single-node in-memory buffering; horizontal scaling requires shared event bus/session affinity.
- Driver location volume may require retention controls and archive policies as data grows.
