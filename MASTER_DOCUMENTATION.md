# 🌺 TASTE OF ALOHA - MASTER DOCUMENTATION
**Complete Project Guide - All Essential Information in One Place**  
Last Updated: February 3, 2026

---

## 📌 TABLE OF CONTENTS
1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Current Status](#current-status)
4. [Complete Development Guide](#complete-development-guide)
5. [Architecture & Implementation](#architecture--implementation)
6. [Sprint Planning & Tasks](#sprint-planning--tasks)
7. [Command Reference](#command-reference)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 QUICK START

### Prerequisites
- Node.js v24.11.0+
- Docker & Docker Desktop
- PostgreSQL 18
- Git

### Local Development (5 minutes)

```bash
# 1. Clone and navigate
git clone https://github.com/hokumcangus/taste-of-aloha.git
cd taste-of-aloha

# 2. Install dependencies
npm install

# 3. Setup database
cd apps/backend
npx prisma migrate dev
cd ../..

# 4. Start development servers
npm run dev

# 5. Open browser
Frontend: http://localhost:5173
Backend: http://localhost:5001
```

### Docker Setup (3 minutes)

```bash
# Start all services
docker compose up -d

# Services available at:
# Frontend: http://localhost
# Backend: http://localhost:3000
# Database: localhost:5432
```

---

## 📋 PROJECT OVERVIEW

### About Taste of Aloha
A modern food delivery platform built with React, Express, PostgreSQL, and Docker. Enables customers to browse menus, add items to cart, checkout, and pay via Stripe. Admin users manage menu items and orders.

### Tech Stack

**Frontend:**
- React 18 with Vite
- Redux Toolkit (state management)
- React Router (navigation)
- Tailwind CSS v4
- Vitest (testing)

**Backend:**
- Node.js + Express
- Prisma ORM
- PostgreSQL 18
- JWT authentication
- Jest (testing)

**DevOps:**
- Docker & Docker Compose
- Nginx (reverse proxy)
- GitHub Actions (CI/CD planned)

### Project Structure

```
taste-of-aloha/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/    # Business logic
│   │   │   ├── models/         # Database queries
│   │   │   ├── routes/         # API endpoints
│   │   │   └── utils/          # Helpers
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/     # Database versions
│   │   ├── tests/              # Unit & integration tests
│   │   └── Dockerfile
│   └── web/
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── pages/          # Page components
│       │   ├── store/          # Redux slices
│       │   ├── services/       # API calls
│       │   └── styles/         # CSS
│       ├── public/             # Static assets
│       └── Dockerfile
├── docs/                        # Documentation
├── infra/                       # Infrastructure setup
├── docker-compose.yml           # Dev environment
├── docker-compose.prod.yml      # Production environment
└── package.json
```

---

## 🔄 CURRENT STATUS

### Sprint Progress
| Sprint | Status | Features |
|--------|--------|----------|
| Sprint 0 | ✅ Complete | Project setup, repos, architecture |
| Sprint 1 | ✅ Complete | Frontend/backend scaffold, Docker, DB setup |
| **Sprint 2** | 🔄 **In Progress** | **Shopping cart (ACTIVE PR #33)** |
| Sprint 3 | 📋 Planned | Authentication & roles |
| Sprint 4 | 📋 Planned | Checkout & Stripe payments |
| Sprint 5 | 📋 Planned | Order management, admin dashboard |
| Sprint 6 | 📋 Planned | Testing, CI/CD, production deploy |

### What's Working ✅
- Menu API (CRUD endpoints)
- Menu display page with Redux
- Database setup with Prisma
- Docker containerization
- Frontend/backend communication
- User authentication structure

### Currently Building 🔄
- Shopping cart database models
- Cart API endpoints
- Cart Redux state management
- Cart UI components
- Add-to-cart functionality

### Coming Next ⬜
- User authentication (JWT)
- Admin role protection
- Checkout flow
- Stripe payment integration
- Order tracking
- Email notifications

---

## 📖 COMPLETE DEVELOPMENT GUIDE

### Backend API Endpoints

#### Menu Endpoints
```
GET    /api/snacks           - Get all menu items
GET    /api/snacks/:id       - Get single menu item
POST   /api/snacks           - Create new item (admin)
PUT    /api/snacks/:id       - Update item (admin)
DELETE /api/snacks/:id       - Delete item (admin)
```

#### Cart Endpoints (In Progress)
```
POST   /api/carts                      - Create cart
GET    /api/carts/:id                  - Get cart by ID
GET    /api/carts/user/:userId         - Get user's cart
POST   /api/carts/:id/items            - Add item to cart
PUT    /api/carts/:id/items/:itemId    - Update item quantity
DELETE /api/carts/:id/items/:itemId    - Remove item from cart
DELETE /api/carts/:id                  - Clear entire cart
```

#### Authentication Endpoints (Planned)
```
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Login user (returns JWT)
POST   /api/auth/logout      - Logout user
GET    /api/auth/me          - Get current user info
POST   /api/auth/refresh     - Refresh JWT token
```

### Database Schema

#### Current Models

**Snack (Menu Item)**
```prisma
model Snack {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  image       String?
  category    String
  available   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Cart**
```prisma
model Cart {
  id        String     @id @default(cuid())
  userId    String
  items     CartItem[]
  total     Float      @default(0)
  itemCount Int        @default(0)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

**CartItem**
```prisma
model CartItem {
  id        String   @id @default(cuid())
  cartId    String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  menuId    String
  quantity  Int
  price     Float
  subtotal  Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Planned Models (Sprint 3+)

**User**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(CUSTOMER)
  cart      Cart?
  orders    Order[]
  addresses Address[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  CUSTOMER
  ADMIN
}
```

**Order**
```prisma
model Order {
  id              String      @id @default(cuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]
  total           Float
  status          OrderStatus @default(PENDING)
  shippingAddress String
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### Frontend Components

#### Existing Components
- `Menu.jsx` - Menu listing page with Redux integration
- `App.jsx` - Main app wrapper with routing
- Navigation, Header, Footer

#### Components in Progress (Sprint 2)
- `Cart.jsx` - Shopping cart page
- `CartDisplay.jsx` - Cart items list
- `MenuItem.jsx` - Individual menu item card with add-to-cart

#### Planned Components (Sprint 3+)
- `Login.jsx` - User authentication
- `Signup.jsx` - User registration
- `Checkout.jsx` - Checkout flow
- `OrderHistory.jsx` - Customer order tracking
- `AdminDashboard.jsx` - Admin order management

### Redux State Structure

#### Current Slices
```javascript
{
  snacks: {
    items: [],           // Menu items array
    loading: false,
    error: null,
    selectedSnack: null
  },
  cart: {
    cartId: null,
    items: [],           // CartItems
    total: 0,
    itemCount: 0,
    loading: false,
    error: null
  }
}
```

#### Async Thunks (Available)
- `fetchSnacks()` - Get all menu items
- `fetchSnackById(id)` - Get single item
- `createSnack(data)` - Create item (admin)
- `updateSnack(id, data)` - Update item (admin)
- `deleteSnack(id)` - Delete item (admin)

#### Async Thunks (In Progress)
- `fetchCart(cartId)` - Get cart from API
- `addItem(cartId, menuId, quantity)` - Add to cart
- `updateItem(cartId, itemId, quantity)` - Change quantity
- `removeItem(cartId, itemId)` - Remove from cart
- `clearCart(cartId)` - Empty cart

---

## 🏗️ ARCHITECTURE & IMPLEMENTATION

### Frontend-Backend Connection

**API Flow:**
1. Component mounts and dispatches Redux async thunk
2. Thunk calls API service with endpoint
3. API service uses fetch to make HTTP request
4. Backend receives request and processes
5. Backend returns JSON response with data
6. Redux reducer updates state with response
7. Component re-renders with new state

**Example: Fetching Menu**
```javascript
// 1. Component dispatches action
dispatch(fetchSnacks())

// 2. Thunk in snackSlice.js calls service
export const fetchSnacks = createAsyncThunk(
  'snacks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await snackService.getAllSnacks()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// 3. Service calls API
// services/snackService.js
export const getAllSnacks = async () => {
  return await api.get('/api/snacks')
}

// 4. API makes HTTP request
// services/api.js
export const get = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`)
  return response.json()
}

// 5. Backend handles request
// apps/backend/src/routes/snackRoutes.js
router.get('/api/snacks', snackController.getAllSnacks)

// 6. Controller returns data
// apps/backend/src/controllers/snackController.js
export const getAllSnacks = async (req, res) => {
  const snacks = await snackModel.getAllSnacks()
  res.json(snacks)
}
```

### CORS & Development

**Frontend** (port 5173) ↔ **Backend** (port 5001)

- CORS middleware enabled in Express
- Vite proxy configured for `/api` requests
- Development: `fetch('/api/snacks')` proxied to backend
- Production: Nginx reverse proxy handles routing

### Docker Architecture

```
docker-compose.yml
├── postgres (port 5432)
│   └── Database: taste_of_aloha
├── backend (port 3000)
│   └── Dockerfile: multi-stage Node build
├── web (port 80)
    └── Dockerfile: Nginx serving React build
```

**Production Flow:**
1. Browser requests / from port 80 (Nginx)
2. Nginx serves static React files
3. Browser requests /api/* from port 80
4. Nginx reverse-proxies to backend:3000
5. Backend handles API requests and database

### Deployment Process

**Development:**
```bash
npm run dev              # Start both apps locally
```

**Docker Development:**
```bash
docker compose up       # Run all services in containers
```

**Production:**
```bash
docker compose -f docker-compose.prod.yml up -d
# Multi-stage builds optimized for production
# Nginx serves with gzip compression
# All services behind Nginx reverse proxy
```

---

## 🎯 SPRINT PLANNING & TASKS

### Sprint 2: Shopping Cart MVP (Current)

**Status:** 🔄 In Progress (PR #33)  
**Duration:** January 3-17, 2026

#### Phase 1: Database Migration ✅ COMPLETE
- ✅ Created Cart and CartItem models in schema.prisma
- ✅ Generated Prisma migration
- ✅ Applied migration to database

#### Phase 2: Cart Controller 🔄 IN PROGRESS
**File:** `apps/backend/src/controllers/cartController.js`

```javascript
// Methods to implement:
- getAllCarts()          // Get all carts (admin)
- getCartByUserId()      // Get user's specific cart
- createCart()           // Create new cart
- addItemToCart()        // Add item with quantity
- updateCartItem()       // Change item quantity
- removeItemFromCart()   // Remove item from cart
- clearCart()            // Empty entire cart
- deleteCart()           // Delete cart record
```

#### Phase 3: Cart Routes ⬜ NOT STARTED
**File:** `apps/backend/src/routes/cartRoutes.js`

```javascript
// Routes to implement:
POST   /api/carts/:id/items/:menuId
PUT    /api/carts/:id/items/:itemId
DELETE /api/carts/:id/items/:itemId
GET    /api/carts/user/:userId
```

#### Phase 4: Frontend Redux Slice ⬜ NOT STARTED
**File:** `apps/web/src/store/slices/cartSlice.js`

```javascript
// Async thunks to implement:
- fetchCart(cartId)
- addItem(cartId, menuId, quantity)
- updateItem(cartId, itemId, quantity)
- removeItem(cartId, itemId)
- clearCart(cartId)
```

#### Phase 5: Cart Service ⬜ NOT STARTED
**File:** `apps/web/src/services/cartService.js`

```javascript
// Methods to implement:
- getCart(cartId)
- createCart()
- addItem(cartId, menuId, quantity)
- updateItem(cartId, itemId, quantity)
- removeItem(cartId, itemId)
- clearCart(cartId)
```

#### Phase 6: Cart UI Components ⬜ NOT STARTED
**Files:**
- `apps/web/src/components/Cart/CartDisplay.jsx` - List items
- `apps/web/src/pages/Cart.jsx` - Cart page
- Modify `MenuItem.jsx` - Add quantity selector & add-to-cart

#### Phase 7: Testing & Polish ⬜ NOT STARTED
- Jest tests for cart controller
- Vitest tests for cart components
- Integration testing (add → view → remove)

**Success Criteria:**
- ✅ Cart models in database
- 🎯 API endpoints functioning
- 🎯 Items persist in cart across requests
- 🎯 Quantities update correctly
- 🎯 Total calculates automatically
- 🎯 Remove item works
- 🎯 localStorage persistence for guests

---

### Sprint 3: Authentication & Roles (Planned)

**Estimated Duration:** 2 weeks

#### Backend Tasks
- Install bcrypt & jsonwebtoken
- Create User model with role field
- Implement signup endpoint: `POST /api/auth/signup`
- Implement login endpoint: `POST /api/auth/login`
- Create JWT utility functions
- Create auth middleware for route protection
- Add password hashing to signup

#### Frontend Tasks
- Create Login page component
- Create Signup page component
- Implement auth Redux slice
- Store JWT in localStorage
- Add protected routes wrapper
- Redirect to login when unauthorized
- Add logout button to navigation

#### Admin Features
- Create admin middleware to check role
- Restrict menu CRUD to admin only
- Create admin dashboard layout
- Show admin link only to admin users

---

### Sprint 4: Checkout & Stripe (Planned)

**Estimated Duration:** 2-3 weeks

#### Stripe Setup
- Create Stripe account
- Get publishable & secret keys
- Install stripe SDK

#### Backend Tasks
- Create `POST /api/payments/intent` endpoint
- Calculate order total with tax/fees
- Create Stripe Payment Intent
- Return client_secret to frontend

#### Frontend Tasks
- Create Checkout page component
- Add shipping address form
- Integrate Stripe Elements (card input)
- Submit payment to Stripe
- Handle confirmation & errors
- Show success message

---

### Sprint 5: Orders & Admin (Planned)

**Estimated Duration:** 2 weeks

#### Backend Tasks
- Create Order model in Prisma
- Create Order CRUD endpoints
- Create OrderItem model
- Implement order status updates
- Add email notification structure

#### Frontend Tasks
- Create order history page
- Show order details
- Display order status
- Create admin order dashboard
- Add order management controls

---

### Sprint 6: Testing & Deployment (Planned)

**Estimated Duration:** 2-3 weeks

#### Testing
- Unit tests for all controllers
- Integration tests for API flows
- Component tests for React
- E2E tests for critical flows
- Target: 70%+ coverage

#### CI/CD
- GitHub Actions workflow
- Automated testing on pull requests
- Build & push Docker images
- Deploy to production server

#### Deployment
- Set up production database
- Configure environment variables
- Deploy to cloud (AWS/Heroku/DigitalOcean)
- Monitor application health
- Set up error logging

---

## 🔧 COMMAND REFERENCE

### Project Setup

```bash
# Install all dependencies (run from root)
npm install

# Install specific app dependencies
cd apps/backend && npm install
cd apps/web && npm install
```

### Development

```bash
# Start both servers (from root with concurrently)
npm run dev

# Or start individually:
# Terminal 1: Backend (from apps/backend)
npm run dev    # Runs on port 5001 with nodemon

# Terminal 2: Frontend (from apps/web)
npm run dev    # Runs on port 5173 with Vite
```

### Database Commands

```bash
# Open Prisma Studio (visual database editor)
npx prisma studio

# Create new migration after schema changes
npx prisma migrate dev --name your_migration_name

# Apply migrations to production database
npx prisma migrate deploy

# Generate Prisma Client (after schema changes)
npx prisma generate

# Reset database (delete all data)
npx prisma migrate reset

# View database schema
npx prisma db push
```

### Docker Commands

```bash
# Start development environment
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f

# Rebuild containers after changes
docker compose up -d --build

# Start production environment
docker compose -f docker-compose.prod.yml up -d

# Stop production
docker compose -f docker-compose.prod.yml down

# Remove all Docker images
docker system prune -a
```

### Testing

```bash
# Backend tests
cd apps/backend
npm test                 # Run all tests
npm test -- --watch     # Watch mode
npm run coverage        # Coverage report

# Frontend tests
cd apps/web
npm test                # Run all tests
npm test -- --watch    # Watch mode
npm run coverage       # Coverage report
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feat/feature-name

# Check status
git status

# Stage all changes
git add -A

# Commit with message
git commit -m "feat: description of changes"

# Push to remote
git push origin feat/feature-name

# Create pull request on GitHub
# (or use: git pull-request)

# Sync with main
git fetch origin
git rebase origin/main
```

### Building for Production

```bash
# Frontend build
cd apps/web
npm run build          # Creates dist folder
npm run preview        # Test production build locally

# Backend build
cd apps/backend
npm run build          # If using TypeScript/bundler

# Docker build
docker compose -f docker-compose.prod.yml build
```

---

## 🚨 TROUBLESHOOTING

### Database Issues

**Problem:** "Cannot connect to PostgreSQL"
```
Solution:
1. Verify PostgreSQL is running: sudo service postgresql status
2. Check connection string in .env file
3. Ensure database 'taste_of_aloha' exists
4. Test connection: psql -U postgres -d taste_of_aloha
```

**Problem:** Prisma Client version mismatch
```
Solution:
1. Delete node_modules
2. Run: npm install
3. Run: npx prisma generate
4. Run: npx prisma migrate dev
```

**Problem:** Migration fails
```
Solution:
1. Check schema.prisma for syntax errors
2. Run: npx prisma validate
3. If stuck, reset: npx prisma migrate reset
4. Reapply migrations: npx prisma migrate deploy
```

### Docker Issues

**Problem:** Port already in use
```
Solution:
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

**Problem:** Container won't start
```
Solution:
1. Check logs: docker compose logs backend
2. Rebuild: docker compose up -d --build
3. Clean slate: docker system prune -a
4. Then: docker compose up -d
```

### Frontend Issues

**Problem:** API calls return 404
```
Solution:
1. Verify backend is running on port 5001
2. Check API endpoint path matches backend routes
3. Check CORS is enabled in backend
4. Verify vite.config.js proxy settings
```

**Problem:** Redux state not updating
```
Solution:
1. Check browser Redux DevTools
2. Verify async thunk is dispatching correctly
3. Check reducer is handling action type
4. Add console.log to debug
```

### General Troubleshooting

**Node dependencies issue:**
```bash
rm -rf node_modules package-lock.json
npm install
npm install -g concurrently    # If needed
```

**Clear cache:**
```bash
npm cache clean --force
docker system prune -a
```

**Check versions:**
```bash
node --version        # Should be v24.11.0+
npm --version         # Should be v10.8.0+
docker --version      # Should be v26.0.0+
```

---

## 📚 LEARNING RESOURCES

### Technology Guides

**React & Hooks**
- Official: https://react.dev
- Redux Toolkit: https://redux-toolkit.js.org
- React Router: https://reactrouter.com

**Node.js & Express**
- Official: https://nodejs.org
- Express: https://expressjs.com
- Middleware: https://expressjs.com/en/guide/using-middleware.html

**Database**
- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs
- SQL Basics: https://www.w3schools.com/sql

**DevOps**
- Docker: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- GitHub Actions: https://docs.github.com/actions

**Security**
- JWT Explained: https://jwt.io
- bcrypt Hashing: https://github.com/kelektiv/node.bcrypt.js
- CORS Guide: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

## 📋 FEATURE CHECKLIST

### Core MVP Features

**Menu Management:**
- ✅ CRUD menu items API
- ✅ Database schema for menu
- ✅ Menu display page
- ⬜ Image upload/storage
- ⬜ Category filtering
- ⬜ Search functionality

**Shopping Cart:**
- ✅ Database cart models
- 🔄 Cart API endpoints (in progress)
- 🔄 Cart Redux slice (in progress)
- 🔄 Cart UI components (in progress)
- ⬜ Quantity controls
- ⬜ localStorage persistence

**User Authentication:**
- ⬜ Signup endpoint
- ⬜ Login endpoint
- ⬜ JWT token generation
- ⬜ Protected routes
- ⬜ Role-based access
- ⬜ Logout functionality

**Checkout & Payment:**
- ⬜ Checkout form
- ⬜ Address validation
- ⬜ Stripe integration
- ⬜ Payment processing
- ⬜ Order confirmation
- ⬜ Receipt email

**Order Management:**
- ⬜ Order database models
- ⬜ Order CRUD endpoints
- ⬜ Order status tracking
- ⬜ Admin dashboard
- ⬜ Customer order history
- ⬜ Order notifications

**Testing & Quality:**
- ⬜ Backend unit tests (30%+)
- ⬜ Backend integration tests
- ⬜ Frontend component tests
- ⬜ E2E tests
- ⬜ CI/CD pipeline
- ⬜ Code coverage (70%+)

**Deployment:**
- ⬜ Production database setup
- ⬜ Environment variables
- ⬜ Docker production build
- ⬜ Cloud deployment
- ⬜ Monitoring & logging
- ⬜ Backup strategy

---

## 🤝 TEAM GUIDELINES

### Code Style
- Use camelCase for variables and functions
- Use PascalCase for React components and classes
- Use kebab-case for CSS classes
- Add JSDoc comments for complex functions
- Keep functions small and focused (<30 lines)

### Git Workflow
1. Create feature branch: `git checkout -b feat/feature-name`
2. Make small, focused commits
3. Write clear commit messages: "feat: add cart UI" or "fix: cart total calculation"
4. Push and create pull request
5. Get code review before merging
6. Delete branch after merge

### Pull Request Format
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
Steps to verify the changes

## Screenshots (if UI change)
Add relevant images

## Checklist
- [ ] My code follows style guidelines
- [ ] I have tested my changes
- [ ] I have updated documentation
- [ ] No new warnings generated
```

### Code Review Checklist
- Does code follow project style guide?
- Are functions well-documented?
- Are error cases handled?
- Are tests included?
- Does this break existing features?
- Is database migration needed?

---

## 📞 GETTING HELP

**For Issues:**
1. Check this master documentation first
2. Search existing GitHub issues
3. Check error logs: `docker compose logs` or browser console
4. Create new GitHub issue with:
   - Clear description of problem
   - Steps to reproduce
   - Error messages/logs
   - Screenshots if applicable

**For Feature Ideas:**
1. Check planned sprints (Sprint 3-6)
2. Check GitHub discussions
3. Create discussion post with proposal

**For Deployment Help:**
1. Check [ARCHIVED_DOCUMENTATION.md](ARCHIVED_DOCUMENTATION.md) for detailed planning
2. Check [DOCUMENTATION_CATALOG.md](DOCUMENTATION_CATALOG.md) for specific guides
3. Reference app-specific READMEs:
   - [apps/backend/README.md](apps/backend/README.md)
   - [apps/web/README.md](apps/web/README.md)

---

## 📝 QUICK LINKS

**Essential Files:**
- [Main README](README.md) - Project overview
- [Quick Reference](QUICK_REFERENCE.md) - Common commands
- [Archived Documentation](ARCHIVED_DOCUMENTATION.md) - Detailed planning & history
- [Documentation Catalog](DOCUMENTATION_CATALOG.md) - File index

**Application Code:**
- [Backend README](apps/backend/README.md)
- [Backend Database Guide](apps/backend/DATABASE_SETUP_GUIDE.md)
- [Frontend README](apps/web/README.md)

**Guides & References:**
- [Learning Guide](docs/guides/LEARNING_GUIDE.md)
- [API Guide](docs/guides/BACKEND_API_GUIDE.md)
- [Testing Guide](docs/guides/TESTING_GUIDE.md)
- [Troubleshooting](docs/guides/TROUBLESHOOTING.md)

**GitHub:**
- [Repository](https://github.com/hokumcangus/taste-of-aloha)
- [Active PR #33](https://github.com/hokumcangus/taste-of-aloha/pull/33)
- [Issues](https://github.com/hokumcangus/taste-of-aloha/issues)

---

**Last Updated:** February 3, 2026  
**Current Sprint:** Sprint 2 (Shopping Cart MVP)  
**Repository:** hokumcangus/taste-of-aloha  
**Branch:** feat/sprint-2-shopping-cart
