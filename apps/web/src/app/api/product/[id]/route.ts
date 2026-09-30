import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { buildAffiliateUrl } from '@/lib/affiliate';
import { getCatalogProductById, CATALOG_PRODUCTS } from '@/lib/catalog';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  let product: any = getCatalogProductById(id);

  // Try finding by ID or canonicalKey in database
  try {
    const dbProduct = await prisma.productCanonical.findFirst({
      where: {
        OR: [{ id }, { canonicalKey: id }],
      },
      include: {
        listings: {
          include: {
            retailer: true,
            priceHistory: {
              orderBy: { recordedAt: 'asc' },
              take: 30,
            },
          },
        },
      },
    });

    if (dbProduct) {
      product = {
        id: dbProduct.id,
        brand: dbProduct.brand,
        model: dbProduct.model,
        normalizedName: dbProduct.normalizedName,
        canonicalKey: dbProduct.canonicalKey,
        imageUrl: dbProduct.imageUrl,
        category: dbProduct.category,
        attributes: dbProduct.attributes ? JSON.parse(dbProduct.attributes as string) : null,
        listings: dbProduct.listings.map((l) => ({
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
        priceHistory: (() => {
          const aggregated: Record<string, any> = {};
          dbProduct.listings.forEach(listing => {
            const isAmazon = listing.retailer.slug === 'amazon_ae';
            const isNoon = listing.retailer.slug === 'noon_ae';
            const isSharaf = listing.retailer.slug === 'sharaf_dg';
            if (isAmazon || isNoon || isSharaf) {
              listing.priceHistory.forEach(h => {
                const date = new Date(h.recordedAt).toLocaleDateString('en-AE', { month: 'short', day: 'numeric' });
                if (!aggregated[date]) aggregated[date] = { date };
                if (isAmazon) aggregated[date].amazonPrice = Number(h.price);
                if (isNoon) aggregated[date].noonPrice = Number(h.price);
                if (isSharaf) aggregated[date].sharafPrice = Number(h.price);
              });
            }
          });
          return Object.values(aggregated);
        })(),
      };
    }
  } catch {
    // Database offline fallback
  }

  // Also check if id matches canonicalKey in catalog
  if (!product) {
    product = CATALOG_PRODUCTS.find((p) => p.canonicalKey === id || p.id === id);
  }

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // Calculate pricing statistics
  const prices = product.listings
    .map((l: any) => l.currentPrice)
    .filter((p: number) => p > 0);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const lowestListing = product.listings.find(
    (l: any) => l.currentPrice === lowestPrice
  );

  // Wrap listings with affiliate links and sort by price ascending
  const sortedListings = [...product.listings].sort((a: any, b: any) => {
    const pA = a.currentPrice > 0 ? a.currentPrice : Infinity;
    const pB = b.currentPrice > 0 ? b.currentPrice : Infinity;
    return pA - pB;
  });

  const enrichedListings = sortedListings.map((l: any) => {
    const affiliate = buildAffiliateUrl(l.url, l.retailerSlug);
    return {
      ...l,
      buyUrl: affiliate.url,
      isMonetized: affiliate.isMonetized,
    };
  });

  let absoluteLowestHistoryPrice = Infinity;
  let sumHistoryPrice = 0;
  let historyCount = 0;
  product.priceHistory?.forEach((h: any) => {
    const pricesForDate = [h.amazonPrice, h.noonPrice, h.sharafPrice].filter((p) => p && p > 0);
    if (pricesForDate.length > 0) {
      const minForDate = Math.min(...pricesForDate);
      if (minForDate < absoluteLowestHistoryPrice) absoluteLowestHistoryPrice = minForDate;
      sumHistoryPrice += minForDate;
      historyCount++;
    }
  });
  
  const avgHistoryPrice = historyCount > 0 ? sumHistoryPrice / historyCount : highestPrice;
  let dealScore = 'AVERAGE';
  if (absoluteLowestHistoryPrice !== Infinity && lowestPrice <= absoluteLowestHistoryPrice * 1.05) {
    dealScore = 'EXCELLENT';
  } else if (lowestPrice <= avgHistoryPrice) {
    dealScore = 'GOOD';
  }

  return NextResponse.json({
    product: {
      ...product,
      lowestPrice,
      highestPrice,
      lowestRetailer: lowestListing?.retailerName || 'N/A',
      savingsAed: highestPrice - lowestPrice,
      savingsPercent:
        highestPrice > 0
          ? Math.round(((highestPrice - lowestPrice) / highestPrice) * 100)
          : 0,
      dealScore,
      listings: enrichedListings,
    },
  });
}
