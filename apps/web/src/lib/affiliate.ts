/**
 * DirhamDrop Affiliate Link Generator & Compliance Engine
 * Enforces the Amazon Associates Operating Agreement:
 * NEVER injects Amazon affiliate tags inside an Amazon.ae DOM / browser extension.
 */

export interface AffiliateContext {
  isExtension?: boolean;
  activeHostDomain?: string; // e.g. "amazon.ae" or "noon.com"
}

export function buildAffiliateUrl(
  rawUrl: string,
  retailerSlug: string,
  context?: AffiliateContext
): { url: string; isMonetized: boolean; reason?: string } {
  try {
    const urlObj = new URL(rawUrl);

    // CRITICAL BAN SAFEGUARD: Amazon Associates Extension Prohibition
    // Browser extensions must NEVER inject Amazon affiliate tags on amazon.* domains.
    if (context?.isExtension && context?.activeHostDomain?.includes('amazon.ae')) {
      if (retailerSlug === 'amazon_ae') {
        return {
          url: rawUrl,
          isMonetized: false,
          reason: 'Direct link (Amazon Associates extension policy compliance)',
        };
      }
    }

    if (retailerSlug === 'amazon_ae') {
      const tag = process.env.AMAZON_AFFILIATE_TAG || 'dirhamdrop-21';
      urlObj.searchParams.set('tag', tag);
      urlObj.searchParams.set('ascsubtag', 'dd_web_search');
      return { url: urlObj.toString(), isMonetized: true };
    }

    if (retailerSlug === 'noon_ae') {
      const code = process.env.NOON_AFFILIATE_CODE || 'DIRHAMDROP';
      urlObj.searchParams.set('utm_source', code);
      urlObj.searchParams.set('utm_medium', 'affiliate');
      urlObj.searchParams.set('utm_campaign', 'dirhamdrop_price_engine');
      return { url: urlObj.toString(), isMonetized: true };
    }

    if (retailerSlug === 'sharaf_dg') {
      urlObj.searchParams.set('utm_source', 'dirhamdrop');
      urlObj.searchParams.set('utm_medium', 'price_comparison');
      urlObj.searchParams.set('utm_campaign', 'dirhamdrop_ae');
      return { url: urlObj.toString(), isMonetized: true };
    }

    // Top 10 UAE Retailer Tracking
    const UAE_PARTNER_SLUGS = [
      'jumbo_ae',
      'carrefour_ae',
      'microless_ae',
      'virgin_ae',
      'lulu_ae',
      'emax_ae',
      'namshi_ae',
    ];

    if (UAE_PARTNER_SLUGS.includes(retailerSlug)) {
      urlObj.searchParams.set('utm_source', 'dirhamdrop');
      urlObj.searchParams.set('utm_medium', 'price_comparison');
      urlObj.searchParams.set('utm_campaign', 'dirhamdrop_uae_engine');
      return { url: urlObj.toString(), isMonetized: true };
    }

    return { url: rawUrl, isMonetized: false };
  } catch {
    return { url: rawUrl, isMonetized: false };
  }
}
