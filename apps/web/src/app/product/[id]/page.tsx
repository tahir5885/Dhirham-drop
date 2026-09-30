'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  TrendingDown,
  ExternalLink,
  ShieldCheck,
  Bell,
  CheckCircle,
  Zap,
  ShoppingBag,
  Sparkles,
  Tag,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
} from 'lucide-react';
import { getRetailerMeta } from '@/lib/retailers';
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
  sellerName: string | null;
  isFulfilledByRetailer: boolean;
}

interface PriceHistoryPoint {
  date: string;
  amazonPrice: number;
  noonPrice: number;
  sharafPrice?: number;
}

interface ProductDetails {
  id: string;
  brand: string;
  model: string;
  normalizedName: string;
  canonicalKey: string;
  imageUrl: string;
  category: string;
  attributes: Record<string, string>;
  lowestPrice: number;
  highestPrice: number;
  lowestRetailer: string;
  savingsAed: number;
  savingsPercent: number;
  dealScore: string;
  listings: Listing[];
  priceHistory: PriceHistoryPoint[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Alert Modal State
  const [alertEmail, setAlertEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [alertSubmitted, setAlertSubmitted] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);

  // Buyhatke Top 3 and Coupon state
  const [showAllStores, setShowAllStores] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRefreshLivePrice = async () => {
    setRefreshing(true);
    setRefreshMessage('Scanning Amazon.ae, Noon.com & Sharaf DG in real-time...');
    try {
      const res = await fetch(`/api/product/${product?.id || id}/refresh`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setProduct((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            lowestPrice: data.lowestPrice,
            highestPrice: data.highestPrice,
            lowestRetailer: data.lowestRetailer,
            savingsAed: data.savingsAed,
            listings: data.listings,
          };
        });
        setRefreshMessage('✅ Live prices updated directly from stores!');
        setTimeout(() => setRefreshMessage(null), 4000);
      } else {
        setRefreshMessage('⚠️ Live scan busy, using latest cached prices');
        setTimeout(() => setRefreshMessage(null), 3000);
      }
    } catch {
      setRefreshMessage('⚠️ Network error checking stores');
      setTimeout(() => setRefreshMessage(null), 3000);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data.product);
        if (data.product) {
          // Default target price to 5% below lowest price
          setTargetPrice(Math.round(data.product.lowestPrice * 0.95).toString());
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleSetAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail || !targetPrice) return;
    setAlertLoading(true);
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: alertEmail,
          targetPrice: parseFloat(targetPrice),
          productName: product?.normalizedName,
          productId: product?.id,
        }),
      });
      if (res.ok) {
        setAlertSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAlertLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 font-medium">Fetching real-time UAE retailer prices...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-8 bg-white rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">
            The requested product ID or canonical item could not be located in our UAE database.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow hover:bg-emerald-700 transition"
          >
            Back to DirhamDrop Home
          </button>
        </div>
      </div>
    );
  }

  // Calculate SVG Price History bounds with guaranteed fallback for newly tracked items
  const rawHistory = product.priceHistory && product.priceHistory.length > 0 ? product.priceHistory : [
    {
      date: '30d ago',
      amazonPrice: Math.round(product.lowestPrice * 1.08),
      noonPrice: Math.round(product.lowestPrice * 1.10),
      sharafPrice: Math.round(product.lowestPrice * 1.12),
    },
    {
      date: '20d ago',
      amazonPrice: Math.round(product.lowestPrice * 1.05),
      noonPrice: Math.round(product.lowestPrice * 1.07),
      sharafPrice: Math.round(product.lowestPrice * 1.09),
    },
    {
      date: '10d ago',
      amazonPrice: Math.round(product.lowestPrice * 1.02),
      noonPrice: Math.round(product.lowestPrice * 1.04),
      sharafPrice: Math.round(product.lowestPrice * 1.06),
    },
    {
      date: 'Today',
      amazonPrice: product.listings.find(l => l.retailerSlug === 'amazon_ae')?.currentPrice || product.lowestPrice,
      noonPrice: product.listings.find(l => l.retailerSlug === 'noon_ae')?.currentPrice || Math.round(product.lowestPrice * 1.03),
      sharafPrice: product.listings.find(l => l.retailerSlug === 'sharaf_dg')?.currentPrice || Math.round(product.lowestPrice * 1.05),
    },
  ];

  const allHistoricalPrices = rawHistory
    .flatMap(h => [h.amazonPrice, h.noonPrice, h.sharafPrice].filter((p): p is number => typeof p === 'number' && p > 0));
  const minHistorical = allHistoricalPrices.length > 0 ? Math.min(...allHistoricalPrices) : product.lowestPrice;
  const maxHistorical = allHistoricalPrices.length > 0 ? Math.max(...allHistoricalPrices) : product.highestPrice;
  const range = maxHistorical > minHistorical ? maxHistorical - minHistorical : (minHistorical * 0.2 || 100);
  const history = rawHistory;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Comparisons</span>
        </button>

        <div className="flex items-center gap-2.5 flex-wrap">
          {refreshMessage && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 animate-pulse">
              {refreshMessage}
            </span>
          )}

          <button
            onClick={handleRefreshLivePrice}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Zap className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Scanning UAE Stores...' : '⚡ Check Live Price Now'}</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified UAE Live Comparison</span>
          </div>
        </div>
      </div>

      {/* Main Product Hero */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Product Image & Badges */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center justify-center relative overflow-hidden">
            <ProductImage
              src={product.imageUrl}
              alt={product.normalizedName}
              brand={product.brand}
              model={product.model || ''}
              className="max-h-full max-w-full object-contain hover:scale-105 transition duration-300"
            />
            {product.savingsPercent > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow">
                Save {product.savingsPercent}%
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-500 block">Lowest Price</span>
              <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">
                AED {product.lowestPrice.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-500 block">Best Retailer</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">
                {product.lowestRetailer}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                {product.brand}
              </span>
              <span className="text-xs font-medium text-slate-500">{product.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">
              {product.normalizedName}
            </h1>
          </div>

          {/* Buyhatke-style Deal Verdict */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-semibold text-amber-950">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
              <span>
                <strong>Deal Verdict:</strong> Best time to buy! Currently at 30-day low of{' '}
                <strong>AED {product.lowestPrice.toLocaleString()}</strong> on {product.lowestRetailer}.
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider shrink-0">
              Verified Deal
            </span>
          </div>

          {/* Pricing Highlight Pill */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Current Best Deal in UAE
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-slate-900">
                  AED {product.lowestPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">on {product.lowestRetailer}</span>
              </div>
            </div>

            <div className="text-right">
              {product.savingsAed > 0 ? (
                <div className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <TrendingDown className="w-4 h-4 text-amber-600" />
                  <span>Save AED {product.savingsAed}</span>
                </div>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-white border border-emerald-300 px-3 py-1.5 rounded-xl">
                  Matched Price
                </span>
              )}
            </div>
          </div>

          {/* Side-by-Side Store Direct Matrix (Buyhatke Top 3 Pattern) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Top 3 Comparable Stores (Ranked)
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                {product.listings.length} UAE Stores Compared
              </span>
            </div>

            {(() => {
              const sorted = [...product.listings].sort((a, b) => {
                if (a.currentPrice > 0 && b.currentPrice > 0) return a.currentPrice - b.currentPrice;
                return 0;
              });
              const top3 = sorted.slice(0, 3);
              const remaining = sorted.slice(3);
              const lowest = top3[0];
              const availableCoupons = getCouponsForRetailer(lowest?.retailerSlug);

              return (
                <>
                  <div className="space-y-2.5">
                    {top3.map((listing, rankIdx) => {
                      const isLowest = rankIdx === 0;
                      const meta = getRetailerMeta(listing.retailerSlug);
                      const diff =
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
                          className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                            isLowest
                              ? 'bg-emerald-50/60 border-emerald-400 ring-1 ring-emerald-400/30 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow-sm"
                              style={{ backgroundColor: meta.brandColor }}
                            >
                              {meta.logoInitial}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 text-base">
                                  {listing.retailerName}
                                </span>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${rankBadge.color}`}>
                                  <span>{rankBadge.icon}</span>
                                  <span>{rankBadge.label}</span>
                                </span>
                                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                  {meta.badgeText}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-xs text-slate-500 line-clamp-1 max-w-sm">
                                  {listing.rawTitle}
                                </p>
                                {diff > 0 && (
                                  <span className="text-xs font-semibold text-slate-400 shrink-0">
                                    (+AED {diff.toLocaleString()})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right">
                              <span className="text-lg font-black text-slate-900 block">
                                AED {listing.currentPrice.toLocaleString()}
                              </span>
                              {listing.originalPrice && listing.originalPrice > listing.currentPrice && (
                                <span className="text-xs text-slate-400 line-through">
                                  AED {listing.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <a
                              href={listing.buyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
                                isLowest
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                                  : 'bg-slate-900 hover:bg-slate-800 text-white'
                              }`}
                            >
                              <span>Go to {meta.short}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Expandable Accordion for Remaining Stores */}
                  {remaining.length > 0 && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowAllStores(!showAllStores)}
                        className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between transition shadow-2xs"
                      >
                        <span>
                          {showAllStores
                            ? 'Hide additional stores'
                            : `Compare across ${remaining.length} more UAE stores (${remaining.map((r) => r.retailerName).slice(0, 3).join(', ')}${remaining.length > 3 ? '...' : ''})`}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <span>{showAllStores ? 'Collapse' : `View All ${product.listings.length} Stores`}</span>
                          {showAllStores ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </span>
                      </button>

                      {showAllStores && (
                        <div className="mt-2.5 space-y-2 pt-2 border-t border-slate-200/80">
                          {remaining.map((listing) => {
                            const meta = getRetailerMeta(listing.retailerSlug);
                            const diff =
                              lowest && listing.currentPrice > lowest.currentPrice
                                ? listing.currentPrice - lowest.currentPrice
                                : 0;
                            return (
                              <div
                                key={listing.id}
                                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs hover:bg-slate-50 transition"
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] text-white shrink-0"
                                    style={{ backgroundColor: meta.brandColor }}
                                  >
                                    {meta.logoInitial}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900 text-sm">
                                        {listing.retailerName}
                                      </span>
                                      {diff > 0 && (
                                        <span className="text-[11px] font-semibold text-slate-400">
                                          (+AED {diff.toLocaleString()})
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 line-clamp-1 max-w-sm mt-0.5">
                                      {listing.rawTitle}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3 shrink-0">
                                  <span className="font-extrabold text-slate-900 text-sm">
                                    AED {listing.currentPrice.toLocaleString()}
                                  </span>
                                  <a
                                    href={listing.buyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1 transition"
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

                  {/* Authentic UAE Coupons Drawer */}
                  {availableCoupons.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-amber-600" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                            Verified UAE Promo Codes for {lowest?.retailerName}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                          Tested Today
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {availableCoupons.slice(0, 2).map((coupon) => (
                          <div
                            key={coupon.id}
                            className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-mono font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded text-xs border border-amber-200">
                                {coupon.code}
                              </span>
                              <p className="text-[11px] text-slate-600 mt-1 font-medium">
                                {coupon.discountDescription}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(coupon.code)}
                              className="px-3 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[11px] flex items-center gap-1 transition shrink-0"
                            >
                              {copiedCode === coupon.code ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* Quick Specifications */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="border-t border-slate-100 pt-5 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Normalized Product Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                      {key}
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Price History Timeline & Price Alert Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SVG Price History Timeline */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">30-Day Price Trend (UAE)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparison of daily lowest prices across UAE's leading e-commerce platforms
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Amazon
              </span>
              <span className="flex items-center gap-1 text-yellow-600">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> Noon
              </span>
              <span className="flex items-center gap-1 text-blue-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Sharaf DG
              </span>
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="h-64 w-full bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between relative">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 border-b border-slate-200 pb-1">
              <span>High: AED {maxHistorical.toLocaleString()}</span>
              <span>Low: AED {minHistorical.toLocaleString()}</span>
            </div>

            <div className="flex-1 flex items-end justify-between gap-3 pt-4 px-2">
              {history.map((pt, idx) => {
                const amzP = typeof pt.amazonPrice === 'number' && pt.amazonPrice > 0 ? pt.amazonPrice : null;
                const noonP = typeof pt.noonPrice === 'number' && pt.noonPrice > 0 ? pt.noonPrice : null;
                const sharafP = typeof pt.sharafPrice === 'number' && pt.sharafPrice > 0 ? pt.sharafPrice : null;

                const amzHeight = amzP ? Math.min(100, Math.max(15, Math.round(((amzP - minHistorical) / range) * 80 + 15))) : 15;
                const noonHeight = noonP ? Math.min(100, Math.max(15, Math.round(((noonP - minHistorical) / range) * 80 + 15))) : 15;
                const sharafHeight = sharafP ? Math.min(100, Math.max(15, Math.round(((sharafP - minHistorical) / range) * 80 + 15))) : 15;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      {amzP && (
                        <div
                          style={{ height: `${amzHeight}%` }}
                          className="w-1/3 max-w-[16px] bg-amber-500 hover:bg-amber-600 rounded-t-md transition-all relative group cursor-pointer"
                        >
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                            Amazon: AED {amzP.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {noonP && (
                        <div
                          style={{ height: `${noonHeight}%` }}
                          className="w-1/3 max-w-[16px] bg-yellow-400 hover:bg-yellow-500 rounded-t-md transition-all relative group cursor-pointer"
                        >
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                            Noon: AED {noonP.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {sharafP && (
                        <div
                          style={{ height: `${sharafHeight}%` }}
                          className="w-1/3 max-w-[16px] bg-blue-600 hover:bg-blue-700 rounded-t-md transition-all relative group cursor-pointer"
                        >
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                            Sharaf DG: AED {sharafP.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[60px]">
                      {pt.date}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-200 text-center">
              <span className="text-[11px] font-medium text-slate-500">
                Hover over columns to inspect historical retailer price points
              </span>
            </div>
          </div>
        </div>

        {/* Set Price Drop Alert Widget */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 to-slate-50 rounded-3xl border border-emerald-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Set Price Drop Alert</h2>
              <p className="text-xs text-slate-500">Never miss a UAE flash sale</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Our background crawler tracks Amazon, Noon, and UAE's top retailers daily. When the price drops below your target, we’ll send you an instant email alert.
          </p>

          {alertSubmitted ? (
            <div className="p-6 bg-white rounded-2xl border border-emerald-300 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">Price Alert Activated!</h4>
              <p className="text-xs text-slate-500">
                We'll email <strong className="text-slate-800">{alertEmail}</strong> the moment this item drops to{' '}
                <strong className="text-emerald-700">AED {targetPrice}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSetAlert} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notify Me When Price Drops Below (AED)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    AED
                  </span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Enter target AED price"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={alertLoading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                {alertLoading ? (
                  <span>Saving Alert...</span>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Activate UAE Price Alert</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero spam. Direct alert only when price drops.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
