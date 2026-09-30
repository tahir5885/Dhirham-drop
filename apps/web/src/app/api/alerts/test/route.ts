import { NextRequest, NextResponse } from 'next/server';
import { sendPriceDropEmail } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      productName = 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      targetPrice = 850,
      newPrice = 799,
      retailerName = 'Amazon.ae',
      buyUrl = 'https://www.amazon.ae/dp/B09ZFD9CBB',
      productImageUrl = 'https://m.media-amazon.com/images/I/61+btxzpfDL._AC_SL1500_.jpg',
    } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid recipient email address is required.' }, { status: 400 });
    }

    const result = await sendPriceDropEmail({
      toEmail: email,
      productName,
      productImageUrl,
      targetPrice: parseFloat(targetPrice),
      newPrice: parseFloat(newPrice),
      retailerName,
      buyUrl,
      alertId: 'prod_sony_wh1000xm5',
    });

    return NextResponse.json({
      success: true,
      message: result.mode === 'live'
        ? `Live price drop email sent to ${email} via Resend! (ID: ${result.messageId})`
        : `Simulated price drop alert dispatched for ${email}! (Check console for output, or add RESEND_API_KEY to .env for real emails)`,
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to dispatch test alert: ' + err.message }, { status: 500 });
  }
}
