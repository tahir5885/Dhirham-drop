import './env.js';
import 'dotenv/config';
import { prisma} from '@dirhamdrop/database';
import { createStealthBrowserSession, BrowserSession } from './stealth-browser.js';
import { scrapeAmazonProduct } from './scrapers/amazon.js';
import { scrapeNoonProduct } from './scrapers/noon.js';
import { scrapeSharafDGProduct } from './scrapers/sharafdg.js';
import { fetchWithScrapering, parseScraperingProduct } from './scrapering.js';
import { ScrapedProductItem } from './services/ingestion.js';
import { sendPriceDropEmail } from './services/notifier.js';

export interface PriceTrackResult {
  listingId: string;
  sku: string;
  retailerSlug: string;
  title: string;
  oldPrice: number;
  newPrice: number;
  priceDiff: number;
  isPriceDrop: boolean;
  timestamp: Date;
}

// Priority UAE Watchlist for automatic periodic monitoring
export const PRIORITY_UAE_WATCHLIST = [
  {
    name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    amazonAsin: 'B0CQ313N2F',
    noonUrl: 'https://www.noon.com/uae-en/renewed-iphone-15-pro-max-256gb-natural-titanium-5g-with-facetime-international-version/N70100742V/p/?o=c33a9ef3da0ed25e',
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    amazonAsin: 'B09ZFD9CBB',
    noonUrl: 'https://www.noon.com/uae-en/wh-1000xm5-wireless-noise-cancelling-headphones-black/N53330542A/p/?o=e68d2a866b2fa53b',
  },
  {
    name: 'Samsung Galaxy S24 Ultra 256GB Titanium Black',
    amazonAsin: 'B0CQZ22Q7L',
    noonUrl: 'https://www.noon.com/uae-en/renewed-galaxy-s24-ultra-titanium-gray-12gb-ram-256gb-5g-international-version/N70250982V/p/?o=df32995c725cca7f',
  },
  {
    name: 'Dyson Airwrap Multi-Styler Complete Long',
    amazonAsin: 'B0B61XH5YT',
    noonUrl: 'https://www.noon.com/uae-en/airwrap-multi-styler-complete-long-prussian-blue-rich-copper/N53409802A/p/?o=f7bfab627d8ff14f',
  },
];

/**
 * Checks a single listing price, utilizing Scrapering API when available or stealth Playwright as fallback
 */
