import { NextRequest, NextResponse } from 'next/server';
import { getCouponsForRetailer, VERIFIED_UAE_COUPONS } from '@/lib/coupons';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const store = searchParams.get('store');

  if (store) {
    const coupons = getCouponsForRetailer(store);
    return NextResponse.json({
      store,
      totalCoupons: coupons.length,
      coupons,
    });
  }

  return NextResponse.json({
    totalCoupons: VERIFIED_UAE_COUPONS.length,
    coupons: VERIFIED_UAE_COUPONS,
  });
}
