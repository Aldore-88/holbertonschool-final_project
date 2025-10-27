# 🛠️ Flora Development Guide

Complete guide for daily development workflow, Docker operations, and troubleshooting.

---

## 🎯 Daily Development Workflow

### Quick Start (Every Day)

```bash
# Start development environment in background
pnpm docker:dev:bg

# View logs (all services)
pnpm docker:logs

# View specific service logs
docker logs flora-frontend --tail 20
docker logs flora-backend --tail 20

# Stop services when done
pnpm docker:stop
```

### Checking Services

#### **Frontend Check**
1. Check logs: `docker logs flora-frontend --tail 10`
2. Open http://localhost:5173
3. Check browser console for errors (F12)
4. Test user interactions (clicking, typing)

#### **Backend Check**
1. Check logs: `docker logs flora-backend --tail 10`
2. Health endpoint: http://localhost:3001/api/health
3. Test API endpoints with browser/Postman/curl

```bash
# Test subscription system
docker exec flora-backend pnpm test:subscriptions

# Test delivery endpoints
curl http://localhost:3001/api/delivery/info
```

#### **Database Check**
1. Open Prisma Studio: `npx prisma studio`
2. Verify API responses return correct data
3. Check for test data: `docker exec flora-backend pnpm db:seed`

---

## 🔄 When to Rebuild vs Restart

### 📦 **Package.json Changes (Dependencies Added/Updated)**

```bash
# Need full rebuild when dependencies change
pnpm docker:dev:build    # Rebuild containers with new dependencies
pnpm docker:dev:bg       # Start with new dependencies
```

**When to use:**
- After `pnpm install` or `pnpm add <package>`
- After pulling code with updated `package.json`
- When you see "Module not found" errors

---

### 💻 **Code Changes (TypeScript, React, CSS)**

```bash
# Just restart - hot reload handles code changes automatically
pnpm docker:dev:bg       # Start containers (code auto-reloads)
```

**When to use:**
- Normal development (editing `.ts`, `.tsx`, `.css` files)
- Hot module replacement (HMR) handles updates automatically
- No rebuild needed!

---

### 🗃️ **Database Schema Changes (Prisma schema.prisma)**

#### **Scenario 1: YOU Made Schema Changes**

```bash
# 1. Edit schema.prisma (add field, change type, etc.)

# 2. Create migration in Docker
docker exec -it flora-backend pnpm db:migrate
# - Prompts for migration name (e.g., "add_stock_field")
# - Creates migration file in prisma/migrations/
# - Applies migration to your local database
# - Updates Prisma Client

# 3. Commit BOTH files to git
git add apps/backend/prisma/schema.prisma
git add apps/backend/prisma/migrations/
git commit -m "feat: add stock tracking to products"
git push
```

#### **Scenario 2: TEAMMATE Made Schema Changes (You Pull Code)**

```bash
# 1. Pull latest code
git pull

# 2. Restart backend to reload code
pnpm docker:restart-backend

# 3. Apply migrations + reseed
pnpm docker:setup
# This runs:
#   - prisma migrate deploy (applies new migration files)
#   - prisma db seed (refreshes sample data)
```

---

### 🌱 **Want Fresh Test Data Only**

```bash
# No restart needed - just reseed
docker exec flora-backend pnpm db:seed    # Fresh sample data
```

**When to use:**
- After testing with modified data
- When database feels "messy"
- Before demo or testing

---

## 📋 Essential Docker Commands

### 🚀 **First-Time Setup**

```bash
pnpm docker:dev:build         # Build containers with dependencies
pnpm docker:setup             # Setup database (migrations + seeding)
```

### 🏃 **Daily Development**

```bash
pnpm docker:dev:bg            # Start in background (recommended)
pnpm docker:dev               # Start in foreground (see live logs)
pnpm docker:logs              # View logs from all services
pnpm docker:logs --tail 10    # View last 10 lines from each service
pnpm docker:stop              # Stop all containers
```

### 🔄 **Individual Service Restarts**

```bash
pnpm docker:restart-backend   # Restart backend only
pnpm docker:restart-frontend  # Restart frontend only
```

**When to use:**
- Backend restart: After schema changes, env var changes
- Frontend restart: After vite config changes, env var changes

### 🧹 **Maintenance & Cleanup**

```bash
# Standard cleanup (keeps images)
pnpm docker:clean             # Remove containers and volumes

# Full cleanup (removes everything)
pnpm docker:clean-project     # Remove containers, images, and volumes

# Rebuild from scratch
pnpm docker:dev:build         # Full rebuild with latest code
```

### 🎯 **Production Build**

```bash
pnpm docker:prod              # Run production build locally
```

---

## 🐳 Docker Command Reference

### **Container Status**

```bash
# Check running containers
docker ps

# Check all containers (including stopped)
docker ps -a

# Check container resource usage
docker stats
```

### **Logs & Debugging**

```bash
# View logs
docker logs flora-backend              # Backend logs
docker logs flora-frontend             # Frontend logs
docker logs flora-backend --tail 20    # Last 20 lines
docker logs flora-backend --follow     # Live tail (Ctrl+C to exit)

# All logs together
pnpm docker:logs                       # All services
pnpm docker:logs --tail 5              # Last 5 lines from each
```

### **Execute Commands in Containers**

```bash
# Backend commands
docker exec flora-backend pnpm test              # Run tests
docker exec flora-backend pnpm db:seed           # Seed database
docker exec -it flora-backend sh                 # Interactive shell

# Frontend commands
docker exec flora-frontend pnpm build            # Build frontend
docker exec flora-frontend pnpm type-check       # TypeScript check
```

---

## 🚨 Troubleshooting Guide

### **Problem: "Module not found" errors**

