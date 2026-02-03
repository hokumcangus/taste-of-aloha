# 📚 Documentation Structure Overview

**Last Updated**: January 30, 2026

## The Parent-Child Model Explained

Our documentation uses a **hierarchical "Parent-Child"** approach:

- **Parent**: Root-level README focuses on the "big picture"
- **Children**: Sub-folder READMEs handle "technical nitty-gritty"

This keeps the repository clean and makes it easy for new team members to find what they need.

---

## 🗺 Documentation Map

```
🌴 taste-of-aloha/
│
├── 📄 README.md (THE ENTRY POINT)
│   └── Answers: "How do I run this whole system?"
│
├── 📁 apps/web/
│   └── 📄 README.md (Frontend Specifics)
│       └── Answers: "How do I build React components?"
│
├── 📁 apps/backend/
│   ├── 📄 README.md (Backend Specifics)
│   │   └── Answers: "How do I build API endpoints?"
│   └── 📄 DATABASE_SETUP_GUIDE.md (Database Deep-Dive)
│       └── Answers: "How do I manage the database?"
│
└── 📁 docs/
    ├── 📁 guides/ (How-To Guides)
    │   ├── 📄 LEARNING_GUIDE.md (Comprehensive Reference)
    │   ├── 📄 BACKEND_API_GUIDE.md (API Details)
    │   ├── 📄 TESTING_GUIDE.md (Testing Patterns)
    │   └── 📄 TROUBLESHOOTING.md (Common Issues)
    │
    ├── 📁 architecture/ (System Design)
    │   ├── 📄 README.md (Architecture Overview)
    │   └── 📄 ONE_PAGER.md (Quick Architecture Summary)
    │
    └── 📁 planning/ (Sprint & Project Tracking)
        ├── 📄 SPRINT_2_TRACKING.md
        └── 📄 ACTION_ITEMS.md
```

---

## 🎯 What Documentation to Read

### 👤 **I'm a new team member starting today**
1. Read: `/README.md` (5 min) ← You are here!
2. Based on your role:
   - **Frontend Dev**: → `apps/web/README.md`
   - **Backend Dev**: → `apps/backend/README.md`
   - **Full Stack**: → Both READMEs

### 👨‍💻 **I want to contribute to the frontend**
- Quick Start: `apps/web/README.md`
- Deep Dive: `docs/guides/LEARNING_GUIDE.md`
- Testing: `docs/guides/TESTING_GUIDE.md`
- Shopping Cart: See `apps/web/README.md` → "Shopping Cart Logic"

### 🔧 **I want to contribute to the backend**
- Quick Start: `apps/backend/README.md`
- API Endpoints: `docs/guides/BACKEND_API_GUIDE.md`
- Database: `apps/backend/DATABASE_SETUP_GUIDE.md`
- Testing: `docs/guides/TESTING_GUIDE.md`

### 🗄️ **I need to manage the database**
- Database Setup: `apps/backend/DATABASE_SETUP_GUIDE.md`
- Prisma Commands: `apps/backend/README.md` → "Database Commands"
- Database API: `docs/guides/DATABASE_API_GUIDE.md`

### 🐛 **I'm debugging an issue**
1. Check: `docs/guides/EXTERNAL_TROUBLESHOOTING_TEMPLATE.md` ← Most common issues
2. If not there: `docs/guides/TROUBLESHOOTING.md`
3. If Docker issue: `docs/DOCKER_PRISMA_TROUBLESHOOTING.md`

### 📐 **I want to understand the architecture**
- Overview: `docs/architecture/README.md`
- Quick Version: `docs/architecture/ONE_PAGER.md`
- System Diagram: `docs/architecture/system-architecture.dio`

### 📊 **I'm tracking progress / planning**
- Current Sprint: `docs/planning/SPRINT_2_TRACKING.md`
- Action Items: `docs/planning/ACTION_ITEMS.md`
- Deliverables: `docs/planning/DELIVERABLES_SUMMARY.md`

---

## 🔑 Key Files by Purpose

