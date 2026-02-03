# 🌴 Taste of Aloha | Monorepo

Welcome to the Taste of Aloha full-stack monorepo. This project uses a workspace architecture to manage our frontend, backend, and database in one place.

## 🏗 Project Structure

- **`apps/web`**: React Frontend (Vite + Redux + Tailwind CSS v4)
- **`apps/backend`**: Express API (Node.js + Prisma 7 + PostgreSQL)
- **`docs/`**: Architectural deep-dives, guides, and diagrams

## 🚀 Quick Start (Docker Recommended)

The easiest way to run the entire system:

```bash
docker-compose up --build
```

This starts:
- **Frontend**: http://localhost:5173 (React + Vite)
- **Backend**: http://localhost:3000 (Express API)
- **Database**: localhost:5432 (PostgreSQL)

To stop:
```bash
docker-compose down
```

To reset the database (wipe volumes):
```bash
docker-compose down -v
docker-compose up --build
```

## 🛠 Manual Development Scripts

Run these from the root directory:

```bash
npm run dev:web        # Start the frontend
npm run dev:backend    # Start the API
npm run db:studio      # Open Prisma Studio to view data
```

## 📚 Documentation & Resources

- **[Frontend Guide](apps/web/README.md)** — React, Redux, and UI components
- **[Backend Guide](apps/backend/README.md)** — API routes and database models
- **[Architecture Overview](docs/architecture/README.md)** — System design and diagrams
- **[Database Setup](apps/backend/DATABASE_SETUP_GUIDE.md)** — PostgreSQL and Prisma configuration

## 🐛 Troubleshooting

For common issues and solutions:
- **Docker Issues**: [DOCKER_PRISMA_TROUBLESHOOTING.md](docs/DOCKER_PRISMA_TROUBLESHOOTING.md)
- **Setup Issues**: [TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md)
- **Database Issues**: [DATABASE_SETUP_GUIDE.md](apps/backend/DATABASE_SETUP_GUIDE.md)

## 📖 Team Resources

- **Learning Guide**: [LEARNING_GUIDE.md](docs/guides/LEARNING_GUIDE.md)
- **Team Onboarding**: [TEAM_ONBOARDING.md](docs/guides/TEAM_ONBOARDING.md)
- **Testing Guide**: [TESTING_GUIDE.md](docs/guides/TESTING_GUIDE.md)
