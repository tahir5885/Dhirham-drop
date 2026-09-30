import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(stealthPlugin());

async function checkNoonAndSamsung() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    locale: 'en-AE',
    timezoneId: 'Asia/Dubai',
  });
  const page = await context.newPage();

  // 1. Noon iPhone 15 Pro Max direct page
  console.log('Navigating to Noon iPhone 15 Pro search...');
  await page.goto('https://www.noon.com/uae-en/search/?q=iPhone+15+Pro+Max+256GB+Natural+Titanium', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(3000);

  const noonIphoneLinks = await page.$$eval('a[href*="/p/"]', (anchors) => {
    return anchors.map((a) => ({
      href: a.getAttribute('href'),
      title: a.querySelector('div[data-qa="product-name"], span[title], h2, div')?.textContent?.trim(),
      price: a.querySelector('strong.amount, div[data-qa="div-price-now"]')?.textContent?.trim(),
    })).filter(item => {
      const t = (item.title || '').toLowerCase();
      return t.includes('iphone 15 pro') && !t.includes('case') && !t.includes('cover') && !t.includes('screen');
    });
  });
  console.log('Verified Noon iPhone Links:', noonIphoneLinks.slice(0, 3));

  // 2. Amazon Samsung S24 Ultra
  console.log('\nNavigating to Amazon Samsung S24 Ultra search...');
  await page.goto('https://www.amazon.ae/s?k=Samsung+Galaxy+S24+Ultra+256GB+Titanium+Black', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(3000);

  const amzSamsungLinks = await page.$$eval('a[href*="/dp/"]', (anchors) => {
    return anchors.map((a) => ({
      href: a.getAttribute('href'),
      text: a.textContent?.trim(),
    })).filter(item => {
      const t = (item.text || '').toLowerCase();
      return t.includes('s24 ultra') && !t.includes('case') && !t.includes('protector');
    });
  });
  console.log('Verified Amazon Samsung Links:', amzSamsungLinks.slice(0, 2));

  // 3. Noon Samsung S24 Ultra
  console.log('\nNavigating to Noon Samsung S24 Ultra search...');
  await page.goto('https://www.noon.com/uae-en/search/?q=Samsung+Galaxy+S24+Ultra+256GB+Titanium+Black', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(3000);

  const noonSamsungLinks = await page.$$eval('a[href*="/p/"]', (anchors) => {
    return anchors.map((a) => ({
      href: a.getAttribute('href'),
      title: a.querySelector('div[data-qa="product-name"], span[title], h2, div')?.textContent?.trim(),
      price: a.querySelector('strong.amount, div[data-qa="div-price-now"]')?.textContent?.trim(),
    })).filter(item => {
      const t = (item.title || '').toLowerCase();
      return t.includes('s24 ultra') && !t.includes('case') && !t.includes('cover');
    });
  });
  console.log('Verified Noon Samsung Links:', noonSamsungLinks.slice(0, 2));

  await browser.close();
}

checkNoonAndSamsung().catch(console.error);
