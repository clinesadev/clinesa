import { stripe } from "./client"
import { prisma } from "@/lib/prisma"
import { grantCredits } from "@/lib/billing/credits"
import type Stripe from "stripe"
import type { Plan } from "@prisma-generated/index"

// Mapeo de Price IDs a planes y créditos mensuales
const PLAN_CONFIG: Record<string, { plan: Plan; credits: number; maxPatients: number | null }> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO || ""]: {
    plan: "SOLO",
    credits: 250,  // ~6 sesiones de 30min
    maxPatients: 10
  },
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PRACTICE || ""]: {
    plan: "PRACTICE",
    credits: 1200, // ~31 sesiones de 30min
    maxPatients: null
  },
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL || ""]: {
    plan: "PROFESSIONAL",
    credits: 3200, // ~84 sesiones de 30min
    maxPatients: null
  },
}

export async function handleWebhookEvent(event: Stripe.Event) {
  // eslint-disable-next-line no-console
  console.log("Stripe webhook event:", event.type)

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutCompleted(session)
      break
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionChange(subscription)
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionDeleted(subscription)
      break
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice
      await handlePaymentSucceeded(invoice)
      break
    }

    default:
      // eslint-disable-next-line no-console
      console.log(`Unhandled event type: ${event.type}`)
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) {
    console.error("Missing userId in checkout session metadata")
    return
  }

  const customerId = session.customer as string

  // Actualizar stripeCustomerId en User
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customerId },
  })

  // eslint-disable-next-line no-console
  console.log(`Updated stripeCustomerId for user ${userId}`)
  // La suscripción se creará en el evento customer.subscription.created
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error(`User not found for Stripe customer: ${customerId}`)
    return
  }

  // Obtener price ID de la suscripción
  const priceId = subscription.items.data[0]?.price.id
  const config = PLAN_CONFIG[priceId]

  if (!config) {
    console.error(`Unknown price ID: ${priceId}`)
    return
  }

  // Crear o actualizar suscripción
  await prisma.subscription.upsert({
    where: { stripeSubId: subscription.id },
    create: {
      userId: user.id,
      stripeSubId: subscription.id,
      plan: config.plan,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    update: {
      plan: config.plan,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })

  // Actualizar límites del usuario
  await prisma.user.update({
    where: { id: user.id },
    data: {
      maxPatients: config.maxPatients,
      trialUsed: true, // Ya no puede usar trial si tiene suscripción
    },
  })

  // eslint-disable-next-line no-console
  console.log(`Subscription updated for user ${user.id}: ${config.plan}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error(`User not found for Stripe customer: ${customerId}`)
    return
  }

  // Marcar suscripción como cancelada
  await prisma.subscription.update({
    where: { stripeSubId: subscription.id },
    data: { status: "canceled" },
  })

  // Resetear límites a valores de usuario sin plan
  await prisma.user.update({
    where: { id: user.id },
    data: {
      maxPatients: 3, // Límite sin plan
    },
  })

  // eslint-disable-next-line no-console
  console.log(`Subscription canceled for user ${user.id}`)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Solo procesar si es renovación mensual (no el primer pago)
  if (invoice.billing_reason !== "subscription_cycle") {
    return
  }

  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const customerId = subscription.customer as string

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error(`User not found for Stripe customer: ${customerId}`)
    return
  }

  // Obtener créditos del plan
  const priceId = subscription.items.data[0]?.price.id
  const config = PLAN_CONFIG[priceId]

  if (!config) {
    console.error(`Unknown price ID: ${priceId}`)
    return
  }

  // Otorgar créditos mensuales
  await grantCredits({
    userId: user.id,
    amount: config.credits,
    reason: `monthly_refill_${config.plan}`,
    meta: {
      plan: config.plan,
      subscriptionId,
      invoiceId: invoice.id
    }
  })

  // eslint-disable-next-line no-console
  console.log(`Granted ${config.credits} credits to user ${user.id} (${config.plan})`)
}