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

The Neon DB password in `.env` (`npg_H1aQqebCBU3t`) has been exposed in git history.

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
