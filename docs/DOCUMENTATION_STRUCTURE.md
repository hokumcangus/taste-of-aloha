# Documentation Structure

Last updated: March 24, 2026

## Current Documentation Map

```text
taste-of-aloha/
├── README.md
├── QUICK_REFERENCE.md
├── MASTER_DOCUMENTATION.md
├── apps/
│   ├── backend/
│   │   ├── README.md
│   │   └── DATABASE_SETUP_GUIDE.md
│   └── web/
│       └── README.md
└── docs/
    ├── DOCUMENTATION_STRUCTURE.md
    ├── architecture/
    │   ├── services-diagram.dio
    │   └── system-architecture.dio
    └── guides/
        ├── BACKEND_API_GUIDE.md
        ├── FRONTEND_BACKEND_FLOW_GUIDE.md
        ├── LEARNING_GUIDE.md
        ├── TESTING_GUIDE.md
        └── TROUBLESHOOTING.md
```

## What to Read First

- New to project: `README.md`
- Daily commands: `QUICK_REFERENCE.md`
- Backend work: `apps/backend/README.md`
- Database work: `apps/backend/DATABASE_SETUP_GUIDE.md`
- Frontend work: `apps/web/README.md`
- Frontend/backend call flow: `docs/guides/FRONTEND_BACKEND_FLOW_GUIDE.md`
- API details: `docs/guides/BACKEND_API_GUIDE.md`
- Troubleshooting: `docs/guides/TROUBLESHOOTING.md`

## Notes

- Removed or archived docs are intentionally not linked here.
- All commands in these docs are aligned to the current repo setup.
- Docker commands use `docker compose` (plugin syntax).

## Keep In Repo

- `README.md`
- `QUICK_REFERENCE.md`
- `apps/backend/README.md`
- `apps/web/README.md`
- `apps/backend/DATABASE_SETUP_GUIDE.md`
- `docs/guides/BACKEND_API_GUIDE.md`
- `docs/guides/TESTING_GUIDE.md`
- `docs/guides/TROUBLESHOOTING.md`

## Candidate Docs To Move To Team Docs

These are useful, but they are onboarding or process material rather than repo-critical reference.

- `MASTER_DOCUMENTATION.md`
- `docs/guides/LEARNING_GUIDE.md`
- `docs/guides/FRONTEND_BACKEND_FLOW_GUIDE.md`
- `docs/guides/MENU_POPULATION_GUIDE.md`

## Connectivity Verification Commands

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
