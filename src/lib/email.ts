import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(email: string, orderId: string, total: number, items: { name: string; quantity: number; price: number }[]) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email skipped (no RESEND_API_KEY): order confirmation', orderId);
    return;
  }

  await resend.emails.send({
    from: 'MythRealms <onboarding@resend.dev>',
    to: email,
    subject: `Order Confirmed — #${orderId.slice(-8)}`,
    html: OrderConfirmationTemplate(orderId, total, items),
  });
}

export async function sendAbandonedCart(email: string, cartUrl: string) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: 'MythRealms <onboarding@resend.dev>',
    to: email,
    subject: 'Your cart is waiting — complete your order',
    html: AbandonedCartTemplate(cartUrl),
  });
}

function OrderConfirmationTemplate(orderId: string, total: number, items: { name: string; quantity: number; price: number }[]): string {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;">${item.name}</td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;text-align:center;">${item.quantity}x</td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;text-align:right;">$${Number(item.price).toFixed(2)}</td></tr>`
    )
    .join('');

  return `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
      <h1 style="color:#1A1814;">Order Confirmed!</h1>
      <p>Thank you for your purchase. Your order <strong>#${orderId.slice(-8)}</strong> has been received.</p>
      <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
      <p style="font-size:20px;font-weight:bold;margin-top:20px;">Total: $${total.toFixed(2)}</p>
      <p style="color:#666;font-size:12px;">A shipping confirmation will follow shortly.</p>
    </div>
  `;
}

function AbandonedCartTemplate(cartUrl: string): string {
  return `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
      <h1 style="color:#1A1814;">Your cart is waiting</h1>
      <p>You left some items behind. Complete your order now — they're still reserved for you.</p>
      <a href="${cartUrl}" style="display:inline-block;padding:14px 32px;background:#1A1814;color:#fff;text-decoration:none;border-radius:9999px;font-weight:bold;margin-top:16px;">Complete Your Order</a>
      <p style="color:#666;font-size:12px;margin-top:24px;">Items in your cart are not reserved indefinitely.</p>
    </div>
  `;
}
