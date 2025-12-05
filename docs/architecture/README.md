# 🌺 Taste of Aloha - Architecture Documentation

## Overview

This directory contains comprehensive architecture and design documentation for the Taste of Aloha Food Delivery Service platform. These diagrams and documents provide a clear understanding of the system structure, service interactions, and data flows.

---

## 📁 Contents

### 1. MVP Feature List (`../MVP_FEATURES.md`)
**Purpose**: Defines the complete Minimum Viable Product (MVP) feature set.

**What's Included**:
- **Menu Management** (Admin): Complete CRUD operations for menu items, categories, and pricing
- **Browse Menu** (Customer): Search, filter, and view menu items with detailed information
- **Shopping Cart**: Session-based for guests, persistent for authenticated users
- **Checkout Process**: Separate flows for guest and authenticated users
- **Payment Capture**: Stripe integration for secure payment processing
- **Order History**: Complete order tracking and history for authenticated users
- **Admin Dashboard**: Order management and menu item management interfaces

**Key Features**:
- Guest checkout support
- Authenticated user benefits (saved addresses, payment methods, order history)
- Real-time order updates
- Multi-role authorization (Guest, Customer, Admin)
- Performance and security requirements
- Post-MVP enhancement roadmap

---

### 2. System Architecture Diagram (`system-architecture.dio`)
**Purpose**: High-level overview of the entire system architecture.

**Layers Depicted**:

#### **Client Layer**
- **Web Browser** (Desktop/Mobile)
  - React + Vite frontend
  - Redux Toolkit for state management
  - Responsive UI with PWA support
- **Mobile Browser** (iOS/Android)
  - Mobile-first responsive design
  - Touch-optimized interface
- **Native App** (Optional - Future)
  - React Native wrapper
  - Push notifications
  - Offline support
  - Native device features
- **Admin Dashboard**
  - Web-based admin interface
  - Menu and order management
  - Analytics and reporting

#### **Application Layer**
- **Frontend Server** (Next.js/React)
  - Server-Side Rendering (SSR) and Client-Side Rendering (CSR)
  - Component-based architecture
  - State management with Redux
  - API client layer
- **Backend API Server** (Node.js + Express)
  - RESTful API endpoints
  - Authentication middleware
  - Business logic layer
  - Payment processing integration
  - Email and notification services

#### **Data Layer**
- **PostgreSQL Database**
  - Primary data store
  - User accounts, menu items, orders, payments
  - Relational data with ACID compliance
- **Redis Cache**
  - Session management
  - Menu caching for performance
  - Cart data
  - Rate limiting
- **File Storage** (S3/Cloud)
  - Product images
  - Receipts and invoices
  - User uploads
  - Static assets

#### **External Services & Integrations**
- **Stripe**: Payment processing, refunds, webhooks
- **Firebase/Auth0**: Authentication, JWT tokens, social login
- **SendGrid/Twilio**: Email notifications, SMS alerts
- **Google Maps**: Address validation, geocoding, delivery tracking

#### **Infrastructure & Hosting**
- **Docker**: Containerization for consistent deployment
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Cloud Hosting**: AWS/GCP/Azure with load balancing and auto-scaling
- **CDN**: Global content delivery for static assets
- **Monitoring & Logs**: Error tracking, performance metrics
- **Security Layer**: SSL/TLS, firewall, DDoS protection

**Key Connections**:
- HTTPS communication from clients to frontend
- REST API calls between frontend and backend
- Database queries (SQL) from backend to PostgreSQL
- Cache operations for performance optimization
- External API integrations for payments, auth, and notifications

---

### 3. Services Diagram (`services-diagram.dio`)
**Purpose**: Detailed view of individual services and their interactions.

**Service Categories**:

#### **Customer-Facing Services**
1. **Menu Browse Service**
   - List and display menu items
   - Category filtering
   - Search functionality
   - Item details and availability

2. **Shopping Cart Service**
   - Add/remove items
   - Quantity management
   - Total calculation
   - Session persistence (guests)
   - Database persistence (authenticated users)

