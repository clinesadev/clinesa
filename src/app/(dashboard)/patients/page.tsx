import { getCurrentUserId } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"

async function getPatients(userId: string) {
  return prisma.patient.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      birthDate: true,
      createdAt: true,
      _count: {
        select: { sessions: true }
      }
    }
  })
}

export default async function PatientsPage() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return <div>Not authenticated</div>
  }

  const patients = await getPatients(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <form action="/api/patients" method="post">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={() => {
              const name = prompt("Nombre del paciente:")
              if (name) {
                fetch('/api/patients', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ fullName: name })
                }).then(() => window.location.reload())
              }
            }}
          >
            Nuevo Paciente
          </button>
        </form>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hay pacientes registrados</p>
          <p className="text-sm">Crea tu primer paciente para comenzar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {patients.map((patient) => (
            <div key={patient.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{patient.fullName}</h3>
                  {patient.email && (
                    <p className="text-sm text-gray-600">{patient.email}</p>
                  )}
                  {patient.phone && (
                    <p className="text-sm text-gray-600">{patient.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {patient._count.sessions} sesiones
                  </p>
                  <p className="text-xs text-gray-500">
                    Creado: {new Date(patient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}