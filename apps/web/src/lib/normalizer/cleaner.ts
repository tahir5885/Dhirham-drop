/**
 * UAE & GCC E-Commerce Title Cleaner
 * Strips retailer marketing noise, regional tags, regulatory stamps, and fulfillment fluff.
 */

// Patterns to strip out of product titles
const NOISE_PATTERNS: RegExp[] = [
  // UAE & Regional market tags
  /\[?\b(UAE|Middle East|Global|International|KSA|Saudi|US|UK|Indian|Japan|Japanese)\s*(version|edition|spec|specs|model)?\]?/gi,
  /\b(with\s*facetime|without\s*facetime|face\s*time)\b/gi,
  /\b(dual\s*sim|single\s*sim|esim|nano\s*sim|physical\s*\+\s*esim)\b/gi,

  // UAE Regulatory authorities
  /\b(tra|tdra|citc)\s*(approved|registered|certified)?\b/gi,

  // Warranty claims
  /\b(\d+\s*year[s]?\s*(official\s*)?warranty|official\s*(brand\s*)?warranty|manufacturer\s*warranty|local\s*warranty)\b/gi,

  // Logistics & Retailer branding fluff
  /\b(free\s*delivery|next\s*day\s*delivery|express\s*delivery|same\s*day\s*delivery)\b/gi,
  /\b(noon\s*express|fulfilled\s*by\s*amazon|prime|ships\s*from\s*(uae|amazon|noon))\b/gi,
  /\b(free\s*shipping|cash\s*on\s*delivery|cod\s*available)\b/gi,

  // Marketing & condition fluff
  /\b(100%\s*(original|authentic|genuine)|brand\s*new|genuine\s*product)\b/gi,
  /\b(hot\s*deal|best\s*seller|top\s*rated|special\s*offer|limited\s*time\s*offer|limited\s*edition)\b/gi,
  /\b(high\s*quality|premium\s*quality|original\s*packaging)\b/gi,
  /\b(pack\s*of\s*1|single\s*pack|1\s*pc|1\s*piece)\b/gi,

  // Year fluff (e.g., '2023 version', '2024 edition')
  /\b202[0-9]\s*(version|model|edition|release)?\b/gi,
];

/**
 * Cleans a raw title by stripping regional badges, marketing claims, and filler tokens.
 */
export function cleanTitle(rawTitle: string): string {
  if (!rawTitle) return '';

  let cleaned = rawTitle;

  // Apply noise patterns
  for (const pattern of NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, ' ');
  }

  // Normalize storage spacing: "256 GB" -> "256GB"
  cleaned = cleaned.replace(/(\d+)\s*(GB|TB|MB)\b/gi, '$1$2');

  // Normalize RAM spacing: "8 GB RAM" -> "8GB RAM"
  cleaned = cleaned.replace(/(\d+)\s*(GB|MB)\s*RAM\b/gi, '$1$2 RAM');

  // Remove empty brackets or parentheses leftover
  cleaned = cleaned.replace(/[\[\(\{]\s*[\]\)\}]/g, ' ');

  // Replace special separator characters like "|" or ";" with space
  cleaned = cleaned.replace(/[|;~]/g, ' ');

  // Collapse multiple hyphens or trailing hyphens
  cleaned = cleaned.replace(/\s*-\s*-+\s*/g, ' - ');
  cleaned = cleaned.replace(/\s+-\s*$/g, '');
  cleaned = cleaned.replace(/^\s*-\s+/g, '');

  // Collapse multiple whitespaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}
