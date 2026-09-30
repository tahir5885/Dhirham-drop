/**
 * Scrapering.com API Client for DirhamDrop
 * Bypasses anti-bot mechanisms, solves CAPTCHAs, and renders JavaScript
 * using residential UAE proxies across the Top 10 UAE e-commerce platforms.
 * Docs: https://scrapering.com/docs/getting-started/
 */

export interface ScraperingParseOptions {
  proxyCountry?: string; // Default: 'AE' (United Arab Emirates)
  solveCaptcha?: boolean;
  takeScreenshot?: boolean;
  apiKey?: string;
}

export type SupportedRetailerSlug =
  | 'amazon_ae'
  | 'noon_ae'
  | 'sharaf_dg'
  | 'jumbo_ae'
  | 'carrefour_ae'
  | 'microless_ae'
  | 'virgin_ae'
  | 'lulu_ae'
  | 'emax_ae'
  | 'namshi_ae'
  | 'other';

export interface ParsedProductData {
  url: string;
  retailer: SupportedRetailerSlug;
  retailerName: string;
  title: string | null;
  currentPrice: number | null;
  originalPrice: number | null;
  currency: string;
  inStock: boolean;
  rating: number | null;
  reviewCount: number | null;
  imageUrl: string | null;
}

export const TOP_10_UAE_RETAILERS: Record<
  SupportedRetailerSlug,
  { name: string; domain: string; defaultColor: string }
> = {
  amazon_ae: { name: 'Amazon UAE', domain: 'amazon.ae', defaultColor: '#ff9900' },
  noon_ae: { name: 'Noon UAE', domain: 'noon.com', defaultColor: '#feee00' },
  sharaf_dg: { name: 'Sharaf DG', domain: 'uae.sharafdg.com', defaultColor: '#002f6c' },
  jumbo_ae: { name: 'Jumbo Electronics', domain: 'jumbo.ae', defaultColor: '#e31837' },
  carrefour_ae: { name: 'Carrefour UAE', domain: 'carrefouruae.com', defaultColor: '#004f9f' },
  microless_ae: { name: 'Microless', domain: 'microless.com', defaultColor: '#ff6600' },
  virgin_ae: { name: 'Virgin Megastore', domain: 'virginmegastore.ae', defaultColor: '#e10a0a' },
  lulu_ae: { name: 'LuLu Hypermarket', domain: 'luluhypermarket.com', defaultColor: '#008744' },
  emax_ae: { name: 'Emax Electronics', domain: 'emaxme.com', defaultColor: '#d61f26' },
  namshi_ae: { name: 'Namshi UAE', domain: 'namshi.com', defaultColor: '#000000' },
  other: { name: 'UAE Store', domain: 'store.ae', defaultColor: '#059669' },
};

export function identifyRetailerFromUrl(url: string): SupportedRetailerSlug {
  const lower = url.toLowerCase();
  if (lower.includes('amazon.ae') || lower.includes('amazon.')) return 'amazon_ae';
  if (lower.includes('noon.com')) return 'noon_ae';
  if (lower.includes('sharafdg.com')) return 'sharaf_dg';
  if (lower.includes('jumbo.ae')) return 'jumbo_ae';
  if (lower.includes('carrefouruae.com')) return 'carrefour_ae';
  if (lower.includes('microless.com')) return 'microless_ae';
  if (lower.includes('virginmegastore.ae')) return 'virgin_ae';
  if (lower.includes('luluhypermarket.com')) return 'lulu_ae';
  if (lower.includes('emaxme.com')) return 'emax_ae';
  if (lower.includes('namshi.com')) return 'namshi_ae';
  return 'other';
}

