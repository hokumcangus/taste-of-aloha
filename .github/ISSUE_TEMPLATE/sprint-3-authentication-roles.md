---
name: Sprint 3 - Authentication + Roles
about: Implement user authentication and role-based access control
title: 'Sprint 3: Authentication + Roles'
labels: 'sprint-3, authentication, enhancement'
assignees: ''
---

## Sprint 3: Authentication + Roles

This sprint focuses on implementing user authentication, authorization, and role-based access control.

### Tasks

#### 1. Backend Authentication System
- [ ] Install dependencies (`npm install bcrypt jsonwebtoken`)
- [ ] Create User model in Prisma schema (email, password, role, name)
- [ ] Run migration for User table
- [ ] Implement POST `/api/auth/signup` endpoint
- [ ] Implement POST `/api/auth/login` endpoint
- [ ] Create JWT generation utility
- [ ] Create authentication middleware (`verifyToken`)
- [ ] Add role field to user model (customer/admin)
- [ ] Hash passwords with bcrypt
- [ ] Test signup and login flows with Postman/curl
- [ ] **Acceptance Criteria**: Token returned on login and protected route accessible with token

#### 2. Frontend Authentication Pages
- [ ] Create Login page component (`src/pages/Login.jsx`)
- [ ] Create Signup page component (`src/pages/Signup.jsx`)
- [ ] Implement form validation
- [ ] Set up authentication state management (Redux Toolkit or Context API)
- [ ] Store JWT token securely (httpOnly cookie or secure localStorage)
- [ ] Implement cart merge logic on login
- [ ] Create protected route wrapper component
- [ ] Add logout functionality
- [ ] Add navigation updates based on auth state
- [ ] **Acceptance Criteria**: After login, server-side cart merges and user sees saved cart

#### 3. Admin Role Protection
- [ ] Create admin authorization middleware (`requireAdmin`)
- [ ] Protect admin-only endpoints with middleware
- [ ] Add role-based UI rendering (show/hide admin features)
- [ ] Create admin dashboard route (protected)
- [ ] Test admin access controls
- [ ] Test non-admin user restrictions
- [ ] **Acceptance Criteria**: Admin endpoints return 403 for non-admin users

### Dependencies
- Sprint 2 (Menu + Cart MVP) should be completed
- Database with User table

### Related Issues
- Closes part of #1 (Taste of Aloha Project-Ready Checklist)

### Security Considerations
- [ ] Passwords must be hashed with bcrypt (min 10 rounds)
- [ ] JWT tokens should have expiration time
- [ ] Secure token storage in frontend
- [ ] Validate all user inputs
- [ ] Prevent SQL injection with Prisma parameterized queries

### Testing Checklist
- [ ] Can create new user account
- [ ] Can login with correct credentials
- [ ] Cannot login with incorrect credentials
- [ ] JWT token is returned on successful login
- [ ] Protected routes reject unauthenticated requests
- [ ] Admin routes reject non-admin users
- [ ] Cart merges correctly on login
- [ ] Logout clears authentication state

### Documentation
- Document authentication flow
- Document JWT token structure
- Add API documentation for auth endpoints
