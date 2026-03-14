# Backend API Guide

Last updated: March 14, 2026

## API Base

Backend default URL: `http://localhost:3000`  
Primary resource path: `/api/menu`

## Current Routes

- `GET /health` — service health
- `GET /api/menu` — list menu items
- `GET /api/menu/:id` — get one menu item
- `POST /api/menu` — create menu item
- `PUT /api/menu/:id` — update menu item
- `DELETE /api/menu/:id` — delete menu item

## Source Files

- Server entry: `apps/backend/index.js`
- Route definitions: `apps/backend/src/routes/menuRoutes.js`
- Controller logic: `apps/backend/src/controllers/menuController.js`
- Data access: `apps/backend/src/models/menuModel.js`
- Schema: `apps/backend/prisma/schema.prisma`

## Sample Requests

```bash
# List menu
curl http://localhost:3000/api/menu

# Get by ID
curl http://localhost:3000/api/menu/1

# Create
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{"name":"Spam Musubi","description":"Hawaiian classic","price":4.99,"category":"Snacks"}'

# Update
curl -X PUT http://localhost:3000/api/menu/1 \
  -H "Content-Type: application/json" \
  -d '{"price":5.49}'

# Delete
curl -X DELETE http://localhost:3000/api/menu/1
```

## Local Run

```bash
cd apps/backend
npm run dev
```

## Tests

```bash
cd apps/backend
npm run test:snack
```

## Notes

- Category values normalize `Snack`/`Snacks` handling in controller/model.
- DB table backing menu is Prisma model `Menu`.
