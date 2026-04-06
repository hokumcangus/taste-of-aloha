# 🌺 Taste of Aloha Pull Request Template

## 📋 Summary
<!-- Provide a short description of the changes in this PR -->

## 📸 Screenshots / Demo (if applicable)

<!--this section to document important steps, outputs, or UI states with images.  
Place all screenshots in `docs/screenshots/` and reference them here. -->

### Example: Setup
![Project Setup](docs/screenshots/setup.png)  
*Figure 1: Local server running successfully*

### Example: API Test
![API Test](docs/screenshots/api-test.png)  
*Figure 2: Example API request and response*

### Example: UI Preview
![UI Preview](docs/screenshots/ui-preview.png)  
*Figure 3: Frontend menu item listing page*

## 🔄 Type of Change
- [ ] ✨ Feature (new functionality)
- [ ] 🐛 Fix (bug fix)
- [ ] 📝 Documentation (README, Wiki, etc.)
- [ ] 🧹 Chore (dependency updates, tooling, cleanup)
- [ ] ♻️ Refactor (code restructuring without behavior change)

## ✅ Checklist
- [ ] Code runs locally without errors
- [ ] Tests (if applicable) pass successfully
- [ ] Linting passes (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Documentation updated (README, Wiki, or inline comments)
- [ ] Changes scoped to correct app (`apps/web`, `apps/backend`, `shared/libs`)

## 📂 Scope of Changes
- [ ] Frontend (`apps/web`)
- [ ] Backend (`apps/backend`)
- [ ] Shared (`shared/libs` or `shared/configs`)
- [ ] Infra (`infra/`)

## 🧾 Notes for Reviewers
<!-- Add any context reviewers should know (e.g., breaking changes, migration steps) -->

## 🔌 Connectivity Verification Commands (PowerShell)

```powershell
# From repo root
npm run dev

# In a separate terminal
(Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing).StatusCode

$menuResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing
$menuItems = $menuResponse.Content | ConvertFrom-Json
"menu-status=$($menuResponse.StatusCode) menu-count=$($menuItems.Count)"

try {
  $cartResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/cart" -UseBasicParsing -ErrorAction Stop
  $cartItems = $cartResponse.Content | ConvertFrom-Json
  "cart-status=$($cartResponse.StatusCode) cart-count=$($cartItems.Count)"
} catch {
  "cart-endpoint=not-implemented (skip this check unless /api/cart exists in your branch)"
}

(Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing).StatusCode
```
