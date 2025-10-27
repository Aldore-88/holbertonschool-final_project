# 🗃️ Flora Database Guide

Complete guide for database management, Prisma workflows, and schema migrations.

---

## 📊 Database Overview

**Stack:**
- **PostgreSQL** - Production-ready relational database
- **Prisma ORM** - Type-safe database access and migrations
- **Docker** - Containerized database for consistency

**Key Entities:**
- **Users** - Customer accounts and authentication (Auth0)
- **Products** - Flowers, plants, and bundles
- **Orders** - Purchase transactions with delivery information
- **Subscriptions** - Recurring delivery schedules
- **DeliveryZones** - Melbourne coverage areas

---

## 🔑 Understanding Prisma Commands

| Command | What It Does | Creates Migration Files? | When To Use |
|---------|--------------|-------------------------|-------------|
| `db:migrate` | Creates migration file + applies it | ✅ YES | When YOU change schema.prisma |
| `db:push` | Directly updates DB schema | ❌ NO | ⚠️ NEVER in team projects! |
| `db:seed` | Fills database with sample data | N/A | After migrations or when you need test data |
| `docker:setup` | Runs migrations + seed | N/A | After pulling teammate's schema changes |

**Critical Rule:** ✅ Always use `db:migrate` | ❌ Never use `db:push` in team projects

**Why?**
- `db:migrate` creates migration files that teammates can run
- `db:push` skips migration files → teammates won't get your changes!

---

## 🛠️ The Proper Prisma Workflow

### **Scenario 1: YOU Make Schema Changes**

You're adding a new feature that requires database changes.

**Example: Adding a "stock" field to the Product model**

```bash
# 1. Edit schema.prisma
# Add this to the Product model:
#   stock Int @default(0)

# 2. Create migration in Docker environment
docker exec -it flora-backend pnpm db:migrate

# This will:
#   ✅ Prompt for migration name (e.g., "add_stock_field")
#   ✅ Create migration file in prisma/migrations/
#   ✅ Apply migration to your local database
#   ✅ Update Prisma Client

# 3. Commit BOTH files to git
git add apps/backend/prisma/schema.prisma
git add apps/backend/prisma/migrations/
git commit -m "feat: add stock tracking to products"
git push
```

**What gets created:**
```
apps/backend/prisma/migrations/
└── 20241027123456_add_stock_field/
    └── migration.sql
```

**Migration file example:**
```sql
-- AlterTable
ALTER TABLE "Product" ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0;
```

---

### **Scenario 2: TEAMMATE Made Schema Changes (You Pull Code)**

Your teammate pushed schema changes and you need to apply them.

```bash
# 1. Pull latest code
git pull

# You'll see new files:
#   - apps/backend/prisma/schema.prisma (updated)
#   - apps/backend/prisma/migrations/XXXXXX_their_migration/ (new)

# 2. Restart backend to reload code
pnpm docker:restart-backend

# 3. Apply migrations + reseed database
pnpm docker:setup

# This runs:
#   - prisma migrate deploy  → Applies new migration files
#   - prisma db seed         → Refreshes sample data
```

**What happens:**
- Prisma reads migration files and applies them in order
- Database schema updates to match `schema.prisma`
- Sample data is refreshed with `seed.ts`

---

### **Scenario 3: Running Locally (Without Docker)**

If you prefer local development without Docker:

```bash
# YOU make changes:
pnpm --filter backend db:migrate    # Create + apply migration
git add apps/backend/prisma/
git commit -m "feat: update schema"

# TEAMMATE pulls changes:
pnpm --filter backend db:migrate    # Apply new migrations
pnpm --filter backend db:seed       # (Optional) Refresh test data
```

---

## 📋 Common Database Operations

### **Create a New Migration**

```bash
# Docker (recommended)
docker exec -it flora-backend pnpm db:migrate

# Local
pnpm --filter backend db:migrate
```

### **Apply Pending Migrations**

```bash
# Docker
pnpm docker:setup

# Local
pnpm --filter backend db:migrate
```

### **Seed Database with Sample Data**

```bash
# Docker
docker exec flora-backend pnpm db:seed

# Local
pnpm --filter backend db:seed
```

### **Reset Database (⚠️ Deletes All Data)**

```bash
# Docker
docker exec flora-backend pnpm db:reset

# Local
pnpm --filter backend db:reset
```

**Warning:** This deletes ALL data including user accounts, orders, etc. Only use in development!

### **View Database in GUI**

```bash
# Start Prisma Studio (works from any directory in project)
npx prisma studio

# Opens at: http://localhost:5555
```

### **Access Database CLI**

```bash
# Docker PostgreSQL shell
docker exec -it flora-db psql -U flora_user -d flora_db

# Useful commands:
\dt                    # List all tables
\d "User"              # Describe User table
SELECT * FROM "User";  # Query users
\q                     # Quit
```

---

## ❓ Common Scenarios & Solutions

### **Q: I added a new field to schema.prisma, what do I do?**

```bash
# Docker:
docker exec -it flora-backend pnpm db:migrate

# Local:
pnpm --filter backend db:migrate

# Then commit migration files!
git add apps/backend/prisma/
git commit -m "feat: add new field to Model"
```

---

### **Q: My teammate added a field, I pulled their code, now what?**

```bash
# Docker (recommended):
pnpm docker:restart-backend    # Reload code
pnpm docker:setup              # Apply migrations + seed

# Local:
pnpm --filter backend db:migrate
```

---

### **Q: When do I need to run db:seed?**

**Use `db:seed` when you want to refresh test data:**
- After migration (to get sample products)
- When database is empty
- When testing features
- After `db:reset`