**Cause:** Dependencies not installed or outdated

**Solution:**
```bash
pnpm docker:dev:build    # Rebuild with fresh dependencies
pnpm docker:dev:bg       # Start services
```

---

### **Problem: Database connection errors**

**Cause:** Database container not running or misconfigured

**Solution:**
```bash
# Check if containers are running
docker ps

# Restart backend and setup database
pnpm docker:restart-backend
pnpm docker:setup
```

---

### **Problem: Old data showing up**

**Cause:** Stale database data from previous tests

**Solution:**
```bash
# Refresh test data (no restart needed)
docker exec flora-backend pnpm db:seed
```

---

### **Problem: "No products found" in tests**

**Cause:** Database not seeded

**Solution:**
```bash
docker exec flora-backend pnpm db:seed
```

---

### **Problem: Port already in use**

**Cause:** Previous containers still running or another service using ports

**Solution:**
```bash
# Stop all Flora containers
pnpm docker:stop

# Check what's using the ports
lsof -i :5173  # Frontend port
lsof -i :3001  # Backend port
lsof -i :5432  # PostgreSQL port

# Kill process if needed
kill -9 <PID>
```

---

### **Problem: Docker containers won't start**

**Cause:** Various issues (port conflicts, corrupted volumes, etc.)

**Solution (Nuclear Option):**
```bash
# Stop everything
pnpm docker:stop

# Clean all project containers and volumes
pnpm docker:clean-project

# Rebuild from scratch
pnpm docker:dev:build
pnpm docker:setup
pnpm docker:dev:bg
```

---

### **Problem: Hot reload not working**

**Cause:** File watching issues in Docker

**Solution:**
```bash
# Restart the affected service
pnpm docker:restart-frontend  # For frontend changes
pnpm docker:restart-backend   # For backend changes

# If still not working, full restart
pnpm docker:stop
pnpm docker:dev:bg
```

---

### **Problem: Tests failing locally but CI passes (or vice versa)**

**Cause:** Environment differences or stale data

**Solution:**
```bash
# Ensure clean database state
docker exec flora-backend pnpm db:seed

# Run tests exactly like CI does
docker exec flora-backend pnpm test

# Check environment variables match CI
docker exec flora-backend env | grep -E 'DATABASE_URL|AUTH0|STRIPE'
```

---

## 💡 Development Tips

### **Faster Feedback Loop**

```bash
# Terminal 1: Keep logs running
pnpm docker:logs --follow

# Terminal 2: Work on code
# Changes auto-reload via HMR

# Terminal 3: Run tests on demand
docker exec flora-backend pnpm test:watch
```

### **Quick Testing Workflow**

```bash
# 1. Start services
pnpm docker:dev:bg

# 2. Make code changes
# (HMR reloads automatically)

# 3. Test manually in browser
open http://localhost:5173

# 4. Run automated tests
docker exec flora-backend pnpm test

# 5. Check logs for errors
docker logs flora-backend --tail 20
```

### **Database Exploration**

```bash
# GUI for database
npx prisma studio

# Command-line queries
docker exec -it flora-db psql -U flora_user -d flora_db

# Example queries:
# \dt                    # List tables
# SELECT * FROM "User";  # Query users
# \q                     # Quit
```

### **API Testing**

```bash
# Get Auth0 token for testing
docker exec flora-backend pnpm get-token

# Test protected endpoints
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3001/api/subscriptions

# Test public endpoints
curl http://localhost:3001/api/delivery/info
curl http://localhost:3001/api/health
```

---

## 🔧 Advanced Operations

### **View Container Resource Usage**

```bash
docker stats

# Shows CPU, memory, network I/O for all containers
# Useful for debugging performance issues
```

### **Inspect Container Configuration**

```bash
docker inspect flora-backend
docker inspect flora-frontend
docker inspect flora-db
```

### **Access Container Shell**

```bash
# Backend shell
docker exec -it flora-backend sh

# Frontend shell
docker exec -it flora-frontend sh

# Database shell
docker exec -it flora-db psql -U flora_user -d flora_db
```

### **Copy Files Between Host and Container**

```bash
# Copy from container to host
docker cp flora-backend:/app/logs ./local-logs

# Copy from host to container
docker cp ./local-file.txt flora-backend:/app/file.txt
```

---

## 🎯 Pre-Commit Checklist

Before pushing code to GitHub, run these commands:

```bash
# ✅ 1. Run all backend tests (MUST PASS)
docker exec flora-backend pnpm test --silent

# ✅ 2. Type-check frontend (warnings OK)
docker exec flora-frontend pnpm type-check || echo "Type warnings are OK"

# ✅ 3. Build frontend in STRICT mode (production-ready)
docker exec flora-frontend sh -c "CI=true pnpm build:prod"

# ✅ 4. Verify containers running
docker ps
```

**Expected results:**
- ✅ All backend tests pass (80 tests)
- ✅ Frontend type-check runs (warnings allowed)
- ✅ Frontend builds with NO warnings/errors (strict mode)
- ✅ All containers running

**Why strict build?**
- Catches deployment issues before pushing
- Ensures code will deploy successfully on Render/AWS
- Prevents failed deployments due to unused variables/imports
- See [Testing Guide](TESTING_GUIDE.md#-understanding-build-commands) for details

---

## 📚 Additional Resources

- **[README.md](../README.md)** - Project overview and quick start
- **[Database Guide](DATABASE.md)** - Prisma migrations and schema management
- **[Testing Guide](TESTING_GUIDE.md)** - Comprehensive testing documentation
- **[Subscriptions Docs](SUBSCRIPTIONS.md)** - Subscription system architecture

---

**Need help?** Check the troubleshooting section above or ask your team members! 🌸
