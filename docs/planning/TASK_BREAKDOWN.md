# Taste of Aloha - Task Breakdown and Issue Structure

This document provides a structured breakdown of all tasks from [Issue #1](https://github.com/hokumcangus/taste-of-aloha/issues/1) organized by sprint with corresponding GitHub issues.

## Project Board Columns

- **Backlog** - Tasks not yet started
- **In Progress** - Currently being worked on
- **Review** - Completed and awaiting review
- **Done** - Completed and reviewed

---

## Sprint 0: Project Setup (Backlog → Project Setup)

**Status**: ✅ Completed

### Issue #3: Create repositories
- [x] Create repositories: frontend and backend; add README and LICENSE
- [x] Acceptance: repos exist with README and initial commit

### Issue #4: Initialize project board
- [x] Initialize project board (GitHub Projects or Trello)
- [x] Acceptance: project board created with columns: Backlog, In Progress, Review, Done

### Issue #5: Create architecture diagram
- [x] Create architecture diagram and store in repo
- [x] Acceptance: architecture image or text file added to repo

---

## Sprint 1: Core Scaffolding

**Status**: ✅ Completed (Issue #8)

### Issue #8: Sprint 1 → Core Scaffolding
- [x] Install dev tools: Node LTS, Docker, Git
  - [x] Acceptance: developer machine can run `node --version` and `docker ps`
- [x] Frontend: scaffold Vite + React + JavaScript
  - [x] Acceptance: `npm run dev` serves site and shows placeholder
- [x] Backend: scaffold Node + JavaScript server Express
  - [x] Acceptance: `npm run dev` returns 200 on `/health`
- [x] Docker Compose: postgres + backend + optional frontend proxy
  - [x] Acceptance: database and backend containers run locally

---

## Sprint 2: Menu + Cart MVP

**Status**: 🔄 To be created

### Main Tasks:
1. **Database Setup with Prisma**
   - Subtasks:
     - [ ] Install Prisma dependencies
     - [ ] Create Prisma schema for menu items
     - [ ] Configure database connection
     - [ ] Run initial migration
     - [ ] Verify tables created in Postgres
   - Acceptance: tables created in Postgres

2. **Backend Menu CRUD Endpoints**
   - Subtasks:
     - [ ] Implement GET /api/menu endpoint (list all items)
     - [ ] Implement GET /api/menu/:id endpoint (get single item)
     - [ ] Implement POST /api/menu endpoint (create item)
     - [ ] Implement PUT /api/menu/:id endpoint (update item)
     - [ ] Implement DELETE /api/menu/:id endpoint (delete item)
     - [ ] Add validation and error handling
     - [ ] Test endpoints with sample data
   - Acceptance: API returns created menu item and persists row

3. **Frontend Menu and Cart**
   - Subtasks:
     - [ ] Create Menu page component
     - [ ] Fetch and display menu items from API
     - [ ] Implement add-to-cart functionality
     - [ ] Create cart component/page
     - [ ] Implement localStorage persistence
     - [ ] Add quantity controls (increase/decrease)
     - [ ] Add remove from cart functionality
     - [ ] Display cart total
   - Acceptance: items add to cart and survive page refresh

---

## Sprint 3: Authentication + Roles

**Status**: 🔄 To be created

### Main Tasks:
1. **Backend Authentication System**
   - Subtasks:
     - [ ] Install bcrypt and jsonwebtoken dependencies
     - [ ] Create User model with Prisma schema
     - [ ] Implement POST /api/auth/signup endpoint
     - [ ] Implement POST /api/auth/login endpoint
     - [ ] Create JWT generation utility
     - [ ] Create authentication middleware
     - [ ] Add role field to user model (customer/admin)
     - [ ] Test signup and login flows
   - Acceptance: token returned and protected route accessible with token

2. **Frontend Authentication Pages**
   - Subtasks:
     - [ ] Create Login page component
     - [ ] Create Signup page component
     - [ ] Implement form validation
     - [ ] Handle authentication state (Redux/Context)
     - [ ] Store JWT token securely
     - [ ] Implement cart merge logic on login
     - [ ] Add protected route wrapper
     - [ ] Add logout functionality
   - Acceptance: after login, server-side cart merges and user sees saved cart

3. **Admin Role Protection**
   - Subtasks:
     - [ ] Create admin authorization middleware
     - [ ] Protect admin-only endpoints
     - [ ] Add role-based UI rendering
     - [ ] Test admin access controls
     - [ ] Test non-admin restrictions
   - Acceptance: admin endpoints return 403 for non-admin users

---

## Sprint 4: Checkout + Payments

**Status**: 🔄 To be created

### Main Tasks:
1. **Frontend Checkout UI**
   - Subtasks:
     - [ ] Install Stripe Elements library
     - [ ] Create Checkout page component
     - [ ] Implement shipping information form
     - [ ] Implement contact information form
     - [ ] Integrate Stripe Elements card input
     - [ ] Fetch clientSecret from backend
     - [ ] Handle payment submission
     - [ ] Display payment confirmation
   - Acceptance: client retrieves clientSecret from server and renders card input

2. **Backend Payment Intent**
   - Subtasks:
     - [ ] Install Stripe SDK
     - [ ] Configure Stripe API keys
     - [ ] Create POST /api/payments/create-intent endpoint
     - [ ] Calculate order total
     - [ ] Create PaymentIntent with Stripe
     - [ ] Return clientSecret to frontend
     - [ ] Add error handling
   - Acceptance: PaymentIntent created in Stripe dashboard

3. **Stripe Webhook Handler**
   - Subtasks:
     - [ ] Create webhook endpoint
     - [ ] Verify webhook signature
     - [ ] Handle payment_intent.succeeded event
     - [ ] Create Order model in database
     - [ ] Store order details from payment
     - [ ] Update order status to "paid"
     - [ ] Test webhook with Stripe CLI
   - Acceptance: successful payment creates Order row in database with status "paid"

---

## Sprint 5: Order Lifecycle & Admin

**Status**: 🔄 To be created

### Main Tasks:
1. **Backend Order Management**
   - Subtasks:
     - [ ] Create GET /api/admin/orders endpoint (list all orders)
     - [ ] Create GET /api/admin/orders/:id endpoint (get single order)
     - [ ] Create PUT /api/admin/orders/:id/status endpoint
     - [ ] Implement status transitions (paid → preparing → ready → delivered)
     - [ ] Add validation for status changes
     - [ ] Protect endpoints with admin middleware
   - Acceptance: admin can mark order as preparing/ready/delivered

2. **Frontend Order History**
   - Subtasks:
     - [ ] Create Order History page
     - [ ] Fetch user's orders from backend
     - [ ] Display order list with status
     - [ ] Create order detail view
     - [ ] Implement reorder functionality
     - [ ] Add order tracking/status updates
   - Acceptance: user sees past orders and can reorder

3. **Email Notifications**
   - Subtasks:
     - [ ] Choose email service (SendGrid recommended)
     - [ ] Install email SDK
     - [ ] Configure email templates
     - [ ] Implement order confirmation email
     - [ ] Implement status update emails
     - [ ] Add logging for email sends
     - [ ] Test with stub/development mode
   - Acceptance: order confirmation triggers notification stub or log

---

## Sprint 6: Tests, CI, Deployment

**Status**: 🔄 To be created

### Main Tasks:
1. **Testing Infrastructure**
   - Subtasks:
     - [ ] Set up Jest for unit tests
     - [ ] Set up React Testing Library
     - [ ] Set up Supertest for API tests
     - [ ] Write unit tests for utilities
     - [ ] Write integration tests for auth flow
     - [ ] Write integration tests for checkout flow
     - [ ] Write tests for order management
     - [ ] Ensure all tests pass locally
   - Acceptance: tests run in CI and pass

2. **CI/CD Pipeline**
   - Subtasks:
     - [ ] Create GitHub Actions workflow
     - [ ] Add lint step to workflow
     - [ ] Add test step to workflow
     - [ ] Add build verification step
     - [ ] Configure staging deployment
     - [ ] Test PR workflow triggers
   - Acceptance: PRs trigger CI workflow

3. **Production Deployment**
   - Subtasks:
     - [ ] Deploy frontend to Vercel/Netlify
     - [ ] Deploy backend to Render/Fly.io
     - [ ] Set up production Postgres (managed service)
     - [ ] Configure environment variables
     - [ ] Set up domain and SSL
     - [ ] Test end-to-end checkout in staging
     - [ ] Monitor production deployment
   - Acceptance: live site reachable, end-to-end checkout works in staging

---

## Stretch Goals: Post-Launch Features

**Status**: 🔄 To be created (Future enhancements)

### Main Tasks:
1. **OAuth Authentication**
   - Subtasks:
     - [ ] Choose OAuth provider (Google, Facebook)
     - [ ] Set up OAuth application credentials
     - [ ] Install OAuth SDK/library
     - [ ] Implement OAuth callback endpoint
     - [ ] Handle OAuth account linking
     - [ ] Merge guest accounts on OAuth login
     - [ ] Test OAuth flow end-to-end
   - Acceptance: OAuth login creates or links user accounts

2. **Mobile App Wrapper**
   - Subtasks:
     - [ ] Choose framework (Expo or Capacitor)
     - [ ] Set up mobile project
     - [ ] Configure web view integration
     - [ ] Set up push notification service (Firebase)
     - [ ] Implement push notification handling
     - [ ] Test on iOS and Android
     - [ ] Submit to app stores
   - Acceptance: native wrapper opens web app and receives push notifications

3. **Backups & Monitoring**
   - Subtasks:
     - [ ] Set up automated database backups
     - [ ] Configure backup retention policy
     - [ ] Test backup restoration
     - [ ] Install Sentry SDK
     - [ ] Configure error tracking
     - [ ] Set up alerting rules
     - [ ] Create monitoring dashboard
   - Acceptance: backup schedule created; Sentry reports errors

---

## Issue Creation Status

- [x] Sprint 0: Project Setup (Issues #3, #4, #5) - COMPLETED
- [x] Sprint 1: Core Scaffolding (Issue #8) - COMPLETED
- [ ] Sprint 2: Menu + Cart MVP - To be created
- [ ] Sprint 3: Authentication + Roles - To be created
- [ ] Sprint 4: Checkout + Payments - To be created
- [ ] Sprint 5: Order Lifecycle & Admin - To be created
- [ ] Sprint 6: Tests, CI, Deployment - To be created
- [ ] Stretch Goals: Post-Launch Features - To be created

---

## Labels to Use

Suggested labels for organizing issues:
- `sprint-2`, `sprint-3`, `sprint-4`, `sprint-5`, `sprint-6`, `stretch`
- `backend`, `frontend`, `database`, `devops`, `testing`
- `authentication`, `payments`, `orders`, `admin`
- `enhancement`, `documentation`
- `priority: high`, `priority: medium`, `priority: low`

---

## Notes

- Each sprint issue should contain a task checklist for tracking subtasks
- Subtasks should be specific and actionable
- Acceptance criteria should be clear and testable
- Issues should be linked to maintain traceability
- Use GitHub Projects to visualize progress across sprints
