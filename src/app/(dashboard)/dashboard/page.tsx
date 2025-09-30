import { getCurrentUserId, getUserPlan } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { UpgradeCTA } from "@/components/billing/UpgradeCTA"
import { isTrialActive } from "@/lib/billing/trial"

async function getDashboardStats(userId: string) {
  const [user, patientCount, sessionCount, plan, trialActive] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, trialEndsAt: true, maxPatients: true }
    }),
    prisma.patient.count({ where: { userId } }),
    prisma.patientSession.count({
      where: { patient: { userId } }
    }),
    getUserPlan(userId),
    isTrialActive(userId)
  ])

  return {
    credits: user?.credits ?? 0,
    trialEndsAt: user?.trialEndsAt ?? null,
    maxPatients: user?.maxPatients ?? null,
    patientCount,
    sessionCount,
    plan,
    trialActive
  }
}

export default async function DashboardPage() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return <div>Not authenticated</div>
  }

  const { credits, trialEndsAt, maxPatients, patientCount, sessionCount, plan, trialActive } = await getDashboardStats(userId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Panel de Control</h1>
        <p className="text-sm text-gray-500 mt-1">
          Resumen de tu actividad clínica
        </p>
      </div>

      <UpgradeCTA
        credits={credits}
        plan={plan}
        isTrialActive={trialActive}
        trialEndsAt={trialEndsAt}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Créditos</h3>
          <p className="text-2xl font-bold text-gray-900">{credits}</p>
          {trialActive && (
            <p className="text-xs text-blue-600 mt-1">Trial activo</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Pacientes</h3>
          <p className="text-2xl font-bold text-gray-900">{patientCount}</p>
          {maxPatients && (
            <p className="text-xs text-gray-500 mt-1">
              Límite: {maxPatients}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Sesiones</h3>
          <p className="text-2xl font-bold text-gray-900">{sessionCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Plan Actual</h3>
          <p className="text-2xl font-bold text-gray-900">{plan ?? (trialActive ? "TRIAL" : "FREE")}</p>
          {!plan && !trialActive && (
            <p className="text-xs text-blue-600 mt-1">
              Sin plan activo
            </p>
          )}
        </div>
      </div>
    </div>
  )
}