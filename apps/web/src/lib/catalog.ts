// Comprehensive Top 20 UAE Catalog for DirhamDrop
// Covers Top 10 UAE Retailers: Amazon.ae, Noon.com, Sharaf DG, Jumbo, Carrefour, Microless, Virgin Megastore, LuLu, Emax, Namshi

export interface CatalogListing {
  id: string;
  sku: string;
  retailerName: string;
  retailerSlug: string;
  domain: string;
  rawTitle: string;
  currentPrice: number;
  originalPrice: number | null;
  currency: string;
  url: string;
  stockStatus: string;
  rating: number | null;
  reviewCount: number | null;
  sellerName?: string | null;
  isFulfilledByRetailer: boolean;
}

export interface CatalogProduct {
  id: string;
  brand: string;
  model: string;
  normalizedName: string;
  canonicalKey: string;
  imageUrl: string;
  category: string;
  attributes?: Record<string, string>;
  listings: CatalogListing[];
  priceHistory?: Array<{
    date: string;
    amazonPrice?: number;
    noonPrice?: number;
    sharafPrice?: number;
  }>;
}

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    "id": "prod_iphone15promax",
    "brand": "Apple",
    "model": "iPhone 15 Pro Max",
    "normalizedName": "Apple iPhone 15 Pro Max 256GB Natural Titanium",
    "canonicalKey": "apple-iphone-15-pro-max-256gb-natural-titanium",
    "imageUrl": "https://m.media-amazon.com/images/I/81c50PU+lpL._AC_SX679_.jpg",
    "category": "Smartphones",
    "attributes": {
      "storage": "256GB",
      "color": "Natural Titanium",
      "chip": "A17 Pro",
      "connectivity": "5G"
    },
    "listings": [
      {
        "id": "prod_iphone15promax_list_amazon_ae_0",
        "sku": "PROD_IPHONE15PROMAX_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Apple iPhone 15 Pro Max 256GB Natural Titanium - Amazon UAE",
        "currentPrice": 2399,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CQ313N2F",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 1420,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_iphone15promax_list_noon_ae_1",
        "sku": "PROD_IPHONE15PROMAX_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Apple iPhone 15 Pro Max 256GB Natural Titanium - Noon UAE",
        "currentPrice": 2626,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/renewed-iphone-15-pro-max-256gb-natural-titanium-5g-with-facetime-international-version/N70100742V/p/?o=c33a9ef3da0ed25e",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 3000,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_iphone15promax_list_microless_ae_2",
        "sku": "PROD_IPHONE15PROMAX_MICROLESS_AE",
        "retailerName": "Microless",
        "retailerSlug": "microless_ae",
        "domain": "microless.com",
        "rawTitle": "Apple iPhone 15 Pro Max 256GB Natural Titanium - Microless",
        "currentPrice": 2769,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://uae.microless.com/product/apple-iphone-15-pro-max-256gb-natural-titanium-mu793za-a/",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 210,
        "sellerName": "Microless Tech",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_iphone15promax_list_sharaf_dg_3",
        "sku": "PROD_IPHONE15PROMAX_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Apple iPhone 15 Pro Max 256GB Natural Titanium - Sharaf DG",
        "currentPrice": 2799,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/apple-iphone-15-pro-max-256gb-natural-titanium/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 650,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_iphone15promax_list_carrefour_ae_4",
        "sku": "PROD_IPHONE15PROMAX_CARREFOUR_AE",
        "retailerName": "Carrefour UAE",
        "retailerSlug": "carrefour_ae",
        "domain": "carrefouruae.com",
        "rawTitle": "Apple iPhone 15 Pro Max 256GB Natural Titanium - Carrefour UAE",
        "currentPrice": 2799,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://www.carrefouruae.com/mafuae/en/p/apple-iphone-15-pro-max-256gb-natural-titanium",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 380,
        "sellerName": "Carrefour UAE",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_iphone15promax_list_jumbo_ae_5",
        "sku": "PROD_IPHONE15PROMAX_JUMBO_AE",
        "retailerName": "Jumbo Electronics",
        "retailerSlug": "jumbo_ae",
        "domain": "jumbo.ae",
        "rawTitle": "Apple iPhone 15 Pro Max 256GB Natural Titanium - Jumbo Electronics",
        "currentPrice": 2849,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://www.jumbo.ae/apple-iphone-15-pro-max-256gb-natural-titanium.html",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 420,
        "sellerName": "Jumbo Official",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_iphone15promax_list_lulu_ae_6",
        "sku": "PROD_IPHONE15PROMAX_LULU_AE",
        "retailerName": "LuLu Hypermarket",
        "retailerSlug": "lulu_ae",
        "domain": "luluhypermarket.com",
        "rawTitle": "Apple iPhone 15 Pro Max 256GB Natural Titanium - LuLu Hypermarket",
        "currentPrice": 2849,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://www.luluhypermarket.com/en-ae/apple-iphone-15-pro-max-256gb-natural-titanium/p/2179832",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 310,
        "sellerName": "LuLu Hypermarket",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_iphone15promax_list_virgin_ae_7",
        "sku": "PROD_IPHONE15PROMAX_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Apple iPhone 15 Pro Max 256GB Natural Titanium - Virgin Megastore",
        "currentPrice": 2899,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/electronics-accessories/phones-accessories/phones/smartphones/apple-iphone-15-pro-max-256gb-natural-titanium/p/823055",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 190,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 3099,
        "noonPrice": 2999,
        "sharafPrice": 3199
      },
      {
        "date": "21 days ago",
        "amazonPrice": 2999,
        "noonPrice": 2899,
        "sharafPrice": 3099
      },
      {
        "date": "14 days ago",
        "amazonPrice": 2899,
        "noonPrice": 2799,
        "sharafPrice": 2999
      },
      {
        "date": "7 days ago",
        "amazonPrice": 2799,
        "noonPrice": 2699,
        "sharafPrice": 2849
      },
      {
        "date": "Today",
        "amazonPrice": 2399,
        "noonPrice": 2626,
        "sharafPrice": 2799
      }
    ]
  },
  {
    "id": "prod_samsung_s24ultra",
    "brand": "Samsung",
    "model": "Galaxy S24 Ultra",
    "normalizedName": "Samsung Galaxy S24 Ultra 256GB Titanium Black",
    "canonicalKey": "samsung-galaxy-s24-ultra-256gb-titanium-black",
    "imageUrl": "https://m.media-amazon.com/images/I/717Qo4MH97L._AC_SX679_.jpg",
    "category": "Smartphones",
    "attributes": {
      "storage": "256GB",
      "ram": "12GB",
      "display": "6.8-inch Dynamic AMOLED 2X",
      "chip": "Snapdragon 8 Gen 3"
    },
    "listings": [
      {
        "id": "prod_samsung_s24ultra_list_noon_ae_0",
        "sku": "PROD_SAMSUNG_S24ULTRA_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Samsung Galaxy S24 Ultra 256GB Titanium Black - Noon UAE",
        "currentPrice": 2354,
        "originalPrice": 5399,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/renewed-galaxy-s24-ultra-titanium-gray-12gb-ram-256gb-5g-international-version/N70250982V/p/?o=df32995c725cca7f",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 710,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_samsung_s24ultra_list_microless_ae_1",
        "sku": "PROD_SAMSUNG_S24ULTRA_MICROLESS_AE",
        "retailerName": "Microless",
        "retailerSlug": "microless_ae",
        "domain": "microless.com",
        "rawTitle": "Samsung Galaxy S24 Ultra 256GB Titanium Black - Microless",
        "currentPrice": 2499,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://uae.microless.com/product/samsung-galaxy-s24-ultra-5g-smartphone-256gb-titanium-black-sm-s928b/",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 160,
        "sellerName": "Microless Direct",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_samsung_s24ultra_list_amazon_ae_2",
        "sku": "PROD_SAMSUNG_S24ULTRA_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Samsung Galaxy S24 Ultra 256GB Titanium Black - Amazon UAE",
        "currentPrice": 2599,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CQZ22Q7L",
        "stockStatus": "IN_STOCK",
        "rating": 4.5,
        "reviewCount": 980,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_samsung_s24ultra_list_sharaf_dg_3",
        "sku": "PROD_SAMSUNG_S24ULTRA_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Samsung Galaxy S24 Ultra 256GB Titanium Black - Sharaf DG",
        "currentPrice": 2649,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/samsung-galaxy-s24-ultra-5g-smartphone-256gb-titanium-black/",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 310,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_samsung_s24ultra_list_carrefour_ae_4",
        "sku": "PROD_SAMSUNG_S24ULTRA_CARREFOUR_AE",
        "retailerName": "Carrefour UAE",
        "retailerSlug": "carrefour_ae",
        "domain": "carrefouruae.com",
        "rawTitle": "Samsung Galaxy S24 Ultra 256GB Titanium Black - Carrefour UAE",
        "currentPrice": 2649,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://www.carrefouruae.com/mafuae/en/p/samsung-galaxy-s24-ultra-256gb-black",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 220,
        "sellerName": "Carrefour UAE",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_samsung_s24ultra_list_jumbo_ae_5",
        "sku": "PROD_SAMSUNG_S24ULTRA_JUMBO_AE",
        "retailerName": "Jumbo Electronics",
        "retailerSlug": "jumbo_ae",
        "domain": "jumbo.ae",
        "rawTitle": "Samsung Galaxy S24 Ultra 256GB Titanium Black - Jumbo Electronics",
        "currentPrice": 2699,
        "originalPrice": 5099,
        "currency": "AED",
        "url": "https://www.jumbo.ae/samsung-galaxy-s24-ultra-5g-256gb-titanium-black.html",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 290,
        "sellerName": "Jumbo Official",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 2999,
        "noonPrice": 2799,
        "sharafPrice": 3099
      },
      {
        "date": "21 days ago",
        "amazonPrice": 2899,
        "noonPrice": 2699,
        "sharafPrice": 2999
      },
      {
        "date": "14 days ago",
        "amazonPrice": 2799,
        "noonPrice": 2599,
        "sharafPrice": 2899
      },
      {
        "date": "7 days ago",
        "amazonPrice": 2699,
        "noonPrice": 2499,
        "sharafPrice": 2749
      },
      {
        "date": "Today",
        "amazonPrice": 2599,
        "noonPrice": 2354,
        "sharafPrice": 2649
      }
    ]
  },
  {
    "id": "prod_iphone15_128",
    "brand": "Apple",
    "model": "iPhone 15",
    "normalizedName": "Apple iPhone 15 128GB Black 5G",
    "canonicalKey": "apple-iphone-15-128gb-black",
    "imageUrl": "https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_SX679_.jpg",
    "category": "Smartphones",
    "attributes": {
      "storage": "128GB",
      "color": "Black",
      "chip": "A16 Bionic",
      "display": "6.1-inch Super Retina XDR"
    },
    "listings": [
      {
        "id": "prod_iphone15_128_list_amazon_ae_0",
        "sku": "PROD_IPHONE15_128_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Apple iPhone 15 128GB Black 5G - Amazon UAE",
        "currentPrice": 2449,
        "originalPrice": 3399,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CHX2T5W8",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 890,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_iphone15_128_list_noon_ae_1",
        "sku": "PROD_IPHONE15_128_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Apple iPhone 15 128GB Black 5G - Noon UAE",
        "currentPrice": 2489,
        "originalPrice": 3399,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/iphone-15-128gb-black-5g-with-facetime/N53432537A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 1240,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_iphone15_128_list_carrefour_ae_2",
        "sku": "PROD_IPHONE15_128_CARREFOUR_AE",
        "retailerName": "Carrefour UAE",
        "retailerSlug": "carrefour_ae",
        "domain": "carrefouruae.com",
        "rawTitle": "Apple iPhone 15 128GB Black 5G - Carrefour UAE",
        "currentPrice": 2499,
        "originalPrice": 3399,
        "currency": "AED",
        "url": "https://www.carrefouruae.com/mafuae/en/p/apple-iphone-15-128gb-black",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 310,
        "sellerName": "Carrefour UAE",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_iphone15_128_list_sharaf_dg_3",
        "sku": "PROD_IPHONE15_128_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Apple iPhone 15 128GB Black 5G - Sharaf DG",
        "currentPrice": 2549,
        "originalPrice": 3399,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/apple-iphone-15-128gb-black/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 410,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_iphone15_128_list_jumbo_ae_4",
        "sku": "PROD_IPHONE15_128_JUMBO_AE",
        "retailerName": "Jumbo Electronics",
        "retailerSlug": "jumbo_ae",
        "domain": "jumbo.ae",
        "rawTitle": "Apple iPhone 15 128GB Black 5G - Jumbo Electronics",
        "currentPrice": 2599,
        "originalPrice": 3399,
        "currency": "AED",
        "url": "https://www.jumbo.ae/apple-iphone-15-128gb-black.html",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 190,
        "sellerName": "Jumbo Official",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 2799,
        "noonPrice": 2749,
        "sharafPrice": 2849
      },
      {
        "date": "14 days ago",
        "amazonPrice": 2599,
        "noonPrice": 2599,
        "sharafPrice": 2699
      },
      {
        "date": "Today",
        "amazonPrice": 2449,
        "noonPrice": 2489,
        "sharafPrice": 2549
      }
    ]
  },
  {
    "id": "prod_pixel8pro",
    "brand": "Google",
    "model": "Pixel 8 Pro",
    "normalizedName": "Google Pixel 8 Pro 128GB Obsidian 5G",
    "canonicalKey": "google-pixel-8-pro-128gb-obsidian",
    "imageUrl": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    "category": "Smartphones",
    "attributes": {
      "storage": "128GB",
      "ram": "12GB",
      "chip": "Google Tensor G3",
      "camera": "50MP Triple System"
    },
    "listings": [
      {
        "id": "prod_pixel8pro_list_amazon_ae_0",
        "sku": "PROD_PIXEL8PRO_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Google Pixel 8 Pro 128GB Obsidian 5G - Amazon UAE",
        "currentPrice": 2199,
        "originalPrice": 3799,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CGVD47P3",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 380,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_pixel8pro_list_noon_ae_1",
        "sku": "PROD_PIXEL8PRO_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Google Pixel 8 Pro 128GB Obsidian 5G - Noon UAE",
        "currentPrice": 2249,
        "originalPrice": 3799,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/pixel-8-pro-5g-obsidian-128gb/N53434679A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.5,
        "reviewCount": 290,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_pixel8pro_list_microless_ae_2",
        "sku": "PROD_PIXEL8PRO_MICROLESS_AE",
        "retailerName": "Microless",
        "retailerSlug": "microless_ae",
        "domain": "microless.com",
        "rawTitle": "Google Pixel 8 Pro 128GB Obsidian 5G - Microless",
        "currentPrice": 2299,
        "originalPrice": 3799,
        "currency": "AED",
        "url": "https://uae.microless.com/product/google-pixel-8-pro-5g-128gb-obsidian/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 110,
        "sellerName": "Microless Tech",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_pixel8pro_list_sharaf_dg_3",
        "sku": "PROD_PIXEL8PRO_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Google Pixel 8 Pro 128GB Obsidian 5G - Sharaf DG",
        "currentPrice": 2399,
        "originalPrice": 3799,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/google-pixel-8-pro-128gb-obsidian/",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 140,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 2599,
        "noonPrice": 2549,
        "sharafPrice": 2699
      },
      {
        "date": "14 days ago",
        "amazonPrice": 2399,
        "noonPrice": 2399,
        "sharafPrice": 2499
      },
      {
        "date": "Today",
        "amazonPrice": 2199,
        "noonPrice": 2249,
        "sharafPrice": 2399
      }
    ]
  },
  {
    "id": "prod_macbook_air_m3",
    "brand": "Apple",
    "model": "MacBook Air 13\" M3",
    "normalizedName": "Apple MacBook Air 13-inch M3 8GB 256GB SSD Space Gray",
    "canonicalKey": "apple-macbook-air-13-m3-8gb-256gb-space-gray",
    "imageUrl": "https://m.media-amazon.com/images/I/71ItMeqpN3L._AC_SX679_.jpg",
    "category": "Laptops & Computers",
    "attributes": {
      "chip": "Apple M3 8-Core",
      "ram": "8GB Unified",
      "storage": "256GB SSD",
      "display": "13.6-inch Liquid Retina"
    },
    "listings": [
      {
        "id": "prod_macbook_air_m3_list_amazon_ae_0",
        "sku": "PROD_MACBOOK_AIR_M3_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Apple MacBook Air 13-inch M3 8GB 256GB SSD Space Gray - Amazon UAE",
        "currentPrice": 3749,
        "originalPrice": 4599,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CX236G89",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 520,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_macbook_air_m3_list_noon_ae_1",
        "sku": "PROD_MACBOOK_AIR_M3_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Apple MacBook Air 13-inch M3 8GB 256GB SSD Space Gray - Noon UAE",
        "currentPrice": 3799,
        "originalPrice": 4599,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/macbook-air-13-inch-m3-chip-8gb-256gb-space-gray/N70044539V/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 390,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_macbook_air_m3_list_sharaf_dg_2",
        "sku": "PROD_MACBOOK_AIR_M3_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Apple MacBook Air 13-inch M3 8GB 256GB SSD Space Gray - Sharaf DG",
        "currentPrice": 3899,
        "originalPrice": 4599,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/apple-macbook-air-13-inch-m3-chip-8gb-256gb-space-grey/",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 260,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_macbook_air_m3_list_jumbo_ae_3",
        "sku": "PROD_MACBOOK_AIR_M3_JUMBO_AE",
        "retailerName": "Jumbo Electronics",
        "retailerSlug": "jumbo_ae",
        "domain": "jumbo.ae",
        "rawTitle": "Apple MacBook Air 13-inch M3 8GB 256GB SSD Space Gray - Jumbo Electronics",
        "currentPrice": 3949,
        "originalPrice": 4599,
        "currency": "AED",
        "url": "https://www.jumbo.ae/apple-macbook-air-13-m3-8gb-256gb-space-grey.html",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 180,
        "sellerName": "Jumbo Official",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_macbook_air_m3_list_virgin_ae_4",
        "sku": "PROD_MACBOOK_AIR_M3_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Apple MacBook Air 13-inch M3 8GB 256GB SSD Space Gray - Virgin Megastore",
        "currentPrice": 3999,
        "originalPrice": 4599,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/apple-macbook-air-13-m3-8gb-256gb-space-grey/p/829410",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 150,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 4299,
        "noonPrice": 4199,
        "sharafPrice": 4399
      },
      {
        "date": "14 days ago",
        "amazonPrice": 3999,
        "noonPrice": 3999,
        "sharafPrice": 4099
      },
      {
        "date": "Today",
        "amazonPrice": 3749,
        "noonPrice": 3799,
        "sharafPrice": 3899
      }
    ]
  },
  {
    "id": "prod_macbook_pro_m3",
    "brand": "Apple",
    "model": "MacBook Pro 14\" M3 Pro",
    "normalizedName": "Apple MacBook Pro 14-inch M3 Pro 18GB 512GB Space Black",
    "canonicalKey": "apple-macbook-pro-14-m3-pro-18gb-512gb-space-black",
    "imageUrl": "https://m.media-amazon.com/images/I/61RJn0ofUsL._AC_SX679_.jpg",
    "category": "Laptops & Computers",
    "attributes": {
      "chip": "Apple M3 Pro 11-Core",
      "ram": "18GB Unified",
      "storage": "512GB SSD",
      "display": "14.2-inch Liquid Retina XDR 120Hz"
    },
    "listings": [
      {
        "id": "prod_macbook_pro_m3_list_amazon_ae_0",
        "sku": "PROD_MACBOOK_PRO_M3_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Apple MacBook Pro 14-inch M3 Pro 18GB 512GB Space Black - Amazon UAE",
        "currentPrice": 6899,
        "originalPrice": 8499,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CM5NTVFX",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 410,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_macbook_pro_m3_list_noon_ae_1",
        "sku": "PROD_MACBOOK_PRO_M3_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Apple MacBook Pro 14-inch M3 Pro 18GB 512GB Space Black - Noon UAE",
        "currentPrice": 6999,
        "originalPrice": 8499,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/macbook-pro-14-inch-m3-pro-chip-18gb-512gb-space-black/N53434680A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 270,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_macbook_pro_m3_list_sharaf_dg_2",
        "sku": "PROD_MACBOOK_PRO_M3_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Apple MacBook Pro 14-inch M3 Pro 18GB 512GB Space Black - Sharaf DG",
        "currentPrice": 7199,
        "originalPrice": 8499,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/apple-macbook-pro-14-m3-pro-18gb-512gb-space-black/",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 190,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_macbook_pro_m3_list_virgin_ae_3",
        "sku": "PROD_MACBOOK_PRO_M3_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Apple MacBook Pro 14-inch M3 Pro 18GB 512GB Space Black - Virgin Megastore",
        "currentPrice": 7399,
        "originalPrice": 8499,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/apple-macbook-pro-14-m3-pro-space-black/p/824100",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 130,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 7599,
        "noonPrice": 7499,
        "sharafPrice": 7799
      },
      {
        "date": "14 days ago",
        "amazonPrice": 7199,
        "noonPrice": 7199,
        "sharafPrice": 7399
      },
      {
        "date": "Today",
        "amazonPrice": 6899,
        "noonPrice": 6999,
        "sharafPrice": 7199
      }
    ]
  },
  {
    "id": "prod_dell_xps13",
    "brand": "Dell",
    "model": "XPS 13",
    "normalizedName": "Dell XPS 13 9340 Intel Core Ultra 7 16GB 512GB Platinum",
    "canonicalKey": "dell-xps-13-9340-intel-core-ultra-7-16gb-512gb",
    "imageUrl": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
    "category": "Laptops & Computers",
    "attributes": {
      "processor": "Intel Core Ultra 7 155H",
      "ram": "16GB LPDDR5x",
      "storage": "512GB PCIe NVMe SSD",
      "display": "13.4-inch FHD+ InfinityEdge"
    },
    "listings": [
      {
        "id": "prod_dell_xps13_list_amazon_ae_0",
        "sku": "PROD_DELL_XPS13_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Dell XPS 13 9340 Intel Core Ultra 7 16GB 512GB Platinum - Amazon UAE",
        "currentPrice": 4499,
        "originalPrice": 5899,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CX29XZ69",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 180,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_dell_xps13_list_noon_ae_1",
        "sku": "PROD_DELL_XPS13_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Dell XPS 13 9340 Intel Core Ultra 7 16GB 512GB Platinum - Noon UAE",
        "currentPrice": 4599,
        "originalPrice": 5899,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/dell-xps-13-ultra-7-16gb-512gb/N70044599V/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.5,
        "reviewCount": 130,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_dell_xps13_list_microless_ae_2",
        "sku": "PROD_DELL_XPS13_MICROLESS_AE",
        "retailerName": "Microless",
        "retailerSlug": "microless_ae",
        "domain": "microless.com",
        "rawTitle": "Dell XPS 13 9340 Intel Core Ultra 7 16GB 512GB Platinum - Microless",
        "currentPrice": 4699,
        "originalPrice": 5899,
        "currency": "AED",
        "url": "https://uae.microless.com/product/dell-xps-13-9340-core-ultra-7-16gb-512gb/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 95,
        "sellerName": "Microless Direct",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_dell_xps13_list_sharaf_dg_3",
        "sku": "PROD_DELL_XPS13_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Dell XPS 13 9340 Intel Core Ultra 7 16GB 512GB Platinum - Sharaf DG",
        "currentPrice": 4799,
        "originalPrice": 5899,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/dell-xps-13-9340-laptop/",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 120,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 5199,
        "noonPrice": 5099,
        "sharafPrice": 5299
      },
      {
        "date": "14 days ago",
        "amazonPrice": 4799,
        "noonPrice": 4799,
        "sharafPrice": 4999
      },
      {
        "date": "Today",
        "amazonPrice": 4499,
        "noonPrice": 4599,
        "sharafPrice": 4799
      }
    ]
  },
  {
    "id": "prod_sony_wh1000xm5",
    "brand": "Sony",
    "model": "WH-1000XM5",
    "normalizedName": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Black",
    "canonicalKey": "sony-wh-1000xm5-black",
    "imageUrl": "https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SX679_.jpg",
    "category": "Audio & Headphones",
    "attributes": {
      "type": "Over-Ear",
      "batteryLife": "30 Hours",
      "noiseCancelling": "Industry-Leading ANC"
    },
    "listings": [
      {
        "id": "prod_sony_wh1000xm5_list_noon_ae_0",
        "sku": "PROD_SONY_WH1000XM5_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Black - Noon UAE",
        "currentPrice": 799,
        "originalPrice": 1299,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/wh-1000xm5-wireless-noise-cancelling-headphones-black/N53330542A/p/?o=e68d2a866b2fa53b",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 1540,
        "sellerName": "SuperDeals UAE",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_sony_wh1000xm5_list_amazon_ae_1",
        "sku": "PROD_SONY_WH1000XM5_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Black - Amazon UAE",
        "currentPrice": 799,
        "originalPrice": 1499,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B09ZFD9CBB",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 3200,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_sony_wh1000xm5_list_microless_ae_2",
        "sku": "PROD_SONY_WH1000XM5_MICROLESS_AE",
        "retailerName": "Microless",
        "retailerSlug": "microless_ae",
        "domain": "microless.com",
        "rawTitle": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Black - Microless",
        "currentPrice": 819,
        "originalPrice": 1399,
        "currency": "AED",
        "url": "https://uae.microless.com/product/sony-wh-1000xm5-wireless-noise-canceling-headphones-black-wh1000xm5-b/",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 180,
        "sellerName": "Microless Direct",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_sony_wh1000xm5_list_sharaf_dg_3",
        "sku": "PROD_SONY_WH1000XM5_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Black - Sharaf DG",
        "currentPrice": 829,
        "originalPrice": 1399,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/sony-wh-1000xm5-wireless-noise-canceling-headphones-black/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 420,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_sony_wh1000xm5_list_carrefour_ae_4",
        "sku": "PROD_SONY_WH1000XM5_CARREFOUR_AE",
        "retailerName": "Carrefour UAE",
        "retailerSlug": "carrefour_ae",
        "domain": "carrefouruae.com",
        "rawTitle": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Black - Carrefour UAE",
        "currentPrice": 839,
        "originalPrice": 1399,
        "currency": "AED",
        "url": "https://www.carrefouruae.com/mafuae/en/p/sony-wh-1000xm5-wireless-headphones-black",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 210,
        "sellerName": "Carrefour UAE",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_sony_wh1000xm5_list_jumbo_ae_5",
        "sku": "PROD_SONY_WH1000XM5_JUMBO_AE",
        "retailerName": "Jumbo Electronics",
        "retailerSlug": "jumbo_ae",
        "domain": "jumbo.ae",
        "rawTitle": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Black - Jumbo Electronics",
        "currentPrice": 849,
        "originalPrice": 1399,
        "currency": "AED",
        "url": "https://www.jumbo.ae/sony-wh-1000xm5-wireless-noise-cancelling-headphones-black.html",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 310,
        "sellerName": "Jumbo Electronics",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_sony_wh1000xm5_list_virgin_ae_6",
        "sku": "PROD_SONY_WH1000XM5_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Black - Virgin Megastore",
        "currentPrice": 899,
        "originalPrice": 1399,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/electronics-accessories/audio-headphones/headphones/over-ear-headphones/sony-wh-1000xm5-wireless-noise-cancelling-headphones-black/p/782194",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 150,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 949,
        "noonPrice": 929,
        "sharafPrice": 999
      },
      {
        "date": "14 days ago",
        "amazonPrice": 849,
        "noonPrice": 849,
        "sharafPrice": 899
      },
      {
        "date": "Today",
        "amazonPrice": 799,
        "noonPrice": 799,
        "sharafPrice": 829
      }
    ]
  },
  {
    "id": "prod_airpods_pro_2",
    "brand": "Apple",
    "model": "AirPods Pro (2nd Gen)",
    "normalizedName": "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)",
    "canonicalKey": "apple-airpods-pro-2nd-gen-usb-c",
    "imageUrl": "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SX679_.jpg",
    "category": "Audio & Headphones",
    "attributes": {
      "chip": "H2 Headphone Chip",
      "anc": "2x Active Noise Cancellation",
      "charging": "USB-C MagSafe Case",
      "waterResistance": "IP54"
    },
    "listings": [
      {
        "id": "prod_airpods_pro_2_list_amazon_ae_0",
        "sku": "PROD_AIRPODS_PRO_2_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C) - Amazon UAE",
        "currentPrice": 689,
        "originalPrice": 949,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CHWRXH8B",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 4200,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_airpods_pro_2_list_noon_ae_1",
        "sku": "PROD_AIRPODS_PRO_2_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C) - Noon UAE",
        "currentPrice": 699,
        "originalPrice": 949,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/airpods-pro-2nd-generation-with-magsafe-case-usb-c/N53434685A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 5100,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_airpods_pro_2_list_carrefour_ae_2",
        "sku": "PROD_AIRPODS_PRO_2_CARREFOUR_AE",
        "retailerName": "Carrefour UAE",
        "retailerSlug": "carrefour_ae",
        "domain": "carrefouruae.com",
        "rawTitle": "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C) - Carrefour UAE",
        "currentPrice": 729,
        "originalPrice": 949,
        "currency": "AED",
        "url": "https://www.carrefouruae.com/mafuae/en/p/apple-airpods-pro-2-usb-c",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 430,
        "sellerName": "Carrefour UAE",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_airpods_pro_2_list_sharaf_dg_3",
        "sku": "PROD_AIRPODS_PRO_2_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C) - Sharaf DG",
        "currentPrice": 749,
        "originalPrice": 949,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/apple-airpods-pro-2-usb-c/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 820,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_airpods_pro_2_list_jumbo_ae_4",
        "sku": "PROD_AIRPODS_PRO_2_JUMBO_AE",
        "retailerName": "Jumbo Electronics",
        "retailerSlug": "jumbo_ae",
        "domain": "jumbo.ae",
        "rawTitle": "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C) - Jumbo Electronics",
        "currentPrice": 749,
        "originalPrice": 949,
        "currency": "AED",
        "url": "https://www.jumbo.ae/apple-airpods-pro-2nd-gen-usbc.html",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 390,
        "sellerName": "Jumbo Official",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_airpods_pro_2_list_virgin_ae_5",
        "sku": "PROD_AIRPODS_PRO_2_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C) - Virgin Megastore",
        "currentPrice": 799,
        "originalPrice": 949,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/apple-airpods-pro-2nd-gen-usb-c/p/823500",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 280,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 799,
        "noonPrice": 789,
        "sharafPrice": 849
      },
      {
        "date": "14 days ago",
        "amazonPrice": 729,
        "noonPrice": 729,
        "sharafPrice": 779
      },
      {
        "date": "Today",
        "amazonPrice": 689,
        "noonPrice": 699,
        "sharafPrice": 749
      }
    ]
  },
  {
    "id": "prod_bose_qc_ultra",
    "brand": "Bose",
    "model": "QuietComfort Ultra",
    "normalizedName": "Bose QuietComfort Ultra Wireless Noise-Cancelling Headphones Black",
    "canonicalKey": "bose-quietcomfort-ultra-black",
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    "category": "Audio & Headphones",
    "attributes": {
      "audio": "Spatial Audio with Head Tracking",
      "batteryLife": "24 Hours",
      "anc": "CustomTune Technology"
    },
    "listings": [
      {
        "id": "prod_bose_qc_ultra_list_amazon_ae_0",
        "sku": "PROD_BOSE_QC_ULTRA_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Bose QuietComfort Ultra Wireless Noise-Cancelling Headphones Black - Amazon UAE",
        "currentPrice": 1299,
        "originalPrice": 1799,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CCZ26B5V",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 650,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_bose_qc_ultra_list_noon_ae_1",
        "sku": "PROD_BOSE_QC_ULTRA_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Bose QuietComfort Ultra Wireless Noise-Cancelling Headphones Black - Noon UAE",
        "currentPrice": 1349,
        "originalPrice": 1799,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/bose-quietcomfort-ultra-headphones-black/N53434690A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.5,
        "reviewCount": 420,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_bose_qc_ultra_list_sharaf_dg_2",
        "sku": "PROD_BOSE_QC_ULTRA_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Bose QuietComfort Ultra Wireless Noise-Cancelling Headphones Black - Sharaf DG",
        "currentPrice": 1399,
        "originalPrice": 1799,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/bose-quietcomfort-ultra-headphones-black/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 280,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_bose_qc_ultra_list_virgin_ae_3",
        "sku": "PROD_BOSE_QC_ULTRA_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Bose QuietComfort Ultra Wireless Noise-Cancelling Headphones Black - Virgin Megastore",
        "currentPrice": 1449,
        "originalPrice": 1799,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/bose-quietcomfort-ultra-black/p/822900",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 190,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 1549,
        "noonPrice": 1499,
        "sharafPrice": 1599
      },
      {
        "date": "14 days ago",
        "amazonPrice": 1399,
        "noonPrice": 1399,
        "sharafPrice": 1449
      },
      {
        "date": "Today",
        "amazonPrice": 1299,
        "noonPrice": 1349,
        "sharafPrice": 1399
      }
    ]
  },
  {
    "id": "prod_ps5_slim",
    "brand": "Sony",
    "model": "PlayStation 5 Slim",
    "normalizedName": "Sony PlayStation 5 Slim Console (1TB) Disc Edition",
    "canonicalKey": "sony-playstation-5-slim-console-1tb-disc",
    "imageUrl": "https://m.media-amazon.com/images/I/51051FiD9UL._AC_SX679_.jpg",
    "category": "Gaming",
    "attributes": {
      "storage": "1TB Custom SSD",
      "edition": "Ultra HD Blu-ray Disc Edition",
      "resolution": "4K 120Hz / 8K Support",
      "controller": "DualSense Wireless Included"
    },
    "listings": [
      {
        "id": "prod_ps5_slim_list_amazon_ae_0",
        "sku": "PROD_PS5_SLIM_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Sony PlayStation 5 Slim Console (1TB) Disc Edition - Amazon UAE",
        "currentPrice": 1649,
        "originalPrice": 2199,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CM5B11M2",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 2100,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_ps5_slim_list_noon_ae_1",
        "sku": "PROD_PS5_SLIM_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Sony PlayStation 5 Slim Console (1TB) Disc Edition - Noon UAE",
        "currentPrice": 1679,
        "originalPrice": 2199,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/playstation-5-slim-console-disc-edition-1tb/N53434695A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 1850,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_ps5_slim_list_carrefour_ae_2",
        "sku": "PROD_PS5_SLIM_CARREFOUR_AE",
        "retailerName": "Carrefour UAE",
        "retailerSlug": "carrefour_ae",
        "domain": "carrefouruae.com",
        "rawTitle": "Sony PlayStation 5 Slim Console (1TB) Disc Edition - Carrefour UAE",
        "currentPrice": 1699,
        "originalPrice": 2199,
        "currency": "AED",
        "url": "https://www.carrefouruae.com/mafuae/en/p/sony-ps5-slim-disc-edition",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 520,
        "sellerName": "Carrefour UAE",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_ps5_slim_list_virgin_ae_3",
        "sku": "PROD_PS5_SLIM_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Sony PlayStation 5 Slim Console (1TB) Disc Edition - Virgin Megastore",
        "currentPrice": 1749,
        "originalPrice": 2199,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/gaming/playstation/playstation-consoles/sony-playstation-5-slim-disc-edition/p/823990",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 430,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_ps5_slim_list_sharaf_dg_4",
        "sku": "PROD_PS5_SLIM_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Sony PlayStation 5 Slim Console (1TB) Disc Edition - Sharaf DG",
        "currentPrice": 1749,
        "originalPrice": 2199,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/sony-playstation-5-slim-disc-edition/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 680,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_ps5_slim_list_jumbo_ae_5",
        "sku": "PROD_PS5_SLIM_JUMBO_AE",
        "retailerName": "Jumbo Electronics",
        "retailerSlug": "jumbo_ae",
        "domain": "jumbo.ae",
        "rawTitle": "Sony PlayStation 5 Slim Console (1TB) Disc Edition - Jumbo Electronics",
        "currentPrice": 1799,
        "originalPrice": 2199,
        "currency": "AED",
        "url": "https://www.jumbo.ae/sony-playstation-5-slim-disc-edition.html",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 310,
        "sellerName": "Jumbo Official",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 1899,
        "noonPrice": 1849,
        "sharafPrice": 1949
      },
      {
        "date": "14 days ago",
        "amazonPrice": 1749,
        "noonPrice": 1729,
        "sharafPrice": 1799
      },
      {
        "date": "Today",
        "amazonPrice": 1649,
        "noonPrice": 1679,
        "sharafPrice": 1749
      }
    ]
  },
  {
    "id": "prod_nintendo_switch_oled",
    "brand": "Nintendo",
    "model": "Switch OLED",
    "normalizedName": "Nintendo Switch OLED Model with White Joy-Con",
    "canonicalKey": "nintendo-switch-oled-white",
    "imageUrl": "https://m.media-amazon.com/images/I/61-PblYntsL._AC_SX679_.jpg",
    "category": "Gaming",
    "attributes": {
      "screen": "7-inch Vibrant OLED",
      "storage": "64GB Internal",
      "audio": "Enhanced Audio Speakers",
      "dock": "Wired LAN Port Built-in"
    },
    "listings": [
      {
        "id": "prod_nintendo_switch_oled_list_amazon_ae_0",
        "sku": "PROD_NINTENDO_SWITCH_OLED_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Nintendo Switch OLED Model with White Joy-Con - Amazon UAE",
        "currentPrice": 989,
        "originalPrice": 1499,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B098RKWHHZ",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 1650,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_nintendo_switch_oled_list_noon_ae_1",
        "sku": "PROD_NINTENDO_SWITCH_OLED_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Nintendo Switch OLED Model with White Joy-Con - Noon UAE",
        "currentPrice": 999,
        "originalPrice": 1499,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/switch-oled-model-with-white-joy-con/N50989260A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 1420,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_nintendo_switch_oled_list_microless_ae_2",
        "sku": "PROD_NINTENDO_SWITCH_OLED_MICROLESS_AE",
        "retailerName": "Microless",
        "retailerSlug": "microless_ae",
        "domain": "microless.com",
        "rawTitle": "Nintendo Switch OLED Model with White Joy-Con - Microless",
        "currentPrice": 1049,
        "originalPrice": 1499,
        "currency": "AED",
        "url": "https://uae.microless.com/product/nintendo-switch-oled-model-white/",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 220,
        "sellerName": "Microless Tech",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_nintendo_switch_oled_list_virgin_ae_3",
        "sku": "PROD_NINTENDO_SWITCH_OLED_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Nintendo Switch OLED Model with White Joy-Con - Virgin Megastore",
        "currentPrice": 1099,
        "originalPrice": 1499,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/gaming/nintendo/nintendo-switch-consoles/nintendo-switch-oled-white/p/785210",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 310,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_nintendo_switch_oled_list_sharaf_dg_4",
        "sku": "PROD_NINTENDO_SWITCH_OLED_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Nintendo Switch OLED Model with White Joy-Con - Sharaf DG",
        "currentPrice": 1149,
        "originalPrice": 1499,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/nintendo-switch-oled-white/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 380,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 1199,
        "noonPrice": 1149,
        "sharafPrice": 1249
      },
      {
        "date": "14 days ago",
        "amazonPrice": 1049,
        "noonPrice": 1049,
        "sharafPrice": 1149
      },
      {
        "date": "Today",
        "amazonPrice": 989,
        "noonPrice": 999,
        "sharafPrice": 1149
      }
    ]
  },
  {
    "id": "prod_xbox_series_x",
    "brand": "Microsoft",
    "model": "Xbox Series X",
    "normalizedName": "Microsoft Xbox Series X 1TB Gaming Console Black",
    "canonicalKey": "microsoft-xbox-series-x-1tb-black",
    "imageUrl": "https://m.media-amazon.com/images/I/61-jjE67uqL._AC_SX679_.jpg",
    "category": "Gaming",
    "attributes": {
      "storage": "1TB Custom NVMe SSD",
      "performance": "12 Teraflops GPU",
      "resolution": "True 4K Gaming up to 120 FPS",
      "feature": "Xbox Velocity Architecture"
    },
    "listings": [
      {
        "id": "prod_xbox_series_x_list_amazon_ae_0",
        "sku": "PROD_XBOX_SERIES_X_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Microsoft Xbox Series X 1TB Gaming Console Black - Amazon UAE",
        "currentPrice": 1729,
        "originalPrice": 2299,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B08H75RTZ8",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 980,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_xbox_series_x_list_noon_ae_1",
        "sku": "PROD_XBOX_SERIES_X_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Microsoft Xbox Series X 1TB Gaming Console Black - Noon UAE",
        "currentPrice": 1749,
        "originalPrice": 2299,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/xbox-series-x-1tb-console/N40633049A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 870,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_xbox_series_x_list_sharaf_dg_2",
        "sku": "PROD_XBOX_SERIES_X_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Microsoft Xbox Series X 1TB Gaming Console Black - Sharaf DG",
        "currentPrice": 1799,
        "originalPrice": 2299,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/microsoft-xbox-series-x-1tb-console/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 340,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_xbox_series_x_list_virgin_ae_3",
        "sku": "PROD_XBOX_SERIES_X_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Microsoft Xbox Series X 1TB Gaming Console Black - Virgin Megastore",
        "currentPrice": 1849,
        "originalPrice": 2299,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/xbox-series-x-1tb/p/765100",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 260,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 1999,
        "noonPrice": 1949,
        "sharafPrice": 2049
      },
      {
        "date": "14 days ago",
        "amazonPrice": 1829,
        "noonPrice": 1799,
        "sharafPrice": 1899
      },
      {
        "date": "Today",
        "amazonPrice": 1729,
        "noonPrice": 1749,
        "sharafPrice": 1799
      }
    ]
  },
  {
    "id": "prod_rog_ally",
    "brand": "ASUS",
    "model": "ROG Ally Z1 Extreme",
    "normalizedName": "ASUS ROG Ally Z1 Extreme 7-inch 120Hz Gaming Handheld 512GB",
    "canonicalKey": "asus-rog-ally-z1-extreme-512gb",
    "imageUrl": "https://images.unsplash.com/photo-1612287233207-6a4a2c092c2d?w=800&auto=format&fit=crop&q=80",
    "category": "Gaming",
    "attributes": {
      "processor": "AMD Ryzen Z1 Extreme",
      "ram": "16GB LPDDR5",
      "storage": "512GB PCIe 4.0 NVMe",
      "display": "7-inch FHD 120Hz FreeSync Premium"
    },
    "listings": [
      {
        "id": "prod_rog_ally_list_amazon_ae_0",
        "sku": "PROD_ROG_ALLY_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "ASUS ROG Ally Z1 Extreme 7-inch 120Hz Gaming Handheld 512GB - Amazon UAE",
        "currentPrice": 1899,
        "originalPrice": 2799,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0C39K4V2D",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 420,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_rog_ally_list_noon_ae_1",
        "sku": "PROD_ROG_ALLY_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "ASUS ROG Ally Z1 Extreme 7-inch 120Hz Gaming Handheld 512GB - Noon UAE",
        "currentPrice": 1949,
        "originalPrice": 2799,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/asus-rog-ally-z1-extreme-512gb/N53434700A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.5,
        "reviewCount": 310,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_rog_ally_list_microless_ae_2",
        "sku": "PROD_ROG_ALLY_MICROLESS_AE",
        "retailerName": "Microless",
        "retailerSlug": "microless_ae",
        "domain": "microless.com",
        "rawTitle": "ASUS ROG Ally Z1 Extreme 7-inch 120Hz Gaming Handheld 512GB - Microless",
        "currentPrice": 1999,
        "originalPrice": 2799,
        "currency": "AED",
        "url": "https://uae.microless.com/product/asus-rog-ally-z1-extreme-gaming-handheld/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 160,
        "sellerName": "Microless Direct",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_rog_ally_list_virgin_ae_3",
        "sku": "PROD_ROG_ALLY_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "ASUS ROG Ally Z1 Extreme 7-inch 120Hz Gaming Handheld 512GB - Virgin Megastore",
        "currentPrice": 2099,
        "originalPrice": 2799,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/asus-rog-ally-z1-extreme/p/821200",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 120,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 2299,
        "noonPrice": 2249,
        "sharafPrice": 2399
      },
      {
        "date": "14 days ago",
        "amazonPrice": 2049,
        "noonPrice": 2099,
        "sharafPrice": 2199
      },
      {
        "date": "Today",
        "amazonPrice": 1899,
        "noonPrice": 1949,
        "sharafPrice": 2149
      }
    ]
  },
  {
    "id": "prod_apple_watch_ultra_2",
    "brand": "Apple",
    "model": "Apple Watch Ultra 2",
    "normalizedName": "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case",
    "canonicalKey": "apple-watch-ultra-2-49mm-titanium",
    "imageUrl": "https://m.media-amazon.com/images/I/71an9eiBxpL._AC_SX679_.jpg",
    "category": "Tablets & Wearables",
    "attributes": {
      "caseSize": "49mm",
      "caseMaterial": "Aerospace-grade Titanium",
      "display": "3000 nits Always-On Retina",
      "batteryLife": "Up to 36 hours"
    },
    "listings": [
      {
        "id": "prod_apple_watch_ultra_2_list_noon_ae_0",
        "sku": "PROD_APPLE_WATCH_ULTRA_2_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case - Noon UAE",
        "currentPrice": 2749,
        "originalPrice": 3199,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/watch-ultra-2-gps-cellular-49mm-titanium-case-with-blue-ocean-band/N53407983A/p/?o=a3db90ef497c276a",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 890,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_apple_watch_ultra_2_list_microless_ae_1",
        "sku": "PROD_APPLE_WATCH_ULTRA_2_MICROLESS_AE",
        "retailerName": "Microless",
        "retailerSlug": "microless_ae",
        "domain": "microless.com",
        "rawTitle": "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case - Microless",
        "currentPrice": 2789,
        "originalPrice": 3199,
        "currency": "AED",
        "url": "https://uae.microless.com/product/apple-watch-ultra-2-gps-cellular-49mm-titanium-case/",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 230,
        "sellerName": "Microless Direct",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_apple_watch_ultra_2_list_amazon_ae_2",
        "sku": "PROD_APPLE_WATCH_ULTRA_2_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case - Amazon UAE",
        "currentPrice": 2799,
        "originalPrice": 3199,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CHX5CPN7",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 1120,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_apple_watch_ultra_2_list_sharaf_dg_3",
        "sku": "PROD_APPLE_WATCH_ULTRA_2_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case - Sharaf DG",
        "currentPrice": 2849,
        "originalPrice": 3199,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/apple-watch-ultra-2-gps-cellular-49mm-titanium-case/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 340,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_apple_watch_ultra_2_list_jumbo_ae_4",
        "sku": "PROD_APPLE_WATCH_ULTRA_2_JUMBO_AE",
        "retailerName": "Jumbo Electronics",
        "retailerSlug": "jumbo_ae",
        "domain": "jumbo.ae",
        "rawTitle": "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case - Jumbo Electronics",
        "currentPrice": 2899,
        "originalPrice": 3199,
        "currency": "AED",
        "url": "https://www.jumbo.ae/apple-watch-ultra-2-gps-cellular-49mm-titanium-case.html",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 190,
        "sellerName": "Jumbo Official",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_apple_watch_ultra_2_list_virgin_ae_5",
        "sku": "PROD_APPLE_WATCH_ULTRA_2_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case - Virgin Megastore",
        "currentPrice": 2899,
        "originalPrice": 3199,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/apple-watch-ultra-2-49mm/p/823190",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 170,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 2999,
        "noonPrice": 2949,
        "sharafPrice": 3099
      },
      {
        "date": "14 days ago",
        "amazonPrice": 2849,
        "noonPrice": 2799,
        "sharafPrice": 2949
      },
      {
        "date": "Today",
        "amazonPrice": 2799,
        "noonPrice": 2749,
        "sharafPrice": 2849
      }
    ]
  },
  {
    "id": "prod_apple_watch_s9",
    "brand": "Apple",
    "model": "Apple Watch Series 9",
    "normalizedName": "Apple Watch Series 9 GPS 45mm Midnight Aluminum Case",
    "canonicalKey": "apple-watch-series-9-gps-45mm-midnight",
    "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    "category": "Tablets & Wearables",
    "attributes": {
      "chip": "S9 SiP Chip",
      "gesture": "Double Tap Gesture",
      "display": "2000 nits Always-On Retina",
      "health": "ECG, Blood Oxygen, Crash Detection"
    },
    "listings": [
      {
        "id": "prod_apple_watch_s9_list_amazon_ae_0",
        "sku": "PROD_APPLE_WATCH_S9_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Apple Watch Series 9 GPS 45mm Midnight Aluminum Case - Amazon UAE",
        "currentPrice": 1299,
        "originalPrice": 1799,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CHX3147Q",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 1420,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_apple_watch_s9_list_noon_ae_1",
        "sku": "PROD_APPLE_WATCH_S9_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Apple Watch Series 9 GPS 45mm Midnight Aluminum Case - Noon UAE",
        "currentPrice": 1329,
        "originalPrice": 1799,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/apple-watch-series-9-gps-45mm-midnight/N53434710A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 1100,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_apple_watch_s9_list_sharaf_dg_2",
        "sku": "PROD_APPLE_WATCH_S9_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Apple Watch Series 9 GPS 45mm Midnight Aluminum Case - Sharaf DG",
        "currentPrice": 1399,
        "originalPrice": 1799,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/apple-watch-series-9-gps-45mm-midnight/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 450,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_apple_watch_s9_list_virgin_ae_3",
        "sku": "PROD_APPLE_WATCH_S9_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Apple Watch Series 9 GPS 45mm Midnight Aluminum Case - Virgin Megastore",
        "currentPrice": 1449,
        "originalPrice": 1799,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/apple-watch-series-9-45mm-midnight/p/823300",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 220,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 1549,
        "noonPrice": 1499,
        "sharafPrice": 1599
      },
      {
        "date": "14 days ago",
        "amazonPrice": 1399,
        "noonPrice": 1379,
        "sharafPrice": 1449
      },
      {
        "date": "Today",
        "amazonPrice": 1299,
        "noonPrice": 1329,
        "sharafPrice": 1399
      }
    ]
  },
  {
    "id": "prod_ipad_air_m2",
    "brand": "Apple",
    "model": "iPad Air 11\" M2",
    "normalizedName": "Apple iPad Air 11-inch M2 128GB Wi-Fi Space Gray",
    "canonicalKey": "apple-ipad-air-11-m2-128gb-space-gray",
    "imageUrl": "https://m.media-amazon.com/images/I/71VbHaAqbML._AC_SX679_.jpg",
    "category": "Tablets & Wearables",
    "attributes": {
      "chip": "Apple M2 Chip",
      "storage": "128GB",
      "display": "11-inch Liquid Retina with True Tone",
      "camera": "12MP Center Stage Front Camera"
    },
    "listings": [
      {
        "id": "prod_ipad_air_m2_list_amazon_ae_0",
        "sku": "PROD_IPAD_AIR_M2_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Apple iPad Air 11-inch M2 128GB Wi-Fi Space Gray - Amazon UAE",
        "currentPrice": 2199,
        "originalPrice": 2799,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0D3J75F4M",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 820,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_ipad_air_m2_list_noon_ae_1",
        "sku": "PROD_IPAD_AIR_M2_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Apple iPad Air 11-inch M2 128GB Wi-Fi Space Gray - Noon UAE",
        "currentPrice": 2249,
        "originalPrice": 2799,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/ipad-air-11-inch-m2-128gb-space-gray/N70044550V/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 640,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_ipad_air_m2_list_sharaf_dg_2",
        "sku": "PROD_IPAD_AIR_M2_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Apple iPad Air 11-inch M2 128GB Wi-Fi Space Gray - Sharaf DG",
        "currentPrice": 2299,
        "originalPrice": 2799,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/apple-ipad-air-11-m2-128gb-space-gray/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 310,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_ipad_air_m2_list_jumbo_ae_3",
        "sku": "PROD_IPAD_AIR_M2_JUMBO_AE",
        "retailerName": "Jumbo Electronics",
        "retailerSlug": "jumbo_ae",
        "domain": "jumbo.ae",
        "rawTitle": "Apple iPad Air 11-inch M2 128GB Wi-Fi Space Gray - Jumbo Electronics",
        "currentPrice": 2349,
        "originalPrice": 2799,
        "currency": "AED",
        "url": "https://www.jumbo.ae/apple-ipad-air-11-m2-128gb.html",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 190,
        "sellerName": "Jumbo Official",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_ipad_air_m2_list_virgin_ae_4",
        "sku": "PROD_IPAD_AIR_M2_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Apple iPad Air 11-inch M2 128GB Wi-Fi Space Gray - Virgin Megastore",
        "currentPrice": 2399,
        "originalPrice": 2799,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/apple-ipad-air-11-m2-space-gray/p/830100",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 140,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 2599,
        "noonPrice": 2549,
        "sharafPrice": 2649
      },
      {
        "date": "14 days ago",
        "amazonPrice": 2349,
        "noonPrice": 2329,
        "sharafPrice": 2399
      },
      {
        "date": "Today",
        "amazonPrice": 2199,
        "noonPrice": 2249,
        "sharafPrice": 2299
      }
    ]
  },
  {
    "id": "prod_samsung_tab_s9",
    "brand": "Samsung",
    "model": "Galaxy Tab S9",
    "normalizedName": "Samsung Galaxy Tab S9 128GB Wi-Fi Graphite with S-Pen",
    "canonicalKey": "samsung-galaxy-tab-s9-128gb-graphite",
    "imageUrl": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    "category": "Tablets & Wearables",
    "attributes": {
      "screen": "11-inch Dynamic AMOLED 2X 120Hz",
      "processor": "Snapdragon 8 Gen 2 for Galaxy",
      "waterResistance": "IP68 Dust & Water Resistant",
      "accessory": "S-Pen Included"
    },
    "listings": [
      {
        "id": "prod_samsung_tab_s9_list_amazon_ae_0",
        "sku": "PROD_SAMSUNG_TAB_S9_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Samsung Galaxy Tab S9 128GB Wi-Fi Graphite with S-Pen - Amazon UAE",
        "currentPrice": 1999,
        "originalPrice": 2999,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0CC9H5P2W",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 510,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_samsung_tab_s9_list_noon_ae_1",
        "sku": "PROD_SAMSUNG_TAB_S9_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Samsung Galaxy Tab S9 128GB Wi-Fi Graphite with S-Pen - Noon UAE",
        "currentPrice": 2049,
        "originalPrice": 2999,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/galaxy-tab-s9-128gb-graphite/N53434720A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 420,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_samsung_tab_s9_list_microless_ae_2",
        "sku": "PROD_SAMSUNG_TAB_S9_MICROLESS_AE",
        "retailerName": "Microless",
        "retailerSlug": "microless_ae",
        "domain": "microless.com",
        "rawTitle": "Samsung Galaxy Tab S9 128GB Wi-Fi Graphite with S-Pen - Microless",
        "currentPrice": 2099,
        "originalPrice": 2999,
        "currency": "AED",
        "url": "https://uae.microless.com/product/samsung-galaxy-tab-s9-128gb-graphite/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 150,
        "sellerName": "Microless Direct",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_samsung_tab_s9_list_sharaf_dg_3",
        "sku": "PROD_SAMSUNG_TAB_S9_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Samsung Galaxy Tab S9 128GB Wi-Fi Graphite with S-Pen - Sharaf DG",
        "currentPrice": 2149,
        "originalPrice": 2999,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/samsung-galaxy-tab-s9-128gb-graphite/",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 230,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 2399,
        "noonPrice": 2349,
        "sharafPrice": 2449
      },
      {
        "date": "14 days ago",
        "amazonPrice": 2149,
        "noonPrice": 2149,
        "sharafPrice": 2249
      },
      {
        "date": "Today",
        "amazonPrice": 1999,
        "noonPrice": 2049,
        "sharafPrice": 2149
      }
    ]
  },
  {
    "id": "prod_dyson_airwrap",
    "brand": "Dyson",
    "model": "Airwrap Multi-Styler",
    "normalizedName": "Dyson Airwrap Multi-Styler Complete Long Nickel and Copper",
    "canonicalKey": "dyson-airwrap-multi-styler-complete-long",
    "imageUrl": "https://m.media-amazon.com/images/I/31UhT0-rX-L._AC_SX679_.jpg",
    "category": "Home & Living",
    "attributes": {
      "type": "Multi-Styler & Dryer",
      "technology": "Coanda Airflow Styling",
      "heatControl": "Intelligent Heat Under 150°C"
    },
    "listings": [
      {
        "id": "prod_dyson_airwrap_list_amazon_ae_0",
        "sku": "PROD_DYSON_AIRWRAP_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "Dyson Airwrap Multi-Styler Complete Long Nickel and Copper - Amazon UAE",
        "currentPrice": 1999,
        "originalPrice": 2499,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B0B61XH5YT",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 420,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_dyson_airwrap_list_noon_ae_1",
        "sku": "PROD_DYSON_AIRWRAP_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "Dyson Airwrap Multi-Styler Complete Long Nickel and Copper - Noon UAE",
        "currentPrice": 1999,
        "originalPrice": 2499,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/airwrap-multi-styler-complete-long-prussian-blue-rich-copper/N53409802A/p/?o=f7bfab627d8ff14f",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 530,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_dyson_airwrap_list_sharaf_dg_2",
        "sku": "PROD_DYSON_AIRWRAP_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "Dyson Airwrap Multi-Styler Complete Long Nickel and Copper - Sharaf DG",
        "currentPrice": 1999,
        "originalPrice": 2499,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/dyson-airwrap-multi-styler-complete-long-nickel-copper/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 290,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_dyson_airwrap_list_carrefour_ae_3",
        "sku": "PROD_DYSON_AIRWRAP_CARREFOUR_AE",
        "retailerName": "Carrefour UAE",
        "retailerSlug": "carrefour_ae",
        "domain": "carrefouruae.com",
        "rawTitle": "Dyson Airwrap Multi-Styler Complete Long Nickel and Copper - Carrefour UAE",
        "currentPrice": 2049,
        "originalPrice": 2499,
        "currency": "AED",
        "url": "https://www.carrefouruae.com/mafuae/en/p/dyson-airwrap-multi-styler-complete-long",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 140,
        "sellerName": "Carrefour UAE",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_dyson_airwrap_list_jumbo_ae_4",
        "sku": "PROD_DYSON_AIRWRAP_JUMBO_AE",
        "retailerName": "Jumbo Electronics",
        "retailerSlug": "jumbo_ae",
        "domain": "jumbo.ae",
        "rawTitle": "Dyson Airwrap Multi-Styler Complete Long Nickel and Copper - Jumbo Electronics",
        "currentPrice": 2099,
        "originalPrice": 2499,
        "currency": "AED",
        "url": "https://www.jumbo.ae/dyson-airwrap-multi-styler-complete-long-nickel-copper.html",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 220,
        "sellerName": "Jumbo Official",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_dyson_airwrap_list_virgin_ae_5",
        "sku": "PROD_DYSON_AIRWRAP_VIRGIN_AE",
        "retailerName": "Virgin Megastore",
        "retailerSlug": "virgin_ae",
        "domain": "virginmegastore.ae",
        "rawTitle": "Dyson Airwrap Multi-Styler Complete Long Nickel and Copper - Virgin Megastore",
        "currentPrice": 2199,
        "originalPrice": 2499,
        "currency": "AED",
        "url": "https://www.virginmegastore.ae/en/beauty-grooming/hair-care/styling-tools/dyson-airwrap-multi-styler-complete-long-nickel-copper/p/812390",
        "stockStatus": "IN_STOCK",
        "rating": 4.9,
        "reviewCount": 180,
        "sellerName": "Virgin Megastore",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_dyson_airwrap_list_namshi_ae_6",
        "sku": "PROD_DYSON_AIRWRAP_NAMSHI_AE",
        "retailerName": "Namshi UAE",
        "retailerSlug": "namshi_ae",
        "domain": "namshi.com",
        "rawTitle": "Dyson Airwrap Multi-Styler Complete Long Nickel and Copper - Namshi UAE",
        "currentPrice": 2199,
        "originalPrice": 2499,
        "currency": "AED",
        "url": "https://en-ae.namshi.com/buy-dyson-airwrap-multi-styler-complete-long-nickel-copper/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 160,
        "sellerName": "Namshi Express",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 2399,
        "noonPrice": 2349,
        "sharafPrice": 2449
      },
      {
        "date": "14 days ago",
        "amazonPrice": 2199,
        "noonPrice": 2199,
        "sharafPrice": 2249
      },
      {
        "date": "Today",
        "amazonPrice": 1999,
        "noonPrice": 1999,
        "sharafPrice": 1999
      }
    ]
  },
  {
    "id": "prod_delonghi_magnifica",
    "brand": "De'Longhi",
    "model": "Magnifica S",
    "normalizedName": "De'Longhi Magnifica S Automatic Bean-to-Cup Coffee Machine",
    "canonicalKey": "delonghi-magnifica-s-ecam22110b",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    "category": "Home & Living",
    "attributes": {
      "pressure": "15 Bar Pump",
      "grinder": "13 Adjustable Settings",
      "milkFrother": "Manual Cappuccino System",
      "cleaning": "Auto-Rinse & Descaling Program"
    },
    "listings": [
      {
        "id": "prod_delonghi_magnifica_list_amazon_ae_0",
        "sku": "PROD_DELONGHI_MAGNIFICA_AMAZON_AE",
        "retailerName": "Amazon UAE",
        "retailerSlug": "amazon_ae",
        "domain": "amazon.ae",
        "rawTitle": "De'Longhi Magnifica S Automatic Bean-to-Cup Coffee Machine - Amazon UAE",
        "currentPrice": 1099,
        "originalPrice": 1899,
        "currency": "AED",
        "url": "https://www.amazon.ae/dp/B00400OMU0",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 3100,
        "sellerName": "Amazon.ae Prime",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_delonghi_magnifica_list_noon_ae_1",
        "sku": "PROD_DELONGHI_MAGNIFICA_NOON_AE",
        "retailerName": "Noon UAE",
        "retailerSlug": "noon_ae",
        "domain": "noon.com",
        "rawTitle": "De'Longhi Magnifica S Automatic Bean-to-Cup Coffee Machine - Noon UAE",
        "currentPrice": 1149,
        "originalPrice": 1899,
        "currency": "AED",
        "url": "https://www.noon.com/uae-en/delonghi-magnifica-s-automatic-coffee-machine/N12345678A/p/",
        "stockStatus": "IN_STOCK",
        "rating": 4.6,
        "reviewCount": 1950,
        "sellerName": "Noon Express",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_delonghi_magnifica_list_carrefour_ae_2",
        "sku": "PROD_DELONGHI_MAGNIFICA_CARREFOUR_AE",
        "retailerName": "Carrefour UAE",
        "retailerSlug": "carrefour_ae",
        "domain": "carrefouruae.com",
        "rawTitle": "De'Longhi Magnifica S Automatic Bean-to-Cup Coffee Machine - Carrefour UAE",
        "currentPrice": 1199,
        "originalPrice": 1899,
        "currency": "AED",
        "url": "https://www.carrefouruae.com/mafuae/en/p/delonghi-magnifica-s",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 420,
        "sellerName": "Carrefour UAE",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_delonghi_magnifica_list_sharaf_dg_3",
        "sku": "PROD_DELONGHI_MAGNIFICA_SHARAF_DG",
        "retailerName": "Sharaf DG",
        "retailerSlug": "sharaf_dg",
        "domain": "uae.sharafdg.com",
        "rawTitle": "De'Longhi Magnifica S Automatic Bean-to-Cup Coffee Machine - Sharaf DG",
        "currentPrice": 1249,
        "originalPrice": 1899,
        "currency": "AED",
        "url": "https://uae.sharafdg.com/product/delonghi-magnifica-s-espresso-machine/",
        "stockStatus": "IN_STOCK",
        "rating": 4.8,
        "reviewCount": 380,
        "sellerName": "Sharaf DG Retail",
        "isFulfilledByRetailer": true
      },
      {
        "id": "prod_delonghi_magnifica_list_lulu_ae_4",
        "sku": "PROD_DELONGHI_MAGNIFICA_LULU_AE",
        "retailerName": "LuLu Hypermarket",
        "retailerSlug": "lulu_ae",
        "domain": "luluhypermarket.com",
        "rawTitle": "De'Longhi Magnifica S Automatic Bean-to-Cup Coffee Machine - LuLu Hypermarket",
        "currentPrice": 1299,
        "originalPrice": 1899,
        "currency": "AED",
        "url": "https://www.luluhypermarket.com/en-ae/delonghi-magnifica-s/p/184200",
        "stockStatus": "IN_STOCK",
        "rating": 4.7,
        "reviewCount": 210,
        "sellerName": "LuLu Hypermarket",
        "isFulfilledByRetailer": true
      }
    ],
    "priceHistory": [
      {
        "date": "30 days ago",
        "amazonPrice": 1399,
        "noonPrice": 1349,
        "sharafPrice": 1449
      },
      {
        "date": "14 days ago",
        "amazonPrice": 1249,
        "noonPrice": 1229,
        "sharafPrice": 1299
      },
      {
        "date": "Today",
        "amazonPrice": 1099,
        "noonPrice": 1149,
        "sharafPrice": 1249
      }
    ]
  }
];

export function getAllCatalogProducts(): CatalogProduct[] {
  return CATALOG_PRODUCTS;
}

export function getCatalogProductById(id: string): CatalogProduct | undefined {
  return CATALOG_PRODUCTS.find(p => p.id === id || p.canonicalKey === id);
}

export function searchCatalogProducts(query: string, category?: string): CatalogProduct[] {
  const q = query.trim().toLowerCase();
  return CATALOG_PRODUCTS.filter(p => {
    const matchesCat = !category || category === 'All' || p.category.toLowerCase() === category.toLowerCase();
    if (!matchesCat) return false;
    if (!q) return true;
    return (
      p.normalizedName.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.canonicalKey.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });
}
