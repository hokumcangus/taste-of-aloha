# Sprint 2: Shopping Cart MVP - Tracking Document

**Sprint Duration:** January 3-17, 2026 (2 weeks)  
**Status:** 🔄 In Progress  
**Target Completion:** 85%+ (Cart API + Basic Frontend Integration)

---

## Overview

Sprint 2 focuses on implementing the shopping cart system, a critical feature for converting browsers into buyers. This sprint builds on the completed Menu system from Sprints 0-1.

### Goals
- ✅ Database Cart and CartItem models created
- 🔄 Cart API endpoints implemented (CRUD operations)
- 🔄 Cart Redux state management
- 🔄 Cart display component
- 🔄 Add-to-cart functionality
- 🔄 Shopping cart page with item management
- 🔄 Tests for cart operations

---

## Task Breakdown

### Phase 1: Backend Cart API (Days 1-3)

#### 1.1 Database Migration ✅ COMPLETE
- **Status**: ✅ Done
- **Files Modified**: 
  - `apps/backend/prisma/schema.prisma` - Added Cart and CartItem models
  - Prisma migration: `add_cart_models`
- **Details**:
  - Cart model: id, userId, items[], total, itemCount, timestamps
  - CartItem model: id, cartId, menuId, quantity, price, subtotal, timestamps
  - Cascade delete for orphaned items

#### 1.2 Cart Controller Implementation 🔄 IN PROGRESS
- **Status**: 🔄 Starting
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

#### 1.3 Cart Routes ⬜ NOT STARTED
- **Status**: ⬜ Blocked on controller
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

#### 1.4 Cart Model / Data Access ⬜ NOT STARTED
- **Status**: ⬜ Blocked on controller
- **File**: `apps/backend/src/models/cartModel.js`
- **Methods**:
  - `getAllCarts()`
  - `getCartById(id)`
  - `getCartByUserId(userId)`
  - `createCart(data)`
  - `addItem(cartId, menuId, quantity)`
  - `updateItem(cartId, itemId, quantity)`
  - `removeItem(cartId, itemId)`
  - `calculateTotal(cartId)`
  - `clearCart(cartId)`
  - `deleteCart(cartId)`

#### 1.5 Cart Tests ⬜ NOT STARTED
- **Status**: ⬜ Blocked on controller
- **File**: `apps/backend/tests/cartApi.test.js`
- **Coverage**:
  - POST add item
  - GET cart
  - PUT update quantity
  - DELETE remove item
  - Error handling
  - Edge cases (empty cart, invalid items, etc.)

---

### Phase 2: Frontend Cart State (Days 4-5)

#### 2.1 Redux Cart Slice ⬜ NOT STARTED
- **Status**: ⬜ Blocked on API
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
- **Async Thunks**:
  - `fetchCart()` - Get cart from API
  - `addItem()` - Add to cart
  - `updateItem()` - Change quantity
  - `removeItem()` - Remove from cart
  - `clearCart()` - Empty cart

#### 2.2 Cart Service ⬜ NOT STARTED
- **Status**: ⬜ Blocked on API
- **File**: `apps/web/src/services/cartService.js`
- **Methods**:
  - `getCart(cartId)`
  - `createCart()`
  - `addItem(cartId, menuId, quantity)`
  - `updateItem(cartId, itemId, quantity)`
  - `removeItem(cartId, itemId)`
  - `clearCart(cartId)`

#### 2.3 Redux Integration Tests ⬜ NOT STARTED
- **Status**: ⬜ Blocked on slice
- **File**: `apps/web/src/test/cartSlice.test.js`
- **Coverage**:
  - Reducer state updates
  - Async thunk pending/fulfilled/rejected
  - Item addition/removal
  - Total calculation

---

### Phase 3: Frontend Cart UI (Days 5-8)

#### 3.1 Cart Display Component ⬜ NOT STARTED
- **Status**: ⬜ Blocked on Redux
- **File**: `apps/web/src/components/Cart/CartDisplay.jsx`
- **Features**:
  - List all items in cart
  - Show item price, quantity, subtotal
  - Remove button per item
  - Quantity input (+ / - buttons)
  - Cart total
  - Empty cart message

