'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AlertItem {
  id: string;
  email?: string;
  userEmail?: string;
  targetPrice: number;
  productName?: string;
  productId?: string;
  productImageUrl?: string;
  currentPrice?: number;
  retailerName?: string;
  buyUrl?: string;
  createdAt: string;
  isActive: boolean;
  canonicalProduct?: {
    id: string;
    title: string;
    imageUrl: string;
    targetPrice?: number;
  };
}

const PRESET_PRODUCTS = [
  {
    id: 'prod_sony_wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    currentPrice: 799,
    imageUrl: 'https://m.media-amazon.com/images/I/61+btxzpfDL._AC_SL1500_.jpg',
    buyUrl: 'https://www.amazon.ae/dp/B09ZFD9CBB',
    retailerName: 'Amazon.ae',
  },
  {
    id: 'prod_dyson_airwrap',
    name: 'Dyson Airwrap Multi-Styler Complete Long',
    currentPrice: 1999,
    imageUrl: 'https://m.media-amazon.com/images/I/61k1YpC9rEL._AC_SL1500_.jpg',
    buyUrl: 'https://www.amazon.ae/dp/B0B61XH5YT',
    retailerName: 'Amazon.ae',
  },
  {
    id: 'prod_iphone_15_pro_max',
    name: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium',
    currentPrice: 2626,
    imageUrl: 'https://m.media-amazon.com/images/I/81c50PU+lpL._AC_SL1500_.jpg',
    buyUrl: 'https://www.noon.com/uae-en/renewed-iphone-15-pro-max-256gb-natural-titanium-5g-with-facetime-international-version/N70100742V/p/?o=c33a9ef3da0ed25e',
    retailerName: 'Noon.com',
  },
  {
    id: 'prod_samsung_s24_ultra',
    name: 'Samsung Galaxy S24 Ultra 5G AI Smartphone (256 GB)',
    currentPrice: 2354,
    imageUrl: 'https://m.media-amazon.com/images/I/71WjsddcdcL._AC_SL1500_.jpg',
    buyUrl: 'https://www.noon.com/uae-en/renewed-galaxy-s24-ultra-titanium-gray-12gb-ram-256gb-5g-international-version/N70250982V/p/?o=df32995c725cca7f',
    retailerName: 'Noon.com',
  },
  {
    id: 'prod_sharaf_sony',
    name: 'Sony WH-1000XM5 Wireless Headphones (Sharaf DG UAE)',
    currentPrice: 829,
    imageUrl: 'https://m.media-amazon.com/images/I/61+elL4O1VL._AC_SX679_.jpg',
    buyUrl: 'https://uae.sharafdg.com/product/sony-wh-1000xm5-wireless-noise-canceling-headphones-black/',
    retailerName: 'Sharaf DG',
  },
];

