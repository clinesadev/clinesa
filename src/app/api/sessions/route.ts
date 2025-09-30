import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUserId } from "@/lib/auth/session"
import { encryptField } from "@/lib/crypto"
import { canCreateSession } from "@/lib/billing/limits"

export const runtime = "nodejs"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const sessions = await prisma.patientSession.findMany({
    where: { patient: { userId } },
    include: { patient: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { patientId, date, note } = body

  if (!patientId) return NextResponse.json({ error: "patientId is required" }, { status: 400 })

  // Check ownership
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, userId }
  })

  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

  // Check billing limits
  const canCreate = await canCreateSession(userId)
  if (!canCreate) {
    return NextResponse.json({
      code: "SESSION_LIMIT_REACHED",
      error: "Has alcanzado el límite de sesiones. Actualiza tu plan para continuar.",
    }, { status: 402 })
  }

  const session = await prisma.patientSession.create({
    data: {
      patientId,
      date: date ? new Date(date) : new Date(),
      noteDocSecure: note ? JSON.stringify(encryptField(note)) : null,
    }
  })

  return NextResponse.json(session)
}