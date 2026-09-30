import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from apps/web/.env
dotenv.config({ path: path.resolve(__dirname, '../apps/web/.env') });

const sqlitePath = path.resolve(__dirname, '../apps/web/prisma/dev.db');
console.log(`Connecting to SQLite: ${sqlitePath}`);
const sqlite = new Database(sqlitePath);

console.log(`Connecting to Neon Postgres...`);
const prisma = new PrismaClient();

async function migrate() {
  try {
    // 1. Retailers
    const retailers = sqlite.prepare('SELECT * FROM retailer').all();
    console.log(`Migrating ${retailers.length} retailers...`);
    for (const r of retailers) {
      await prisma.retailer.upsert({
        where: { id: r.id },
        update: {
          name: r.name,
          slug: r.slug,
          domain: r.domain,
          logoUrl: r.logoUrl,
          affiliateParamKey: r.affiliateParamKey,
          affiliateParamValue: r.affiliateParamValue,
          isActive: Boolean(r.isActive),
        },
        create: {
          id: r.id,
          name: r.name,
          slug: r.slug,
          domain: r.domain,
          logoUrl: r.logoUrl,
          affiliateParamKey: r.affiliateParamKey,
          affiliateParamValue: r.affiliateParamValue,
          isActive: Boolean(r.isActive),
          createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt) : new Date(),
        },
      });
    }

    // 2. Canonical Products
    const products = sqlite.prepare('SELECT * FROM product_canonical').all();
    console.log(`Migrating ${products.length} canonical products...`);
    for (const p of products) {
      await prisma.productCanonical.upsert({
        where: { id: p.id },
        update: {
          brand: p.brand,
          model: p.model,
          normalizedName: p.normalizedName,
          canonicalKey: p.canonicalKey,
          category: p.category,
          ean: p.ean,
          upc: p.upc,
          imageUrl: p.imageUrl,
          attributes: p.attributes,
        },
        create: {
          id: p.id,
          brand: p.brand,
          model: p.model,
          normalizedName: p.normalizedName,
          canonicalKey: p.canonicalKey,
          category: p.category,
          ean: p.ean,
          upc: p.upc,
          imageUrl: p.imageUrl,
          attributes: p.attributes,
          createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
          updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        },
      });
    }

    // 3. Retailer Listings
    const listings = sqlite.prepare('SELECT * FROM retailer_listing').all();
    console.log(`Migrating ${listings.length} retailer listings...`);
    for (const l of listings) {
      await prisma.retailerListing.upsert({
        where: { id: l.id },
        update: {
          currentPrice: l.currentPrice,
          originalPrice: l.originalPrice,
          currency: l.currency,
          stockStatus: l.stockStatus,
          rating: l.rating,
          reviewCount: l.reviewCount,
          sellerName: l.sellerName,
          isFulfilledByRetailer: Boolean(l.isFulfilledByRetailer),
          lastCheckedAt: l.lastCheckedAt ? new Date(l.lastCheckedAt) : new Date(),
        },
        create: {
          id: l.id,
          canonicalProductId: l.canonicalProductId,
          retailerId: l.retailerId,
          sku: l.sku,
          url: l.url,
          rawTitle: l.rawTitle,
          currentPrice: l.currentPrice,
          originalPrice: l.originalPrice,
          currency: l.currency,
          stockStatus: l.stockStatus,
          rating: l.rating,
          reviewCount: l.reviewCount,
          sellerName: l.sellerName,
          isFulfilledByRetailer: Boolean(l.isFulfilledByRetailer),
          lastCheckedAt: l.lastCheckedAt ? new Date(l.lastCheckedAt) : new Date(),
          createdAt: l.createdAt ? new Date(l.createdAt) : new Date(),
          updatedAt: l.updatedAt ? new Date(l.updatedAt) : new Date(),
        },
      });
    }

    // 4. Price History
    const histories = sqlite.prepare('SELECT * FROM price_history').all();
    console.log(`Migrating ${histories.length} price history rows in chunks...`);
    const chunkSize = 200;
    for (let i = 0; i < histories.length; i += chunkSize) {
      const chunk = histories.slice(i, i + chunkSize);
      await prisma.priceHistory.createMany({
        data: chunk.map((h) => ({
          id: h.id,
          listingId: h.listingId,
          price: h.price,
          currency: h.currency,
          stockStatus: h.stockStatus,
          recordedAt: h.recordedAt ? new Date(h.recordedAt) : new Date(),
        })),
        skipDuplicates: true,
      });
      process.stdout.write(`Migrated ${Math.min(i + chunkSize, histories.length)}/${histories.length} history points\r`);
    }
    console.log('\nPrice history migration complete.');

    console.log('✅ SQLite to Neon PostgreSQL data migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    sqlite.close();
    await prisma.$disconnect();
  }
}

migrate();
