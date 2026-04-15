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
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});
```

## 📚 Documentation found in gitHub Wiki

- **[Redux Guide](LEARNING_GUIDE)** — State management patterns
- **[API Integration](BACKEND_API_GUIDE)** — Connecting to backend

## 🔗 Related

- [Backend Guide](backend/README) — API endpoints
- [Root README](README) — Full monorepo overview

## 🔌 Connectivity Verification

Use the canonical connectivity checks in [QUICK_REFERENCE](QUICK_REFERENCE)- Connectivity-verification-powershell.
