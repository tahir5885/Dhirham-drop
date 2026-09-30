import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { fetchWithScrapering, parseScraperingProduct } from '@/lib/scrapering';
import { buildAffiliateUrl } from '@/lib/affiliate';

export const maxDuration = 60; // Allow serverless execution time for live scraping

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const product = await prisma.productCanonical.findFirst({
      where: {
        OR: [{ id }, { canonicalKey: id }],
      },
      include: {
        listings: {
          include: {
            retailer: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedListings = [];
    const now = new Date();

    // Refresh priority retailers: Amazon, Noon, Sharaf DG first
    for (const listing of product.listings) {
      // Only scrape real direct product URLs (skip generic search queries)
      const isDirectProductUrl =
        listing.url &&
        !listing.url.includes('/s?k=') &&
        !listing.url.includes('/search/?') &&
        !listing.url.includes('/search?');

      if (!isDirectProductUrl) {
        updatedListings.push({
          id: listing.id,
          sku: listing.sku,
          retailerName: listing.retailer.name,
          retailerSlug: listing.retailer.slug,
          currentPrice: Number(listing.currentPrice),
          originalPrice: listing.originalPrice ? Number(listing.originalPrice) : null,
          url: listing.url,
          lastCheckedAt: listing.lastCheckedAt,
        });
        continue;
      }

      try {
        const scrapeRes = await fetchWithScrapering(listing.url, {
          proxyCountry: 'AE',
          solveCaptcha: true,
        });

        if (scrapeRes.success && scrapeRes.html) {
          const parsed = parseScraperingProduct(listing.url, scrapeRes.html);

          if (parsed.currentPrice && parsed.currentPrice > 0) {
            const updated = await prisma.retailerListing.update({
              where: { id: listing.id },
              data: {
                currentPrice: parsed.currentPrice,
                originalPrice: parsed.originalPrice || listing.originalPrice,
                rawTitle: parsed.title || listing.rawTitle,
                stockStatus: parsed.inStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                lastCheckedAt: now,
              },
              include: { retailer: true },
            });

            // Record price history point
            await prisma.priceHistory.create({
              data: {
                listingId: listing.id,
                price: parsed.currentPrice,
                currency: 'AED',
                stockStatus: parsed.inStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                recordedAt: now,
              },
            });

            updatedListings.push({
              id: updated.id,
              sku: updated.sku,
              retailerName: updated.retailer.name,
              retailerSlug: updated.retailer.slug,
              currentPrice: Number(updated.currentPrice),
              originalPrice: updated.originalPrice ? Number(updated.originalPrice) : null,
              url: updated.url,
              lastCheckedAt: now,
              wasUpdated: true,
            });
            continue;
          }
        }
      } catch (err) {
        console.error(`Error refreshing listing ${listing.sku}:`, err);
      }

      // If scrape didn't return or failed, keep existing
      updatedListings.push({
        id: listing.id,
        sku: listing.sku,
        retailerName: listing.retailer.name,
        retailerSlug: listing.retailer.slug,
        currentPrice: Number(listing.currentPrice),
        originalPrice: listing.originalPrice ? Number(listing.originalPrice) : null,
        url: listing.url,
        lastCheckedAt: listing.lastCheckedAt,
        wasUpdated: false,
      });
    }

    // Re-query fresh product stats
    const freshListings = await prisma.retailerListing.findMany({
      where: { canonicalProductId: product.id },
      include: { retailer: true },
      orderBy: { currentPrice: 'asc' },
    });

    const prices = freshListings
      .map((l) => Number(l.currentPrice))
      .filter((p) => p > 0);
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const lowestListing = freshListings.find((l) => Number(l.currentPrice) === lowestPrice);

    return NextResponse.json({
      success: true,
      message: 'Live prices updated directly from stores',
      refreshedAt: now.toISOString(),
      lowestPrice,
      highestPrice,
      lowestRetailer: lowestListing?.retailer.name || 'N/A',
      savingsAed: highestPrice - lowestPrice,
      listings: freshListings.map((l) => {
        const affiliate = buildAffiliateUrl(l.url, l.retailer.slug);
        return {
          id: l.id,
          sku: l.sku,
          retailerName: l.retailer.name,
          retailerSlug: l.retailer.slug,
          currentPrice: Number(l.currentPrice),
          originalPrice: l.originalPrice ? Number(l.originalPrice) : null,
          currency: l.currency,
          buyUrl: affiliate.url,
          stockStatus: l.stockStatus,
          lastCheckedAt: l.lastCheckedAt,
        };
      }),
    });
  } catch (error: any) {
    console.error('Refresh API failed:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
