export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/session"
import { stripe } from "@/lib/stripe/client"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, stripeCustomerId: true }
    })

    if (!user || !user.email) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()
    const { plan } = body // "SOLO" | "PRACTICE" | "PROFESSIONAL"

    // Validar plan
    if (!["SOLO", "PRACTICE", "PROFESSIONAL"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // Obtener price ID según el plan
    const priceIdMap: Record<string, string> = {
      SOLO: process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO || "",
      PRACTICE: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRACTICE || "",
      PROFESSIONAL: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL || "",
    }

    const priceId = priceIdMap[plan]
    if (!priceId) {
      return NextResponse.json({
        error: `Missing price configuration for plan ${plan}`
      }, { status: 500 })
    }

    // Crear sesión de checkout
    const origin = req.headers.get("origin") || "http://localhost:3000"
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId || undefined,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?upgrade=success`,
      cancel_url: `${origin}/billing?canceled=true`,
      metadata: { userId, plan },
      subscription_data: {
        metadata: { userId, plan }
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}