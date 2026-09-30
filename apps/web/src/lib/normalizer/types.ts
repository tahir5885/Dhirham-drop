export type ConfidenceLevel = 'EXACT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface ProductAttributes {
  brand?: string;
  model?: string;
  storage?: string; // e.g., "128GB", "256GB", "1TB"
  ram?: string;     // e.g., "8GB", "16GB"
  color?: string;   // e.g., "Natural Titanium", "Phantom Black"
  isAccessory: boolean;
  accessoryType?: string; // e.g., "case", "screen protector", "strap"
  connectivity?: string;  // e.g., "5G", "WiFi"
}

export interface NormalizedProduct {
  rawTitle: string;
  cleanedTitle: string;
  canonicalKey: string;
  attributes: ProductAttributes;
}

export interface MatchResult {
  isMatch: boolean;
  score: number; // 0.0 to 1.0
  confidence: ConfidenceLevel;
  reason: string;
  product1: NormalizedProduct;
  product2: NormalizedProduct;
}
