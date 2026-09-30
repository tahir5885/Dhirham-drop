import { CATALOG_PRODUCTS } from './lib/catalog';

async function testAll() {
  console.log('Testing all product links...');
  const broken: any[] = [];
  
  for (const p of CATALOG_PRODUCTS) {
    for (const l of p.listings) {
      try {
        const res = await fetch(l.url, {
          method: 'GET',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        });
        if (res.status === 404) {
          console.log(`404: [${l.retailerName}] ${l.url}`);
          broken.push({ product: p.normalizedName, retailer: l.retailerName, url: l.url });
        }
      } catch (e: any) {
        console.log(`ERR: [${l.retailerName}] ${l.url} -> ${e.message}`);
      }
    }
  }
  console.log(`\nFound ${broken.length} 404 links total.`);
}

testAll();
