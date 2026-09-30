import { NextResponse } from 'next/server';
import { prisma } from '@dirhamdrop/database';
import { buildAffiliateUrl } from '@/lib/affiliate';

export async function GET() {
  try {
    const products = await prisma.productCanonical.findMany({
      include: {
        listings: {
          include: {
            retailer: true,
          },
        },
      },
    });

    const deals = products.map((product) => {
      const validListings = product.listings.filter((l) => Number(l.currentPrice) > 0);
      if (validListings.length === 0) return null;

      const sortedListings = validListings.sort((a, b) => Number(a.currentPrice) - Number(b.currentPrice));
      const lowest = sortedListings[0];
      const highest = sortedListings[sortedListings.length - 1];

      const currentPrice = Number(lowest.currentPrice);
      const originalPrice = lowest.originalPrice ? Number(lowest.originalPrice) : Number(highest.currentPrice);
      
      const savingsAed = originalPrice > currentPrice ? originalPrice - currentPrice : 0;
      const savingsPercent = originalPrice > 0 ? Math.round((savingsAed / originalPrice) * 100) : 0;

      const affiliate = buildAffiliateUrl(lowest.url, lowest.retailer.slug);

      return {
        id: product.canonicalKey,
        brand: product.brand,
        name: product.normalizedName,
        category: product.category,
        imageUrl: product.imageUrl,
        originalPrice,
        currentPrice,
        savingsAed,
        savingsPercent,
        bestRetailer: lowest.retailer.name,
        retailerSlug: lowest.retailer.slug,
        buyUrl: affiliate.url,
        badgeText: savingsPercent > 40 ? `Huge ${savingsPercent}% Discount` : savingsPercent > 20 ? 'Lowest Price in 30 Days' : 'Verified Deal',
      };
    }).filter(Boolean);

    // Sort by savings % descending
    deals.sort((a, b) => (b?.savingsPercent || 0) - (a?.savingsPercent || 0));

    return NextResponse.json({ deals: deals.slice(0, 10) }); // Return top 10 deals
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}
