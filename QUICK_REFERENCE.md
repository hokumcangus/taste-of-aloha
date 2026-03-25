# ⚡ Quick Reference

## 🛠 Development
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts DB, Backend, and Frontend in parallel |
| `npm run dev:backend` | API only |
| `npm run dev:web` | Frontend only |

## 🗄 Database (Prisma)
- `npx prisma studio`: Open database UI.
- `npm run db:seed`: Reset and re-seed the menu items.

## 🧪 Verification (PowerShell)
```powershell
# Check Backend Health
(Invoke-WebRequest -Uri "http://localhost:3000/health").StatusCode