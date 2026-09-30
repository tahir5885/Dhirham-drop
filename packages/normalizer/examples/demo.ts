import { cleanTitle, extractAttributes, fuzzyMatch, normalizeProductTitle } from '../src/index.js';

console.log('='.repeat(70));
console.log('DirhamDrop - Stage 1: Normalization & Fuzzy-Matching Engine Demo');
console.log('='.repeat(70));

const testCases = [
  {
    name: 'Apple iPhone 15 Pro Max Match (Amazon.ae vs Noon.com)',
    amazon: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium [UAE Version] Free Delivery 2023 version',
    noon: 'Apple iPhone 15 Pro Max 256GB Dual SIM Natural Titanium 5G with FaceTime - Middle East Version (Noon Express)',
  },
  {
    name: 'Sony Noise Cancelling Headphones (Amazon.ae vs Noon.com)',
    amazon: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones - Black - 2023 version',
    noon: 'Sony WH-1000XM5 Wireless Over-Ear Active Noise Cancelling Headphones Black (UAE Official Warranty)',
  },
  {
    name: 'Accessory vs Device False-Positive Safeguard',
    amazon: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium',
    noon: 'Spigen Ultra Hybrid MagFit Case Designed for Apple iPhone 15 Pro Max (Clear)',
  },
  {
    name: 'Storage Capacity Variant Safeguard',
    amazon: 'Apple iPhone 15 Pro Max 128GB Black',
    noon: 'Apple iPhone 15 Pro Max 512GB Black',
  },
  {
    name: 'Brand Mismatch Safeguard',
    amazon: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    noon: 'Samsung Galaxy S24 Ultra 256GB Phantom Black 5G',
  },
];

for (const tc of testCases) {
  console.log(`\n▶ TEST CASE: ${tc.name}`);
  console.log(`- Amazon Title : "${tc.amazon}"`);
  console.log(`- Noon Title   : "${tc.noon}"`);

  const result = fuzzyMatch(tc.amazon, tc.noon);

  console.log(`  ✓ Match Status     : ${result.isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
  console.log(`  ✓ Match Confidence : ${result.confidence}`);
  console.log(`  ✓ Similarity Score : ${(result.score * 100).toFixed(1)}%`);
  console.log(`  ✓ Decision Reason  : ${result.reason}`);
  console.log(`  ✓ Cleaned Title 1  : "${result.product1.cleanedTitle}"`);
  console.log(`  ✓ Cleaned Title 2  : "${result.product2.cleanedTitle}"`);
  console.log(`  ✓ Canonical Key 1  : "${result.product1.canonicalKey}"`);
  console.log(`  ✓ Canonical Key 2  : "${result.product2.canonicalKey}"`);
}

console.log('\n' + '='.repeat(70));
console.log('Demo execution complete.');
console.log('='.repeat(70));
