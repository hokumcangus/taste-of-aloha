# Production Readiness Guide

This document is the step-by-step checklist to take **Taste of Aloha** from the `feat/finished_flow` branch to a live, secure deployment.

---

## 1. Environment Variables

All secrets must be set in your hosting platform (Vercel/Railway/Render etc.) before deployment. **Never commit real secrets to git.**

### Backend (`apps/backend`)

| Variable | Purpose | Where to get it |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | Neon Dashboard → Connection Details |
| `JWT_SECRET` | Signs / verifies user tokens (≥ 32 random bytes) | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `STRIPE_SECRET_KEY` | Stripe server-side API key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) — use `sk_live_…` for production |
| `STRIPE_WEBHOOK_SECRET` | Verifies Stripe webhook payloads | Stripe Dashboard → Webhooks → Signing secret (`whsec_…`) |
| `ALLOWED_ORIGINS` | CORS allowlist (comma-separated URLs) | e.g. `https://taste-of-aloha.vercel.app` |
| `NODE_ENV` | Set to `production` | `production` |
| `PORT` | Override default port (optional) | Platform sets this automatically on most hosts |

### Frontend (`apps/web`)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the deployed backend API |

---

## 2. Secrets Rotation (IMPORTANT — do before going live)

The Neon DB password in `.env` has been exposed in git history and **must be rotated immediately**.

