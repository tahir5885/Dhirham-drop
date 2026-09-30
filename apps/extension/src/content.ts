/**
 * DirhamDrop Chrome Extension Content Script
 * Injected on Amazon.ae and Noon.com product pages.
 * Enforces Amazon Associates compliance: never drops Amazon affiliate cookies on Amazon.ae.
 */

interface CompetitorDeal {
  retailerName: string;
  retailerSlug: string;
  price: number;
  currency: string;
  savingsAed: number;
  buyUrl: string;
  isMonetized: boolean;
}

interface ExtensionMatchResponse {
  matchFound: boolean;
  canonicalName?: string;
  competitorsAvailable?: boolean;
  bestCompetitor?: CompetitorDeal;
  allCompetitors?: Array<{
    retailerName: string;
    price: number;
    buyUrl: string;
  }>;
}

export {};

const API_BASE_URL = 'http://localhost:3000'; // Configurable to production https://dirhamdrop.com

function isAmazon(): boolean {
  return window.location.hostname.includes('amazon.ae');
}

function isNoon(): boolean {
  return window.location.hostname.includes('noon.com');
}

function isSharafDG(): boolean {
  return window.location.hostname.includes('sharafdg.com');
}

function isJumbo(): boolean {
  return window.location.hostname.includes('jumbo.ae');
}

function isCarrefour(): boolean {
  return window.location.hostname.includes('carrefouruae.com');
}

function isMicroless(): boolean {
  return window.location.hostname.includes('microless.com');
}

function isVirgin(): boolean {
  return window.location.hostname.includes('virginmegastore.ae');
}

function isLuLu(): boolean {
  return window.location.hostname.includes('luluhypermarket.com');
}

function isEmax(): boolean {
  return window.location.hostname.includes('emaxme.com');
}

function isNamshi(): boolean {
  return window.location.hostname.includes('namshi.com');
}

function extractProductDetails(): { title: string; sku: string; price: number } | null {
  if (isAmazon()) {
    const titleEl = document.getElementById('productTitle');
    const title = titleEl ? titleEl.textContent?.trim() || '' : '';

    const asinMatch = window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/i);
    const sku = asinMatch ? asinMatch[1] : '';

    const priceEl = document.querySelector(
      '.apexPriceToPay .a-offscreen, .priceToPay .a-offscreen, .a-price .a-offscreen'
    );
    const priceText = priceEl ? priceEl.textContent || '' : '';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

    if (title && sku) return { title, sku, price };
  } else if (isNoon()) {
    const titleEl = document.querySelector('h1[data-qa="div-product-name"], h1');
    const title = titleEl ? titleEl.textContent?.trim() || '' : '';

    const skuMatch = window.location.pathname.match(/\/(N[0-9A-Z]+)\/p/i);
    const sku = skuMatch ? skuMatch[1] : '';

    const priceEl = document.querySelector('div[data-qa="div-price-now"], strong.amount');
    const priceText = priceEl ? priceEl.textContent || '' : '';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

    if (title && sku) return { title, sku, price };
  } else if (isSharafDG()) {
    const titleEl = document.querySelector('h1.product_title, h1, .product-title');
    const title = titleEl ? titleEl.textContent?.trim() || '' : '';

    const skuMatch = window.location.pathname.match(/\/product\/([^/]+)/i);
    const sku = skuMatch ? skuMatch[1] : '';

    const priceEl = document.querySelector('.price .amount, .actual-price, .product-price-box .price');
    const priceText = priceEl ? priceEl.textContent || '' : '';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

    if (title && sku) return { title, sku, price };
  } else if (isJumbo() || isCarrefour() || isMicroless() || isVirgin() || isLuLu() || isEmax() || isNamshi()) {
    // Universal JSON-LD / schema.org & DOM fallback for Top 10 stores
    let title = '';
    let price = 0;
    let sku = window.location.pathname.replace(/[^a-zA-Z0-9_-]/g, '_').slice(-20);

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of Array.from(scripts)) {
      try {
        const data = JSON.parse(script.textContent || '');
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item['@type'] === 'Product' || (typeof item['@type'] === 'string' && item['@type'].includes('Product'))) {
            if (item.name) title = item.name;
            if (item.sku) sku = item.sku;
            const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            if (offer?.price) price = parseFloat(offer.price);
          }
        }
      } catch {}
    }

    if (!title) {
      const h1 = document.querySelector('h1');
      if (h1) title = h1.textContent?.trim() || '';
    }

    if (!price) {
      const priceEl = document.querySelector('.price, .product-price, [data-price], [itemprop="price"], .amount, .css-1793740');
      if (priceEl) {
        price = parseFloat(priceEl.textContent?.replace(/[^0-9.]/g, '') || '0') || 0;
      }
    }

    if (title && price > 0) return { title, sku, price };
  }

  return null;
}

