# 📦 Archived Documentation
**Taste of Aloha - Consolidated Archive**  
Last Updated: February 3, 2026  
Archive Created: Before cleanup of redundant documentation files

---

## 📌 Purpose of This Archive

This document consolidates all important information from documentation files that will be removed during the cleanup process. By preserving this content in a single, organized file, you can:
- Reference historical planning and decisions
- Track project evolution and progress
- Maintain institutional knowledge
- Access sprint planning details
- Review completed milestones

**Files consolidated in this archive:** 20+ redundant docs from `/docs/planning`, `/docs/setup`, `/docs/guides`, and root directory.

---

## 🎯 Sprint Status & Planning

### Sprint Overview (as of Feb 3, 2026)

| Sprint | Status | Issue # | Key Features | Duration |
|--------|--------|---------|--------------|----------|
| Sprint 0: Project Setup | ✅ Complete | #3, #4, #5 | Repos, Project Board, Architecture | 1 week |
| Sprint 1: Core Scaffolding | ✅ Complete | #8 | Node, Docker, React, Express | 2 weeks |
| Sprint 2: Menu + Cart MVP | 🔄 In Progress | #33 (PR) | Database, Menu API, Cart | 2 weeks |
| Sprint 3: Authentication | 📋 Planned | TBD | Login, Signup, JWT, Roles | 2 weeks |
| Sprint 4: Checkout + Payments | 📋 Planned | TBD | Stripe, Payment Flow | 2-3 weeks |
| Sprint 5: Order Lifecycle | 📋 Planned | TBD | Order Management, Admin | 2 weeks |
| Sprint 6: Tests, CI, Deploy | 📋 Planned | TBD | Testing, CI/CD, Production | 2-3 weeks |
| Stretch: Post-Launch | 📋 Planned | TBD | OAuth, Mobile, Monitoring | Ongoing |

---

## ✅ Completed Milestones

### Sprint 0: Project Setup (Completed)

**Accomplishments:**
- ✅ Created GitHub repository: `hokumcangus/taste-of-aloha`
- ✅ Initialized project board with Backlog, In Progress, Review, Done columns
- ✅ Created architecture diagrams (system-architecture.dio, services-diagram.dio)
- ✅ Established documentation structure in `/docs` folder
- ✅ Added README, LICENSE, and initial project structure

**Key Files Created:**
- Architecture documentation
- Project board setup
- Repository structure

---

### Sprint 1: Core Scaffolding (Completed)

**Environment Setup:**
- ✅ Node.js v24.11.0 installed and verified
- ✅ npm configured and working
- ✅ Git initialized and connected to GitHub
- ✅ Docker Desktop installed and running
- ✅ PostgreSQL 18 installed on Windows

**PowerShell Configuration:**
- ✅ Set up PowerShell aliases for git, npm, docker commands
- ✅ Configured PSReadLine for history search (UpArrow filtering, Ctrl+R)
- ✅ Created profile in both PowerShell and VS Code terminals
- ✅ Reference guides created

**Frontend Setup:**
- ✅ Vite + React initialized in `apps/web/`
- ✅ React Router configured for client-side routing
- ✅ Tailwind CSS v4 integrated
- ✅ Pages created: Home, Menu, About, Checkout
- ✅ Redux Toolkit setup for state management
- ✅ Development server running on port 5173
- ✅ Homepage with video background and responsive design

**Backend Setup:**
- ✅ Express.js server initialized in `apps/backend/`
- ✅ Snack controller and routes created
- ✅ Development server running on port 5001
- ✅ CORS configured for frontend/backend communication
- ✅ Health endpoint `/health` returns 200 status

**Database Setup:**
- ✅ PostgreSQL 18 installed on Windows
- ✅ Prisma ORM installed and configured
- ✅ Database `taste_of_aloha` created
- ✅ `.env` configured with connection string
- ✅ Menu model defined in schema.prisma
- ✅ Initial migration `20251214184223_init` created and applied
- ✅ Prisma Client generated successfully

