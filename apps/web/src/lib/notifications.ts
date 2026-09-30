/**
 * DirhamDrop Notification & Email Dispatch Service
 * Delivers real-time price-drop alerts using Resend API with beautiful responsive HTML templates.
 */

export interface PriceDropNotificationPayload {
  toEmail: string;
  productName: string;
  productImageUrl?: string;
  targetPrice: number;
  newPrice: number;
  retailerName: string;
  buyUrl: string;
  alertId?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  mode: 'live' | 'simulated';
  error?: string;
}

export function generatePriceDropHtml(payload: PriceDropNotificationPayload): string {
  const savings = Math.max(0, payload.targetPrice - payload.newPrice);
  const webHubUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Price Drop Alert: ${payload.productName}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;padding:30px 15px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:20px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);">
                <!-- Header -->
                <tr>
                  <td style="padding:24px 28px;background:linear-gradient(135deg,#047857 0%,#065f46 100%);color:#ffffff;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <div style="display:inline-block;background:#059669;color:#ffffff;border-radius:8px;width:32px;height:32px;text-align:center;line-height:32px;font-size:18px;font-weight:900;margin-right:8px;vertical-align:middle;">د</div>
                          <span style="font-size:20px;font-weight:800;letter-spacing:-0.5px;vertical-align:middle;">Dirham<span style="color:#6ee7b7;">Drop</span></span>
                        </td>
                        <td align="right">
                          <span style="font-size:11px;font-weight:700;background:rgba(255,255,255,0.15);padding:4px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.2);">🇦🇪 UAE Alert</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding:28px;">
                    <div style="display:inline-block;background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;">
                      🎯 Target Price Reached!
                    </div>

                    <h1 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 16px 0;line-height:1.35;">
                      Great news! The price for your monitored product just dropped in the UAE.
                    </h1>

                    <!-- Product Card -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:20px;">
                      <tr>
                        ${
                          payload.productImageUrl
                            ? `<td width="90" valign="center" align="center" style="padding-right:14px;">
                                 <img src="${payload.productImageUrl}" alt="${payload.productName}" width="80" style="max-height:80px;object-fit:contain;border-radius:10px;background:#ffffff;padding:4px;border:1px solid #e2e8f0;display:block;">
                               </td>`
                            : ''
                        }
                        <td valign="center">
                          <strong style="font-size:14px;color:#1e293b;display:block;line-height:1.4;">
                            ${payload.productName}
                          </strong>
                          <span style="font-size:12px;color:#64748b;margin-top:4px;display:block;">
                            Available on <strong>${payload.retailerName}</strong>
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Price Drop Stats Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f0fdf4;border:1.5px solid #34d399;border-radius:14px;padding:16px;margin-bottom:24px;">
                      <tr>
                        <td align="center" style="border-right:1px solid #a7f3d0;padding:0 10px;">
                          <span style="font-size:11px;color:#047857;text-transform:uppercase;font-weight:700;display:block;">Your Target</span>
                          <span style="font-size:16px;font-weight:800;color:#0f172a;margin-top:2px;display:block;">AED ${payload.targetPrice.toLocaleString()}</span>
                        </td>
                        <td align="center" style="padding:0 10px;">
                          <span style="font-size:11px;color:#059669;text-transform:uppercase;font-weight:800;display:block;">New Live Price</span>
                          <span style="font-size:24px;font-weight:900;color:#047857;margin-top:2px;display:block;">AED ${payload.newPrice.toLocaleString()}</span>
                        </td>
                      </tr>
                      ${
                        savings > 0
                          ? `<tr>
                              <td colspan="2" align="center" style="padding-top:10px;font-size:12px;font-weight:700;color:#047857;">
                                📉 Extra savings of AED ${savings.toLocaleString()} below your target!
                              </td>
                            </tr>`
                          : ''
                      }
                    </table>

                    <!-- CTA Button -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <a href="${payload.buyUrl}" target="_blank" style="display:inline-block;width:85%;background:#059669;color:#ffffff;text-decoration:none;text-align:center;padding:14px 20px;border-radius:12px;font-size:15px;font-weight:800;box-shadow:0 4px 10px rgba(5,150,105,0.25);">
                            Buy Deal on ${payload.retailerName} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="text-align:center;margin-top:14px;">
                      <a href="${webHubUrl}/product/${payload.alertId || ''}" target="_blank" style="font-size:12px;color:#64748b;text-decoration:underline;">
                        View 30-Day Price History Graph &rarr;
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center;line-height:1.5;">
                    <p style="margin:0 0 6px 0;">
                      You received this email because you subscribed to a price alert on <strong>DirhamDrop.com</strong>.
                    </p>
                    <p style="margin:0;">
                      <a href="${webHubUrl}/alerts" target="_blank" style="color:#059669;text-decoration:underline;">Manage your alerts</a> &bull;
                      <a href="${webHubUrl}/deals" target="_blank" style="color:#059669;text-decoration:underline;">View All UAE Deals</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * Dispatches a price-drop email notification via Resend API or simulated dev logger
 */
export async function sendPriceDropEmail(payload: PriceDropNotificationPayload): Promise<NotificationResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.ALERT_SENDER_EMAIL || 'alerts@dirhamdrop.com';
  const htmlContent = generatePriceDropHtml(payload);

  // If RESEND_API_KEY is configured, dispatch real email
  if (resendApiKey) {
    try {
      console.log(`[Resend Notifier] Sending live price drop email to ${payload.toEmail}...`);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: payload.toEmail,
          subject: `📉 Price Drop Alert: ${payload.productName} is now AED ${payload.newPrice.toLocaleString()}!`,
          html: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Resend Notifier] Resend API error (${response.status}): ${errorText}`);
        return {
          success: false,
          mode: 'live',
          error: `Resend API error: ${errorText}`,
        };
      }

      const resData = await response.json();
      console.log(`[Resend Notifier] Email delivered successfully! Message ID: ${resData.id}`);
      return {
        success: true,
        messageId: resData.id,
        mode: 'live',
      };
    } catch (err: any) {
      console.error('[Resend Notifier] Network failure dispatching email:', err.message);
      return {
        success: false,
        mode: 'live',
        error: err.message,
      };
    }
  }

  // Simulated Mode (Development / Testing)
  console.log('\n=========================================');
  console.log(`[SIMULATED EMAIL NOTIFICATION] (Resend Key not configured in .env)`);
  console.log(`TO: ${payload.toEmail}`);
  console.log(`SUBJECT: 📉 Price Drop Alert: ${payload.productName} is now AED ${payload.newPrice}!`);
  console.log(`TARGET PRICE: AED ${payload.targetPrice} | NEW PRICE: AED ${payload.newPrice} on ${payload.retailerName}`);
  console.log(`BUY URL: ${payload.buyUrl}`);
  console.log('=========================================\n');

  return {
    success: true,
    messageId: `sim_${Date.now()}`,
    mode: 'simulated',
  };
}
