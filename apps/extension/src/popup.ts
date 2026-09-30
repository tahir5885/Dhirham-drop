export {};

const API_BASE_URL = 'http://localhost:3000';

interface CompetitorDeal {
  retailerName: string;
  retailerSlug: string;
  price: number;
  currency: string;
  savingsAed: number;
  buyUrl: string;
}

document.addEventListener('DOMContentLoaded', async () => {
  const activeTabSection = document.getElementById('active-tab-section')!;
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const searchResults = document.getElementById('search-results')!;
  const searchForm = document.getElementById('search-form') as HTMLFormElement;

  // 1. Check active tab for Amazon.ae or Noon.com
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs: any[]) => {
      const activeTab = tabs[0];
      if (!activeTab || !activeTab.url) return;

      const TOP_10_DOMAINS = [
        'amazon.ae',
        'noon.com',
        'sharafdg.com',
        'jumbo.ae',
        'carrefouruae.com',
        'microless.com',
        'virginmegastore.ae',
        'luluhypermarket.com',
        'emaxme.com',
        'namshi.com',
      ];

      const isRetailer = TOP_10_DOMAINS.some((d) => activeTab.url.includes(d));

      if (isRetailer) {
        activeTabSection.innerHTML = `
          <div class="loading-spinner">
            <span class="pulse-dot"></span> Scanning live product page...
          </div>
        `;

        try {
          chrome.tabs.sendMessage(
            activeTab.id,
            { type: 'GET_ACTIVE_PRODUCT' },
            async (response: any) => {
              if (!response || !response.details) {
                activeTabSection.innerHTML = `
                  <div class="status-box info">
                    ℹ️ Browse to any product on Amazon, Noon, Sharaf DG, Jumbo, Carrefour, Microless &amp; more to see live price drops.
                  </div>
                `;
                return;
              }

              const { title, sku, price } = response.details;
              const hostDomain = response.hostDomain;

              // Query match API
              const matchRes = await fetch(`${API_BASE_URL}/api/extension-match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  hostDomain,
                  title,
                  sku,
                  currentPrice: price,
                }),
              });

              const data = await matchRes.json();
              if (data.matchFound && data.bestCompetitor) {
                const best: CompetitorDeal = data.bestCompetitor;
                const hasSavings = best.savingsAed > 0;

                activeTabSection.innerHTML = `
                  <div class="deal-card ${hasSavings ? 'has-savings' : 'best-price'}">
                    <div class="deal-header">
                      <span class="badge ${hasSavings ? 'badge-save' : 'badge-match'}">
                        ${hasSavings ? `🎉 Save AED ${best.savingsAed}` : '✅ Best Price Confirmed'}
                      </span>
                      <span class="current-site">${hostDomain.includes('amazon') ? 'Amazon.ae' : 'Noon.com'}</span>
                    </div>

                    <div class="product-title" title="${title}">${data.canonicalName || title}</div>

                    <div class="price-comparison">
                      <div>
                        <small>Current Store</small>
                        <div class="price-val">AED ${price.toLocaleString()}</div>
                      </div>
                      <div class="arrow">&rarr;</div>
                      <div>
                        <small>${best.retailerName}</small>
                        <div class="price-val highlight">AED ${best.price.toLocaleString()}</div>
                      </div>
                    </div>

                    ${
                      hasSavings && best.buyUrl
                        ? `<a href="${best.buyUrl}" target="_blank" class="buy-btn">
                             View Deal on ${best.retailerName} &rarr;
                           </a>`
                        : `<div class="sub-text">You have the lowest price on this store!</div>`
                    }
                  </div>
                `;
              } else {
                activeTabSection.innerHTML = `
                  <div class="status-box ok">
                    ✅ Active product monitored. No cheaper competitor price found right now.
                  </div>
                `;
              }
            }
          );
        } catch (err) {
          activeTabSection.innerHTML = `
            <div class="status-box info">
              ℹ️ Open an item on Amazon.ae or Noon.com to compare prices.
            </div>
          `;
        }
      } else {
        activeTabSection.innerHTML = `
          <div class="status-box info">
            🌐 Browse on <strong>Amazon.ae</strong> or <strong>Noon.com</strong> to auto-compare prices.
          </div>
        `;
      }
    });
  }

  // 2. Instant Search Handler
  let debounceTimer: any;
  const executeSearch = async (query: string) => {
    if (!query.trim()) {
      searchResults.innerHTML = '';
      return;
    }

    searchResults.innerHTML = '<div class="loading-search">Searching UAE catalogs...</div>';

    try {
      const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        searchResults.innerHTML = '<div class="no-res">No UAE matches found. Try "iPhone", "Sony", or "Dyson".</div>';
        return;
      }

      searchResults.innerHTML = data.results
        .slice(0, 3)
        .map((p: any) => {
          return `
            <div class="mini-result">
              <div class="mini-info">
                <strong>${p.normalizedName}</strong>
                <div class="mini-meta">
                  Best: <span>AED ${p.lowestPrice.toLocaleString()}</span> on ${p.lowestRetailer}
                </div>
              </div>
              <a href="${API_BASE_URL}/product/${p.id}" target="_blank" class="mini-btn">
                Compare &rarr;
              </a>
            </div>
          `;
        })
        .join('');
    } catch {
      searchResults.innerHTML = '<div class="no-res">Search engine offline.</div>';
    }
  };

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => executeSearch(searchInput.value), 300);
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSearch(searchInput.value);
  });
});
