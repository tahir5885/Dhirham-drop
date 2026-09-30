'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingDown,
  ExternalLink,
  Flame,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface DealItem {
  id: string;
  brand: string;
  name: string;
  category: string;
  imageUrl: string;
  originalPrice: number;
  currentPrice: number;
  savingsAed: number;
  savingsPercent: number;
  bestRetailer: string;
  retailerSlug: string;
  buyUrl: string;
  badgeText: string;
}

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/deals')
      .then(res => res.json())
      .then(data => {
        if (data.deals) setDeals(data.deals);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', 'Smartphones', 'Headphones', 'Beauty & Hair Care'];

  const filteredDeals =
    selectedCategory === 'All'
      ? deals
      : deals.filter((d) => d.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Curated Live UAE Price Drops</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Top Verified Deals on <span className="text-emerald-600">Amazon.ae</span>,{' '}
          <span className="text-yellow-500">Noon</span> &amp;{' '}
          <span className="text-blue-700">Sharaf DG</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Our background price tracker automatically detects price cuts, flash sales, and clearance discounts across UAE stores.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredDeals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
                  <img
                    src={deal.imageUrl}
                    alt={deal.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {deal.brand}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      {deal.badgeText}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 mt-1.5 text-base leading-snug line-clamp-2">
                    {deal.name}
                  </h3>

                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Save AED {deal.savingsAed.toLocaleString()} ({deal.savingsPercent}% OFF)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Best Current Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    AED {deal.currentPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    AED {deal.originalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/product/${deal.id}`}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 transition"
                >
                  Price History
                </Link>

                <a
                  href={deal.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition shadow-sm"
                >
                  <span>Buy Deal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