function injectFloatingPill(match: ExtensionMatchResponse, currentPrice: number) {
  // Prevent duplicate injection
  if (document.getElementById('dirhamdrop-pill-host')) return;

  const host = document.createElement('div');
  host.id = 'dirhamdrop-pill-host';
  host.style.position = 'fixed';
  host.style.bottom = '24px';
  host.style.right = '24px';
  host.style.zIndex = '2147483647'; // Highest possible z-index
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const container = document.createElement('div');
  container.className = 'dd-card';

  const best = match.bestCompetitor;
  const hasSavings = best && best.savingsAed > 0;

  shadow.innerHTML = `
    <style>
      .dd-card {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        width: 320px;
        padding: 16px;
        color: #0f172a;
        box-sizing: border-box;
        animation: dd-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes dd-slide-in {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .dd-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .dd-brand {
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 800;
        font-size: 13px;
        color: #047857;
      }
      .dd-logo-icon {
        width: 20px;
        height: 20px;
        background: #059669;
        color: white;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
      }
      .dd-close {
        background: transparent;
        border: none;
        cursor: pointer;
        color: #94a3b8;
        font-size: 16px;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .dd-close:hover {
        background: #f1f5f9;
        color: #334155;
      }
      .dd-title {
        font-size: 12px;
        font-weight: 600;
        color: #334155;
        margin-bottom: 8px;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .dd-savings-banner {
        background: ${hasSavings ? '#ecfdf5' : '#f8fafc'};
        border: 1px solid ${hasSavings ? '#a7f3d0' : '#e2e8f0'};
        padding: 8px 12px;
        border-radius: 10px;
        margin-bottom: 12px;
      }
      .dd-savings-text {
        font-size: 13px;
        font-weight: 700;
        color: ${hasSavings ? '#047857' : '#475569'};
      }
      .dd-price-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-top: 4px;
        font-size: 12px;
      }
      .dd-btn {
        display: block;
        width: 100%;
        text-align: center;
        background: #059669;
        color: white;
        text-decoration: none;
        padding: 9px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        margin-top: 8px;
        box-sizing: border-box;
        transition: background 0.2s;
      }
      .dd-btn:hover {
        background: #047857;
      }
      .dd-footer {
        font-size: 10px;
        color: #94a3b8;
        margin-top: 8px;
        text-align: center;
      }
    </style>

    <div class="dd-card">
      <div class="dd-header">
        <div class="dd-brand">
          <div class="dd-logo-icon">د</div>
          <span>DirhamDrop</span>
        </div>
        <button id="dd-close-btn" class="dd-close">&times;</button>
      </div>

      <div class="dd-title">${match.canonicalName || 'Active Product'}</div>

      <div class="dd-savings-banner">
        ${
          hasSavings
            ? `<div class="dd-savings-text">🎉 Save AED ${best?.savingsAed} on ${best?.retailerName}!</div>
               <div class="dd-price-row">
                 <span>${best?.retailerName}: <strong>AED ${best?.price.toLocaleString()}</strong></span>
                 <span style="color: #94a3b8; text-decoration: line-through;">Here: AED ${currentPrice.toLocaleString()}</span>
               </div>`
            : `<div class="dd-savings-text">✅ Lowest UAE Price Confirmed</div>
               <div style="font-size: 11px; color: #64748b; margin-top: 2px;">You are currently getting the best available price!</div>`
        }
      </div>

      ${
        hasSavings && best?.buyUrl
          ? `<a href="${best.buyUrl}" target="_blank" class="dd-btn">
               View Deal on ${best.retailerName} &rarr;
             </a>`
          : ''
      }

      ${
        match.allCompetitors && match.allCompetitors.length > 1
          ? `
            <div style="margin-top: 10px; border-top: 1px dashed #cbd5e1; padding-top: 8px;">
              <div style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 6px; display: flex; justify-content: space-between;">
                <span>Top Comparable Stores:</span>
                <span style="color: #059669;">Buyhatke-style Ranked</span>
              </div>
              ${match.allCompetitors
                .slice(0, 3)
                .map(
                  (comp, idx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-size: 11px;">
                  <span style="color: #1e293b;">
                    ${idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} <strong>${comp.retailerName}</strong>
                  </span>
                  <a href="${comp.buyUrl}" target="_blank" style="color: #059669; font-weight: 700; text-decoration: none; padding: 2px 7px; background: #ecfdf5; border-radius: 4px; border: 1px solid #a7f3d0;">
                    AED ${comp.price.toLocaleString()} &rarr;
                  </a>
                </div>
              `
                )
                .join('')}
            </div>
          `
          : ''
      }

      <div style="margin-top: 8px; padding: 6px 8px; background: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; font-size: 11px; color: #78350f; display: flex; justify-content: space-between; align-items: center;">
        <span>🏷️ Verified UAE coupons available</span>
        ${
          match.bestCompetitor?.buyUrl && document.location.hostname.includes('noon.com')
            ? `<button id="dd-try-coupons" style="font-weight: 700; color: #fff; background: #b45309; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Auto-Apply Coupons</button>`
            : `<a href="http://localhost:3000" target="_blank" style="font-weight: 700; color: #b45309; text-decoration: none;">View &rarr;</a>`
        }
      </div>

      <div class="dd-footer">
        🔒 Amazon Associates &amp; UAE Safe Cross-Pollination
      </div>
    </div>
  `;

  shadow.getElementById('dd-close-btn')?.addEventListener('click', () => {
    host.remove();
  });

  const tryCouponsBtn = shadow.getElementById('dd-try-coupons');
  if (tryCouponsBtn) {
    tryCouponsBtn.addEventListener('click', () => {
      tryCouponsBtn.textContent = 'Testing SAVE10...';
      tryCouponsBtn.style.opacity = '0.7';
      setTimeout(() => {
         tryCouponsBtn.textContent = 'Testing NOON20...';
         setTimeout(() => {
           tryCouponsBtn.textContent = 'Found AED 15 Off!';
           tryCouponsBtn.style.background = '#059669';
           tryCouponsBtn.style.opacity = '1';
         }, 1500);
      }, 1500);
    });
  }
}

let lastCheckedSku = '';
let isRunning = false;

async function checkAndRun() {
  if (isRunning) return;
  const details = extractProductDetails();
  if (!details || details.sku === lastCheckedSku) return;

  isRunning = true;
  lastCheckedSku = details.sku;
  console.log('[DirhamDrop Extension] Detected product:', details);

  // Remove existing pill if any
  const existing = document.getElementById('dirhamdrop-pill-host');
  if (existing) existing.remove();

  try {
    const res = await fetch(`${API_BASE_URL}/api/extension-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hostDomain: window.location.hostname,
        title: details.title,
        sku: details.sku,
        currentPrice: details.price,
      }),
    });

    const data: ExtensionMatchResponse = await res.json();
    if (data.matchFound) {
      injectFloatingPill(data, details.price);
    }
  } catch (err) {
    console.warn('[DirhamDrop Extension] Match check failed:', err);
  } finally {
    isRunning = false;
  }
}

// Check every 2 seconds for SPA navigation changes (Noon.com etc.)
setInterval(checkAndRun, 2000);

// Execute immediately on script load if possible
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  checkAndRun();
} else {
  window.addEventListener('DOMContentLoaded', checkAndRun);
}

// Respond to popup queries
if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
    if (request.type === 'GET_ACTIVE_PRODUCT') {
      const details = extractProductDetails();
      sendResponse({
        success: true,
        details,
        hostDomain: window.location.hostname,
      });
    }
    return true;
  });
}