**Docker Integration:**
- ✅ Backend Dockerfile created (multi-stage build)
- ✅ Frontend Dockerfile created (Nginx-based)
- ✅ nginx.conf configured for web server and reverse proxy
- ✅ docker-compose.yml configured (development)
- ✅ docker-compose.prod.yml configured (production)
- ✅ All services (backend, web, db) can run in containers

**Documentation:**
- ✅ Project README with ecosystem overview
- ✅ LEARNING_GUIDE.md with all technologies explained
- ✅ DATABASE_SETUP_GUIDE.md with step-by-step instructions
- ✅ Architecture diagrams created
- ✅ Documentation organized in folders: guides/, setup/, reference/, planning/, architecture/

---

## 🔄 Sprint 2: Shopping Cart MVP (In Progress)

**Sprint Duration:** January 3-17, 2026 (2 weeks)  
**Status:** 🔄 In Progress  
**Target Completion:** 85%+ (Cart API + Basic Frontend Integration)  
**GitHub PR:** #33 (feat/sprint-2-shopping-cart)

### Goals
- ✅ Database Cart and CartItem models created
- 🔄 Cart API endpoints implemented (CRUD operations)
- 🔄 Cart Redux state management
- 🔄 Cart display component
- 🔄 Add-to-cart functionality
- 🔄 Shopping cart page with item management
- 🔄 Tests for cart operations

### Phase 1: Backend Cart API (Days 1-3)

#### Database Migration ✅ COMPLETE
- **Status**: ✅ Done
- **Files Modified**: 
  - `apps/backend/prisma/schema.prisma` - Added Cart and CartItem models
  - Prisma migration: `add_cart_models`
- **Details**:
  - Cart model: id, userId, items[], total, itemCount, timestamps
  - CartItem model: id, cartId, menuId, quantity, price, subtotal, timestamps
  - Cascade delete for orphaned items

#### Cart Controller Implementation 🔄 IN PROGRESS
- **File**: `apps/backend/src/controllers/cartController.js`
- **Methods to implement**:
  - `getAllCarts()` - Get all carts (admin)
  - `getCartByUserId()` - Get specific user's cart
  - `createCart()` - Create new cart
  - `addItemToCart()` - Add item to cart
  - `updateCartItem()` - Change quantity
  - `removeItemFromCart()` - Delete from cart
  - `clearCart()` - Empty entire cart
  - `deleteCart()` - Remove cart record

#### Cart Routes ⬜ NOT STARTED
- **File**: `apps/backend/src/routes/cartRoutes.js`
- **Endpoints**:
  ```
  POST   /api/carts              - Create cart
  GET    /api/carts/:id          - Get cart by ID
  GET    /api/carts/user/:userId - Get user's cart
  POST   /api/carts/:id/items    - Add item
  PUT    /api/carts/:id/items/:itemId - Update quantity
  DELETE /api/carts/:id/items/:itemId - Remove item
  DELETE /api/carts/:id          - Clear/delete cart
  ```

#### Cart Model / Data Access ⬜ NOT STARTED
- **File**: `apps/backend/src/models/cartModel.js`
- **Methods**:
  - `getAllCarts()`, `getCartById(id)`, `getCartByUserId(userId)`
  - `createCart(data)`, `addItem(cartId, menuId, quantity)`
  - `updateItem(cartId, itemId, quantity)`, `removeItem(cartId, itemId)`
  - `calculateTotal(cartId)`, `clearCart(cartId)`, `deleteCart(cartId)`

#### Cart Tests ⬜ NOT STARTED
- **File**: `apps/backend/tests/cartApi.test.js`
- **Coverage**: POST add item, GET cart, PUT update quantity, DELETE remove item, Error handling, Edge cases

### Phase 2: Frontend Cart State (Days 4-5)

#### Redux Cart Slice ⬜ NOT STARTED
- **File**: `apps/web/src/store/slices/cartSlice.js`
- **State Structure**:
  ```javascript
  {
    cartId: null,
    items: [],        // CartItems
    total: 0,
    itemCount: 0,
    loading: false,
    error: null
  }
  ```
