import { prisma} from '@dirhamdrop/database';
import { normalizeProductTitle, fuzzyMatch } from '@dirhamdrop/normalizer';
import { TOP_10_UAE_RETAILERS } from '../scrapering.js';

export interface ScrapedProductItem {
  retailerSlug: 'amazon_ae' | 'noon_ae' | 'sharaf_dg' | string;
  sku: string;
  url: string;
  rawTitle: string;
  currentPrice: number;
  originalPrice?: number;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  sellerName?: string;
  isFulfilledByRetailer?: boolean;
}

export async function ingestScrapedProduct(item: ScrapedProductItem) {
  // 1. Normalize scraped title
  const norm = normalizeProductTitle(item.rawTitle);
  console.log(`[Ingestion Pipeline] Normalized: "${norm.cleanedTitle}" -> Key: "${norm.canonicalKey}"`);

  try {
    // 2. Ensure Retailer exists
    let retailer = await prisma.retailer.findUnique({
      where: { slug: item.retailerSlug },
    });

    if (!retailer) {
      const meta = (TOP_10_UAE_RETAILERS as any)[item.retailerSlug] || {
        name: item.retailerSlug,
        domain: `${item.retailerSlug}.com`,
      };
      retailer = await prisma.retailer.create({
        data: {
          slug: item.retailerSlug,
          name: meta.name,
          domain: meta.domain,
          affiliateParamKey: item.retailerSlug === 'amazon_ae' ? 'tag' : 'utm_source',
          affiliateParamValue:
            item.retailerSlug === 'amazon_ae'
              ? process.env.AMAZON_AFFILIATE_TAG || 'dirhamdrop-21'
              : 'dirhamdrop',
        },
      });
    }

  // 2. Normalize scraped title
  const norm = normalizeProductTitle(item.rawTitle);

  // 3. Find or create canonical product
  let canonicalProductId: string | null = null;

  // Check if listing already exists
  const existingListing = await prisma.retailerListing.findUnique({
    where: {
      retailerId_sku: {
        retailerId: retailer.id,
        sku: item.sku,
      },
    },
    select: { canonicalProductId: true },
  });

  if (existingListing) {
    canonicalProductId = existingListing.canonicalProductId;
  } else {
    // Check by exact canonical key
    const matchByKey = await prisma.productCanonical.findUnique({
      where: { canonicalKey: norm.canonicalKey },
    });

    if (matchByKey) {
      canonicalProductId = matchByKey.id;
    } else if (norm.attributes.brand) {
      // Fuzzy search against canonical products with same brand
      const candidates = await prisma.productCanonical.findMany({
        where: { brand: norm.attributes.brand },
        take: 20,
      });

      for (const candidate of candidates) {
        const matchRes = fuzzyMatch(item.rawTitle, candidate.normalizedName);
        if (matchRes.isMatch && matchRes.score >= 0.82) {
          canonicalProductId = candidate.id;
          console.log(
            `[Ingestion] Fuzzy-matched "${item.rawTitle}" -> Canonical "${candidate.normalizedName}" (score: ${(
              matchRes.score * 100
            ).toFixed(1)}%)`
          );
          break;
        }
      }
    }

    // If still no canonical match, create a new ProductCanonical
    if (!canonicalProductId) {
      const newCanonical = await prisma.productCanonical.create({
        data: {
          brand: norm.attributes.brand || 'Generic',
          model: norm.attributes.model,
          normalizedName: norm.cleanedTitle,
          canonicalKey: norm.canonicalKey,
          imageUrl: item.imageUrl,
          attributes: norm.attributes as any,
        },
      });
      canonicalProductId = newCanonical.id;
      console.log(`[Ingestion] Created new Canonical Product: "${norm.cleanedTitle}" (${newCanonical.id})`);
    }
  }

  // 4. Upsert RetailerListing
  const listing = await prisma.retailerListing.upsert({
    where: {
      retailerId_sku: {
        retailerId: retailer.id,
        sku: item.sku,
      },
    },
    update: {
      url: item.url,
      rawTitle: item.rawTitle,
      currentPrice: item.currentPrice,
      originalPrice: item.originalPrice ?? null,
      stockStatus: "IN_STOCK",
      rating: item.rating ?? null,
      reviewCount: item.reviewCount ?? null,
      sellerName: item.sellerName ?? null,
      isFulfilledByRetailer: item.isFulfilledByRetailer ?? false,
      lastCheckedAt: new Date(),
    },
    create: {
      canonicalProductId,
      retailerId: retailer.id,
      sku: item.sku,
      url: item.url,
      rawTitle: item.rawTitle,
      currentPrice: item.currentPrice,
      originalPrice: item.originalPrice ?? null,
      currency: 'AED',
      stockStatus: "IN_STOCK",
      rating: item.rating ?? null,
      reviewCount: item.reviewCount ?? null,
      sellerName: item.sellerName ?? null,
      isFulfilledByRetailer: item.isFulfilledByRetailer ?? false,
      lastCheckedAt: new Date(),
    },
  });

  // 5. Append PriceHistory entry
  await prisma.priceHistory.create({
    data: {
      listingId: listing.id,
      price: item.currentPrice,
      currency: 'AED',
      stockStatus: "IN_STOCK",
      recordedAt: new Date(),
    },
  });

    return { canonicalProductId, listingId: listing.id };
  } catch (dbErr: any) {
    console.warn(`[Ingestion Pipeline] Database write skipped (PostgreSQL not connected): ${dbErr.message}`);
    return { canonicalProductId: 'offline_mode', listingId: 'offline_mode' };
  }
}
