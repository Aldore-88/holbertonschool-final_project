# 🌸 Flora - Flowers & Plants Marketplace

**Team:** Anthony, Bevan, Xiaoling, and Lily | **Timeline:** 5-6 weeks | **Holberton Final Project**

**Built with ❤️ and lots of learning** 🌸

_Flora - Where every purchase blooms into joy_

Flora is a modern flowers and plants marketplace featuring flexible purchasing options including one-time purchases and subscription services. Built with React + TypeScript, Node.js/Express, Prisma, PostgreSQL, and Docker.

## 🎯 Project Features

### **Core Shopping Experience**
✅ **Product browsing** with search/filter \
✅ **Guest checkout** (no account required) \
✅ **User authentication** (Auth0) \
✅ **Calendar delivery date selection** (choose specific delivery dates) \
✅ **AI-powered gift messages** 🤖 (generate/enhance personalized messages by Gemini AI)

### **Purchase Options** (3 Types)
✅ **One-time purchase** - Single delivery \
✅ **Recurring subscription** - Regular deliveries (weekly/fortnightly/monthly) with savings \
✅ **Spontaneous subscription** - Surprise deliveries at random times within chosen frequency

### **User Account Features**
✅ **User Profile** - View account stats (orders, subscriptions, total spent) \
✅ **Order History** - Browse past orders with pagination \
✅ **Subscriptions Management** - Pause, resume, or cancel active subscriptions

### **Delivery & Payments**
✅ **Melbourne delivery zone validation** - Real-time postcode validation (100+ postcodes) \
✅ **Smart address validation** - Postcode + state cross-validation \
✅ **Flat-rate pricing** - $8.99 standard, $15.99 express delivery (AUD) \
✅ **Stripe payment processing** - Secure checkout with payment intents \
✅ **Order confirmations** - Email notifications for completed orders

### **Quality & Reliability**
✅ **Automated testing** - 64+ backend tests with CI/CD \
✅ **Graceful degradation** - System remains functional if validation APIs fail \
✅ **Type-safe** - Full TypeScript coverage (frontend + backend)

---

## 🚀 Quick Start Guide

### 📥 **Step 1: Get the Code**
```bash
git clone https://github.com/Aldore-88/holbertonschool-final_project.git
cd holbertonschool-final_project
```

### 🐳 **Step 2: First-Time Setup (Docker - Recommended)**
```bash
# Build containers and setup database (first time only)
pnpm docker:dev:build    # Build containers with dependencies
pnpm docker:setup        # Setup database (migrations + seeding)
```

### 🎯 **Step 3: Daily Development**
```bash
# Start development (every day)
pnpm docker:dev:bg       # Start in background
```
#### Frontend check:

1. Check frontend logs: `docker logs flora-frontend` or `pnpm docker:logs frontend --tail 10`
2. Open http://localhost:5173
3. Check browser console for errors (F12)
4. Test user interactions (clicking, typing)

#### Backend check:

1. Check backend logs:
`docker logs flora-backend --tail 10` or `pnpm docker:logs backend --tail 5`
1. Check http://localhost:3001/api/health
3. Use browser or Postman to test API endpoints

```bash
# Test subscription system
docker exec flora-backend pnpm test:subscriptions

# Test delivery endpoints
curl http://localhost:3001/api/delivery/info
```

4. Check all logs together: `pnpm docker:logs --tail 5` (add --tail 10 => to see 10 most recent logs)

#### Database Testing:

1. Check data with Prisma Studio: `npx prisma studio`
2. Verify API responses return correct data

---

## 🔄 **When Do I Need to Rebuild vs Restart?**

### **📦 Package.json Changes (Added/Updated Dependencies)**
```bash
# Need full rebuild when you add/update dependencies
pnpm docker:dev:build    # Rebuild containers with new dependencies
pnpm docker:dev:bg       # Start with new dependencies
```

### **💻 Code Changes (TypeScript, React, CSS)**
```bash
# Just restart - hot reload handles code changes
pnpm docker:dev:bg       # Start containers (code changes auto-reload)
```

### **🗃️ Database Schema Changes (Prisma schema.prisma)**
```bash
# When YOU made schema changes (e.g., added a new field)
docker exec -it flora-backend pnpm db:migrate   # Creates migration + applies it
# Then commit both schema.prisma and migration files

# When TEAMMATE made schema changes (you pulled their code)
pnpm docker:restart-backend    # Restart backend to reload code
pnpm docker:setup             # Apply migrations + reseed data
```

### **🌱 Want Fresh Test Data Only**
```bash
# No restart needed - just reseed
docker exec flora-backend pnpm db:seed    # Fresh sample data
```

---

## 📋 **Essential Commands Reference**

