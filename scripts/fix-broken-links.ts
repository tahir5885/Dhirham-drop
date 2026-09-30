import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function fixUrls() {
  console.log('Fixing catalog and database URLs...');

  // Update listings in database that have outdated URLs to guaranteed working search/product URLs
  const updates = [
    {
      oldSub: 'carrefouruae.com/mafuae/en/p/',
      newUrl: (raw: string, title: string) => `https://www.carrefouruae.com/mafuae/en/search?q=${encodeURIComponent(title)}`,
    },
    {
      oldSub: 'luluhypermarket.com/en-ae/',
      newUrl: (raw: string, title: string) => `https://www.luluhypermarket.com/en-ae/search/?text=${encodeURIComponent(title)}`,
    },
    {
      oldSub: 'uae.microless.com/product/',
      newUrl: (raw: string, title: string) => `https://uae.microless.com/search/?query=${encodeURIComponent(title)}`,
    },
  ];

  const listings = await prisma.retailerListing.findMany({
    include: { canonicalProduct: true },
  });

  let fixedCount = 0;
  for (const l of listings) {
    for (const u of updates) {
      if (l.url.includes(u.oldSub)) {
        const cleanName = l.canonicalProduct.normalizedName;
        const fixedUrl = u.newUrl(l.url, cleanName);
        await prisma.retailerListing.update({
          where: { id: l.id },
          data: { url: fixedUrl },
        });
        fixedCount++;
      }
    }
  }

  console.log(`Updated ${fixedCount} listings in SQLite to guaranteed active search/product URLs!`);
}

fixUrls()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
