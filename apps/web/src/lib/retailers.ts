export interface RetailerInfo {
  slug: string;
  name: string;
  short: string;
  domain: string;
  badgeText: string;
  brandColor: string;
  accentBg: string;
  accentText: string;
  logoInitial: string;
  popularFor: string;
}

export const TOP_10_RETAILERS: RetailerInfo[] = [
  {
    slug: 'amazon_ae',
    name: 'Amazon UAE',
    short: 'Amazon',
    domain: 'amazon.ae',
    badgeText: 'Prime Available',
    brandColor: '#ff9900',
    accentBg: 'bg-amber-500 text-white',
    accentText: 'text-amber-800',
    logoInitial: 'a',
    popularFor: 'Electronics, Mobiles, Global Store',
  },
  {
    slug: 'noon_ae',
    name: 'Noon UAE',
    short: 'Noon',
    domain: 'noon.com',
    badgeText: 'Noon Express',
    brandColor: '#feee00',
    accentBg: 'bg-yellow-400 text-slate-900 font-black',
    accentText: 'text-yellow-800',
    logoInitial: 'noon',
    popularFor: 'Same-day delivery, Tech, Renewed',
  },
  {
    slug: 'sharaf_dg',
    name: 'Sharaf DG',
    short: 'Sharaf DG',
    domain: 'uae.sharafdg.com',
    badgeText: 'Official UAE Stock',
    brandColor: '#002f6c',
    accentBg: 'bg-blue-900 text-white',
    accentText: 'text-blue-900',
    logoInitial: 'SDG',
    popularFor: 'Major appliances, Brand Warranties',
  },
  {
    slug: 'jumbo_ae',
    name: 'Jumbo Electronics',
    short: 'Jumbo',
    domain: 'jumbo.ae',
    badgeText: 'Sony & Apple Partner',
    brandColor: '#e31837',
    accentBg: 'bg-red-600 text-white',
    accentText: 'text-red-700',
    logoInitial: 'J',
    popularFor: 'Official Sony & Apple Distributor',
  },
  {
    slug: 'carrefour_ae',
    name: 'Carrefour UAE',
    short: 'Carrefour',
    domain: 'carrefouruae.com',
    badgeText: 'Hypermarket Deals',
    brandColor: '#004f9f',
    accentBg: 'bg-sky-700 text-white',
    accentText: 'text-sky-800',
    logoInitial: 'C',
    popularFor: 'Groceries, Electronics, Daily Flash Deals',
  },
  {
    slug: 'microless_ae',
    name: 'Microless',
    short: 'Microless',
    domain: 'microless.com',
    badgeText: 'PC & Tech Specialist',
    brandColor: '#ff6600',
    accentBg: 'bg-orange-600 text-white',
    accentText: 'text-orange-700',
    logoInitial: 'M',
    popularFor: 'Gaming PCs, Components, Audio, Custom Rigs',
  },
  {
    slug: 'virgin_ae',
    name: 'Virgin Megastore',
    short: 'Virgin',
    domain: 'virginmegastore.ae',
    badgeText: 'Authorized Partner',
    brandColor: '#e10a0a',
    accentBg: 'bg-red-700 text-white',
    accentText: 'text-red-800',
    logoInitial: 'V',
    popularFor: 'Audio, Lifestyle, Gaming & Collectibles',
  },
  {
    slug: 'lulu_ae',
    name: 'LuLu Hypermarket',
    short: 'LuLu',
    domain: 'luluhypermarket.com',
    badgeText: 'LuLu UAE Best Price',
    brandColor: '#008744',
    accentBg: 'bg-emerald-700 text-white',
    accentText: 'text-emerald-800',
    logoInitial: 'L',
    popularFor: 'Gadgets, Home Appliances, Promotions',
  },
  {
    slug: 'emax_ae',
    name: 'Emax Electronics',
    short: 'Emax',
    domain: 'emaxme.com',
    badgeText: 'Official Stock',
    brandColor: '#d61f26',
    accentBg: 'bg-rose-700 text-white',
    accentText: 'text-rose-800',
    logoInitial: 'E',
    popularFor: 'Electronics, Smartphones & Extended Warranty',
  },
  {
    slug: 'namshi_ae',
    name: 'Namshi UAE',
    short: 'Namshi',
    domain: 'namshi.com',
    badgeText: 'Express Fashion & Beauty',
    brandColor: '#000000',
    accentBg: 'bg-slate-900 text-white',
    accentText: 'text-slate-900',
    logoInitial: 'N',
    popularFor: 'Beauty, Dyson Stylers, Sneakers & Apparel',
  },
];

export function getRetailerMeta(slugOrDomain?: string | null): RetailerInfo {
  if (!slugOrDomain) {
    return {
      slug: 'other',
      name: 'UAE Store',
      short: 'Store',
      domain: 'store.ae',
      badgeText: 'Verified UAE Stock',
      brandColor: '#059669',
      accentBg: 'bg-emerald-600 text-white',
      accentText: 'text-emerald-700',
      logoInitial: 'S',
      popularFor: 'UAE E-commerce',
    };
  }

  const normalized = slugOrDomain.toLowerCase();
  const found = TOP_10_RETAILERS.find(
    (r) =>
      r.slug === normalized ||
      normalized.includes(r.domain.replace('www.', '')) ||
      r.name.toLowerCase() === normalized
  );

  if (found) return found;

  return {
    slug: 'other',
    name: slugOrDomain,
    short: slugOrDomain.split(' ')[0] || 'Store',
    domain: slugOrDomain.toLowerCase().replace(/[^a-z0-9]/g, '') + '.ae',
    badgeText: 'Verified UAE Stock',
    brandColor: '#059669',
    accentBg: 'bg-emerald-600 text-white',
    accentText: 'text-emerald-700',
    logoInitial: slugOrDomain.charAt(0).toUpperCase(),
    popularFor: 'UAE E-commerce',
  };
}