export async function trackListingPrice(
  listing: {
    id: string;
    sku: string;
    url: string;
    rawTitle: string;
    currentPrice: number;
    retailerSlug: 'amazon_ae' | 'noon_ae' | 'sharaf_dg' | string;
  },
  session?: BrowserSession
): Promise<PriceTrackResult | null> {
  let scraped: ScrapedProductItem | null = null;

  // 1. Try Scrapering API first if key configured
  if (process.env.SCRAPERING_API_KEY) {
    try {
      console.log(`[Price Tracker] Trying Scrapering API for ${listing.sku}...`);
      const apiRes = await fetchWithScrapering(listing.url, { proxyCountry: 'AE', solveCaptcha: true });
      if (apiRes.success && apiRes.html) {
        const parsed = parseScraperingProduct(listing.url, apiRes.html);
        if (parsed.currentPrice) {
          scraped = {
            retailerSlug: listing.retailerSlug,
            sku: listing.sku,
            url: listing.url,
            rawTitle: parsed.title || listing.rawTitle,
            currentPrice: parsed.currentPrice,
            originalPrice: parsed.originalPrice || undefined,
            imageUrl: parsed.imageUrl || undefined,
            rating: parsed.rating || undefined,
            reviewCount: parsed.reviewCount || undefined,
            isFulfilledByRetailer: true,
          };
          console.log(`[Price Tracker] Scrapering extracted price: AED ${parsed.currentPrice}`);
        }
      }
    } catch (e: any) {
      console.warn(`[Price Tracker] Scrapering error, falling back: ${e.message}`);
    }
  }

  // 2. Fall back to local stealth browser
  if (!scraped && session) {
    if (listing.retailerSlug === 'amazon_ae') {
      scraped = await scrapeAmazonProduct(session, listing.url);
    } else if (listing.retailerSlug === 'noon_ae') {
      scraped = await scrapeNoonProduct(session, listing.url);
    } else if (listing.retailerSlug === 'sharaf_dg') {
      scraped = await scrapeSharafDGProduct(session, listing.url);
    }
  }

  if (!scraped || !scraped.currentPrice) {
    console.warn(`[Price Tracker] Unable to retrieve live price for ${listing.sku}`);
    return null;
  }

  const oldPrice = listing.currentPrice;
  const newPrice = scraped.currentPrice;
  const priceDiff = oldPrice - newPrice;
  const isPriceDrop = priceDiff > 0;

  console.log(
    `[Price Tracker] ${listing.sku} (${listing.retailerSlug}): AED ${oldPrice} -> AED ${newPrice} ` +
      (isPriceDrop ? `📉 (DROP: -AED ${priceDiff.toFixed(2)})` : isPriceDiffZero(priceDiff) ? '(= No change)' : `📈 (+AED ${Math.abs(priceDiff).toFixed(2)})`)
  );

  // Record in Database
  try {
    await prisma.retailerListing.update({
      where: { id: listing.id },
      data: {
        currentPrice: newPrice,
        originalPrice: scraped.originalPrice ?? undefined,
        lastCheckedAt: new Date(),
      },
    });

    await prisma.priceHistory.create({
      data: {
        listingId: listing.id,
        price: newPrice,
        currency: 'AED',
        stockStatus: "IN_STOCK",
        recordedAt: new Date(),
      },
    });

    // Check user price alerts
    if (isPriceDrop) {
      const triggeredAlerts = await prisma.userAlert.findMany({
        where: {
          canonicalProductId: (await prisma.retailerListing.findUnique({ where: { id: listing.id } }))?.canonicalProductId || '',
          targetPrice: { gte: newPrice },
          isActive: true,
        },
      });

      if (triggeredAlerts.length > 0) {
        console.log(`🔔 [ALERT DISPATCH] Price dropped below threshold for ${triggeredAlerts.length} user alerts!`);
        for (const alert of triggeredAlerts) {
          try {
            await sendPriceDropEmail({
              toEmail: alert.userEmail,
              productName: listing.rawTitle,
              productImageUrl: scraped.imageUrl || undefined,
              targetPrice: Number(alert.targetPrice),
              newPrice: newPrice,
              retailerName:
                listing.retailerSlug === 'amazon_ae'
                  ? 'Amazon.ae'
                  : listing.retailerSlug === 'noon_ae'
                  ? 'Noon.com'
                  : 'Sharaf DG',
              buyUrl: listing.url,
              alertId: alert.id,
            });

            // Mark alerted
            await prisma.userAlert.update({
              where: { id: alert.id },
              data: { isTriggered: true, lastNotifiedAt: new Date() }
            });
          } catch (e: any) {
            console.error(`[Alert Dispatch] Failed sending alert to ${alert.userEmail}:`, e.message);
          }
        }
      }
    }
  } catch (err: any) {
    // Database write skipped if offline
  }

  return {
    listingId: listing.id,
    sku: listing.sku,
    retailerSlug: listing.retailerSlug,
    title: listing.rawTitle,
    oldPrice,
    newPrice,
    priceDiff,
    isPriceDrop,
    timestamp: new Date(),
  };
}

function isPriceDiffZero(diff: number): boolean {
  return Math.abs(diff) < 0.01;
}

/**
 * Runs a complete tracking cycle across all monitored listings
 */
