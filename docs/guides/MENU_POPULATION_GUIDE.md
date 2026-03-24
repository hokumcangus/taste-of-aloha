# Menu Population Guide

This guide covers three options for populating the menu in the Taste of Aloha project. Ensure that your `DATABASE_URL` is set up and the backend is running before proceeding.

## Prerequisites
- Set the `DATABASE_URL` in your environment variables.
- Ensure the backend is running.

## 1. Prisma Studio Manual Entry
Prisma Studio provides a visual editor for managing data in your database.
### Steps:
1. Launch Prisma Studio:
   ```bash
   npx prisma studio
   ```
2. Manually enter menu items into the Studio interface.

### Example Payload:
(Manual entry; follow the UI to populate fields)

### Verification:
To verify that the items have been added:
```powershell
curl.exe http://localhost:3000/api/menu
```

### When to Use:
- Best for small additions or edits to the menu.

## 2. Shell Loop Bulk POST Using NDJSON
For bulk importing data, you can use NDJSON format to send multiple entries.
### Steps:
1. Prepare an NDJSON file (`menu.ndjson`):
   ```
   echo '{ "name": "Item 1", "category": "Category 1" }' >> menu.ndjson
   echo '{ "name": "Item 2", "category": "Category 2" }' >> menu.ndjson
   ```
2. Use a shell loop to POST each entry:
   ```bash
   while IFS= read -r line; do
       curl -X POST -H "Content-Type: application/json" -d "$line" /api/menu;
   done < menu.ndjson
   ```

### Verification:
Check the menu items:
```powershell
curl.exe "http://localhost:3000/api/menu?category=Category%201"
```

### When to Use:
- Ideal for bulk imports when data is prepared in NDJSON format.

## 3. Bulk Import Script Using Prisma createMany with JSON
Using a script allows for more complex data handling and validation.
### Steps:
1. Create a JSON file (`menu.json`):
   ```json
   [
       { "name": "Item 1", "category": "Category 1" },
       { "name": "Item 2", "category": "Category 2" }
   ]
   ```
2. Use `createMany` method in your script:
   ```javascript
   const menuData = require('./menu.json');
   await prisma.menu.createMany({ data: menuData });
   ```

### Verification:
To ensure that the items were added correctly:
```powershell
curl.exe http://localhost:3000/api/menu
```

### When to Use:
- Use this method for larger datasets or when data needs validation before import.

## Additional References
- Check out [QUICK_REFERENCE.md](../../QUICK_REFERENCE.md) for quick commands.
- Review [apps/backend/scripts/addMenuItem.js](../../apps/backend/scripts/addMenuItem.js) for the current CLI helper.

Have fun populating the menu!

## Connectivity Verification Commands (PowerShell)

```powershell
# From repo root
npm run dev

# In a separate terminal
(Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing).StatusCode

$menuResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing
$menuItems = $menuResponse.Content | ConvertFrom-Json
"menu-status=$($menuResponse.StatusCode) menu-count=$($menuItems.Count)"

$cartResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/cart" -UseBasicParsing
$cartItems = $cartResponse.Content | ConvertFrom-Json
"cart-status=$($cartResponse.StatusCode) cart-count=$($cartItems.Count)"

(Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing).StatusCode
```