#### 3.2 Add-to-Cart Button ⬜ NOT STARTED
- **Status**: ⬜ Blocked on Redux
- **File**: `apps/web/src/components/Menu/MenuItem.jsx` (modify)
- **Features**:
  - Quantity selector (1-99)
  - Add to cart button
  - Success toast notification
  - Error handling

#### 3.3 Shopping Cart Page ⬜ NOT STARTED
- **Status**: ⬜ Blocked on Cart component
- **File**: `apps/web/src/pages/Cart.jsx` (create)
- **Features**:
  - Display all cart items
  - Edit quantities
  - Remove items
  - Cart summary (items, subtotal, tax estimate)
  - Proceed to checkout button
  - Continue shopping button

#### 3.4 Cart Persistence (localStorage) ⬜ NOT STARTED
- **Status**: ⬜ Blocked on Redux
- **File**: `apps/web/src/middleware/cartMiddleware.js` (create)
- **Features**:
  - Save cart to localStorage on changes
  - Load cart from localStorage on app startup
  - Sync with API when user logs in

#### 3.5 UI Component Tests ⬜ NOT STARTED
- **Status**: ⬜ Blocked on components
- **Files**:
  - `apps/web/src/test/CartDisplay.test.jsx`
  - `apps/web/src/test/Cart.test.jsx`
  - `apps/web/src/test/MenuItem.test.jsx`
- **Coverage**:
  - Component rendering
  - User interactions
  - API calls
  - Error states

---

### Phase 4: Integration & Polish (Days 9-14)

#### 4.1 End-to-End Testing
- Test full flow: Browse Menu → Add items → View Cart → Edit → Clear
- Test error scenarios
- Test concurrent updates

#### 4.2 Performance Optimization
- Lazy load cart component
- Debounce quantity updates
- Memoize expensive calculations

#### 4.3 Accessibility
- ARIA labels on form inputs
- Keyboard navigation in cart
- Screen reader testing

#### 4.4 Documentation
- Update API docs with cart endpoints
- Add cart flow diagram
- Create cart implementation guide

#### 4.5 Code Review & Fixes
- Fix any failing tests
- Address code quality issues
- Performance profiling

---

## Daily Checklist

### Week 1

#### Day 1 (Jan 3) - Cart Backend Foundation
- [ ] Cart/CartItem models created in schema
- [ ] Migration applied successfully
- [ ] Start cartController.js

#### Day 2 (Jan 4) - Cart API Endpoints
- [ ] cartController complete
- [ ] cartRoutes complete
- [ ] cartModel complete

#### Day 3 (Jan 5) - Cart Tests & API Verification
- [ ] cartApi.test.js written
- [ ] All backend tests passing
- [ ] API endpoints tested with Postman/curl

#### Day 4 (Jan 6) - Frontend Redux Setup
- [ ] cartSlice.js created
- [ ] cartService.js created
- [ ] Redux integration tests written

#### Day 5 (Jan 7) - Cart Components Start
- [ ] CartDisplay component created
- [ ] Add-to-cart button implemented
- [ ] MenuItem integration done

### Week 2

#### Day 6 (Jan 8) - Shopping Cart Page
- [ ] Cart.jsx page created
- [ ] Item management UI done
- [ ] Cart summary displayed

#### Day 7 (Jan 9) - Cart Persistence
- [ ] localStorage middleware implemented
- [ ] Cart loads on startup
- [ ] Cart syncs with API

#### Day 8 (Jan 10) - Component Tests
- [ ] CartDisplay.test.jsx passing
- [ ] Cart.test.jsx passing
- [ ] MenuItem.test.jsx updated

#### Day 9 (Jan 11) - Integration Testing
- [ ] Full flow testing done
- [ ] Error scenarios tested
- [ ] Edge cases handled

#### Day 10 (Jan 12) - Polish & Optimization
- [ ] Performance improvements
- [ ] Accessibility checks
- [ ] Code cleanup

#### Day 11 (Jan 13) - Documentation
- [ ] API docs updated
- [ ] Flow diagrams created
- [ ] Implementation guide written

#### Day 12 (Jan 14) - Code Review & Fixes
- [ ] All tests passing
- [ ] Code quality checked
- [ ] Ready for merge

---

