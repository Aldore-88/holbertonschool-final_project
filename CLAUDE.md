# Flora - Flowers & Plants Marketplace

**Team:** Anthony, Bevan, Xiaoling, and Lily | **Timeline:** 5-6 weeks | **Holberton Final Project**

Flora is a modern flowers and plants marketplace featuring flexible purchasing options including one-time purchases and subscription services. Built with React + TypeScript, Node.js/Express, Prisma, PostgreSQL, and Docker.

## Project Structure

This is a **monorepo** using **pnpm workspaces**:

```
holbertonschool-final_project/
├── apps/
│   ├── frontend/          # React + TypeScript + Vite
│   └── backend/           # Node.js + Express + TypeScript + Prisma
├── docker-compose*.yml    # Docker configurations
├── package.json           # Root workspace config
└── pnpm-workspace.yaml    # pnpm workspace config
```

## Tech Stack

### Frontend (`apps/frontend/`)
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Auth0** for authentication
- Custom CSS styling
- Key features: Product browsing, search/filter, checkout, subscriptions

### Backend (`apps/backend/`)
- **Node.js + Express** with TypeScript
- **Prisma ORM** with PostgreSQL
- **Auth0** for authentication
- RESTful API with comprehensive endpoints
- Email service integration
- Payment processing (Stripe planned)

## Development Commands

### Docker Development (Recommended)
```bash
# Initial setup
pnpm docker:dev:build     # Build containers
pnpm docker:setup         # Setup database (migrations + seeding)

# Daily development
pnpm docker:dev:bg        # Run in background
pnpm docker:logs          # View logs

# Database operations
pnpm docker:seed          # Refresh sample data
pnpm docker:restart-backend  # Restart after schema changes
```

### Local Development
```bash
pnpm dev                  # Start both frontend + backend locally
pnpm build               # Build both apps
pnpm db:setup            # Setup database
pnpm db:seed             # Seed with sample data
```

## Key Features

### Implemented ✅
- Product browsing with search/filter
- Product detail modals
- Guest checkout (one-time purchases)
- User authentication (Auth0)
- Subscription system (recurring deliveries)
- Order processing & email confirmations

### Planned 📋
- Delivery management system with zone-based pricing
- Order tracking
- Product bundles
- Advanced UI/UX polish

## Database Schema

Key entities managed by Prisma:
- **Users**: Customer accounts and authentication
- **Products**: Flowers, plants, and bundles
- **Orders**: Purchase transactions
- **Subscriptions**: Recurring delivery schedules
- **Delivery System**: Zones, methods, tracking (designed but not implemented)

## Current Development Status

- **Branch**: li-dev (current working branch)
- **Main Branch**: main (for PRs)
- **Auth**: ✅ **Auth0 fully configured and working**
  - Audience configuration fixed (`https://flora-api.com`)
  - JWT validation working for protected routes
  - Frontend/backend token flow verified
- **Payment**: Basic structure in place, Stripe integration pending

## Environment Setup

```bash
# Backend (.env)
DATABASE_URL="postgresql://flora_user:YOUR_DB_PASSWORD@localhost:5432/flora_db"  # ⚠️ NEVER COMMIT PASSWORD
AUTH0_DOMAIN="dev-ijvur34mojpovh8e.us.auth0.com"  # ✅ Safe to document
AUTH0_CLIENT_ID="tegmEuc40IvXfYFDLIRnJmbsa1izkTVL"  # ✅ Safe to document (public)
AUTH0_CLIENT_SECRET="YOUR_CLIENT_SECRET"  # ⚠️ NEVER COMMIT THIS SECRET
AUTH0_AUDIENCE="https://flora-api.com"  # ⚠️ CRITICAL: Must match frontend
STRIPE_SECRET_KEY="YOUR_STRIPE_SECRET"  # ⚠️ NEVER COMMIT THIS SECRET

# Frontend (.env)
VITE_API_URL="http://localhost:3001/api"
VITE_AUTH0_DOMAIN="dev-ijvur34mojpovh8e.us.auth0.com"  # ✅ Safe to document
VITE_AUTH0_CLIENT_ID="tegmEuc40IvXfYFDLIRnJmbsa1izkTVL"  # ✅ Safe to document (public)
VITE_AUTH0_AUDIENCE="https://flora-api.com"  # ⚠️ CRITICAL: Must match backend
```

### Auth0 Dashboard Configuration
- **API Identifier**: `https://flora-api.com`
- **Signing Algorithm**: RS256
- **Allow Offline Access**: Enabled (for refresh tokens)

## Testing

### Frontend Testing
- **Frontend**: http://localhost:5173
- **Subscriptions Page**: http://localhost:5173/subscriptions (requires login)
- **Database**: Use `npx prisma studio` for GUI

### Backend API Testing

**Public Endpoints (No Auth Required):**
```bash
# API Documentation & Health
curl http://localhost:3001/
curl http://localhost:3001/api/health

# Public test routes
curl http://localhost:3001/api/auth-test/public
curl http://localhost:3001/api/auth-test/optional
```

**Protected Endpoints (Require JWT Token):**
```bash
# Get fresh token: Login at frontend → Check browser console → Copy token

# Auth test routes
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/auth-test/protected
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/auth-test/verify-token

# Business endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/subscriptions
```

**Expected Responses:**
- **Protected routes with valid token**: `{"success": true, "data": [...]}`
- **Protected routes without token**: `{"error": "Missing or invalid authorization header"}`
- **Protected routes with expired token**: `{"error": "Invalid token"}`

## Architecture Patterns

- **Frontend**: Component-based with React hooks, Context API for state
- **Backend**: MVC pattern with controllers, services, and middleware
- **Database**: Prisma schema-first approach with migrations
- **Authentication**: JWT tokens via Auth0

## Team Development Notes

- Use Docker for consistent development environment
- Follow existing code conventions and patterns
- Test changes with both Docker logs and browser dev tools
- All major features should include proper TypeScript types
- Database changes require backend restart: `pnpm docker:restart-backend`
