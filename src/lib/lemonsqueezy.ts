// LemonSqueezy integration — Merchant of Record for global tax compliance
// API docs: https://docs.lemonsqueezy.com/api

const LEMONSQUEEZY_API = "https://api.lemonsqueezy.com/v1"

interface CheckoutOptions {
  storeId: string
  variantId: string
  email?: string
  name?: string
  successUrl: string
  cancelUrl: string
  customData?: Record<string, string>
}

export async function createCheckout(opts: CheckoutOptions) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY
  if (!apiKey) throw new Error("LEMONSQUEEZY_API_KEY is not set")

  const res = await fetch(`${LEMONSQUEEZY_API}/checkouts`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          store_id: Number(opts.storeId),
          variant_id: Number(opts.variantId),
          checkout_data: {
            email: opts.email,
            name: opts.name,
            custom: opts.customData || {},
          },
          product_options: {
            redirect_url: opts.successUrl,
          },
          checkout_options: {
            embed: false,
          },
        },
        relationships: {
          store: { data: { type: "stores", id: opts.storeId } },
        },
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("LemonSqueezy checkout error:", err)
    throw new Error(`LemonSqueezy API error: ${res.status}`)
  }

  const json = await res.json()
  return {
    url: json.data.attributes.url,
    id: json.data.id,
  }
}

export function verifyWebhook(payload: string, signature: string): boolean {
  const crypto = require("crypto")
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) return false

  const hmac = crypto.createHmac("sha256", secret)
  hmac.update(payload)
  const digest = hmac.digest("hex")
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}
