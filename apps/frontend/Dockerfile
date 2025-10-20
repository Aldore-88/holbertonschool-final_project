# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy only frontend app (not backend to avoid Prisma issues)
COPY apps/frontend ./apps/frontend

# Install dependencies
RUN pnpm install --filter frontend

# Set working directory to frontend
WORKDIR /app/apps/frontend

# Install serve package globally for production serving
RUN npm install -g serve

# Build production bundle (compile TypeScript + Vite build)
RUN pnpm run build

# Expose port
EXPOSE 5173

# Start command - serve production build with serve package
CMD ["serve", "-s", "dist", "-l", "5173"]