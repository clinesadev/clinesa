import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUserId } from "@/lib/auth/session"
import { encryptField } from "@/lib/crypto"

export const runtime = "nodejs"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const patients = await prisma.patient.findMany({
    where: { userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      birthDate: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  return NextResponse.json(patients)
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Check patient limit
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { maxPatients: true },
  })

  if (user?.maxPatients !== null && user?.maxPatients !== undefined) {
    const currentCount = await prisma.patient.count({ where: { userId } })
    if (currentCount >= user.maxPatients) {
      return NextResponse.json({
        code: "PATIENT_LIMIT_REACHED",
        error: `Plan SOLO limitado a ${user.maxPatients} pacientes. Actualiza a PRACTICE para pacientes ilimitados.`,
        maxPatients: user.maxPatients,
        currentCount,
      }, { status: 402 })
    }
  }

  const body = await req.json()
  const { fullName, email, phone, birthDate, notes } = body

  if (!fullName) return NextResponse.json({ error: "fullName is required" }, { status: 400 })

  const patient = await prisma.patient.create({
    data: {
      userId,
      fullName,
      email,
      phone,
      birthDate: birthDate ? new Date(birthDate) : null,
      notesSecure: notes ? JSON.stringify(encryptField(notes)) : null,
    }
  })

  return NextResponse.json(patient)
}