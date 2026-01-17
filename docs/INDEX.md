# 🌺 Taste of Aloha - Documentation Index

## Welcome!

This is your central hub for all Taste of Aloha Food Delivery Service documentation. Use this guide to find what you need quickly.

---

## 🚀 Quick Navigation

### I want to...

**Start here (simplified)** → [Start Here Guide](guides/START_HERE.md)
**Get started quickly** → [Quick Start Guide](guides/QUICK_START.md)
**Understand the system** → [System Architecture](architecture/README.md)
**Learn the API** → [Backend API Guide](guides/BACKEND_API_GUIDE.md)
**Fix a problem** → [Docker + Prisma Troubleshooting](DOCKER_PRISMA_TROUBLESHOOTING.md)
**Set up Docker** → [Docker Setup Guide](guides/DOCKER_SETUP_GUIDE.md)
**Understand the database** → [Database Setup Guide](guides/DATABASE_SETUP_GUIDE.md)
**Test the app** → [Testing Guide](guides/TESTING_GUIDE.md)

---

## 📚 Full Documentation Structure

```
docs/
├── INDEX.md                              ← You are here
├── HOW_TO_VIEW_DIAGRAMS.md              # How to open/edit .dio diagrams
├── DOCKER_PRISMA_TROUBLESHOOTING.md     # Docker & Prisma 7 issues & fixes
├── DOCUMENTATION_CONSOLIDATION.md       # Doc organization strategy
│
├── guides/                               # How-to guides & getting started
│   ├── QUICK_START.md                  # 🌟 Start here - 5 min setup
│   ├── BACKEND_API_GUIDE.md            # API endpoints & examples
│   ├── DATABASE_SETUP_GUIDE.md         # PostgreSQL & Prisma setup
│   ├── DATABASE_API_GUIDE.md           # Database queries & models
│   ├── DOCKER_SETUP_GUIDE.md           # Docker & containers
│   ├── LEARNING_GUIDE.md               # Code walkthrough
│   ├── TESTING_GUIDE.md                # Unit & integration tests
│   └── ORDER_SYSTEM_GUIDE.md           # Order processing flow
│
├── reference/                            # Quick lookups & checklists
│   ├── QUICK_REFERENCE.md              # Commands, URLs, shortcuts
│   ├── DATABASE_COMMANDS_REFERENCE.md  # SQL & Prisma commands
│   ├── BACKEND_API_CHECKLIST.md        # API verification checklist
│   └── SETUP_CHECKLIST.md              # Environment setup checklist
│
├── architecture/                         # Design & system diagrams
│   ├── README.md                       # Architecture overview
│   ├── system-architecture.dio         # Full system diagram
│   └── services-diagram.dio            # Services & data flow
│
├── planning/                             # Project planning & status
│   ├── MVP_FEATURES.md                 # Feature specifications
│   ├── ACTION_ITEMS.md                 # Current tasks & PRs
│   ├── DEVELOPMENT_PROGRESS.md         # Progress tracking
│   ├── SPRINT_PLANNING.md              # Sprint planning
│   └── TASK_BREAKDOWN.md               # Task decomposition
│
└── setup/                                # Environment setup
    ├── DOCKER_SETUP_GUIDE.md           # Docker installation
    ├── ISSUES_SETUP_GUIDE.md           # Fixing setup issues
    └── SETUP_CHECKLIST.md              # Verification steps
```

---

## 📖 Document Guide

### 🟢 Start Here (New to Project)

#### [Quick Start Guide](guides/QUICK_START.md)
**5 minutes to running code**
- Docker setup (recommended)
- Local development setup
- Testing the API
- Windows PowerShell commands

#### [System Architecture](architecture/README.md)
**Understand how it works**
- Architecture overview
- Component relationships
- Data flow
- Technology stack

### 🔧 Guides (How-to & Learning)

#### [BACKEND_API_GUIDE.md](guides/BACKEND_API_GUIDE.md)
REST API endpoints and usage
- Available endpoints
- Request/response examples
- Error handling
- Status codes

#### [DATABASE_SETUP_GUIDE.md](guides/DATABASE_SETUP_GUIDE.md)
PostgreSQL and Prisma configuration
- Database initialization
- Connection strings
- Schema setup
- Migrations

#### [DATABASE_API_GUIDE.md](guides/DATABASE_API_GUIDE.md)
Database queries using Prisma ORM
- Model queries
- Relationships
- Aggregations
- Best practices

#### [DOCKER_SETUP_GUIDE.md](guides/DOCKER_SETUP_GUIDE.md)
Complete Docker setup
- Installation
- Container configuration
- Docker Compose
- Networking

#### [LEARNING_GUIDE.md](guides/LEARNING_GUIDE.md)
Code walkthrough for developers
- Architecture explanation
- Code organization
- Key files overview
- Development workflow

#### [TESTING_GUIDE.md](guides/TESTING_GUIDE.md)
Unit and integration testing
- Jest configuration
- Writing tests
- Running tests
- Coverage reports

#### [ORDER_SYSTEM_GUIDE.md](guides/ORDER_SYSTEM_GUIDE.md)
Order processing & management
- Order flow
- State management
- API integration
- Features

### 🔍 Reference (Quick Lookups)

#### [QUICK_REFERENCE.md](reference/QUICK_REFERENCE.md)
Commands and API URLs at a glance
- Common commands
- Service URLs
- API endpoints quick list
- Environment variables

