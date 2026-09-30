import { fuzzyMatch, normalizeProductTitle } from '../packages/normalizer/src/index.js';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Usage:
  npx tsx scripts/match.ts "<Title 1>" "<Title 2>"

Example:
  npx tsx scripts/match.ts \\
    "Apple iPhone 15 Pro Max (256 GB) - Natural Titanium [UAE Version]" \\
    "Apple iPhone 15 Pro Max 256GB Natural Titanium 5G with FaceTime - Middle East Version"
`);
  process.exit(0);
}

if (args.length === 1) {
  // Single title inspection
  const norm = normalizeProductTitle(args[0]);
  console.log('\n--- Normalization Result ---');
  console.log('Raw Title      :', norm.rawTitle);
  console.log('Cleaned Title  :', norm.cleanedTitle);
  console.log('Canonical Slug :', norm.canonicalKey);
  console.log('Attributes     :', JSON.stringify(norm.attributes, null, 2));
  process.exit(0);
}

const [title1, title2] = args;
const result = fuzzyMatch(title1, title2);

console.log('\n' + '='.repeat(60));
console.log('DirhamDrop - Product Matching Analysis');
console.log('='.repeat(60));
console.log(`Title 1 (e.g. Amazon): "${title1}"`);
console.log(`Title 2 (e.g. Noon)  : "${title2}"`);
console.log('-'.repeat(60));
console.log(`Match Status     : ${result.isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
console.log(`Confidence Level : ${result.confidence}`);
console.log(`Similarity Score : ${(result.score * 100).toFixed(1)}%`);
console.log(`Decision Reason  : ${result.reason}`);
console.log('-'.repeat(60));
console.log('Cleaned Title 1  :', `"${result.product1.cleanedTitle}"`);
console.log('Cleaned Title 2  :', `"${result.product2.cleanedTitle}"`);
console.log('Canonical Key 1  :', `"${result.product1.canonicalKey}"`);
console.log('Canonical Key 2  :', `"${result.product2.canonicalKey}"`);
console.log('Attributes 1     :', JSON.stringify(result.product1.attributes));
console.log('Attributes 2     :', JSON.stringify(result.product2.attributes));
console.log('='.repeat(60) + '\n');
