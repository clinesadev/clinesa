export const runtime = "nodejs"

import { stripe } from "@/lib/stripe/client"
import { handleWebhookEvent } from "@/lib/stripe/webhook"
import type Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET")
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error"
    console.error("Webhook signature verification failed:", error)
    return new Response(`Invalid signature: ${error}`, { status: 400 })
  }

  try {
    await handleWebhookEvent(event)
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "content-type": "application/json" }
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    console.error("Webhook handler error:", errorMsg)
    return new Response(`Webhook handler failed: ${errorMsg}`, { status: 500 })
  }
}