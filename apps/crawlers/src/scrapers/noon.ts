import { BrowserSession } from '../stealth-browser.js';
import { ingestScrapedProduct, ScrapedProductItem } from '../services/ingestion.js';

export function extractNoonSku(urlOrSku: string): string | null {
  if (/^N[0-9A-Z]+$/i.test(urlOrSku.trim())) {
    return urlOrSku.trim();
  }
  const match = urlOrSku.match(/(N[0-9A-Z]+)\/p/i) || urlOrSku.match(/(N[0-9A-Z]+)/i);
  return match ? match[1] : null;
}

export async function scrapeNoonProduct(
  session: BrowserSession,
  urlOrSku: string
): Promise<ScrapedProductItem | null> {
  const sku = extractNoonSku(urlOrSku);
  if (!sku) {
    console.error(`[Noon Scraper] Invalid Noon SKU or URL: ${urlOrSku}`);
    return null;
  }

  const directUrl = urlOrSku.startsWith('http')
    ? urlOrSku
    : `https://www.noon.com/uae-en/product/${sku}/p/`;

  const page = await session.context.newPage();

  try {
    console.log(`[Noon Scraper] Fetching direct product page: ${directUrl}`);
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

    const productLd = jsonLdBlocks.find((b: any) => b && (b['@type'] === 'Product' || (typeof b['@type'] === 'string' && b['@type'].includes('Product'))));
    if (productLd) {
      if (productLd.name && typeof productLd.name === 'string' && productLd.name.toLowerCase() !== 'noon') {
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
    if (!rawTitle || rawTitle.toLowerCase() === 'noon') {
      const titleEl = await page.$('h1[data-qa="div-product-name"], h1');
      const h1Text = titleEl ? (await titleEl.textContent())?.trim() : null;
      if (h1Text && h1Text.toLowerCase() !== 'noon') {
        rawTitle = h1Text;
      } else {
        const docTitle = await page.title();
        rawTitle = docTitle.replace(/\|.*$/i, '').trim();
      }
    }

    if (!currentPrice) {
      const priceEl = await page.$('div[data-qa="div-price-now"], strong.amount');
      const text = priceEl ? await priceEl.textContent() : null;
      if (text) {
        const parsed = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed) && parsed > 0) currentPrice = parsed;
      }
    }

    // Old Price
    const oldPriceEl = await page.$('span.oldPrice, div[data-qa="div-price-was"], .was');
    const oldPriceText = oldPriceEl ? await oldPriceEl.textContent() : null;
    if (oldPriceText) {
      const parsed = parseFloat(oldPriceText.replace(/[^0-9.]/g, ''));
      if (!isNaN(parsed) && (!currentPrice || parsed > currentPrice)) {
        originalPrice = parsed;
      }
    }

    if (!rawTitle || !currentPrice) {
      console.warn(`[Noon Scraper] Incomplete data for SKU ${sku} on ${directUrl}`);
      return null;
    }

    // Express Badge
    const expressEl = await page.$('img[alt="noon-express"], [data-qa="noon-express"]');
    const isFulfilledByRetailer = !!expressEl;

    // Seller
    const sellerEl = await page.$('[data-qa="seller-name"], [data-qa="div-sold-by"] a');
    const sellerName = sellerEl ? (await sellerEl.textContent())?.trim() : 'Noon Express';

    const item: ScrapedProductItem = {
      retailerSlug: 'noon_ae',
      sku,
      url: directUrl,
      rawTitle,
      currentPrice,
      originalPrice,
      imageUrl,
      sellerName: isFulfilledByRetailer ? 'Noon Express' : sellerName,
      isFulfilledByRetailer,
    };

    console.log(`[Noon Scraper] Successfully extracted SKU ${sku}: "${rawTitle.slice(0, 40)}..." - AED ${currentPrice}`);
    await ingestScrapedProduct(item);
    return item;
  } catch (err: any) {
    console.error(`[Noon Scraper] Failed to scrape product ${sku}:`, err.message);
    return null;
  } finally {
    await page.close();
  }
}

