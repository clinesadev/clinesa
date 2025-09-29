import { prisma } from "@/lib/prisma"
import { Plan, CreditTransactionType } from "@prisma/client"

// Costos de IA por minuto de audio (en créditos)
// Basado en: Deepgram ($0.0125/min) + Claude (~$0.033/sesión 30min)
// = ~$0.408 por sesión 30min = ~€0.38 = 38 créditos
export const CREDITS_PER_MINUTE = 1.27 // créditos por minuto de audio

// Créditos mensuales por plan
export const PLAN_CREDITS = {
  SOLO: 250,           // ~6 sesiones de 30min
  PRACTICE: 1200,      // ~31 sesiones de 30min
  PROFESSIONAL: 3200,  // ~84 sesiones de 30min
} as const

// Storage limits (bytes)
export const STORAGE_LIMITS = {
  SOLO: 200 * 1024 * 1024,              // 200 MB
  PRACTICE: 3 * 1024 * 1024 * 1024,     // 3 GB
  PROFESSIONAL: 10 * 1024 * 1024 * 1024, // 10 GB
} as const

// Límite de pacientes por plan (null = ilimitado)
export const MAX_PATIENTS = {
  SOLO: 10,
  PRACTICE: null,
  PROFESSIONAL: null,
} as const

/**
 * Calcula créditos necesarios para analizar audio
 */
export function calculateCreditsForAudio(durationMinutes: number): number {
  return Math.ceil(durationMinutes * CREDITS_PER_MINUTE)
}

/**
 * Obtiene balance de créditos del usuario
 */
export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  })
  return user?.credits ?? 0
}

/**
 * Obtiene plan actual del usuario
 */
export async function getUserPlan(userId: string): Promise<Plan> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ["active", "trialing"] },
    },
    orderBy: { currentPeriodEnd: "desc" },
  })
  return subscription?.plan ?? "FREE"
}

/**
 * Verifica si el usuario tiene créditos suficientes
 */
export async function hasEnoughCredits(
  userId: string,
  requiredCredits: number
): Promise<boolean> {
  const balance = await getUserCredits(userId)
  return balance >= requiredCredits
}

/**
 * Consume créditos del usuario (transacción atómica)
 */
export async function consumeCredits(params: {
  userId: string
  amount: number
  sessionId?: string
  reason: string
  meta?: Record<string, unknown>
}): Promise<{ success: boolean; newBalance: number }> {
  const { userId, amount, sessionId, reason, meta } = params

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Obtener balance actual con lock
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      })

      if (!user) throw new Error("User not found")

      const currentBalance = user.credits
      if (currentBalance < amount) {
        throw new Error(`Insufficient credits: have ${currentBalance}, need ${amount}`)
      }

      // 2. Actualizar balance
      const newBalance = currentBalance - amount
      await tx.user.update({
        where: { id: userId },
        data: { credits: newBalance },
      })

      // 3. Registrar transacción
      await tx.creditTransaction.create({
        data: {
          userId,
          sessionId,
          type: CreditTransactionType.CONSUME,
          amount: -amount, // Negativo porque es consumo
          balance: newBalance,
          reason,
          meta: meta || null,
        },
      })

      // 4. Actualizar session si aplica
      if (sessionId) {
        await tx.patientSession.update({
          where: { id: sessionId },
          data: { creditsUsed: amount },
        })
      }

      return { success: true, newBalance }
    })

    return result
  } catch (error) {
    console.error("Failed to consume credits:", error)
    throw error
  }
}

/**
 * Añade créditos al usuario (compra, suscripción, refill mensual)
 */
export async function grantCredits(params: {
  userId: string
  amount: number
  reason: string
  meta?: Record<string, unknown>
}): Promise<{ success: boolean; newBalance: number }> {
  const { userId, amount, reason, meta } = params

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Obtener balance actual
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      })

      if (!user) throw new Error("User not found")

      // 2. Actualizar balance
      const newBalance = user.credits + amount
      await tx.user.update({
        where: { id: userId },
        data: { credits: newBalance },
      })

      // 3. Registrar transacción
      await tx.creditTransaction.create({
        data: {
          userId,
          type: CreditTransactionType.GRANT,
          amount, // Positivo porque es añadido
          balance: newBalance,
          reason,
          meta: meta || null,
        },
      })

      return { success: true, newBalance }
    })

    return result
  } catch (error) {
    console.error("Failed to grant credits:", error)
    throw error
  }
}

/**
 * Refill mensual de créditos según plan
 */
export async function monthlyRefill(userId: string): Promise<void> {
  const plan = await getUserPlan(userId)
  const creditsToAdd = PLAN_CREDITS[plan]

  await grantCredits({
    userId,
    amount: creditsToAdd,
    reason: "monthly_refill",
    meta: { plan },
  })
}

/**
 * Obtiene historial de transacciones del usuario
 */
export async function getCreditHistory(
  userId: string,
  limit = 50
): Promise<Array<{
  id: string
  type: string
  amount: number
  balance: number
  reason: string | null
  createdAt: Date
}>> {
  return prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      amount: true,
      balance: true,
      reason: true,
      createdAt: true,
    },
  })
}

/**
 * Verifica si puede crear sesión (deprecated, ahora usa créditos)
 * Mantener para compatibilidad con código existente
 */
export async function canCreateSession(userId: string): Promise<boolean> {
  // Ahora siempre puede crear sesión (limitación es por créditos al analizar)
  return true
}