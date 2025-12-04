# 🌺 Quick Reference: MVP Features & Architecture Flow

## Customer Journey Flows

### 🔵 Guest User Journey

```
1. Browse Menu (Menu Browse Service)
   ↓
2. Add Items to Cart (Shopping Cart Service)
   ↓
3. View Cart & Update Quantities
   ↓
4. Proceed to Checkout (Checkout Service)
   ↓
5. Enter Delivery Details & Contact Info
   ↓
6. Make Payment (Payment Processing Service)
   ↓
7. Receive Order Confirmation (Notification Service)
```

**Services Used**: Menu Browse → Shopping Cart → Checkout → Payment → Order Management → Notification

**Data Flow**:
- Menu items loaded from PostgreSQL (cached in Redis)
- Cart stored in browser session
- Order created in PostgreSQL after payment
- Email sent via SendGrid/Twilio

---

### 🟢 Authenticated User Journey

```
1. Login (Authentication Service)
   ↓
2. Browse Menu (Menu Browse Service)
   ↓
3. Add Items to Cart (Shopping Cart Service - persists to DB)
   ↓
4. View Cart & Update Quantities
   ↓
5. Proceed to Checkout (Checkout Service)
   ↓
6. Select Saved Address or Add New
   ↓
7. Select Saved Payment Method or Add New
   ↓
8. Make Payment (Payment Processing Service)
   ↓
9. Receive Confirmation & Track Order
   ↓
10. View in Order History (Order History Service)
```

**Additional Services Used**: Authentication → User Profile → Order History

**Benefits**:
- Saved addresses and payment methods
- Cart persists across sessions
- Order history access
- Faster checkout
- Loyalty points (future)

---

### 🔴 Admin Journey

```
1. Login as Admin (Authentication Service)
   ↓
2. Access Admin Dashboard
   ↓
3. Manage Menu Items (Menu Management Service)
   - Create new items
   - Update pricing
   - Upload images
   - Set availability
   ↓
4. Monitor Orders (Order Dashboard Service)
   - View incoming orders
   - Update order status
   - Print kitchen tickets
   - Process refunds
   ↓
5. View Reports (Reports Service + Analytics Service)
   - Sales metrics
   - Popular items
   - Revenue tracking
```

**Admin Services**: Menu Management → Order Dashboard → Reports → Analytics

---

## Service Integration Map

### Frontend → Backend Integration

```
Frontend (React)
    ↓ (REST API Calls)
Backend (Express)
    ↓ (Multiple Connections)
    ├── PostgreSQL (Data Storage)
    ├── Redis (Caching)
    ├── S3/Cloud (File Storage)
    ├── Stripe (Payments)
    ├── Firebase/Auth0 (Authentication)
    ├── SendGrid/Twilio (Notifications)
    └── Google Maps (Address Validation)
```

### Key API Endpoints

**Menu APIs**:
- `GET /api/menu` - List all menu items
- `GET /api/menu/:id` - Get single item details
- `GET /api/menu/category/:category` - Filter by category
- `POST /api/menu` - Create item (admin)
- `PUT /api/menu/:id` - Update item (admin)
- `DELETE /api/menu/:id` - Delete item (admin)

**Cart APIs**:
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item
- `DELETE /api/cart` - Clear cart

**Order APIs**:
- `POST /api/orders` - Create new order
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)
- `GET /api/admin/orders` - List all orders (admin)

**Payment APIs**:
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook handler
- `POST /api/payments/refund` - Process refund (admin)

**Auth APIs**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email` - Email verification

**User APIs**:
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/addresses` - List addresses
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address

---

## Database Schema Overview

### Core Tables

**users**
- id (PK)
- email
- password_hash
- first_name
- last_name
- phone
- role (guest, customer, admin)
- created_at
- updated_at

**menu_items**
- id (PK)
- name
- description
- price
- category_id (FK)
- image_url
- available
- dietary_tags
- created_at
- updated_at

**categories**
- id (PK)
- name
- description
- display_order

**orders**
- id (PK)
- user_id (FK, nullable for guests)
- guest_email (for guest orders)
- guest_phone
- status (pending, preparing, out_for_delivery, completed, cancelled)
- subtotal
- tax
- delivery_fee
- total
- delivery_address
- delivery_notes
- scheduled_delivery
- created_at
- updated_at

**order_items**
- id (PK)
- order_id (FK)
- menu_item_id (FK)
- quantity
- price_at_time
- special_instructions

**addresses**
- id (PK)
- user_id (FK)
- label (home, work, etc.)
- street_address
- city
- state
- zip_code
- country
- is_default

