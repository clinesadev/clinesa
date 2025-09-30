export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { generateUploadURL } from "@/lib/storage/upload"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: sessionId } = await params

  try {
    const session = await prisma.patientSession.findFirst({
      where: {
        id: sessionId,
        patient: { userId }
      },
      include: { patient: true },
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const body = await req.json()
    const { filename } = body

    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ error: "filename is required" }, { status: 400 })
    }

    // Validar extensión de audio
    const allowedExtensions = ['.mp3', '.mp4', '.wav', '.webm', '.ogg', '.m4a']
    const hasValidExtension = allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext))

    if (!hasValidExtension) {
      return NextResponse.json({
        error: "Invalid file type. Allowed: mp3, mp4, wav, webm, ogg, m4a"
      }, { status: 400 })
    }

    const { uploadUrl, filePath } = await generateUploadURL(
      userId,
      session.patientId,
      sessionId,
      filename
    )

    return NextResponse.json({
      uploadUrl,
      filePath,
      expiresIn: 300 // 5 minutos
    })
  } catch (error) {
    console.error("Error generating upload URL:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}