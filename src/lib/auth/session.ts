import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"

export async function getSession() {
  return auth()
}
export async function getCurrentUserId(): Promise<string | null> {
  const s = await getSession()
  return s?.user?.id ?? null
}
export async function getUserPlan(userId: string): Promise<"FREE" | "PRO"> {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: { in: ["active", "trialing"] }, plan: "PRO" },
  })
  return sub ? "PRO" : "FREE"
}