import { prisma } from '@dirhamdrop/database';
import fs from 'fs';
import path from 'path';

interface ListingData {
  retailerSlug: string;
  retailerName: string;
  domain: string;
  currentPrice: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  sellerName?: string;
  isFulfilledByRetailer?: boolean;
}

interface ProductData {
  brand: string;
  model: string;
  normalizedName: string;
  canonicalKey: string;
  category: string;
  imageUrl: string;
  attributes: Record<string, string>;
  basePrice: number;
  listings: Array<{
    slug: string;
    markup: number; // multiplier against basePrice
    origMarkup?: number;
    rating?: number;
    reviews?: number;
  }>;
}

const RETAILERS_META: Record<string, { name: string; domain: string; searchPrefix: (title: string) => string }> = {
  amazon_ae: {
    name: 'Amazon UAE',
    domain: 'amazon.ae',
    searchPrefix: (t) => `https://www.amazon.ae/s?k=${encodeURIComponent(t)}`,
  },
  noon_ae: {
    name: 'Noon UAE',
    domain: 'noon.com',
    searchPrefix: (t) => `https://www.noon.com/uae-en/search/?q=${encodeURIComponent(t)}`,
  },
  sharaf_dg: {
    name: 'Sharaf DG',
    domain: 'uae.sharafdg.com',
    searchPrefix: (t) => `https://uae.sharafdg.com/?q=${encodeURIComponent(t)}`,
  },
  jumbo_ae: {
    name: 'Jumbo Electronics',
    domain: 'jumbo.ae',
    searchPrefix: (t) => `https://www.jumbo.ae/search?q=${encodeURIComponent(t)}`,
  },
  carrefour_ae: {
    name: 'Carrefour UAE',
    domain: 'carrefouruae.com',
    searchPrefix: (t) => `https://www.carrefouruae.com/mafuae/en/search?q=${encodeURIComponent(t)}`,
  },
  microless_ae: {
    name: 'Microless',
    domain: 'microless.com',
    searchPrefix: (t) => `https://uae.microless.com/search/?query=${encodeURIComponent(t)}`,
  },
  virgin_ae: {
    name: 'Virgin Megastore',
    domain: 'virginmegastore.ae',
    searchPrefix: (t) => `https://www.virginmegastore.ae/en/search/?text=${encodeURIComponent(t)}`,
  },
  lulu_ae: {
    name: 'LuLu Hypermarket',
    domain: 'luluhypermarket.com',
    searchPrefix: (t) => `https://www.luluhypermarket.com/en-ae/search/?text=${encodeURIComponent(t)}`,
  },
  namshi_ae: {
    name: 'Namshi UAE',
    domain: 'namshi.com',
    searchPrefix: (t) => `https://en-ae.namshi.com/search/${encodeURIComponent(t)}/`,
  },
};

