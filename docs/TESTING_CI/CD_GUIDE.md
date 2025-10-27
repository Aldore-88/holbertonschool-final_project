# 🧪 Flora Testing Guide

Complete guide for running tests, understanding the test suite, and working with CI/CD.

---

## 🎯 Quick Start

```bash
# Run all tests
docker exec flora-backend pnpm test

# Run specific test suites
docker exec flora-backend pnpm test:auth        # Authentication tests
docker exec flora-backend pnpm test:order       # Order processing tests
docker exec flora-backend pnpm test:payment     # Payment & Stripe tests
docker exec flora-backend pnpm test:email       # Email service tests
docker exec flora-backend pnpm test:ai          # AI integration tests
docker exec flora-backend pnpm test:integration # Full integration tests

# Run tests in watch mode (auto-rerun on file changes)
docker exec flora-backend pnpm test:watch

# Generate coverage report
docker exec flora-backend pnpm test:coverage
```

---

## 📋 Test Suite Overview

Our backend has **6 automated test files** covering all core functionality:

| Test File | Purpose | What It Tests |
|-----------|---------|---------------|
| `auth.test.ts` | Authentication & JWT | Auth0 token validation, user authentication |
| `order.test.ts` | Order Processing | Order creation, validation, status updates |
| `payment.test.ts` | Payment Integration | Stripe payment intents, refunds, webhooks |
| `email.test.ts` | Email Service | Order confirmations, email templates |
| `ai.test.ts` | AI Integration | Gemini AI gift message generation |
| `full-integration.test.ts` | End-to-End Flow | Complete user journey: order → payment → email |

**Total:** 80 automated tests running in CI/CD

**Note:** Subscriptions are currently tested manually. Automated subscription tests are planned for future implementation.

---

## 🛠️ Manual Testing Utilities

These are helper scripts for manual testing (NOT part of automated CI/CD):

```bash
# Get Auth0 JWT token for API testing
docker exec flora-backend pnpm get-token

# Send test email to verify email service
docker exec flora-backend pnpm test:live-email
```

---

## ✅ Before You Push - Pre-Commit Checklist

**Always run these commands before pushing code:**

```bash
# 1️⃣ Run all backend tests (MUST PASS)
docker exec flora-backend pnpm test --silent

# 2️⃣ Type-check frontend (warnings OK)
docker exec flora-frontend pnpm type-check || echo "Type warnings are OK"

# 3️⃣ Build frontend in STRICT mode (simulates production deployment)
docker exec flora-frontend sh -c "CI=true pnpm build:prod"

# 4️⃣ Verify containers are running
docker ps
```

**Expected results:**
- ✅ All backend tests pass (80 tests)
- ✅ Frontend type-check runs (warnings allowed)
- ✅ Frontend builds successfully with NO warnings/errors
- ✅ All containers running

**If any step fails, fix it before pushing!**

---

## 🏗️ Understanding Build Commands

### **Development Build (Fast, Warnings OK)**
```bash
docker exec flora-frontend pnpm build
```
- ⚡ Fast iteration during development
- ⚠️ Shows warnings but doesn't fail
- 🔧 Good for local testing

### **Production Build (Strict, Deployment-Ready)**
```bash
# Option 1: Using build:prod script
docker exec flora-frontend pnpm build:prod

# Option 2: Using CI environment variable (same result)
docker exec flora-frontend sh -c "CI=true pnpm build"
```
- ❌ **Fails on ANY warnings** (unused variables, imports, etc.)
- ✅ Matches what Render/AWS/Vercel do automatically
- 🎯 Ensures clean, production-ready code
- 📦 Smaller bundle size (tree-shaking optimization)

**Why use strict mode before deployment?**
- Catches deployment issues early (before waiting for cloud build)
- Forces clean code (no unused variables/imports)
- Saves time (prevents failed deployments)
- Professional code quality

**When each platform uses strict mode:**

| Platform | Sets CI=true? | When to Use Locally |
|----------|--------------|---------------------|
| **Render** | ✅ Automatic | `CI=true pnpm build` before pushing |
| **Vercel** | ✅ Automatic | `CI=true pnpm build` before pushing |
| **AWS Amplify** | ✅ Automatic | `CI=true pnpm build` before pushing |
| **AWS EC2/Docker** | ⚠️ Manual | Set in Dockerfile: `ENV CI=true` |
| **AWS S3** | ⚠️ Manual | Run `CI=true pnpm build` in CI/CD |

---

## 🔄 CI/CD Integration

### **Automated Testing Pipeline**

**Triggers:**
- Every push to team branches: `main`, `li-dev`, `anth-branch`, `bevan-branch`, `xiaoling`
- All pull requests to `main` branch

**GitHub Actions Workflow Files:**
```
.github/workflows/test.yml       # Main testing pipeline
.github/workflows/security.yml   # Weekly security audits
```

### **Current CI Configuration**

**Active Jobs:**

1. **🧪 Backend Tests** ✅ ACTIVE
   - All Jest test suites (80 tests)
   - Code coverage reporting
   - PostgreSQL database tests
   - Auth, Orders, Payments, Email, AI tests

