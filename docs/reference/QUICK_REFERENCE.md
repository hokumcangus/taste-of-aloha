# Quick Reference: Creating Issues and Organizing Project Board

## TL;DR - What You Need to Do

1. **Create Issues** - Use the templates in `.github/ISSUE_TEMPLATE/` to create 6 new issues
2. **Add to Project Board** - Add these issues to your GitHub Project board
3. **Organize by Column** - Put completed work in "Done", upcoming work in "Backlog"

---

## Step-by-Step Instructions

### Part 1: Create the Issues (5 minutes)

Go to: https://github.com/hokumcangus/taste-of-aloha/issues/new/choose

You'll see 6 templates. Click "Get started" on each:

1. ✅ **Sprint 2 - Menu + Cart MVP**
2. ✅ **Sprint 3 - Authentication + Roles**
3. ✅ **Sprint 4 - Checkout + Payments**
4. ✅ **Sprint 5 - Order Lifecycle & Admin**
5. ✅ **Sprint 6 - Tests, CI, Deployment**
6. ✅ **Stretch Goals - Post-Launch Features**

For each one:
- The title and description are pre-filled
- Just click **Submit new issue**
- Note the issue number (e.g., #9, #10, etc.)

### Part 2: Set Up Your Project Board (5 minutes)

#### If you don't have a project board yet:

1. Go to: https://github.com/hokumcangus/taste-of-aloha/projects
2. Click **New project**
3. Choose **Board** view
4. Name: "Taste of Aloha Sprint Board"
5. Add these columns:
   - Backlog
   - In Progress
   - Review
   - Done

#### If you already have a project board:

1. Open your existing board
2. Make sure it has these columns (add if missing)

### Part 3: Add Issues to Board (2 minutes)

For each column, click **+ Add item** and add the issues:

**Done Column** (already completed):
- Issue #3: Project Setup
- Issue #4: Initialize project board
- Issue #5: Create architecture diagram
- Issue #8: Sprint 1 - Core Scaffolding

**Backlog Column** (upcoming work):
- Sprint 2: Menu + Cart MVP
- Sprint 3: Authentication + Roles
- Sprint 4: Checkout + Payments
- Sprint 5: Order Lifecycle & Admin
- Sprint 6: Tests, CI, Deployment
- Stretch Goals: Post-Launch Features

---

## Visual Guide

### Before (Issue #1 only)
```
Issue #1: Long checklist with everything
```

### After (Organized Issues)
```
Issue #8: Sprint 1 ✅ DONE
Issue #9: Sprint 2 📋 Backlog
Issue #10: Sprint 3 📋 Backlog
Issue #11: Sprint 4 📋 Backlog
Issue #12: Sprint 5 📋 Backlog
Issue #13: Sprint 6 📋 Backlog
Issue #14: Stretch Goals 📋 Backlog
```

### Project Board View
```
┌─────────────┬──────────────┬─────────┬──────────────┐
│  Backlog    │ In Progress  │ Review  │     Done     │
├─────────────┼──────────────┼─────────┼──────────────┤
│ Sprint 2    │              │         │ Sprint 0     │
│ Sprint 3    │              │         │ (#3,#4,#5)   │
│ Sprint 4    │              │         │              │
│ Sprint 5    │              │         │ Sprint 1     │
│ Sprint 6    │              │         │ (#8)         │
│ Stretch     │              │         │              │
└─────────────┴──────────────┴─────────┴──────────────┘
```

---

## What Each Issue Contains

Each sprint issue has:
- ✅ **Task Checklist** - Check boxes for each subtask
- ✅ **Acceptance Criteria** - How to know it's done
- ✅ **Dependencies** - What needs to be done first
- ✅ **Testing Checklist** - What to test
- ✅ **Documentation** - What to document

Example from Sprint 2:
```markdown
### Tasks
#### 1. Database Setup with Prisma
- [ ] Install Prisma dependencies
- [ ] Create Prisma schema
- [ ] Run migration
- [ ] Verify tables created

Acceptance: Tables created in Postgres
```

---

## Working on a Sprint

When you're ready to start Sprint 2:

1. **Move to "In Progress"**
   - Drag Sprint 2 issue from Backlog → In Progress

2. **Start First Task**
   - Read the issue
   - Check off tasks as you complete them
   - Add comments with progress notes

3. **Track Progress**
   - GitHub shows: "5 of 15 tasks completed"
   - Update as you work

4. **Complete Sprint**
   - When all tasks checked: Move to Review
   - After review: Move to Done
   - Close the issue

---

## Bonus: Create Labels (Optional)

To organize issues better, create these labels:

1. Go to: https://github.com/hokumcangus/taste-of-aloha/labels
2. Click **New label**
3. Create:
   - `sprint-2` (blue)
   - `sprint-3` (blue)
   - `sprint-4` (blue)
   - `sprint-5` (blue)
   - `sprint-6` (blue)
   - `stretch` (yellow)
   - `backend` (purple)
   - `frontend` (green)
   - `database` (orange)

Then edit each issue to add the appropriate labels.

---

## Files Created for You

These files are now in your repository:

📄 **TASK_BREAKDOWN.md**
- Complete breakdown of all tasks
- Organized by sprint with subtasks

📄 **ISSUES_SETUP_GUIDE.md**
- Detailed guide for creating and managing issues
- Best practices and workflows

📄 **SPRINT_PLANNING.md**
- Sprint overview and timelines
- Dependencies and risk assessment

📄 **QUICK_REFERENCE.md** (this file)
- Quick start guide
- Step-by-step instructions

📁 **.github/ISSUE_TEMPLATE/**
- Issue templates for each sprint
- Pre-filled with tasks and checklists

---

## Common Questions

**Q: Do I need to create sub-issues for each task?**
A: No! The checklists in each sprint issue are enough. Only create sub-issues if you want more granular tracking.

**Q: Can I modify the templates?**
A: Yes! They're just starting points. Adjust them to fit your workflow.

**Q: What if I want to work on sprints out of order?**
A: Generally, follow the order (Sprint 2 → 3 → 4 → 5 → 6) since each builds on the previous. But you can adjust if needed.

**Q: Should I close Issue #1?**
A: Keep it open as a reference, or update it with links to the new sprint issues, then close it.

---

## Next Steps

1. ✅ Read this guide (you're doing it!)
2. 🔄 Create the 6 sprint issues
3. 🔄 Add them to your project board
4. 🔄 Move completed work to Done column
5. 🔄 Start working on Sprint 2
6. 🎉 Check off tasks as you complete them!

---

## Need More Details?

- **Detailed Instructions**: See [ISSUES_SETUP_GUIDE.md](./ISSUES_SETUP_GUIDE.md)
- **Task Details**: See [TASK_BREAKDOWN.md](./TASK_BREAKDOWN.md)
- **Sprint Planning**: See [SPRINT_PLANNING.md](./SPRINT_PLANNING.md)
- **Learning Resources**: See [LEARNING_GUIDE.md](./LEARNING_GUIDE.md)

---

**You've got this! 🌺**

The templates are ready. Just follow the steps above and you'll have a well-organized project board in minutes.
