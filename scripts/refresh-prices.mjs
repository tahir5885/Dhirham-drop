#!/usr/bin/env node
/**
 * DirhamDrop Live Price Refresh Script (Neon PostgreSQL)
 * 
 * Fetches real-time prices across UAE retailers (Amazon.ae, Noon, Sharaf DG, etc.)
 * using the Scrapering.com residential proxy engine, and updates Neon PostgreSQL directly.
 * 
 * Usage:
 *   npm run refresh:prices
 *   or: node scripts/refresh-prices.mjs
 */

import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../apps/web/.env') });

const SCRAPERING_API_KEY =
  process.env.SCRAPERING_API_KEY ||
  'default_1nO6On_qD_SOmqBd5U5KcP805pIlC0-UYMdgD7Rez7Y';

console.log('\n💱 DirhamDrop Live Price Refresh');
console.log(`   Target: Neon PostgreSQL Database`);
console.log(`   API Key: ${SCRAPERING_API_KEY ? SCRAPERING_API_KEY.slice(0, 15) + '...' : 'Missing!'}\n`);

const prisma = new PrismaClient();

// Scrapering API helper
async function fetchWithScrapering(targetUrl) {
  const endpoint = 'https://app.scrapering.com/api/parsing/v1/url';

  const submitResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SCRAPERING_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: targetUrl,
      region: 'AE',
      output: { html: true, markdown: false, text: false, json: false },
      useragent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    }),
  });

  if (!submitResponse.ok) {
    throw new Error(`Submit failed with HTTP status ${submitResponse.status}`);
  }

  const taskData = await submitResponse.json();
  const taskId = taskData.id || taskData.requestId;
  if (!taskId) throw new Error('No task ID returned from Scrapering');

  // Poll for result
  const resultEndpoint = `https://app.scrapering.com/api/parsing/v1/result/url/${taskId}`;
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(resultEndpoint, {
      headers: { Authorization: `Bearer ${SCRAPERING_API_KEY}` },
    });
    if (pollRes.ok) {
      const result = await pollRes.json();
      if (result.status === 'ready' && result.data) {
        return (
          result.data.content ||
          result.data.html ||
          (typeof result.data === 'string' ? result.data : '')
        );
      }
    }
  }
  throw new Error('Timed out waiting for Scrapering result');
}

// Universal price extractor
function extractPrice(url, html) {
  const lower = url.toLowerCase();

  // 1. Amazon UAE
  if (lower.includes('amazon.ae') || lower.includes('amazon.')) {
    const jsonLd = [
      ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
    ];
    for (const m of jsonLd) {
      try {
        const data = JSON.parse(m[1]);
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item['@type'] === 'Product' && item.offers?.price) {
            const p = parseFloat(item.offers.price);
            if (!isNaN(p) && p > 0) return p;
          }
        }
      } catch {}
    }
    const m = html.match(
      /class=["'](?:apexPriceToPay|priceToPay|a-price)["'][^>]*>[\s\S]*?class=["']a-offscreen["'][^>]*>AED\s*([\d,]+(?:\.\d+)?)/i
    );
    if (m) return parseFloat(m[1].replace(/,/g, ''));
  }

  // 2. Noon UAE
  if (lower.includes('noon.com')) {
    const jsonLd = [
      ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
    ];
    for (const m of jsonLd) {
      try {
        const data = JSON.parse(m[1]);
        if (data['@type'] === 'Product' && data.offers?.price) {
          const p = parseFloat(data.offers.price);
          if (!isNaN(p) && p > 0) return p;
        }
      } catch {}
    }
    const m = html.match(/"offers":\s*\{[^}]*?"price":\s*"?([0-9\.]+)"?/i);
    if (m) return parseFloat(m[1]);
  }

  // 3. Sharaf DG
  if (lower.includes('sharafdg.com')) {
    const m = html.match(
      /class=["'](?:price|actual-price|woocommerce-Price-amount)["'][^>]*>[\s\S]*?AED\s*([\d,]+(?:\.\d+)?)/i
    );
    if (m) return parseFloat(m[1].replace(/,/g, ''));
    const jsonLd = [
      ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
    ];
    for (const m2 of jsonLd) {
      try {
        const data = JSON.parse(m2[1]);
        if (data.offers?.price) {
          const p = parseFloat(data.offers.price);
          if (!isNaN(p) && p > 0) return p;
        }
      } catch {}
    }
  }

  // Generic JSON-LD fallback for Jumbo, Microless, Carrefour, Virgin, etc.
  const jsonLd = [
    ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ];
  for (const m of jsonLd) {
    try {
      const data = JSON.parse(m[1]);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item['@type'] === 'Product' || (typeof item['@type'] === 'string' && item['@type'].includes('Product'))) {
          const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
          if (offer?.price) {
            const p = parseFloat(offer.price);
            if (!isNaN(p) && p > 0) return p;
          }
        }
      }
    } catch {}
  }

  // Regex price fallback
  const genericPrice = html.match(/AED\s*([0-9,]+(?:\.[0-9]+)?)/i);
  if (genericPrice) {
    const p = parseFloat(genericPrice[1].replace(/,/g, ''));
    if (!isNaN(p) && p > 5 && p < 100000) return p;
  }

  return null;
}

