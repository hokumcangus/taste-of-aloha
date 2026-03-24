# Frontend/Backend Flow Guide

Last updated: March 14, 2026

This guide explains the app in simple terms.

If you are 17 and learning this for the first time, think of it like this:

- The page is the customer.
- The slice is the cashier.
- The service is the waiter.
- The backend is the kitchen.
- The model is the cook getting ingredients from the fridge.
- The database is the fridge/storage.

---

## 1) Who calls who?

When the app needs data, this is the order:

1. The **page/component** asks for data.
2. The page uses `dispatch(...)`.
3. The **slice thunk** runs.
4. The thunk calls the **service**.
5. The service uses the **API client** to send the request.
6. The **backend route** receives it.
7. The **controller** decides what to do.
8. The **model** talks to the database.
9. The database sends data back.
10. The response goes back up to the slice.
11. The slice updates state.
12. The page shows the new data.

Short version:

`Page -> Slice -> Service -> API Client -> Route -> Controller -> Model -> Database`

---

## 2) What each part does

### Page / Component

- This is what the user sees.
- It shows loading, errors, and data.
- It should not directly talk to the database.

Example:

- `apps/web/src/pages/Menu.jsx`

### Slice

- This is where app state lives.
- It stores things like:
	- data
	- loading
	- error
- It also has thunks that call services.

Examples:

- `apps/web/src/store/slices/menuSlice.js`
- `apps/web/src/store/slices/snackSlice.js`

### Store

- This is the big box that holds all slices.
- If a slice is not added here, your app will not know about it.

Example:

- `apps/web/src/store/store.js`

### Service

- This is the messenger.
- It sends requests to the backend.
- It should only worry about API calls.

Examples:

- `apps/web/src/services/menuService.js`
- `apps/web/src/services/snackService.js`

### API Client

- This is the shared fetch helper.
- It handles GET, POST, PUT, DELETE.

Example:

- `apps/web/src/services/api.js`

### Route

- This matches the URL.
- Example: `/api/menu`

Example:

- `apps/backend/src/routes/menuRoutes.js`

### Controller

- This is the decision-maker.
- It checks request data.
- It chooses which model function to call.
- It sends the response back.

Example:

- `apps/backend/src/controllers/menuController.js`

### Model

- This is the database helper.
- It runs Prisma queries.
- It creates, reads, updates, or deletes data.

Example:

- `apps/backend/src/models/menuModel.js`

---

## 3) Best order to build a new feature

If you are building something like cart, checkout, favorites, or orders, do it in this order.

### Step 1: Start with the model

- Decide what data you need.
- Write functions to get or save that data.
- Example jobs:
	- get all items
	- get one item
	- create item
	- update item
	- delete item

Why first?

- Because the rest of the app needs something real to talk to.

### Step 2: Build the controller

- Add backend logic.
- Handle success and errors.
- Return proper responses like `200`, `404`, or `500`.

Why second?

- Because routes need a function to run.

### Step 3: Add the route

- Connect URLs to controller functions.
- Example:
	- `GET /api/menu`
	- `POST /api/menu`

Why third?

- Now the frontend has a real endpoint to call.

### Step 4: Build the frontend service

- Write functions that call your backend endpoint.
- Keep it simple.
- Example: `getAllMenuItems()` or `createCartItem()`

Why here?

- Because the slice should not contain raw fetch code everywhere.

### Step 5: Build the slice

- Add state like:
	- `items`
	- `loading`
	- `error`
- Add async thunks that call the service.
- Update state in `pending`, `fulfilled`, and `rejected`.

Why here?

- Now Redux can control the data flow cleanly.

### Step 6: Add the slice to the store

- Register the reducer in `store.js`.

Why here?

- If you forget this, `useSelector` and `dispatch` logic will break.

### Step 7: Connect the page

- Dispatch the thunk.
- Read data from the store.
- Show loading, error, and final content.

Why last?

- Because now the UI has a working backend and state flow behind it.

### Step 8: Test everything

- Check the backend endpoint.
- Check the page in the browser.
- Make sure data actually appears.
- Make sure errors are handled.

---

## 4) Easy way to remember it

Build from the bottom up:

1. Database/model first
2. Backend next
3. Frontend state after that
4. Screen last

Reason:

- The screen is the last thing because it depends on everything else.

---

## 5) Common mistake to avoid

Do not mix one slice with another by accident.

Example of a problem:

- A page dispatches from `menuSlice`
- But the store is actually using `snackSlice`

That causes confusing bugs because the page is asking one part of Redux for data while the store is holding it somewhere else.

Keep it consistent:

- page uses the right slice
- slice uses the right service
- service calls the right route

---

## 6) Real project file examples

- Page: `apps/web/src/pages/Menu.jsx`
- Slice: `apps/web/src/store/slices/menuSlice.js`
- Store: `apps/web/src/store/store.js`
- Service: `apps/web/src/services/menuService.js`
- API client: `apps/web/src/services/api.js`
- Backend route: `apps/backend/src/routes/menuRoutes.js`
- Controller: `apps/backend/src/controllers/menuController.js`
- Model: `apps/backend/src/models/menuModel.js`

---

## 7) One-sentence summary

The page asks, the slice manages, the service sends, the backend handles, the model queries, and the database answers.

## Connectivity Verification Commands

Use the canonical connectivity checks in [QUICK_REFERENCE.md](../../QUICK_REFERENCE.md#connectivity-verification-powershell).

