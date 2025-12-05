# Windows PowerShell Command Reference

Essential commands for daily development on Windows. All commands are copy-paste ready!

---

## 📁 Navigation & Directory Management

### Change Directory
```powershell
cd C:\Users\mcang\projects\taste-of-aloha
```

### Go Up One Level
```powershell
cd ..
```

### Go to Project Root (from anywhere)
```powershell
cd C:\Users\mcang\projects\taste-of-aloha
```

### Show Current Directory
```powershell
pwd
```
**Alias:**
```powershell
Set-Alias -Name here -Value Get-Location
```
Usage: `here`

---

## 📄 Listing Files & Folders

### List Current Directory
```powershell
ls
```

### List with Details
```powershell
Get-ChildItem
```
**Alias:**
```powershell
Set-Alias -Name ll -Value Get-ChildItem
```
Usage: `ll`

### Show Folder Tree Structure
```powershell
tree /F /A
```

### Find All JavaScript Files
```powershell
Get-ChildItem -Recurse -Filter "*.js"
```
**Alias:**
```powershell
function Find-JSFiles { Get-ChildItem -Recurse -Filter "*.js" }
Set-Alias -Name findjs -Value Find-JSFiles
```
Usage: `findjs`

### Find All Empty Folders
```powershell
Get-ChildItem -Recurse -Directory | Where-Object { (Get-ChildItem $_.FullName).Count -eq 0 } | Select-Object FullName
```
**Alias:**
```powershell
function Find-EmptyFolders { Get-ChildItem -Recurse -Directory | Where-Object { (Get-ChildItem $_.FullName).Count -eq 0 } | Select-Object FullName }
Set-Alias -Name findempty -Value Find-EmptyFolders
```
Usage: `findempty`

---

## 🗂️ File Operations

### Create New File
```powershell
New-Item -ItemType File "test.txt"
```
**Alias:**
```powershell
function New-File { param($name) New-Item -ItemType File $name }
Set-Alias -Name touch -Value New-File
```
Usage: `touch test.txt`

### Create New Folder
```powershell
New-Item -ItemType Directory "myfolder"
```
**Alias:**
```powershell
function New-Folder { param($name) New-Item -ItemType Directory -Force $name }
Set-Alias -Name mkd -Value New-Folder
```
Usage: `mkd myfolder`

### Copy File
```powershell
Copy-Item "file.txt" "backup.txt"
```

### Copy Folder with Contents
```powershell
Copy-Item -Recurse "folder" "backup-folder"
```

### Move/Rename File
```powershell
Move-Item "old.txt" "new.txt"
```

### Delete File
```powershell
Remove-Item "file.txt"
```
**Alias:**
```powershell
Set-Alias -Name rm -Value Remove-Item
```
Usage: `rm file.txt`

### Delete Folder with Contents (Force)
```powershell
Remove-Item -Recurse -Force "foldername"
```
**Alias:**
```powershell
function Remove-Folder { param($name) Remove-Item -Recurse -Force $name }
Set-Alias -Name rmf -Value Remove-Folder
```
Usage: `rmf foldername`

### Check if File/Folder Exists
```powershell
Test-Path "C:\path\to\file"
```

---

## 🧹 Terminal Management

### Clear Terminal
```powershell
cls
```
or
```powershell
Clear-Host
```

### Open File Explorer in Current Folder
```powershell
explorer .
```
**Alias:**
```powershell
Set-Alias -Name open -Value explorer
```
Usage: `open .`

### Open VS Code in Current Folder
```powershell
code .
```

### View Command History
```powershell
Get-History
```
**Alias:**
```powershell
Set-Alias -Name h -Value Get-History
```
Usage: `h`

---

## 🔍 Search & Find

### Search File Contents (like grep)
```powershell
Select-String -Path "*.js" -Pattern "function"
```
**Alias:**
```powershell
function Search-Files { param($pattern) Select-String -Path "*.js" -Pattern $pattern }
Set-Alias -Name grep -Value Search-Files
```
Usage: `grep "function"`

### Find Files by Name Pattern
```powershell
Get-ChildItem -Recurse -Filter "*.jsx"
```

### Search in Specific File
```powershell
Select-String -Path "package.json" -Pattern "vite"
```

---

## 📦 Git Commands

### Check Status
```powershell
git status
```
**Alias:**
```powershell
Set-Alias -Name gs -Value 'git status'
```
Usage: `gs`