3. **Checkout Service**
   - Guest checkout flow
   - Authenticated user checkout
   - Address validation
   - Delivery scheduling
   - Order summary generation

4. **Order History Service**
   - Past order retrieval
   - Order detail views
   - Status tracking
   - Receipt downloads
   - Reorder functionality

5. **User Profile Service**
   - Address management
   - Payment method storage
   - Account preferences
   - Loyalty points
   - Communication settings

6. **Notification Service**
   - Order confirmations
   - Status update notifications
   - Email delivery
   - SMS alerts
   - Push notifications (future)

#### **Core Business Services**
1. **Payment Processing Service**
   - Stripe integration
   - Payment validation
   - Refund processing
   - Webhook handling
   - Transaction logging

2. **Order Management Service**
   - Order creation and validation
   - Status updates
   - Kitchen ticket generation
   - Delivery scheduling
   - Order tracking

3. **Inventory Service**
   - Stock tracking
   - Low stock alerts
   - Availability updates
   - Product catalog management
   - Category organization

4. **Authentication Service**
   - User registration
   - Login/logout
   - JWT token management
   - Password reset
   - Email verification
   - Role-based access control

5. **Analytics Service**
   - Sales metrics
   - Order analytics
   - Customer insights
   - Performance reports
   - Revenue tracking
   - Popular item analysis

#### **Admin Dashboard Services**
1. **Menu Management Service**
   - CRUD operations for menu items
   - Image uploads
   - Pricing management
   - Category management
   - Bulk operations

2. **Order Dashboard Service**
   - Real-time order monitoring
   - Status management
   - Customer detail views
   - Kitchen ticket printing
   - Refund processing

3. **Reports Service**
   - Sales reports
   - Revenue analytics
   - Customer reports
   - Inventory reports
   - Data export
   - Custom report generation

#### **Data Layer Services**
- **PostgreSQL Database**: Persistent storage for all structured data
- **Redis Cache**: High-performance caching for frequently accessed data
- **S3/Cloud Storage**: File storage for images, documents, and backups

**Data Flows**:
- **Menu to Cart**: Users add items from browse to cart
- **Cart to Checkout**: Users proceed to checkout from cart
- **Checkout to Payment**: Payment initiation from checkout
- **Payment to Order Management**: Order creation after payment
- **Order to Notifications**: Automated notifications on order events
- **Order to History**: Orders saved to user history
- **Menu Management to Menu Browse**: Admin updates reflected in customer view
- **Analytics to Reports**: Report generation from analytics data
- **Services to Database**: Data persistence operations
- **Services to Cache**: Performance optimization through caching

---

## 🎨 How to View the Diagrams

### Using VS Code with Draw.io Extension

1. **Install Draw.io Extension**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
   - Search for "Draw.io Integration"
   - Install the extension by Henning Dieterichs

2. **Open Diagram Files**:
   - Navigate to `docs/architecture/`
   - Click on `system-architecture.dio` or `services-diagram.dio`
   - The Draw.io editor will open automatically in VS Code

3. **View and Edit**:
   - Use the Draw.io interface within VS Code
   - Zoom in/out for better viewing
   - Edit shapes, connections, and text as needed
   - Save changes with Ctrl+S (Cmd+S on Mac)

### Using Draw.io Desktop or Web

1. **Draw.io Desktop**:
   - Download from https://github.com/jgraph/drawio-desktop/releases
   - Install and open the application
   - File → Open → Select the `.dio` file

2. **Draw.io Web** (diagrams.net):
   - Go to https://app.diagrams.net/
   - File → Open From → Device
   - Select the `.dio` file from your local repository

---

## 🔄 Updating the Diagrams

### Best Practices

1. **Keep Diagrams in Sync**: When architecture changes, update both diagrams
2. **Version Control**: Commit diagram changes with descriptive messages
3. **Documentation**: Update this README when adding new diagrams or making significant changes
4. **Export for Sharing**: Export diagrams as PNG/SVG for presentations or documentation

