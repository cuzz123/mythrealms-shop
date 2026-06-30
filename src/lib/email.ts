import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

const BRAND_COLOR = "#1A1814";
const ACCENT = "#D4A84B";
const MUTED = "#8B7E6B";

export async function sendOrderConfirmation(
  email: string,
  orderId: string,
  total: number,
  items: { name: string; quantity: number; price: number }[]
) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Email skipped (no RESEND_API_KEY): order confirmation", orderId);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "MythRealms <onboarding@resend.dev>",
      to: email,
      subject: `Order Confirmed — #${orderId.slice(-8)}`,
      html: OrderConfirmationTemplate(orderId, total, items),
    });

    if (error) {
      console.error("Resend API error (order confirmation):", error);
    } else {
      console.log("Order confirmation email sent:", data?.id);
    }
  } catch (e) {
    console.error("Email send failed (order confirmation):", e);
  }
}

export async function sendAbandonedCart(email: string, cartUrl: string) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const { data, error } = await resend.emails.send({
      from: "MythRealms <onboarding@resend.dev>",
      to: email,
      subject: "Your cart is waiting — complete your order",
      html: AbandonedCartTemplate(cartUrl),
    });

    if (error) {
      console.error("Resend API error (abandoned cart):", error);
    } else {
      console.log("Abandoned cart email sent:", data?.id);
    }
  } catch (e) {
    console.error("Email send failed (abandoned cart):", e);
  }
}

function OrderConfirmationTemplate(
  orderId: string,
  total: number,
  items: { name: string; quantity: number; price: number }[]
): string {
  const shortId = orderId.slice(-8);
  const itemsHtml = items
    .map(
      (item) => {
        const itemTotal = Number(item.price) * item.quantity;
        return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e8e3db;color:${BRAND_COLOR};font-size:15px;">
            ${item.name}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e8e3db;text-align:center;color:${MUTED};font-size:14px;">
            ${item.quantity}×
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e8e3db;text-align:right;color:${BRAND_COLOR};font-size:14px;font-weight:500;">
            $${itemTotal.toFixed(2)}
          </td>
        </tr>`;
      }
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f5f2;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">

  <!-- Header -->
  <div style="text-align:center;padding-bottom:32px;">
    <h1 style="font-family:Georgia,serif;font-size:28px;color:${BRAND_COLOR};margin:0 0 6px;font-weight:600;">
      MythRealms
    </h1>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:${MUTED};margin:0;letter-spacing:0.5px;">
      Stones With Intention. Wear Your Becoming.
    </p>
  </div>

  <!-- Body card -->
  <div style="background:#fff;border-radius:12px;padding:36px 32px;border:1px solid #e8e3db;">

    <!-- Confirmation badge -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:48px;height:48px;border-radius:50%;background:#f0ece6;line-height:48px;font-size:24px;">&#10003;</div>
    </div>

    <h2 style="font-family:Georgia,serif;font-size:22px;color:${BRAND_COLOR};text-align:center;margin:0 0 8px;">
      Order Confirmed
    </h2>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:${MUTED};text-align:center;margin:0 0 8px;line-height:1.6;">
      Thank you for your purchase. Your order has been received and is being prepared.
    </p>
    <p style="font-family:monospace;font-size:13px;color:${BRAND_COLOR};text-align:center;margin:0 0 24px;font-weight:600;">
      Order #${shortId}
    </p>

    <!-- Items table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <thead>
        <tr>
          <th style="text-align:left;font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;font-weight:500;padding-bottom:8px;">Item</th>
          <th style="text-align:center;font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;font-weight:500;padding-bottom:8px;">Qty</th>
          <th style="text-align:right;font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;font-weight:500;padding-bottom:8px;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <!-- Total -->
    <div style="border-top:2px solid ${BRAND_COLOR};padding-top:16px;text-align:right;">
      <span style="font-family:Arial,sans-serif;font-size:14px;color:${MUTED};margin-right:8px;">Total</span>
      <span style="font-family:Georgia,serif;font-size:22px;color:${BRAND_COLOR};font-weight:700;">$${total.toFixed(2)}</span>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-top:28px;">
      <a href="${APP_URL}/track-order" style="display:inline-block;padding:12px 36px;background:${BRAND_COLOR};color:#fff;text-decoration:none;border-radius:9999px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;">
        Track Your Order
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding-top:24px;">
    <p style="font-family:Arial,sans-serif;font-size:12px;color:${MUTED};margin:0 0 4px;line-height:1.6;">
      A shipping confirmation with tracking information will follow once your order ships.
    </p>
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#b0a69a;margin:0;line-height:1.6;">
      MythRealms — Hand-selected stones. Artisan-finished. Shipping worldwide.<br/>
      <a href="${APP_URL}/returns" style="color:${ACCENT};text-decoration:none;">Returns Policy</a> &middot;
      <a href="${APP_URL}/contact" style="color:${ACCENT};text-decoration:none;">Contact Us</a>
    </p>
    <p style="font-family:Arial,sans-serif;font-size:10px;color:#c4bab0;margin:16px 0 0;">
      You received this email because you placed an order at MythRealms.<br/>
      If you did not place this order, please contact us immediately.
    </p>
  </div>

</div>
</body>
</html>`;
}

function AbandonedCartTemplate(cartUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f5f2;">
<div style="max-width:520px;margin:0 auto;padding:40px 20px;">

  <div style="text-align:center;padding-bottom:28px;">
    <h1 style="font-family:Georgia,serif;font-size:24px;color:${BRAND_COLOR};margin:0 0 4px;font-weight:600;">
      MythRealms
    </h1>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:${MUTED};margin:0;">
      Stones With Intention. Wear Your Becoming.
    </p>
  </div>

  <div style="background:#fff;border-radius:12px;padding:32px 28px;border:1px solid #e8e3db;text-align:center;">
    <h2 style="font-family:Georgia,serif;font-size:20px;color:${BRAND_COLOR};margin:0 0 10px;">
      Your cart is waiting
    </h2>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:${MUTED};margin:0 0 6px;line-height:1.6;">
      You left some items behind. They're still reserved for you — but not forever.
    </p>
    <a href="${cartUrl}" style="display:inline-block;padding:14px 36px;background:${BRAND_COLOR};color:#fff;text-decoration:none;border-radius:9999px;font-family:Arial,sans-serif;font-size:15px;font-weight:600;margin-top:20px;">
      Complete Your Order
    </a>
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#b0a69a;margin:20px 0 0;">
      <a href="${APP_URL}/collections/curated-singles" style="color:${ACCENT};text-decoration:none;">Browse more stones</a> if these aren't calling to you.
    </p>
  </div>

  <p style="font-family:Arial,sans-serif;font-size:10px;color:#c4bab0;text-align:center;margin:20px 0 0;">
    You received this email because you started checkout at MythRealms.<br/>
    No longer interested? Just ignore this message.
  </p>

</div>
</body>
</html>`;
}
