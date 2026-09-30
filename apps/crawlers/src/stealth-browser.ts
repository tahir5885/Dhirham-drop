import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, BrowserContext } from 'playwright';
import './env.js';
import dotenv from 'dotenv';

dotenv.config();

// Apply stealth plugin to mask automation flags and evade PerimeterX / DataDome
chromium.use(stealthPlugin());

export interface BrowserSession {
  browser: Browser;
  context: BrowserContext;
}

const MODERN_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
];

export async function createStealthBrowserSession(headless = true): Promise<BrowserSession> {
  const proxyHost = process.env.PROXY_HOST;
  const proxyPort = process.env.PROXY_PORT;
  const proxyUsername = process.env.PROXY_USERNAME;
  const proxyPassword = process.env.PROXY_PASSWORD;
  const proxyProtocol = process.env.PROXY_PROTOCOL || 'http';

  const proxyConfig =
    proxyHost && proxyPort
      ? {
          server: `${proxyProtocol}://${proxyHost}:${proxyPort}`,
          username: proxyUsername || undefined,
          password: proxyPassword || undefined,
        }
      : undefined;

  if (proxyConfig) {
    console.log(`[Crawler] Routing traffic through proxy: ${proxyHost}:${proxyPort}`);
  } else {
    console.log('[Crawler] Running in direct connection mode (no proxy configured).');
  }

  const browser = await chromium.launch({
    headless,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-sandbox',
    ],
    proxy: proxyConfig,
  });

  const randomUserAgent =
    MODERN_USER_AGENTS[Math.floor(Math.random() * MODERN_USER_AGENTS.length)];

  const context = await browser.newContext({
    userAgent: randomUserAgent,
    viewport: { width: 1440, height: 900 },
    locale: 'en-AE',
    timezoneId: 'Asia/Dubai',
    geolocation: { latitude: 25.2048, longitude: 55.2708 }, // Dubai Coordinates
    permissions: ['geolocation'],
    extraHTTPHeaders: {
      'Accept-Language': 'en-AE,en-US;q=0.9,en;q=0.8,ar-AE;q=0.7',
      'Sec-Ch-Ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Upgrade-Insecure-Requests': '1',
    },
  });

  return { browser, context };
}
