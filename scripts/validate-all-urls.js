import { CATALOG_PRODUCTS } from './apps/web/src/lib/catalog';

async function validateAll() {
  console.log('Testing URLs for all products in catalog...');
  const brokenListings = [];

  for (const product of CATALOG_PRODUCTS) {
    for (const listing of product.listings) {
      try {
        const res = await fetch(listing.url, {
          method: 'HEAD',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          redirect: 'follow',
        });
        if (res.status >= 400 && res.status !== 403 && res.status !== 405) {
          // 403/405 is often bot blocking, 404 is definitely broken link
          console.log(`[${res.status}] ${listing.retailerName}: ${listing.url}`);
          brokenListings.push({ product: product.normalizedName, retailer: listing.retailerName, url: listing.url, status: res.status });
        }
      } catch (err) {
        console.log(`[ERR] ${listing.retailerName}: ${listing.url} (${err.message})`);
        brokenListings.push({ product: product.normalizedName, retailer: listing.retailerName, url: listing.url, status: 'ERR' });
      }
    }
  }

  console.log(`\nFound ${brokenListings.length} broken/problematic listings.`);
}

validateAll();