### Exporting Diagrams

**In VS Code with Draw.io Extension**:
1. Open the `.dio` file
2. Right-click in the editor
3. Select "Export to..." → Choose format (PNG, SVG, PDF)
4. Save to `docs/architecture/exports/` (create folder if needed)

**In Draw.io Desktop/Web**:
1. File → Export As → Choose format
2. Configure export settings
3. Save to desired location

---

## 📊 Architecture Principles

### Design Principles

1. **Separation of Concerns**
   - Clear boundaries between layers
   - Services have single responsibilities
   - Loose coupling between components

2. **Scalability**
   - Horizontal scaling capability
   - Caching for performance
   - Load balancing support
   - Microservice-ready architecture

3. **Security**
   - Authentication and authorization at every layer
   - Encrypted data transmission (HTTPS/TLS)
   - Secure payment processing (PCI compliance via Stripe)
   - Input validation and sanitization

4. **Reliability**
   - Error handling and logging
   - Graceful degradation
   - Data backup and recovery
   - Monitoring and alerting

5. **Maintainability**
   - Clear code organization
   - Comprehensive documentation
   - Consistent coding standards
   - Automated testing

### Technology Choices

**Frontend**:
- React for component-based UI
- Next.js for SSR and routing
- Redux Toolkit for state management
- Tailwind CSS for styling

**Backend**:
- Node.js for JavaScript runtime
- Express for API framework
- PostgreSQL for relational data
- Redis for caching

**DevOps**:
- Docker for containerization
- GitHub Actions for CI/CD
- Cloud hosting (AWS/GCP/Azure)
- CDN for static assets

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Database schema design
- Authentication system setup
- Basic API structure
- Frontend project setup

### Phase 2: Core Features (Weeks 3-4)
- Menu browsing implementation
- Shopping cart functionality
- Admin menu management
- User profile management

### Phase 3: Transactions (Weeks 5-6)
- Checkout flow implementation
- Payment integration (Stripe)
- Order management system
- Order history

### Phase 4: Admin & Analytics (Week 7)
- Admin dashboard
- Order management interface
- Basic analytics and reports
- Notification system

### Phase 5: Polish & Deploy (Week 8)
- Testing and bug fixes
- Performance optimization
- Security audit
- Production deployment

---

## 📚 Related Documentation

- **[MVP Features List](../MVP_FEATURES.md)**: Complete feature specifications
- **[README.md](../../README.md)**: Project overview and getting started guide
- **[IMPLEMENTATION.md](../../IMPLEMENTATION.md)**: Technical implementation details
- **[TROUBLESHOOTING.md](../../TROUBLESHOOTING.md)**: Common issues and solutions

---

## 🤝 Contributing to Architecture

### Proposing Changes

1. **Discuss First**: Open an issue to discuss architectural changes
2. **Update Diagrams**: Make changes to the `.dio` files
3. **Update Documentation**: Reflect changes in this README and MVP_FEATURES.md
4. **Create PR**: Submit a pull request with clear description
5. **Review Process**: Architecture changes require thorough review

### Diagram Standards

- Use consistent colors for similar components
- Label all connections with clear descriptions
- Group related services together
- Include legends for clarity
- Keep text readable at 100% zoom
- Use standard shapes and icons

---

## 🎓 Learning Resources

### Architecture Patterns
- [Microservices Architecture](https://microservices.io/)
- [RESTful API Design](https://restfulapi.net/)
- [System Design Primer](https://github.com/donnemartin/system-design-primer)

### Technology Documentation
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

### Security Best Practices
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Stripe Security](https://stripe.com/docs/security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 📞 Questions?

If you have questions about the architecture:
1. Check existing documentation
2. Search closed issues on GitHub
3. Open a new issue with the `question` label
4. Tag with `architecture` for architecture-specific questions

---

*Last Updated: December 2025*  
*Version: 1.0*  
*Maintained by: Taste of Aloha Development Team*
