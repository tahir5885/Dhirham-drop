import './env.js';
import 'dotenv/config';
import { createStealthBrowserSession } from './stealth-browser.js';
import { scrapeAmazonSearch, scrapeAmazonProduct } from './scrapers/amazon.js';
import { scrapeNoonSearch, scrapeNoonProduct } from './scrapers/noon.js';
import { scrapeSharafDGSearch, scrapeSharafDGProduct } from './scrapers/sharafdg.js';
import { ingestScrapedProduct } from './services/ingestion.js';
import { runPriceTrackingCycle } from './scheduler.js';
import { prisma } from '@dirhamdrop/database';

async function runMockIngestion() {
  console.log('[Crawler CLI] Running mock ingestion test with verified UAE sample payloads...');

  // 1. Amazon iPhone 15 Pro Max
  await ingestScrapedProduct({
    retailerSlug: 'amazon_ae',
    sku: 'B0CQ313N2F',
    url: 'https://www.amazon.ae/dp/B0CQ313N2F',
    rawTitle: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium [UAE Official Stock]',
    currentPrice: 2749.0,
    originalPrice: 5099.0,
    imageUrl: 'https://m.media-amazon.com/images/I/81c50PU+lpL._AC_SX679_.jpg',
    rating: 4.7,
    reviewCount: 1420,
    sellerName: 'Amazon.ae Prime',
    isFulfilledByRetailer: true,
  });

  // 2. Noon iPhone 15 Pro Max (Will automatically fuzzy-match to the same canonical product!)
  await ingestScrapedProduct({
    retailerSlug: 'noon_ae',
    sku: 'N70100742V',
    url: 'https://www.noon.com/uae-en/renewed-iphone-15-pro-max-256gb-natural-titanium-5g-with-facetime-international-version/N70100742V/p/?o=c33a9ef3da0ed25e',
    rawTitle: 'Apple iPhone 15 Pro Max 256GB Natural Titanium 5G With Facetime (Noon Express)',
    currentPrice: 2626.0,
    originalPrice: 5099.0,
    imageUrl: 'https://m.media-amazon.com/images/I/81c50PU+lpL._AC_SX679_.jpg',
    rating: 4.6,
    reviewCount: 3000,
    sellerName: 'Noon Express',
    isFulfilledByRetailer: true,
  });

  // 3. Amazon Sony Headphones
  await ingestScrapedProduct({
    retailerSlug: 'amazon_ae',
    sku: 'B09ZFD9CBB',
    url: 'https://www.amazon.ae/dp/B09ZFD9CBB',
    rawTitle: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black (UAE Version)',
    currentPrice: 799.0,
    originalPrice: 1499.0,
    imageUrl: 'https://m.media-amazon.com/images/I/61+elL4O1VL._AC_SX679_.jpg',
    rating: 4.7,
    reviewCount: 3200,
    sellerName: 'Amazon.ae Prime',
    isFulfilledByRetailer: true,
  });

  // 4. Noon Sony Headphones (Will match with Amazon Sony Canonical record!)
  await ingestScrapedProduct({
    retailerSlug: 'noon_ae',
    sku: 'N53330542A',
    url: 'https://www.noon.com/uae-en/wh-1000xm5-wireless-noise-cancelling-headphones-black/N53330542A/p/?o=e68d2a866b2fa53b',
    rawTitle: 'Sony WH-1000XM5 Wireless Over-Ear Active Noise Cancelling Headphones Black',
    currentPrice: 799.0,
    originalPrice: 1299.0,
    imageUrl: 'https://m.media-amazon.com/images/I/61+elL4O1VL._AC_SX679_.jpg',
    rating: 4.6,
    reviewCount: 1540,
    sellerName: 'SuperDeals UAE',
    isFulfilledByRetailer: true,
  });

  // 5. Dyson Airwrap Amazon
  await ingestScrapedProduct({
    retailerSlug: 'amazon_ae',
    sku: 'B0B61XH5YT',
    url: 'https://www.amazon.ae/dp/B0B61XH5YT',
    rawTitle: 'Dyson Airwrap Multi-Styler Complete Long, Nickel/Copper - International Version',
    currentPrice: 1999.0,
    originalPrice: 2499.0,
    imageUrl: 'https://m.media-amazon.com/images/I/61y8c5XU5OL._AC_SX679_.jpg',
    rating: 4.7,
    reviewCount: 420,
    sellerName: 'Amazon.ae Prime',
    isFulfilledByRetailer: true,
  });

  // 6. Dyson Airwrap Noon
  await ingestScrapedProduct({
    retailerSlug: 'noon_ae',
    sku: 'N53409802A',
    url: 'https://www.noon.com/uae-en/airwrap-multi-styler-complete-long-prussian-blue-rich-copper/N53409802A/p/?o=f7bfab627d8ff14f',
    rawTitle: 'Dyson Airwrap Multi-Styler Complete Long Prussian Blue / Rich Copper',
    currentPrice: 1999.0,
    originalPrice: 2499.0,
    imageUrl: 'https://m.media-amazon.com/images/I/61y8c5XU5OL._AC_SX679_.jpg',
    rating: 4.6,
    reviewCount: 530,
    sellerName: 'Noon Express',
    isFulfilledByRetailer: true,
  });

  // 7. Sharaf DG Sony Headphones
  await ingestScrapedProduct({
    retailerSlug: 'sharaf_dg',
    sku: 'SDG_SONY_WH1000XM5',
    url: 'https://uae.sharafdg.com/product/sony-wh-1000xm5-wireless-noise-canceling-headphones-black/',
    rawTitle: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
    currentPrice: 829.0,
    originalPrice: 1399.0,
    imageUrl: 'https://m.media-amazon.com/images/I/61+elL4O1VL._AC_SX679_.jpg',
    rating: 4.8,
    reviewCount: 420,
    sellerName: 'Sharaf DG Retail',
    isFulfilledByRetailer: true,
  });

  // 8. Sharaf DG Dyson Airwrap
  await ingestScrapedProduct({
    retailerSlug: 'sharaf_dg',
    sku: 'SDG_DYSON_AIRWRAP_LONG',
    url: 'https://uae.sharafdg.com/product/dyson-airwrap-multi-styler-complete-long-nickel-copper/',
    rawTitle: 'Dyson Airwrap Multi-Styler Complete Long (Nickel/Copper) - UAE Official Warranty',
    currentPrice: 1999.0,
    originalPrice: 2499.0,
    imageUrl: 'https://m.media-amazon.com/images/I/61y8c5XU5OL._AC_SX679_.jpg',
    rating: 4.8,
    reviewCount: 290,
    sellerName: 'Sharaf DG Retail',
    isFulfilledByRetailer: true,
  });

  console.log('[Crawler CLI] Verified UAE mock ingestion completed successfully!');
}