### **🚀 Development Commands**
```bash
# First time setup
pnpm docker:dev:build         # Build containers
pnpm docker:setup             # Setup database

# Daily development
pnpm docker:dev:bg            # Start in background
pnpm docker:logs              # View logs
pnpm docker:stop              # Stop all containers

# Individual service restarts
pnpm docker:restart-backend   # Restart backend only
pnpm docker:restart-frontend  # Restart frontend only
```
**Troubleshooting Commands**

```bash
# Check what's running
docker ps                                    # Show running containers

# View logs
docker logs flora-backend                    # Backend logs only
docker logs flora-frontend                   # Frontend logs only
pnpm docker:logs                             # All logs together
```


```bash
# Database updated
pnpm docker:seed          # Re-seed database with fresh sample data
pnpm db:reset             # Reset database (WARNING: deletes all data!)

# 🔧 Maintenance & Debugging
pnpm docker:stop          # Stop all containers
pnpm docker:build         # Rebuild containers without starting them
pnpm docker:clean         # Remove containers and volumes (fresh start, keep images)
pnpm docker:clean-project # Full cleanup: remove containers, images, and volumes
pnpm docker:dev:build     # Full rebuild

# 🎯 Production
pnpm docker:prod          # Run production build
```

---

## 🧪 **Testing & Quality Assurance**

### **Local Testing Commands**

Always test inside Docker containers to match the CI environment:

```bash
# 🔍 Run All Tests
docker exec flora-backend pnpm test                 # All tests with coverage

# 🎯 Run Specific Test Suites
docker exec flora-backend pnpm test:auth            # Authentication & JWT tests
docker exec flora-backend pnpm test:order           # Order creation & processing tests
docker exec flora-backend pnpm test:payment         # Stripe payment & refund tests
docker exec flora-backend pnpm test:email           # Email service & templates tests
docker exec flora-backend pnpm test:integration     # Full end-to-end integration tests

# 🔄 Development Testing
docker exec flora-backend pnpm test:watch           # Auto-rerun tests on file changes
docker exec flora-backend pnpm test:coverage        # Generate detailed coverage reports

# 🛠️ Manual Testing Tools
docker exec flora-backend pnpm test:live-email      # Send real test emails
docker exec flora-backend pnpm get-token            # Get Auth0 JWT for API testing
```

### **Test Command Breakdown**

| Command | What It Does | When To Use |
|---------|--------------|-------------|
| `jest` | Runs all `.test.ts` files using Jest test runner | Standard test execution |
| `jest --watch` | Continuously runs tests when files change | Active development |
| `jest --coverage` | Generates HTML/text coverage reports | Quality checks before commits |
| `jest --testPathPatterns=auth` | Only runs tests with "auth" in the filename | Testing specific features |
| `tsx src/test/script.ts` | Runs TypeScript files directly | Utility scripts & manual testing |

### **Understanding Test Output**

```bash
# ✅ Success Example
PASS src/test/auth.test.ts (12.5s)
  ✓ should authenticate valid user (145ms)
  ✓ should reject invalid token (89ms)

# ❌ Failure Example
FAIL src/test/payment.test.ts
  ✗ should process payment (234ms)
    Error: Stripe API connection failed

# 📊 Coverage Summary
Coverage: 85.2% of statements
         83.1% of branches
         91.7% of functions
         85.2% of lines
```

---

## 🚀 **CI/CD Pipeline**

### **Automated Testing**

**Triggers:** Every push to any team branch + all pull requests to `main`

**Supported Branches:**
- `main` (production)
- `li-dev` (integration)
- `anth-branch`, `bevan-branch`, `xiaoling` (team member branches)

**Current CI Configuration (Simplified for Development):**

1. **🧪 Backend Tests** ✅ ACTIVE
   - All Jest test suites (64/64 passing)
   - Code coverage reporting
   - PostgreSQL database tests
   - Delivery endpoint validation

2. **🎨 Frontend Tests** ⏸️ DISABLED (Runs locally only)
   - Reason: CI environment setup issues
   - Local verification: `docker exec flora-frontend pnpm build`
   - Re-enable after graduation: See `.github/workflows/test.yml`

3. **🔍 Type Checking** ⏸️ DISABLED (Runs locally only)
   - Reason: Warnings allowed in development
   - Local verification: `docker exec flora-frontend pnpm type-check`
   - Re-enable after graduation: See `.github/workflows/test.yml`

> **Note for Team:** All tests pass locally! CI is simplified to backend tests only.
> Before pushing, always run the **Pre-Commit Checklist** below to ensure quality.

### **GitHub Actions Workflow Files**

```bash
.github/workflows/test.yml       # Main CI/CD testing pipeline
.github/workflows/security.yml   # Weekly security & dependency audits
```

### **CI/CD Best Practices We Follow**

