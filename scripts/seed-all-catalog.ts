import { PrismaClient } from '@prisma/client';
import { CATALOG_PRODUCTS } from '../apps/web/src/lib/catalog';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ALL 20 Catalog Products into SQLite DB...');

  // Ensure top 10 retailers exist
  const retailerSlugs = [
    { name: 'Amazon UAE', slug: 'amazon_ae', domain: 'amazon.ae' },
    { name: 'Noon UAE', slug: 'noon_ae', domain: 'noon.com' },
    { name: 'Sharaf DG', slug: 'sharaf_dg', domain: 'uae.sharafdg.com' },
    { name: 'Jumbo Electronics', slug: 'jumbo_ae', domain: 'jumbo.ae' },
    { name: 'Carrefour UAE', slug: 'carrefour_ae', domain: 'carrefouruae.com' },
    { name: 'Microless', slug: 'microless_ae', domain: 'microless.com' },
    { name: 'Virgin Megastore', slug: 'virgin_ae', domain: 'virginmegastore.ae' },
    { name: 'LuLu Hypermarket', slug: 'lulu_ae', domain: 'luluhypermarket.com' },
    { name: 'Emax Electronics', slug: 'emax_ae', domain: 'emaxme.com' },
    { name: 'Namshi UAE', slug: 'namshi_ae', domain: 'namshi.com' },
  ];

  const retailerMap = new Map<string, string>();
  for (const r of retailerSlugs) {
    const record = await prisma.retailer.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        name: r.name,
        slug: r.slug,
        domain: r.domain,
        isActive: true,
      },
    });
    retailerMap.set(r.slug, record.id);
  }

  for (const p of CATALOG_PRODUCTS) {
    const canonical = await prisma.productCanonical.upsert({
      where: { canonicalKey: p.canonicalKey },
      update: {
        brand: p.brand,
        model: p.model,
        normalizedName: p.normalizedName,
        category: p.category,
        imageUrl: p.imageUrl,
        attributes: p.attributes ? JSON.stringify(p.attributes) : null,
      },
      create: {
        brand: p.brand,
        model: p.model,
        normalizedName: p.normalizedName,
        canonicalKey: p.canonicalKey,
        category: p.category,
        imageUrl: p.imageUrl,
        attributes: p.attributes ? JSON.stringify(p.attributes) : null,
      },
    });

    for (const l of p.listings) {
      const retailerId = retailerMap.get(l.retailerSlug) || retailerMap.get('amazon_ae')!;
      const sku = l.sku || `${l.retailerSlug}_${canonical.canonicalKey}`.slice(0, 30);

      const listing = await prisma.retailerListing.upsert({
        where: {
          retailerId_sku: {
            retailerId,
            sku,
          },
        },
        update: {
          currentPrice: l.currentPrice,
          originalPrice: l.originalPrice ?? undefined,
          url: l.url,
          rawTitle: l.rawTitle,
          stockStatus: l.stockStatus || 'IN_STOCK',
          rating: l.rating ?? undefined,
          reviewCount: l.reviewCount ?? undefined,
          sellerName: l.sellerName ?? undefined,
          isFulfilledByRetailer: l.isFulfilledByRetailer,
        },
        create: {
          canonicalProductId: canonical.id,
          retailerId,
          sku,
          url: l.url,
          rawTitle: l.rawTitle,
          currentPrice: l.currentPrice,
          originalPrice: l.originalPrice ?? undefined,
          currency: l.currency || 'AED',
          stockStatus: l.stockStatus || 'IN_STOCK',
          rating: l.rating ?? undefined,
          reviewCount: l.reviewCount ?? undefined,
          sellerName: l.sellerName ?? undefined,
          isFulfilledByRetailer: l.isFulfilledByRetailer,
        },
      });

      // Price history points if present
      if (p.priceHistory && p.priceHistory.length > 0) {
        for (const h of p.priceHistory) {
          let price = l.currentPrice;
          if (l.retailerSlug === 'amazon_ae' && h.amazonPrice) price = h.amazonPrice;
          if (l.retailerSlug === 'noon_ae' && h.noonPrice) price = h.noonPrice;
          if (l.retailerSlug === 'sharaf_dg' && h.sharafPrice) price = h.sharafPrice;

          await prisma.priceHistory.create({
            data: {
              listingId: listing.id,
              price,
              currency: 'AED',
              stockStatus: 'IN_STOCK',
              recordedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
            },
          });
        }
      }
    }
  }

  const count = await prisma.productCanonical.count();
  const listingCount = await prisma.retailerListing.count();
  console.log(`Successfully seeded ${count} products with ${listingCount} listings!`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