export async function fetchWithScrapering(
  targetUrl: string,
  options: ScraperingParseOptions = {}
): Promise<{ success: boolean; data?: any; html?: string; error?: string }> {
  const apiKey =
    options.apiKey ||
    process.env.SCRAPERING_API_KEY ||
    'default_1nO6On_qD_SOmqBd5U5KcP805pIlC0-UYMdgD7Rez7Y';

  if (!apiKey) {
    return {
      success: false,
      error: 'SCRAPERING_API_KEY is not set. Please provide your API key in .env or pass it manually.',
    };
  }

  const endpoint = 'https://app.scrapering.com/api/parsing/v1/url';

  try {
    // 1. Submit Parsing Task to Scrapering.com
    const submitResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: targetUrl,
        region: options.proxyCountry || 'AE',
        output: { html: true, markdown: false, text: false, json: false },
        useragent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      }),
    });

    if (!submitResponse.ok) {
      const errText = await submitResponse.text().catch(() => '');
      return {
        success: false,
        error: `Scrapering API task submission returned status ${submitResponse.status}: ${errText}`,
      };
    }

    const taskData = await submitResponse.json();
    const taskId = taskData.id || taskData.requestId;

    if (!taskId) {
      return {
        success: false,
        error: 'Scrapering API did not return a valid task/request ID.',
      };
    }

    // 2. Poll Result Endpoint until parsing is 'ready' (max 10 attempts, 1.5s interval)
    const resultEndpoint = `https://app.scrapering.com/api/parsing/v1/result/url/${taskId}`;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      // Wait 1.5s between polls
      await new Promise((resolve) => setTimeout(resolve, 1500));
      attempts++;

      try {
        const pollResponse = await fetch(resultEndpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        if (pollResponse.ok) {
          const pollResult = await pollResponse.json();
          if (pollResult.status === 'ready' && pollResult.data) {
            const rawContent =
              pollResult.data.content ||
              pollResult.data.html ||
              (typeof pollResult.data === 'string' ? pollResult.data : '');
            return {
              success: true,
              data: pollResult.data,
              html: rawContent,
            };
          }
        }
      } catch {
        // Retry next attempt
      }
    }

    return {
      success: false,
      error: `Scrapering API parsing timed out after ${maxAttempts * 1.5}s for task ${taskId}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Network error connecting to Scrapering API: ${err.message}`,
    };
  }
}

/**
 * Universal HTML/JSON product extractor across the Top 10 UAE e-commerce platforms
 */