### Add All Changes
```powershell
git add .
```
**Alias:**
```powershell
function Git-AddAll { git add . }
Set-Alias -Name ga -Value Git-AddAll
```
Usage: `ga`

### Commit with Message
```powershell
git commit -m "your message"
```
**Alias:**
```powershell
function Git-Commit { param($msg) git commit -m $msg }
Set-Alias -Name gc -Value Git-Commit
```
Usage: `gc "your message"`

### Push to Remote
```powershell
git push
```
**Alias:**
```powershell
Set-Alias -Name gp -Value 'git push'
```
Usage: `gp`

### Pull from Remote
```powershell
git pull
```

### View Branches
```powershell
git branch
```

### Switch Branch
```powershell
git checkout branch-name
```

### Create and Switch to New Branch
```powershell
git checkout -b new-branch-name
```

### View Diff
```powershell
git diff
```

### View Commit Log
```powershell
git log --oneline -10
```
**Alias:**
```powershell
Set-Alias -Name gl -Value 'git log --oneline -10'
```
Usage: `gl`

### Stash Changes
```powershell
git stash
```

### View Stash List
```powershell
git stash list
```

### Apply Latest Stash
```powershell
git stash pop
```

---

## 📦 npm Commands

### Install Dependencies
```powershell
npm install
```
**Alias:**
```powershell
Set-Alias -Name ni -Value 'npm install'
```
Usage: `ni`

### Install Specific Package
```powershell
npm install package-name
```

### Install Dev Dependency
```powershell
npm install --save-dev package-name
```

### Run Dev Server
```powershell
npm run dev
```
**Alias:**
```powershell
Set-Alias -Name nrd -Value 'npm run dev'
```
Usage: `nrd`

### Build for Production
```powershell
npm run build
```

### Check Node Version
```powershell
node --version
```

### Check npm Version
```powershell
npm --version
```

---

## 🐳 Docker Commands

### List Running Containers
```powershell
docker ps
```

### List All Containers (including stopped)
```powershell
docker ps -a
```

### Start Docker Compose
```powershell
docker-compose up
```

### Start Docker Compose in Background
```powershell
docker-compose up -d
```
**Alias:**
```powershell
Set-Alias -Name dcup -Value 'docker-compose up -d'
```
Usage: `dcup`

### Rebuild and Start Containers
```powershell
docker-compose up --build
```

### Stop Docker Compose
```powershell
docker-compose down
```
**Alias:**
```powershell
Set-Alias -Name dcdown -Value 'docker-compose down'
```
Usage: `dcdown`

### View Container Logs
```powershell
docker logs container-name
```

### View Live Container Logs
```powershell
docker logs -f container-name
```

### Enter Container Shell
```powershell
docker exec -it container-name sh
```

### List Docker Images
```powershell
docker images
```

### Remove Stopped Containers
```powershell
docker container prune
```

### Remove Unused Images
```powershell
docker image prune -a
```

---

## 🚀 Project-Specific Shortcuts

### Start Backend Dev Server
```powershell
cd C:\Users\mcang\projects\taste-of-aloha\apps\backend; npm run dev
```
**Alias:**
```powershell
function Start-Backend { cd C:\Users\mcang\projects\taste-of-aloha\apps\backend; npm run dev }
Set-Alias -Name backend -Value Start-Backend
```
Usage: `backend`

### Start Frontend Dev Server
```powershell
cd C:\Users\mcang\projects\taste-of-aloha\apps\web; npm run dev
```
**Alias:**
```powershell
function Start-Frontend { cd C:\Users\mcang\projects\taste-of-aloha\apps\web; npm run dev }
Set-Alias -Name frontend -Value Start-Frontend
```
Usage: `frontend`

### Go to Project Root
```powershell
cd C:\Users\mcang\projects\taste-of-aloha
```
**Alias:**
```powershell
function Go-ToProject { cd C:\Users\mcang\projects\taste-of-aloha }
Set-Alias -Name toa -Value Go-ToProject
```
Usage: `toa` (Taste of Aloha)

---

## ⚙️ Setting Up Permanent Aliases

To make aliases persist across PowerShell sessions, add them to your PowerShell profile:

### 1. Check if Profile Exists
```powershell
Test-Path $PROFILE
```

### 2. Create Profile if Doesn't Exist
```powershell
New-Item -ItemType File -Path $PROFILE -Force
```

### 3. Open Profile in VS Code
```powershell
code $PROFILE
```

