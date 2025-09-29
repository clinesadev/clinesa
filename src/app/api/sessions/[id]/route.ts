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
  const { date, note, status } = body

  const session = await prisma.patientSession.findFirst({
    where: { 
      id,
      patient: { userId }
    }
  })

  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 })

  const updatedSession = await prisma.patientSession.update({
    where: { id },
    data: {
      date: date ? new Date(date) : undefined,
      noteDocSecure: note ? JSON.stringify(encryptField(note)) : undefined,
      status,
    }
  })

  return NextResponse.json(updatedSession)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const session = await prisma.patientSession.findFirst({
    where: { 
      id,
      patient: { userId }
    }
  })

  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 })

  await prisma.patientSession.delete({
    where: { id }
  })

  return NextResponse.json({ success: true })
}