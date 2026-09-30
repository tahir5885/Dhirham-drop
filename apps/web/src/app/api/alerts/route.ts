import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { sendPriceDropEmail } from '@/lib/notifications';

// In-memory fallback alert store when PostgreSQL is offline
interface StoredAlert {
  id: string;
  email: string;
  targetPrice: number;
  productName: string;
  productId: string;
  productImageUrl?: string;
  currentPrice?: number;
  buyUrl?: string;
  retailerName?: string;
  createdAt: Date;
  isActive: boolean;
}

const inMemoryAlerts: StoredAlert[] = [
  {
    id: 'alert_sample_1',
    email: 'shopper@dirhamdrop.com',
    targetPrice: 750,
    productName: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    productId: 'prod_sony_wh1000xm5',
    productImageUrl: 'https://m.media-amazon.com/images/I/61+btxzpfDL._AC_SL1500_.jpg',
    currentPrice: 799,
    retailerName: 'Amazon.ae',
    buyUrl: 'https://www.amazon.ae/dp/B09ZFD9CBB',
    createdAt: new Date(Date.now() - 86400000 * 2),
    isActive: true,
  },
  {
    id: 'alert_sample_2',
    email: 'shopper@dirhamdrop.com',
    targetPrice: 1900,
    productName: 'Dyson Airwrap Multi-Styler Complete Long',
    productId: 'prod_dyson_airwrap',
    productImageUrl: 'https://m.media-amazon.com/images/I/61k1YpC9rEL._AC_SL1500_.jpg',
    currentPrice: 1999,
    retailerName: 'Noon.com',
    buyUrl: 'https://www.noon.com/uae-en/airwrap-multi-styler-complete-long-prussian-blue-rich-copper/N53409802A/p/?o=f7bfab627d8ff14f',
    createdAt: new Date(Date.now() - 86400000),
    isActive: true,
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, targetPrice, productName, productId, productImageUrl, buyUrl, retailerName, triggerTestNow } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const parsedPrice = parseFloat(targetPrice);
    if (!parsedPrice || parsedPrice <= 0) {
      return NextResponse.json({ error: 'Target price must be greater than AED 0.' }, { status: 400 });
    }

    const alertRecord: StoredAlert = {
      id: 'alert_' + Date.now(),
      email: email.toLowerCase().trim(),
      targetPrice: parsedPrice,
      productName: productName || 'UAE Monitored Product',
      productId: productId || 'prod_canonical',
      productImageUrl,
      buyUrl: buyUrl || 'https://www.amazon.ae',
      retailerName: retailerName || 'Amazon.ae',
      createdAt: new Date(),
      isActive: true,
    };

    // Try saving in Database
    try {
      await prisma.userAlert.create({
        data: {
          userEmail: alertRecord.email,
          targetPrice: alertRecord.targetPrice,
          canonicalProductId: alertRecord.productId,
          isActive: true,
        },
      });
    } catch {
      // In-memory fallback
      inMemoryAlerts.unshift(alertRecord);
    }

    console.log(`[Price Alert] Registered alert for ${alertRecord.email} on ${alertRecord.productName} @ AED ${alertRecord.targetPrice}`);

    // If requested, dispatch an immediate test notification to demonstrate the pipeline
    let testDispatchResult = null;
    if (triggerTestNow) {
      testDispatchResult = await sendPriceDropEmail({
        toEmail: alertRecord.email,
        productName: alertRecord.productName,
        productImageUrl: alertRecord.productImageUrl,
        targetPrice: alertRecord.targetPrice,
        newPrice: Math.round(alertRecord.targetPrice * 0.95), // simulate a slight price drop
        retailerName: alertRecord.retailerName || 'Amazon.ae',
        buyUrl: alertRecord.buyUrl || 'https://www.amazon.ae',
        alertId: alertRecord.productId,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Alert activated! We will notify ${alertRecord.email} the instant this price drops below AED ${alertRecord.targetPrice}.`,
      alert: alertRecord,
      testDispatch: testDispatchResult,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create price alert: ' + err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filterEmail = searchParams.get('email')?.toLowerCase().trim();

  try {
    if (filterEmail) {
      // Query by user email
      let userAlerts: any[] = [];
      try {
        userAlerts = await prisma.userAlert.findMany({
          where: { userEmail: filterEmail, isActive: true },
          include: { canonicalProduct: true },
          orderBy: { createdAt: 'desc' },
        });
      } catch {
        userAlerts = inMemoryAlerts.filter(a => a.email === filterEmail && a.isActive);
      }

      return NextResponse.json({
        email: filterEmail,
        totalActiveAlerts: userAlerts.length,
        alerts: userAlerts,
      });
    }

    // Default: return all active alerts (or fallback list)
    let allAlerts: any[] = [];
    try {
      allAlerts = await prisma.userAlert.findMany({
        where: { isActive: true },
        include: { canonicalProduct: true },
        take: 50,
      });
    } catch {
      allAlerts = inMemoryAlerts.filter(a => a.isActive);
    }

    return NextResponse.json({
      totalActiveAlerts: allAlerts.length,
      alerts: allAlerts,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Alert ID is required for deletion.' }, { status: 400 });
    }

    try {
      await prisma.userAlert.update({
        where: { id },
        data: { isActive: false },
      });
    } catch {
      // In-memory fallback
      const found = inMemoryAlerts.find(a => a.id === id);
      if (found) {
        found.isActive = false;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Price alert ${id} cancelled successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete alert: ' + err.message }, { status: 500 });
  }
}
