# 📖 How to View and Edit Architecture Diagrams

## Quick Start Guide

You now have comprehensive architecture documentation for the Taste of Aloha platform! Here's how to view and work with the diagrams.

---

## 📁 What Was Created

### 1. **MVP Features List** (`docs/MVP_FEATURES.md`)
A complete specification of all MVP features including:
- Menu Management (Admin)
- Browse Menu (Customer)
- Shopping Cart
- Checkout (Guest + Authenticated)
- Payment Capture via Stripe
- Order History
- Admin Dashboard

### 2. **System Architecture Diagram** (`docs/architecture/system-architecture.dio`)
A comprehensive diagram showing:
- **Client Layer**: Web browsers, mobile browsers, native app (future), admin dashboard
- **Application Layer**: Frontend (Vite + React) and Backend (Node.js/Express)
- **Data Layer**: PostgreSQL, Redis Cache, Cloud Storage
- **External Services**: Stripe, Firebase/Auth0, SendGrid/Twilio, Google Maps
- **Infrastructure**: Docker, CI/CD, Cloud Hosting, CDN, Monitoring, Security

### 3. **Services Diagram** (`docs/architecture/services-diagram.dio`)
A detailed service-level diagram showing:
- **Customer Services**: Menu Browse, Cart, Checkout, Order History, User Profile, Notifications
- **Core Services**: Payment Processing, Order Management, Inventory, Auth, Analytics
- **Admin Services**: Menu Management, Order Dashboard, Reports
- **Data Layer**: Database, Cache, File Storage
- Complete data flows between all services

### 4. **Architecture README** (`docs/architecture/README.md`)
Comprehensive documentation explaining:
- How each layer works
- Service responsibilities
- Technology choices
- Implementation roadmap
- Best practices

### 5. **Quick Reference Guide** (`docs/QUICK_REFERENCE.md`)
Developer-friendly reference with:
- User journey flows (Guest, Authenticated, Admin)
- API endpoints list
- Database schema overview
- Tech stack breakdown
- Security checklist
- Performance optimization tips

---

## 🎨 Viewing the Diagrams

### Option 1: VS Code with Draw.io Extension (RECOMMENDED)