- ✅ **Branch Protection:** All tests must pass before merging
- ✅ **Parallel Execution:** 3 concurrent jobs for fast feedback
- ✅ **Real Database:** PostgreSQL in CI matches production environment
- ✅ **Code Coverage:** Tracks test coverage trends over time
- ✅ **Security Scanning:** Automated dependency vulnerability checks
- ✅ **Type Safety:** Compilation errors fail the build

### **Monitoring CI/CD Status**

```bash
# 📊 Check GitHub Actions Status
# Go to: https://github.com/your-repo/actions

# 🔍 View CI Logs Locally
git push origin your-branch
# Then visit GitHub Actions tab to see real-time results
```

### **Before You Push - Pre-Commit Checklist** ✅

**Run these commands locally to ensure CI/CD will pass:**

```bash
# 1️⃣ Run all backend tests (must pass)
docker exec flora-backend pnpm test

# 2️⃣ Run frontend type-check (warnings OK, but script must exist)
docker exec flora-frontend pnpm type-check || echo "Type warnings are OK"

# 3️⃣ Build frontend to catch critical errors
docker exec flora-frontend pnpm build
```

**Quick verification:**
- ✅ All backend tests pass (80/80 tests)
- ✅ Frontend type-check runs (warnings allowed)
- ✅ Frontend builds successfully
- ✅ Docker containers running: `docker ps`

### **Troubleshooting Failed CI/CD**

**Common Issues & Solutions:**

| Error | Cause | Solution |
|-------|-------|----------|
| `Tests failed` | Broken functionality | Run `docker exec flora-backend pnpm test` locally |
| `Build failed` | TypeScript errors | Run `docker exec flora-backend pnpm build` locally |
| `Lint failed` | Code style issues | Run `docker exec flora-frontend pnpm lint --fix` |
| `type-check script not found` | Missing script in package.json | Rebuild: `pnpm docker:dev:build` |

**Development Workflow:**
1. 🔧 Make changes locally
2. 🧪 Run pre-push checklist (see above)
3. 📤 Push to your branch
4. 👀 Monitor GitHub Actions results
5. 🔄 Fix any failures and repeat

---

## 🗃️ **Database & Prisma Workflow**

### **Understanding Prisma Commands**

| Command | What It Does | Creates Migration Files? | When To Use |
|---------|--------------|-------------------------|-------------|
| `db:migrate` | Creates migration file + applies it | ✅ YES | When YOU change schema.prisma |
| `db:push` | Directly updates DB schema | ❌ NO | ⚠️ NEVER in team projects! |
| `db:seed` | Fills database with sample data | N/A | After migrations or when you need test data |
| `docker:setup` | Runs migrations + seed | N/A | After pulling teammate's schema changes |

### **The Proper Prisma Workflow**

#### **Scenario 1: YOU Make Schema Changes**

```bash
# 1. Edit schema.prisma (add field, change type, etc.)
# Example: Add "stock" field to Product model

# 2. Create migration (Docker environment)
docker exec -it flora-backend pnpm db:migrate
# This will:
#   - Prompt for migration name (e.g., "add_stock_field")
#   - Create migration file in prisma/migrations/
#   - Apply migration to your local database
#   - Update Prisma Client

# 3. Commit BOTH files to git
git add apps/backend/prisma/schema.prisma
git add apps/backend/prisma/migrations/
git commit -m "feat: add stock tracking to products"
git push
```

#### **Scenario 2: TEAMMATE Made Schema Changes (You Pull Their Code)**

```bash
# 1. Pull latest code
git pull

# 2. Restart backend to reload code
pnpm docker:restart-backend

# 3. Apply migrations + reseed
pnpm docker:setup
# This runs: prisma migrate deploy && prisma db seed
#   - migrate deploy: Applies new migration files
#   - db seed: Refreshes sample data
```

#### **Scenario 3: Running Locally (Without Docker)**

```bash
# YOU make changes:
pnpm --filter backend db:migrate    # Create + apply migration
git add apps/backend/prisma/
git commit -m "feat: update schema"

# TEAMMATE pulls changes:
pnpm --filter backend db:migrate    # Apply new migrations
pnpm --filter backend db:seed       # (Optional) Refresh test data
```

### **Common Prisma Scenarios**

**Q: I added a new field to schema.prisma, what do I do?**
```bash
# Docker:
docker exec -it flora-backend pnpm db:migrate

# Local:
pnpm --filter backend db:migrate

# Then commit migration files!
```

**Q: My teammate added a field, I pulled their code, now what?**
```bash
# Docker (recommended):
pnpm docker:restart-backend
pnpm docker:setup

# Local:
pnpm --filter backend db:migrate
```

**Q: When do I need to run db:seed?**
```bash
# Only when you want to refresh test data:
# - After migration (to get sample products)
# - When database is empty
# - When testing features

# Docker:
pnpm docker:seed

# Local:
pnpm --filter backend db:seed
```

