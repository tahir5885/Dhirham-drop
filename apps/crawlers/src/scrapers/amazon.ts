import { BrowserSession } from '../stealth-browser.js';
import { ingestScrapedProduct, ScrapedProductItem } from '../services/ingestion.js';

export function extractAmazonAsin(urlOrAsin: string): string | null {
  if (/^[A-Z0-9]{10}$/i.test(urlOrAsin.trim())) {
    return urlOrAsin.trim();
  }
  const match = urlOrAsin.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return match ? match[1] : null;
}

export async function scrapeAmazonProduct(
  session: BrowserSession,
  urlOrAsin: string
): Promise<ScrapedProductItem | null> {
  const asin = extractAmazonAsin(urlOrAsin);
  if (!asin) {
    console.error(`[Amazon Scraper] Invalid ASIN or URL: ${urlOrAsin}`);
    return null;
  }

  const directUrl = `https://www.amazon.ae/dp/${asin}`;
  const page = await session.context.newPage();

  try {
    console.log(`[Amazon Scraper] Fetching direct product page: ${directUrl}`);
    await page.goto(directUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    // 1. Title
    const titleEl = await page.$('#productTitle');
    const rawTitle = titleEl ? (await titleEl.textContent())?.trim() : null;
    if (!rawTitle) {
      console.warn(`[Amazon Scraper] Product title not found on ${directUrl}. Might be blocked or 404.`);
      return null;
    }

    // 2. Current Price
    const priceSelectors = [
      '.apexPriceToPay .a-offscreen',
      '.priceToPay .a-offscreen',
      '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
      '#corePrice_desktop .a-price .a-offscreen',
      '.a-price .a-offscreen',
    ];
    let currentPrice: number | null = null;
    for (const sel of priceSelectors) {
      const el = await page.$(sel);
      if (el) {
        const text = await el.textContent();
        if (text) {
          const parsed = parseFloat(text.replace(/[^0-9.]/g, ''));
          if (!isNaN(parsed) && parsed > 0) {
            currentPrice = parsed;
            break;
          }
        }
      }
    }

    if (!currentPrice) {
      console.warn(`[Amazon Scraper] Price not found for ASIN ${asin}`);
      return null;
    }

    // 3. Original Strikethrough Price
    const origPriceSelectors = [
      '.basisPrice .a-offscreen',
      '.a-text-price .a-offscreen',
      '#corePriceDisplay_desktop_feature_div .a-text-price .a-offscreen',
    ];
    let originalPrice: number | undefined;
    for (const sel of origPriceSelectors) {
      const el = await page.$(sel);
      if (el) {
        const text = await el.textContent();
        if (text) {
          const parsed = parseFloat(text.replace(/[^0-9.]/g, ''));
          if (!isNaN(parsed) && parsed > currentPrice) {
            originalPrice = parsed;
            break;
          }
        }
      }
    }

    // 4. Image
    const imgEl = await page.$('#landingImage');
    const imageUrl = imgEl ? (await imgEl.getAttribute('data-old-hires')) || (await imgEl.getAttribute('src')) || undefined : undefined;

    // 5. Rating & Review Count
    const ratingEl = await page.$('#acrPopover .a-icon-alt');
    const ratingText = ratingEl ? await ratingEl.textContent() : null;
    const rating = ratingText ? parseFloat(ratingText.split(' ')[0]) : undefined;

    const reviewEl = await page.$('#acrCustomerReviewText');
    const reviewText = reviewEl ? await reviewEl.textContent() : null;
    const reviewCount = reviewText ? parseInt(reviewText.replace(/[^0-9]/g, ''), 10) : undefined;

    // 6. Prime / Fulfillment
    const primeEl = await page.$('#primeExclusiveEligibilityWidget, i.a-icon-prime');
    const isFulfilledByRetailer = !!primeEl;

    // 7. Seller Name
    const merchantEl = await page.$('#merchant-info, #sellerProfileTriggerId');
    const sellerName = merchantEl ? (await merchantEl.textContent())?.trim() : 'Amazon.ae';

    const item: ScrapedProductItem = {
      retailerSlug: 'amazon_ae',
      sku: asin,
      url: directUrl,
      rawTitle,
      currentPrice,
      originalPrice,
      imageUrl,
      rating,
      reviewCount,
      sellerName: sellerName?.includes('Amazon') ? 'Amazon.ae Prime' : sellerName,
      isFulfilledByRetailer,
    };

    console.log(`[Amazon Scraper] Successfully extracted ASIN ${asin}: "${rawTitle.slice(0, 40)}..." - AED ${currentPrice}`);
    await ingestScrapedProduct(item);
    return item;
  } catch (err: any) {
    console.error(`[Amazon Scraper] Failed to scrape product ${asin}:`, err.message);
    return null;
  } finally {
    await page.close();
  }
}

export async function scrapeAmazonSearch(
  session: BrowserSession,
  searchUrl: string,
  maxItems = 10
): Promise<ScrapedProductItem[]> {
  const page = await session.context.newPage();
  const items: ScrapedProductItem[] = [];

  try {
    console.log(`[Amazon Scraper] Navigating to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for search result cards
    await page.waitForSelector('div[data-component-type="s-search-result"]', { timeout: 10000 }).catch(() => {
      console.warn('[Amazon Scraper] Timed out waiting for search results container.');
    });

    const productCards = await page.$$('div[data-component-type="s-search-result"]');
    console.log(`[Amazon Scraper] Found ${productCards.length} product elements.`);

    for (const card of productCards.slice(0, maxItems)) {
      try {
        const asin = await card.getAttribute('data-asin');
        if (!asin) continue;

        // Title
        const titleEl = await card.$('h2 a span');
        const rawTitle = titleEl ? (await titleEl.textContent())?.trim() : null;
        if (!rawTitle) continue;

        // Current Price
        const priceEl = await card.$('.a-price .a-offscreen');
        const priceText = priceEl ? await priceEl.textContent() : null;
        const currentPrice = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;
        if (!currentPrice || isNaN(currentPrice)) continue;

        // Original Strikethrough Price
        const origPriceEl = await card.$('.a-text-price .a-offscreen');
        const origPriceText = origPriceEl ? await origPriceEl.textContent() : null;
        const originalPrice = origPriceText
          ? parseFloat(origPriceText.replace(/[^0-9.]/g, ''))
          : undefined;

        // Image URL
        const imgEl = await card.$('img.s-image');
        const imageUrl = imgEl ? (await imgEl.getAttribute('src')) || undefined : undefined;

        // Rating
        const ratingEl = await card.$('.a-icon-alt');
        const ratingText = ratingEl ? await ratingEl.textContent() : null;
        const rating = ratingText ? parseFloat(ratingText.split(' ')[0]) : undefined;

        // Review Count
        const reviewsEl = await card.$('.a-size-small .a-link-normal span.a-size-base');
        const reviewsText = reviewsEl ? await reviewsEl.textContent() : null;
        const reviewCount = reviewsText
          ? parseInt(reviewsText.replace(/[^0-9]/g, ''), 10)
          : undefined;

        // Prime / Fulfilled by Amazon
        const primeEl = await card.$('.a-icon-prime');
        const isFulfilledByRetailer = !!primeEl;

        const cleanUrl = `https://www.amazon.ae/dp/${asin}`;

        const scrapedItem: ScrapedProductItem = {
          retailerSlug: 'amazon_ae',
          sku: asin,
          url: cleanUrl,
          rawTitle,
          currentPrice,
          originalPrice,
          imageUrl,
          rating,
          reviewCount,
          sellerName: 'Amazon.ae',
          isFulfilledByRetailer,
        };

        items.push(scrapedItem);
        console.log(`[Amazon Scraper] Extracted: "${rawTitle.slice(0, 50)}..." - AED ${currentPrice}`);

        // Ingest into database
        await ingestScrapedProduct(scrapedItem);
      } catch (cardErr) {
        console.warn('[Amazon Scraper] Failed to extract card:', cardErr);
      }
    }
  } catch (err) {
    console.error('[Amazon Scraper] Failed to scrape Amazon category:', err);
  } finally {
    await page.close();
  }

  return items;
}
