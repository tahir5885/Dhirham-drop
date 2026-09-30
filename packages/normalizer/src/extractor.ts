import { ProductAttributes, NormalizedProduct } from './types.js';
import { cleanTitle } from './cleaner.js';

const KNOWN_BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'Dyson',
  'Anker',
  'Xiaomi',
  'Huawei',
  'Google',
  'Asus',
  'Lenovo',
  'HP',
  'Dell',
  'LG',
  'Bose',
  'JBL',
  'GoPro',
  'Nintendo',
  'PlayStation',
  'Xbox',
  'Microsoft',
  'OnePlus',
  'Nothing',
  'Garmin',
  'Marshall',
  'Philips',
  'Braun',
  'Logitech',
  'Razer',
];

const KNOWN_COLORS = [
  'Natural Titanium',
  'Desert Titanium',
  'White Titanium',
  'Black Titanium',
  'Blue Titanium',
  'Space Black',
  'Space Gray',
  'Midnight',
  'Starlight',
  'Phantom Black',
  'Cream',
  'Graphite',
  'Silver',
  'Gold',
  'Rose Gold',
  'Black',
  'White',
  'Blue',
  'Green',
  'Purple',
  'Red',
  'Yellow',
  'Pink',
  'Orange',
  'Grey',
  'Gray',
];

const ACCESSORY_INDICATORS = [
  'case',
  'cover',
  'screen protector',
  'tempered glass',
  'protective film',
  'strap',
  'band',
  'sleeve',
  'skin',
  'charger cable',
  'charging cable',
  'fast charger',
  'power adapter',
  'wall adapter',
  'magsafe wallet',
  'stand',
  'holder',
  'mount',
  'replacement tips',
  'ear tips',
  'stylus pen',
  'silicone case',
];

/**
 * Extracts structured product attributes from a cleaned or raw title.
 */
export function extractAttributes(rawTitle: string): ProductAttributes {
  const lower = rawTitle.toLowerCase();

  // 1. Accessory check (critical to avoid matching 30 AED phone cases to 4000 AED phones)
  let isAccessory = false;
  let accessoryType: string | undefined = undefined;

  const CHASSIS_MATERIAL_CASE = /\b(titanium|aluminum|aluminium|stainless\s*steel|ceramic)\s*case\b/i;
  const isChassisCase = CHASSIS_MATERIAL_CASE.test(rawTitle);

  const hasAccessoryIntent =
    /\b(for\s+|designed\s*for|compatible\s*(with)?|replacement|strap|band|protector|screen\s*protector|cable|charger|adapter|sleeve|skin|mount|holder)\b/i.test(
      rawTitle
    );

  for (const acc of ACCESSORY_INDICATORS) {
    const accRegex = new RegExp(`\\b${acc}\\b`, 'i');
    if (accRegex.test(rawTitle)) {
      if (acc === 'case' && isChassisCase && !hasAccessoryIntent) {
        continue;
      }
      if (
        hasAccessoryIntent ||
        acc !== 'case' ||
        /\b(protective|silicone|clear|leather|rugged|armor|wallet|hybrid|bumper|cover)\s*case\b/i.test(rawTitle)
      ) {
        isAccessory = true;
        accessoryType = acc;
        break;
      }
    }
  }

  // 2. Brand detection
  let brand: string | undefined = undefined;
  for (const b of KNOWN_BRANDS) {
    const brandRegex = new RegExp(`\\b${b}\\b`, 'i');
    if (brandRegex.test(rawTitle)) {
      brand = b;
      break;
    }
  }

  // 3. Storage detection (e.g. 128GB, 256GB, 512GB, 1TB)
  let storage: string | undefined = undefined;
  const storageMatch = rawTitle.match(/\b(16|32|64|128|256|512)\s*GB\b|\b(1|2)\s*TB\b/i);
  if (storageMatch) {
    storage = storageMatch[0].replace(/\s+/g, '').toUpperCase();
  }

  // 4. RAM detection (e.g. 8GB RAM, 16GB RAM)
  let ram: string | undefined = undefined;
  const ramMatch = rawTitle.match(/\b(4|6|8|12|16|24|32|64)\s*(?:GB|MB)\s*RAM\b/i);
  if (ramMatch) {
    ram = ramMatch[0].replace(/\s+/g, ' ').toUpperCase();
  }

  // 5. Color detection
  let color: string | undefined = undefined;
  for (const c of KNOWN_COLORS) {
    const colorRegex = new RegExp(`\\b${c}\\b`, 'i');
    if (colorRegex.test(rawTitle)) {
      color = c;
      break;
    }
  }

  // 6. Connectivity detection
  let connectivity: string | undefined = undefined;
  if (/\b5G\b/i.test(rawTitle)) {
    connectivity = '5G';
  } else if (/\b(4G|LTE)\b/i.test(rawTitle)) {
    connectivity = '4G/LTE';
  } else if (/\bWi-?Fi\b/i.test(rawTitle)) {
    connectivity = 'WiFi';
  }

  // 7. Model heuristic extraction
  let model: string | undefined = undefined;
  if (brand) {
    // E.g. If brand is Apple, search for iPhone 15 Pro Max, iPad Pro, MacBook Air
    const modelMatches = [
      /iphone\s*(1[1-6]|se)\s*(pro\s*max|pro|plus|mini)?/i,
      /galaxy\s*(s2[0-4]|z\s*fold\s*[4-6]|z\s*flip\s*[4-6]|a\d{2})\s*(ultra|\+|plus|fe)?/i,
      /wh-1000xm[4-5]/i,
      /wf-1000xm[4-5]/i,
      /airwrap/i,
      /supersonic/i,
      /playstation\s*5(\s*slim)?/i,
      /xbox\s*series\s*[xs]/i,
      /switch\s*(oled|lite)?/i,
      /pixel\s*[7-9]\s*(pro|a)?/i,
    ];

    for (const rx of modelMatches) {
      const m = rawTitle.match(rx);
      if (m) {
        model = m[0].trim();
        break;
      }
    }
  }

  return {
    brand,
    model,
    storage,
    ram,
    color,
    connectivity,
    isAccessory,
    accessoryType,
  };
}

/**
 * Builds a deterministic canonical key slug (e.g., "apple-iphone-15-pro-max-256gb-natural-titanium").
 */
export function generateCanonicalKey(cleanedTitle: string, attrs: ProductAttributes): string {
  if (attrs.brand && attrs.model) {
    const parts = [
      attrs.brand.toLowerCase(),
      attrs.model.toLowerCase().replace(/\s+/g, '-'),
      attrs.storage ? attrs.storage.toLowerCase() : '',
      attrs.color ? attrs.color.toLowerCase().replace(/\s+/g, '-') : '',
    ].filter(Boolean);

    return parts.join('-');
  }

  // Fallback: slugify cleanedTitle tokens
  return cleanedTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

/**
 * Full normalization pipeline for a raw retailer product title.
 */
export function normalizeProductTitle(rawTitle: string): NormalizedProduct {
  const cleanedTitle = cleanTitle(rawTitle);
  const attributes = extractAttributes(rawTitle);
  const canonicalKey = generateCanonicalKey(cleanedTitle, attributes);

  return {
    rawTitle,
    cleanedTitle,
    canonicalKey,
    attributes,
  };
}