**payments**
- id (PK)
- order_id (FK)
- stripe_payment_id
- amount
- status (pending, completed, failed, refunded)
- payment_method
- created_at

**cart_items** (for authenticated users)
- id (PK)
- user_id (FK)
- menu_item_id (FK)
- quantity
- created_at
- updated_at

---

## Tech Stack Quick Reference

### Frontend Stack
```
React 18+
  └── Next.js (SSR/CSR)
      └── Redux Toolkit (State Management)
          └── React Query (Server State)
              └── Tailwind CSS (Styling)
                  └── Axios/Fetch (API Calls)
```

### Backend Stack
```
Node.js 18+
  └── Express.js (Web Framework)
      ├── PostgreSQL (Primary Database)
      ├── Redis (Caching & Sessions)
      ├── Prisma/TypeORM (ORM)
      ├── JWT (Authentication)
      ├── Stripe SDK (Payments)
      ├── SendGrid SDK (Email)
      └── Multer/S3 SDK (File Uploads)
```

### DevOps Stack
```
Docker
  └── Docker Compose (Local Dev)
      └── GitHub Actions (CI/CD)
          └── AWS/GCP/Azure (Hosting)
              ├── CloudFront/CDN (Static Assets)
              ├── RDS/Cloud SQL (Database)
              ├── ElastiCache (Redis)
              └── S3/Cloud Storage (Files)
```

---

## Security Checklist

### ✅ Frontend Security
- [ ] Input validation on all forms
- [ ] XSS prevention (sanitize user input)
- [ ] CSRF protection
- [ ] Secure storage of tokens (httpOnly cookies)
- [ ] HTTPS only
- [ ] Content Security Policy headers

### ✅ Backend Security
- [ ] Authentication on all protected routes
- [ ] Role-based authorization
- [ ] SQL injection prevention (parameterized queries)
- [ ] Rate limiting on API endpoints
- [ ] Password hashing (bcrypt)
- [ ] JWT token expiration
- [ ] Environment variables for secrets
- [ ] CORS configuration
- [ ] Helmet.js for security headers

### ✅ Payment Security
- [ ] Stripe handles card data (PCI compliance)
- [ ] Use Stripe.js for tokenization
- [ ] Webhook signature verification
- [ ] HTTPS for all payment endpoints
- [ ] Audit logs for all transactions

### ✅ Data Security
- [ ] Database encryption at rest
- [ ] Encrypted connections (SSL/TLS)
- [ ] Regular backups
- [ ] Access logging
- [ ] GDPR compliance (data deletion)
- [ ] Personal data encryption

---

## Performance Optimization

### Caching Strategy
- **Redis Cache**:
  - Menu items (30 min TTL)
  - User sessions (24 hours)
  - API responses (5-15 min TTL)
  - Rate limit counters

### Database Optimization
- Indexes on frequently queried columns
- Query optimization for common operations
- Connection pooling
- Read replicas for scaling

### Frontend Optimization
- Code splitting (lazy loading)
- Image optimization (WebP, lazy loading)
- CDN for static assets
- Service worker for PWA
- Memoization of expensive components

---

## Monitoring & Logging

### What to Monitor
- **Application**: Error rates, response times, throughput
- **Infrastructure**: CPU, memory, disk usage
- **Database**: Query performance, connection pool
- **External Services**: API success rates, latency

### Logging Strategy
- **Info**: Successful operations, user actions
- **Warning**: Recoverable errors, degraded performance
- **Error**: Failed operations, exceptions
- **Debug**: Detailed troubleshooting info (dev only)

### Tools
- Application logs: Winston/Bunyan
- Error tracking: Sentry
- Performance: New Relic/DataDog
- Uptime monitoring: Pingdom/UptimeRobot

---

## Development Workflow

### Local Development
```bash
# 1. Start backend
cd apps/backend
npm run dev

# 2. Start frontend
cd apps/web
npm run dev

# 3. Start Redis (via Docker)
docker run -d -p 6379:6379 redis

# 4. Start PostgreSQL (via Docker)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres
```

### Testing Strategy
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and service interactions
- **E2E Tests**: Complete user flows
- **Performance Tests**: Load testing with realistic scenarios

### Deployment Process
1. Push code to feature branch
2. Create pull request
3. Automated tests run (CI)
4. Code review
5. Merge to main
6. Automated deployment (CD)
7. Smoke tests in production
8. Monitor for issues

---

*Quick Reference Version 1.0 - December 2025*
