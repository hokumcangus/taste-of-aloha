# Multi-stage Dockerfile for backend
# Stage 1: Development - includes dev tools and hot reload
FROM node:20-alpine AS development

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for nodemon)
RUN npm install

# Copy application source code
COPY . .


RUN npm install prisma
RUN npm install @prisma/client
RUN npm install dotenv
RUN npm install nodemon

# Generate Prisma client
RUN npx prisma generate

# Expose backend port
EXPOSE 3000

# Use nodemon for hot reload in development
CMD ["npm", "run", "dev"]

# Stage 2: Production - optimized runtime
FROM node:20-alpine AS production

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

ENV NODE_ENV=production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Install Prisma CLI so prisma generate works
RUN npm install prisma

# Copy application source code
COPY . .

# Copy prisma schema explicitly
COPY prisma ./prisma

# DATABASE_URL is provided at runtime via environment (docker compose)

RUN npm install prisma
RUN npm install @prisma/client

# Generate Prisma client
RUN npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["npm", "start"]