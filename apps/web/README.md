# 🖥 Taste of Aloha — Frontend

This is the React client for Taste of Aloha, providing an intuitive shopping experience with a cart system.

## 🧪 Tech Stack

- **Framework**: React 19 + Vite
- **State Management**: Redux Toolkit (Cart, Auth, UI)
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + React Testing Library

## 🛒 Shopping Cart Logic

The cart is managed via Redux in `src/store/cartSlice.js`.

**Selectors:**

- `selectCartTotal` — Display the total price
- `selectCartItems` — Get all items in cart
- `selectCartCount` — Get number of items

**Actions:**

- `addItem(item)` — Add product to cart
- `removeItem(id)` — Remove product from cart
- `clearCart()` — Empty the cart

## 🚀 Getting Started

### Local Development

```bash
cd apps/web
npm install
npm run dev
```

Open http://localhost:5173 to view the app.

### Docker

```bash
docker compose up frontend
```

## ▲ Vercel Deployment

Run frontend deploy commands from `apps/web`, not the repo root. This app has its own `package.json` and `vercel.json`.

### Build Locally

```bash
cd apps/web
npm run build
```

### Deploy with Vercel CLI

```bash
cd apps/web
vercel deploy
vercel deploy --prod
```

The Vercel rewrite rules for the SPA live in `apps/web/vercel.json`.

## 🏗 Project Structure

```
src/
├── components/       # Reusable React components
├── pages/            # Page-level components
├── store/            # Redux slices and selectors
├── services/         # API communication
├── styles/           # Global styles
└── routes/           # Router configuration
```

## 🧪 Testing

Run the test suite:

```bash
npm test
npm run test:coverage
npm run test:watch
```

### Writing Tests

Tests use **Vitest** and **React Testing Library**:

```javascript
import { render, screen } from "@testing-library/react";
import MyComponent from "./MyComponent";

test("renders component", () => {
  render(<MyComponent />);
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});
```

## 📚 Documentation

- **[Redux Guide](../../docs/guides/LEARNING_GUIDE.md)** — State management patterns
- **[API Integration](../../docs/guides/BACKEND_API_GUIDE.md)** — Connecting to backend

## 🔗 Related

- [Backend Guide](../backend/README.md) — API endpoints
- [Root README](../../README.md) — Full monorepo overview

## 🔌 Connectivity Verification

Use the canonical connectivity checks in [QUICK_REFERENCE.md](../../QUICK_REFERENCE.md#connectivity-verification-powershell).

## Simple Commands (What / Why / How)

### Local mode

What: Run frontend against local backend.
Why: Fast feedback while building UI.
How:

```powershell
npm run dev:web
(Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing).StatusCode
```

### Neon-backed backend mode

What: Run frontend while backend points to Neon.
Why: Validate UI behavior with cloud database responses.
How:

```powershell
# In terminal 1, set Neon env vars and run backend
npm run dev:backend

# In terminal 2, run frontend
npm run dev:web

(Invoke-WebRequest -Uri "http://localhost:5173/api/menu" -UseBasicParsing).StatusCode
```
