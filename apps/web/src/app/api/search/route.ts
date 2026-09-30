import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { cleanTitle } from '@/lib/normalizer';
import { buildAffiliateUrl } from '@/lib/affiliate';
import { CATALOG_PRODUCTS, searchCatalogProducts } from '@/lib/catalog';
import { fetchWithScrapering, parseScraperingProduct, identifyRetailerFromUrl, TOP_10_UAE_RETAILERS } from '@/lib/scrapering';

export const maxDuration = 45;

interface UrlInfo {
  isUrl: boolean;
  sku?: string;
  extractedTitle?: string;
  domain?: string;
}

function parseProductUrl(urlStr: string): UrlInfo {
  try {
    const urlObj = new URL(urlStr);
    const domain = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname;

    // Amazon UAE
    if (domain.includes('amazon.')) {
      const asinMatch = pathname.match(/\/(?:dp|gp\/product|d)\/([A-Z0-9]{10})/i);
      const sku = asinMatch ? asinMatch[1].toUpperCase() : undefined;
      const titleMatch = pathname.match(/\/([^/]+)\/(?:dp|gp\/product|d)\//i);
      let extractedTitle = titleMatch ? decodeURIComponent(titleMatch[1]).replace(/[-_+]/g, ' ') : undefined;
      return { isUrl: true, sku, extractedTitle: extractedTitle || sku, domain: 'amazon.ae' };
    }

    // Noon
    if (domain.includes('noon.com')) {
      const skuMatch = pathname.match(/\/(N[0-9A-Z]+)\/p/i);
      const sku = skuMatch ? skuMatch[1].toUpperCase() : undefined;
      const titleMatch = pathname.match(/\/uae-(?:en|ar)\/([^/]+)\/N/i) || pathname.match(/\/([^/]+)\/N[0-9A-Z]+\/p/i);
      let extractedTitle = titleMatch ? decodeURIComponent(titleMatch[1]).replace(/[-_+]/g, ' ') : undefined;
      return { isUrl: true, sku, extractedTitle: extractedTitle || sku, domain: 'noon.com' };
    }

    // Sharaf DG
    if (domain.includes('sharafdg.com')) {
      const slugMatch = pathname.match(/\/product\/([^/]+)/i);
      const extractedTitle = slugMatch ? decodeURIComponent(slugMatch[1]).replace(/[-_+]/g, ' ') : undefined;
      return { isUrl: true, extractedTitle, domain: 'uae.sharafdg.com' };
    }

    // Generic fallback for any other UAE retailer
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || '';
    const cleanSegment = decodeURIComponent(lastSegment)
      .replace(/\.(html|php|aspx|htm)$/i, '')
      .replace(/[-_+]/g, ' ')
      .trim();
    return {
      isUrl: true,
      extractedTitle: cleanSegment.length > 3 ? cleanSegment : undefined,
      domain,
    };
  } catch {
    return { isUrl: false };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawQuery = (searchParams.get('q') || '').trim();
  const categoryParam = searchParams.get('category') || undefined;

  const urlInfo = parseProductUrl(rawQuery);
  let products: any[] = [];

  // 1. Direct SKU / ASIN match if URL or SKU was entered
  if (urlInfo.sku) {
    try {
      const listingMatch = await prisma.retailerListing.findFirst({
        where: {
          OR: [
            { sku: urlInfo.sku },
            { url: { contains: urlInfo.sku } },
          ],
        },
        include: {
          canonicalProduct: {
            include: {
              listings: {
                include: { retailer: true },
                orderBy: { currentPrice: 'asc' },
              },
            },
          },
        },
      });

      if (listingMatch?.canonicalProduct) {
        const p = listingMatch.canonicalProduct;
        products = [
          {
            id: p.id,
            brand: p.brand,
            model: p.model,
            normalizedName: p.normalizedName,
            canonicalKey: p.canonicalKey,
            imageUrl: p.imageUrl,
            category: p.category,
            listings: p.listings.map((l) => ({
              id: l.id,
              sku: l.sku,
              retailerName: l.retailer.name,
              retailerSlug: l.retailer.slug,
              domain: l.retailer.domain,
              rawTitle: l.rawTitle,
              currentPrice: Number(l.currentPrice),
              originalPrice: l.originalPrice ? Number(l.originalPrice) : null,
              currency: l.currency,
              url: l.url,
              stockStatus: l.stockStatus,
              rating: l.rating,
              reviewCount: l.reviewCount,
              sellerName: l.sellerName,
              isFulfilledByRetailer: l.isFulfilledByRetailer,
            })),
          },
        ];
      }
    } catch {
      // DB error fallback
    }

    // Also check static catalog by SKU
    if (products.length === 0) {
      const catMatch = CATALOG_PRODUCTS.find((p) =>
        p.listings.some(
          (l) => l.sku.toLowerCase() === urlInfo.sku!.toLowerCase() || l.url.includes(urlInfo.sku!)
        )
      );
      if (catMatch) products = [catMatch];
    }
  }

  // 2. Query search in Database if not already matched
  const effectiveQuery = urlInfo.extractedTitle || (urlInfo.isUrl ? (urlInfo.sku || '') : rawQuery);
  const cleaned = cleanTitle(effectiveQuery).trim().toLowerCase();

  const isBrowseMode = !rawQuery;
  if (products.length === 0 && (isBrowseMode || cleaned.length > 0)) {
    try {
      const dbProducts = await prisma.productCanonical.findMany({
        where: {
          ...(categoryParam && categoryParam !== 'All' ? { category: categoryParam } : {}),
          ...(cleaned
            ? {
                OR: [
                  { normalizedName: { contains: cleaned } },
                  { brand: { contains: cleaned } },
                  { model: { contains: cleaned } },
                  { canonicalKey: { contains: cleaned } },
                ],
              }
            : {}),
        },
        include: {
          listings: {
            include: { retailer: true },
            orderBy: { currentPrice: 'asc' },
          },
        },
        take: 150,
      });

      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts.map((p) => ({
          id: p.id,
          brand: p.brand,
          model: p.model,
          normalizedName: p.normalizedName,
          canonicalKey: p.canonicalKey,
          imageUrl: p.imageUrl,
          category: p.category,
          listings: p.listings.map((l) => ({
            id: l.id,
            sku: l.sku,
            retailerName: l.retailer.name,
            retailerSlug: l.retailer.slug,
            domain: l.retailer.domain,
            rawTitle: l.rawTitle,
            currentPrice: Number(l.currentPrice),
            originalPrice: l.originalPrice ? Number(l.originalPrice) : null,
            currency: l.currency,
            url: l.url,
            stockStatus: l.stockStatus,
            rating: l.rating,
            reviewCount: l.reviewCount,
            sellerName: l.sellerName,
            isFulfilledByRetailer: l.isFulfilledByRetailer,
          })),
        }));
      }
    } catch {
      // DB offline fallback
    }
  }

  // 3. Fallback to Catalog
  if (products.length === 0 && (isBrowseMode || cleaned.length > 0)) {
    products = searchCatalogProducts(cleaned, categoryParam);
  }

  // 3.5 Real-time Live Price Ingestion when pasting a direct UAE Store URL
  if (products.length === 0 && urlInfo.isUrl && rawQuery.startsWith('http')) {
    try {
      const scrapeResult = await fetchWithScrapering(rawQuery, { proxyCountry: 'AE', solveCaptcha: true });
      if (scrapeResult.success && scrapeResult.html) {
        const parsed = parseScraperingProduct(rawQuery, scrapeResult.html);
        if (parsed.title && parsed.currentPrice && parsed.currentPrice > 0) {
          const canonicalKey = cleanTitle(parsed.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80);
          const brandMatch = parsed.title.split(' ')[0] || 'UAE Store';

          const retailerSlug = parsed.retailer || identifyRetailerFromUrl(rawQuery);
          const retailerMeta = TOP_10_UAE_RETAILERS[retailerSlug] || { name: 'UAE Store', domain: 'store.ae' };

          const retailer = await prisma.retailer.upsert({
            where: { slug: retailerSlug },
            update: {},
            create: {
              name: retailerMeta.name,
              slug: retailerSlug,
              domain: retailerMeta.domain,
            },
          });

          const canonical = await prisma.productCanonical.upsert({
            where: { canonicalKey },
            update: {
              imageUrl: parsed.imageUrl || undefined,
            },
            create: {
              brand: brandMatch,
              model: parsed.title,
              normalizedName: parsed.title,
              canonicalKey,
              imageUrl: parsed.imageUrl,
              category: categoryParam || 'All Categories',
            },
          });

          const listingSku = urlInfo.sku || `sku_${Date.now()}`;
          const listing = await prisma.retailerListing.upsert({
            where: {
              retailerId_sku: {
                retailerId: retailer.id,
                sku: listingSku,
              },
            },
            update: {
              currentPrice: parsed.currentPrice,
              originalPrice: parsed.originalPrice || undefined,
              lastCheckedAt: new Date(),
            },
            create: {
              canonicalProductId: canonical.id,
              retailerId: retailer.id,
              sku: listingSku,
              url: rawQuery,
              rawTitle: parsed.title,
              currentPrice: parsed.currentPrice,
              originalPrice: parsed.originalPrice || undefined,
              currency: parsed.currency || 'AED',
              rating: parsed.rating || undefined,
              reviewCount: parsed.reviewCount || undefined,
              stockStatus: parsed.inStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
            },
          });

          const comparisonListings: any[] = [
            {
              id: listing.id,
              sku: listing.sku,
              retailerName: retailer.name,
              retailerSlug: retailer.slug,
              domain: retailer.domain,
              rawTitle: parsed.title,
              currentPrice: Number(parsed.currentPrice),
              originalPrice: parsed.originalPrice ? Number(parsed.originalPrice) : null,
              currency: parsed.currency || 'AED',
              url: rawQuery,
              stockStatus: parsed.inStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
              rating: parsed.rating || 4.8,
              reviewCount: parsed.reviewCount || 100,
              isFulfilledByRetailer: true,
            },
          ];

          const otherStores = [
            { slug: 'amazon_ae', name: 'Amazon UAE', domain: 'amazon.ae', searchUrl: (q: string) => `https://www.amazon.ae/s?k=${encodeURIComponent(q)}` },
            { slug: 'noon_ae', name: 'Noon UAE', domain: 'noon.com', searchUrl: (q: string) => `https://www.noon.com/uae-en/search/?q=${encodeURIComponent(q)}` },
            { slug: 'sharaf_dg', name: 'Sharaf DG', domain: 'uae.sharafdg.com', searchUrl: (q: string) => `https://uae.sharafdg.com/?q=${encodeURIComponent(q)}` },
            { slug: 'jumbo_ae', name: 'Jumbo Electronics', domain: 'jumbo.ae', searchUrl: (q: string) => `https://www.jumbo.ae/search?q=${encodeURIComponent(q)}` },
          ].filter((s) => s.slug !== retailerSlug);

          for (const s of otherStores) {
            comparisonListings.push({
              id: `dyn_${s.slug}_${Date.now()}`,
              sku: `${s.slug}_search`,
              retailerName: s.name,
              retailerSlug: s.slug,
              domain: s.domain,
              rawTitle: `Compare "${parsed.title.slice(0, 45)}..." on ${s.name}`,
              currentPrice: 0,
              originalPrice: null,
              currency: 'AED',
              url: s.searchUrl(parsed.title),
              stockStatus: 'IN_STOCK',
              rating: 4.7,
              reviewCount: 150,
              isFulfilledByRetailer: true,
            });
          }

          products = [
            {
              id: canonical.id,
              brand: canonical.brand,
              model: canonical.model,
              normalizedName: canonical.normalizedName,
              canonicalKey: canonical.canonicalKey,
              imageUrl: canonical.imageUrl,
              category: canonical.category,
              listings: comparisonListings,
            },
          ];
        }
      }
    } catch (e) {
      console.error('Real-time URL scraping failed:', e);
    }
  }

  // 4. Dynamic Live Comparison for unlisted items (Clean Search URLs Only)
  if (products.length === 0 && (cleaned.length > 0 || urlInfo.extractedTitle || rawQuery)) {
    const cleanSearchTerm = urlInfo.extractedTitle || urlInfo.sku || cleaned || rawQuery;
    products = [
      {
        id: 'custom_' + Date.now(),
        brand: 'UAE Comparison',
        model: cleanSearchTerm,
        normalizedName: cleanSearchTerm,
        canonicalKey: cleanSearchTerm.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
        category: categoryParam || 'All Categories',
        listings: [
          {
            id: 'dyn_amz_' + Date.now(),
            sku: 'amz_search',
            retailerName: 'Amazon UAE',
            retailerSlug: 'amazon_ae',
            domain: 'amazon.ae',
            rawTitle: `View "${cleanSearchTerm}" on Amazon.ae`,
            currentPrice: 0,
            originalPrice: null,
            currency: 'AED',
            url: urlInfo.domain?.includes('amazon')
              ? rawQuery
              : `https://www.amazon.ae/s?k=${encodeURIComponent(cleanSearchTerm)}`,
            stockStatus: 'IN_STOCK',
            rating: 4.8,
            reviewCount: 450,
            sellerName: 'Amazon.ae Prime',
            isFulfilledByRetailer: true,
          },
          {
            id: 'dyn_noon_' + Date.now(),
            sku: 'noon_search',
            retailerName: 'Noon UAE',
            retailerSlug: 'noon_ae',
            domain: 'noon.com',
            rawTitle: `View "${cleanSearchTerm}" on Noon.com`,
            currentPrice: 0,
            originalPrice: null,
            currency: 'AED',
            url: urlInfo.domain?.includes('noon')
              ? rawQuery
              : `https://www.noon.com/uae-en/search/?q=${encodeURIComponent(cleanSearchTerm)}`,
            stockStatus: 'IN_STOCK',
            rating: 4.6,
            reviewCount: 380,
            sellerName: 'Noon Express',
            isFulfilledByRetailer: true,
          },
          {
            id: 'dyn_sharaf_' + Date.now(),
            sku: 'sharaf_search',
            retailerName: 'Sharaf DG',
            retailerSlug: 'sharaf_dg',
            domain: 'uae.sharafdg.com',
            rawTitle: `Search "${cleanSearchTerm}" on Sharaf DG`,
            currentPrice: 0,
            originalPrice: null,
            currency: 'AED',
            url: `https://uae.sharafdg.com/?q=${encodeURIComponent(cleanSearchTerm)}`,
            stockStatus: 'IN_STOCK',
            rating: 4.7,
            reviewCount: 220,
            sellerName: 'Sharaf DG Retail',
            isFulfilledByRetailer: true,
          },
          {
            id: 'dyn_jumbo_' + Date.now(),
            sku: 'jumbo_search',
            retailerName: 'Jumbo Electronics',
            retailerSlug: 'jumbo_ae',
            domain: 'jumbo.ae',
            rawTitle: `Search "${cleanSearchTerm}" on Jumbo.ae`,
            currentPrice: 0,
            originalPrice: null,
            currency: 'AED',
            url: `https://www.jumbo.ae/search?q=${encodeURIComponent(cleanSearchTerm)}`,
            stockStatus: 'IN_STOCK',
            rating: 4.8,
            reviewCount: 180,
            sellerName: 'Jumbo Official',
            isFulfilledByRetailer: true,
          },
          {
            id: 'dyn_ml_' + Date.now(),
            sku: 'ml_search',
            retailerName: 'Microless',
            retailerSlug: 'microless_ae',
            domain: 'microless.com',
            rawTitle: `Search "${cleanSearchTerm}" on Microless`,
            currentPrice: 0,
            originalPrice: null,
            currency: 'AED',
            url: `https://uae.microless.com/search/?query=${encodeURIComponent(cleanSearchTerm)}`,
            stockStatus: 'IN_STOCK',
            rating: 4.9,
            reviewCount: 150,
            sellerName: 'Microless Tech',
            isFulfilledByRetailer: true,
          },
          {
            id: 'dyn_crf_' + Date.now(),
            sku: 'crf_search',
            retailerName: 'Carrefour UAE',
            retailerSlug: 'carrefour_ae',
            domain: 'carrefouruae.com',
            rawTitle: `Search "${cleanSearchTerm}" on Carrefour UAE`,
            currentPrice: 0,
            originalPrice: null,
            currency: 'AED',
            url: `https://www.carrefouruae.com/mafuae/en/search?q=${encodeURIComponent(cleanSearchTerm)}`,
            stockStatus: 'IN_STOCK',
            rating: 4.6,
            reviewCount: 190,
            sellerName: 'Carrefour UAE',
            isFulfilledByRetailer: true,
          },
          {
            id: 'dyn_vrg_' + Date.now(),
            sku: 'vrg_search',
            retailerName: 'Virgin Megastore',
            retailerSlug: 'virgin_ae',
            domain: 'virginmegastore.ae',
            rawTitle: `Search "${cleanSearchTerm}" on Virgin Megastore`,
            currentPrice: 0,
            originalPrice: null,
            currency: 'AED',
            url: `https://www.virginmegastore.ae/en/search/?text=${encodeURIComponent(cleanSearchTerm)}`,
            stockStatus: 'IN_STOCK',
            rating: 4.8,
            reviewCount: 140,
            sellerName: 'Virgin Megastore',
            isFulfilledByRetailer: true,
          },
        ],
      },
    ];
  }

  // Format products with price statistics and wrapped affiliate links
  const formattedResults = products.map((item) => {
    // Deduplicate by retailer: keep 1 best direct listing per retailer
    const seenRetailers = new Set<string>();
    const uniqueListings: any[] = [];

    const sortedListings = [...item.listings].sort((a: any, b: any) => {
      const isSearchA = a.url?.includes('/s?k=') || a.url?.includes('/search/?') || a.url?.includes('/search?');
      const isSearchB = b.url?.includes('/s?k=') || b.url?.includes('/search/?') || b.url?.includes('/search?');
      if (isSearchA && !isSearchB) return 1;
      if (!isSearchA && isSearchB) return -1;

      const pA = a.currentPrice > 0 ? a.currentPrice : Infinity;
      const pB = b.currentPrice > 0 ? b.currentPrice : Infinity;
      return pA - pB;
    });

    for (const l of sortedListings) {
      if (!seenRetailers.has(l.retailerSlug)) {
        seenRetailers.add(l.retailerSlug);
        uniqueListings.push(l);
      }
    }

    const validPricedListings = uniqueListings.filter((l: any) => l.currentPrice > 0);
    const lowest = validPricedListings.length > 0 ? validPricedListings[0] : uniqueListings[0];
    const highest = validPricedListings.length > 0 ? validPricedListings[validPricedListings.length - 1] : uniqueListings[0];
    const savingsAed = highest && lowest && highest.currentPrice > lowest.currentPrice ? highest.currentPrice - lowest.currentPrice : 0;
    const savingsPercent =
      highest && lowest && highest.currentPrice > 0 && savingsAed > 0
        ? Math.round((savingsAed / highest.currentPrice) * 100)
        : 0;

    const enrichedListings = uniqueListings.map((l: any) => {
      const affiliate = buildAffiliateUrl(l.url, l.retailerSlug);
      return {
        ...l,
        buyUrl: affiliate.url,
        isMonetized: affiliate.isMonetized,
      };
    });

    return {
      id: item.id,
      brand: item.brand,
      model: item.model,
      normalizedName: item.normalizedName,
      canonicalKey: item.canonicalKey,
      imageUrl: item.imageUrl,
      category: item.category,
      lowestPrice: lowest?.currentPrice ?? 0,
      lowestRetailer: lowest?.retailerName ?? 'N/A',
      savingsAed,
      savingsPercent,
      listingsCount: enrichedListings.length,
      listings: enrichedListings,
    };
  });

  return NextResponse.json({
    query: rawQuery,
    totalResults: formattedResults.length,
    results: formattedResults,
  });
}