async function main() {
  const args = process.argv.slice(2);
  const isMock = args.includes('--mock');
  const isTrack = args.includes('--track');
  const productArg = args.find((a) => a.startsWith('--product='))?.split('=')[1];
  const doAmazon = args.some((a) => a.includes('amazon')) || args.includes('--all');
  const doNoon = args.some((a) => a.includes('noon')) || args.includes('--all');
  const doSharaf = args.some((a) => a.includes('sharaf')) || args.includes('--all');

  if (isMock) {
    await runMockIngestion();
    return;
  }

  if (isTrack) {
    await runPriceTrackingCycle();
    return;
  }

  // Direct Product Page Crawler
  if (productArg) {
    console.log(`[Crawler CLI] Launching direct product scraper for: ${productArg}`);
    const session = await createStealthBrowserSession(true);
    try {
      if (productArg.includes('amazon') || /^[A-Z0-9]{10}$/i.test(productArg)) {
        await scrapeAmazonProduct(session, productArg);
      } else if (productArg.includes('noon') || /^N[0-9A-Z]+/i.test(productArg)) {
        await scrapeNoonProduct(session, productArg);
      } else if (productArg.includes('sharaf')) {
        await scrapeSharafDGProduct(session, productArg);
      } else {
        console.error('[Crawler CLI] Unrecognized URL format. Must be Amazon, Noon, or Sharaf DG.');
      }
    } finally {
      await session.browser.close();
      await prisma.$disconnect();
    }
    return;
  }

  const amazonUrl =
    args.find((a) => a.startsWith('--amazon-url='))?.split('=')[1] ||
    'https://www.amazon.ae/s?k=iphone+15+pro+max';

  const noonUrl =
    args.find((a) => a.startsWith('--noon-url='))?.split('=')[1] ||
    'https://www.noon.com/uae-en/search/?q=iphone+15+pro+max';

  console.log('[Crawler CLI] Launching stealth browser session...');
  const session = await createStealthBrowserSession(true);

  try {
    if (doAmazon) {
      console.log(`[Crawler CLI] Scraping Amazon category: ${amazonUrl}`);
      await scrapeAmazonSearch(session, amazonUrl, 5);
    }

    if (doNoon) {
      console.log(`[Crawler CLI] Scraping Noon category: ${noonUrl}`);
      await scrapeNoonSearch(session, noonUrl, 5);
    }
  } finally {
    await session.browser.close();
    await prisma.$disconnect();
    console.log('[Crawler CLI] Finished crawling run.');
  }
}

main().catch((err) => {
  console.error('[Crawler CLI] Execution error:', err);
  process.exit(1);
});