export async function scrapeNoonSearch(
  session: BrowserSession,
  searchUrl: string,
  maxItems = 10
): Promise<ScrapedProductItem[]> {
  const page = await session.context.newPage();
  const items: ScrapedProductItem[] = [];

  try {
    console.log(`[Noon Scraper] Navigating with stealth to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(2000);

    // Strategy A: Check for rich __NEXT_DATA__ script
    const nextDataJson = await page.evaluate(() => {
      const el = document.getElementById('__NEXT_DATA__');
      if (el && el.textContent) {
        try {
          return JSON.parse(el.textContent);
        } catch {
          return null;
        }
      }
      return null;
    });

    const hits =
      nextDataJson?.props?.pageProps?.catalog?.hits ||
      nextDataJson?.props?.pageProps?.initialData?.hits ||
      [];

    if (hits.length > 0) {
      console.log(`[Noon Scraper] Discovered ${hits.length} products via __NEXT_DATA__ catalog payload!`);
      for (const hit of hits.slice(0, maxItems)) {
        try {
          const sku = hit.sku || hit.product_id;
          if (!sku) continue;

          const rawTitle = hit.name || hit.title;
          const currentPrice = hit.price || hit.sale_price;
          if (!rawTitle || !currentPrice) continue;

          const cleanUrl = `https://www.noon.com/uae-en/${hit.url_key || 'product'}/${sku}/p/`;
          const imageUrl = hit.image_key
            ? `https://f.nooncdn.com/products/tr:n-t_400/${hit.image_key}.jpg`
            : undefined;

          const scrapedItem: ScrapedProductItem = {
            retailerSlug: 'noon_ae',
            sku,
            url: cleanUrl,
            rawTitle,
            currentPrice: parseFloat(currentPrice),
            originalPrice: hit.was_price ? parseFloat(hit.was_price) : undefined,
            imageUrl,
            rating: hit.rating ? parseFloat(hit.rating) : undefined,
            reviewCount: hit.rating_count ? parseInt(hit.rating_count, 10) : undefined,
            sellerName: hit.brand || 'Noon Seller',
            isFulfilledByRetailer: hit.is_fbn || hit.flags?.is_fbn || true,
          };

          items.push(scrapedItem);
          console.log(`[Noon Scraper] Extracted: "${rawTitle.slice(0, 50)}..." - AED ${currentPrice}`);
          await ingestScrapedProduct(scrapedItem);
        } catch (hitErr) {
          console.warn('[Noon Scraper] Failed to parse hit:', hitErr);
        }
      }
      return items;
    }

    // Strategy B: DOM Fallback
    console.log('[Noon Scraper] Falling back to DOM selector extraction...');
    const productLinks = await page.$$('a[href*="/p/"]');
    console.log(`[Noon Scraper] Found ${productLinks.length} product links in DOM.`);

    for (const link of productLinks.slice(0, maxItems)) {
      try {
        const href = (await link.getAttribute('href')) || '';
        const skuMatch = href.match(/(N[0-9A-Z]+)\/p/);
        if (!skuMatch) continue;
        const sku = skuMatch[1];

        const titleEl = await link.$('div[data-qa="product-name"], span[title], h2');
        const rawTitle = titleEl ? (await titleEl.textContent())?.trim() : null;
        if (!rawTitle) continue;

        const priceEl = await link.$('strong.amount, div[data-qa="div-price-now"]');
        const priceText = priceEl ? await priceEl.textContent() : null;
        const currentPrice = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;
        if (!currentPrice || isNaN(currentPrice)) continue;

        const origPriceEl = await link.$('span.oldPrice, div[data-qa="div-price-was"]');
        const origPriceText = origPriceEl ? await origPriceEl.textContent() : null;
        const originalPrice = origPriceText
          ? parseFloat(origPriceText.replace(/[^0-9.]/g, ''))
          : undefined;

        const imgEl = await link.$('img');
        const imageUrl = imgEl ? (await imgEl.getAttribute('src')) || undefined : undefined;

        const cleanUrl = href.startsWith('http') ? href : `https://www.noon.com${href}`;

        const scrapedItem: ScrapedProductItem = {
          retailerSlug: 'noon_ae',
          sku,
          url: cleanUrl,
          rawTitle,
          currentPrice,
          originalPrice,
          imageUrl,
          sellerName: 'Noon Express',
          isFulfilledByRetailer: true,
        };

        items.push(scrapedItem);
        console.log(`[Noon Scraper] Extracted: "${rawTitle.slice(0, 50)}..." - AED ${currentPrice}`);
        await ingestScrapedProduct(scrapedItem);
      } catch (domErr) {
        console.warn('[Noon Scraper] Failed DOM item extraction:', domErr);
      }
    }
  } catch (err) {
    console.error('[Noon Scraper] Error scraping Noon:', err);
  } finally {
    await page.close();
  }

  return items;
}
