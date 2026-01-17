# 🌺 Taste of Aloha Frontend

This is the frontend for **Taste of Aloha**, built with **React + Vite**, **Redux Toolkit**, and **Tailwind CSS v4**.

## ✅ Foundation Complete

- Frontend scaffold complete and verified
- Dev server runs successfully at http://localhost:5173
- React Router configured with Home, Menu, About pages
- Tailwind CSS v4 integrated
- Redux Toolkit store configured

See [LEARNING_GUIDE.md](../../LEARNING_GUIDE.md) for comprehensive documentation.

---

## 🚀 Getting Started

### Option 1: Local Development

#### 1. Install dependencies
```bash
npm install
```

#### 2. Run the dev server
```bash
npm run dev
```

The app will start at:  
**http://localhost:5173**

#### 3. Build for production
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

---

### Option 2: Docker

#### Development Mode
```bash
# From project root
docker compose up frontend
```

**What happens:**
- Vite dev server runs with hot module replacement (HMR)
- Your local `apps/web` folder is mounted as a volume
- Code changes automatically refresh in browser
- Accessible at `http://localhost:5173`

#### Production Mode
```bash
# From project root
docker compose -f docker-compose.prod.yml up web
```

**What happens:**
- React app is built with `vite build` (optimized bundle)
- Nginx serves the static files from `/usr/share/nginx/html`
- Nginx acts as reverse proxy, routing `/api` requests to backend
- All routes fallback to `index.html` for React Router (SPA support)
- Static assets cached for 1 year, HTML cached for 1 hour with revalidation
- Accessible at `http://localhost` (port 80)

---

## 📦 Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool with fast HMR
- **Redux Toolkit** - State management (cart, orders, snacks)
- **React Router DOM** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Nginx** - Production web server (Docker only)

---

## 🗂️ Project Structure

```
apps/web/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   │   └── Cart.jsx     # Shopping cart component
│   ├── config/
│   │   └── api.js       # API configuration
│   ├── pages/           # Route pages
│   │   ├── Home.jsx
│   │   ├── Menu.jsx
│   │   ├── About.jsx
│   │   ├── Checkout.jsx
│   │   └── OrderConfirmation.jsx
│   ├── services/        # API service layer
│   │   ├── api.js       # Base API client
│   │   ├── snackService.js
│   │   └── orderService.js
│   ├── store/           # Redux store
│   │   ├── store.js
│   │   └── slices/
│   │       ├── cartSlice.js   # Shopping cart state
│   │       ├── orderSlice.js  # Order management
│   │       └── snackSlice.js  # Menu items
│   ├── styles/          # Global styles
│   ├── App.jsx          # Root component with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind imports
├── Dockerfile           # Multi-stage build (dev/prod)
├── nginx.conf           # Nginx configuration for production
├── postcss.config.js    # PostCSS with Tailwind plugin
├── tailwind.config.cjs  # Tailwind CSS configuration
├── vite.config.js       # Vite configuration
└── package.json
```

---

## 🎨 Tailwind CSS v4

This project uses **Tailwind CSS v4**, which has a simpler import syntax:

```css
/* src/index.css */
@import "tailwindcss";
```

**Note:** Older Tailwind v3 syntax (`@tailwind base`, `@tailwind components`, etc.) is not supported in v4.

---

## 🔌 API Configuration

The frontend connects to the backend via environment variables:

### Local Development
```bash
# .env or vite.config.js proxy
VITE_API_URL=http://localhost:3000
```

Vite proxy forwards `/api` requests to the backend:
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

### Docker Development
Frontend container talks to backend container via Docker network:
```bash
VITE_API_URL=http://backend:3000
```

### Docker Production
Nginx proxies API requests, so frontend uses relative paths:
```javascript
// No VITE_API_URL needed - Nginx handles /api routing
fetch('/api/snacks')  // Nginx routes to backend:3000
```

---

## 🛠️ How It Works

### State Management (Redux Toolkit)

**Cart Flow:**
1. User clicks "Add to Cart" on Menu page
2. `addToCart()` action dispatched to `cartSlice`
3. Redux updates cart state (items, quantity, subtotal)
4. Cart component re-renders with updated state

**Order Flow:**
1. User clicks "Checkout" in cart
2. Navigates to `/checkout` (React Router)
3. User fills form and submits
4. `placeOrder()` async thunk sends POST to `/api/orders`
5. Redux updates order state with response
6. Navigates to `/order-confirmation/:orderId`

### Nginx Configuration (Production)

```nginx
# Serve React app
location / {
  try_files $uri $uri/ /index.html;  # SPA fallback for React Router
  add_header Cache-Control "public, max-age=3600, must-revalidate";
}

# Cache static assets aggressively
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# Proxy API to backend
location /api {
  proxy_pass http://backend:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}
```

**Key features:**
- All routes fallback to `index.html` for React Router
- Static assets (JS, CSS, images) cached for 1 year
- HTML cached for 1 hour with revalidation
- `/api` requests proxied to backend container

---

## 🧪 Testing

### Browser Console
```javascript
// Test API connection
fetch('/api/snacks')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Redux DevTools
Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) to inspect state:
- View current cart state
- Track dispatched actions
- Time-travel debugging

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## 🚢 Deployment

### Docker Production Build
```bash
# From project root
docker compose -f docker-compose.prod.yml up --build web
```

### Manual Build
```bash
# Build React app
npm run build

# Serve with any static file server
npx serve -s dist
# Or use nginx, Apache, Netlify, Vercel, etc.
```

---

## 🔗 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
