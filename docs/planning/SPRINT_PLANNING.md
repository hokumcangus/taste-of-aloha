# Sprint Planning Summary

This document provides a quick overview of all sprints and their key deliverables.

## Sprint Status Overview

| Sprint | Status | Issue # | Key Features |
|--------|--------|---------|--------------|
| Sprint 0: Project Setup | ✅ Done | #3, #4, #5 | Repos, Project Board, Architecture |
| Sprint 1: Core Scaffolding | ✅ Done | #8 | Node, Docker, React, Express |
| Sprint 2: Menu + Cart MVP | 🔄 Planned | TBD | Database, Menu API, Cart |
| Sprint 3: Authentication | 🔄 Planned | TBD | Login, Signup, JWT, Roles |
| Sprint 4: Checkout + Payments | 🔄 Planned | TBD | Stripe, Payment Flow |
| Sprint 5: Order Lifecycle | 🔄 Planned | TBD | Order Management, Admin |
| Sprint 6: Tests, CI, Deploy | 🔄 Planned | TBD | Testing, CI/CD, Production |
| Stretch: Post-Launch | 🔄 Planned | TBD | OAuth, Mobile, Monitoring |

---

## Sprint 2: Menu + Cart MVP (Next Up)

**Goal**: Allow customers to browse menu items and add them to a shopping cart.

**Key Deliverables**:
- PostgreSQL database with Prisma ORM
- Menu CRUD API endpoints
- Menu display page
- Shopping cart with localStorage persistence

**Estimated Effort**: 2-3 weeks

**Technical Stack**:
- Prisma (ORM)
- PostgreSQL (Database)
- Express (Backend)
- React + Redux (Frontend)

---

## Sprint 3: Authentication + Roles

**Goal**: Secure the application with user authentication and role-based access.

**Key Deliverables**:
- User signup and login
- JWT-based authentication
- Admin role protection
- Cart persistence across sessions

**Estimated Effort**: 2 weeks

**Technical Stack**:
- bcrypt (Password hashing)
- jsonwebtoken (JWT)
- Redux Toolkit (Auth state)

---

## Sprint 4: Checkout + Payments

**Goal**: Enable customers to complete purchases using Stripe.

**Key Deliverables**:
- Checkout form (shipping, contact)
- Stripe payment integration
- Payment confirmation
- Order creation via webhook

**Estimated Effort**: 2-3 weeks

**Technical Stack**:
- Stripe Elements
- Stripe Payment Intents API
- Stripe Webhooks

---

## Sprint 5: Order Lifecycle & Admin

**Goal**: Allow admins to manage orders and customers to view order history.

**Key Deliverables**:
- Admin order management dashboard
- Order status updates
- Customer order history
- Email notifications

**Estimated Effort**: 2 weeks

**Technical Stack**:
- SendGrid (Email)
- Admin middleware
- Order status workflow

---

## Sprint 6: Tests, CI, Deployment

**Goal**: Ensure quality and deploy to production.

**Key Deliverables**:
- Unit and integration tests
- GitHub Actions CI/CD
- Production deployment
- Monitoring setup

**Estimated Effort**: 2-3 weeks

**Technical Stack**:
- Jest (Testing)
- React Testing Library
- Supertest (API testing)
- Vercel/Netlify (Frontend)
- Render/Fly.io (Backend)

---

## Stretch Goals: Post-Launch

**Goal**: Enhance the platform with advanced features.

**Key Deliverables**:
- OAuth social login
- Mobile app wrapper
- Automated backups
- Error monitoring

**Estimated Effort**: 4-6 weeks (split across features)

**Technical Stack**:
- Passport.js (OAuth)
- Expo/Capacitor (Mobile)
- Sentry (Monitoring)

---

## Dependencies Between Sprints

