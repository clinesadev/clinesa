export const runtime = "nodejs"

import { stripe } from "@/lib/stripe/client"

export async function GET() {
  try {
    // Verificar que las 3 price IDs están configuradas
    const priceIds = [
      process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO,
      process.env.NEXT_PUBLIC_STRIPE_PRICE_PRACTICE,
      process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL
    ]

    const allConfigured = priceIds.every(id => id && id.length > 0)

    if (!allConfigured) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Missing price configuration",
          configured: {
            solo: !!process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO,
            practice: !!process.env.NEXT_PUBLIC_STRIPE_PRICE_PRACTICE,
            professional: !!process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL
          }
        }),
        { status: 503, headers: { "content-type": "application/json" } }
      )
    }

    // Intentar validar al menos un price ID
    try {
      await stripe.prices.retrieve(process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO!)
    } catch {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Invalid Stripe price ID or API key"
        }),
        { status: 503, headers: { "content-type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({
        ok: true,
        pricesConfigured: true,
        webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET
      }),
      { headers: { "content-type": "application/json" } }
    )
  } catch (error) {
    console.error("Stripe health check failed:", error)
    return new Response(
      JSON.stringify({ ok: false, error: "Stripe configuration error" }),
      { status: 503, headers: { "content-type": "application/json" } }
    )
  }
}