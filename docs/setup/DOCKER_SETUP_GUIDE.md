# Docker Setup Implementation Guide

Follow these steps in order to set up Docker for your Taste of Aloha application.

---

## Step 1: Create Backend Dockerfile

**File:** `apps/backend/Dockerfile`

Create this file with the following content:

```dockerfile
# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start with nodemon for hot reload
CMD ["npm", "run", "dev"]

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
```

---

## Step 2: Create Frontend Dockerfile

**File:** `apps/web/Dockerfile`

Create this file with the following content:

```dockerfile
# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

---

## Step 3: Create Nginx Configuration

**File:** `apps/web/nginx.conf`

Create this file with the following content:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (if needed)
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Step 4: Create .dockerignore Files

### Backend .dockerignore
**File:** `apps/backend/.dockerignore`

```
node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
.DS_Store
*.log
coverage
.vscode
.idea
```

### Frontend .dockerignore
**File:** `apps/web/.dockerignore`

```
node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
.DS_Store
*.log
coverage
.vscode
.idea
dist
build
```

### Root .dockerignore
**File:** `.dockerignore`

```
node_modules
.git
.gitignore
*.md
.DS_Store
.env
.env.local
```

---

## Step 5: Create Docker Compose for Development

**File:** `docker-compose.yml` (in root directory)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: taste-of-aloha-db
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-taste_of_aloha}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
      target: development
    container_name: taste-of-aloha-backend
    environment:
      NODE_ENV: development
      PORT: 3000
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-postgres}@postgres:5432/${DB_NAME:-taste_of_aloha}
    ports:
      - "3000:3000"
    volumes:
      - ./apps/backend:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  frontend:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
      target: development
    container_name: taste-of-aloha-frontend
    environment:
      VITE_API_URL: http://localhost:3000
    ports:
      - "5173:5173"
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

---

## Step 6: Create Docker Compose for Production

**File:** `docker-compose.prod.yml` (in root directory)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: taste-of-aloha-db-prod
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-taste_of_aloha}
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network
    restart: always

  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
      target: production
    container_name: taste-of-aloha-backend-prod
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-postgres}@postgres:5432/${DB_NAME:-taste_of_aloha}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - app-network
    restart: always
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
      target: production
    container_name: taste-of-aloha-frontend-prod
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network
    restart: always

volumes:
  postgres_data_prod:

networks:
  app-network:
    driver: bridge
```

---

## Step 7: Create Environment Example Files

### Root .env.example
**File:** `.env.example` (in root directory)

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=taste_of_aloha

# Backend Configuration
NODE_ENV=development
PORT=3000

# Frontend Configuration
VITE_API_URL=http://localhost:3000
```

### Backend .env.example
**File:** `apps/backend/.env.example`

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/taste_of_aloha

# JWT Configuration (if using)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

### Frontend .env.example
**File:** `apps/web/.env.example`

```env
# API Configuration
VITE_API_URL=http://localhost:3000
```

---

## Step 8: Update .gitignore

**File:** `.gitignore`

Add these lines if they're not already there:

```
# Environment variables
.env
.env.local
.env.*.local

# Docker
*.log
```

---

## Step 9: Create Docker Helper Scripts (Optional)

### Development Start Script
**File:** `docker-dev.sh` (or `docker-dev.bat` for Windows)

**For Linux/Mac:**
```bash
#!/bin/bash
docker-compose up --build
```

**For Windows (docker-dev.bat):**
```batch
@echo off
docker-compose up --build
```

### Production Start Script
**File:** `docker-prod.sh` (or `docker-prod.bat` for Windows)

**For Linux/Mac:**
```bash
#!/bin/bash
docker-compose -f docker-compose.prod.yml up -d --build
```

**For Windows (docker-prod.bat):**
```batch
@echo off
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Step 10: Usage Instructions

### Development Mode

1. **Create .env file** (copy from .env.example):
   ```bash
   cp .env.example .env
   ```

2. **Start all services:**
   ```bash
   docker-compose up
   ```
   
   Or with rebuild:
   ```bash
   docker-compose up --build
   ```

3. **Access your application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - PostgreSQL: localhost:5432

4. **Stop services:**
   ```bash
   docker-compose down
   ```

5. **View logs:**
   ```bash
   docker-compose logs -f
   ```

### Production Mode

1. **Create .env file** with production values:
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Build and start:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. **Access your application:**
   - Frontend: http://localhost (port 80)
   - Backend API: http://localhost:3000 (internal, or expose if needed)

4. **Stop services:**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

---

## Troubleshooting

### Port Already in Use
If ports 3000, 5173, or 5432 are already in use:
- Change ports in `docker-compose.yml`
- Or stop the service using the port

### Database Connection Issues
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check DATABASE_URL in .env file
- Verify network connectivity: containers must be on same network

### Hot Reload Not Working
- Ensure volumes are mounted correctly in docker-compose.yml
- Check file permissions
- Restart containers: `docker-compose restart`

### Build Failures
- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache`

---

## Next Steps

1. Create all the files listed above
2. Copy `.env.example` to `.env` and update with your values
3. Run `docker-compose up` to start development environment
4. Test your application
5. For production, use `docker-compose -f docker-compose.prod.yml up -d`

---

## File Checklist

- [ ] `apps/backend/Dockerfile`
- [ ] `apps/web/Dockerfile`
- [ ] `apps/web/nginx.conf`
- [ ] `apps/backend/.dockerignore`
- [ ] `apps/web/.dockerignore`
- [ ] `.dockerignore` (root)
- [ ] `docker-compose.yml` (root)
- [ ] `docker-compose.prod.yml` (root)
- [ ] `.env.example` (root)
- [ ] `apps/backend/.env.example`
- [ ] `apps/web/.env.example`
- [ ] Update `.gitignore`

Good luck with your Docker setup! 🐳