#### [DATABASE_COMMANDS_REFERENCE.md](reference/DATABASE_COMMANDS_REFERENCE.md)
PostgreSQL and Prisma commands
- SQL queries
- Prisma CLI commands
- Migration commands
- Troubleshooting queries

#### [BACKEND_API_CHECKLIST.md](reference/BACKEND_API_CHECKLIST.md)
Verify your API is working
- Endpoint tests
- Response validation
- Error scenarios
- Performance checks

#### [SETUP_CHECKLIST.md](reference/SETUP_CHECKLIST.md)
Verify your environment is ready
- Prerequisites
- Installation steps
- Configuration
- Verification steps

### 🏗️ Architecture (Design & Diagrams)

#### [system-architecture.dio](architecture/system-architecture.dio)
High-level system overview
- Services
- Databases
- External systems
- Data flow

#### [services-diagram.dio](architecture/services-diagram.dio)
Detailed service interactions
- Frontend service
- Backend service
- Database service
- API contracts

### 📋 Planning (Project Status)

#### [MVP_FEATURES.md](planning/MVP_FEATURES.md)
Complete feature specifications
- Feature list
- Acceptance criteria
- Priority ranking
- Status tracking

#### [ACTION_ITEMS.md](planning/ACTION_ITEMS.md)
Current tasks and PRs
- Open pull requests
- In-progress tasks
- Blocked items
- Next steps

#### [DEVELOPMENT_PROGRESS.md](planning/DEVELOPMENT_PROGRESS.md)
Overall progress tracking
- Completion percentage
- Milestone status
- Known issues
- Roadmap

### ⚙️ Troubleshooting

#### [DOCKER_PRISMA_TROUBLESHOOTING.md](DOCKER_PRISMA_TROUBLESHOOTING.md) 🌟 **NEW**
Docker and Prisma 7 issues
- Common errors and fixes
- Testing & verification steps
- Debugging tips
- Common commands

#### [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) (Root)
General troubleshooting
- Build issues
- Runtime errors
- Configuration problems
- Environment setup

---

## 🎯 Recommended Reading Paths

### Path 1: New Developer Onboarding (30 minutes)
1. [QUICK_START.md](guides/QUICK_START.md) - Get it running
2. [System Architecture](architecture/README.md) - Understand structure
3. [LEARNING_GUIDE.md](guides/LEARNING_GUIDE.md) - Learn the code

### Path 2: Backend Development (1 hour)
1. [QUICK_START.md](guides/QUICK_START.md) - Setup
2. [BACKEND_API_GUIDE.md](guides/BACKEND_API_GUIDE.md) - API endpoints
3. [DATABASE_API_GUIDE.md](guides/DATABASE_API_GUIDE.md) - Database access
4. [TESTING_GUIDE.md](guides/TESTING_GUIDE.md) - Write tests

### Path 3: Database Work (1 hour)
1. [DATABASE_SETUP_GUIDE.md](guides/DATABASE_SETUP_GUIDE.md) - Initial setup
2. [DATABASE_API_GUIDE.md](guides/DATABASE_API_GUIDE.md) - Query patterns
3. [DATABASE_COMMANDS_REFERENCE.md](reference/DATABASE_COMMANDS_REFERENCE.md) - CLI reference

### Path 4: Troubleshooting (varies)
1. [DOCKER_PRISMA_TROUBLESHOOTING.md](DOCKER_PRISMA_TROUBLESHOOTING.md) - Docker/Prisma issues
2. [QUICK_REFERENCE.md](reference/QUICK_REFERENCE.md) - Common commands
3. Root [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - General issues

---

## 🔗 Key Links

| Resource | Link | Purpose |
|----------|------|---------|
| **Main README** | [README.md](../README.md) | Project overview |
| **Implementation** | [IMPLEMENTATION.md](../IMPLEMENTATION.md) | Current implementation status |
| **Quick Start** | [Quick Start](guides/QUICK_START.md) | Get started in 5 minutes |
| **Architecture** | [Architecture](architecture/README.md) | System design overview |
| **API Reference** | [Backend API](guides/BACKEND_API_GUIDE.md) | API endpoints |
| **Database** | [Database Guide](guides/DATABASE_SETUP_GUIDE.md) | Database setup & usage |
| **Troubleshooting** | [Docker + Prisma](DOCKER_PRISMA_TROUBLESHOOTING.md) | Docker/Prisma issues |

---

## 💡 Tips

- **Use the Quick Navigation** at the top to jump directly to what you need
- **Recommended Reading Paths** provide structured learning flows
- **QUICK_REFERENCE.md** has commands you'll use daily
- **DOCKER_PRISMA_TROUBLESHOOTING.md** covers the biggest pain points

---

## 📞 Need Help?

1. Check [DOCKER_PRISMA_TROUBLESHOOTING.md](DOCKER_PRISMA_TROUBLESHOOTING.md) - covers most Docker/Prisma issues
2. Check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - general issues
3. Review relevant guide from the structure above
4. Check [ACTION_ITEMS.md](planning/ACTION_ITEMS.md) - see if it's a known issue

---

**Last Updated**: January 3, 2026
**Maintained by**: Development Team
**Status**: Current with Prisma 7 + PostgreSQL + Docker
