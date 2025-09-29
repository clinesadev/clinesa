import { prisma } from "@/lib/prisma"

export const TRIAL_DURATION_DAYS = 14
export const TRIAL_CREDITS = 100
export const TRIAL_MAX_PATIENTS = 3

/**
 * Inicia el trial gratuito de 14 días para un usuario
 */
export async function startTrial(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { trialUsed: true, trialEndsAt: true },
  })

  if (!user) {
    throw new Error("User not found")
  }

  if (user.trialUsed) {
    throw new Error("Trial already used")
  }

  const trialEnd = new Date()
  trialEnd.setDate(trialEnd.getDate() + TRIAL_DURATION_DAYS)

  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: TRIAL_CREDITS,
      trialEndsAt: trialEnd,
      trialUsed: true,
      maxPatients: TRIAL_MAX_PATIENTS,
    },
  })

  // Registrar transacción de créditos trial
  await prisma.creditTransaction.create({
    data: {
      userId,
      type: "GRANT",
      amount: TRIAL_CREDITS,
      balance: TRIAL_CREDITS,
      reason: "trial_start",
      meta: { trialDays: TRIAL_DURATION_DAYS },
    },
  })
}

/**
 * Verifica si el trial está activo
 */
export async function isTrialActive(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { trialEndsAt: true },
  })

  if (!user?.trialEndsAt) return false
  return user.trialEndsAt > new Date()
}

/**
 * Verifica si el usuario ya usó su trial
 */
export async function hasUsedTrial(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { trialUsed: true },
  })
  return user?.trialUsed ?? false
}

/**
 * Obtiene días restantes de trial
 */
export async function getTrialDaysRemaining(userId: string): Promise<number | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { trialEndsAt: true },
  })

  if (!user?.trialEndsAt) return null

  const now = new Date()
  const diff = user.trialEndsAt.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  return days > 0 ? days : 0
}

/**
 * Convierte cuenta de trial a plan de pago
 */
export async function convertTrialToPaid(
  userId: string,
  plan: "SOLO" | "PRACTICE" | "PROFESSIONAL"
): Promise<void> {
  const maxPatients = plan === "SOLO" ? 10 : null

  await prisma.user.update({
    where: { id: userId },
    data: {
      maxPatients,
      trialEndsAt: null, // Eliminar fecha de expiración
    },
  })
}

/**
 * Bloquea cuenta tras trial expirado (solo lectura)
 */
export async function lockExpiredTrial(userId: string): Promise<void> {
  const active = await isTrialActive(userId)
  if (active) return // Trial aún activo, no bloquear

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { trialEndsAt: true, stripeCustomerId: true },
  })

  // Si tiene suscripción activa, no bloquear
  const hasSub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ["active", "trialing"] },
    },
  })

  if (hasSub) return

  // Si no tiene suscripción y trial expiró, cuenta en "read-only"
  // (implementación de bloqueo se hará en middleware/API checks)
}