---
name: Sprint 5 - Order Lifecycle & Admin
about: Implement order management for customers and admins
title: 'Sprint 5: Order Lifecycle & Admin'
labels: 'sprint-5, orders, admin, enhancement'
assignees: ''
---

## Sprint 5: Order Lifecycle & Admin

This sprint focuses on implementing order management features for both customers and administrators.

### Tasks

#### 1. Backend Order Management
- [ ] Create GET `/api/admin/orders` endpoint (list all orders)
- [ ] Create GET `/api/admin/orders/:id` endpoint (get single order)
- [ ] Create PUT `/api/admin/orders/:id/status` endpoint
- [ ] Implement status transitions (paid → preparing → ready → delivered)
- [ ] Add validation for status changes (ensure valid transitions)
- [ ] Protect endpoints with admin middleware (`requireAdmin`)
- [ ] Add pagination for order list
- [ ] Add filtering by status and date range
- [ ] **Acceptance Criteria**: Admin can mark order as preparing/ready/delivered

#### 2. Frontend Order History
- [ ] Create Order History page (`src/pages/OrderHistory.jsx`)
- [ ] Create GET `/api/orders` endpoint for user's orders
- [ ] Fetch user's orders from backend
- [ ] Display order list with status badges
- [ ] Create order detail view component
- [ ] Implement reorder functionality (add items back to cart)
- [ ] Add order tracking/status updates UI
- [ ] Add search/filter for order history
- [ ] Show order timeline (ordered → preparing → ready → delivered)
- [ ] **Acceptance Criteria**: User sees past orders and can reorder

#### 3. Email Notifications
- [ ] Choose email service (SendGrid recommended)
- [ ] Install email SDK (`npm install @sendgrid/mail` or similar)
- [ ] Configure API keys for email service
- [ ] Create email templates directory
- [ ] Implement order confirmation email template
- [ ] Implement status update email templates
- [ ] Create email service utility
- [ ] Send email on order creation
- [ ] Send email on status updates
- [ ] Add logging for email sends
- [ ] Test with stub/development mode
- [ ] **Acceptance Criteria**: Order confirmation triggers notification stub or log

### Admin Features
- [ ] Create Admin Dashboard page (`src/pages/admin/Dashboard.jsx`)
- [ ] Display order statistics (total orders, revenue, pending orders)
- [ ] Create Orders Management page (`src/pages/admin/Orders.jsx`)
- [ ] Implement order status update UI
- [ ] Add real-time order notifications (optional)

### Database Updates
Update Order model to include:
- [ ] Order status field (paid, preparing, ready, delivered, cancelled)
- [ ] Order timestamp fields (createdAt, updatedAt, deliveredAt)
- [ ] Customer information (shipping address, contact)
- [ ] Order items (relation to menu items)
- [ ] Payment information reference

### Dependencies
- Sprint 4 (Checkout + Payments) must be completed
- Email service account (SendGrid, Mailgun, etc.)

### Related Issues
- Closes part of #1 (Taste of Aloha Project-Ready Checklist)

### Testing Checklist
- [ ] Admin can view all orders
- [ ] Admin can filter orders by status
- [ ] Admin can update order status
- [ ] Status transitions are validated
- [ ] Non-admin users cannot access admin endpoints
- [ ] Users can view their order history
- [ ] Order details display correctly
- [ ] Reorder functionality works
- [ ] Email notifications are sent (or logged in dev mode)
- [ ] Email templates render correctly

### Documentation
- Document order lifecycle diagram
- Document admin API endpoints
- Document email template customization
- Add email service configuration guide