export const MEGA_PRODUCTS: ProductData[] = [
  // ==========================================
  // SMARTPHONES
  // ==========================================
  {
    brand: 'Apple',
    model: 'iPhone 16 Pro Max',
    normalizedName: 'Apple iPhone 16 Pro Max 256GB Desert Titanium',
    canonicalKey: 'apple-iphone-16-pro-max-256gb-desert-titanium',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/81T3olLXpUL._AC_SX679_.jpg',
    attributes: { storage: '256GB', color: 'Desert Titanium', connectivity: '5G' },
    basePrice: 4899,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.05, rating: 4.8, reviews: 1100 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.05, rating: 4.7, reviews: 850 },
      { slug: 'sharaf_dg', markup: 1.03, origMarkup: 1.06, rating: 4.8, reviews: 320 },
      { slug: 'jumbo_ae', markup: 1.04, origMarkup: 1.06, rating: 4.7, reviews: 210 },
      { slug: 'virgin_ae', markup: 1.05, origMarkup: 1.07, rating: 4.8, reviews: 190 },
      { slug: 'carrefour_ae', markup: 1.03, origMarkup: 1.05, rating: 4.6, reviews: 140 },
    ],
  },
  {
    brand: 'Apple',
    model: 'iPhone 16 Pro',
    normalizedName: 'Apple iPhone 16 Pro 128GB Black Titanium',
    canonicalKey: 'apple-iphone-16-pro-128gb-black-titanium',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/81T3olLXpUL._AC_SX679_.jpg',
    attributes: { storage: '128GB', color: 'Black Titanium', connectivity: '5G' },
    basePrice: 4149,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.05, rating: 4.8, reviews: 760 },
      { slug: 'noon_ae', markup: 1.01, origMarkup: 1.05, rating: 4.7, reviews: 520 },
      { slug: 'sharaf_dg', markup: 1.03, origMarkup: 1.06, rating: 4.8, reviews: 290 },
      { slug: 'virgin_ae', markup: 1.04, origMarkup: 1.06, rating: 4.7, reviews: 140 },
    ],
  },
  {
    brand: 'Apple',
    model: 'iPhone 16',
    normalizedName: 'Apple iPhone 16 128GB Teal',
    canonicalKey: 'apple-iphone-16-128gb-teal',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/71zFRCcMS2L._AC_SX679_.jpg',
    attributes: { storage: '128GB', color: 'Teal', connectivity: '5G' },
    basePrice: 3249,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.06, rating: 4.7, reviews: 920 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.06, rating: 4.6, reviews: 680 },
      { slug: 'sharaf_dg', markup: 1.04, origMarkup: 1.07, rating: 4.8, reviews: 210 },
      { slug: 'carrefour_ae', markup: 1.03, origMarkup: 1.06, rating: 4.7, reviews: 150 },
    ],
  },
  {
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    normalizedName: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    canonicalKey: 'apple-iphone-15-pro-max-256gb-natural-titanium',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/81c50PU+lpL._AC_SX679_.jpg',
    attributes: { storage: '256GB', color: 'Natural Titanium', connectivity: '5G' },
    basePrice: 2399,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 2.12, rating: 4.7, reviews: 1420 },
      { slug: 'noon_ae', markup: 1.09, origMarkup: 2.12, rating: 4.6, reviews: 3000 },
      { slug: 'microless_ae', markup: 1.15, origMarkup: 2.12, rating: 4.9, reviews: 210 },
      { slug: 'sharaf_dg', markup: 1.16, origMarkup: 2.12, rating: 4.8, reviews: 650 },
      { slug: 'carrefour_ae', markup: 1.16, origMarkup: 2.12, rating: 4.7, reviews: 380 },
      { slug: 'jumbo_ae', markup: 1.18, origMarkup: 2.12, rating: 4.8, reviews: 420 },
      { slug: 'virgin_ae', markup: 1.20, origMarkup: 2.12, rating: 4.8, reviews: 190 },
    ],
  },
  {
    brand: 'Apple',
    model: 'iPhone 15',
    normalizedName: 'Apple iPhone 15 128GB Black 5G',
    canonicalKey: 'apple-iphone-15-128gb-black-5g',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_SX679_.jpg',
    attributes: { storage: '128GB', color: 'Black', connectivity: '5G' },
    basePrice: 2649,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.28, rating: 4.7, reviews: 1800 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.28, rating: 4.6, reviews: 1300 },
      { slug: 'sharaf_dg', markup: 1.05, origMarkup: 1.28, rating: 4.8, reviews: 490 },
      { slug: 'carrefour_ae', markup: 1.05, origMarkup: 1.28, rating: 4.7, reviews: 310 },
      { slug: 'jumbo_ae', markup: 1.07, origMarkup: 1.28, rating: 4.8, reviews: 280 },
    ],
  },
  {
    brand: 'Apple',
    model: 'iPhone 14',
    normalizedName: 'Apple iPhone 14 128GB Midnight',
    canonicalKey: 'apple-iphone-14-128gb-midnight',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/61cwywLZR-L._AC_SX679_.jpg',
    attributes: { storage: '128GB', color: 'Midnight', connectivity: '5G' },
    basePrice: 2199,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.30, rating: 4.6, reviews: 2400 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.30, rating: 4.5, reviews: 1950 },
      { slug: 'sharaf_dg', markup: 1.06, origMarkup: 1.30, rating: 4.7, reviews: 520 },
      { slug: 'carrefour_ae', markup: 1.05, origMarkup: 1.30, rating: 4.6, reviews: 340 },
    ],
  },
  {
    brand: 'Apple',
    model: 'iPhone 13',
    normalizedName: 'Apple iPhone 13 128GB Starlight',
    canonicalKey: 'apple-iphone-13-128gb-starlight',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/61-r9zOKBCL._AC_SX679_.jpg',
    attributes: { storage: '128GB', color: 'Starlight', connectivity: '5G' },
    basePrice: 1849,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.35, rating: 4.7, reviews: 3800 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.35, rating: 4.6, reviews: 2700 },
      { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.35, rating: 4.7, reviews: 710 },
    ],
  },
  {
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    normalizedName: 'Samsung Galaxy S24 Ultra 256GB Titanium Black',
    canonicalKey: 'samsung-galaxy-s24-ultra-256gb-titanium-black',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/717Qo4MH97L._AC_SX679_.jpg',
    attributes: { storage: '256GB', color: 'Titanium Black', ram: '12GB', ai: 'Galaxy AI' },
    basePrice: 2354,
    listings: [
      { slug: 'noon_ae', markup: 1.0, origMarkup: 2.29, rating: 4.7, reviews: 1200 },
      { slug: 'amazon_ae', markup: 1.10, origMarkup: 2.29, rating: 4.8, reviews: 890 },
      { slug: 'microless_ae', markup: 1.06, origMarkup: 2.29, rating: 4.8, reviews: 160 },
      { slug: 'sharaf_dg', markup: 1.12, origMarkup: 2.29, rating: 4.8, reviews: 340 },
      { slug: 'jumbo_ae', markup: 1.14, origMarkup: 2.29, rating: 4.7, reviews: 220 },
      { slug: 'carrefour_ae', markup: 1.12, origMarkup: 2.29, rating: 4.6, reviews: 180 },
    ],
  },
  {
    brand: 'Samsung',
    model: 'Galaxy S24+',
    normalizedName: 'Samsung Galaxy S24+ 256GB Cobalt Violet',
    canonicalKey: 'samsung-galaxy-s24-plus-256gb-cobalt-violet',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/71OxvYJ-k8L._AC_SX679_.jpg',
    attributes: { storage: '256GB', color: 'Cobalt Violet', ram: '12GB' },
    basePrice: 2799,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.35, rating: 4.7, reviews: 450 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.35, rating: 4.6, reviews: 380 },
      { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.35, rating: 4.8, reviews: 190 },
      { slug: 'jumbo_ae', markup: 1.08, origMarkup: 1.35, rating: 4.7, reviews: 110 },
    ],
  },
  {
    brand: 'Samsung',
    model: 'Galaxy Z Fold 6',
    normalizedName: 'Samsung Galaxy Z Fold 6 256GB Silver Shadow 5G',
    canonicalKey: 'samsung-galaxy-z-fold-6-256gb-silver-shadow',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/61Nl5oZ3m-L._AC_SX679_.jpg',
    attributes: { storage: '256GB', color: 'Silver Shadow', ram: '12GB' },
    basePrice: 5299,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.18, rating: 4.8, reviews: 310 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.18, rating: 4.7, reviews: 260 },
      { slug: 'sharaf_dg', markup: 1.05, origMarkup: 1.18, rating: 4.8, reviews: 140 },
      { slug: 'virgin_ae', markup: 1.06, origMarkup: 1.18, rating: 4.7, reviews: 80 },
    ],
  },
  {
    brand: 'Samsung',
    model: 'Galaxy Z Flip 6',
    normalizedName: 'Samsung Galaxy Z Flip 6 256GB Mint 5G',
    canonicalKey: 'samsung-galaxy-z-flip-6-256gb-mint',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/61k8wO9wGML._AC_SX679_.jpg',
    attributes: { storage: '256GB', color: 'Mint', ram: '12GB' },
    basePrice: 3149,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.25, rating: 4.7, reviews: 420 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.25, rating: 4.6, reviews: 350 },
      { slug: 'sharaf_dg', markup: 1.06, origMarkup: 1.25, rating: 4.8, reviews: 180 },
    ],
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A55',
    normalizedName: 'Samsung Galaxy A55 5G 128GB Awesome Iceblue',
    canonicalKey: 'samsung-galaxy-a55-5g-128gb-iceblue',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/71eX1J8cKNL._AC_SX679_.jpg',
    attributes: { storage: '128GB', color: 'Awesome Iceblue', ram: '8GB' },
    basePrice: 1099,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.35, rating: 4.6, reviews: 1250 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.35, rating: 4.5, reviews: 980 },
      { slug: 'sharaf_dg', markup: 1.08, origMarkup: 1.35, rating: 4.7, reviews: 310 },
      { slug: 'carrefour_ae', markup: 1.05, origMarkup: 1.35, rating: 4.6, reviews: 290 },
      { slug: 'lulu_ae', markup: 1.07, origMarkup: 1.35, rating: 4.5, reviews: 180 },
    ],
  },
  {
    brand: 'Google',
    model: 'Pixel 9 Pro XL',
    normalizedName: 'Google Pixel 9 Pro XL 128GB Obsidian 5G',
    canonicalKey: 'google-pixel-9-pro-xl-128gb-obsidian',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/71F7X2F1FGL._AC_SX679_.jpg',
    attributes: { storage: '128GB', color: 'Obsidian', ram: '16GB' },
    basePrice: 4099,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.15, rating: 4.8, reviews: 380 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.15, rating: 4.7, reviews: 260 },
      { slug: 'microless_ae', markup: 1.05, origMarkup: 1.15, rating: 4.9, reviews: 95 },
      { slug: 'sharaf_dg', markup: 1.06, origMarkup: 1.15, rating: 4.7, reviews: 80 },
    ],
  },
  {
    brand: 'Google',
    model: 'Pixel 8 Pro',
    normalizedName: 'Google Pixel 8 Pro 128GB Bay 5G',
    canonicalKey: 'google-pixel-8-pro-128gb-bay',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/716n8eGpv8L._AC_SX679_.jpg',
    attributes: { storage: '128GB', color: 'Bay', ram: '12GB' },
    basePrice: 2499,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.45, rating: 4.6, reviews: 680 },
      { slug: 'noon_ae', markup: 1.04, origMarkup: 1.45, rating: 4.5, reviews: 490 },
      { slug: 'microless_ae', markup: 1.06, origMarkup: 1.45, rating: 4.8, reviews: 140 },
    ],
  },
  {
    brand: 'OnePlus',
    model: 'OnePlus 12',
    normalizedName: 'OnePlus 12 512GB Silky Black 16GB RAM 5G',
    canonicalKey: 'oneplus-12-512gb-silky-black',
    category: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/717Qo4MH97L._AC_SX679_.jpg',
    attributes: { storage: '512GB', color: 'Silky Black', ram: '16GB' },
    basePrice: 2699,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.30, rating: 4.7, reviews: 520 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.30, rating: 4.6, reviews: 390 },
      { slug: 'microless_ae', markup: 1.05, origMarkup: 1.30, rating: 4.9, reviews: 110 },
      { slug: 'sharaf_dg', markup: 1.08, origMarkup: 1.30, rating: 4.7, reviews: 140 },
    ],
  },

  // ==========================================
  // LAPTOPS & COMPUTERS
  // ==========================================
  {
    brand: 'Apple',
    model: 'MacBook Air 13" M3',
    normalizedName: 'Apple MacBook Air 13-inch M3 8GB 256GB SSD Space Gray',
    canonicalKey: 'apple-macbook-air-13-m3-8gb-256gb-space-gray',
    category: 'Laptops & Computers',
    imageUrl: 'https://m.media-amazon.com/images/I/71ItMeqpN3L._AC_SX679_.jpg',
    attributes: { chip: 'Apple M3', ram: '8GB', storage: '256GB SSD', display: '13.6-inch Liquid Retina' },
    basePrice: 3749,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.23, rating: 4.8, reviews: 520 },
      { slug: 'noon_ae', markup: 1.01, origMarkup: 1.23, rating: 4.7, reviews: 390 },
      { slug: 'sharaf_dg', markup: 1.04, origMarkup: 1.23, rating: 4.9, reviews: 260 },
      { slug: 'jumbo_ae', markup: 1.05, origMarkup: 1.23, rating: 4.8, reviews: 180 },
      { slug: 'virgin_ae', markup: 1.07, origMarkup: 1.23, rating: 4.9, reviews: 150 },
    ],
  },
  {
    brand: 'Apple',
    model: 'MacBook Air 15" M3',
    normalizedName: 'Apple MacBook Air 15-inch M3 16GB 512GB SSD Midnight',
    canonicalKey: 'apple-macbook-air-15-m3-16gb-512gb-midnight',
    category: 'Laptops & Computers',
    imageUrl: 'https://m.media-amazon.com/images/I/71ItMeqpN3L._AC_SX679_.jpg',
    attributes: { chip: 'Apple M3', ram: '16GB', storage: '512GB SSD', display: '15.3-inch Liquid Retina' },
    basePrice: 5299,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.20, rating: 4.9, reviews: 340 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.20, rating: 4.8, reviews: 280 },
      { slug: 'sharaf_dg', markup: 1.04, origMarkup: 1.20, rating: 4.9, reviews: 190 },
      { slug: 'virgin_ae', markup: 1.06, origMarkup: 1.20, rating: 4.8, reviews: 110 },
    ],
  },
  {
    brand: 'Apple',
    model: 'MacBook Pro 14" M3 Pro',
    normalizedName: 'Apple MacBook Pro 14-inch M3 Pro 18GB 512GB Space Black',
    canonicalKey: 'apple-macbook-pro-14-m3-pro-18gb-512gb-space-black',
    category: 'Laptops & Computers',
    imageUrl: 'https://m.media-amazon.com/images/I/61RJn0ofUsL._AC_SX679_.jpg',
    attributes: { chip: 'Apple M3 Pro', ram: '18GB', storage: '512GB SSD' },
    basePrice: 6899,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.23, rating: 4.9, reviews: 410 },
      { slug: 'noon_ae', markup: 1.01, origMarkup: 1.23, rating: 4.8, reviews: 270 },
      { slug: 'sharaf_dg', markup: 1.04, origMarkup: 1.23, rating: 4.9, reviews: 190 },
      { slug: 'virgin_ae', markup: 1.07, origMarkup: 1.23, rating: 4.9, reviews: 130 },
    ],
  },
  {
    brand: 'Apple',
    model: 'Mac Mini M2',
    normalizedName: 'Apple Mac Mini M2 8GB 256GB SSD Desktop Silver',
    canonicalKey: 'apple-mac-mini-m2-8gb-256gb',
    category: 'Laptops & Computers',
    imageUrl: 'https://m.media-amazon.com/images/I/51n8H2mE6CL._AC_SX679_.jpg',
    attributes: { chip: 'Apple M2', ram: '8GB', storage: '256GB SSD' },
    basePrice: 2099,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.24, rating: 4.8, reviews: 650 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.24, rating: 4.7, reviews: 410 },
      { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.24, rating: 4.8, reviews: 220 },
      { slug: 'virgin_ae', markup: 1.08, origMarkup: 1.24, rating: 4.8, reviews: 140 },
    ],
  },
  {
    brand: 'Dell',
    model: 'XPS 13',
    normalizedName: 'Dell XPS 13 9340 Intel Core Ultra 7 16GB 512GB Platinum',
    canonicalKey: 'dell-xps-13-9340-intel-core-ultra-7-16gb-512gb',
    category: 'Laptops & Computers',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    attributes: { processor: 'Intel Core Ultra 7', ram: '16GB', storage: '512GB SSD' },
    basePrice: 4499,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.31, rating: 4.6, reviews: 180 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.31, rating: 4.5, reviews: 130 },
      { slug: 'microless_ae', markup: 1.04, origMarkup: 1.31, rating: 4.8, reviews: 95 },
      { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.31, rating: 4.7, reviews: 120 },
    ],
  },
  {
    brand: 'Lenovo',
    model: 'Legion Pro 5',
    normalizedName: 'Lenovo Legion Pro 5 Gen 8 AMD Ryzen 7 16GB 1TB RTX 4070',
    canonicalKey: 'lenovo-legion-pro-5-ryzen-7-rtx-4070',
    category: 'Laptops & Computers',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
    attributes: { gpu: 'NVIDIA RTX 4070', cpu: 'AMD Ryzen 7', ram: '16GB', storage: '1TB SSD' },
    basePrice: 5199,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.25, rating: 4.8, reviews: 290 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.25, rating: 4.7, reviews: 210 },
      { slug: 'microless_ae', markup: 1.04, origMarkup: 1.25, rating: 4.9, reviews: 150 },
      { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.25, rating: 4.8, reviews: 180 },
    ],
  },
  {
    brand: 'ASUS',
    model: 'ROG Zephyrus G14',
    normalizedName: 'ASUS ROG Zephyrus G14 OLED AMD Ryzen 9 16GB 1TB RTX 4060',
    canonicalKey: 'asus-rog-zephyrus-g14-oled-rtx-4060',
    category: 'Laptops & Computers',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    attributes: { display: '14-inch 3K OLED', gpu: 'NVIDIA RTX 4060', ram: '16GB' },
    basePrice: 6199,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.18, rating: 4.9, reviews: 190 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.18, rating: 4.8, reviews: 140 },
      { slug: 'microless_ae', markup: 1.04, origMarkup: 1.18, rating: 4.9, reviews: 110 },
      { slug: 'virgin_ae', markup: 1.06, origMarkup: 1.18, rating: 4.8, reviews: 80 },
    ],
  },
  {
    brand: 'Microsoft',
    model: 'Surface Laptop 7',
    normalizedName: 'Microsoft Surface Laptop 7 Copilot+ PC Snapdragon X Elite 16GB 512GB',
    canonicalKey: 'microsoft-surface-laptop-7-copilot-plus',
    category: 'Laptops & Computers',
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
    attributes: { processor: 'Snapdragon X Elite', ram: '16GB', storage: '512GB SSD' },
    basePrice: 4799,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.15, rating: 4.7, reviews: 140 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.15, rating: 4.6, reviews: 90 },
      { slug: 'sharaf_dg', markup: 1.05, origMarkup: 1.15, rating: 4.8, reviews: 70 },
      { slug: 'jumbo_ae', markup: 1.06, origMarkup: 1.15, rating: 4.7, reviews: 60 },
    ],
  },

  // ==========================================
  // AUDIO & HEADPHONES
  // ==========================================
  {
    brand: 'Sony',
    model: 'WH-1000XM5',
    normalizedName: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Black',
    canonicalKey: 'sony-wh-1000xm5-black',
    category: 'Audio & Headphones',
    imageUrl: 'https://m.media-amazon.com/images/I/61+elL4O1VL._AC_SX679_.jpg',
    attributes: { color: 'Black', type: 'Over-Ear', noiseCancelling: 'Active Noise Cancelling' },
    basePrice: 799,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.88, rating: 4.7, reviews: 3200 },
      { slug: 'noon_ae', markup: 1.0, origMarkup: 1.88, rating: 4.6, reviews: 1540 },
      { slug: 'microless_ae', markup: 1.03, origMarkup: 1.88, rating: 4.8, reviews: 310 },
      { slug: 'sharaf_dg', markup: 1.04, origMarkup: 1.88, rating: 4.8, reviews: 420 },
      { slug: 'carrefour_ae', markup: 1.05, origMarkup: 1.88, rating: 4.7, reviews: 280 },
      { slug: 'jumbo_ae', markup: 1.06, origMarkup: 1.88, rating: 4.8, reviews: 190 },
      { slug: 'virgin_ae', markup: 1.12, origMarkup: 1.88, rating: 4.9, reviews: 150 },
    ],
  },
  {
    brand: 'Sony',
    model: 'WF-1000XM5',
    normalizedName: 'Sony WF-1000XM5 True Wireless Noise Cancelling Earbuds Black',
    canonicalKey: 'sony-wf-1000xm5-black',
    category: 'Audio & Headphones',
    imageUrl: 'https://m.media-amazon.com/images/I/61r59V1aY2L._AC_SX679_.jpg',
    attributes: { type: 'In-Ear', noiseCancelling: 'Active Noise Cancelling', battery: '24 Hours' },
    basePrice: 699,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.43, rating: 4.6, reviews: 1400 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.43, rating: 4.5, reviews: 920 },
      { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.43, rating: 4.8, reviews: 240 },
      { slug: 'virgin_ae', markup: 1.08, origMarkup: 1.43, rating: 4.7, reviews: 160 },
    ],
  },
  {
    brand: 'Apple',
    model: 'AirPods Pro 2',
    normalizedName: 'Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)',
    canonicalKey: 'apple-airpods-pro-2nd-gen-usb-c',
    category: 'Audio & Headphones',
    imageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SX679_.jpg',
    attributes: { port: 'USB-C', chip: 'Apple H2', noiseCancelling: '2x Active Noise Cancellation' },
    basePrice: 689,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.38, rating: 4.8, reviews: 4100 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.38, rating: 4.7, reviews: 3200 },
      { slug: 'sharaf_dg', markup: 1.06, origMarkup: 1.38, rating: 4.8, reviews: 850 },
      { slug: 'carrefour_ae', markup: 1.05, origMarkup: 1.38, rating: 4.7, reviews: 520 },
      { slug: 'jumbo_ae', markup: 1.07, origMarkup: 1.38, rating: 4.8, reviews: 410 },
      { slug: 'virgin_ae', markup: 1.10, origMarkup: 1.38, rating: 4.9, reviews: 310 },
    ],
  },
  {
    brand: 'Apple',
    model: 'AirPods Max',
    normalizedName: 'Apple AirPods Max Wireless Over-Ear Headphones Space Gray',
    canonicalKey: 'apple-airpods-max-space-gray',
    category: 'Audio & Headphones',
    imageUrl: 'https://m.media-amazon.com/images/I/81jqUPkIVRL._AC_SX679_.jpg',
    attributes: { type: 'Over-Ear', audio: 'Spatial Audio with Dynamic Head Tracking' },
    basePrice: 1749,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.25, rating: 4.7, reviews: 1800 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.25, rating: 4.6, reviews: 1200 },
      { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.25, rating: 4.8, reviews: 340 },
      { slug: 'virgin_ae', markup: 1.09, origMarkup: 1.25, rating: 4.9, reviews: 260 },
    ],
  },
  {
    brand: 'Bose',
    model: 'QuietComfort Ultra',
    normalizedName: 'Bose QuietComfort Ultra Wireless Noise-Cancelling Headphones Black',
    canonicalKey: 'bose-quietcomfort-ultra-headphones-black',
    category: 'Audio & Headphones',
    imageUrl: 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SX679_.jpg',
    attributes: { audio: 'Immersive Audio', type: 'Over-Ear' },
    basePrice: 1299,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.31, rating: 4.7, reviews: 890 },
      { slug: 'noon_ae', markup: 1.04, origMarkup: 1.31, rating: 4.6, reviews: 540 },
      { slug: 'sharaf_dg', markup: 1.08, origMarkup: 1.31, rating: 4.8, reviews: 210 },
      { slug: 'virgin_ae', markup: 1.10, origMarkup: 1.31, rating: 4.8, reviews: 170 },
    ],
  },
  {
    brand: 'Sennheiser',
    model: 'Momentum 4',
    normalizedName: 'Sennheiser Momentum 4 Wireless Headphones 60-Hour Battery Black',
    canonicalKey: 'sennheiser-momentum-4-wireless-black',
    category: 'Audio & Headphones',
    imageUrl: 'https://m.media-amazon.com/images/I/71T+06y0mTL._AC_SX679_.jpg',
    attributes: { battery: '60 Hours', type: 'Over-Ear' },
    basePrice: 899,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.45, rating: 4.7, reviews: 780 },
      { slug: 'noon_ae', markup: 1.05, origMarkup: 1.45, rating: 4.6, reviews: 420 },
      { slug: 'virgin_ae', markup: 1.08, origMarkup: 1.45, rating: 4.8, reviews: 190 },
    ],
  },
  {
    brand: 'Marshall',
    model: 'Stanmore III',
    normalizedName: 'Marshall Stanmore III Bluetooth Home Speaker Black',
    canonicalKey: 'marshall-stanmore-iii-speaker-black',
    category: 'Audio & Headphones',
    imageUrl: 'https://m.media-amazon.com/images/I/71u9sX8j-yL._AC_SX679_.jpg',
    attributes: { connectivity: 'Bluetooth 5.2 / RCA / 3.5mm', type: 'Home Speaker' },
    basePrice: 1199,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.25, rating: 4.8, reviews: 620 },
      { slug: 'noon_ae', markup: 1.04, origMarkup: 1.25, rating: 4.7, reviews: 380 },
      { slug: 'virgin_ae', markup: 1.07, origMarkup: 1.25, rating: 4.9, reviews: 210 },
      { slug: 'sharaf_dg', markup: 1.08, origMarkup: 1.25, rating: 4.8, reviews: 140 },
    ],
  },
  {
    brand: 'JBL',
    model: 'Charge 5',
    normalizedName: 'JBL Charge 5 Portable Waterproof Bluetooth Speaker Black',
    canonicalKey: 'jbl-charge-5-speaker-black',
    category: 'Audio & Headphones',
    imageUrl: 'https://m.media-amazon.com/images/I/61k8wO9wGML._AC_SX679_.jpg',
    attributes: { battery: '20 Hours', waterproof: 'IP67 Waterproof & Dustproof' },
    basePrice: 479,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.35, rating: 4.8, reviews: 2900 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.35, rating: 4.7, reviews: 1800 },
      { slug: 'sharaf_dg', markup: 1.08, origMarkup: 1.35, rating: 4.8, reviews: 450 },
      { slug: 'carrefour_ae', markup: 1.06, origMarkup: 1.35, rating: 4.7, reviews: 340 },
      { slug: 'virgin_ae', markup: 1.10, origMarkup: 1.35, rating: 4.8, reviews: 210 },
    ],
  },

  // ==========================================
  // GAMING & CONSOLES
  // ==========================================
  {
    brand: 'Sony',
    model: 'PlayStation 5 Slim Disc',
    normalizedName: 'Sony PlayStation 5 Slim Console (1TB) Disc Edition',
    canonicalKey: 'sony-playstation-5-slim-disc-edition-1tb',
    category: 'Gaming',
    imageUrl: 'https://m.media-amazon.com/images/I/71u9sX8j-yL._AC_SX679_.jpg',
    attributes: { storage: '1TB SSD', edition: 'Disc Edition', resolution: '4K 120Hz' },
    basePrice: 1649,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.27, rating: 4.8, reviews: 2100 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.27, rating: 4.7, reviews: 1800 },
      { slug: 'sharaf_dg', markup: 1.06, origMarkup: 1.27, rating: 4.8, reviews: 620 },
      { slug: 'carrefour_ae', markup: 1.05, origMarkup: 1.27, rating: 4.7, reviews: 410 },
      { slug: 'jumbo_ae', markup: 1.08, origMarkup: 1.27, rating: 4.8, reviews: 310 },
      { slug: 'virgin_ae', markup: 1.10, origMarkup: 1.27, rating: 4.9, reviews: 290 },
    ],
  },
  {
    brand: 'Sony',
    model: 'PlayStation 5 Slim Digital',
    normalizedName: 'Sony PlayStation 5 Slim Console (1TB) Digital Edition',
    canonicalKey: 'sony-playstation-5-slim-digital-edition-1tb',
    category: 'Gaming',
    imageUrl: 'https://m.media-amazon.com/images/I/61k8wO9wGML._AC_SX679_.jpg',
    attributes: { storage: '1TB SSD', edition: 'Digital Edition' },
    basePrice: 1449,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.24, rating: 4.8, reviews: 1200 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.24, rating: 4.7, reviews: 890 },
      { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.24, rating: 4.8, reviews: 310 },
      { slug: 'virgin_ae', markup: 1.09, origMarkup: 1.24, rating: 4.8, reviews: 190 },
    ],
  },
  {
    brand: 'Sony',
    model: 'PlayStation Portal',
    normalizedName: 'PlayStation Portal Remote Player for PS5 Console 8-inch LCD',
    canonicalKey: 'playstation-portal-remote-player-ps5',
    category: 'Gaming',
    imageUrl: 'https://m.media-amazon.com/images/I/71F7X2F1FGL._AC_SX679_.jpg',
    attributes: { display: '8-inch 1080p 60fps LCD', haptics: 'DualSense Haptic Feedback' },
    basePrice: 799,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.19, rating: 4.7, reviews: 840 },
      { slug: 'noon_ae', markup: 1.04, origMarkup: 1.19, rating: 4.6, reviews: 620 },
      { slug: 'virgin_ae', markup: 1.07, origMarkup: 1.19, rating: 4.8, reviews: 210 },
      { slug: 'sharaf_dg', markup: 1.08, origMarkup: 1.19, rating: 4.7, reviews: 140 },
    ],
  },
  {
    brand: 'Nintendo',
    model: 'Switch OLED',
    normalizedName: 'Nintendo Switch OLED Model with White Joy-Con',
    canonicalKey: 'nintendo-switch-oled-white',
    category: 'Gaming',
    imageUrl: 'https://m.media-amazon.com/images/I/51y8c5XU5OL._AC_SX679_.jpg',
    attributes: { display: '7-inch OLED Screen', storage: '64GB' },
    basePrice: 989,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.41, rating: 4.8, reviews: 1900 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.41, rating: 4.7, reviews: 1400 },
      { slug: 'sharaf_dg', markup: 1.06, origMarkup: 1.41, rating: 4.8, reviews: 420 },
      { slug: 'carrefour_ae', markup: 1.05, origMarkup: 1.41, rating: 4.7, reviews: 260 },
      { slug: 'virgin_ae', markup: 1.09, origMarkup: 1.41, rating: 4.8, reviews: 190 },
    ],
  },
  {
    brand: 'Microsoft',
    model: 'Xbox Series X',
    normalizedName: 'Microsoft Xbox Series X 1TB Gaming Console Black',
    canonicalKey: 'microsoft-xbox-series-x-1tb-black',
    category: 'Gaming',
    imageUrl: 'https://m.media-amazon.com/images/I/61-r9zOKBCL._AC_SX679_.jpg',
    attributes: { storage: '1TB Custom NVMe SSD', performance: '12 Teraflops' },
    basePrice: 1729,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.21, rating: 4.8, reviews: 940 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.21, rating: 4.7, reviews: 710 },
      { slug: 'sharaf_dg', markup: 1.05, origMarkup: 1.21, rating: 4.8, reviews: 280 },
      { slug: 'virgin_ae', markup: 1.07, origMarkup: 1.21, rating: 4.8, reviews: 150 },
    ],
  },
  {
    brand: 'ASUS',
    model: 'ROG Ally Z1 Extreme',
    normalizedName: 'ASUS ROG Ally Z1 Extreme 7-inch 120Hz Gaming Handheld 512GB',
    canonicalKey: 'asus-rog-ally-z1-extreme-512gb',
    category: 'Gaming',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    attributes: { display: '7-inch FHD 120Hz', cpu: 'AMD Ryzen Z1 Extreme', os: 'Windows 11' },
    basePrice: 1899,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.42, rating: 4.7, reviews: 680 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.42, rating: 4.6, reviews: 490 },
      { slug: 'microless_ae', markup: 1.05, origMarkup: 1.42, rating: 4.9, reviews: 180 },
      { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.42, rating: 4.8, reviews: 130 },
      { slug: 'virgin_ae', markup: 1.09, origMarkup: 1.42, rating: 4.8, reviews: 90 },
    ],
  },
  {
    brand: 'Meta',
    model: 'Quest 3',
    normalizedName: 'Meta Quest 3 128GB Breakthrough Mixed Reality All-In-One Headset',
    canonicalKey: 'meta-quest-3-128gb-vr-headset',
    category: 'Gaming',
    imageUrl: 'https://m.media-amazon.com/images/I/61RJn0ofUsL._AC_SX679_.jpg',
    attributes: { storage: '128GB', display: '4K+ Infinite Display', audio: '3D Spatial Audio' },
    basePrice: 1799,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.22, rating: 4.7, reviews: 1200 },
      { slug: 'noon_ae', markup: 1.04, origMarkup: 1.22, rating: 4.6, reviews: 780 },
      { slug: 'virgin_ae', markup: 1.08, origMarkup: 1.22, rating: 4.8, reviews: 290 },
      { slug: 'microless_ae', markup: 1.05, origMarkup: 1.22, rating: 4.9, reviews: 140 },
    ],
  },

  // ==========================================
  // TABLETS & WEARABLES
  // ==========================================
  {
    brand: 'Apple',
    model: 'iPad Pro 13" M4',
    normalizedName: 'Apple iPad Pro 13-inch M4 Ultra Retina XDR 256GB Space Black',
    canonicalKey: 'apple-ipad-pro-13-m4-256gb-space-black',
    category: 'Tablets & Wearables',
    imageUrl: 'https://m.media-amazon.com/images/I/71ItMeqpN3L._AC_SX679_.jpg',
    attributes: { chip: 'Apple M4', display: '13-inch Ultra Retina XDR OLED', storage: '256GB' },
    basePrice: 4899,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.08, rating: 4.9, reviews: 340 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.08, rating: 4.8, reviews: 220 },
      { slug: 'sharaf_dg', markup: 1.04, origMarkup: 1.08, rating: 4.9, reviews: 150 },
      { slug: 'virgin_ae', markup: 1.06, origMarkup: 1.08, rating: 4.8, reviews: 90 },
    ],
  },
  {
    brand: 'Apple',
    model: 'iPad Air 11" M2',
    normalizedName: 'Apple iPad Air 11-inch M2 128GB Wi-Fi Space Gray',
    canonicalKey: 'apple-ipad-air-11-m2-128gb-space-gray',
    category: 'Tablets & Wearables',
    imageUrl: 'https://m.media-amazon.com/images/I/61ItMeqpN3L._AC_SX679_.jpg',
    attributes: { chip: 'Apple M2', display: '11-inch Liquid Retina', storage: '128GB' },
    basePrice: 2199,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.14, rating: 4.8, reviews: 520 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.14, rating: 4.7, reviews: 390 },
      { slug: 'sharaf_dg', markup: 1.05, origMarkup: 1.14, rating: 4.8, reviews: 210 },
      { slug: 'carrefour_ae', markup: 1.04, origMarkup: 1.14, rating: 4.7, reviews: 140 },
    ],
  },
  {
    brand: 'Apple',
    model: 'iPad 10th Gen',
    normalizedName: 'Apple iPad 10th Gen 10.9-inch 64GB Wi-Fi Blue',
    canonicalKey: 'apple-ipad-10th-gen-64gb-blue',
    category: 'Tablets & Wearables',
    imageUrl: 'https://m.media-amazon.com/images/I/71ItMeqpN3L._AC_SX679_.jpg',
    attributes: { chip: 'A14 Bionic', storage: '64GB', color: 'Blue' },
    basePrice: 1249,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.20, rating: 4.8, reviews: 2200 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.20, rating: 4.7, reviews: 1600 },
      { slug: 'sharaf_dg', markup: 1.06, origMarkup: 1.20, rating: 4.8, reviews: 480 },
      { slug: 'carrefour_ae', markup: 1.05, origMarkup: 1.20, rating: 4.7, reviews: 320 },
      { slug: 'lulu_ae', markup: 1.07, origMarkup: 1.20, rating: 4.6, reviews: 190 },
    ],
  },
  {
    brand: 'Apple',
    model: 'Apple Watch Ultra 2',
    normalizedName: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case',
    canonicalKey: 'apple-watch-ultra-2-gps-cellular-49mm',
    category: 'Tablets & Wearables',
    imageUrl: 'https://m.media-amazon.com/images/I/71eX1J8cKNL._AC_SX679_.jpg',
    attributes: { size: '49mm', case: 'Titanium', connectivity: 'GPS + Cellular' },
    basePrice: 2799,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.14, rating: 4.9, reviews: 890 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.14, rating: 4.8, reviews: 650 },
      { slug: 'sharaf_dg', markup: 1.05, origMarkup: 1.14, rating: 4.9, reviews: 310 },
      { slug: 'virgin_ae', markup: 1.07, origMarkup: 1.14, rating: 4.8, reviews: 180 },
    ],
  },
  {
    brand: 'Apple',
    model: 'Apple Watch Series 10',
    normalizedName: 'Apple Watch Series 10 GPS 46mm Jet Black Aluminum Case',
    canonicalKey: 'apple-watch-series-10-gps-46mm-jet-black',
    category: 'Tablets & Wearables',
    imageUrl: 'https://m.media-amazon.com/images/I/71eX1J8cKNL._AC_SX679_.jpg',
    attributes: { size: '46mm', case: 'Jet Black Aluminum', display: 'Wide-Angle OLED' },
    basePrice: 1599,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.12, rating: 4.8, reviews: 420 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.12, rating: 4.7, reviews: 310 },
      { slug: 'sharaf_dg', markup: 1.04, origMarkup: 1.12, rating: 4.8, reviews: 160 },
      { slug: 'virgin_ae', markup: 1.06, origMarkup: 1.12, rating: 4.8, reviews: 90 },
    ],
  },
  {
    brand: 'Samsung',
    model: 'Galaxy Watch Ultra',
    normalizedName: 'Samsung Galaxy Watch Ultra 47mm LTE Titanium Gray',
    canonicalKey: 'samsung-galaxy-watch-ultra-47mm-lte',
    category: 'Tablets & Wearables',
    imageUrl: 'https://m.media-amazon.com/images/I/71OxvYJ-k8L._AC_SX679_.jpg',
    attributes: { size: '47mm', battery: 'Up to 100 Hours', durability: '10ATM + IP68' },
    basePrice: 2149,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.16, rating: 4.7, reviews: 380 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.16, rating: 4.6, reviews: 290 },
      { slug: 'sharaf_dg', markup: 1.06, origMarkup: 1.16, rating: 4.8, reviews: 140 },
    ],
  },
  {
    brand: 'Garmin',
    model: 'Fenix 7 Pro',
    normalizedName: 'Garmin Fenix 7 Pro Solar Multisport GPS Smartwatch 47mm',
    canonicalKey: 'garmin-fenix-7-pro-solar-47mm',
    category: 'Tablets & Wearables',
    imageUrl: 'https://m.media-amazon.com/images/I/716n8eGpv8L._AC_SX679_.jpg',
    attributes: { charging: 'Solar Charging Power Glass', battery: 'Up to 22 Days in Smartwatch Mode' },
    basePrice: 2699,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.22, rating: 4.8, reviews: 490 },
      { slug: 'noon_ae', markup: 1.04, origMarkup: 1.22, rating: 4.7, reviews: 280 },
      { slug: 'virgin_ae', markup: 1.07, origMarkup: 1.22, rating: 4.9, reviews: 160 },
      { slug: 'sharaf_dg', markup: 1.08, origMarkup: 1.22, rating: 4.8, reviews: 120 },
    ],
  },

  // ==========================================
  // HOME APPLIANCES & LIVING
  // ==========================================
  {
    brand: 'Dyson',
    model: 'Airwrap Multi-Styler',
    normalizedName: 'Dyson Airwrap Multi-Styler Complete Long Nickel and Copper',
    canonicalKey: 'dyson-airwrap-multi-styler-complete-long-nickel-copper',
    category: 'Home & Living',
    imageUrl: 'https://m.media-amazon.com/images/I/61y8c5XU5OL._AC_SX679_.jpg',
    attributes: { technology: 'Coanda Airflow', barrel: '30mm & 40mm Long Barrels' },
    basePrice: 1999,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.25, rating: 4.7, reviews: 420 },
      { slug: 'noon_ae', markup: 1.0, origMarkup: 1.25, rating: 4.6, reviews: 530 },
      { slug: 'sharaf_dg', markup: 1.0, origMarkup: 1.25, rating: 4.8, reviews: 290 },
      { slug: 'carrefour_ae', markup: 1.03, origMarkup: 1.25, rating: 4.6, reviews: 180 },
      { slug: 'jumbo_ae', markup: 1.05, origMarkup: 1.25, rating: 4.7, reviews: 140 },
      { slug: 'virgin_ae', markup: 1.10, origMarkup: 1.25, rating: 4.9, reviews: 160 },
      { slug: 'namshi_ae', markup: 1.10, origMarkup: 1.25, rating: 4.8, reviews: 110 },
    ],
  },
  {
    brand: 'Dyson',
    model: 'Supersonic',
    normalizedName: 'Dyson Supersonic Hair Dryer Iron/Fuchsia with Flyaway Attachment',
    canonicalKey: 'dyson-supersonic-hair-dryer-iron-fuchsia',
    category: 'Home & Living',
    imageUrl: 'https://m.media-amazon.com/images/I/61y8c5XU5OL._AC_SX679_.jpg',
    attributes: { motor: 'Dyson Digital Motor V9', heatControl: 'Intelligent Heat Control' },
    basePrice: 1499,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.20, rating: 4.8, reviews: 890 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.20, rating: 4.7, reviews: 640 },
      { slug: 'sharaf_dg', markup: 1.05, origMarkup: 1.20, rating: 4.8, reviews: 290 },
      { slug: 'virgin_ae', markup: 1.08, origMarkup: 1.20, rating: 4.9, reviews: 190 },
    ],
  },
  {
    brand: 'Dyson',
    model: 'V15 Detect',
    normalizedName: 'Dyson V15 Detect Absolute Cordless Vacuum Cleaner Yellow/Iron',
    canonicalKey: 'dyson-v15-detect-absolute-vacuum',
    category: 'Home & Living',
    imageUrl: 'https://m.media-amazon.com/images/I/61y8c5XU5OL._AC_SX679_.jpg',
    attributes: { suction: '240 AW', runtime: 'Up to 60 Minutes', laser: 'Fluffy Optic Cleaner Head' },
    basePrice: 2499,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.20, rating: 4.8, reviews: 520 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.20, rating: 4.7, reviews: 410 },
      { slug: 'sharaf_dg', markup: 1.04, origMarkup: 1.20, rating: 4.8, reviews: 230 },
      { slug: 'carrefour_ae', markup: 1.06, origMarkup: 1.20, rating: 4.7, reviews: 150 },
    ],
  },
  {
    brand: "De'Longhi",
    model: 'Magnifica S',
    normalizedName: "De'Longhi Magnifica S Automatic Bean-to-Cup Coffee Machine ECAM22.110.B",
    canonicalKey: 'delonghi-magnifica-s-ecam22110b-coffee-machine',
    category: 'Home & Living',
    imageUrl: 'https://m.media-amazon.com/images/I/71OxvYJ-k8L._AC_SX679_.jpg',
    attributes: { pressure: '15 Bar', grinder: 'Integrated Burr Grinder with 13 Settings' },
    basePrice: 1199,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.42, rating: 4.7, reviews: 1600 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.42, rating: 4.6, reviews: 980 },
      { slug: 'sharaf_dg', markup: 1.06, origMarkup: 1.42, rating: 4.8, reviews: 310 },
      { slug: 'carrefour_ae', markup: 1.05, origMarkup: 1.42, rating: 4.7, reviews: 250 },
      { slug: 'lulu_ae', markup: 1.08, origMarkup: 1.42, rating: 4.6, reviews: 180 },
    ],
  },
  {
    brand: 'Philips',
    model: 'Airfryer XXL',
    normalizedName: 'Philips Premium Airfryer XXL Smart Sensing Technology 1.4kg HD9860',
    canonicalKey: 'philips-premium-airfryer-xxl-hd9860',
    category: 'Home & Living',
    imageUrl: 'https://m.media-amazon.com/images/I/71eX1J8cKNL._AC_SX679_.jpg',
    attributes: { capacity: '1.4kg / 7.3L', technology: 'Smart Sensing Technology' },
    basePrice: 849,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.53, rating: 4.7, reviews: 2100 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.53, rating: 4.6, reviews: 1400 },
      { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.53, rating: 4.8, reviews: 420 },
      { slug: 'carrefour_ae', markup: 1.05, origMarkup: 1.53, rating: 4.7, reviews: 390 },
      { slug: 'lulu_ae', markup: 1.08, origMarkup: 1.53, rating: 4.6, reviews: 240 },
    ],
  },
  {
    brand: 'Ninja',
    model: 'DualZone 9.5L',
    normalizedName: 'Ninja Foodi MAX DualZone 2-Basket Air Fryer 9.5L AF400ME',
    canonicalKey: 'ninja-foodi-max-dualzone-airfryer-9-5l',
    category: 'Home & Living',
    imageUrl: 'https://m.media-amazon.com/images/I/716n8eGpv8L._AC_SX679_.jpg',
    attributes: { capacity: '9.5L Dual Baskets', cooking: 'Match Cook & Sync Cook Functions' },
    basePrice: 699,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.43, rating: 4.8, reviews: 1650 },
      { slug: 'noon_ae', markup: 1.04, origMarkup: 1.43, rating: 4.7, reviews: 1100 },
      { slug: 'sharaf_dg', markup: 1.08, origMarkup: 1.43, rating: 4.8, reviews: 320 },
      { slug: 'carrefour_ae', markup: 1.06, origMarkup: 1.43, rating: 4.7, reviews: 280 },
    ],
  },
  {
    brand: 'Roborock',
    model: 'S8 Pro Ultra',
    normalizedName: 'Roborock S8 Pro Ultra Robot Vacuum and Sonic Mop with RockDock',
    canonicalKey: 'roborock-s8-pro-ultra-robot-vacuum',
    category: 'Home & Living',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    attributes: { suction: '6000 Pa', dock: 'Self-Washing, Drying, Emptying & Refilling' },
    basePrice: 3799,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.18, rating: 4.8, reviews: 490 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.18, rating: 4.7, reviews: 320 },
      { slug: 'microless_ae', markup: 1.05, origMarkup: 1.18, rating: 4.9, reviews: 140 },
      { slug: 'sharaf_dg', markup: 1.07, origMarkup: 1.18, rating: 4.8, reviews: 110 },
    ],
  },

  // ==========================================
  // PERFUMES & FRAGRANCES (TOP UAE BESTSELLERS)
  // ==========================================
  {
    brand: 'Dior',
    model: 'Sauvage Eau de Parfum',
    normalizedName: 'Dior Sauvage Eau de Parfum 100ml for Men',
    canonicalKey: 'dior-sauvage-eau-de-parfum-100ml',
    category: 'Perfumes & Fragrances',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
    attributes: { size: '100ml', concentration: 'Eau de Parfum', notes: 'Calabrian Bergamot, Nutmeg, Vanilla' },
    basePrice: 449,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.33, rating: 4.8, reviews: 4800 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.33, rating: 4.7, reviews: 3900 },
      { slug: 'namshi_ae', markup: 1.06, origMarkup: 1.33, rating: 4.8, reviews: 1200 },
      { slug: 'carrefour_ae', markup: 1.08, origMarkup: 1.33, rating: 4.6, reviews: 450 },
      { slug: 'lulu_ae', markup: 1.10, origMarkup: 1.33, rating: 4.5, reviews: 310 },
    ],
  },
  {
    brand: 'Dior',
    model: 'Sauvage Elixir',
    normalizedName: 'Dior Sauvage Elixir 60ml Ultra-Concentrated Perfume for Men',
    canonicalKey: 'dior-sauvage-elixir-60ml',
    category: 'Perfumes & Fragrances',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
    attributes: { size: '60ml', concentration: 'Elixir Parfum', notes: 'Grapefruit, Cinnamon, Cardamom, Lavender' },
    basePrice: 529,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.29, rating: 4.9, reviews: 1800 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.29, rating: 4.8, reviews: 1400 },
      { slug: 'namshi_ae', markup: 1.07, origMarkup: 1.29, rating: 4.9, reviews: 620 },
      { slug: 'carrefour_ae', markup: 1.09, origMarkup: 1.29, rating: 4.7, reviews: 210 },
    ],
  },
  {
    brand: 'Creed',
    model: 'Aventus',
    normalizedName: 'Creed Aventus Eau de Parfum 100ml for Men',
    canonicalKey: 'creed-aventus-eau-de-parfum-100ml',
    category: 'Perfumes & Fragrances',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    attributes: { size: '100ml', concentration: 'Eau de Parfum', notes: 'Pineapple, Birch, Blackcurrant, Ambergris' },
    basePrice: 999,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.35, rating: 4.7, reviews: 920 },
      { slug: 'noon_ae', markup: 1.04, origMarkup: 1.35, rating: 4.6, reviews: 780 },
      { slug: 'namshi_ae', markup: 1.08, origMarkup: 1.35, rating: 4.8, reviews: 310 },
    ],
  },
  {
    brand: 'Chanel',
    model: 'Bleu de Chanel',
    normalizedName: 'Chanel Bleu de Chanel Parfum 100ml for Men',
    canonicalKey: 'chanel-bleu-de-chanel-parfum-100ml',
    category: 'Perfumes & Fragrances',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
    attributes: { size: '100ml', concentration: 'Parfum', notes: 'Citrus, Sandalwood, Cedar' },
    basePrice: 569,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.26, rating: 4.8, reviews: 2600 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.26, rating: 4.7, reviews: 1900 },
      { slug: 'namshi_ae', markup: 1.06, origMarkup: 1.26, rating: 4.9, reviews: 840 },
    ],
  },
  {
    brand: 'Tom Ford',
    model: 'Oud Wood',
    normalizedName: 'Tom Ford Private Blend Oud Wood Eau de Parfum 50ml',
    canonicalKey: 'tom-ford-oud-wood-edp-50ml',
    category: 'Perfumes & Fragrances',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
    attributes: { size: '50ml', notes: 'Rare Oud Wood, Rosewood, Cardamom' },
    basePrice: 749,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.33, rating: 4.8, reviews: 850 },
      { slug: 'noon_ae', markup: 1.04, origMarkup: 1.33, rating: 4.7, reviews: 620 },
      { slug: 'namshi_ae', markup: 1.07, origMarkup: 1.33, rating: 4.8, reviews: 290 },
    ],
  },
  {
    brand: 'Lattafa',
    model: 'Khamrah',
    normalizedName: 'Lattafa Khamrah Eau de Parfum 100ml Unisex Viral Fragrance',
    canonicalKey: 'lattafa-khamrah-edp-100ml',
    category: 'Perfumes & Fragrances',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    attributes: { size: '100ml', concentration: 'Eau de Parfum', notes: 'Cinnamon, Nutmeg, Dates, Praline, Vanilla' },
    basePrice: 119,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.51, rating: 4.8, reviews: 6200 },
      { slug: 'noon_ae', markup: 1.05, origMarkup: 1.51, rating: 4.7, reviews: 5400 },
      { slug: 'carrefour_ae', markup: 1.15, origMarkup: 1.51, rating: 4.6, reviews: 890 },
      { slug: 'lulu_ae', markup: 1.18, origMarkup: 1.51, rating: 4.6, reviews: 640 },
    ],
  },
  {
    brand: 'Armaf',
    model: 'Club de Nuit Intense',
    normalizedName: 'Armaf Club de Nuit Intense Man Pure Parfum 150ml',
    canonicalKey: 'armaf-club-de-nuit-intense-man-150ml',
    category: 'Perfumes & Fragrances',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
    attributes: { size: '150ml', concentration: 'Pure Parfum' },
    basePrice: 149,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.48, rating: 4.7, reviews: 9400 },
      { slug: 'noon_ae', markup: 1.04, origMarkup: 1.48, rating: 4.6, reviews: 7800 },
      { slug: 'carrefour_ae', markup: 1.12, origMarkup: 1.48, rating: 4.6, reviews: 1200 },
      { slug: 'lulu_ae', markup: 1.15, origMarkup: 1.48, rating: 4.5, reviews: 890 },
    ],
  },

  // ==========================================
  // CAMERAS, DRONES & ACTION
  // ==========================================
  {
    brand: 'DJI',
    model: 'Mini 4 Pro',
    normalizedName: 'DJI Mini 4 Pro Drone Fly More Combo with DJI RC 2 Remote',
    canonicalKey: 'dji-mini-4-pro-fly-more-combo-rc2',
    category: 'Cameras & Drones',
    imageUrl: 'https://m.media-amazon.com/images/I/71F7X2F1FGL._AC_SX679_.jpg',
    attributes: { video: '4K/60fps HDR True Vertical Shooting', weight: 'Under 249 g', sensing: 'Omnidirectional Obstacle Sensing' },
    basePrice: 3899,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.13, rating: 4.9, reviews: 620 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.13, rating: 4.8, reviews: 490 },
      { slug: 'sharaf_dg', markup: 1.05, origMarkup: 1.13, rating: 4.9, reviews: 260 },
      { slug: 'virgin_ae', markup: 1.07, origMarkup: 1.13, rating: 4.8, reviews: 180 },
    ],
  },
  {
    brand: 'DJI',
    model: 'Osmo Pocket 3',
    normalizedName: 'DJI Osmo Pocket 3 Creator Combo 1-inch CMOS 4K 120fps Vlog Camera',
    canonicalKey: 'dji-osmo-pocket-3-creator-combo',
    category: 'Cameras & Drones',
    imageUrl: 'https://m.media-amazon.com/images/I/61RJn0ofUsL._AC_SX679_.jpg',
    attributes: { sensor: '1-inch CMOS Sensor', screen: '2-inch Rotatable OLED Screen', video: '4K/120fps' },
    basePrice: 2399,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.13, rating: 4.9, reviews: 1400 },
      { slug: 'noon_ae', markup: 1.02, origMarkup: 1.13, rating: 4.8, reviews: 980 },
      { slug: 'sharaf_dg', markup: 1.05, origMarkup: 1.13, rating: 4.9, reviews: 420 },
      { slug: 'virgin_ae', markup: 1.08, origMarkup: 1.13, rating: 4.9, reviews: 310 },
    ],
  },
  {
    brand: 'GoPro',
    model: 'HERO12 Black',
    normalizedName: 'GoPro HERO12 Black Waterproof Action Camera 5.3K60 Video',
    canonicalKey: 'gopro-hero12-black-action-camera',
    category: 'Cameras & Drones',
    imageUrl: 'https://m.media-amazon.com/images/I/61k8wO9wGML._AC_SX679_.jpg',
    attributes: { video: '5.3K60 + 4K120 Video', stabilization: 'HyperSmooth 6.0' },
    basePrice: 1249,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.28, rating: 4.7, reviews: 1800 },
      { slug: 'noon_ae', markup: 1.04, origMarkup: 1.28, rating: 4.6, reviews: 1200 },
      { slug: 'sharaf_dg', markup: 1.08, origMarkup: 1.28, rating: 4.8, reviews: 390 },
      { slug: 'virgin_ae', markup: 1.10, origMarkup: 1.28, rating: 4.8, reviews: 260 },
    ],
  },
  {
    brand: 'Insta360',
    model: 'X4',
    normalizedName: 'Insta360 X4 8K 360 Action Camera Waterproof with FlowState Stabilization',
    canonicalKey: 'insta360-x4-8k-360-action-camera',
    category: 'Cameras & Drones',
    imageUrl: 'https://m.media-amazon.com/images/I/71u9sX8j-yL._AC_SX679_.jpg',
    attributes: { video: '8K 30fps 360 Video', battery: '135 Minutes 2290mAh' },
    basePrice: 1899,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.16, rating: 4.8, reviews: 740 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.16, rating: 4.7, reviews: 520 },
      { slug: 'virgin_ae', markup: 1.07, origMarkup: 1.16, rating: 4.9, reviews: 210 },
      { slug: 'sharaf_dg', markup: 1.08, origMarkup: 1.16, rating: 4.8, reviews: 140 },
    ],
  },
  {
    brand: 'Sony',
    model: 'Alpha 7 IV',
    normalizedName: 'Sony Alpha 7 IV Full-Frame Mirrorless Interchangeable Lens Camera Body',
    canonicalKey: 'sony-alpha-7-iv-full-frame-camera',
    category: 'Cameras & Drones',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    attributes: { sensor: '33MP Full-Frame Exmor R CMOS Sensor', video: '4K 60p 10-Bit 4:2:2' },
    basePrice: 7499,
    listings: [
      { slug: 'amazon_ae', markup: 1.0, origMarkup: 1.16, rating: 4.9, reviews: 680 },
      { slug: 'noon_ae', markup: 1.03, origMarkup: 1.16, rating: 4.8, reviews: 410 },
      { slug: 'sharaf_dg', markup: 1.05, origMarkup: 1.16, rating: 4.9, reviews: 290 },
      { slug: 'virgin_ae', markup: 1.08, origMarkup: 1.16, rating: 4.9, reviews: 160 },
    ],
  },
];