async function refreshListing(listing) {
  try {
    const html = await fetchWithScrapering(listing.url);
    const newPrice = extractPrice(listing.url, html);

    if (newPrice && newPrice > 0) {
      const now = new Date();

      // Update current price directly in Neon Postgres
      await prisma.retailerListing.update({
        where: { id: listing.id },
        data: {
          currentPrice: newPrice,
          lastCheckedAt: now,
        },
      });

      // Insert new price history record
      await prisma.priceHistory.create({
        data: {
          listingId: listing.id,
          price: newPrice,
          currency: 'AED',
          stockStatus: 'IN_STOCK',
          recordedAt: now,
        },
      });

      return { success: true, oldPrice: Number(listing.currentPrice), newPrice };
    }
    return { success: false, reason: 'Could not extract valid price' };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

async function main() {
  // Fetch listings ordered by oldest checked first
  const limit = parseInt(process.argv[2] || '30', 10);
  const listings = await prisma.retailerListing.findMany({
    orderBy: { lastCheckedAt: 'asc' },
    take: limit,
    include: {
      retailer: true,
      canonicalProduct: true,
    },
  });

  console.log(`📋 Found ${listings.length} listings in Neon PostgreSQL to refresh (limit: ${limit})\n`);

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < listings.length; i++) {
    const l = listings[i];
    const name = l.canonicalProduct.normalizedName;
    const store = l.retailer.name;
    process.stdout.write(`[${i + 1}/${listings.length}] ${name} @ ${store}... `);

    const result = await refreshListing(l);

    if (result.success) {
      const diff = result.newPrice - result.oldPrice;
      const arrow = diff < 0 ? '↓' : diff > 0 ? '↑' : '→';
      const diffStr = diff !== 0 ? ` (${arrow} AED ${Math.abs(diff).toFixed(0)})` : '';
      console.log(`✅ AED ${result.newPrice.toLocaleString()}${diffStr}`);
      updated++;
    } else {
      console.log(`⚠️  ${result.reason}`);
      failed++;
    }

    // Rate-limit safety interval
    if (i < listings.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log(`\n🎉 Live price refresh complete!`);
  console.log(`   ✅ Updated in Neon: ${updated} listings`);
  console.log(`   ⚠️  Skipped/Failed:  ${failed} listings`);
  console.log(`\nBecause Neon is cloud-hosted, your live website at Vercel immediately reflects these new prices without needing a rebuild!\n`);
}

main()
  .catch((err) => {
    console.error('\n❌ Fatal error in price refresh:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
