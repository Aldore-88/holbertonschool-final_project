-- This migration syncs the production database schema with the current schema.prisma
-- It includes all changes made via 'prisma db push' during local development

-- ============================================
-- 1. CREATE NEW ENUMS
-- ============================================

-- CreateEnum
CREATE TYPE "PurchaseType" AS ENUM ('ONE_TIME', 'SUBSCRIPTION');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('RECURRING_WEEKLY', 'RECURRING_BIWEEKLY', 'RECURRING_MONTHLY', 'RECURRING_QUARTERLY', 'RECURRING_YEARLY', 'SPONTANEOUS', 'SPONTANEOUS_WEEKLY', 'SPONTANEOUS_BIWEEKLY', 'SPONTANEOUS_MONTHLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED');

-- ============================================
-- 2. DROP OLD TABLES (no longer in schema)
-- ============================================

-- DropTable
DROP TABLE IF EXISTS "collection_products" CASCADE;

-- DropTable
DROP TABLE IF EXISTS "collections" CASCADE;

-- DropTable
DROP TABLE IF EXISTS "delivery_rules" CASCADE;

-- ============================================
-- 3. ALTER EXISTING TABLES
-- ============================================

-- AlterTable: products
-- Add: longDescription, isActive, categoryId
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "longDescription" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;

-- AlterTable: users
-- Modify: firstName and lastName to nullable
-- Add: favorite arrays
ALTER TABLE "users" ALTER COLUMN "firstName" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "lastName" DROP NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "favoriteOccasions" "Occasion"[];
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "favoriteColors" "Color"[];
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "favoriteMoods" "Mood"[];

-- AlterTable: orders
-- Major restructuring for purchase types and subscriptions
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "purchaseType" "PurchaseType";
ALTER TABLE "orders" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "guestEmail" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "guestPhone" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "subscriptionId" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "subscriptionType" "SubscriptionType";
ALTER TABLE "orders" ALTER COLUMN "shippingAddressId" DROP NOT NULL;

-- Add shipping address fields to orders (inline address)
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingFirstName" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingLastName" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingStreet1" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingStreet2" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingCity" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingState" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingZipCode" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingCountry" TEXT DEFAULT 'AU';
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingPhone" TEXT;

-- Add billing address fields to orders
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "billingFirstName" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "billingLastName" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "billingStreet1" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "billingStreet2" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "billingCity" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "billingState" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "billingZipCode" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "billingCountry" TEXT DEFAULT 'AU';
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "billingPhone" TEXT;

-- Rename and add delivery date fields
ALTER TABLE "orders" RENAME COLUMN "deliveryDate" TO "requestedDeliveryDate";
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "actualDeliveryDate" TIMESTAMP(3);

-- AlterTable: order_items
-- Add subscription fields
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "subscriptionType" "SubscriptionType";
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "requestedDeliveryDate" TIMESTAMP(3);

-- AlterTable: addresses
-- Change country default from US to AU
ALTER TABLE "addresses" ALTER COLUMN "country" SET DEFAULT 'AU';

-- ============================================
-- 4. CREATE NEW TABLES
-- ============================================

-- CreateTable: subscriptions
CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "nextDeliveryDate" TIMESTAMP(3),
    "lastDeliveryDate" TIMESTAMP(3),
    "stripeSubscriptionId" TEXT,
    "deliveryType" "DeliveryType" NOT NULL DEFAULT 'STANDARD',
    "deliveryNotes" TEXT,
    "shippingFirstName" TEXT NOT NULL,
    "shippingLastName" TEXT NOT NULL,
    "shippingStreet1" TEXT NOT NULL,
    "shippingStreet2" TEXT,
    "shippingCity" TEXT NOT NULL,
    "shippingState" TEXT NOT NULL,
    "shippingZipCode" TEXT NOT NULL,
    "shippingCountry" TEXT NOT NULL DEFAULT 'AU',
    "shippingPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: subscription_items
CREATE TABLE IF NOT EXISTS "subscription_items" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "subscription_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable: payments
CREATE TABLE IF NOT EXISTS "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "stripePaymentIntentId" TEXT,
    "stripePaymentMethodId" TEXT,
    "status" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable: email_templates