async function main() {
  console.log(`Starting massive catalog expansion: Seeding ${MEGA_PRODUCTS.length} curated UAE products...`);

  // Ensure all retailers exist
  const retailerMap = new Map<string, string>();
  for (const [slug, meta] of Object.entries(RETAILERS_META)) {
    const r = await prisma.retailer.upsert({
      where: { slug },
      update: {},
      create: {
        name: meta.name,
        slug,
        domain: meta.domain,
        isActive: true,
      },
    });
    retailerMap.set(slug, r.id);
  }

  let totalListings = 0;
  const historyToInsert: any[] = [];

  for (const p of MEGA_PRODUCTS) {
    const canonical = await prisma.productCanonical.upsert({
      where: { canonicalKey: p.canonicalKey },
      update: {
        brand: p.brand,
        model: p.model,
        normalizedName: p.normalizedName,
        category: p.category,
        imageUrl: p.imageUrl,
        attributes: JSON.stringify(p.attributes),
      },
      create: {
        brand: p.brand,
        model: p.model,
        normalizedName: p.normalizedName,
        canonicalKey: p.canonicalKey,
        category: p.category,
        imageUrl: p.imageUrl,
        attributes: JSON.stringify(p.attributes),
      },
    });

    for (const l of p.listings) {
      const retailerId = retailerMap.get(l.slug) || retailerMap.get('amazon_ae')!;
      const meta = RETAILERS_META[l.slug] || RETAILERS_META.amazon_ae;
      const sku = `${l.slug.toUpperCase()}_${p.canonicalKey}`.slice(0, 30);
      const currentPrice = Math.round(p.basePrice * l.markup);
      const originalPrice = l.origMarkup ? Math.round(p.basePrice * l.origMarkup) : Math.round(currentPrice * 1.15);
      const url = meta.searchPrefix(p.normalizedName);

      const listing = await prisma.retailerListing.upsert({
        where: {
          retailerId_sku: {
            retailerId,
            sku,
          },
        },
        update: {
          currentPrice,
          originalPrice,
          url,
          rawTitle: `${p.normalizedName} - ${meta.name}`,
          stockStatus: 'IN_STOCK',
          rating: l.rating || 4.7,
          reviewCount: l.reviews || 350,
          isFulfilledByRetailer: true,
        },
        create: {
          canonicalProductId: canonical.id,
          retailerId,
          sku,
          url,
          rawTitle: `${p.normalizedName} - ${meta.name}`,
          currentPrice,
          originalPrice,
          currency: 'AED',
          stockStatus: 'IN_STOCK',
          rating: l.rating || 4.7,
          reviewCount: l.reviews || 350,
          isFulfilledByRetailer: true,
        },
      });

      totalListings++;

      // Queue price history
      const days = [30, 20, 10, 1];
      for (const d of days) {
        const histPrice = d > 10 ? Math.round(currentPrice * 1.08) : currentPrice;
        historyToInsert.push({
          listingId: listing.id,
          price: histPrice,
          currency: 'AED',
          stockStatus: 'IN_STOCK',
          recordedAt: new Date(Date.now() - d * 86400000),
        });
      }
    }
  }

  if (historyToInsert.length > 0) {
    await prisma.priceHistory.createMany({
      data: historyToInsert,
    });
    console.log(`Batched ${historyToInsert.length} price history timeline points!`);
  }

  const finalProdCount = await prisma.productCanonical.count();
  const finalListCount = await prisma.retailerListing.count();
  console.log(`\n🎉 MASSIVE EXPANSION COMPLETED!`);
  console.log(`Total Products in Database: ${finalProdCount}`);
  console.log(`Total Retailer Listings in Database: ${finalListCount}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
