# Alias Quick Reference

Your personal PowerShell shortcuts for faster development.

---

## 📁 Navigation

| Alias | Command | Description |
|-------|---------|-------------|
| `here` | `Get-Location` | Show current directory |
| `ll` | `Get-ChildItem` | List files with details |
| `open .` | `explorer .` | Open current folder in File Explorer |
| `toa` | `cd C:\Users\mcang\projects\taste-of-aloha` | Go to project root |

---

## 📄 File Operations

| Alias | Command | Example |
|-------|---------|---------|
| `touch` | `New-Item -ItemType File` | `touch test.txt` |
| `mkd` | `New-Item -ItemType Directory` | `mkd myfolder` |
| `rmf` | `Remove-Item -Recurse -Force` | `rmf oldfolder` |

---

## 🔍 Search & Find

| Alias | Command | Example |
|-------|---------|---------|
| `grep` | `Select-String -Path "*.js"` | `grep "function"` |
| `findempty` | Find all empty folders | `findempty` |

---

## 📦 Git

| Alias | Command | Description |
|-------|---------|-------------|
| `gs` | `git status` | Show git status |
| `ga` | `git add .` | Stage all changes |
| `gc` | `git commit -m` | Commit with message |
| `gp` | `git push` | Push to remote |
| `gl` | `git log --oneline -10` | Show last 10 commits |

**Examples:**
```powershell
gs                    # Check status
ga                    # Stage everything
gc "fix: bug fix"     # Commit
gp                    # Push
```

---

## 📦 npm

| Alias | Command | Description |
|-------|---------|-------------|
| `ni` | `npm install` | Install dependencies |
| `nrd` | `npm run dev` | Start dev server |

**Examples:**
```powershell
ni                    # Install packages
nrd                   # Start development
```

---

## 🐳 Docker

| Alias | Command | Description |
|-------|---------|-------------|
| `dcup` | `docker-compose up -d` | Start containers (background) |
| `dcdown` | `docker-compose down` | Stop containers |

**Examples:**
```powershell
dcup                  # Start all services
dcdown                # Stop all services
```

---

## 🚀 Project-Specific

| Alias | Command | Description |
|-------|---------|-------------|
| `toa` | `cd C:\Users\mcang\projects\taste-of-aloha` | Go to project root |
| `backend` | Start backend dev server | Runs in apps/backend |
| `frontend` | Start frontend dev server | Runs in apps/web |

**Examples:**
```powershell
toa                   # Jump to project from anywhere
backend               # Start backend (port 3000)
frontend              # Start frontend (port 5173)
```

---

## 🔥 Common Workflows

### Start Development
```powershell
# Option 1: Local development
toa                   # Go to project
backend               # Terminal 1: Start backend
frontend              # Terminal 2: Start frontend
```

### Git Workflow
```powershell
gs                    # Check what changed
ga                    # Stage all
gc "feat: new feature" # Commit
gp                    # Push to remote
```

### Docker Workflow
```powershell
toa                   # Go to project
dcup                  # Start all services
# Work on your code
dcdown                # Stop when done
```

### Quick File Operations
```powershell
toa                   # Go to project
mkd new-folder        # Create folder
touch new-file.js     # Create file
ll                    # List files
```

---

## 💡 Pro Tips

### Chain Commands
```powershell
toa; gs               # Go to project AND check git status
ga; gc "update"; gp   # Stage, commit, and push in one line
```

### Find Things Fast
```powershell
grep "useState"       # Find all files using useState
findempty             # Find empty folders to clean up
```

### Open Quickly
```powershell
open .                # Open current folder in Explorer
code .                # Open current folder in VS Code
```

---

## 📝 Editing Your Aliases

### Open Profile
```powershell
code $PROFILE
```

### Reload After Changes
```powershell
. $PROFILE
```

### Test New Alias
After adding to profile, reload and test immediately!

---

## 🎯 Most Used Daily

```powershell
toa          # Start here every session
gs           # Check status constantly
ga           # Stage before commit
gc "..."     # Commit frequently
gp           # Push when ready
backend      # Start backend server
frontend     # Start frontend server
```

---

**Print this and keep it visible!** 🖨️

You'll memorize these in a week of daily use.