- **Async Thunks**: `fetchCart()`, `addItem()`, `updateItem()`, `removeItem()`, `clearCart()`

#### Cart Service ⬜ NOT STARTED
- **File**: `apps/web/src/services/cartService.js`
- **Methods**: `getCart(cartId)`, `createCart()`, `addItem()`, `updateItem()`, `removeItem()`, `clearCart()`

#### Redux Integration Tests ⬜ NOT STARTED
- **File**: `apps/web/src/test/cartSlice.test.js`
- **Coverage**: Reducer state updates, Async thunk handling, Item operations, Total calculation

### Phase 3: Frontend Cart UI (Days 5-8)

#### Cart Display Component ⬜ NOT STARTED
- **File**: `apps/web/src/components/Cart/CartDisplay.jsx`
- **Features**: List items, Show prices/quantities, Remove buttons, Quantity controls, Cart total, Empty cart message

#### Add-to-Cart Button ⬜ NOT STARTED
- **File**: `apps/web/src/components/Menu/MenuItem.jsx` (modify)
- **Features**: Quantity selector, Add button, Success toast, Error handling

#### Shopping Cart Page ⬜ NOT STARTED
- **File**: `apps/web/src/pages/Cart.jsx` (create)
- **Features**: Display items, Edit quantities, Remove items, Cart summary, Checkout button, Continue shopping button

#### Cart Persistence (localStorage) ⬜ NOT STARTED
- **File**: `apps/web/src/middleware/cartMiddleware.js` (create)
- **Features**: Save to localStorage, Load on startup, Sync with API on login

---

## 📋 Complete Task Breakdown

### Sprint 2: Menu + Cart MVP (Detailed)

**1. Database Setup with Prisma**
- ✅ Install Prisma dependencies
- ✅ Create Prisma schema for menu items
- ✅ Configure database connection
- ✅ Run initial migration
- ✅ Verify tables created in Postgres
- ✅ Create Cart and CartItem models
- **Acceptance**: tables created in Postgres

**2. Backend Menu CRUD Endpoints**
- ✅ Implement GET /api/snacks endpoint (list all items)
- ✅ Implement GET /api/snacks/:id endpoint (get single item)
- ✅ Implement POST /api/snacks endpoint (create item)
- ✅ Implement PUT /api/snacks/:id endpoint (update item)
- ✅ Implement DELETE /api/snacks/:id endpoint (delete item)
- ✅ Add validation and error handling
- ✅ Test endpoints with sample data
- **Acceptance**: API returns created menu item and persists row

**3. Frontend Menu and Cart**
- ✅ Create Menu page component
- ✅ Fetch and display menu items from API
- 🔄 Implement add-to-cart functionality
- 🔄 Create cart component/page
- 🔄 Implement localStorage persistence
- 🔄 Add quantity controls (increase/decrease)
- 🔄 Add remove from cart functionality
- 🔄 Display cart total
- **Acceptance**: items add to cart and survive page refresh

### Sprint 3: Authentication + Roles (Planned)

**1. Backend Authentication System**
- ⬜ Install bcrypt and jsonwebtoken dependencies
- ⬜ Create User model with Prisma schema
- ⬜ Implement POST /api/auth/signup endpoint
- ⬜ Implement POST /api/auth/login endpoint
- ⬜ Create JWT generation utility
- ⬜ Create authentication middleware
- ⬜ Add role field to user model (customer/admin)
- **Acceptance**: user signup/login works, JWT tokens issued

**2. Frontend Login/Signup Pages**
- ⬜ Create Login page with form validation
- ⬜ Create Signup page with password confirmation
- ⬜ Implement authentication state in Redux
- ⬜ Add protected routes for authenticated users
- ⬜ Store JWT in localStorage or httpOnly cookie
- ⬜ Add logout functionality
- **Acceptance**: users can register, login, and access protected pages