**Q: What's wrong with db:push?**
```bash
# ❌ db:push = No migration files (teammates won't get your changes!)
# ✅ db:migrate = Creates migration files (proper team workflow)

# Rule: NEVER use db:push in team projects
```

### **Migration Best Practices**

✅ **DO:**
- Use `db:migrate` for all schema changes
- Commit migration files with schema.prisma
- Run `docker:setup` after pulling teammate's schema changes
- Keep UPSERT pattern in seed.ts (works on fresh + existing databases)

❌ **DON'T:**
- Use `db:push` in team projects (skips migration files!)
- Forget to commit migration files
- Manually edit migration files (let Prisma generate them)
- Assume teammates' databases auto-update (they need to run migrations)

---

## 🛠️ **Tech Stack**

### **Frontend**
- ⚛️ **React 19** with TypeScript
- ⚡ **Vite** for fast development
- 🔐 **Auth0** for authentication
- 🎨 **Custom CSS** styling

### **Backend**
- 🟢 **Node.js + Express** with TypeScript
- 🗃️ **Prisma ORM** with PostgreSQL
- 🔐 **Auth0** JWT authentication
- 📧 **Email service** integration
- 💳 **Stripe** payment processing

### **Development**
- 📦 **pnpm** workspaces (monorepo)
- 🐳 **Docker** containerization
- 🧪 **Automated testing** with CI/CD
- 🇦🇺 **Melbourne delivery** system

---

## 📁 **Project Structure**

```
holbertonschool-final_project/
├── apps/
│   ├── frontend/              # React TypeScript app
│   │   ├── src/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── pages/         # Page components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   └── services/      # API communication
│   │   └── package.json
│   └── backend/               # Node.js Express API
│       ├── src/
│       │   ├── controllers/   # HTTP request handlers
│       │   ├── services/      # Business logic
│       │   ├── routes/        # API endpoints
│       │   ├── middleware/    # Auth, validation, etc.
│       │   └── config/        # Database, auth config
│       ├── prisma/
│       │   ├── schema.prisma  # Database schema
│       │   └── seed.ts        # Test data
│       └── package.json
├── docs/                      # Documentation
│   ├── TESTING_GUIDE.md       # Comprehensive testing guide
│   └── SUBSCRIPTIONS.md       # Subscription system docs
├── .github/workflows/         # CI/CD automation
└── docker-compose*.yml       # Docker configuration
```

---

## 🚨 **Common Issues & Solutions**

### **Problem: "Module not found" errors**
```bash
# Solution: Rebuild containers with fresh dependencies
pnpm docker:dev:build
```

### **Problem: Database connection errors**
```bash
# Solution: Restart backend and setup database
pnpm docker:restart-backend
pnpm docker:setup
```

### **Problem: Old data showing up**
```bash
# Solution: Refresh test data (no restart needed)
docker exec flora-backend pnpm db:seed
```

### **Problem: "No products found" in tests**
```bash
# Solution: Make sure database is seeded
docker exec flora-backend pnpm db:seed
```

### **Problem: Everything is broken**
```bash
# Nuclear option: Clean and rebuild everything
pnpm docker:clean-project
pnpm docker:dev:build
pnpm docker:setup
```

---

## 🎯 **Demo Day Ready Features**

### **Shopping & Checkout**
- ✅ **3 purchase types** (one-time, recurring subscription, spontaneous subscription)
- ✅ **Calendar date picker** (select delivery dates 1-90 days ahead)
- ✅ **Smart validation** (Melbourne postcodes 3000-3199 with state verification)
- ✅ **AUD pricing** ($8.99 standard, $15.99 express delivery)
- ✅ **Stripe payments** (secure payment intent flow)

### **User Experience**
- ✅ **Auth0 authentication** (email/password + Google login)
- ✅ **User Profile page** (stats: orders, subscriptions, total spent)
- ✅ **Order History** (paginated list of past orders)
- ✅ **Subscription management** (pause, resume, cancel active subscriptions)
- ✅ **Email confirmations** (automated order confirmation emails)

### **Technical Excellence**
- ✅ **64 automated tests** (Jest + integration tests passing)
- ✅ **CI/CD pipeline** (GitHub Actions with backend tests)
- ✅ **Melbourne delivery zones** (100+ postcode validation)
- ✅ **Real order integration** (subscriptions create actual orders)
- ✅ **Graceful error handling** (validates but degrades gracefully if APIs fail)

---

## 👥 **Team**

Created by the Holberton team:
- **Anthony**
- **Bevan**
- **Xiaoling**
- **Lily**

## 📄 **License**

MIT License - feel free to use this project for learning and demonstration purposes.
