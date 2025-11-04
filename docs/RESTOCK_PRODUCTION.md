# Restock Production Inventory

Quick guide to restore product stock levels in production.

## Prerequisites

1. **GitHub Secret configured**: `PRODUCTION_DATABASE_URL` must be set in repo settings
   - Go to: Settings → Secrets and variables → Actions
   - Should already be configured with production RDS connection string

## How to Restock

1. **Go to GitHub Actions**
   - Navigate to your repo on GitHub
   - Click **Actions** tab

2. **Select Workflow**
   - Find **"Restock Production Inventory"** in the left sidebar
   - Click on it

3. **Run Workflow**
   - Click **"Run workflow"** dropdown button (top right)
   - Type `RESTOCK` in the confirmation field
   - Click **"Run workflow"** button

4. **Wait for Completion**
   - Takes ~30 seconds
   - Click on the running workflow to see logs
   - ✅ All products with stock < 10 will be updated to 100 units

## What It Does

- Connects to production RDS database
- Finds all products with `stockCount < 10` or `inStock = false`
- Updates them to `stockCount = 100` and `inStock = true`
- Shows updated inventory in the logs

## When to Use

- After products sell out in production
- Before demos or presentations
- When testing checkout flow
- Anytime you need to restore inventory levels

## Alternative: SSH Method

If GitHub Actions is unavailable:

```bash
# SSH into Elastic Beanstalk
eb ssh flora-backend-production

# Run restock script inside Docker container
sudo docker exec -it $(sudo docker ps -q) node /app/apps/backend/update-all-stock.js

# Exit
exit
```

## Future: Seller Dashboard

This manual process is temporary. Once the seller dashboard is implemented, stock management will be done through the admin UI.
