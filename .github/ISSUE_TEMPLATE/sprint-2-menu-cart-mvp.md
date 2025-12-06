---
name: Sprint 2 - Menu + Cart MVP
about: Implement menu display and shopping cart functionality
title: 'Sprint 2: Menu + Cart MVP'
labels: 'sprint-2, enhancement'
assignees: ''
---

## Sprint 2: Menu + Cart MVP

This sprint focuses on implementing the core menu and shopping cart functionality.

### Tasks

#### 1. Database Setup with Prisma
- [ ] Install Prisma dependencies (`npm install @prisma/client prisma`)
- [ ] Create Prisma schema for menu items (name, description, price, image, category)
- [ ] Configure database connection in Prisma schema
- [ ] Run initial migration (`npx prisma migrate dev`)
- [ ] Verify tables created in Postgres
- [ ] **Acceptance Criteria**: Tables created in Postgres and visible via database client

#### 2. Backend Menu CRUD Endpoints
- [ ] Implement GET `/api/menu` endpoint (list all items)
- [ ] Implement GET `/api/menu/:id` endpoint (get single item)
- [ ] Implement POST `/api/menu` endpoint (create item)
- [ ] Implement PUT `/api/menu/:id` endpoint (update item)
- [ ] Implement DELETE `/api/menu/:id` endpoint (delete item)
- [ ] Add input validation and error handling
- [ ] Test endpoints with sample data
- [ ] **Acceptance Criteria**: API returns created menu item and persists row in database

#### 3. Frontend Menu and Cart
- [ ] Create Menu page component (`src/pages/Menu.jsx`)
- [ ] Fetch and display menu items from API
- [ ] Implement add-to-cart functionality
- [ ] Create cart component/page
- [ ] Implement localStorage persistence for cart
- [ ] Add quantity controls (increase/decrease items)
- [ ] Add remove from cart functionality
- [ ] Display cart total (subtotal, tax, total)
- [ ] **Acceptance Criteria**: Items add to cart and survive page refresh

### Dependencies
- PostgreSQL database must be running
- Backend server must be operational

### Related Issues
- Closes part of #1 (Taste of Aloha Project-Ready Checklist)

### Testing Checklist
- [ ] Can view all menu items
- [ ] Can add items to cart
- [ ] Cart persists after page refresh
- [ ] Can update item quantities in cart
- [ ] Can remove items from cart
- [ ] Cart total calculates correctly

### Documentation
- Update API documentation with new endpoints
- Add screenshots of menu and cart pages
