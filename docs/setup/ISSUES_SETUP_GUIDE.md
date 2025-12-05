# GitHub Issues and Project Board Setup Guide

This guide will help you create issues from the templates and organize them on a GitHub Project board.

## Overview

The project is organized into sprints based on the checklist in [Issue #1](https://github.com/hokumcangus/taste-of-aloha/issues/1). Issue templates have been created for each sprint to make it easy to track progress with detailed subtasks.

## Project Board Columns

Your project board should have these columns:

1. **Backlog** - Tasks not yet started
2. **In Progress** - Currently being worked on
3. **Review** - Completed and awaiting review
4. **Done** - Completed and reviewed

## Sprint Organization

### Completed Sprints ✅

- **Sprint 0: Project Setup** (Issues #3, #4, #5) - DONE
- **Sprint 1: Core Scaffolding** (Issue #8) - DONE

### Upcoming Sprints 🔄

- **Sprint 2: Menu + Cart MVP**
- **Sprint 3: Authentication + Roles**
- **Sprint 4: Checkout + Payments**
- **Sprint 5: Order Lifecycle & Admin**
- **Sprint 6: Tests, CI, Deployment**
- **Stretch Goals: Post-Launch Features**

---

## How to Create Issues from Templates

### Method 1: Using GitHub Web Interface

1. Navigate to your repository: https://github.com/hokumcangus/taste-of-aloha
2. Click on the **Issues** tab
3. Click the green **New Issue** button
4. You'll see a list of templates:
   - Sprint 2 - Menu + Cart MVP
   - Sprint 3 - Authentication + Roles
   - Sprint 4 - Checkout + Payments
   - Sprint 5 - Order Lifecycle & Admin
   - Sprint 6 - Tests, CI, Deployment
   - Stretch Goals - Post-Launch Features
5. Click **Get started** next to the template you want to use
6. The issue form will be pre-filled with:
   - Title
   - Labels
   - Task checklist
   - Acceptance criteria
7. Review and edit if needed
8. Click **Submit new issue**

### Method 2: Using GitHub CLI (if you have gh installed)

```bash
# Sprint 2
gh issue create --template sprint-2-menu-cart-mvp.md

# Sprint 3
gh issue create --template sprint-3-authentication-roles.md

# Sprint 4
gh issue create --template sprint-4-checkout-payments.md

# Sprint 5
gh issue create --template sprint-5-order-lifecycle-admin.md

# Sprint 6
gh issue create --template sprint-6-tests-ci-deployment.md

# Stretch Goals
gh issue create --template stretch-goals-post-launch.md
```

---

## Organizing Issues on the Project Board

### Step 1: Create GitHub Project (if not already done)

1. Go to your repository
2. Click on **Projects** tab
3. Click **New project**
4. Choose **Board** view
5. Name it "Taste of Aloha Development Board"
6. Add columns: Backlog, In Progress, Review, Done

### Step 2: Add Issues to Project

1. Open your project board
2. Click **+ Add item** in the Backlog column
3. Search for and add each issue:
   - Sprint 2: Menu + Cart MVP
   - Sprint 3: Authentication + Roles
   - Sprint 4: Checkout + Payments
   - Sprint 5: Order Lifecycle & Admin
   - Sprint 6: Tests, CI, Deployment
   - Stretch Goals: Post-Launch Features

### Step 3: Initial Column Assignment

Place issues in columns based on their status:

**Done Column:**
- Issue #3: Project Setup
- Issue #4: Initialize project board
- Issue #5: Create architecture diagram
- Issue #8: Sprint 1 - Core Scaffolding

**Backlog Column:**
- Sprint 2: Menu + Cart MVP
- Sprint 3: Authentication + Roles
- Sprint 4: Checkout + Payments
- Sprint 5: Order Lifecycle & Admin
- Sprint 6: Tests, CI, Deployment
- Stretch Goals: Post-Launch Features

**In Progress Column:**
- (Move items here when you start working on them)

**Review Column:**
- (Move items here when they're ready for review)

---

## Workflow

### Starting a New Sprint

1. Move the sprint issue from **Backlog** to **In Progress**
2. Start checking off subtasks as you complete them
3. Update the issue with progress notes
4. Add comments with screenshots or relevant details

### Completing a Sprint

1. Ensure all subtasks in the issue are checked off
2. Verify all acceptance criteria are met
3. Move the issue to **Review**
4. Have someone review your work
5. Once approved, move to **Done**
6. Close the issue

### Creating Sub-Issues (Optional)

For very large tasks, you can create separate issues for each major subtask:

Example for Sprint 2:
- Create Issue: "Database Setup with Prisma" (references Sprint 2)
- Create Issue: "Backend Menu CRUD Endpoints" (references Sprint 2)
- Create Issue: "Frontend Menu and Cart" (references Sprint 2)

Link them with "Part of #X" in the description where X is the sprint issue number.

---

## Labels

Apply these labels to help categorize issues:

### Sprint Labels
- `sprint-2`, `sprint-3`, `sprint-4`, `sprint-5`, `sprint-6`, `stretch`

### Feature Labels
- `backend`, `frontend`, `database`, `devops`, `testing`
- `authentication`, `payments`, `orders`, `admin`

### Type Labels
- `enhancement`, `bug`, `documentation`, `security`

### Priority Labels
- `priority: high`, `priority: medium`, `priority: low`

### To Create Labels:

1. Go to Issues → Labels
2. Click **New label**
3. Add name, description, and color
4. Create all needed labels

---

## Issue References and Linking

### In Commit Messages
```bash
git commit -m "feat: add menu CRUD endpoints (part of #9)"
```

### In Pull Requests
```markdown
This PR implements the backend menu endpoints.

Closes part of #9
Related to #1
```

### In Issue Comments
```markdown
Working on the Prisma schema. See progress in PR #15.

References #1
```

---

## Tracking Progress

### Within Issues
- Check off subtasks as you complete them
- The GitHub UI shows progress automatically (e.g., "5 of 15 tasks completed")

### On Project Board
- Drag issues between columns as status changes
- Use the board view to see overall project progress
- Filter by label to see specific categories

### Dashboard View
GitHub Projects supports:
- Table view (spreadsheet-like)
- Board view (Kanban)
- Roadmap view (timeline)

---

## Best Practices

1. **Keep Issues Updated**
   - Check off tasks as you complete them
   - Add comments with progress updates
   - Link related PRs and commits

2. **One Issue at a Time**
   - Focus on completing one sprint issue before starting the next
   - Move issues through columns as work progresses

3. **Use Meaningful Commit Messages**
   - Reference issue numbers in commits
   - Use conventional commit format (feat:, fix:, docs:, etc.)

4. **Review Before Closing**
   - Ensure all acceptance criteria are met
   - Run tests and verify functionality
   - Get peer review if possible

5. **Document Blockers**
   - If you get stuck, add a comment to the issue
   - Tag relevant people who might help
   - Link to related issues or documentation

---

## Quick Start Checklist

- [ ] Create issues from all sprint templates
- [ ] Set up GitHub Project board with 4 columns
- [ ] Add all issues to the project board
- [ ] Move completed issues (1, 3, 4, 5, 8) to Done column
- [ ] Place upcoming sprints in Backlog column
- [ ] Create necessary labels
- [ ] Start working on Sprint 2
- [ ] Update issue #1 to reference the new sprint issues

---

## Need Help?

If you need help with any step, check:
- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [Creating Issues from Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)
- [Using Task Lists](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists)

---

## Next Steps

1. **Create Sprint 2 Issue** - This is your immediate next task
2. **Set up Development Environment** - Ensure Docker and local dev are working
3. **Start First Task** - Begin with "Database Setup with Prisma"
4. **Track Progress** - Update the issue as you work
5. **Submit for Review** - Move to Review column when done

Happy coding! 🌺
