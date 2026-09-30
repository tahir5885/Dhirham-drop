import { prisma } from '../index.js';

export const StockStatus = {
  IN_STOCK: 'IN_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  PREORDER: 'PREORDER',
  UNKNOWN: 'UNKNOWN',
} as const;
export type StockStatus = (typeof StockStatus)[keyof typeof StockStatus];

export interface UpsertListingInput {
  canonicalProductId: string;
  retailerSlug: string;
  retailerName: string;
  domain: string;
  sku: string;
  url: string;
  rawTitle: string;
  currentPrice: number;
  originalPrice?: number | null;
  currency?: string;
  stockStatus?: StockStatus | string;
  rating?: number | null;
  reviewCount?: number | null;
  sellerName?: string | null;
  isFulfilledByRetailer?: boolean;
}

export class ProductService {
  /**
   * Retrieves or creates a retailer record in the database.
   */
  static async getOrCreateRetailer(slug: string, name: string, domain: string) {
    return prisma.retailer.upsert({
      where: { slug },
      update: { name, domain },
      create: {
        slug,
        name,
        domain,
        affiliateParamKey: slug === 'amazon_ae' ? 'tag' : 'utm_source',
        affiliateParamValue: slug === 'amazon_ae' ? 'dirhamdrop-21' : 'DIRHAMDROP',
      },
    });
  }

  /**
   * Finds a canonical product by its deterministic canonical key.
   */
  static async findCanonicalByKey(canonicalKey: string) {
    return prisma.productCanonical.findUnique({
      where: { canonicalKey },
      include: {
        listings: {
          include: { retailer: true },
          orderBy: { currentPrice: 'asc' },
        },
      },
    });
  }

  /**
   * Finds candidate canonical products for fuzzy matching by brand.
   */
  static async findCandidatesByBrand(brand: string, limit = 25) {
    return prisma.productCanonical.findMany({
      where: {
        brand: {
          equals: brand,
        },
      },
      include: {
        listings: {
          include: { retailer: true },
        },
      },
      take: limit,
    });
  }

  /**
   * Upserts a retailer listing and appends a time-series entry to PriceHistory.
   */
  static async upsertListing(input: UpsertListingInput) {
    const retailer = await this.getOrCreateRetailer(
      input.retailerSlug,
      input.retailerName,
      input.domain
    );

    const listing = await prisma.retailerListing.upsert({
      where: {
        retailerId_sku: {
          retailerId: retailer.id,
          sku: input.sku,
        },
      },
      update: {
        url: input.url,
        rawTitle: input.rawTitle,
        currentPrice: input.currentPrice,
        originalPrice: input.originalPrice ?? null,
        stockStatus: input.stockStatus || StockStatus.IN_STOCK,
        rating: input.rating ?? null,
        reviewCount: input.reviewCount ?? null,
        sellerName: input.sellerName ?? null,
        isFulfilledByRetailer: input.isFulfilledByRetailer ?? false,
        lastCheckedAt: new Date(),
      },
      create: {
        canonicalProductId: input.canonicalProductId,
        retailerId: retailer.id,
        sku: input.sku,
        url: input.url,
        rawTitle: input.rawTitle,
        currentPrice: input.currentPrice,
        originalPrice: input.originalPrice ?? null,
        currency: input.currency || 'AED',
        stockStatus: input.stockStatus || StockStatus.IN_STOCK,
        rating: input.rating ?? null,
        reviewCount: input.reviewCount ?? null,
        sellerName: input.sellerName ?? null,
        isFulfilledByRetailer: input.isFulfilledByRetailer ?? false,
        lastCheckedAt: new Date(),
      },
    });

    // Record time-series historical snapshot
    await prisma.priceHistory.create({
      data: {
        listingId: listing.id,
        price: input.currentPrice,
        currency: input.currency || 'AED',
        stockStatus: input.stockStatus || StockStatus.IN_STOCK,
        recordedAt: new Date(),
      },
    });

    return listing;
  }

  /**
   * Returns price history time-series data for a canonical product across all retailers.
   */
  static async getPriceHistory(canonicalProductId: string, days = 90) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const listings = await prisma.retailerListing.findMany({
      where: { canonicalProductId },
      include: {
        retailer: true,
        priceHistory: {
          where: { recordedAt: { gte: cutoff } },
          orderBy: { recordedAt: 'asc' },
        },
      },
    });

    return listings;
  }
}
