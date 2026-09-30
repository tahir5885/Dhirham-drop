# DirhamDrop 🇦🇪 📉
> **The Smart Price Comparison & Deal Intelligence Engine for UAE & GCC**

DirhamDrop tracks prices across major UAE retailers (**Amazon.ae**, **Noon.com**, etc.), unifies product variations through intelligent normalization and fuzzy-matching, and provides consumers with live price comparison, price history charts, and price-drop alerts.

---

## 🛡️ Critical PRD Safeguards & Architecture

1. **Amazon Associates Ban Risk Mitigation (Cross-Pollination Rule)**
   - *Problem*: In-page browser extensions that drop Amazon affiliate tags on `amazon.ae` violate the Amazon Associates Operating Agreement, risking immediate account termination.
   - *Solution*: **Cross-pollination**. When a shopper views an item on `Amazon.ae`, the extension only surfaces links to competitor deals (Noon/Namshi). When browsing on `Noon.com`, the extension surfaces Amazon affiliate links.

2. **Noon Anti-Bot Defense (DataDome & PerimeterX Bypass)**
   - *Architecture*: Data collection scrapers are decoupled and built with `playwright-extra` + `puppeteer-extra-plugin-stealth` + rotating UAE residential proxy pools with automatic fallback.

3. **GCC Scalability Architecture**
   - *Market Roadmap*: Phase 1 & 2 launch as **DirhamDrop** in UAE (`AED`). The underlying database and canonical product model support multi-currency (`SAR` for Saudi Arabia / "RiyalDrop", `KWD`, `OMR`) without breaking changes.

---

## 🗺️ Implementation Roadmap (RPD Format)

| Stage | Module | Status | Deliverables |
|---|---|---|---|
| **Stage 1** | **Product Matching & Database Layer** | ✅ **Completed** | Prisma PostgreSQL Schema (`ProductCanonical`, `Retailer`, `RetailerListing`, `PriceHistory`), UAE Title Cleaner, Attribute Extractor, Fuzzy Matcher (Accessory & Variant Guards) |
| **Stage 2** | **Data Collection Layer (Crawlers)** | ✅ **Completed** | Isolated Amazon.ae & Noon.com direct product & search crawlers using `playwright-extra` + stealth + proxy pool abstraction + Scrapering.com cloud integration + price tracking scheduler |
| **Stage 3** | **API & Next.js Website (MVP)** | ✅ **Completed** | Next.js App Router, `/api/search?q=...` fuzzy search, lowest price sorting, interactive 30-day price history timeline, `/deals` curated price cuts page, `/api/alerts` subscription engine |
| **Stage 4** | **Chrome Extension (Client-Side)** | ✅ **Completed** | Manifest V3 extension, Amazon/Noon DOM parser, Shadow DOM floating comparison pill, cross-pollination affiliate enforcement, interactive popup scanner & quick search |
| **Stage 5** | **Price Tracking & Alerts (Phase 2.5)** | ⏳ Next | Recharts price history timeline, Supabase auth, target price triggers, Resend email worker |

---

## 🧩 Stage 4: Manifest V3 Chrome Extension

### Architecture & Anti-Ban Compliance (`@dirhamdrop/extension`)
- **Zero Style Collision**: Floating deal card injected using **Shadow DOM** (`#dirhamdrop-pill-host`), ensuring retailer styles (Amazon/Noon CSS) never distort the comparison pill.
- **Amazon Associates Compliance (Cross-Pollination Rule)**:
  - When browsing `Amazon.ae`: Surfaces competitor deals on `Noon.com` with Noon affiliate code (`DIRHAMDROP`). Strictly prohibits Amazon affiliate cookie injection on `amazon.ae`.
  - When browsing `Noon.com`: Surfaces deals on `Amazon.ae` with Amazon Associates affiliate tag (`tag=dirhamdrop-21`).
- **Interactive Toolbar Popup (`popup.html` & `popup.js`)**:
  - Live active tab scanner: Detects the active product on Amazon or Noon and displays competitor price comparison.
  - Built-in instant UAE search bar with live fuzzy autocomplete.
  - Quick links to DirhamDrop Web Hub and curated UAE deals.

### How to Load Extension in Chrome
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle on **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the directory: `d:\download\dhirhamdrop\apps\extension`.
5. The extension is now active and ready to compare prices!

---

