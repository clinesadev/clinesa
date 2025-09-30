"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import { useRouter } from "next/navigation"

interface UpgradeCTAProps {
  credits: number
  plan: "SOLO" | "PRACTICE" | "PROFESSIONAL" | null
  isTrialActive?: boolean
  trialEndsAt?: Date | null
}

export function UpgradeCTA({ credits, plan, isTrialActive, trialEndsAt }: UpgradeCTAProps) {
  const router = useRouter()

  // Si tiene plan de pago, no mostrar
  if (plan) return null

  const isLowCredits = credits < 50
  const isOutOfCredits = credits <= 0

  // Mostrar siempre si está en trial o tiene pocos créditos
  const shouldShow = isTrialActive || isLowCredits

  if (!shouldShow) return null

  const getTitle = () => {
    if (isOutOfCredits) return "Sin créditos disponibles"
    if (isTrialActive && trialEndsAt) {
      const daysLeft = Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return `Trial: ${daysLeft} días restantes`
    }
    return `${credits} créditos restantes`
  }

  const getMessage = () => {
    if (isOutOfCredits) {
      return "Actualiza a un plan de pago para continuar usando la plataforma"
    }
    if (isTrialActive) {
      return "Actualiza ahora y obtén créditos ilimitados con PRACTICE o PROFESSIONAL"
    }
    return "Créditos bajos. Actualiza tu plan para obtener más créditos mensuales"
  }

  return (
    <Alert variant={isOutOfCredits ? "destructive" : "default"} className="mb-6">
      <Crown className="h-4 w-4" />
      <AlertTitle className="font-semibold">{getTitle()}</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-sm">{getMessage()}</span>
        <Button
          size="sm"
          variant={isOutOfCredits ? "default" : "outline"}
          onClick={() => router.push("/billing")}
          className="shrink-0"
        >
          Ver planes <Crown className="ml-2 h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}