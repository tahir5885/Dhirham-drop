import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(stealthPlugin());

async function checkAmazon() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    locale: 'en-AE',
    timezoneId: 'Asia/Dubai',
  });
  const page = await context.newPage();

  console.log('Navigating to Amazon.ae search...');
  await page.goto('https://www.amazon.ae/s?k=Sony+WH-1000XM5+Wireless+Headphones', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(3000);

  const pageTitle = await page.title();
  console.log('Amazon Page Title:', pageTitle);

  // Check if CAPTCHA was triggered
  const isCaptcha = pageTitle.includes('Robot') || pageTitle.includes('Captcha');
  console.log('Is CAPTCHA triggered:', isCaptcha);

  if (!isCaptcha) {
    const links = await page.$$eval('a[href*="/dp/"]', (anchors) => {
      return anchors.map((a) => ({
        href: a.getAttribute('href'),
        text: a.textContent?.trim(),
      })).filter(item => (item.text || '').toLowerCase().includes('wh-1000xm5') && !(item.text || '').toLowerCase().includes('case'));
    });
    console.log('Found Amazon Sony Links:', links.slice(0, 3));
  }

  // Also check iPhone
  await page.goto('https://www.amazon.ae/s?k=Apple+iPhone+15+Pro+Max', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(3000);

  const iphoneLinks = await page.$$eval('a[href*="/dp/"]', (anchors) => {
    return anchors.map((a) => ({
      href: a.getAttribute('href'),
      text: a.textContent?.trim(),
    })).filter(item => {
      const t = (item.text || '').toLowerCase();
      return t.includes('iphone') && t.includes('15') && !t.includes('case') && !t.includes('screen');
    });
  });
  console.log('Found Amazon iPhone Links:', iphoneLinks.slice(0, 3));

  await browser.close();
}

checkAmazon().catch(console.error);
