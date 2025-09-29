import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUserId } from "@/lib/auth/session"
import { encryptField } from "@/lib/crypto"

export const runtime = "nodejs"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { fullName, email, phone, birthDate, notes } = body

  const patient = await prisma.patient.findFirst({
    where: { id, userId }
  })

  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

  const updatedPatient = await prisma.patient.update({
    where: { id },
    data: {
      fullName,
      email,
      phone,
      birthDate: birthDate ? new Date(birthDate) : null,
      notesSecure: notes ? JSON.stringify(encryptField(notes)) : null,
    }
  })

  return NextResponse.json(updatedPatient)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const patient = await prisma.patient.findFirst({
    where: { id, userId }
  })

  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

  await prisma.patient.delete({
    where: { id }
  })

  return NextResponse.json({ success: true })
}