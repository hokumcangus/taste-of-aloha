# Issue Templates

This directory contains GitHub issue templates for organizing the Taste of Aloha project tasks.

## Available Templates

1. **sprint-2-menu-cart-mvp.md**
   - Database setup with Prisma
   - Backend Menu CRUD API
   - Frontend Menu and Cart
   - ~15 subtasks

2. **sprint-3-authentication-roles.md**
   - User authentication with JWT
   - Login/Signup pages
   - Admin role protection
   - ~18 subtasks

3. **sprint-4-checkout-payments.md**
   - Stripe payment integration
   - Checkout UI
   - Payment webhooks
   - ~15 subtasks

4. **sprint-5-order-lifecycle-admin.md**
   - Order management
   - Order history
   - Email notifications
   - ~20 subtasks

5. **sprint-6-tests-ci-deployment.md**
   - Testing infrastructure
   - CI/CD pipeline
   - Production deployment
   - ~25 subtasks

6. **stretch-goals-post-launch.md**
   - OAuth authentication
   - Mobile app wrapper
   - Backups and monitoring
   - ~20+ subtasks

## How to Use

### Creating an Issue from a Template

1. Go to: https://github.com/hokumcangus/taste-of-aloha/issues/new/choose
2. You'll see a list of available templates
3. Click **"Get started"** next to the template you want to use
4. The form will be pre-filled with:
   - Issue title
   - Labels
   - Task checklist
   - Acceptance criteria
5. Review and optionally customize the content
6. Click **"Submit new issue"**

### Template Structure

Each template follows this structure:

```markdown
---
name: Template Name
about: Brief description
title: 'Sprint X: Title'
labels: 'label1, label2'
assignees: ''
---

## Sprint X: Title

Brief overview

### Tasks

#### 1. Main Task Name
- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3
- **Acceptance Criteria**: Definition of done

#### 2. Another Task
- [ ] Subtask A
- [ ] Subtask B
...

### Dependencies
What needs to be completed first

### Related Issues
Links to related issues

### Testing Checklist
What to test

### Documentation
What to document
```

## Customizing Templates

You can modify these templates to fit your workflow:

1. Edit the markdown files in this directory
2. Commit and push changes
3. New issues will use the updated templates

## Best Practices

- **Keep templates updated** as requirements change
- **Add specific acceptance criteria** for your use case
- **Include relevant labels** for easy filtering
- **Link related issues** to maintain traceability
- **Update testing checklists** based on your testing strategy

## Documentation

For more information, see:
- [QUICK_REFERENCE.md](../../QUICK_REFERENCE.md) - Quick start guide
- [ISSUES_SETUP_GUIDE.md](../../ISSUES_SETUP_GUIDE.md) - Detailed instructions
- [TASK_BREAKDOWN.md](../../TASK_BREAKDOWN.md) - Complete task details
- [SPRINT_PLANNING.md](../../SPRINT_PLANNING.md) - Sprint overview

## Workflow

1. **Create Issue** - Use template to create issue
2. **Add to Board** - Add to project board in Backlog column
3. **Start Work** - Move to "In Progress" when starting
4. **Track Progress** - Check off subtasks as you complete them
5. **Review** - Move to "Review" when done
6. **Complete** - Move to "Done" after approval

## Support

If you need help:
- Read the documentation files listed above
- Check the issue template content for guidance
- Refer to [ACTION_ITEMS.md](../../ACTION_ITEMS.md) for next steps

---

**Ready to create your first issue?** Visit: https://github.com/hokumcangus/taste-of-aloha/issues/new/choose
