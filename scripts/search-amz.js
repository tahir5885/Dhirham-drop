const https = require('https');

async function searchAmz() {
  const res = await fetch('https://www.amazon.ae/s?k=iPhone+15+Pro+Max+256GB+Natural+Titanium', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  const regex = /data-asin="([A-Z0-9]{10})"/g;
  let match;
  const asins = [];
  while ((match = regex.exec(html)) !== null) {
    if (match[1] && match[1] !== '0000000000') asins.push(match[1]);
  }
  console.log('Top ASINs found:', asins.slice(0, 10));

  // Also check titles for the first 3
  for (const asin of asins.slice(0, 3)) {
    const pRes = await fetch(`https://www.amazon.ae/dp/${asin}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const pHtml = await pRes.text();
    const t = pHtml.match(/<title>([^<]+)<\/title>/i);
    const pMatch = pHtml.match(/class="a-price-whole">([0-9,]+)/i);
    console.log(asin, '->', t ? t[1].slice(0, 60) : 'No title', 'Price:', pMatch ? pMatch[1] : 'No price');
  }
}

searchAmz();