1. Go to [Neon Dashboard](https://console.neon.tech/) → your project → **Settings → Reset password**.
2. Update `DATABASE_URL` in your hosting platform with the new password.
3. Update your local `.env` file.
4. Rotate `JWT_SECRET` — generate a new random value and update all environments.

---

## 3. Database Migration (Neon)

The schema has been extended with `User`, `Order`, `OrderItem` tables and new enums. The migration file is ready at `apps/backend/prisma/migrations/20260506120000_auth_orders_dashboard/migration.sql`.

```bash
# From apps/backend/
npx prisma migrate deploy
```

This applies all pending migrations against `DATABASE_URL` safely (no data loss for existing rows).

To verify:

```bash
npx prisma studio          # opens GUI at localhost:5555
npx prisma migrate status  # shows which migrations are applied
```

---

## 4. Stripe Setup

### Test Mode (development / staging)

1. Copy test API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
2. Set `STRIPE_SECRET_KEY=sk_test_…` in your environment.
3. For webhooks locally, use [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   stripe listen --forward-to localhost:3000/api/payments/webhook
   # Copy the printed whsec_… value → set as STRIPE_WEBHOOK_SECRET
   ```

### Live Mode (production)

1. Switch to live keys in Stripe Dashboard.
2. Create a webhook endpoint pointing to `https://your-backend.com/api/payments/webhook`.
3. Subscribe to the event: `payment_intent.succeeded`.
4. Copy the signing secret and set `STRIPE_WEBHOOK_SECRET=whsec_…`.

### Fallback Mock Mode

If `STRIPE_SECRET_KEY` is **not set**, the payment controller returns a mock `clientSecret` (`mock_pi_…`). This is safe for local dev without a Stripe account, but must not be used in production.

---

## 5. Vercel Deployment

### Backend

1. `cd apps/backend`
2. Push to GitHub; connect repo in [Vercel Dashboard](https://vercel.com/new).
3. Set **Root Directory** to `apps/backend`.
4. Set all environment variables from Section 1 in the Vercel project settings.
5. `vercel.json` in `apps/backend` already configures the Express entry point.

### Frontend

1. `cd apps/web`
2. Connect the same repo, set **Root Directory** to `apps/web`.
3. Set `VITE_API_URL` to the backend deployment URL (e.g. `https://taste-of-aloha-api.vercel.app`).

---

## 6. Admin User Creation

There is no admin self-registration. To promote a user to ADMIN:

**Option A — SQL (Neon console)**

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-admin@email.com';
```

**Option B — API (requires an existing ADMIN token)**

```bash
curl -X PATCH https://your-api.com/api/auth/users/<id>/role \
  -H "Authorization: Bearer <admin_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"role":"ADMIN"}'
```

For the very first admin, use Option A.

---

## 7. CORS Configuration

`index.js` uses the `cors` package. For production, restrict origins:

```js
// apps/backend/index.js
const corsOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173"];

app.use(cors({ origin: corsOrigins, credentials: true }));
```

Set `ALLOWED_ORIGINS=https://taste-of-aloha.vercel.app` in your backend environment variables.

---

## 8. Security Checklist

- [ ] `JWT_SECRET` is at least 32 random bytes and stored only in environment variables
- [ ] `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are never logged or committed
- [ ] Neon DB password rotated after git history exposure
- [ ] CORS restricted to the production frontend domain only
- [ ] Stripe webhook verifies `stripe-signature` header (already implemented — requires `STRIPE_WEBHOOK_SECRET` to be set)
- [ ] Passwords are hashed with bcrypt (10 rounds) — already implemented
- [ ] All protected routes require a valid JWT (`requireAuth` middleware) — already implemented
- [ ] Admin-only routes require `ADMIN` role (`requireRole("ADMIN")`) — already implemented
- [ ] `NODE_ENV=production` disables stack traces in error responses
- [ ] HTTPS enforced on all endpoints (handled by Vercel/platform)
- [ ] `npm audit` reviewed and critical vulnerabilities resolved before deployment

---

## 9. Running All Tests Locally

```bash
# Backend
cd apps/backend
npm test

# Frontend
cd apps/web
npm test
```

Expected: **13 backend tests** (cartApi + menuApi) **+ 35 new backend tests** + **30 frontend tests** — all passing.

---

## 10. Health Check

The backend exposes `GET /` which returns `{ status: "ok" }`. Use this as your uptime monitor health check endpoint.

---

## 11. GPS & Location Tracking (Next to Implement)

### Overview

Three parties need location awareness:

| Party | What they see | Data source |
|---|---|---|
| **Customer** | Live driver position on a map while order is in transit | Driver app → backend → customer via SSE/WebSocket |
| **Admin** | All active deliveries on a map, ETA per order | Backend aggregation of driver positions |
| **Driver** | Navigation to delivery address, current order queue | Customer's delivery address on the order |

### Schema Changes

Add a `Delivery` table and location fields to `Order`:

```sql
-- Add to Order
ALTER TABLE "Order" ADD COLUMN "deliveryAddress" TEXT;
ALTER TABLE "Order" ADD COLUMN "deliveryLat"     DOUBLE PRECISION;
ALTER TABLE "Order" ADD COLUMN "deliveryLng"     DOUBLE PRECISION;
ALTER TABLE "Order" ADD COLUMN "driverId"        INTEGER REFERENCES "User"(id);

-- New Delivery tracking table
CREATE TABLE "DeliveryLocation" (
  id          SERIAL PRIMARY KEY,
  orderId     INTEGER NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  driverId    INTEGER NOT NULL REFERENCES "User"(id),
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  recordedAt  TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX ON "DeliveryLocation" (orderId, recordedAt DESC);
```

Add to `schema.prisma`:
- New `UserRole` value: `DRIVER`
- `DeliveryLocation` model with the fields above
- `Order.deliveryAddress`, `Order.deliveryLat/Lng`, `Order.driverId` relation

Migration: `npx prisma migrate dev --name add_gps_delivery`

### New API Endpoints

| Method | Route | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/delivery/location` | `DRIVER` | Driver pushes their current GPS coords |
| `GET` | `/api/delivery/:orderId/track` | Customer (own order) or ADMIN | Latest driver position for an order |
| `GET` | `/api/delivery/active` | `ADMIN` | All active deliveries + latest position |
| `GET` | `/api/delivery/:orderId/stream` | Customer (own order) | SSE stream — real-time position updates |

### Real-Time Transport

Use **Server-Sent Events (SSE)** for the customer tracking page (simpler than WebSockets, works over HTTP/2, no extra library needed):

```js
// apps/backend/src/routes/deliveryRoutes.js
router.get("/:orderId/stream", requireAuth, async (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  const interval = setInterval(async () => {
    const loc = await deliveryModel.getLatestLocation(req.params.orderId);
    if (loc) res.write(`data: ${JSON.stringify(loc)}\n\n`);
  }, 3000); // poll DB every 3 s

  req.on("close", () => clearInterval(interval));
});
```

For higher frequency updates, replace the DB-polling interval with a **Redis pub/sub** channel: driver pushes to `delivery:<orderId>`, SSE handler subscribes and forwards.

### Frontend (Customer Tracking Map)

Recommended approach: [Leaflet.js](https://leafletjs.com/) (open source, no API key required) or [Google Maps JS API](https://developers.google.com/maps/documentation/javascript).

```jsx
// apps/web/src/pages/TrackOrder.jsx  (new page)
// 1. Open EventSource to /api/delivery/:orderId/stream
// 2. On each message, update a marker on the Leaflet map
// 3. Show ETA from Google Maps Directions API or Mapbox
```

### Environment Variables (GPS/Maps)

Add to the backend and frontend env var tables:

**Backend**

| Variable | Purpose |
|---|---|
| `REDIS_URL` | (Optional) Redis connection for pub/sub real-time delivery. Omit to use DB-polling fallback |
| `MAPS_GEOCODING_KEY` | Google Maps / Mapbox API key for address → lat/lng on order creation |

**Frontend**

| Variable | Purpose |
|---|---|
| `VITE_MAPS_API_KEY` | Google Maps or Mapbox public token for the tracking map tile layer |

### Browser Geolocation (Driver App)

The driver pushes location from their browser (or a future React Native app):

```js
navigator.geolocation.watchPosition(
  ({ coords }) => {
    fetch("/api/delivery/location", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, lat: coords.latitude, lng: coords.longitude }),
    });
  },
  console.error,
  { enableHighAccuracy: true, maximumAge: 5000 },
);
```

### Implementation Checklist

- [ ] Add `DRIVER` to `UserRole` enum in `schema.prisma`
- [ ] Add `deliveryAddress / deliveryLat / deliveryLng / driverId` to `Order` model
- [ ] Create `DeliveryLocation` model + migration
- [ ] Create `apps/backend/src/models/deliveryModel.js` (pushLocation, getLatestLocation, getActiveDeliveries)
- [ ] Create `apps/backend/src/controllers/deliveryController.js`
- [ ] Create `apps/backend/src/routes/deliveryRoutes.js` + mount in `index.js`
- [ ] Create `apps/web/src/pages/TrackOrder.jsx` with Leaflet map + SSE consumer
- [ ] Add `/orders/:id/track` route to `App.jsx` (protected, own order only)
- [ ] Add driver location card to Admin dashboard
- [ ] Write backend tests for delivery endpoints

---

## 12. Notification Service (Next to Implement)

### Notification Types by Party

| Event | Customer | Admin | Driver |
|---|---|---|---|
| Order placed | ✉ email + 🔔 push | 🔔 push | — |
| Order status changed (PREPARING → READY → OUT_FOR_DELIVERY) | ✉ email + 🔔 push | — | 🔔 push |
| Driver assigned | 🔔 push | — | 🔔 push |
| Order delivered | ✉ email | 🔔 push | — |
| Payment failed | ✉ email | 🔔 push | — |

### Channels

#### A. Email — [Resend](https://resend.com) (recommended) or SendGrid

```bash
npm install resend   # in apps/backend
```

```js
// apps/backend/src/utils/email.js
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderConfirmation({ to, orderNumber, total }) {
  await resend.emails.send({
    from: "orders@taste-of-aloha.com",
    to,
    subject: `Order #${orderNumber} confirmed`,
    html: `<p>Your order of $${total} is being prepared!</p>`,
  });
}
```

#### B. Web Push Notifications — [web-push](https://github.com/web-push-libs/web-push)

```bash
npm install web-push   # in apps/backend
```

Flow:
1. Customer/admin browser registers a **push subscription** (service worker + `PushManager.subscribe()`)
2. Frontend `POST /api/notifications/subscribe` → save subscription in DB
3. Backend sends push via `webpush.sendNotification(subscription, payload)` on order events

```bash
# Generate VAPID keys once
npx web-push generate-vapid-keys
```

New DB table: `PushSubscription` (userId, endpoint, p256dh, auth, createdAt)

#### C. In-App Real-Time Alerts

Reuse the SSE infrastructure from GPS tracking: emit a `notification` event type on the same stream, or open a separate `/api/notifications/stream` SSE endpoint per user.

### New API Endpoints

| Method | Route | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/notifications/subscribe` | requireAuth | Save browser push subscription |
| `DELETE` | `/api/notifications/subscribe` | requireAuth | Unsubscribe |
| `GET` | `/api/notifications/stream` | requireAuth | SSE stream of in-app alerts |

### Environment Variables (Notifications)

**Backend**

| Variable | Purpose | Where to get it |
|---|---|---|
| `RESEND_API_KEY` | Resend email API key | [resend.com/api-keys](https://resend.com/api-keys) |
| `EMAIL_FROM` | Sender address (e.g. `orders@taste-of-aloha.com`) | Verified domain in Resend |
| `VAPID_PUBLIC_KEY` | Web Push VAPID public key | `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | Web Push VAPID private key | Same command, keep secret |
| `VAPID_SUBJECT` | Contact URI for VAPID (`mailto:…`) | Your support email |

**Frontend**

| Variable | Purpose |
|---|---|
| `VITE_VAPID_PUBLIC_KEY` | Passed to `PushManager.subscribe()` in the service worker |

### Implementation Checklist

- [ ] Create `PushSubscription` model in `schema.prisma` + migration
- [ ] Install `resend` and `web-push` in `apps/backend`
- [ ] Create `apps/backend/src/utils/email.js` — order confirmation, status change, payment failed templates
- [ ] Create `apps/backend/src/utils/pushNotification.js` — wraps `web-push.sendNotification()`
- [ ] Create `apps/backend/src/controllers/notificationController.js` (subscribe, unsubscribe, SSE stream)
- [ ] Create `apps/backend/src/routes/notificationRoutes.js` + mount in `index.js`
- [ ] Hook `sendOrderConfirmation()` into `orderModel.createOrder()`
- [ ] Hook `sendStatusChange()` into `orderController.updateOrderStatus()`
- [ ] Hook `sendPaymentFailed()` into `paymentController.handleWebhook()` on `payment_intent.payment_failed`
- [ ] Create `apps/web/public/sw.js` service worker to handle `push` events
- [ ] Create `apps/web/src/hooks/usePushNotifications.js` — registers SW, calls subscribe endpoint
- [ ] Add notification permission prompt to Dashboard page
- [ ] Generate VAPID keys and set all env vars
- [ ] Write backend tests for notification subscribe/unsubscribe endpoints