## Progress Tracking

### Current Status: 15% Complete

| Phase | Task | Status | % Complete | Notes |
|-------|------|--------|-----------|-------|
| 1 | DB Migration | ✅ Done | 100% | Cart & CartItem models created |
| 1 | Controller | 🔄 In Progress | 10% | File created, starting implementation |
| 1 | Routes | ⬜ Blocked | 0% | Waiting on controller |
| 1 | Model | ⬜ Blocked | 0% | Waiting on controller |
| 1 | Tests | ⬜ Blocked | 0% | Waiting on controller |
| 2 | Redux Slice | ⬜ Blocked | 0% | Waiting on API |
| 2 | Service | ⬜ Blocked | 0% | Waiting on API |
| 2 | Tests | ⬜ Blocked | 0% | Waiting on slice |
| 3 | Components | ⬜ Blocked | 0% | Waiting on Redux |
| 3 | Persistence | ⬜ Blocked | 0% | Waiting on Redux |
| 3 | Tests | ⬜ Blocked | 0% | Waiting on components |
| 4 | Integration | ⬜ Blocked | 0% | Waiting on UI |
| 4 | Optimization | ⬜ Blocked | 0% | Waiting on integration |
| 4 | Docs | ⬜ Blocked | 0% | Waiting on features |

---

## Blockers & Risks

### No Current Blockers
All dependencies are in place:
- ✅ Database configured and working
- ✅ Menu API complete and tested
- ✅ Frontend infrastructure ready
- ✅ Redux Toolkit integrated
- ✅ Testing frameworks set up

### Risks to Monitor
1. **Complexity of cart calculations** - Tax, discounts, shipping
   - Mitigation: Start simple (no tax), add later
   
2. **Cart synchronization** - API vs localStorage
   - Mitigation: Use Redux for source of truth
   
3. **Performance with large carts** - Many items
   - Mitigation: Pagination or virtualization if needed
   
4. **Concurrent updates** - Multiple windows/tabs
   - Mitigation: Add last-write-wins strategy

---

## Success Criteria

**MVP Success (85% target):**
- [ ] ✅ Cart can hold multiple items
- [ ] ✅ Items can be added with quantity
- [ ] ✅ Quantity can be updated
- [ ] ✅ Items can be removed
- [ ] ✅ Cart displays total
- [ ] ✅ Cart persists in localStorage
- [ ] ✅ All critical tests passing
- [ ] ✅ No console errors/warnings

**Nice-to-have (if time permits):**
- Cart shared between tabs
- Cart API authentication
- Cart history/saved carts
- Abandoned cart recovery

---

## Resources & References

### Files to Create
1. `apps/backend/src/controllers/cartController.js` - Cart business logic
2. `apps/backend/src/routes/cartRoutes.js` - API routes
3. `apps/backend/src/models/cartModel.js` - Database queries
4. `apps/backend/tests/cartApi.test.js` - API tests
5. `apps/web/src/store/slices/cartSlice.js` - Redux state
6. `apps/web/src/services/cartService.js` - API client
7. `apps/web/src/components/Cart/CartDisplay.jsx` - Cart list
8. `apps/web/src/pages/Cart.jsx` - Shopping cart page
9. `apps/web/src/middleware/cartMiddleware.js` - Persistence

### Documentation
- [DATABASE_API_GUIDE.md](../guides/DATABASE_API_GUIDE.md) - API patterns
- [IMPLEMENTATION.md](../reference/IMPLEMENTATION.md) - Full stack example
- [LEARNING_GUIDE.md](../guides/LEARNING_GUIDE.md) - Tech stack overview

### Similar Implementations
- Menu implementation (Sprints 0-1) - Use as reference
- API endpoint pattern in `snackRoutes.js`
- Redux pattern in `snackSlice.js`
- Test patterns in `snackApi.test.js`

---

## Notes

**Started:** January 3, 2026  
**Last Updated:** January 3, 2026  
**Branch:** `feat/sprint-2-shopping-cart`  

This is a living document. Update daily with actual progress, blockers, and learnings.

---

**Next Meeting:** Daily standup at 9 AM  
**Weekly Review:** Friday 5 PM  

Made with 🌺 Aloha Spirit