export async function runPriceTrackingCycle(): Promise<PriceTrackResult[]> {
  console.log('\n=========================================');
  console.log(`[DirhamDrop Scheduler] Starting Price Tracking Cycle at ${new Date().toISOString()}`);
  console.log('=========================================');

  let listingsToTrack: any[] = [];

  try {
    const dbListings = await prisma.retailerListing.findMany({
      include: { retailer: true },
      orderBy: { lastCheckedAt: 'asc' },
    });
    if (dbListings.length > 0) {
      listingsToTrack = dbListings.map(l => ({
        id: l.id,
        sku: l.sku,
        url: l.url,
        rawTitle: l.rawTitle,
        currentPrice: Number(l.currentPrice),
        retailerSlug: l.retailer.slug as 'amazon_ae' | 'noon_ae',
      }));
    }
  } catch {
    // Offline DB fallback
  }

  // If no DB listings, use priority watchlist items
  if (listingsToTrack.length === 0) {
    console.log('[Scheduler] Using fallback priority watchlist...');
    listingsToTrack = [
      {
        id: 'watch_amz_sony',
        sku: 'B09ZFD9CBB',
        url: 'https://www.amazon.ae/dp/B09ZFD9CBB',
        rawTitle: 'Sony WH-1000XM5 Wireless Headphones',
        currentPrice: 799.0,
        retailerSlug: 'amazon_ae',
      },
      {
        id: 'watch_noon_sony',
        sku: 'N53330542A',
        url: 'https://www.noon.com/uae-en/wh-1000xm5-wireless-noise-cancelling-headphones-black/N53330542A/p/?o=e68d2a866b2fa53b',
        rawTitle: 'Sony WH-1000XM5 Headphones Black',
        currentPrice: 799.0,
        retailerSlug: 'noon_ae',
      },
      {
        id: 'watch_amz_dyson',
        sku: 'B0B61XH5YT',
        url: 'https://www.amazon.ae/dp/B0B61XH5YT',
        rawTitle: 'Dyson Airwrap Multi-Styler Complete Long',
        currentPrice: 1999.0,
        retailerSlug: 'amazon_ae',
      },
      {
        id: 'watch_noon_dyson',
        sku: 'N53409802A',
        url: 'https://www.noon.com/uae-en/airwrap-multi-styler-complete-long-prussian-blue-rich-copper/N53409802A/p/?o=f7bfab627d8ff14f',
        rawTitle: 'Dyson Airwrap Multi-Styler Complete Long',
        currentPrice: 1999.0,
        retailerSlug: 'noon_ae',
      },
      {
        id: 'watch_sharaf_sony',
        sku: 'SDG_SONY_WH1000XM5',
        url: 'https://uae.sharafdg.com/product/sony-wh-1000xm5-wireless-noise-canceling-headphones-black/',
        rawTitle: 'Sony WH-1000XM5 Wireless Headphones Black',
        currentPrice: 829.0,
        retailerSlug: 'sharaf_dg',
      },
      {
        id: 'watch_sharaf_dyson',
        sku: 'SDG_DYSON_AIRWRAP_LONG',
        url: 'https://uae.sharafdg.com/product/dyson-airwrap-multi-styler-complete-long-nickel-copper/',
        rawTitle: 'Dyson Airwrap Multi-Styler Complete Long',
        currentPrice: 1999.0,
        retailerSlug: 'sharaf_dg',
      },
    ];
  }

  const results: PriceTrackResult[] = [];
  let session: BrowserSession | undefined;

  // Only launch local browser if we don't have Scrapering API
  if (!process.env.SCRAPERING_API_KEY) {
    session = await createStealthBrowserSession(true);
  }

  try {
    for (const listing of listingsToTrack) {
      const res = await trackListingPrice(listing, session);
      if (res) results.push(res);
      // Polite inter-request jitter delay
      await new Promise(r => setTimeout(r, 2000));
    }
  } finally {
    if (session) {
      await session.browser.close();
    }
  }

  console.log(`[Scheduler] Cycle complete. Processed ${results.length} listing(s).`);
  const drops = results.filter(r => r.isPriceDrop);
  if (drops.length > 0) {
    console.log(`🎉 Found ${drops.length} PRICE DROPS in this cycle!`);
  }
  return results;
}

// Direct CLI execution
const isCLI = import.meta.url === `file://${process.argv[1]}` || import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;
if (isCLI) {
  const args = process.argv.slice(2);
  const intervalArg = args.find(a => a.startsWith('--interval='));

  if (intervalArg) {
    const seconds = parseInt(intervalArg.split('=')[1], 10);
    console.log(`[DirhamDrop Daemon] Starting recurring price crawler every ${seconds}s...`);
    runPriceTrackingCycle();
    setInterval(runPriceTrackingCycle, seconds * 1000);
  } else {
    runPriceTrackingCycle()
      .then(() => process.exit(0))
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  }
}
