import type { Metadata } from 'next';
import { NextAuthProvider } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'DirhamDrop - The Smart Price Comparison Engine for UAE',
  description:
    'Compare live prices between Amazon.ae and Noon.com. Save dirhams on smartphones, electronics, perfumes, and home appliances.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <NextAuthProvider>
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <a href="/" className="flex items-center space-x-2">
                  <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/20">
                    د
                  </div>
                  <div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                      Dirham<span className="text-emerald-600">Drop</span>
                    </span>
                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      🇦🇪 UAE
                    </span>
                  </div>
                </a>
              </div>

              <nav className="flex items-center space-x-6 text-sm font-medium text-slate-600">
                <a href="/" className="hover:text-slate-900 transition">
                  Search
                </a>
                <a
                  href="/deals"
                  className="text-amber-600 hover:text-amber-700 transition font-bold flex items-center gap-1"
                >
                  <span>🔥 Top Deals</span>
                </a>
                <a
                  href="/alerts"
                  className="text-emerald-600 hover:text-emerald-700 transition font-semibold flex items-center gap-1"
                >
                  <span>🔔 Price Alerts</span>
                </a>
                <a
                  href="/#extension"
                  className="text-slate-600 hover:text-slate-900 transition font-medium"
                >
                  Extension
                </a>
                <a
                  href="/api/auth/signin"
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 transition font-medium"
                >
                  Login
                </a>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-slate-200 bg-white py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
              <p>
                DirhamDrop &copy; {new Date().getFullYear()} — The Smart UAE Price Comparison &amp; Deal Engine.
              </p>
              <p className="mt-1 text-slate-400">
                Compliant with Amazon Associates Operating Agreement &amp; UAE Commercial Aggregation Standards.
              </p>
            </div>
          </footer>
        </NextAuthProvider>
      </body>
    </html>
  );
}