export function parseScraperingProduct(url: string, htmlOrText: string): ParsedProductData {
  const retailerSlug = identifyRetailerFromUrl(url);
  const retailerMeta = TOP_10_UAE_RETAILERS[retailerSlug];

  const parsed: ParsedProductData = {
    url,
    retailer: retailerSlug,
    retailerName: retailerMeta.name,
    title: null,
    currentPrice: null,
    originalPrice: null,
    currency: 'AED',
    inStock: true,
    rating: null,
    reviewCount: null,
    imageUrl: null,
  };

  // 1. Universal JSON-LD / schema.org extraction
  try {
    const jsonLdMatches = htmlOrText.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of jsonLdMatches) {
      try {
        const data = JSON.parse(match[1]);
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item['@type'] === 'Product' || (typeof item['@type'] === 'string' && item['@type'].includes('Product'))) {
            if (item.name && typeof item.name === 'string') parsed.title = item.name.trim();
            if (item.image) {
              parsed.imageUrl = Array.isArray(item.image) ? item.image[0] : typeof item.image === 'string' ? item.image : item.image?.url;
            }
            const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            if (offer?.price) {
              const p = parseFloat(offer.price);
              if (!isNaN(p) && p > 0) parsed.currentPrice = p;
            }
            if (offer?.priceCurrency) parsed.currency = offer.priceCurrency;
          }
        }
      } catch {
        // Skip malformed script tags
      }
    }
  } catch {
    // Continue with regex fallback
  }

  // 2. OpenGraph Fallback
  if (!parsed.title) {
    const ogTitleMatch = htmlOrText.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    if (ogTitleMatch) parsed.title = ogTitleMatch[1].replace(/\|.*$/i, '').trim();
  }
  if (!parsed.imageUrl) {
    const ogImgMatch = htmlOrText.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (ogImgMatch) parsed.imageUrl = ogImgMatch[1];
  }

  // 3. Retailer-Specific Selectors & Regex Tuning
  switch (retailerSlug) {
    case 'amazon_ae': {
      if (!parsed.title) {
        const titleMatch = htmlOrText.match(/id=["']productTitle["'][^>]*>\s*([^<]+)\s*</i);
        if (titleMatch) parsed.title = titleMatch[1].trim();
      }
      const priceMatch = htmlOrText.match(/class=["'](?:apexPriceToPay|priceToPay|a-price)["'][^>]*>[\s\S]*?class=["']a-offscreen["'][^>]*>AED\s*([\d,]+(?:\.\d+)?)/i);
      if (priceMatch) parsed.currentPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
      const origPriceMatch = htmlOrText.match(/class=["'](?:a-text-price|basisPrice)["'][^>]*>[\s\S]*?class=["']a-offscreen["'][^>]*>AED\s*([\d,]+(?:\.\d+)?)/i);
      if (origPriceMatch) parsed.originalPrice = parseFloat(origPriceMatch[1].replace(/,/g, ''));
      const ratingMatch = htmlOrText.match(/([0-9.]+) out of 5 stars/i);
      if (ratingMatch) parsed.rating = parseFloat(ratingMatch[1]);
      break;
    }

    case 'noon_ae': {
      if (!parsed.currentPrice) {
        const offerPriceMatch = htmlOrText.match(/"offers":\s*\{[^}]*?"price":\s*"?([0-9\.]+)"?/i);
        if (offerPriceMatch) parsed.currentPrice = parseFloat(offerPriceMatch[1]);
      }
      if (!parsed.title) {
        const titleMatch = htmlOrText.match(/<h1[^>]*data-qa=["']div-product-name["'][^>]*>([^<]+)<\/h1>/i);
        if (titleMatch) parsed.title = titleMatch[1].trim();
      }
      const oldPriceMatch = htmlOrText.match(/class=["'](?:oldPrice|was)["'][^>]*>AED\s*([0-9,]+(?:\.[0-9]+)?)/i);
      if (oldPriceMatch) parsed.originalPrice = parseFloat(oldPriceMatch[1].replace(/,/g, ''));
      break;
    }

    case 'sharaf_dg': {
      if (!parsed.currentPrice) {
        const priceMatch = htmlOrText.match(/class=["'](?:price|actual-price)["'][^>]*>[\s\S]*?AED\s*([0-9,]+(?:\.[0-9]+)?)/i);
        if (priceMatch) parsed.currentPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
      }
      if (!parsed.title) {
        const titleMatch = htmlOrText.match(/<h1[^>]*class=["'][^"']*product_title[^"']*["'][^>]*>([^<]+)<\/h1>/i);
        if (titleMatch) parsed.title = titleMatch[1].trim();
      }
      break;
    }

    case 'jumbo_ae': {
      if (!parsed.currentPrice) {
        const jumboPrice = htmlOrText.match(/class=["'](?:price-box|special-price)["'][^>]*>[\s\S]*?AED\s*([0-9,]+(?:\.[0-9]+)?)/i) ||
                           htmlOrText.match(/"price":\s*"?([0-9\.]+)"?/i);
        if (jumboPrice) parsed.currentPrice = parseFloat(jumboPrice[1].replace(/,/g, ''));
      }
      break;
    }

    case 'carrefour_ae': {
      if (!parsed.currentPrice) {
        const cfPrice = htmlOrText.match(/"price":\s*"?([0-9\.]+)"?/i) ||
                        htmlOrText.match(/class=["'](?:css-1793740|price)["'][^>]*>AED\s*([0-9,]+(?:\.[0-9]+)?)/i);
        if (cfPrice) parsed.currentPrice = parseFloat(cfPrice[1].replace(/,/g, ''));
      }
      break;
    }

    case 'microless_ae': {
      if (!parsed.currentPrice) {
        const microPrice = htmlOrText.match(/class=["']product-price["'][^>]*>[\s\S]*?AED\s*([0-9,]+(?:\.[0-9]+)?)/i) ||
                           htmlOrText.match(/itemprop=["']price["'][^>]*content=["']([0-9\.]+)["']/i);
        if (microPrice) parsed.currentPrice = parseFloat(microPrice[1].replace(/,/g, ''));
      }
      break;
    }

    case 'virgin_ae': {
      if (!parsed.currentPrice) {
        const virginPrice = htmlOrText.match(/class=["']price["'][^>]*>AED\s*([0-9,]+(?:\.[0-9]+)?)/i) ||
                            htmlOrText.match(/"price":\s*"?([0-9\.]+)"?/i);
        if (virginPrice) parsed.currentPrice = parseFloat(virginPrice[1].replace(/,/g, ''));
      }
      break;
    }

    case 'lulu_ae': {
      if (!parsed.currentPrice) {
        const luluPrice = htmlOrText.match(/class=["']item-price["'][^>]*>AED\s*([0-9,]+(?:\.[0-9]+)?)/i) ||
                          htmlOrText.match(/"price":\s*"?([0-9\.]+)"?/i);
        if (luluPrice) parsed.currentPrice = parseFloat(luluPrice[1].replace(/,/g, ''));
      }
      break;
    }

    case 'emax_ae': {
      if (!parsed.currentPrice) {
        const emaxPrice = htmlOrText.match(/class=["']special-price["'][^>]*>AED\s*([0-9,]+(?:\.[0-9]+)?)/i) ||
                          htmlOrText.match(/"price":\s*"?([0-9\.]+)"?/i);
        if (emaxPrice) parsed.currentPrice = parseFloat(emaxPrice[1].replace(/,/g, ''));
      }
      break;
    }

    case 'namshi_ae': {
      if (!parsed.currentPrice) {
        const namshiPrice = htmlOrText.match(/"price":\s*"?([0-9\.]+)"?/i) ||
                            htmlOrText.match(/class=["']selling-price["'][^>]*>AED\s*([0-9,]+(?:\.[0-9]+)?)/i);
        if (namshiPrice) parsed.currentPrice = parseFloat(namshiPrice[1].replace(/,/g, ''));
      }
      break;
    }
  }

  return parsed;
}