2. **🎨 Frontend Tests** ⏸️ DISABLED (Local verification only)
   - Reason: CI environment setup issues during development
   - Local verification: `docker exec flora-frontend pnpm build`
   - Re-enable after graduation: See `.github/workflows/test.yml`

3. **🔍 Type Checking** ⏸️ DISABLED (Local verification only)
   - Reason: Warnings allowed during active development
   - Local verification: `docker exec flora-frontend pnpm type-check`
   - Re-enable after graduation: See `.github/workflows/test.yml`

> **Note:** CI is simplified to backend tests during active development. All tests pass locally!

---

## 📊 CI/CD Pipeline Architecture

```
GitHub Push/PR
    ↓
GitHub Actions Triggered
    ↓
┌─────────────────────────────────────┐
│  Setup Environment                  │
│  - Node.js 18                       │
│  - pnpm package manager             │
│  - PostgreSQL database              │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Install Dependencies               │
│  - pnpm install                     │
│  - Cache dependencies for speed     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Backend Tests (ACTIVE)             │
│  - Database migrations              │
│  - Seed test data                   │
│  - Run Jest test suites (80 tests)  │
│  - Generate coverage report         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Results                            │
│  ✅ All tests pass → Merge allowed  │
│  ❌ Tests fail → Merge blocked      │
└─────────────────────────────────────┘
```

**View CI/CD results:**
- Navigate to: https://github.com/Aldore-88/holbertonschool-final_project/actions
- Click on workflow run → Select job → View logs
- Re-run failed jobs using "Re-run jobs" button

---

## 🚨 Troubleshooting Failed Tests

### **Common Issues & Solutions**

| Error | Cause | Solution |
|-------|-------|----------|
| `Tests failed` | Broken functionality | Run `docker exec flora-backend pnpm test` locally to debug |
| `Build failed` | TypeScript errors | Run `docker exec flora-backend pnpm build` locally |
| `Lint failed` | Code style issues | Run `docker exec flora-frontend pnpm lint --fix` |
| `type-check script not found` | Missing script in package.json | Rebuild: `pnpm docker:dev:build` |
| `Database connection error` | Database not running | Run `pnpm docker:restart-backend && pnpm docker:setup` |
| `Auth0 token invalid` | Test token expired | Tests use mocked tokens - check `src/test/setup.ts` |
| `No products found` | Database not seeded | Run `docker exec flora-backend pnpm db:seed` |

### **Development Workflow**

1. 🔧 Make code changes locally
2. 🧪 Run pre-commit checklist (see above)
3. 📤 Push to your branch
4. 👀 Monitor GitHub Actions results
5. 🔄 Fix any failures and push again

---

## 📈 Code Coverage

**Coverage goals:**
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

**View coverage report:**
```bash
# Generate coverage report
docker exec flora-backend pnpm test:coverage

# View HTML report in browser
open apps/backend/coverage/lcov-report/index.html
```

**CI/CD tracking:**
- Coverage reports uploaded to GitHub Actions artifacts
- Trends visible in workflow logs
- Coverage badge (optional): Add to README

---

## 🔒 Security Scanning

**Automated weekly scans:**
```yaml
# .github/workflows/security.yml
- pnpm audit          # Check for known vulnerabilities
- Dependency review   # Review new dependencies in PRs
```

**Manual security checks:**
```bash
# Check for vulnerabilities
pnpm audit

# Fix auto-fixable vulnerabilities
pnpm audit --fix

# View detailed report
pnpm audit --json > audit-report.json
```

---

## 🎯 Test Quality Standards

### **All tests must:**
- ✅ Run independently (no test order dependencies)
- ✅ Clean up after themselves (no database pollution)
- ✅ Use realistic test data (match production scenarios)
- ✅ Have descriptive names (e.g., `should create order when payment succeeds`)
- ✅ Test both success and error cases
- ✅ Mock external services (Auth0, Stripe, Email, AI)

### **Code review checklist:**
- ✅ New features include tests
- ✅ Tests cover edge cases
- ✅ No hardcoded credentials or secrets
- ✅ Error messages are clear and helpful
- ✅ Tests are fast (< 1 second each)

---

## 🏆 CI/CD Best Practices We Follow

- ✅ **Branch Protection:** All tests must pass before merging to `main`
- ✅ **Parallel Execution:** Fast feedback with concurrent jobs
- ✅ **Real Database:** PostgreSQL in CI matches production
- ✅ **Code Coverage:** Track test coverage trends over time
- ✅ **Security Scanning:** Weekly dependency vulnerability checks
- ✅ **Type Safety:** TypeScript compilation prevents runtime errors

---

## 📚 Additional Resources

- **[README.md](../README.md)** - Project overview and quick start
- **[Development Guide](DEVELOPMENT.md)** - Daily development workflow
- **[Database Guide](DATABASE.md)** - Prisma migrations and schema

---

**Testing ensures code quality and prevents bugs!** 🌸
