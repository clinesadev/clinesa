import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUserId } from "@/lib/auth/session"
import { encryptField, decryptField } from "@/lib/crypto"

export const runtime = "nodejs"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const patient = await prisma.patient.findFirst({
      where: { id, userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        birthDate: true,
        notesSecure: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

    // Decrypt notes if present
    const decryptedPatient = {
      ...patient,
      notes: patient.notesSecure ? decryptField(JSON.parse(patient.notesSecure)) : null,
      notesSecure: undefined,
    }

    return NextResponse.json(decryptedPatient)
  } catch (error) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
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
        birthDate: birthDate ? new Date(birthDate) : undefined,
        notesSecure: notes !== undefined ? (notes ? JSON.stringify(encryptField(notes)) : null) : undefined,
      }
    })

    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error("Error updating patient:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const patient = await prisma.patient.findFirst({
      where: { id, userId }
    })

    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

    await prisma.patient.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting patient:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}