## 🌐 Stage 3: Next.js 14 Web Application & Search Engine

### Web Architecture (`@dirhamdrop/web`)
- **Homepage (`/`)**:
  - Live fuzzy search bar powered by `@dirhamdrop/normalizer`.
  - Side-by-side store price comparison matrix (Amazon vs. Noon).
  - Lowest price badge & savings calculation (`Save AED X (Y% off)`).
  - Direct store purchase links with Amazon Associates & Noon affiliate parameters.
- **Product Detail Page (`/product/[id]`)**:
  - Deep-dive product specification table.
  - Interactive 30-day Price History Timeline comparing Amazon UAE vs. Noon UAE.
  - Instant Price Drop Alert subscription widget.
- **Curated Deals Page (`/deals`)**:
  - Highlights top price drops across UAE retailers.
  - Category filters: All Deals, Smartphones, Headphones, Beauty & Hair Care.
- **REST API Endpoints**:
  - `GET /api/search?q=...`: Live UAE product fuzzy search.
  - `GET /api/product/[id]`: Comprehensive product details, listings, and price history time-series.
  - `POST /api/alerts`: Real-time user price-drop alert subscription.

---

## 🤖 Stage 2: Data Collection & Price Tracking Engine

### Crawlers & Scrapers (`@dirhamdrop/crawlers`)
- **Direct Product Scrapers**:
  - `scrapeAmazonProduct(session, asinOrUrl)`: Extracts live price, strikethrough price, Prime eligibility, ratings, and stock status.
  - `scrapeNoonProduct(session, skuOrUrl)`: Extracts JSON-LD Schema.org product data, NextData, live prices, and Noon Express badges.
- **Search & Category Scrapers**:
  - `scrapeAmazonSearch(session, searchUrl)` and `scrapeNoonSearch(session, searchUrl)` for discovering new deals.
- **Scrapering.com Cloud API**:
  - Anti-bot bypass, automated CAPTCHA solving, and residential UAE proxies (`"proxyCountry": "AE"`).
  - Configurable via `SCRAPERING_API_KEY` in `.env`.
- **Scheduled Price Tracking Engine (`scheduler.ts`)**:
  - Runs periodic tracking cycles across database listings and priority watchlists.
  - Detects price drops (`oldPrice - newPrice > 0`), updates historical price time-series (`PriceHistory`), and triggers price drop alerts.

### Available CLI Commands
```bash
# Direct single product scrape
npm run --workspace=apps/crawlers crawl:product -- --product="https://www.amazon.ae/dp/B09ZFD9CBB"
npm run --workspace=apps/crawlers crawl:product -- --product="https://www.noon.com/.../N53330542A/p/"

# Price tracking cycle across monitored watchlist
npm run crawl:track

# Recurring daemon scheduler (e.g. check every 3600 seconds)
npm run crawl:scheduler -- --interval=3600

# Category crawl runs
npm run crawl:all
```

---

## 🧠 Stage 1: Product Matching & Database Architecture

### Prisma Schema Entities
- **`ProductCanonical`**: Central normalized product entity (`brand`, `model`, `normalizedName`, `canonicalKey`, `attributes`, `ean`, `imageUrl`).
- **`Retailer`**: Retailer platform registry (`name`, `domain`, `slug`, `affiliateParamKey`).
- **`RetailerListing`**: Specific listing scraped from a retailer (`sku`, `url`, `currentPrice`, `originalPrice`, `currency`, `stockStatus`, `isFulfilledByRetailer`).
- **`PriceHistory`**: Time-series historical price snapshots for trend graphs.
- **`UserAlert`**: User price-drop thresholds for notification triggers.

### Normalization & Fuzzy-Matching Engine (`@dirhamdrop/normalizer`)
- **UAE Noise Stripper**: Cleans retailer fluff like `[UAE Version]`, `Middle East Version`, `TDRA Approved`, `TRA Registered`, `Noon Express`, `Fulfilled by Amazon`, `2023 version`, `Free Delivery`.
- **Attribute Extractor**: Extracts brand, model, storage (`256GB`), RAM, color, connectivity (`5G`).
- **Accessory Safeguard**: Rejects matches between device and accessories (e.g., iPhone vs. iPhone Case).
- **Storage/Brand Guard**: Rejects matches with conflicting storage capacities (e.g., 128GB vs 512GB) or differing brands.
