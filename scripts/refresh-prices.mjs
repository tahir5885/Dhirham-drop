#!/usr/bin/env node
/**
 * DirhamDrop Price Refresh Script
 * 
 * Updates prices in local dev.db using the Scrapering.com API,
 * then you push the updated dev.db to GitHub → Vercel auto-deploys with fresh prices.
 * 
 * Usage:
 *   node scripts/refresh-prices.mjs
 * 
 * After running, copy the updated dev.db:
 *   copy apps\web\prisma\dev.db "D:\download\github\Dhirham drop\apps\web\prisma\dev.db"
 * Then commit & push via GitHub Desktop.
 */

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

const SCRAPERING_API_KEY = process.env.SCRAPERING_API_KEY;
const LOCAL_DB = join(__dirname, '..', 'apps', 'web', 'prisma', 'dev.db');

if (!SCRAPERING_API_KEY) {
  console.error('❌ SCRAPERING_API_KEY is not set in .env');
  process.exit(1);
}

if (!existsSync(LOCAL_DB)) {
  console.error(`❌ dev.db not found at: ${LOCAL_DB}`);
  process.exit(1);
}

console.log('\n💱 DirhamDrop Price Refresh');
console.log(`   Database: ${LOCAL_DB}`);
console.log(`   API Key: ${SCRAPERING_API_KEY.slice(0, 20)}...\n`);

const db = new Database(LOCAL_DB);

// Scrapering API helper
async function fetchWithScrapering(targetUrl) {
  const endpoint = 'https://app.scrapering.com/api/parsing/v1/url';
  
  const submitResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SCRAPERING_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: targetUrl,
      region: 'AE',
      output: { html: true, markdown: false, text: false, json: false },
      useragent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    }),
  });

  if (!submitResponse.ok) {
    throw new Error(`Submit failed: ${submitResponse.status}`);
  }

  const taskData = await submitResponse.json();
  const taskId = taskData.id || taskData.requestId;
  if (!taskId) throw new Error('No task ID returned');

  // Poll for result
  const resultEndpoint = `https://app.scrapering.com/api/parsing/v1/result/url/${taskId}`;
  for (let i = 0; i < 12; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const pollRes = await fetch(resultEndpoint, {
      headers: { 'Authorization': `Bearer ${SCRAPERING_API_KEY}` },
    });
    if (pollRes.ok) {
      const result = await pollRes.json();
      if (result.status === 'ready' && result.data) {
        return result.data.content || result.data.html || '';
      }
    }
  }
  throw new Error('Timed out waiting for result');
}

// Price extractors per retailer
function extractPrice(url, html) {
  const lower = url.toLowerCase();
  
  // Amazon UAE
  if (lower.includes('amazon.ae') || lower.includes('amazon.')) {
    // JSON-LD first
    const jsonLd = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
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
    const m = html.match(/class=["'](?:apexPriceToPay|priceToPay)[^"']*["'][^>]*>[\s\S]*?class=["']a-offscreen["'][^>]*>AED\s*([\d,]+(?:\.\d+)?)/i);
    if (m) return parseFloat(m[1].replace(/,/g, ''));
  }
  
  // Noon UAE
  if (lower.includes('noon.com')) {
    const jsonLd = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
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

  // Sharaf DG
  if (lower.includes('sharafdg.com')) {
    const m = html.match(/class=["'](?:price|actual-price|woocommerce-Price-amount)[^"']*["'][^>]*>[\s\S]*?AED\s*([\d,]+(?:\.\d+)?)/i);
    if (m) return parseFloat(m[1].replace(/,/g, ''));
    const jsonLd = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
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

  // Generic JSON-LD fallback
  const jsonLd = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const m of jsonLd) {
    try {
      const data = JSON.parse(m[1]);
      if (data.offers?.price) {
        const p = parseFloat(data.offers.price);
        if (!isNaN(p) && p > 0) return p;
      }
    } catch {}
  }

  return null;
}

async function refreshListing(listing) {
  try {
    const html = await fetchWithScrapering(listing.url);
    const newPrice = extractPrice(listing.url, html);
    
    if (newPrice && newPrice > 0) {
      const now = new Date().toISOString();
      
      // Update current price
      db.prepare(`
        UPDATE retailer_listing 
        SET currentPrice = ?, lastCheckedAt = ?, updatedAt = ?
        WHERE id = ?
      `).run(newPrice, now, now, listing.id);
      
      // Add price history entry
      const histId = 'ph_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      db.prepare(`
        INSERT INTO price_history (id, listingId, price, currency, stockStatus, recordedAt)
        VALUES (?, ?, ?, 'AED', 'IN_STOCK', ?)
      `).run(histId, listing.id, newPrice, now);
      
      return { success: true, oldPrice: listing.currentPrice, newPrice };
    }
    return { success: false, reason: 'Could not extract price' };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

async function main() {
  // Get all listings sorted by last checked (oldest first)
  const listings = db.prepare(`
    SELECT rl.id, rl.url, rl.currentPrice, rl.sku, r.slug as retailerSlug, pc.normalizedName
    FROM retailer_listing rl
    JOIN retailer r ON rl.retailerId = r.id
    JOIN product_canonical pc ON rl.canonicalProductId = pc.id
    ORDER BY rl.lastCheckedAt ASC
    LIMIT 50
  `).all();

  console.log(`📋 Found ${listings.length} listings to refresh\n`);
  
  let updated = 0, failed = 0;
  
  for (let i = 0; i < listings.length; i++) {
    const l = listings[i];
    process.stdout.write(`[${i+1}/${listings.length}] ${l.normalizedName} @ ${l.retailerSlug}... `);
    
    const result = await refreshListing(l);
    
    if (result.success) {
      const diff = result.newPrice - result.oldPrice;
      const arrow = diff < 0 ? '↓' : diff > 0 ? '↑' : '→';
      const diffStr = diff !== 0 ? ` (${arrow} AED ${Math.abs(diff).toFixed(0)})` : '';
      console.log(`✅ AED ${result.newPrice}${diffStr}`);
      updated++;
    } else {
      console.log(`⚠️  ${result.reason}`);
      failed++;
    }
    
    // Rate limit: wait 1.5s between requests
    if (i < listings.length - 1) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  
  console.log(`\n🎉 Price refresh complete!`);
  console.log(`   ✅ Updated: ${updated} listings`);
  console.log(`   ⚠️  Failed:  ${failed} listings`);
  console.log(`\nNext step: Copy dev.db to GitHub folder and push:`);
  console.log(`   copy "apps\\web\\prisma\\dev.db" "D:\\download\\github\\Dhirham drop\\apps\\web\\prisma\\dev.db"`);
  console.log(`   Then commit & push via GitHub Desktop → Vercel auto-deploys!\n`);
  
  db.close();
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  db.close();
  process.exit(1);
});
