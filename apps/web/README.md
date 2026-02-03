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
docker-compose up frontend
```

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
npm run test
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

## 📚 Documentation

- **[Redux Guide](../../docs/guides/LEARNING_GUIDE.md)** — State management patterns
- **[Component Library](./src/components/README.md)** — Available components
- **[API Integration](../../docs/guides/BACKEND_API_GUIDE.md)** — Connecting to backend

## 🔗 Related

- [Backend Guide](../backend/README.md) — API endpoints
- [Root README](../../README.md) — Full monorepo overview
