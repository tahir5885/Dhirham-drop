import { MatchResult, ConfidenceLevel } from './types.js';
import { normalizeProductTitle } from './extractor.js';

/**
 * Calculates Sørensen–Dice coefficient between two sets of tokens.
 */
function diceCoefficient(tokens1: string[], tokens2: string[]): number {
  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  let intersection = 0;
  for (const token of set1) {
    if (set2.has(token)) {
      intersection++;
    }
  }

  return (2 * intersection) / (set1.size + set2.size);
}

/**
 * Calculates Jaccard token overlap between two strings.
 */
function jaccardSimilarity(str1: string, str2: string): number {
  const t1 = new Set(str1.toLowerCase().split(/\s+/).filter(Boolean));
  const t2 = new Set(str2.toLowerCase().split(/\s+/).filter(Boolean));

  if (t1.size === 0 || t2.size === 0) return 0;

  let intersection = 0;
  for (const item of t1) {
    if (t2.has(item)) intersection++;
  }

  const union = new Set([...t1, ...t2]).size;
  return intersection / union;
}

/**
 * Tokenizes a string into alphanumeric words, ignoring common punctuation.
 */
function tokenize(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

/**
 * Fuzzy matches two product titles (e.g. from Amazon and Noon).
 * Returns confidence, score (0-1), and match reasoning.
 */
export function fuzzyMatch(
  title1: string,
  title2: string,
  threshold: number = 0.75
): MatchResult {
  const norm1 = normalizeProductTitle(title1);
  const norm2 = normalizeProductTitle(title2);

  const attr1 = norm1.attributes;
  const attr2 = norm2.attributes;

  // Rule 1: Accessory mismatch safeguard (critical!)
  if (attr1.isAccessory !== attr2.isAccessory) {
    return {
      isMatch: false,
      score: 0.0,
      confidence: 'NONE',
      reason: `Accessory vs Device mismatch: "${title1}" vs "${title2}"`,
      product1: norm1,
      product2: norm2,
    };
  }

  // Rule 2: Brand mismatch safeguard
  if (attr1.brand && attr2.brand && attr1.brand.toLowerCase() !== attr2.brand.toLowerCase()) {
    return {
      isMatch: false,
      score: 0.0,
      confidence: 'NONE',
      reason: `Brand mismatch: ${attr1.brand} vs ${attr2.brand}`,
      product1: norm1,
      product2: norm2,
    };
  }

  // Rule 3: Storage mismatch safeguard
  if (attr1.storage && attr2.storage && attr1.storage !== attr2.storage) {
    return {
      isMatch: false,
      score: 0.1,
      confidence: 'NONE',
      reason: `Storage mismatch: ${attr1.storage} vs ${attr2.storage}`,
      product1: norm1,
      product2: norm2,
    };
  }

  // Exact Canonical Key match
  if (norm1.canonicalKey && norm1.canonicalKey === norm2.canonicalKey) {
    return {
      isMatch: true,
      score: 1.0,
      confidence: 'EXACT',
      reason: 'Exact canonical key and attribute match',
      product1: norm1,
      product2: norm2,
    };
  }

  // Token similarity calculation
  const tokens1 = tokenize(norm1.cleanedTitle);
  const tokens2 = tokenize(norm2.cleanedTitle);

  const dice = diceCoefficient(tokens1, tokens2);
  const jaccard = jaccardSimilarity(norm1.cleanedTitle, norm2.cleanedTitle);

  let score = dice * 0.6 + jaccard * 0.4;

  // Bonus if identical model detected
  if (attr1.model && attr2.model && attr1.model.toLowerCase() === attr2.model.toLowerCase()) {
    score = Math.min(1.0, score + 0.25);
  }

  // Bonus if color matches
  if (attr1.color && attr2.color && attr1.color.toLowerCase() === attr2.color.toLowerCase()) {
    score = Math.min(1.0, score + 0.1);
  }

  // Determine confidence level
  let confidence: ConfidenceLevel = 'NONE';
  if (score >= 0.9) {
    confidence = 'EXACT';
  } else if (score >= 0.8) {
    confidence = 'HIGH';
  } else if (score >= 0.65) {
    confidence = 'MEDIUM';
  } else if (score >= 0.4) {
    confidence = 'LOW';
  }

  const isMatch = score >= threshold;

  return {
    isMatch,
    score: Math.round(score * 100) / 100,
    confidence,
    reason: isMatch
      ? `Strong token & attribute overlap (score: ${(score * 100).toFixed(1)}%)`
      : `Score ${(score * 100).toFixed(1)}% below match threshold of ${(threshold * 100).toFixed(1)}%`,
    product1: norm1,
    product2: norm2,
  };
}