CREATE TABLE IF NOT EXISTS "email_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "textContent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable: email_logs
CREATE TABLE IF NOT EXISTS "email_logs" (
    "id" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "templateName" TEXT,
    "status" TEXT NOT NULL,
    "orderId" TEXT,
    "userId" TEXT,
    "sentAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: delivery_zones
CREATE TABLE IF NOT EXISTS "delivery_zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "zipCodes" TEXT[],
    "cities" TEXT[],
    "standardCostCents" INTEGER NOT NULL,
    "expressCostCents" INTEGER,
    "sameDayCostCents" INTEGER,
    "standardDeliveryDays" INTEGER NOT NULL DEFAULT 5,
    "expressDeliveryDays" INTEGER NOT NULL DEFAULT 2,
    "sameDayAvailable" BOOLEAN NOT NULL DEFAULT false,
    "sameDayCutoffHour" INTEGER,
    "freeDeliveryThreshold" INTEGER,
    "weekendDelivery" BOOLEAN NOT NULL DEFAULT false,
    "holidayDelivery" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable: delivery_windows
CREATE TABLE IF NOT EXISTS "delivery_windows" (
    "id" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "additionalCostCents" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "delivery_windows_pkey" PRIMARY KEY ("id")
);

-- CreateTable: delivery_methods
CREATE TABLE IF NOT EXISTS "delivery_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deliveryType" "DeliveryType" NOT NULL,
    "baseCostCents" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "estimatedDays" INTEGER NOT NULL,
    "trackingAvailable" BOOLEAN NOT NULL DEFAULT true,
    "signatureRequired" BOOLEAN NOT NULL DEFAULT false,
    "insuranceIncluded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable: delivery_tracking
CREATE TABLE IF NOT EXISTS "delivery_tracking" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "trackingNumber" TEXT,
    "carrierName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PREPARING',
    "currentLocation" TEXT,
    "estimatedDelivery" TIMESTAMP(3),
    "actualDelivery" TIMESTAMP(3),
    "deliveredTo" TEXT,
    "deliveryNotes" TEXT,
    "deliveryPhoto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable: tracking_events
CREATE TABLE IF NOT EXISTS "tracking_events" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isCustomerVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable: carts
CREATE TABLE IF NOT EXISTS "carts" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable: cart_items
CREATE TABLE IF NOT EXISTS "cart_items" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- 5. CREATE UNIQUE INDEXES
-- ============================================

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_items_subscriptionId_productId_key" ON "subscription_items"("subscriptionId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "payments_stripePaymentIntentId_key" ON "payments"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "email_templates_name_key" ON "email_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "delivery_zones_name_key" ON "delivery_zones"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "delivery_methods_name_key" ON "delivery_methods"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "delivery_tracking_orderId_key" ON "delivery_tracking"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "delivery_tracking_trackingNumber_key" ON "delivery_tracking"("trackingNumber");

-- ============================================
-- 6. ADD FOREIGN KEY CONSTRAINTS
-- ============================================

-- AddForeignKey: products -> categories
ALTER TABLE "products" ADD CONSTRAINT IF NOT EXISTS "products_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: orders -> subscriptions
ALTER TABLE "orders" ADD CONSTRAINT IF NOT EXISTS "orders_subscriptionId_fkey"
    FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: subscriptions -> users
ALTER TABLE "subscriptions" ADD CONSTRAINT IF NOT EXISTS "subscriptions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: subscription_items -> subscriptions
ALTER TABLE "subscription_items" ADD CONSTRAINT IF NOT EXISTS "subscription_items_subscriptionId_fkey"
    FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: subscription_items -> products
ALTER TABLE "subscription_items" ADD CONSTRAINT IF NOT EXISTS "subscription_items_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: payments -> orders
ALTER TABLE "payments" ADD CONSTRAINT IF NOT EXISTS "payments_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: delivery_windows -> delivery_zones
ALTER TABLE "delivery_windows" ADD CONSTRAINT IF NOT EXISTS "delivery_windows_zoneId_fkey"
    FOREIGN KEY ("zoneId") REFERENCES "delivery_zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: tracking_events -> delivery_tracking
ALTER TABLE "tracking_events" ADD CONSTRAINT IF NOT EXISTS "tracking_events_trackingId_fkey"
    FOREIGN KEY ("trackingId") REFERENCES "delivery_tracking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: carts -> users
ALTER TABLE "carts" ADD CONSTRAINT IF NOT EXISTS "carts_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: cart_items -> carts
ALTER TABLE "cart_items" ADD CONSTRAINT IF NOT EXISTS "cart_items_cartId_fkey"
    FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: cart_items -> products
ALTER TABLE "cart_items" ADD CONSTRAINT IF NOT EXISTS "cart_items_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
