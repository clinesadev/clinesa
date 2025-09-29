import { getCurrentUserId, getUserPlan } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { FREE_MAX_SESSIONS } from "@/lib/billing/limits"

async function getDashboardStats(userId: string) {
  const [patientCount, sessionCount, plan] = await Promise.all([
    prisma.patient.count({ where: { userId } }),
    prisma.patientSession.count({
      where: { patient: { userId } }
    }),
    getUserPlan(userId)
  ])

  return { patientCount, sessionCount, plan }
}

export default async function DashboardPage() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return <div>Not authenticated</div>
  }

  const { patientCount, sessionCount, plan } = await getDashboardStats(userId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Panel de Control</h1>
        <p className="text-sm text-gray-500 mt-1">
          Resumen de tu actividad clínica
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Pacientes</h3>
          <p className="text-2xl font-bold text-gray-900">{patientCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Sesiones</h3>
          <p className="text-2xl font-bold text-gray-900">{sessionCount}</p>
          {plan === "FREE" && (
            <p className="text-xs text-amber-600 mt-1">
              Límite: {FREE_MAX_SESSIONS}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Plan Actual</h3>
          <p className="text-2xl font-bold text-gray-900">{plan}</p>
          {plan === "FREE" && (
            <p className="text-xs text-blue-600 mt-1">
              Actualiza para sesiones ilimitadas
            </p>
          )}
        </div>
      </div>

      {plan === "FREE" && sessionCount >= FREE_MAX_SESSIONS * 0.8 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Límite de sesiones próximo
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Has usado {sessionCount} de {FREE_MAX_SESSIONS} sesiones gratuitas.
                  Considera actualizar a PRO para sesiones ilimitadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}