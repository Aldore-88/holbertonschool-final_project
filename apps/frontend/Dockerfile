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

# Accept build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ARG VITE_STRIPE_PUBLISHABLE_KEY

# Set them as environment variables for the build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
ENV VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# Build production bundle (compile TypeScript + Vite build)
# Now Vite will have access to the environment variables!
RUN pnpm run build

# Expose port
EXPOSE 5173

# Start command - serve production build with serve package
CMD ["serve", "-s", "dist", "-l", "5173", "--no-clipboard", "--single"]
