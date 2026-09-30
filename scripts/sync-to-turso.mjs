#!/usr/bin/env node
/**
 * DirhamDrop → Turso Data Sync Script
 * 
 * This script reads all data from the local SQLite dev.db and pushes it
 * to your Turso cloud database so Vercel always serves fresh prices.
 * 
 * Usage:
 *   node scripts/sync-to-turso.mjs
 * 
 * Required env vars (set in .env or pass directly):
 *   TURSO_DATABASE_URL  - e.g. libsql://dhirhamdrop-<username>.turso.io
 *   TURSO_AUTH_TOKEN    - your Turso DB auth token
 */

import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
function loadEnv() {
  const envPath = join(__dirname, '..', '.env');
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eq = trimmed.indexOf('=');
        if (eq > 0) {
          const key = trimmed.slice(0, eq).trim();
          const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const LOCAL_DB = join(__dirname, '..', 'apps', 'web', 'prisma', 'dev.db');

if (!TURSO_URL || !TURSO_URL.startsWith('libsql://')) {
  console.error('❌ TURSO_DATABASE_URL is not set or invalid. Expected: libsql://your-db.turso.io');
  console.error('   Set it in your .env file at the root of the project.');
  process.exit(1);
}

if (!TURSO_TOKEN) {
  console.error('❌ TURSO_AUTH_TOKEN is not set. Get it from https://app.turso.tech');
  process.exit(1);
}

if (!existsSync(LOCAL_DB)) {
  console.error(`❌ Local SQLite database not found at: ${LOCAL_DB}`);
  process.exit(1);
}

console.log(`\n🚀 DirhamDrop → Turso Sync`);
console.log(`   Source: ${LOCAL_DB}`);
console.log(`   Target: ${TURSO_URL}\n`);

const local = new Database(LOCAL_DB, { readonly: true });
const remote = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

async function createSchema() {
  console.log('📐 Creating schema on Turso...');
  
  const ddl = `
    CREATE TABLE IF NOT EXISTS "retailer" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "domain" TEXT NOT NULL,
      "logoUrl" TEXT,
      "affiliateParamKey" TEXT,
      "affiliateParamValue" TEXT,
      "isActive" INTEGER NOT NULL DEFAULT 1,
      "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
      "updatedAt" TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "product_canonical" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "brand" TEXT NOT NULL,
      "model" TEXT,
      "normalizedName" TEXT NOT NULL,
      "canonicalKey" TEXT NOT NULL UNIQUE,
      "category" TEXT,
      "ean" TEXT,
      "upc" TEXT,
      "imageUrl" TEXT,
      "attributes" TEXT,
      "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
      "updatedAt" TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "product_canonical_brand_idx" ON "product_canonical"("brand");
    CREATE INDEX IF NOT EXISTS "product_canonical_model_idx" ON "product_canonical"("model");
    CREATE INDEX IF NOT EXISTS "product_canonical_normalizedName_idx" ON "product_canonical"("normalizedName");
    CREATE INDEX IF NOT EXISTS "product_canonical_canonicalKey_idx" ON "product_canonical"("canonicalKey");

    CREATE TABLE IF NOT EXISTS "retailer_listing" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "canonicalProductId" TEXT NOT NULL,
      "retailerId" TEXT NOT NULL,
      "sku" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      "rawTitle" TEXT NOT NULL,
      "currentPrice" REAL NOT NULL,
      "originalPrice" REAL,
      "currency" TEXT NOT NULL DEFAULT 'AED',
      "stockStatus" TEXT NOT NULL DEFAULT 'IN_STOCK',
      "rating" REAL,
      "reviewCount" INTEGER,
      "sellerName" TEXT,
      "isFulfilledByRetailer" INTEGER NOT NULL DEFAULT 0,
      "lastCheckedAt" TEXT NOT NULL DEFAULT (datetime('now')),
      "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
      "updatedAt" TEXT NOT NULL,
      FOREIGN KEY ("canonicalProductId") REFERENCES "product_canonical"("id") ON DELETE CASCADE,
      FOREIGN KEY ("retailerId") REFERENCES "retailer"("id") ON DELETE CASCADE,
      UNIQUE("retailerId", "sku")
    );

    CREATE INDEX IF NOT EXISTS "retailer_listing_canonicalProductId_idx" ON "retailer_listing"("canonicalProductId");
    CREATE INDEX IF NOT EXISTS "retailer_listing_sku_idx" ON "retailer_listing"("sku");
    CREATE INDEX IF NOT EXISTS "retailer_listing_currentPrice_idx" ON "retailer_listing"("currentPrice");

    CREATE TABLE IF NOT EXISTS "price_history" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "listingId" TEXT NOT NULL,
      "price" REAL NOT NULL,
      "currency" TEXT NOT NULL DEFAULT 'AED',
      "stockStatus" TEXT NOT NULL DEFAULT 'IN_STOCK',
      "recordedAt" TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY ("listingId") REFERENCES "retailer_listing"("id") ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS "price_history_listingId_recordedAt_idx" ON "price_history"("listingId", "recordedAt");

    CREATE TABLE IF NOT EXISTS "user_alert" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userEmail" TEXT NOT NULL,
      "canonicalProductId" TEXT NOT NULL,
      "targetPrice" REAL NOT NULL,
      "currency" TEXT NOT NULL DEFAULT 'AED',
      "isActive" INTEGER NOT NULL DEFAULT 1,
      "isTriggered" INTEGER NOT NULL DEFAULT 0,
      "lastNotifiedAt" TEXT,
      "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
      "updatedAt" TEXT NOT NULL,
      "userId" TEXT,
      FOREIGN KEY ("canonicalProductId") REFERENCES "product_canonical"("id") ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT,
      "email" TEXT UNIQUE,
      "emailVerified" TEXT,
      "image" TEXT
    );

    CREATE TABLE IF NOT EXISTS "Account" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "provider" TEXT NOT NULL,
      "providerAccountId" TEXT NOT NULL,
      "refresh_token" TEXT,
      "access_token" TEXT,
      "expires_at" INTEGER,
      "token_type" TEXT,
      "scope" TEXT,
      "id_token" TEXT,
      "session_state" TEXT,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      UNIQUE("provider", "providerAccountId")
    );

    CREATE TABLE IF NOT EXISTS "Session" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "sessionToken" TEXT NOT NULL UNIQUE,
      "userId" TEXT NOT NULL,
      "expires" TEXT NOT NULL,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "VerificationToken" (
      "identifier" TEXT NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "expires" TEXT NOT NULL,
      UNIQUE("identifier", "token")
    );
  `;

  for (const stmt of ddl.split(';').map(s => s.trim()).filter(s => s.length > 0)) {
    await remote.execute(stmt + ';');
  }
  console.log('   ✅ Schema ready\n');
}

async function syncTable(tableName, batchSize = 50) {
  const rows = local.prepare(`SELECT * FROM "${tableName}"`).all();
  if (rows.length === 0) {
    console.log(`   ⏭  ${tableName}: empty, skipping`);
    return;
  }

  // Clear existing data
  await remote.execute(`DELETE FROM "${tableName}"`);
  
  const cols = Object.keys(rows[0]);
  const placeholders = cols.map(() => '?').join(', ');
  const sql = `INSERT OR REPLACE INTO "${tableName}" (${cols.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`;
  
  let inserted = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const statements = batch.map(row => ({
      sql,
      args: cols.map(c => {
        const v = row[c];
        if (typeof v === 'boolean') return v ? 1 : 0;
        return v ?? null;
      }),
    }));
    await remote.batch(statements, 'write');
    inserted += batch.length;
    process.stdout.write(`\r   📤 ${tableName}: ${inserted}/${rows.length} rows`);
  }
  console.log(`\r   ✅ ${tableName}: ${rows.length} rows synced`);
}

async function main() {
  try {
    await createSchema();
    
    console.log('📦 Syncing data...');
    // Order matters — foreign key dependencies
    await syncTable('retailer');
    await syncTable('product_canonical');
    await syncTable('retailer_listing');
    await syncTable('price_history');
    await syncTable('user_alert');
    await syncTable('User');
    await syncTable('Account');
    await syncTable('Session');
    await syncTable('VerificationToken');
    
    console.log('\n🎉 Sync complete! Your Turso cloud DB is now up-to-date.');
    console.log('\nNext steps:');
    console.log('1. Add these to Vercel environment variables:');
    console.log(`   TURSO_DATABASE_URL = ${TURSO_URL}`);
    console.log(`   TURSO_AUTH_TOKEN   = <your token>`);
    console.log('   DATABASE_URL       = file:./dev.db  (fallback for build)');
    console.log('\n2. Redeploy on Vercel → prices will be live!');
    console.log('\nTo refresh prices later, just run this script again after your crawler updates dev.db.');
  } catch (err) {
    console.error('\n❌ Sync failed:', err.message);
    process.exit(1);
  } finally {
    local.close();
  }
}

main();