**3. Admin Role Protection**
- ⬜ Add admin middleware to protect routes
- ⬜ Create admin dashboard layout
- ⬜ Add role check on frontend routes
- ⬜ Restrict menu management to admin users
- **Acceptance**: only admin users can manage menu items

### Sprint 4: Checkout + Payments (Planned)

**1. Stripe Integration**
- ⬜ Create Stripe account and get API keys
- ⬜ Install Stripe SDK (backend and frontend)
- ⬜ Configure Stripe environment variables
- **Acceptance**: Stripe SDK initialized in both environments

**2. Payment Intent API**
- ⬜ Create POST /api/payments/intent endpoint
- ⬜ Calculate order total including tax and fees
- ⬜ Create Stripe Payment Intent
- ⬜ Return client_secret to frontend
- **Acceptance**: Payment Intent created successfully

**3. Frontend Checkout Flow**
- ⬜ Create Checkout page with shipping form
- ⬜ Integrate Stripe Elements for card input
- ⬜ Submit payment to Stripe
- ⬜ Handle payment confirmation
- ⬜ Show success/error messages
- **Acceptance**: customers can complete checkout

---

## 🏗️ MVP Features List

### Core Features (Essential)

#### 1. Menu Management (Admin)
**Description**: Administrative interface for managing menu items, categories, and pricing.

**Key Capabilities**:
- ✅ Create, read, update, delete (CRUD) menu items
- ✅ Upload and manage product images
- ✅ Set pricing, descriptions, and nutritional information
- ✅ Manage categories (Restaurant, Bakery, Grocery)
- ✅ Mark items as available/unavailable
- ✅ Set dietary tags (vegan, gluten-free, etc.)
- ⬜ Bulk import/export menu data

**User Roles**: Admin only

**Technical Components**:
- Admin dashboard UI
- Menu item API endpoints
- Image storage service
- Database schema for menu items

#### 2. Browse Menu (Customer)
**Description**: Customer-facing interface to view and search available menu items.

**Key Capabilities**:
- ✅ View all menu items by category
- ✅ Search and filter by name, category, dietary restrictions
- ✅ View detailed item information (ingredients, price, images)
- ✅ See item availability status
- ⬜ Sort by price, popularity, name
- ✅ Responsive design for mobile and desktop

**User Roles**: All visitors (guest and authenticated)

**Technical Components**:
- Menu browsing UI
- Search and filter functionality
- Menu API endpoints
- Caching layer for performance

#### 3. Shopping Cart
**Description**: Temporary storage for items customers want to order.

**Key Capabilities**:
- 🔄 Add items to cart
- 🔄 Update quantities
- 🔄 Remove items
- 🔄 View cart total
- ⬜ Save cart for authenticated users (persist across sessions)
- 🔄 Guest cart (session-based)
- ⬜ Apply special instructions/notes to items
- ⬜ Calculate taxes and fees

**User Roles**: All visitors (guest and authenticated)

**Status**: In Progress (Sprint 2)

#### 4. Checkout Process
**Description**: Complete order placement flow for both guest and authenticated users.

**Key Capabilities**:
- ⬜ Enter delivery address
- ⬜ Provide contact information (name, email, phone)
- ⬜ Select delivery time/date
- ⬜ Add order notes
- ⬜ Review order summary
- ⬜ Process payment via Stripe

**User Roles**: Guest and Authenticated

**Status**: Planned (Sprint 4)

---

## 🔧 Implementation Details

### Frontend-Backend Connection Architecture

**Overview**: The React frontend connects to the Express backend using Redux Toolkit for state management and a custom API service layer.

**Redux Store Setup:**
- Redux Toolkit creates centralized state management
- `snackSlice` with async thunks handles API calls
- Store manages: snacks array, loading status, error messages
- Eliminates prop drilling across components

**API Service Layer:**
- Two-layer architecture:
  1. `api.js` - Generic API client using native `fetch` API
  2. `snackService.js` - Specific functions for snack endpoints
- Handles all HTTP methods (GET, POST, PUT, DELETE)
- Proper error handling and JSON parsing
- Configurable base URL via environment variables (`http://localhost:3000`)

