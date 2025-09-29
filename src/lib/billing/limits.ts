import { prisma } from "@/lib/prisma"
import { getUserPlan } from "@/lib/auth/session"
export const FREE_MAX_SESSIONS = 10
export async function canCreateSession(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId)
  if (plan === "PRO") return true
  const count = await prisma.patientSession.count({ where: { patient: { userId } } })
  return count < FREE_MAX_SESSIONS
}