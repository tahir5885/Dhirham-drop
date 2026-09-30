'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingBag, ArrowRight, TrendingDown, ExternalLink, ShieldCheck, Zap, Bell, CheckCircle2, Tag, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { TOP_10_RETAILERS, getRetailerMeta } from '@/lib/retailers';
import { getCouponsForRetailer } from '@/lib/coupons';
import { ProductImage } from '@/components/ProductImage';

interface Listing {
  id: string;
  sku: string;
  retailerName: string;
  retailerSlug: string;
  domain: string;
  rawTitle: string;
  currentPrice: number;
  originalPrice: number | null;
  currency: string;
  buyUrl: string;
  stockStatus: string;
  rating: number | null;
  reviewCount: number | null;
  sellerName?: string | null;
  isFulfilledByRetailer: boolean;
}

interface ProductResult {
  id: string;
  brand: string;
  model: string | null;
  normalizedName: string;
  canonicalKey: string;
  imageUrl: string | null;
  category: string | null;
  lowestPrice: number;
  lowestRetailer: string;
  savingsAed: number;
  savingsPercent: number;
  listings: Listing[];
}

const CATEGORIES = [
  'All',
  'Smartphones',
  'Laptops & Computers',
  'Audio & Headphones',
  'Gaming',
  'Tablets & Wearables',
  'Home & Living',
  'Perfumes & Fragrances',
  'Cameras & Drones',
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProductResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'savings'>('recommended');

  const toggleExpand = (productId: string) => {
    setExpandedProducts((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const fetchResults = async (q: string = query, cat: string = selectedCategory) => {
    setLoading(true);
    try {
      const catParam = cat && cat !== 'All' ? `&category=${encodeURIComponent(cat)}` : '';
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}${catParam}`);
      const data = await res.json();
      setResults(data.results || []);
      setSearched(true);
    } catch (err) {
      console.error('Search request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of popular UAE products
    fetchResults('', 'All');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(query, selectedCategory);
  };

  const quickSearches = [
    'iPhone 15 Pro Max',
    'PS5 Slim',
    'MacBook Air M3',
    'AirPods Pro',
    'Nintendo Switch',
    'Sony WH-1000XM5',
    'Galaxy S24 Ultra',
    'Dyson Airwrap',
    'Xbox Series X',
  ];

  const displayedResults = [...results].sort((a, b) => {
    if (sortBy === 'price_low') {
      const pA = a.lowestPrice > 0 ? a.lowestPrice : Infinity;
      const pB = b.lowestPrice > 0 ? b.lowestPrice : Infinity;
      return pA - pB;
    }
    if (sortBy === 'price_high') return b.lowestPrice - a.lowestPrice;
    if (sortBy === 'savings') return b.savingsAed - a.savingsAed;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          <span>UAE's Dedicated Price Comparison Engine</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Never Overpay Across <span className="text-emerald-600">Top 10 UAE Stores</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Comparing real-time prices across Amazon.ae, Noon, Sharaf DG, Jumbo, Carrefour, Microless, Virgin Megastore, LuLu, Emax, and Namshi.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="pt-4 flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name, model (e.g., iPhone 15 Pro Max, Sony WH-1000XM5)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
          <span>Trending in UAE:</span>
          {quickSearches.map((item) => (
            <button
              key={item}
              onClick={() => {
                setQuery(item);
                fetchResults(item);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Top 10 UAE Retailers Ribbon */}
        <div className="pt-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-1.5 mb-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tracking UAE's Top 10 E-Commerce Platforms</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TOP_10_RETAILERS.map((ret) => (
              <span
                key={ret.slug}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm hover:border-slate-300 transition"
                title={`${ret.name} - ${ret.popularFor}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: ret.brandColor }}
                />
                <span>{ret.short}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span>
              {query ? `Search Results for "${query}"` : 'Popular UAE Deals & Comparisons'}
            </span>
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {results.length} Products Found
          </span>
        </div>

        {/* Category Filter Pills & Sorting Control */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    fetchResults(query, cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-xs'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 self-end md:self-auto">
            <span className="font-semibold text-slate-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="recommended">Best Deals (Curated)</option>
              <option value="price_low">Lowest Price First</option>
              <option value="price_high">Highest Price First</option>
              <option value="savings">Biggest Savings (AED)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-3" />
            <p className="text-sm font-medium">Scanning Amazon.ae, Noon.com and Sharaf DG prices...</p>
          </div>
        ) : results.length === 0 && searched ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-600 font-medium">No direct matches found for "{query}".</p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching by brand or model name like "Sony", "iPhone", or "Dyson".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayedResults.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.normalizedName}
                      brand={product.brand}
                      model={product.model || ''}
                      className="w-24 h-24 object-contain rounded-xl bg-slate-50 p-2 border border-slate-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {product.brand}
                        </span>
                        {product.category && (
                          <span className="text-[11px] font-medium text-slate-500">
                            {product.category}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 mt-1 text-base leading-snug">
                        {product.normalizedName}
                      </h3>

                      {product.savingsAed > 0 && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                          <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            Save AED {product.savingsAed} ({product.savingsPercent}%) by buying on{' '}
                            {product.lowestRetailer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buyhatke-style Top 3 Comparable Prices Breakdown Matrix */}
                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span>Top 3 Comparable Deals (Ranked)</span>
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {product.listings.length} Stores Verified
                      </span>
                    </div>

                    {(() => {
                      const validListings = [...(product.listings || [])].sort((a, b) => {
                        if (a.currentPrice > 0 && b.currentPrice > 0) return a.currentPrice - b.currentPrice;
                        return 0;
                      });
                      const top3 = validListings.slice(0, 3);
                      const remaining = validListings.slice(3);
                      const isExpanded = !!expandedProducts[product.id];
                      const lowest = top3[0];
                      const storeCoupons = lowest?.retailerSlug ? getCouponsForRetailer(lowest.retailerSlug) : [];
                      const topCoupon = storeCoupons[0];

                      if (top3.length === 0) {
                        return (
                          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
                            <span className="text-xs text-slate-500 font-medium">
                              Live prices currently syncing across UAE stores...
                            </span>
                          </div>
                        );
                      }

                      return (
                        <>
                          {top3.map((listing, rankIdx) => {
                            const isLowest = rankIdx === 0 && listing.currentPrice > 0;
                            const meta = getRetailerMeta(listing.retailerSlug);
                            const priceDiff =
                              lowest && listing.currentPrice > lowest.currentPrice
                                ? listing.currentPrice - lowest.currentPrice
                                : 0;

                            const rankBadge =
                              rankIdx === 0
                                ? { icon: '🥇', label: '#1 Best Price', color: 'bg-emerald-600 text-white' }
                                : rankIdx === 1
                                ? { icon: '🥈', label: '#2 Runner-up', color: 'bg-slate-700 text-white' }
                                : { icon: '🥉', label: '#3 Runner-up', color: 'bg-amber-800 text-white' };

                            return (
                              <div
                                key={listing.id}
                                className={`flex items-center justify-between p-3.5 rounded-xl border text-sm transition ${
                                  isLowest
                                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/20 shadow-sm'
                                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <span
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: meta.brandColor }}
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900">
                                        {listing.retailerName}
                                      </span>
                                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-1 ${rankBadge.color}`}>
                                        <span>{rankBadge.icon}</span>
                                        <span>{rankBadge.label}</span>
                                      </span>
                                      {listing.isFulfilledByRetailer && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-medium border border-blue-200">
                                          {meta.badgeText}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs text-slate-500 line-clamp-1 max-w-[240px]">
                                        {listing.rawTitle}
                                      </span>
                                      {priceDiff > 0 && (
                                        <span className="text-[11px] font-semibold text-slate-400">
                                          (+AED {priceDiff.toLocaleString()})
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    {listing.currentPrice > 0 ? (
                                      <>
                                        <span className="text-base font-extrabold text-slate-900 block">
                                          AED {listing.currentPrice.toLocaleString()}
                                        </span>
                                        {listing.originalPrice &&
                                          listing.originalPrice > listing.currentPrice && (
                                            <p className="text-xs text-slate-400 line-through">
                                              AED {listing.originalPrice.toLocaleString()}
                                            </p>
                                          )}
                                      </>
                                    ) : (
                                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                        Live Catalog
                                      </span>
                                    )}
                                  </div>

                                  <a
                                    href={listing.buyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
                                      isLowest
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                                    }`}
                                  >
                                    <span>
                                      {listing.currentPrice > 0
                                        ? `Go to ${meta.short}`
                                        : `Search ${meta.short}`}
                                    </span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}

                          {/* Authentic UAE Promo Code Pill for Top Store */}
                          {topCoupon && lowest && lowest.retailerName && (
                            <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                              <div className="flex items-center gap-2">
                                <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>
                                  Extra discount on {lowest.retailerName}: Use promo code{' '}
                                  <strong className="font-mono font-black text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded">
                                    {topCoupon.code}
                                  </strong>{' '}
                                  ({topCoupon.discountDescription})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyCode(topCoupon.code)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[11px] transition shadow-xs shrink-0"
                              >
                                {copiedCoupon === topCoupon.code ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-700" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Code</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {/* Expandable Deep Comparison for Remaining Stores */}
                          {remaining.length > 0 && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => toggleExpand(product.id)}
                                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between transition"
                              >
                                <span className="flex items-center gap-1.5">
                                  <span>
                                    {isExpanded
                                      ? 'Hide additional stores'
                                      : `Compare ${remaining.length} more stores (${remaining.map((r) => r.retailerName).slice(0, 3).join(', ')}${remaining.length > 3 ? '...' : ''})`}
                                  </span>
                                </span>
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                  <span>{isExpanded ? 'Collapse' : `View All ${product.listings.length} Stores`}</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="mt-2 space-y-2 pt-2 border-t border-slate-200/80">
                                  {remaining.map((listing) => {
                                    const meta = getRetailerMeta(listing.retailerSlug);
                                    const diff =
                                      lowest && listing.currentPrice > lowest.currentPrice
                                        ? listing.currentPrice - lowest.currentPrice
                                        : 0;
                                    return (
                                      <div
                                        key={listing.id}
                                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs hover:bg-slate-50 transition"
                                      >
                                        <div className="flex items-center space-x-2.5">
                                          <span
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={{ backgroundColor: meta.brandColor }}
                                          />
                                          <span className="font-semibold text-slate-800">
                                            {listing.retailerName}
                                          </span>
                                          {diff > 0 && (
                                            <span className="text-[10px] text-slate-400">
                                              (+AED {diff.toLocaleString()})
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center space-x-3">
                                          <span className="font-bold text-slate-900">
                                            AED {listing.currentPrice.toLocaleString()}
                                          </span>
                                          <a
                                            href={listing.buyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1 transition"
                                          >
                                            <span>Go to {meta.short}</span>
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified UAE Stock
                  </span>
                  <a
                    href={`/product/${product.id}`}
                    className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold transition"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Price History &amp; Alerts &rarr;</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extension Feature Banner */}
      <div id="extension" className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5" />
            <span>Chrome Extension Preview (Stage 4)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Shop directly across Top 10 UAE Stores with Automatic Price Drop Alerts
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Our extension silently monitors your active product page on Amazon, Noon, Sharaf DG, Jumbo, Microless, Carrefour, Virgin Megastore, and more. When another store is cheaper, we show you the lower price and instant savings immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