```bash
# Docker:
pnpm docker:seed

# Local:
pnpm --filter backend db:seed
```

---

### **Q: What's wrong with db:push?**

```bash
# ❌ db:push = No migration files → teammates won't get your changes!
# ✅ db:migrate = Creates migration files → proper team workflow

# Rule: NEVER use db:push in team projects
```

**Why it's dangerous:**
- Skips creating migration files
- Changes apply only to YOUR database
- Teammates won't know about schema changes
- Can cause sync issues and bugs

---

### **Q: I made a mistake in my migration, can I undo it?**

**If you haven't committed yet:**
```bash
# 1. Delete the migration folder
rm -rf apps/backend/prisma/migrations/XXXXXX_bad_migration

# 2. Revert schema.prisma changes
git checkout apps/backend/prisma/schema.prisma

# 3. Reset database
docker exec flora-backend pnpm db:reset

# 4. Try again with correct changes
docker exec -it flora-backend pnpm db:migrate
```

**If you already committed and pushed:**
```bash
# Create a new migration that reverts the changes
# Edit schema.prisma to remove the bad changes
docker exec -it flora-backend pnpm db:migrate
# Name it: "revert_bad_migration"
```

---

### **Q: How do I see what changed in a migration?**

```bash
# View migration SQL
cat apps/backend/prisma/migrations/XXXXXX_migration_name/migration.sql

# Compare schema versions with git
git diff HEAD~1 apps/backend/prisma/schema.prisma
```

---

### **Q: Database is out of sync with schema, help!**

```bash
# Nuclear option - reset everything (⚠️ deletes all data)
docker exec flora-backend pnpm db:reset

# Then reapply migrations + seed
pnpm docker:setup
```

---

## 🎯 Migration Best Practices

### ✅ **DO:**
- ✅ Use `db:migrate` for all schema changes
- ✅ Commit migration files with `schema.prisma`
- ✅ Run `pnpm docker:setup` after pulling teammate's schema changes
- ✅ Keep UPSERT pattern in `seed.ts` (works on fresh + existing databases)
- ✅ Test migrations locally before pushing
- ✅ Use descriptive migration names (e.g., "add_user_email_verification")
- ✅ Review migration SQL before applying to production

### ❌ **DON'T:**
- ❌ Use `db:push` in team projects (skips migration files!)
- ❌ Forget to commit migration files
- ❌ Manually edit migration files (let Prisma generate them)
- ❌ Assume teammates' databases auto-update (they need to run migrations)
- ❌ Delete migrations that have been pushed to main branch
- ❌ Make breaking schema changes without team discussion

---

## 📐 Database Schema Design Patterns

### **Seeding with UPSERT Pattern**

Our `seed.ts` uses UPSERT to work with both fresh and existing databases:

```typescript
// ✅ Good - UPSERT pattern
await prisma.product.upsert({
  where: { id: 'product_1' },
  update: {
    name: 'Updated Name',
    price: 2999
  },
  create: {
    id: 'product_1',
    name: 'Red Roses Bouquet',
    price: 2999
  }
});

// ❌ Bad - CREATE only (fails if data exists)
await prisma.product.create({
  id: 'product_1',
  name: 'Red Roses Bouquet',
  price: 2999
});
```

### **Relations in Prisma**

```prisma
// One-to-Many: User has many Orders
model User {
  id     String  @id
  orders Order[]
}

model Order {
  id      String @id
  userId  String
  user    User   @relation(fields: [userId], references: [id])
}

// Many-to-Many: Orders can have many Products
model Order {
  id       String        @id
  products OrderProduct[]
}

model Product {
  id     String        @id
  orders OrderProduct[]
}

model OrderProduct {
  orderId   String
  productId String
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])

  @@id([orderId, productId])
}
```

---

## 🔍 Debugging Database Issues

### **Check Database Connection**

```bash
# Test connection
docker exec flora-backend npx prisma db pull

# Expected: "Introspection successful"
```

### **View Current Schema**

```bash
# Generate schema from database
docker exec flora-backend npx prisma db pull

# Compare with schema.prisma
git diff apps/backend/prisma/schema.prisma
```

### **Check Migration Status**

```bash
# View migration history
docker exec flora-backend npx prisma migrate status

# Shows:
# - Applied migrations ✅
# - Pending migrations ⏳
# - Failed migrations ❌
```

### **Inspect Data**

```bash
# GUI (Prisma Studio)
npx prisma studio

# CLI (PostgreSQL)
docker exec -it flora-db psql -U flora_user -d flora_db

# Query examples:
SELECT COUNT(*) FROM "User";
SELECT * FROM "Order" WHERE status = 'PENDING';
SELECT * FROM "Product" LIMIT 5;
```

---

## 🚀 Advanced Prisma Features

### **Transactions**

```typescript
// Ensure both operations succeed or both fail
await prisma.$transaction([
  prisma.order.create({ data: orderData }),
  prisma.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } }
  })
]);
```

### **Raw SQL Queries**

```typescript
// When you need custom SQL
const result = await prisma.$queryRaw`
  SELECT * FROM "Product"
  WHERE price > 2000
  AND stock > 0
`;
```

### **Middleware for Logging**

```typescript
// Log all database queries (useful for debugging)
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  return result;
});
```

---

## 📚 Additional Resources

- **[Prisma Documentation](https://www.prisma.io/docs)** - Official docs
- **[README.md](../README.md)** - Project overview
- **[Development Guide](DEVELOPMENT.md)** - Daily development workflow
- **[Testing Guide](TESTING_GUIDE.md)** - Testing documentation

---

**Database questions?** Check troubleshooting above or ask your team! 🌸
