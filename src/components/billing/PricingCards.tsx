"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Crown, Loader2 } from "lucide-react"

interface PricingCardsProps {
  currentPlan: "SOLO" | "PRACTICE" | "PROFESSIONAL" | null
}

const plans = [
  {
    id: "SOLO",
    name: "Solo",
    price: "9",
    credits: 250,
    sessions: "~6 sesiones/mes",
    maxPatients: 10,
    features: [
      "250 créditos mensuales",
      "Hasta 10 pacientes",
      "Transcripción automática",
      "Análisis IA con Claude",
      "Almacenamiento seguro"
    ]
  },
  {
    id: "PRACTICE",
    name: "Practice",
    price: "29",
    credits: 1200,
    sessions: "~31 sesiones/mes",
    maxPatients: null,
    popular: true,
    features: [
      "1200 créditos mensuales",
      "Pacientes ilimitados",
      "Transcripción automática",
      "Análisis IA con Claude",
      "Almacenamiento seguro",
      "Soporte prioritario"
    ]
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    price: "49",
    credits: 3200,
    sessions: "~84 sesiones/mes",
    maxPatients: null,
    features: [
      "3200 créditos mensuales",
      "Pacientes ilimitados",
      "Transcripción automática",
      "Análisis IA con Claude",
      "Almacenamiento seguro",
      "Soporte prioritario",
      "API access (próximamente)"
    ]
  }
]

export function PricingCards({ currentPlan }: PricingCardsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planId: string) => {
    setLoading(planId)
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Checkout failed")
      }

      const { url } = await res.json()
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      alert(error instanceof Error ? error.message : "Error al iniciar checkout")
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const isCurrent = currentPlan === plan.id
        const isPopular = plan.popular

        return (
          <div
            key={plan.id}
            className={`relative bg-white border rounded-lg p-6 flex flex-col ${
              isPopular ? "border-blue-500 shadow-lg" : ""
            }`}
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Más popular
                </span>
              </div>
            )}

            {isCurrent && (
              <div className="absolute -top-3 right-4">
                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Plan actual
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold">€{plan.price}</span>
                <span className="text-gray-500 ml-2">/mes</span>
              </div>
              <p className="text-sm text-gray-500">{plan.sessions}</p>
              <p className="text-xs text-gray-400 mt-1">{plan.credits} créditos mensuales</p>
            </div>

            <ul className="space-y-3 mb-6 flex-grow">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleCheckout(plan.id)}
              disabled={isCurrent || loading !== null}
              variant={isPopular ? "default" : "outline"}
              className="w-full"
              size="lg"
            >
              {loading === plan.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirigiendo...
                </>
              ) : isCurrent ? (
                "Plan actual"
              ) : (
                <>
                  Seleccionar {plan.name}
                  {isPopular && <Crown className="ml-2 h-4 w-4" />}
                </>
              )}
            </Button>
          </div>
        )
      })}
    </div>
  )
}