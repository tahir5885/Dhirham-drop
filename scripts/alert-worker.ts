import { prisma } from '@dirhamdrop/database';
import dotenv from 'dotenv';

dotenv.config();

export async function checkAndDispatchPriceAlerts() {
  console.log('[Alert Worker] Checking active price-drop alerts...');

  try {
    const alerts = await prisma.userAlert.findMany({
      where: {
        isActive: true,
        isTriggered: false,
      },
      include: {
        canonicalProduct: {
          include: {
            listings: {
              include: { retailer: true },
              orderBy: { currentPrice: 'asc' },
            },
          },
        },
      },
    });

    console.log(`[Alert Worker] Found ${alerts.length} active alerts to evaluate.`);

    for (const alert of alerts) {
      const product = alert.canonicalProduct;
      const lowestListing = product.listings[0];

      if (!lowestListing) continue;

      const currentPrice = Number(lowestListing.currentPrice);
      const targetPrice = Number(alert.targetPrice);

      if (currentPrice <= targetPrice) {
        console.log(
          `[Alert Worker] Target reached for ${alert.userEmail}! "${product.normalizedName}" dropped to AED ${currentPrice} (Target: AED ${targetPrice})`
        );

        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          try {
            const emailHtml = `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #047857;">🎉 Price Drop Alert from DirhamDrop</h2>
                <p>Great news! The product you were tracking has hit your target price:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0;">
                  <h3 style="margin-top: 0;">${product.normalizedName}</h3>
                  <p style="font-size: 20px; font-weight: bold; color: #047857; margin: 8px 0;">
                    Now AED ${currentPrice.toLocaleString()} on ${lowestListing.retailer.name}
                  </p>
                  <p style="font-size: 13px; color: #64748b;">Your target was: AED ${targetPrice.toLocaleString()}</p>
                </div>
                <a href="${lowestListing.url}" style="display: inline-block; background: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                  Buy Now on ${lowestListing.retailer.name} &rarr;
                </a>
              </div>
            `;

            const emailRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: process.env.ALERT_SENDER_EMAIL || 'alerts@dirhamdrop.com',
                to: alert.userEmail,
                subject: `📉 Price Drop: ${product.normalizedName} reached AED ${currentPrice}!`,
                html: emailHtml,
              }),
            });

            if (emailRes.ok) {
              console.log(`[Alert Worker] Successfully dispatched Resend email to ${alert.userEmail}`);
            } else {
              console.warn('[Alert Worker] Resend API error:', await emailRes.text());
            }
          } catch (emailErr) {
            console.error('[Alert Worker] Email dispatch failed:', emailErr);
          }
        } else {
          console.log('[Alert Worker] RESEND_API_KEY not configured; email dispatch simulated.');
        }

        // Mark alert as triggered
        await prisma.userAlert.update({
          where: { id: alert.id },
          data: {
            isTriggered: true,
            lastNotifiedAt: new Date(),
          },
        });
      }
    }
  } catch (err) {
    console.error('[Alert Worker] Error evaluating alerts:', err);
  } finally {
    await prisma.$disconnect();
    console.log('[Alert Worker] Finished alert evaluation run.');
  }
}

// Run directly if invoked via CLI
if (process.argv[1]?.includes('alert-worker')) {
  checkAndDispatchPriceAlerts().catch(console.error);
}