**Backend CORS Configuration:**
- CORS middleware enabled in Express
- Required because frontend (port 5173) differs from backend (port 3000)
- Allows cross-origin API requests

**Component Integration:**
- Menu page uses Redux hooks (`useSelector`, `useDispatch`)
- Auto-dispatches `fetchSnacks` on component mount
- Displays loading states and error messages
- Unidirectional data flow pattern

**Development Configuration:**
- Vite proxy forwards `/api` requests to backend
- PostCSS configured for Tailwind CSS v4
- Package.json uses ES modules (`"type": "module"`)

**Nginx Configuration:**
- Serves built React static files in production
- Acts as reverse proxy for API routes
- Routes `/api/*` to backend container
- Eliminates CORS issues in production
- Enables caching and compression

---

## 🎨 Frontend Implementation Notes

### Tailwind CSS v4 Migration
- Changed from older `@tailwind` directives to single `@import "tailwindcss";`
- Updated in `index.css` for linting compatibility
- Uses `@tailwindcss/postcss` plugin

### React Router Implementation
- Uses `BrowserRouter` for client-side navigation
- Routes: `/` (Home), `/menu` (Menu), `/about` (About)
- Sticky navigation bar with `Link` components
- Nginx `try_files` directive supports SPA behavior

### Homepage Video Background
- Full-screen looping video with autoPlay, loop, muted attributes
- Poster image fallback during load
- Mobile responsive: static image for screens < 768px
- Dark overlay (`bg-black/50`) for text readability
- Responsive typography (`text-5xl md:text-7xl`)

---

## 🐙 Git Workflow & Branch Management