#### Step 1: Install Draw.io Extension
1. Open VS Code
2. Click on Extensions icon (or press `Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"Draw.io Integration"**
4. Install the extension by **Henning Dieterichs**

#### Step 2: Open Diagram Files
1. Navigate to `docs/architecture/` in VS Code
2. Click on `system-architecture.dio` or `services-diagram.dio`
3. The diagram will open automatically in the Draw.io editor!

#### Features:
- ✅ Edit directly in VS Code
- ✅ Full Draw.io functionality
- ✅ Save changes with Ctrl+S
- ✅ Export to PNG, SVG, PDF
- ✅ Version control integration

### Option 2: Draw.io Desktop Application

#### Download and Install:
1. Go to: https://github.com/jgraph/drawio-desktop/releases
2. Download the installer for your OS (Windows, Mac, Linux)
3. Install and run the application

#### Open Diagrams:
1. File → Open
2. Navigate to your repository: `docs/architecture/`
3. Select `system-architecture.dio` or `services-diagram.dio`

### Option 3: Draw.io Web (diagrams.net)

#### Online Editor:
1. Go to: https://app.diagrams.net/
2. Click "Open Existing Diagram"
3. Choose "Device"
4. Navigate to `docs/architecture/` in your repo
5. Select the `.dio` file

**Note**: You'll need to download/upload files manually with this method.

---

## 🖼️ Diagram Overview

### System Architecture Diagram
```
Shows the COMPLETE system from:
├── Client Layer (browsers, apps)
├── Application Layer (frontend + backend)
├── Data Layer (database, cache, storage)
├── External Services (Stripe, Auth, Email, Maps)
└── Infrastructure (Docker, CI/CD, Cloud, CDN, Security)

All connections show data flows and integration points!
```

**Use this diagram for**:
- Understanding overall system structure
- Explaining architecture to stakeholders
- Planning infrastructure deployment
- Identifying external dependencies

### Services Diagram
```
Shows DETAILED service interactions:
├── Customer-Facing Services (6 services)
├── Core Business Services (5 services)
├── Admin Dashboard Services (3 services)
└── Data Layer Services (3 services)

All data flows and service communications mapped!
```

**Use this diagram for**:
- Understanding service responsibilities
- Planning API endpoints
- Debugging data flow issues
- Designing new features

---

## ✏️ Editing the Diagrams

### Making Changes

1. **Open the `.dio` file** in VS Code with Draw.io extension
2. **Select any element** by clicking on it
3. **Edit properties**:
   - Double-click text to edit
   - Right panel shows formatting options
   - Drag to move elements
   - Resize handles for changing size
4. **Add new elements**:
   - Left sidebar has shapes library
   - Drag shapes onto canvas
   - Use connection tool for arrows
5. **Save changes**: Press `Ctrl+S` (or `Cmd+S`)

### Best Practices

- **Keep consistent colors**: Each layer has its own color scheme
- **Label connections**: All arrows should have descriptive labels
- **Maintain alignment**: Use alignment tools (top toolbar)
- **Group related items**: Use containers/swimlanes
- **Update both diagrams**: If architecture changes affect both
- **Update documentation**: Remember to update README files too!

---

## 📤 Exporting Diagrams

### For Presentations or Documentation

#### In VS Code:
1. Open the `.dio` file
2. Right-click in the editor
3. Select "Export"
4. Choose format:
   - **PNG**: For documents, presentations
   - **SVG**: For websites, scalable graphics
   - **PDF**: For printing, formal docs
5. Save to desired location

#### Export Settings:
- **Transparent background**: Best for presentations
- **Border width**: Add some padding (10-20px)
- **Scale**: 100% for normal, higher for high-res
- **Include grid**: Usually off for final exports

### Recommended Exports:
```
docs/architecture/exports/
├── system-architecture.png
├── system-architecture.svg
├── services-diagram.png
└── services-diagram.svg
```

---

## 🎯 Using the Documentation

### For Developers

1. **Start with**: `docs/MVP_FEATURES.md` to understand requirements
2. **Reference**: `docs/QUICK_REFERENCE.md` for technical details
3. **Consult diagrams** when implementing features
4. **Update diagrams** when adding new services

### For Stakeholders

1. **Show**: System Architecture diagram for high-level overview
2. **Explain**: MVP Features document for business requirements
3. **Demonstrate**: Services diagram for technical capabilities

### For Onboarding

1. Read `README.md` in project root
2. Review `docs/MVP_FEATURES.md`
3. Study both architecture diagrams
4. Reference `docs/QUICK_REFERENCE.md` while coding

---

## 🔄 Keeping Diagrams Updated

### When to Update

Update diagrams when:
- ✅ Adding new services or components
- ✅ Changing service interactions
- ✅ Adding/removing external integrations
- ✅ Modifying data flows
- ✅ Updating technology stack
- ✅ Changing deployment infrastructure

### Update Checklist

- [ ] Update the affected `.dio` file(s)
- [ ] Update `docs/architecture/README.md` if needed
- [ ] Update `docs/MVP_FEATURES.md` if features change
- [ ] Update `docs/QUICK_REFERENCE.md` if APIs/flows change
- [ ] Export updated PNG/SVG versions
- [ ] Commit changes with descriptive message
- [ ] Update project wiki if applicable

---

## 📋 Diagram Contents Summary

### System Architecture Shows:
- All system layers and components
- Technology stack for each layer
- External service integrations
- Data flow between layers
- Infrastructure and deployment
- Security and monitoring

### Services Diagram Shows:
- Individual service responsibilities
- Service-to-service communication
- Data persistence flows
- Caching strategies
- Customer vs Admin vs Core services
- Complete MVP feature coverage

---

## 🆘 Troubleshooting

### Can't Open .dio Files?

**Solution**: Make sure you have:
1. Installed Draw.io extension in VS Code, OR
2. Installed Draw.io Desktop app, OR
3. Using diagrams.net in a web browser

### Diagrams Look Different?

**Cause**: Draw.io version differences
**Solution**: Use same version across team (latest recommended)

### Lost Changes?

**Solution**: `.dio` files are in git
```bash
# View previous versions
git log -- docs/architecture/*.dio

# Restore previous version
git checkout <commit-hash> -- docs/architecture/system-architecture.dio
```

### Can't Export?

**In VS Code**: Right-click → Export
**In Desktop**: File → Export As
**In Web**: File → Export As

---

## 🎓 Learning Draw.io

### Essential Tools

- **Selection Tool** (V): Click and move elements
- **Connection Tool** (C): Draw arrows between shapes
- **Text Tool** (T): Add or edit text
- **Format Panel** (Right side): Style elements
- **Shapes Panel** (Left side): Add new elements

### Keyboard Shortcuts

- `Ctrl+C` / `Cmd+C`: Copy
- `Ctrl+V` / `Cmd+V`: Paste
- `Ctrl+D` / `Cmd+D`: Duplicate
- `Ctrl+Z` / `Cmd+Z`: Undo
- `Ctrl+Shift+Z` / `Cmd+Shift+Z`: Redo
- `Delete`: Delete selected element
- Arrow keys: Move selection
- `Ctrl+Arrow` / `Cmd+Arrow`: Move 1px at a time

---

## 📚 Additional Resources

### Official Documentation
- [Draw.io Documentation](https://www.diagrams.net/doc/)
- [VS Code Extension Guide](https://github.com/hediet/vscode-drawio)
- [System Design Resources](https://github.com/donnemartin/system-design-primer)

### Architecture Patterns
- [Microservices Architecture](https://microservices.io/)
- [RESTful API Design](https://restfulapi.net/)
- [Database Design](https://www.postgresql.org/docs/current/tutorial.html)

---

## ✅ Next Steps

1. **Review all documentation** to understand the complete system
2. **Open the diagrams** in VS Code or Draw.io
3. **Explore each layer** and service in the diagrams
4. **Reference during development** when implementing features
5. **Keep diagrams updated** as the system evolves

---

## 💡 Tips

- **Zoom in/out**: Use mouse wheel or zoom controls
- **Pan around**: Hold Space + drag, or use scroll bars
- **Find elements**: Use Ctrl+F / Cmd+F to search
- **Group elements**: Select multiple + Right-click → Group
- **Align elements**: Use alignment tools in toolbar
- **Snap to grid**: Enable for cleaner layouts

---

**Questions?** 
Open an issue on GitHub with the `documentation` or `architecture` label!

---

*Visual Guide Version 1.0 - December 2025*