```
Sprint 0: Project Setup
    ↓
Sprint 1: Core Scaffolding
    ↓
Sprint 2: Menu + Cart MVP
    ↓
Sprint 3: Authentication + Roles
    ↓
Sprint 4: Checkout + Payments
    ↓
Sprint 5: Order Lifecycle & Admin
    ↓
Sprint 6: Tests, CI, Deployment
    ↓
Stretch Goals: Post-Launch Features
```

**Important**: Each sprint builds on the previous one. Complete sprints in order to avoid rework.

---

## Critical Path

The minimum viable product (MVP) requires:
1. ✅ Sprint 0: Project Setup
2. ✅ Sprint 1: Core Scaffolding
3. 🔄 Sprint 2: Menu + Cart MVP
4. 🔄 Sprint 3: Authentication + Roles
5. 🔄 Sprint 4: Checkout + Payments
6. 🔄 Sprint 5: Order Lifecycle & Admin

**Optional for MVP Launch**:
- Sprint 6 (can be done post-launch if needed)
- Stretch Goals (enhancements after MVP is stable)

---

## Sprint Breakdown by Role

### Backend Developer Tasks
- Sprint 2: Database schema, Menu API
- Sprint 3: Auth endpoints, JWT middleware
- Sprint 4: Payment Intent API, Webhooks
- Sprint 5: Order management API, Email service
- Sprint 6: API tests, Backend deployment

### Frontend Developer Tasks
- Sprint 2: Menu page, Cart component
- Sprint 3: Login/Signup pages, Auth state
- Sprint 4: Checkout form, Stripe Elements
- Sprint 5: Order history, Admin dashboard
- Sprint 6: Component tests, Frontend deployment

### DevOps Tasks
- Sprint 1: Docker setup
- Sprint 6: CI/CD pipeline, Production deployment
- Stretch: Monitoring, Backups

### Full-Stack Tasks
- All sprints require coordination between frontend and backend
- API contract design
- State management
- Error handling

---

## Success Metrics

### Sprint 2
- ✅ Menu items displayed from database
- ✅ Cart persists on page refresh
- ✅ API responds in < 200ms

### Sprint 3
- ✅ User can create account
- ✅ Login returns JWT token
- ✅ Protected routes reject invalid tokens

### Sprint 4
- ✅ Test payment succeeds
- ✅ Order created in database
- ✅ Webhook processes payment

### Sprint 5
- ✅ Admin can update order status
- ✅ User sees order history
- ✅ Email sent on order creation

### Sprint 6
- ✅ 70%+ test coverage
- ✅ CI passes on all PRs
- ✅ Site accessible in production

---

## Risk Assessment

### High Risk Areas
1. **Payment Integration** (Sprint 4)
   - Complex Stripe setup
   - Webhook reliability
   - Security concerns

2. **Authentication** (Sprint 3)
   - Security vulnerabilities
   - Token management
   - Session handling

### Mitigation Strategies
- Use well-tested libraries (Stripe SDK, bcrypt)
- Follow security best practices
- Test thoroughly in development
- Use Stripe test mode initially
- Implement proper error handling

---

## Resources

### Documentation
- [Prisma Docs](https://www.prisma.io/docs/)
- [Stripe API Docs](https://stripe.com/docs/api)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [React Router Docs](https://reactrouter.com/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)

### Learning Resources
- See [LEARNING_GUIDE.md](./LEARNING_GUIDE.md) for comprehensive learning resources
- See [ORDER_SYSTEM_GUIDE.md](./ORDER_SYSTEM_GUIDE.md) for order system implementation

### Support
- GitHub Issues for bug reports
- GitHub Discussions for questions
- Project board for tracking progress

---

## Getting Started

**Ready to begin?**

1. ✅ Read this document
2. ✅ Review [TASK_BREAKDOWN.md](./TASK_BREAKDOWN.md)
3. ✅ Read [ISSUES_SETUP_GUIDE.md](./ISSUES_SETUP_GUIDE.md)
4. 🔄 Create Sprint 2 issue from template
5. 🔄 Add to project board
6. 🔄 Start first subtask
7. 🔄 Track progress and iterate

**Let's build something amazing! 🌺**