### Branch Strategy
- **main** - Production-ready code
- **feat/*** - Feature branches for new work
- **fix/*** - Bug fix branches

### Current Branches
- `feat/docker-setup` - Docker configuration and compose files
- `feat/homepage-video-ui` - UI improvements and homepage video
- `feat/sprint-2-shopping-cart` - Shopping cart implementation (active PR #33)

### Workflow
1. Create feature branch from main
2. Make commits with clear messages
3. Push to remote repository
4. Create pull request for review
5. Merge to main after approval

---

## 📊 Development Progress Summary

### Completed Features (Sprint 0-1)
- ✅ Complete development environment setup
- ✅ Frontend scaffold with Vite + React
- ✅ Backend scaffold with Express.js
- ✅ Database setup with PostgreSQL and Prisma
- ✅ Docker containerization
- ✅ Menu CRUD API endpoints
- ✅ Menu display page with Redux integration
- ✅ Documentation structure
- ✅ Architecture diagrams

### In Progress (Sprint 2)
- 🔄 Shopping cart database models
- 🔄 Cart API endpoints
- 🔄 Cart Redux state management
- 🔄 Cart UI components
- 🔄 Add-to-cart functionality
- 🔄 Cart persistence

### Next Up (Sprint 3+)
- ⬜ User authentication (JWT)
- ⬜ Role-based access control
- ⬜ Checkout flow
- ⬜ Stripe payment integration
- ⬜ Order management system
- ⬜ Admin dashboard
- ⬜ Email notifications
- ⬜ Comprehensive testing
- ⬜ CI/CD pipeline
- ⬜ Production deployment

---

## 📖 Quick Reference Commands

### Docker Commands
```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Rebuild containers
docker compose up -d --build

# Production build
docker compose -f docker-compose.prod.yml up -d
```

### Database Commands
```bash
# Prisma Studio (GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

### Development Servers
```bash
# Frontend (from apps/web)
npm run dev          # Port 5173

# Backend (from apps/backend)
npm run dev          # Port 5001

# Both simultaneously (from root)
npm run dev          # Requires concurrently package
```

---

## 🎯 Success Metrics

### Sprint 2 Targets
- ✅ Database models created and migrated
- 🎯 85%+ cart API endpoints functional
- 🎯 Basic cart UI implemented
- 🎯 Add-to-cart working on menu page
- 🎯 Cart persists in localStorage
- 🎯 Cart page shows items and totals

### Overall MVP Targets
- All core features functional
- Responsive design on mobile/tablet/desktop
- Payment processing working with Stripe
- Admin can manage menu and orders
- Customers can browse, order, and pay
- Basic testing coverage (60%+)
- Deployed to production

---

## 🚨 Known Issues & Workarounds

### Port 3000 Conflict
**Issue**: Cannot run local dev server and Docker backend simultaneously on port 3000.  
**Workaround**: Choose one environment (local OR Docker) for development.  
**Solution**: Backend now runs on port 5001 locally, port 3000 in Docker.

### Prisma Client Generation
**Issue**: Prisma Client must be regenerated after schema changes.  
**Workaround**: Always run `npx prisma generate` after migrations.  
**Solution**: Added to migration workflow documentation.

---

## 📚 Documentation Structure (Pre-Cleanup)

### Root Level (5 files)
- README.md - Main project overview
- QUICK_REFERENCE.md - Quick commands and workflows
- DOCUMENTATION_INDEX.md - Master documentation index
- CONSOLIDATION_NOTES.md - Consolidation process notes
- IMPLEMENTATION_COMPLETE.md - Implementation milestone (empty)

### Apps Folder (3 files)
- apps/backend/README.md - Backend documentation
- apps/backend/DATABASE_SETUP_GUIDE.md - Database setup
- apps/web/README.md - Frontend documentation

### Docs Folder (29 files)

**Guides (11 files)**
- LEARNING_GUIDE.md - Technology explanations
- BACKEND_API_GUIDE.md - API reference
- DATABASE_API_GUIDE.md - Database guide
- ORDER_SYSTEM_GUIDE.md - Order workflow
- TESTING_GUIDE.md - Testing strategies
- TEAM_ONBOARDING.md - Onboarding process
- IMPLEMENTATION_SUMMARY.md - Implementation details
- QUICK_START.md - Fast setup
- RUN_SERVICES_AND_SEED.md - Running services
- TROUBLESHOOTING.md - Problem solving
- EXTERNAL_TROUBLESHOOTING_TEMPLATE.md - Support template
- TASK_COMPLETE.md - Completed tasks (empty)

**Planning (7 files)**
- SPRINT_PLANNING.md - Sprint overview
- SPRINT_2_TRACKING.md - Sprint 2 details
- MVP_FEATURES.md - Feature definitions
- TASK_BREAKDOWN.md - Detailed tasks
- ACTION_ITEMS.md - Current actions (empty)
- DELIVERABLES_SUMMARY.md - Deliverables list
- DEVELOPMENT_PROGRESS.md - Progress checklist

**Architecture (2 files)**
- README.md - Architecture overview
- ONE_PAGER.md - Single-page summary

**Reference (4 files)**
- QUICK_REFERENCE.md - Command reference
- ALIAS_QUICK_REFERENCE.md - Shell aliases
- DATABASE_COMMANDS_REFERENCE.md - DB commands
- IMPLEMENTATION.md - Implementation patterns

**Setup (3 files)**
- DOCKER_SETUP_GUIDE.md - Docker instructions
- ISSUES_SETUP_GUIDE.md - GitHub issues
- SETUP_CHECKLIST.md - Setup tasks

**Docs Root (2 files)**
- DOCKER_PRISMA_TROUBLESHOOTING.md - Troubleshooting
- DOCUMENTATION_CONSOLIDATION.md - Consolidation log
- DOCUMENTATION_STRUCTURE.md - Doc organization
- HOW_TO_VIEW_DIAGRAMS.md - Diagram viewing
- INDEX.md - Documentation index

### GitHub Folder (10 files)
- .github/bug_report.md
- .github/pull_request_template.md
- .github/ISSUE_TEMPLATE/README.md
- .github/ISSUE_TEMPLATE/sprint-2-menu-cart-mvp.md
- .github/ISSUE_TEMPLATE/sprint-3-authentication-roles.md
- .github/ISSUE_TEMPLATE/sprint-4-checkout-payments.md
- .github/ISSUE_TEMPLATE/sprint-5-order-lifecycle-admin.md
- .github/ISSUE_TEMPLATE/sprint-6-tests-ci-deployment.md
- .github/ISSUE_TEMPLATE/stretch-goals-post-launch.md

---

## 🗑️ Files Safe to Delete (Post-Archive)

This archive preserves content from the following files, which can now be safely deleted:

### Planning Files (7 files)
- docs/planning/ACTION_ITEMS.md (empty)
- docs/planning/DELIVERABLES_SUMMARY.md
- docs/planning/DEVELOPMENT_PROGRESS.md
- docs/planning/SPRINT_2_TRACKING.md
- docs/planning/MVP_FEATURES.md
- docs/planning/SPRINT_PLANNING.md
- docs/planning/TASK_BREAKDOWN.md

### Setup Files (3 files)
- docs/setup/DOCKER_SETUP_GUIDE.md
- docs/setup/ISSUES_SETUP_GUIDE.md
- docs/setup/SETUP_CHECKLIST.md

### Guide Files (3 files)
- docs/guides/QUICK_START.md
- docs/guides/RUN_SERVICES_AND_SEED.md
- docs/guides/TASK_COMPLETE.md (empty)
- docs/guides/EXTERNAL_TROUBLESHOOTING_TEMPLATE.md

### Reference Files (2 files)
- docs/reference/ALIAS_QUICK_REFERENCE.md
- docs/reference/IMPLEMENTATION.md

### Docs Root Files (3 files)
- docs/DOCKER_PRISMA_TROUBLESHOOTING.md
- docs/DOCUMENTATION_CONSOLIDATION.md
- docs/HOW_TO_VIEW_DIAGRAMS.md
- docs/INDEX.md

### Root Files (1 file)
- IMPLEMENTATION_COMPLETE.md (empty)

### Architecture Files (1 file)
- docs/architecture/ONE_PAGER.md

**Total: 24+ files can be safely removed after verifying this archive.**

---

## ✅ Essential Documentation to Keep

After cleanup, these files should remain:

### Root Level
- README.md
- QUICK_REFERENCE.md
- DOCUMENTATION_INDEX.md
- DOCUMENTATION_CATALOG.md (new)
- ARCHIVED_DOCUMENTATION.md (this file)

### Application Docs
- apps/backend/README.md
- apps/backend/DATABASE_SETUP_GUIDE.md
- apps/web/README.md

### Core Guides
- docs/guides/LEARNING_GUIDE.md
- docs/guides/BACKEND_API_GUIDE.md
- docs/guides/DATABASE_API_GUIDE.md
- docs/guides/ORDER_SYSTEM_GUIDE.md
- docs/guides/TESTING_GUIDE.md
- docs/guides/TEAM_ONBOARDING.md
- docs/guides/IMPLEMENTATION_SUMMARY.md
- docs/guides/TROUBLESHOOTING.md

### Architecture
- docs/architecture/README.md
- docs/architecture/*.dio (diagrams)

### GitHub Templates
- All .github/ISSUE_TEMPLATE/* files
- .github/bug_report.md
- .github/pull_request_template.md

---

## 💡 Post-Cleanup Maintenance Plan

### Quarterly Reviews
1. Review ARCHIVED_DOCUMENTATION.md for outdated sprint info
2. Move completed sprint details to "Historical Sprints" section
3. Update current sprint progress
4. Archive old GitHub issue templates for completed sprints

### Documentation Updates
1. Keep README.md as primary entry point
2. Update QUICK_REFERENCE.md with new commands/workflows
3. Maintain DOCUMENTATION_CATALOG.md as file index
4. Update application-specific READMEs as features evolve

### Version Control
1. Tag major milestones (v1.0, v2.0)
2. Create release notes for production deploys
3. Archive branch-specific documentation after merges
4. Keep this archive file updated with major decisions

---

**End of Archive**  
**This document preserves all critical information from redundant documentation files.**  
**Safe to delete listed files after verifying this archive is committed to version control.**
