import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      console.warn('STRIPE_SECRET_KEY not set — Stripe operations will fail at runtime')
    }
    stripeInstance = new Stripe(key || 'sk_test_placeholder', {
      apiVersion: '2025-04-15.basil' as any,
    })
  }
  return stripeInstance
}

// Lazily initialized — API routes call getStripe() at request time
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop]
  },
})