| Purpose | Primary File | Backup/Details |
|---------|-------------|-----------------|
| **Start here** | `/README.md` | `docs/guides/QUICK_START.md` |
| **Frontend setup** | `apps/web/README.md` | `docs/guides/LEARNING_GUIDE.md` |
| **Backend setup** | `apps/backend/README.md` | `docs/guides/BACKEND_API_GUIDE.md` |
| **Database setup** | `apps/backend/DATABASE_SETUP_GUIDE.md` | `docs/guides/DATABASE_API_GUIDE.md` |
| **Troubleshooting** | `docs/guides/EXTERNAL_TROUBLESHOOTING_TEMPLATE.md` | `docs/DOCKER_PRISMA_TROUBLESHOOTING.md` |
| **Architecture** | `docs/architecture/README.md` | `docs/architecture/ONE_PAGER.md` |
| **Testing** | `docs/guides/TESTING_GUIDE.md` | `docs/guides/LEARNING_GUIDE.md` |
| **Learning** | `docs/guides/LEARNING_GUIDE.md` | All READMEs |

---

## 📝 Documentation Best Practices

### For Team Members Writing Docs:

1. **Keep it focused** — Each README should have ONE clear purpose
2. **Link, don't repeat** — Use hyperlinks instead of copying content
3. **Update together** — If you change code, update related docs
4. **Use examples** — Show code examples for every major feature
5. **Keep it fresh** — Mark outdated docs with ⚠️ **UPDATE NEEDED**

### Document Structure (Use This Template):

```markdown
# 📦 [Component] — [Purpose]

Brief intro (1-2 sentences)

## 🧪 Tech Stack
- List key technologies

## 🚀 Getting Started
- Quick startup steps
- Local vs Docker sections

## 🏗 Project Structure
- File/folder overview

## 📚 Documentation
- Links to related guides

## 🔗 Related
- Cross-references to other READMEs
```

---

## 🔄 How to Navigate

### Example: You want to learn Redux

```
You're reading: /README.md
     ↓
Check: apps/web/README.md → "Shopping Cart Logic"
     ↓
Deep dive: docs/guides/LEARNING_GUIDE.md → "Redux Patterns"
     ↓
See examples: docs/guides/TESTING_GUIDE.md → "Testing Redux"
```

### Example: You hit a database error

```
You see error message
     ↓
Search: docs/guides/EXTERNAL_TROUBLESHOOTING_TEMPLATE.md
     ↓
Follow the solution step-by-step
     ↓
If not found there: docs/guides/TROUBLESHOOTING.md
     ↓
Still stuck: Ask in Slack #engineering with error details
```

---

## 📞 How to Ask for Help

When asking the team for help, include:
- **What file/section** were you reading?
- **What did you try** to do?
- **What error** did you get? (paste full message)
- **What have you tried** already?

**Example (Good):**
> "I'm reading `apps/backend/README.md` and trying to run `npx prisma migrate dev`. I get error 'P3009: Failed to create database'. I already checked that PostgreSQL is running. What's next?"

**Example (Not helpful):**
> "Database doesn't work. How do I fix it?"

---

## 🆕 What's New (January 2026)

✅ **New Files Created:**
- `/README.md` — Consolidated root guide
- `apps/web/README.md` — Consolidated frontend guide
- `apps/backend/README.md` — Consolidated backend guide
- `docs/guides/EXTERNAL_TROUBLESHOOTING_TEMPLATE.md` — Copy to Google Doc
- `CONSOLIDATION_NOTES.md` — Summary of changes
- `docs/DOCUMENTATION_STRUCTURE.md` — This file!

📋 **Files Still Available:**
- `docs/guides/LEARNING_GUIDE.md` — Deep reference (not replaced)
- `apps/backend/DATABASE_SETUP_GUIDE.md` — Database details (not replaced)
- `docs/guides/BACKEND_API_GUIDE.md` — API reference (not replaced)
- All other guides in `docs/guides/`, `docs/planning/`, etc.

---

## ✅ Documentation Checklist

Use this when reviewing if our docs are good:

- [ ] Root README is the obvious entry point
- [ ] Each sub-folder has its own README
- [ ] Each README has ONE clear purpose
- [ ] Navigation links are present and working
- [ ] Code examples are current and testable
- [ ] Troubleshooting guide covers common issues
- [ ] Architecture diagram is up-to-date
- [ ] Team knows where to look for different info

---

## 🤔 Questions?

- **"Where do I start?"** → `/README.md`
- **"How do I build X?"** → Sub-folder README
- **"How do I fix error Y?"** → `docs/guides/EXTERNAL_TROUBLESHOOTING_TEMPLATE.md`
- **"What's the big picture?"** → `docs/architecture/README.md`
- **"Who do I ask?"** → Team lead + Slack #engineering

---

**Remember:** Good documentation saves everyone time. If you find docs missing or outdated, create an issue or update them! 🙏
