-- CreateTable
CREATE TABLE "product_canonical" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brand" TEXT NOT NULL,
    "model" TEXT,
    "normalizedName" TEXT NOT NULL,
    "canonicalKey" TEXT NOT NULL,
    "category" TEXT,
    "ean" TEXT,
    "upc" TEXT,
    "imageUrl" TEXT,
    "attributes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "retailer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "logoUrl" TEXT,
    "affiliateParamKey" TEXT,
    "affiliateParamValue" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "retailer_listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "canonicalProductId" TEXT NOT NULL,
    "retailerId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "rawTitle" TEXT NOT NULL,
    "currentPrice" DECIMAL NOT NULL,
    "originalPrice" DECIMAL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "stockStatus" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "rating" REAL,
    "reviewCount" INTEGER,
    "sellerName" TEXT,
    "isFulfilledByRetailer" BOOLEAN NOT NULL DEFAULT false,
    "lastCheckedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "retailer_listing_canonicalProductId_fkey" FOREIGN KEY ("canonicalProductId") REFERENCES "product_canonical" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "retailer_listing_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "retailer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "stockStatus" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "price_history_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "retailer_listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userEmail" TEXT NOT NULL,
    "canonicalProductId" TEXT NOT NULL,
    "targetPrice" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isTriggered" BOOLEAN NOT NULL DEFAULT false,
    "lastNotifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_alert_canonicalProductId_fkey" FOREIGN KEY ("canonicalProductId") REFERENCES "product_canonical" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "product_canonical_canonicalKey_key" ON "product_canonical"("canonicalKey");

-- CreateIndex
CREATE INDEX "product_canonical_brand_idx" ON "product_canonical"("brand");

-- CreateIndex
CREATE INDEX "product_canonical_model_idx" ON "product_canonical"("model");

-- CreateIndex
CREATE INDEX "product_canonical_normalizedName_idx" ON "product_canonical"("normalizedName");

-- CreateIndex
CREATE INDEX "product_canonical_canonicalKey_idx" ON "product_canonical"("canonicalKey");

-- CreateIndex
CREATE UNIQUE INDEX "retailer_slug_key" ON "retailer"("slug");

-- CreateIndex
CREATE INDEX "retailer_listing_canonicalProductId_idx" ON "retailer_listing"("canonicalProductId");

-- CreateIndex
CREATE INDEX "retailer_listing_sku_idx" ON "retailer_listing"("sku");

-- CreateIndex
CREATE INDEX "retailer_listing_currentPrice_idx" ON "retailer_listing"("currentPrice");

-- CreateIndex
CREATE UNIQUE INDEX "retailer_listing_retailerId_sku_key" ON "retailer_listing"("retailerId", "sku");

-- CreateIndex
CREATE INDEX "price_history_listingId_recordedAt_idx" ON "price_history"("listingId", "recordedAt");

-- CreateIndex
CREATE INDEX "user_alert_userEmail_idx" ON "user_alert"("userEmail");

-- CreateIndex
CREATE INDEX "user_alert_canonicalProductId_isActive_idx" ON "user_alert"("canonicalProductId", "isActive");
