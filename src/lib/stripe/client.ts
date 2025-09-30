import Stripe from "stripe"

function createStripeClient(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY - required for Stripe operations")
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  })
}

// Lazy initialization - only creates client when actually used
let _stripe: Stripe | undefined

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = createStripeClient()
  }
  return _stripe
}

// Export stripe instance (will throw at runtime if STRIPE_SECRET_KEY missing)
export const stripe = new Proxy({} as Stripe, {
  get: (target, prop) => {
    const client = getStripe()
    return client[prop as keyof Stripe]
  }
})