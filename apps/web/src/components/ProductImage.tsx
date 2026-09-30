'use client';

import React, { useState } from 'react';

// Reliable CDN fallback images for top searched products in UAE
export const DEFAULT_PRODUCT_FALLBACKS: Record<string, string> = {
  iphone: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
  sony: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
  samsung: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
  dyson: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
  watch: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
  macbook: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
  laptop: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
  airpods: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
  ps5: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
  switch: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=80',
  xbox: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&auto=format&fit=crop&q=80',
  ipad: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
  coffee: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  apple: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
  perfume: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
};

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  brand?: string;
  model?: string;
}

export function ProductImage({
  src,
  alt,
  className = '',
  brand = '',
  model = '',
}: ProductImageProps) {
  const [errorCount, setErrorCount] = useState(0);

  // Helper to determine best fallback image based on name/brand/model
  const getFallbackUrl = () => {
    const text = `${alt} ${brand} ${model}`.toLowerCase();
    if (text.includes('iphone') || text.includes('15 pro')) {
      return DEFAULT_PRODUCT_FALLBACKS.iphone;
    }
    if (text.includes('macbook')) {
      return DEFAULT_PRODUCT_FALLBACKS.macbook;
    }
    if (text.includes('airpods')) {
      return DEFAULT_PRODUCT_FALLBACKS.airpods;
    }
    if (text.includes('playstation') || text.includes('ps5')) {
      return DEFAULT_PRODUCT_FALLBACKS.ps5;
    }
    if (text.includes('switch') || text.includes('nintendo')) {
      return DEFAULT_PRODUCT_FALLBACKS.switch;
    }
    if (text.includes('xbox')) {
      return DEFAULT_PRODUCT_FALLBACKS.xbox;
    }
    if (text.includes('ipad') || text.includes('tab')) {
      return DEFAULT_PRODUCT_FALLBACKS.ipad;
    }
    if (text.includes('sony') || text.includes('wh-1000xm5') || text.includes('headphone') || text.includes('bose')) {
      return DEFAULT_PRODUCT_FALLBACKS.sony;
    }
    if (text.includes('samsung') || text.includes('s24') || text.includes('galaxy')) {
      return DEFAULT_PRODUCT_FALLBACKS.samsung;
    }
    if (text.includes('dyson') || text.includes('airwrap') || text.includes('styler')) {
      return DEFAULT_PRODUCT_FALLBACKS.dyson;
    }
    if (text.includes('coffee') || text.includes('magnifica') || text.includes('delonghi')) {
      return DEFAULT_PRODUCT_FALLBACKS.coffee;
    }
    if (text.includes('watch') || text.includes('ultra')) {
      return DEFAULT_PRODUCT_FALLBACKS.watch;
    }
    if (text.includes('dell') || text.includes('laptop') || text.includes('xps')) {
      return DEFAULT_PRODUCT_FALLBACKS.laptop;
    }
    if (text.includes('perfume') || text.includes('fragrance') || text.includes('parfum') || text.includes('dior') || text.includes('sauvage') || text.includes('creed') || text.includes('aventus') || text.includes('tom ford')) {
      return DEFAULT_PRODUCT_FALLBACKS.perfume;
    }
    if (text.includes('camera') || text.includes('drone') || text.includes('dji') || text.includes('gopro') || text.includes('alpha') || text.includes('lumix')) {
      return DEFAULT_PRODUCT_FALLBACKS.camera;
    }
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80';
  };

  const primarySrc = src || getFallbackUrl();
  const fallbackSrc = getFallbackUrl();

  // If primary and fallback failed, show clean branded badge
  if (errorCount >= 2 || (!src && errorCount >= 1)) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider rounded-xl select-none p-2 ${className}`}
      >
        <span className="text-emerald-600 font-extrabold text-sm">{brand || 'UAE'}</span>
        <span className="text-[10px] text-slate-500 font-medium truncate max-w-full text-center">
          {model || alt.split(' ').slice(0, 2).join(' ')}
        </span>
      </div>
    );
  }

  const currentSrc = errorCount === 0 ? primarySrc : fallbackSrc;

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        setErrorCount((prev) => prev + 1);
      }}
      className={className}
      loading="lazy"
    />
  );
}
