import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../apps/web/.env') });

const prisma = new PrismaClient();

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-AE,en;q=0.9',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

async function fetchRealAmazonPrice(url, expectedMin = 50) {
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    if (!res.ok) return null;
    const html = await res.text();

    // 1. Offscreen price in priceToPay or apexPriceToPay
    const m = html.match(
      /class=["'](?:apexPriceToPay|priceToPay|a-price)["'][^>]*>[\s\S]*?class=["']a-offscreen["'][^>]*>AED[\s\u00a0]*([\d,]+(?:\.\d+)?)/i
    );
    if (m) {
      const p = parseFloat(m[1].replace(/,/g, ''));
      if (p >= expectedMin) return p;
    }

    // 2. JSON-LD
    const jsonLd = [
      ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
    ];
    for (const j of jsonLd) {
      try {
        const d = JSON.parse(j[1]);
        const items = Array.isArray(d) ? d : [d];
        for (const item of items) {
          if (item['@type'] === 'Product' && item.offers?.price) {
            const p = parseFloat(item.offers.price);
            if (!isNaN(p) && p >= expectedMin) return p;
          }
        }
      } catch {}
    }

    // 3. Any a-offscreen AED price
    const m2 = html.match(/class=["']a-offscreen["'][^>]*>AED[\s\u00a0]*([\d,]+(?:\.\d+)?)/i);
    if (m2) {
      const p = parseFloat(m2[1].replace(/,/g, ''));
      if (p >= expectedMin) return p;
    }

    return null;
  } catch {
    return null;
  }
}

async function fetchRealNoonPrice(url, expectedMin = 50) {
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    if (!res.ok) return null;
    const html = await res.text();

    // 1. JSON match
    const m = html.match(/"price":\s*"?([0-9\.]+)"?/i);
    if (m) {
      const p = parseFloat(m[1]);
      if (!isNaN(p) && p >= expectedMin) return p;
    }

    // 2. JSON-LD
    const jsonLd = [
      ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
    ];
    for (const j of jsonLd) {
      try {
        const d = JSON.parse(j[1]);
        if (d['@type'] === 'Product' && d.offers?.price) {
          const p = parseFloat(d.offers.price);
          if (!isNaN(p) && p >= expectedMin) return p;
        }
      } catch {}
    }

    return null;
  } catch {
    return null;
  }
}

async function syncListing(listing) {
  const isAmazon = listing.retailer.slug === 'amazon_ae' || listing.url.includes('amazon');
  const isNoon = listing.retailer.slug === 'noon_ae' || listing.url.includes('noon');
  const currentPrice = Number(listing.currentPrice);
  const minExpected = currentPrice > 200 ? currentPrice * 0.4 : 10;

  let realPrice = null;

  if (isAmazon && !listing.url.includes('/s?k=')) {
    realPrice = await fetchRealAmazonPrice(listing.url, minExpected);
  } else if (isNoon && !listing.url.includes('/search/?')) {
    realPrice = await fetchRealNoonPrice(listing.url, minExpected);
  }

  if (realPrice && realPrice > 0) {
    const now = new Date();
    await prisma.retailerListing.update({
      where: { id: listing.id },
      data: {
        currentPrice: realPrice,
        lastCheckedAt: now,
      },
    });

    await prisma.priceHistory.create({
      data: {
        listingId: listing.id,
        price: realPrice,
        currency: 'AED',
        stockStatus: 'IN_STOCK',
        recordedAt: now,
      },
    });

    return { updated: true, price: realPrice };
  }

  return { updated: false };
}

async function run() {
  console.log('⚡ Fast Live Price Sync Starting...');

  const limit = parseInt(process.argv[2] || '50', 10);
  const listings = await prisma.retailerListing.findMany({
    where: {
      url: {
        not: {
          contains: '/s?k=',
        },
      },
      OR: [
        { retailer: { slug: 'amazon_ae' } },
        { retailer: { slug: 'noon_ae' } },
      ],
    },
    include: {
      retailer: true,
      canonicalProduct: true,
    },
    take: limit,
  });

  console.log(`Checking ${listings.length} priority store listings directly...\n`);

  let count = 0;
  for (const l of listings) {
    const store = l.retailer.name;
    const prod = l.canonicalProduct.normalizedName;
    process.stdout.write(`Fetching ${prod.slice(0, 35)} @ ${store}... `);

    const oldPrice = Number(l.currentPrice);
    const result = await syncListing(l);

    if (result.updated) {
      console.log(`✅ Updated: AED ${oldPrice} -> AED ${result.price.toLocaleString()}`);
      count++;
    } else {
      console.log(`⚠️ Kept current: AED ${oldPrice}`);
    }

    // Small polite interval
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log(`\n🎉 Done! Updated ${count} listings with exact live prices in Neon PostgreSQL!`);
  await prisma.$disconnect();
}

run();
