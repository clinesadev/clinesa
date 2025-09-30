import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUserId } from "@/lib/auth/session"
import { encryptField, decryptField } from "@/lib/crypto"
import { SessionStatus } from "@prisma-generated/index"

export const runtime = "nodejs"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const session = await prisma.patientSession.findFirst({
      where: {
        id,
        patient: { userId }
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
          }
        }
      }
    })

    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 })

    // Decrypt encrypted fields if present
    const decryptedSession = {
      ...session,
      noteDoc: session.noteDocSecure ? decryptField(JSON.parse(session.noteDocSecure)) : null,
      transcript: session.transcriptSecure ? decryptField(JSON.parse(session.transcriptSecure)) : null,
      analysisJson: session.analysisJsonSecure ? decryptField(JSON.parse(session.analysisJsonSecure)) : null,
      noteDocSecure: undefined,
      transcriptSecure: undefined,
      analysisJsonSecure: undefined,
    }

    return NextResponse.json(decryptedSession)
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const body = await req.json()
    const { date, note, status, audioUrl, audioBytesSec, audioDurationMin } = body

    const session = await prisma.patientSession.findFirst({
      where: {
        id,
        patient: { userId }
      }
    })

    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 })

    // Construir objeto de actualización dinámicamente
    const updateData: {
      date?: Date
      noteDocSecure?: string | null
      status?: SessionStatus
      audioUrl?: string
      audioBytesSec?: number
      audioDurationMin?: number
    } = {}

    if (date) updateData.date = new Date(date)
    if (note !== undefined) {
      updateData.noteDocSecure = note ? JSON.stringify(encryptField(note)) : null
    }
    if (status) updateData.status = status
    if (audioUrl) updateData.audioUrl = audioUrl
    if (audioBytesSec !== undefined) updateData.audioBytesSec = audioBytesSec
    if (audioDurationMin !== undefined) updateData.audioDurationMin = audioDurationMin

    const updatedSession = await prisma.patientSession.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
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
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}