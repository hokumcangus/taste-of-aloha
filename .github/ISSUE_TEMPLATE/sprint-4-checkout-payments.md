---
name: Sprint 4 - Checkout + Payments
about: Implement checkout process and Stripe payment integration
title: 'Sprint 4: Checkout + Payments'
labels: 'sprint-4, payments, enhancement'
assignees: ''
---

## Sprint 4: Checkout + Payments

This sprint focuses on implementing the checkout flow and integrating Stripe for payment processing.

### Tasks

#### 1. Frontend Checkout UI
- [ ] Install Stripe Elements library (`npm install @stripe/stripe-js @stripe/react-stripe-js`)
- [ ] Create Checkout page component (`src/pages/Checkout.jsx`)
- [ ] Implement shipping information form (address, city, state, zip)
- [ ] Implement contact information form (email, phone)
- [ ] Integrate Stripe Elements card input component
- [ ] Fetch clientSecret from backend
- [ ] Handle payment submission
- [ ] Display payment confirmation/success page
- [ ] Handle payment errors gracefully
- [ ] **Acceptance Criteria**: Client retrieves clientSecret from server and renders card input

#### 2. Backend Payment Intent
- [ ] Install Stripe SDK (`npm install stripe`)
- [ ] Configure Stripe API keys (test mode initially)
- [ ] Create POST `/api/payments/create-intent` endpoint
- [ ] Calculate order total from cart items
- [ ] Create PaymentIntent with Stripe API
- [ ] Return clientSecret to frontend
- [ ] Add comprehensive error handling
- [ ] Log payment attempts for debugging
- [ ] **Acceptance Criteria**: PaymentIntent created in Stripe dashboard

#### 3. Stripe Webhook Handler
- [ ] Create POST `/api/webhooks/stripe` endpoint
- [ ] Verify webhook signature using Stripe signing secret
- [ ] Handle `payment_intent.succeeded` event
- [ ] Create Order model in Prisma schema
- [ ] Store order details from payment metadata
- [ ] Update order status to "paid"
- [ ] Clear user's cart after successful payment
- [ ] Test webhook with Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`)
- [ ] **Acceptance Criteria**: Successful payment creates Order row in database with status "paid"

### Environment Variables Required
- `STRIPE_PUBLISHABLE_KEY` (frontend)
- `STRIPE_SECRET_KEY` (backend)
- `STRIPE_WEBHOOK_SECRET` (backend)

### Dependencies
- Sprint 3 (Authentication) should be completed
- Stripe account created and configured
- Test credit card: `4242 4242 4242 4242`

### Related Issues
- Closes part of #1 (Taste of Aloha Project-Ready Checklist)

### Security Considerations
- [ ] Never expose Stripe secret key to frontend
- [ ] Always verify webhook signatures
- [ ] Use HTTPS in production
- [ ] Validate payment amounts on backend
- [ ] Sanitize all user inputs

### Testing Checklist
- [ ] Can navigate to checkout page
- [ ] Shipping form validates correctly
- [ ] Contact form validates correctly
- [ ] Stripe card element renders
- [ ] Can enter test card details
- [ ] Payment processes successfully
- [ ] Webhook receives payment confirmation
- [ ] Order is created in database
- [ ] Cart is cleared after payment
- [ ] Error messages display for failed payments

### Documentation
- Document checkout flow diagram
- Document Stripe webhook setup
- Add environment variable documentation
- Add testing guide with test cards
