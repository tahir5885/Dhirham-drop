import { BrowserSession } from '../stealth-browser.js';
import { ingestScrapedProduct, ScrapedProductItem } from '../services/ingestion.js';

export function extractSharafDGSku(urlOrSku: string): string | null {
  const trimmed = urlOrSku.trim();
  if (/^[a-z0-9_-]+$/i.test(trimmed) && !trimmed.startsWith('http')) {
    return trimmed;
  }
  const match = trimmed.match(/\/product\/([a-z0-9_-]+)/i);
  return match ? match[1] : trimmed.replace(/[^a-z0-9_-]/gi, '_');
}

export async function scrapeSharafDGProduct(
  session: BrowserSession,
  urlOrSku: string
): Promise<ScrapedProductItem | null> {
  const sku = extractSharafDGSku(urlOrSku);
  if (!sku) {
    console.error(`[Sharaf DG Scraper] Invalid SKU or URL: ${urlOrSku}`);
    return null;
  }

  const directUrl = urlOrSku.startsWith('http')
    ? urlOrSku
    : `https://uae.sharafdg.com/product/${sku}/`;

  const page = await session.context.newPage();

  try {
    console.log(`[Sharaf DG Scraper] Fetching product page: ${directUrl}`);
    await page.goto(directUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(3000);

    // Strategy A: JSON-LD extraction
    const jsonLdBlocks = await page.$$eval('script[type="application/ld+json"]', tags =>
      tags.map(t => {
        try {
          return JSON.parse(t.textContent || '');
        } catch {
          return null;
        }
      }).filter(Boolean)
    );

    let rawTitle: string | null = null;
    let currentPrice: number | null = null;
    let originalPrice: number | undefined;
    let imageUrl: string | undefined;

    const productLd = jsonLdBlocks.find(
      (b: any) =>
        b &&
        (b['@type'] === 'Product' ||
          (typeof b['@type'] === 'string' && b['@type'].includes('Product')))
    );

    if (productLd) {
      if (productLd.name && typeof productLd.name === 'string') {
        rawTitle = productLd.name;
      }
      if (productLd.offers?.price) {
        currentPrice = parseFloat(productLd.offers.price);
      }
      if (productLd.image) {
        imageUrl = Array.isArray(productLd.image) ? productLd.image[0] : productLd.image;
      }
    }

    // Strategy B: DOM extraction
    if (!rawTitle) {
      const titleEl = await page.$('h1.product_title, h1, .product-title');
      rawTitle = titleEl ? (await titleEl.textContent())?.trim() || null : null;
    }

    if (!rawTitle) {
      const ogTitle = await page.$eval('meta[property="og:title"]', el => el.getAttribute('content')).catch(() => null);
      if (ogTitle) rawTitle = ogTitle.replace(/\|.*$/i, '').trim();
    }

    if (!currentPrice) {
      const priceEl = await page.$('.price .amount, .actual-price, .product-price-box .price, ins .amount');
      const text = priceEl ? await priceEl.textContent() : null;
      if (text) {
        const parsed = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed) && parsed > 0) currentPrice = parsed;
      }
    }

    // Strike-through / Original Price
    const oldPriceEl = await page.$('.strike-price, del .amount, .old-price');
    const oldPriceText = oldPriceEl ? await oldPriceEl.textContent() : null;
    if (oldPriceText) {
      const parsed = parseFloat(oldPriceText.replace(/[^0-9.]/g, ''));
      if (!isNaN(parsed) && (!currentPrice || parsed > currentPrice)) {
        originalPrice = parsed;
      }
    }

    // Product Image
    if (!imageUrl) {
      const imgEl = await page.$('.woocommerce-product-gallery__image img, .product-main-image img');
      imageUrl = imgEl ? (await imgEl.getAttribute('src')) || undefined : undefined;
    }

    if (!rawTitle || !currentPrice) {
      console.warn(`[Sharaf DG Scraper] Incomplete data for SKU ${sku} on ${directUrl}`);
      return null;
    }

    const item: ScrapedProductItem = {
      retailerSlug: 'sharaf_dg',
      sku,
      url: directUrl,
      rawTitle,
      currentPrice,
      originalPrice,
      imageUrl,
      sellerName: 'Sharaf DG Retail',
      isFulfilledByRetailer: true,
    };

    console.log(
      `[Sharaf DG Scraper] Successfully extracted SKU ${sku}: "${rawTitle.slice(0, 40)}..." - AED ${currentPrice}`
    );
    await ingestScrapedProduct(item);
    return item;
  } catch (err: any) {
    console.error(`[Sharaf DG Scraper] Failed to scrape product ${sku}:`, err.message);
    return null;
  } finally {
    await page.close();
  }
}

export async function scrapeSharafDGSearch(
  session: BrowserSession,
  searchUrl: string,
  maxItems = 10
): Promise<ScrapedProductItem[]> {
  const page = await session.context.newPage();
  const items: ScrapedProductItem[] = [];

  try {
    console.log(`[Sharaf DG Scraper] Navigating to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(2500);

    const productCards = await page.$$('.product-inner, .product-item, .product-card');
    console.log(`[Sharaf DG Scraper] Found ${productCards.length} product items.`);

    for (const card of productCards.slice(0, maxItems)) {
      try {
        const linkEl = await card.$('a[href*="/product/"]');
        if (!linkEl) continue;

        const href = (await linkEl.getAttribute('href')) || '';
        const sku = extractSharafDGSku(href);
        if (!sku) continue;

        const titleEl = await card.$('.product-title, h2, h3, a.title');
        const rawTitle = titleEl ? (await titleEl.textContent())?.trim() : null;
        if (!rawTitle) continue;

        const priceEl = await card.$('.price .amount, .actual-price');
        const priceText = priceEl ? await priceEl.textContent() : null;
        const currentPrice = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;
        if (!currentPrice || isNaN(currentPrice)) continue;

        const oldPriceEl = await card.$('del .amount, .strike-price');
        const oldPriceText = oldPriceEl ? await oldPriceEl.textContent() : null;
        const originalPrice = oldPriceText ? parseFloat(oldPriceText.replace(/[^0-9.]/g, '')) : undefined;

        const imgEl = await card.$('img');
        const imageUrl = imgEl ? (await imgEl.getAttribute('src')) || undefined : undefined;

        const scrapedItem: ScrapedProductItem = {
          retailerSlug: 'sharaf_dg',
          sku,
          url: href,
          rawTitle,
          currentPrice,
          originalPrice,
          imageUrl,
          sellerName: 'Sharaf DG',
          isFulfilledByRetailer: true,
        };

        items.push(scrapedItem);
        console.log(`[Sharaf DG Scraper] Extracted: "${rawTitle.slice(0, 45)}..." - AED ${currentPrice}`);
        await ingestScrapedProduct(scrapedItem);
      } catch (err: any) {
        console.warn('[Sharaf DG Scraper] Card parsing error:', err.message);
      }
    }
  } catch (err: any) {
    console.error('[Sharaf DG Scraper] Search error:', err.message);
  } finally {
    await page.close();
  }

  return items;
}
