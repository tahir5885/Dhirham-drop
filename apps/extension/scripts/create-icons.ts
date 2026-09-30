import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const iconsDir = path.resolve(__dirname, '../icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const svgHtml = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:transparent;display:grid;place-items:center;height:100vh;overflow:hidden;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
          <rect width="128" height="128" rx="28" fill="#059669"/>
          <!-- Drop icon or Dirham symbol -->
          <path d="M64 22 C64 22 36 60 36 80 A28 28 0 0 0 92 80 C92 60 64 22 64 22 Z" fill="#ffffff" opacity="0.95"/>
          <path d="M50 78 L60 88 L78 70" stroke="#059669" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </body>
    </html>
  `;

  await page.setContent(svgHtml);

  // Generate 128x128
  await page.setViewportSize({ width: 128, height: 128 });
  await page.screenshot({ path: path.join(iconsDir, 'icon128.png'), omitBackground: true });

  // Generate 48x48
  await page.setViewportSize({ width: 48, height: 48 });
  await page.screenshot({ path: path.join(iconsDir, 'icon48.png'), omitBackground: true });

  // Generate 16x16
  await page.setViewportSize({ width: 16, height: 16 });
  await page.screenshot({ path: path.join(iconsDir, 'icon16.png'), omitBackground: true });

  await browser.close();
  console.log('Icons successfully created at:', iconsDir);
}

generateIcons().catch(console.error);