export default function AlertsPage() {
  const [lookupEmail, setLookupEmail] = useState('shopper@dirhamdrop.com');
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // New Alert Form state
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const [targetPrice, setTargetPrice] = useState('750');
  const [emailInput, setEmailInput] = useState('shopper@dirhamdrop.com');
  const [triggerTestNow, setTriggerTestNow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Test Notification Modal / trigger state
  const [testingId, setTestingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAlerts(lookupEmail);
  }, []);

  async function fetchAlerts(emailToFetch?: string) {
    setLoading(true);
    try {
      const url = emailToFetch ? `/api/alerts?email=${encodeURIComponent(emailToFetch)}` : '/api/alerts';
      const res = await fetch(url);
      const data = await res.json();
      if (data.alerts) {
        setAlerts(data.alerts);
      }
    } catch {
      setStatusMsg({ text: 'Could not fetch alerts. Please check server.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAlert(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput || !targetPrice) return;

    setIsSubmitting(true);
    setStatusMsg(null);

    const product = PRESET_PRODUCTS[selectedProductIdx];

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          targetPrice: parseFloat(targetPrice),
          productId: product.id,
          productName: product.name,
          productImageUrl: product.imageUrl,
          currentPrice: product.currentPrice,
          buyUrl: product.buyUrl,
          retailerName: product.retailerName,
          triggerTestNow,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg({
          text: `🎉 Alert saved! ${data.message} ${triggerTestNow ? '(Test notification dispatched!)' : ''}`,
          type: 'success',
        });
        setLookupEmail(emailInput);
        fetchAlerts(emailInput);
      } else {
        setStatusMsg({ text: data.error || 'Failed to create alert.', type: 'error' });
      }
    } catch {
      setStatusMsg({ text: 'Error connecting to alert service.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteAlert(id: string) {
    if (!confirm('Are you sure you want to delete this price alert?')) return;

    try {
      const res = await fetch(`/api/alerts?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a.id !== id));
        setStatusMsg({ text: 'Price alert cancelled successfully.', type: 'info' });
      }
    } catch {
      setStatusMsg({ text: 'Failed to cancel alert.', type: 'error' });
    }
  }

  async function handleTriggerTest(alert: AlertItem) {
    setTestingId(alert.id);
    setStatusMsg(null);

    const recipient = alert.email || alert.userEmail || lookupEmail;
    const name = alert.productName || alert.canonicalProduct?.title || 'UAE Monitored Product';

    try {
      const res = await fetch('/api/alerts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recipient,
          productName: name,
          targetPrice: alert.targetPrice,
          newPrice: alert.currentPrice ? alert.currentPrice - 20 : alert.targetPrice - 10,
          retailerName: alert.retailerName || 'Amazon.ae',
          buyUrl: alert.buyUrl || 'https://www.amazon.ae',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ text: `🚀 ${data.message}`, type: 'success' });
      } else {
        setStatusMsg({ text: data.error || 'Test notification failed.', type: 'error' });
      }
    } catch {
      setStatusMsg({ text: 'Error dispatching test notification.', type: 'error' });
    } finally {
      setTestingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner / Hero */}
      <section className="bg-slate-950 text-white border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider mb-4">
                <span>🔔</span> Production Price Alerts Engine
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                UAE Price Drop Alerts & Notifications
              </h1>
              <p className="mt-2 text-slate-400 text-base max-w-2xl">
                Set custom target prices for high-ticket electronics on Amazon.ae, Noon.com &amp; Sharaf DG. Our background crawlers monitor live prices around the clock and notify you the second a price drops.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center min-w-[130px]">
                <div className="text-xs text-slate-400 font-medium">Frequency</div>
                <div className="text-lg font-bold text-emerald-400">60-Sec Crawl</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center min-w-[130px]">
                <div className="text-xs text-slate-400 font-medium">Dispatch</div>
                <div className="text-lg font-bold text-sky-400">Resend API</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center min-w-[130px]">
                <div className="text-xs text-slate-400 font-medium">Cost</div>
                <div className="text-lg font-bold text-emerald-300">100% Free</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Status notification banner */}
        {statusMsg && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm font-medium flex items-center justify-between shadow-sm ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : statusMsg.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <span>{statusMsg.text}</span>
            <button
              onClick={() => setStatusMsg(null)}
              className="text-slate-400 hover:text-slate-600 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Create New Price Alert (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                  🎯
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Create New Price Alert</h2>
                  <p className="text-xs text-slate-500">Get notified when prices plunge below your target</p>
                </div>
              </div>

              <form onSubmit={handleCreateAlert} className="space-y-4">
                {/* Product Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select UAE Product
                  </label>
                  <select
                    value={selectedProductIdx}
                    onChange={(e) => {
                      const idx = parseInt(e.target.value);
                      setSelectedProductIdx(idx);
                      // suggest target 5% below live price
                      const prod = PRESET_PRODUCTS[idx];
                      setTargetPrice(Math.round(prod.currentPrice * 0.93).toString());
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {PRESET_PRODUCTS.map((p, idx) => (
                      <option key={p.id} value={idx}>
                        {p.name.length > 40 ? p.name.slice(0, 40) + '...' : p.name} — Live: AED {p.currentPrice}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Product Card Preview */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                  <img
                    src={PRESET_PRODUCTS[selectedProductIdx].imageUrl}
                    alt="product"
                    className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {PRESET_PRODUCTS[selectedProductIdx].name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Live on {PRESET_PRODUCTS[selectedProductIdx].retailerName}:{' '}
                      <strong className="text-emerald-700">AED {PRESET_PRODUCTS[selectedProductIdx].currentPrice}</strong>
                    </p>
                  </div>
                </div>

                {/* Target Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Target Price (AED)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">AED</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="e.g. 750"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-14 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Live price is AED {PRESET_PRODUCTS[selectedProductIdx].currentPrice}. You save{' '}
                    <strong className="text-emerald-600">
                      AED {Math.max(0, PRESET_PRODUCTS[selectedProductIdx].currentPrice - (parseFloat(targetPrice) || 0))}
                    </strong>{' '}
                    when this deal triggers.
                  </p>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Notification Email
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="your-email@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Immediate Test Trigger Option */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="triggerTestNow"
                    checked={triggerTestNow}
                    onChange={(e) => setTriggerTestNow(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <label htmlFor="triggerTestNow" className="text-xs text-slate-600 cursor-pointer select-none">
                    Send immediate test preview alert to this email
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Saving Alert...'
                  ) : (
                    <>
                      <span>🔔</span> Activate Price Alert
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Email Template Preview Explainer */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                <span>📧</span> Branded HTML Email Alerts
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When a price drop is confirmed, DirhamDrop compiles an email with the live price, total dirhams saved, direct checkout link, and historical 30-day chart for informed buying.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Sender: <strong className="text-slate-300">alerts@dirhamdrop.com</strong></span>
                <span className="text-emerald-400 font-semibold">Resend API</span>
              </div>
            </div>
          </div>

          {/* Right Column: Manage Active Alerts (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              {/* Lookup Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Your Active Price Alerts</h2>
                  <p className="text-xs text-slate-500">Manage, test, or remove alerts registered to your email</p>
                </div>

                {/* Lookup Bar */}
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    placeholder="Enter email to view alerts..."
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-52"
                  />
                  <button
                    onClick={() => fetchAlerts(lookupEmail)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Lookup
                  </button>
                </div>
              </div>

              {/* Alerts List */}
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mb-2"></div>
                  <p>Loading active price alerts...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
                  <span className="text-3xl block mb-2">🔕</span>
                  <h3 className="font-bold text-slate-700 text-sm">No Active Alerts Found</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    No active price alerts registered for <strong className="text-slate-600">{lookupEmail}</strong>. Use the form on the left to set your first alert!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => {
                    const title = alert.productName || alert.canonicalProduct?.title || 'UAE Product';
                    const img = alert.productImageUrl || alert.canonicalProduct?.imageUrl || 'https://m.media-amazon.com/images/I/61+btxzpfDL._AC_SL1500_.jpg';
                    const isTesting = testingId === alert.id;

                    return (
                      <div
                        key={alert.id}
                        className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Product Info */}
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={img}
                              alt={title}
                              className="w-14 h-14 object-contain bg-white rounded-lg p-1 border border-slate-200 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                                ACTIVE ALERT
                              </span>
                              <h4 className="text-sm font-bold text-slate-900 truncate max-w-md">
                                {title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Alert Target: <strong className="text-emerald-700">AED {Number(alert.targetPrice).toLocaleString()}</strong>
                                {alert.currentPrice && (
                                  <span className="ml-2 text-slate-400">
                                    (Current: AED {alert.currentPrice})
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                            {/* Test Trigger Button */}
                            <button
                              onClick={() => handleTriggerTest(alert)}
                              disabled={isTesting}
                              title="Send instant sample email alert"
                              className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <span>{isTesting ? '⏳' : '⚡'}</span>
                              <span>{isTesting ? 'Sending...' : 'Test Trigger'}</span>
                            </button>

                            {/* View Product Link */}
                            <Link
                              href={`/product/${alert.productId || alert.canonicalProduct?.id || 'prod_sony_wh1000xm5'}`}
                              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                            >
                              Chart 📈
                            </Link>

                            {/* Delete Alert Button */}
                            <button
                              onClick={() => handleDeleteAlert(alert.id)}
                              title="Delete alert"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Alert Best Practices / Features Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-2xl mb-1">🇦🇪</div>
                <div className="text-xs font-bold text-slate-800">UAE Direct URLs</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Emails link straight to checkout pages on Amazon.ae & Noon.com.
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-2xl mb-1">📉</div>
                <div className="text-xs font-bold text-slate-800">Zero Spam Rule</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Only notified once when the threshold is broken; never repeated duplicates.
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-2xl mb-1">🛡️</div>
                <div className="text-xs font-bold text-slate-800">Associates Safe</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Strict adherence to Amazon Associates TOS with cross-merchant intelligence.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