### 4. Add Your Aliases to Profile
Copy and paste these into your profile file:

```powershell
# Navigation Aliases
Set-Alias -Name here -Value Get-Location
Set-Alias -Name ll -Value Get-ChildItem
Set-Alias -Name open -Value explorer

# File Operation Aliases
function New-File { param($name) New-Item -ItemType File $name }
Set-Alias -Name touch -Value New-File

function New-Folder { param($name) New-Item -ItemType Directory -Force $name }
Set-Alias -Name mkd -Value New-Folder

function Remove-Folder { param($name) Remove-Item -Recurse -Force $name }
Set-Alias -Name rmf -Value Remove-Folder

# Git Aliases
Set-Alias -Name gs -Value 'git status'
Set-Alias -Name gl -Value 'git log --oneline -10'

function Git-AddAll { git add . }
Set-Alias -Name ga -Value Git-AddAll

function Git-Commit { param($msg) git commit -m $msg }
Set-Alias -Name gc -Value Git-Commit

Set-Alias -Name gp -Value 'git push'

# npm Aliases
Set-Alias -Name ni -Value 'npm install'
Set-Alias -Name nrd -Value 'npm run dev'

# Docker Aliases
Set-Alias -Name dcup -Value 'docker-compose up -d'
Set-Alias -Name dcdown -Value 'docker-compose down'

# Project-Specific Aliases
function Go-ToProject { cd C:\Users\mcang\projects\taste-of-aloha }
Set-Alias -Name toa -Value Go-ToProject

function Start-Backend { cd C:\Users\mcang\projects\taste-of-aloha\apps\backend; npm run dev }
Set-Alias -Name backend -Value Start-Backend

function Start-Frontend { cd C:\Users\mcang\projects\taste-of-aloha\apps\web; npm run dev }
Set-Alias -Name frontend -Value Start-Frontend

# Utility Functions
function Find-EmptyFolders { Get-ChildItem -Recurse -Directory | Where-Object { (Get-ChildItem $_.FullName).Count -eq 0 } | Select-Object FullName }
Set-Alias -Name findempty -Value Find-EmptyFolders

function Search-Files { param($pattern) Select-String -Path "*.js" -Pattern $pattern }
Set-Alias -Name grep -Value Search-Files
```

### 5. Reload Profile
```powershell
. $PROFILE
```

---

## 💡 Pro Tips

### Tab Completion
Type part of a command or path and press `Tab` to autocomplete:
```powershell
cd tas[Tab] → cd taste-of-aloha
```

### Reverse Search History
Press `Ctrl + R` and type to search command history

### Cancel Current Command
Press `Ctrl + C`

### Paste in PowerShell
Right-click or `Ctrl + V`

### Multiple Commands on One Line
Use semicolon `;` to separate:
```powershell
cd apps\backend; npm run dev
```

### Check if Command Exists
```powershell
Get-Command git
```

### Find Command Location
```powershell
Get-Command node | Select-Object Source
```

---

## 🎯 Quick Reference Table

| Action | Command | Alias |
|--------|---------|-------|
| Current directory | `pwd` | `here` |
| List files | `ls` | `ll` |
| Create file | `New-Item -ItemType File "name"` | `touch name` |
| Create folder | `New-Item -ItemType Directory "name"` | `mkd name` |
| Delete folder | `Remove-Item -Recurse -Force "name"` | `rmf name` |
| Git status | `git status` | `gs` |
| Git status | `git stash` | `gst` |
| Git add all | `git add .` | `ga` |
| Git commit | `git commit -m "msg"` | `gc "msg"` |
| Git push | `git push` | `gp` |
| npm install | `npm install` | `ni` |
| npm dev | `npm run dev` | `nrd` |
| Docker up | `docker-compose up -d` | `dcup` |
| Docker down | `docker-compose down` | `dcdown` |
| Go to project | `cd C:\...\taste-of-aloha` | `toa` |
| Start backend | Full path + npm run dev | `backend` |
| Start frontend | Full path + npm run dev | `frontend` |

---

## 📚 Additional Resources

- [PowerShell Documentation](https://learn.microsoft.com/en-us/powershell/)
- [Git Documentation](https://git-scm.com/doc)
- [npm Documentation](https://docs.npmjs.com/)
- [Docker Documentation](https://docs.docker.com/)

---

**Created:** December 4, 2025  
**Project:** Taste of Aloha  
**Author:** Hoku McAngus
