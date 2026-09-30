import { prisma } from '@dirhamdrop/database';

async function main() {
  const p = await prisma.productCanonical.findUnique({
    where: { canonicalKey: 'sony-playstation-5-slim-digital-edition-1tb' },
  });

  if (!p) {
    console.log('PS5 Digital not found');
    return;
  }

  console.log('Seeding listings for:', p.normalizedName);
  const retailers = await prisma.retailer.findMany();
  const retailerMap = new Map(retailers.map((r) => [r.slug, r.id]));

  const basePrice = 1449;
  const listingsData = [
    { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.24, rating: 4.8, reviews: 1200 },
    { slug: 'noon_ae', markup: 1.03, origMarkup: 1.24, rating: 4.7, reviews: 890 },
    { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.24, rating: 4.8, reviews: 310 },
    { slug: 'virgin_ae', markup: 1.09, origMarkup: 1.24, rating: 4.8, reviews: 190 },
    { slug: 'jumbo_ae', markup: 1.08, origMarkup: 1.24, rating: 4.8, reviews: 250 },
  ];

  for (const item of listingsData) {
    const retailerId = retailerMap.get(item.slug);
    if (!retailerId) continue;
    const curPrice = Math.round(basePrice * item.markup);
    const origPrice = Math.round(basePrice * item.origMarkup);
    const sku = 'ps5_slim_digital_' + item.slug;

    const created = await prisma.retailerListing.upsert({
      where: {
        retailerId_sku: {
          retailerId,
          sku,
        },
      },
      update: {
        canonicalProductId: p.id,
        currentPrice: curPrice,
        originalPrice: origPrice,
      },
      create: {
        canonicalProductId: p.id,
        retailerId,
        sku,
        url: 'https://www.amazon.ae/s?k=' + encodeURIComponent(p.normalizedName),
        rawTitle: p.normalizedName,
        currentPrice: curPrice,
        originalPrice: origPrice,
        currency: 'AED',
        stockStatus: 'IN_STOCK',
        rating: item.rating,
        reviewCount: item.reviews,
        isFulfilledByRetailer: true,
      },
    });

    await prisma.priceHistory.createMany({
      data: [
        { listingId: created.id, price: origPrice, currency: 'AED', recordedAt: new Date(Date.now() - 30 * 86400000) },
        { listingId: created.id, price: curPrice + 40, currency: 'AED', recordedAt: new Date(Date.now() - 15 * 86400000) },
        { listingId: created.id, price: curPrice, currency: 'AED', recordedAt: new Date() },
      ],
    });
  }

  console.log('Successfully seeded PS5 Digital listings!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
