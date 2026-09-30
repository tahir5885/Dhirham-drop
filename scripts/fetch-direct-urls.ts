import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(stealthPlugin());

async function main() {
  console.log('Launching stealth browser to fetch verified direct product URLs...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    locale: 'en-AE',
    timezoneId: 'Asia/Dubai',
  });

  const page = await context.newPage();

  // 1. Amazon.ae search for iPhone 15 Pro Max
  console.log('\n--- Checking Amazon.ae for iPhone 15 Pro Max ---');
  try {
    await page.goto('https://www.amazon.ae/s?k=Apple+iPhone+15+Pro+Max+256GB', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForTimeout(2000);

    const amazonItems = await page.$$eval(
      'div[data-component-type="s-search-result"]',
      (cards) => {
        return cards
          .map((card) => {
            const asin = card.getAttribute('data-asin');
            const titleEl = card.querySelector('h2 a span');
            const priceEl = card.querySelector('.a-price .a-offscreen');
            const imgEl = card.querySelector('img.s-image');
            const linkEl = card.querySelector('h2 a');
            return {
              asin,
              title: titleEl?.textContent?.trim(),
              price: priceEl?.textContent?.trim(),
              imageUrl: imgEl?.getAttribute('src'),
              href: linkEl?.getAttribute('href'),
            };
          })
          .filter((item) => {
            const t = (item.title || '').toLowerCase();
            return (
              item.asin &&
              t.includes('iphone') &&
              t.includes('15') &&
              t.includes('pro max') &&
              !t.includes('case') &&
              !t.includes('protector')
            );
          });
      }
    );

    console.log('Amazon iPhone candidates:', JSON.stringify(amazonItems.slice(0, 3), null, 2));
  } catch (err: any) {
    console.warn('Amazon iPhone search error:', err.message);
  }

  // 2. Noon.com search for iPhone 15 Pro Max
  console.log('\n--- Checking Noon.com for iPhone 15 Pro Max ---');
  try {
    await page.goto('https://www.noon.com/uae-en/search/?q=Apple+iPhone+15+Pro+Max+256GB', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForTimeout(3000);

    const noonItems = await page.$$eval('a[href*="/p/"]', (links) => {
      return links
        .map((link) => {
          const href = link.getAttribute('href') || '';
          const titleEl = link.querySelector('div[data-qa="product-name"], span[title], h2, div');
          const priceEl = link.querySelector('strong.amount, div[data-qa="div-price-now"], span');
          const imgEl = link.querySelector('img');
          return {
            href,
            title: titleEl?.textContent?.trim(),
            price: priceEl?.textContent?.trim(),
            imageUrl: imgEl?.getAttribute('src'),
          };
        })
        .filter((item) => {
          const t = (item.title || '').toLowerCase();
          return (
            item.href.includes('/p/') &&
            t.includes('iphone') &&
            t.includes('15') &&
            !t.includes('case') &&
            !t.includes('cover')
          );
        });
    });

    console.log('Noon iPhone candidates:', JSON.stringify(noonItems.slice(0, 3), null, 2));
  } catch (err: any) {
    console.warn('Noon iPhone search error:', err.message);
  }

  // 3. Amazon.ae for Sony WH-1000XM5
  console.log('\n--- Checking Amazon.ae for Sony WH-1000XM5 ---');
  try {
    await page.goto('https://www.amazon.ae/s?k=Sony+WH-1000XM5+Wireless+Headphones+Black', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForTimeout(2000);

    const amazonSony = await page.$$eval(
      'div[data-component-type="s-search-result"]',
      (cards) => {
        return cards
          .map((card) => {
            const asin = card.getAttribute('data-asin');
            const titleEl = card.querySelector('h2 a span');
            const priceEl = card.querySelector('.a-price .a-offscreen');
            const imgEl = card.querySelector('img.s-image');
            return {
              asin,
              title: titleEl?.textContent?.trim(),
              price: priceEl?.textContent?.trim(),
              imageUrl: imgEl?.getAttribute('src'),
            };
          })
          .filter((item) => {
            const t = (item.title || '').toLowerCase();
            return (
              item.asin &&
              t.includes('wh-1000xm5') &&
              !t.includes('case') &&
              !t.includes('cushion') &&
              !t.includes('stand')
            );
          });
      }
    );

    console.log('Amazon Sony candidates:', JSON.stringify(amazonSony.slice(0, 2), null, 2));
  } catch (err: any) {
    console.warn('Amazon Sony search error:', err.message);
  }

  // 4. Noon.com for Sony WH-1000XM5
  console.log('\n--- Checking Noon.com for Sony WH-1000XM5 ---');
  try {
    await page.goto('https://www.noon.com/uae-en/search/?q=Sony+WH-1000XM5+Wireless+Headphones+Black', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForTimeout(3000);

    const noonSony = await page.$$eval('a[href*="/p/"]', (links) => {
      return links
        .map((link) => {
          const href = link.getAttribute('href') || '';
          const titleEl = link.querySelector('div[data-qa="product-name"], span[title], h2');
          const priceEl = link.querySelector('strong.amount, div[data-qa="div-price-now"]');
          const imgEl = link.querySelector('img');
          return {
            href,
            title: titleEl?.textContent?.trim(),
            price: priceEl?.textContent?.trim(),
            imageUrl: imgEl?.getAttribute('src'),
          };
        })
        .filter((item) => {
          const t = (item.title || '').toLowerCase();
          return item.href.includes('/p/') && t.includes('wh-1000xm5') && !t.includes('case');
        });
    });

    console.log('Noon Sony candidates:', JSON.stringify(noonSony.slice(0, 2), null, 2));
  } catch (err: any) {
    console.warn('Noon Sony search error:', err.message);
  }

  await browser.close();
  console.log('\nBrowser closed.');
}

main().catch(console.error);
