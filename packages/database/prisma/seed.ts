import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding UAE DirhamDrop database...');

  // 1. Create Retailers
  const amazon = await prisma.retailer.upsert({
    where: { slug: 'amazon_ae' },
    update: {},
    create: {
      name: 'Amazon UAE',
      slug: 'amazon_ae',
      domain: 'amazon.ae',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      affiliateParamKey: 'tag',
      affiliateParamValue: process.env.AMAZON_AFFILIATE_TAG || 'dirhamdrop-21',
      isActive: true,
    },
  });

  const noon = await prisma.retailer.upsert({
    where: { slug: 'noon_ae' },
    update: {},
    create: {
      name: 'Noon UAE',
      slug: 'noon_ae',
      domain: 'noon.com',
      logoUrl: 'https://z.nooncdn.com/s/app/com/noon/images/logos/noon-black-en.svg',
      affiliateParamKey: 'utm_source',
      affiliateParamValue: process.env.NOON_AFFILIATE_CODE || 'DIRHAMDROP',
      isActive: true,
    },
  });

  const sharafDg = await prisma.retailer.upsert({
    where: { slug: 'sharaf_dg' },
    update: {},
    create: {
      name: 'Sharaf DG',
      slug: 'sharaf_dg',
      domain: 'uae.sharafdg.com',
      logoUrl: 'https://uae.sharafdg.com/wp-content/themes/sharafdg/assets/images/logo.svg',
      affiliateParamKey: 'utm_source',
      affiliateParamValue: 'dirhamdrop',
      isActive: true,
    },
  });

  const jumbo = await prisma.retailer.upsert({
    where: { slug: 'jumbo_ae' },
    update: {},
    create: {
      name: 'Jumbo Electronics',
      slug: 'jumbo_ae',
      domain: 'jumbo.ae',
      logoUrl: 'https://www.jumbo.ae/static/version1708412852/frontend/Jumbo/default/en_US/images/logo.svg',
      affiliateParamKey: 'utm_source',
      affiliateParamValue: 'dirhamdrop',
      isActive: true,
    },
  });

  const carrefour = await prisma.retailer.upsert({
    where: { slug: 'carrefour_ae' },
    update: {},
    create: {
      name: 'Carrefour UAE',
      slug: 'carrefour_ae',
      domain: 'carrefouruae.com',
      logoUrl: 'https://www.carrefouruae.com/media/wysiwyg/logo.png',
      affiliateParamKey: 'utm_source',
      affiliateParamValue: 'dirhamdrop',
      isActive: true,
    },
  });

  const microless = await prisma.retailer.upsert({
    where: { slug: 'microless_ae' },
    update: {},
    create: {
      name: 'Microless',
      slug: 'microless_ae',
      domain: 'microless.com',
      logoUrl: 'https://cdn.microless.com/assets/images/logo.png',
      affiliateParamKey: 'utm_source',
      affiliateParamValue: 'dirhamdrop',
      isActive: true,
    },
  });

  const virgin = await prisma.retailer.upsert({
    where: { slug: 'virgin_ae' },
    update: {},
    create: {
      name: 'Virgin Megastore',
      slug: 'virgin_ae',
      domain: 'virginmegastore.ae',
      logoUrl: 'https://www.virginmegastore.ae/assets/images/virgin-logo.svg',
      affiliateParamKey: 'utm_source',
      affiliateParamValue: 'dirhamdrop',
      isActive: true,
    },
  });

  const lulu = await prisma.retailer.upsert({
    where: { slug: 'lulu_ae' },
    update: {},
    create: {
      name: 'LuLu Hypermarket',
      slug: 'lulu_ae',
      domain: 'luluhypermarket.com',
      logoUrl: 'https://www.luluhypermarket.com/medias/lulu-logo.svg',
      affiliateParamKey: 'utm_source',
      affiliateParamValue: 'dirhamdrop',
      isActive: true,
    },
  });

  const emax = await prisma.retailer.upsert({
    where: { slug: 'emax_ae' },
    update: {},
    create: {
      name: 'Emax Electronics',
      slug: 'emax_ae',
      domain: 'emaxme.com',
      logoUrl: 'https://uae.emaxme.com/images/logo.svg',
      affiliateParamKey: 'utm_source',
      affiliateParamValue: 'dirhamdrop',
      isActive: true,
    },
  });

  const namshi = await prisma.retailer.upsert({
    where: { slug: 'namshi_ae' },
    update: {},
    create: {
      name: 'Namshi UAE',
      slug: 'namshi_ae',
      domain: 'namshi.com',
      logoUrl: 'https://a.namshicdn.com/skin/frontend/namshi/default/images/logo.svg',
      affiliateParamKey: 'utm_source',
      affiliateParamValue: 'dirhamdrop',
      isActive: true,
    },
  });

  console.log(`Created Top 10 UAE Retailers successfully!`);

  // 2. Canonical Product 1: iPhone 15 Pro Max 256GB Natural Titanium
  const iphone = await prisma.productCanonical.upsert({
    where: { canonicalKey: 'apple-iphone-15-pro-max-256gb-natural-titanium' },
    update: {},
    create: {
      brand: 'Apple',
      model: 'iPhone 15 Pro Max',
      normalizedName: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
      canonicalKey: 'apple-iphone-15-pro-max-256gb-natural-titanium',
      category: 'Smartphones',
      ean: '0195949013585',
      imageUrl: 'https://m.media-amazon.com/images/I/81c50PU+lpL._AC_SX679_.jpg',
      attributes: JSON.stringify({
        storage: '256GB',
        color: 'Natural Titanium',
        connectivity: '5G',
      }),
    },
  });

  // Amazon Listing for iPhone
  const amazonIphone = await prisma.retailerListing.upsert({
    where: {
      retailerId_sku: {
        retailerId: amazon.id,
        sku: 'B0CQ313N2F',
      },
    },
    update: {
      currentPrice: 2399.0,
      stockStatus: "IN_STOCK",
    },
    create: {
      canonicalProductId: iphone.id,
      retailerId: amazon.id,
      sku: 'B0CQ313N2F',
      url: 'https://www.amazon.ae/dp/B0CQ313N2F',
      rawTitle: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium',
      currentPrice: 2399.0,
      originalPrice: 5099.0,
      currency: 'AED',
      stockStatus: "IN_STOCK",
      rating: 4.7,
      reviewCount: 1420,
      sellerName: 'Amazon.ae Prime',
      isFulfilledByRetailer: true,
    },
  });

  // Noon Listing for iPhone
  const noonIphone = await prisma.retailerListing.upsert({
    where: {
      retailerId_sku: {
        retailerId: noon.id,
        sku: 'N70100742V',
      },
    },
    update: {
      currentPrice: 2626.0,
      stockStatus: "IN_STOCK",
    },
    create: {
      canonicalProductId: iphone.id,
      retailerId: noon.id,
      sku: 'N70100742V',
      url: 'https://www.noon.com/uae-en/renewed-iphone-15-pro-max-256gb-natural-titanium-5g-with-facetime-international-version/N70100742V/p/?o=c33a9ef3da0ed25e',
      rawTitle: 'Apple iPhone 15 Pro Max 256GB Natural Titanium 5G With Facetime',
      currentPrice: 2626.0,
      originalPrice: 5099.0,
      currency: 'AED',
      stockStatus: "IN_STOCK",
      rating: 4.6,
      reviewCount: 3000,
      sellerName: 'Noon Express',
      isFulfilledByRetailer: true,
    },
  });

  // Sharaf DG Listing for iPhone
  const sharafIphone = await prisma.retailerListing.upsert({
    where: {
      retailerId_sku: {
        retailerId: sharafDg.id,
        sku: 'SDG_IPHONE15PM_256',
      },
    },
    update: {
      currentPrice: 2799.0,
      stockStatus: "IN_STOCK",
    },
    create: {
      canonicalProductId: iphone.id,
      retailerId: sharafDg.id,
      sku: 'SDG_IPHONE15PM_256',
      url: 'https://uae.sharafdg.com/product/apple-iphone-15-pro-max-256gb-natural-titanium/',
      rawTitle: 'Apple iPhone 15 Pro Max 256GB Natural Titanium - Official UAE Warranty',
      currentPrice: 2799.0,
      originalPrice: 5099.0,
      currency: 'AED',
      stockStatus: "IN_STOCK",
      rating: 4.8,
      reviewCount: 650,
      sellerName: 'Sharaf DG Retail',
      isFulfilledByRetailer: true,
    },
  });

  // Price history for iPhone (past 30 days time series)
  const now = new Date();
  const pastDates = [30, 20, 10, 5, 1];
  for (const daysAgo of pastDates) {
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    await prisma.priceHistory.create({
      data: {
        listingId: amazonIphone.id,
        price: daysAgo > 10 ? 3099.0 : 2749.0,
        currency: 'AED',
        stockStatus: "IN_STOCK",
        recordedAt: timestamp,
      },
    });
    await prisma.priceHistory.create({
      data: {
        listingId: noonIphone.id,
        price: daysAgo > 5 ? 2899.0 : 2626.0,
        currency: 'AED',
        stockStatus: "IN_STOCK",
        recordedAt: timestamp,
      },
    });
  }

  // 3. Canonical Product 2: Sony WH-1000XM5 Wireless Noise-Cancelling Headphones
  const sonyHeadphones = await prisma.productCanonical.upsert({
    where: { canonicalKey: 'sony-wh-1000xm5-black' },
    update: {},
    create: {
      brand: 'Sony',
      model: 'WH-1000XM5',
      normalizedName: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Black',
      canonicalKey: 'sony-wh-1000xm5-black',
      category: 'Headphones',
      ean: '0027242923515',
      imageUrl: 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SX679_.jpg',
      attributes: JSON.stringify({
        color: 'Black',
        type: 'Over-Ear',
        noiseCancelling: true,
      }),
    },
  });

  const amazonSony = await prisma.retailerListing.upsert({
    where: {
      retailerId_sku: {
        retailerId: amazon.id,
        sku: 'B09ZFD9CBB',
      },
    },
    update: {
      currentPrice: 799.0,
      stockStatus: "IN_STOCK",
    },
    create: {
      canonicalProductId: sonyHeadphones.id,
      retailerId: amazon.id,
      sku: 'B09ZFD9CBB',
      url: 'https://www.amazon.ae/dp/B09ZFD9CBB',
      rawTitle: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones - Black (UAE Version)',
      currentPrice: 799.0,
      originalPrice: 1499.0,
      currency: 'AED',
      stockStatus: "IN_STOCK",
      rating: 4.7,
      reviewCount: 3200,
      sellerName: 'Amazon.ae Prime',
      isFulfilledByRetailer: true,
    },
  });

  const noonSony = await prisma.retailerListing.upsert({
    where: {
      retailerId_sku: {
        retailerId: noon.id,
        sku: 'N53330542A',
      },
    },
    update: {
      currentPrice: 799.0,
      stockStatus: "IN_STOCK",
    },
    create: {
      canonicalProductId: sonyHeadphones.id,
      retailerId: noon.id,
      sku: 'N53330542A',
      url: 'https://www.noon.com/uae-en/wh-1000xm5-wireless-noise-cancelling-headphones-black/N53330542A/p/?o=e68d2a866b2fa53b',
      rawTitle: 'Sony WH-1000XM5 Wireless Over-Ear Active Noise Cancelling Headphones Black',
      currentPrice: 799.0,
      originalPrice: 1299.0,
      currency: 'AED',
      stockStatus: "IN_STOCK",
      rating: 4.6,
      reviewCount: 1540,
      sellerName: 'SuperDeals UAE',
      isFulfilledByRetailer: true,
    },
  });

  const sharafSony = await prisma.retailerListing.upsert({
    where: {
      retailerId_sku: {
        retailerId: sharafDg.id,
        sku: 'SDG_SONY_WH1000XM5',
      },
    },
    update: {
      currentPrice: 829.0,
      stockStatus: "IN_STOCK",
    },
    create: {
      canonicalProductId: sonyHeadphones.id,
      retailerId: sharafDg.id,
      sku: 'SDG_SONY_WH1000XM5',
      url: 'https://uae.sharafdg.com/product/sony-wh-1000xm5-wireless-noise-canceling-headphones-black/',
      rawTitle: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
      currentPrice: 829.0,
      originalPrice: 1399.0,
      currency: 'AED',
      stockStatus: "IN_STOCK",
      rating: 4.8,
      reviewCount: 420,
      sellerName: 'Sharaf DG Retail',
      isFulfilledByRetailer: true,
    },
  });

  // 4. Canonical Product 3: Dyson Airwrap Multi-Styler Complete Long
  const dysonStyler = await prisma.productCanonical.upsert({
    where: { canonicalKey: 'dyson-airwrap-multi-styler-complete-long' },
    update: {},
    create: {
      brand: 'Dyson',
      model: 'Airwrap Multi-Styler',
      normalizedName: 'Dyson Airwrap Multi-Styler Complete Long Nickel and Copper',
      canonicalKey: 'dyson-airwrap-multi-styler-complete-long',
      category: 'Beauty & Hair Care',
      imageUrl: 'https://m.media-amazon.com/images/I/31UhT0-rX-L._AC_SX679_.jpg',
      attributes: JSON.stringify({
        color: 'Nickel and Copper',
        type: 'Multi-Styler',
      }),
    },
  });

  await prisma.retailerListing.upsert({
    where: {
      retailerId_sku: {
        retailerId: amazon.id,
        sku: 'B0B61XH5YT',
      },
    },
    update: {
      currentPrice: 1999.0,
      stockStatus: "IN_STOCK",
    },
    create: {
      canonicalProductId: dysonStyler.id,
      retailerId: amazon.id,
      sku: 'B0B61XH5YT',
      url: 'https://www.amazon.ae/dp/B0B61XH5YT',
      rawTitle: 'Dyson Airwrap Multi-Styler Complete Long, Nickel/Copper - International Version',
      currentPrice: 1999.0,
      originalPrice: 2499.0,
      currency: 'AED',
      stockStatus: "IN_STOCK",
      rating: 4.7,
      reviewCount: 420,
      sellerName: 'Amazon.ae Prime',
      isFulfilledByRetailer: true,
    },
  });

  await prisma.retailerListing.upsert({
    where: {
      retailerId_sku: {
        retailerId: noon.id,
        sku: 'N53409802A',
      },
    },
    update: {
      currentPrice: 1999.0,
      stockStatus: "IN_STOCK",
    },
    create: {
      canonicalProductId: dysonStyler.id,
      retailerId: noon.id,
      sku: 'N53409802A',
      url: 'https://www.noon.com/uae-en/airwrap-multi-styler-complete-long-prussian-blue-rich-copper/N53409802A/p/?o=f7bfab627d8ff14f',
      rawTitle: 'Dyson Airwrap Multi-Styler Complete Long Prussian Blue / Rich Copper',
      currentPrice: 1999.0,
      originalPrice: 2499.0,
      currency: 'AED',
      stockStatus: "IN_STOCK",
      rating: 4.6,
      reviewCount: 530,
      sellerName: 'Noon Express',
      isFulfilledByRetailer: true,
    },
  });

  await prisma.retailerListing.upsert({
    where: {
      retailerId_sku: {
        retailerId: sharafDg.id,
        sku: 'SDG_DYSON_AIRWRAP_LONG',
      },
    },
    update: {
      currentPrice: 1999.0,
      stockStatus: "IN_STOCK",
    },
    create: {
      canonicalProductId: dysonStyler.id,
      retailerId: sharafDg.id,
      sku: 'SDG_DYSON_AIRWRAP_LONG',
      url: 'https://uae.sharafdg.com/product/dyson-airwrap-multi-styler-complete-long-nickel-copper/',
      rawTitle: 'Dyson Airwrap Multi-Styler Complete Long (Nickel/Copper) - UAE Official Warranty',
      currentPrice: 1999.0,
      originalPrice: 2499.0,
      currency: 'AED',
      stockStatus: "IN_STOCK",
      rating: 4.8,
      reviewCount: 290,
      sellerName: 'Sharaf DG Retail',
      isFulfilledByRetailer: true,
    },
  });

  console.log('Seeded sample canonical products and historical price time-series successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
