import { getCurrentUserId, getUserPlan } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { PricingCards } from "@/components/billing/PricingCards"
import { redirect } from "next/navigation"

async function getBillingData(userId: string) {
  const [user, plan, subscription] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, stripeCustomerId: true }
    }),
    getUserPlan(userId),
    prisma.subscription.findFirst({
      where: { userId, status: { in: ["active", "trialing"] } },
      orderBy: { currentPeriodEnd: "desc" }
    })
  ])

  return { user, plan, subscription }
}

export default async function BillingPage() {
  const userId = await getCurrentUserId()
  if (!userId) {
    redirect("/api/auth/signin")
  }

  const { user, plan, subscription } = await getBillingData(userId)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Suscripción y Facturación</h1>
        <p className="text-gray-500 mt-2">
          Gestiona tu plan y créditos mensuales
        </p>
      </div>

      {/* Estado actual */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Plan Actual</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Plan</p>
            <p className="text-2xl font-bold">
              {plan || "Sin plan"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Créditos disponibles</p>
            <p className="text-2xl font-bold">{user?.credits || 0}</p>
          </div>
          {subscription && (
            <div>
              <p className="text-sm text-gray-500">Renovación</p>
              <p className="text-lg font-medium">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Planes disponibles */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Planes Disponibles</h2>
        <PricingCards currentPlan={plan} />
      </div>
    </div>
  )
}