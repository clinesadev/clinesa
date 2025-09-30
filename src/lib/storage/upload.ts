import { supabaseAdmin } from "./supabase"
import { randomId } from "@/lib/crypto"

/**
 * Genera una URL firmada para subir un archivo de audio
 * Estructura: sessions-audio/userId/patientId/sessionId/randomId-filename
 */
export async function generateUploadURL(
  userId: string,
  patientId: string,
  sessionId: string,
  filename: string
): Promise<{ uploadUrl: string; filePath: string }> {
  // Sanitizar nombre de archivo
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
  const filePath = `${userId}/${patientId}/${sessionId}/${randomId(8)}-${sanitized}`

  const { data, error } = await supabaseAdmin.storage
    .from("sessions-audio")
    .createSignedUploadUrl(filePath)

  if (error) {
    console.error("Failed to generate upload URL:", error)
    throw new Error("Failed to generate upload URL")
  }

  return {
    uploadUrl: data.signedUrl,
    filePath: data.path,
  }
}

/**
 * Genera una URL firmada para descargar un archivo de audio
 */
export async function getDownloadURL(filePath: string, expiresIn = 3600): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from("sessions-audio")
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    console.error("Failed to generate download URL:", error)
    throw new Error("Failed to generate download URL")
  }

  return data.signedUrl
}

/**
 * Elimina un archivo de audio del storage
 */
export async function deleteAudio(filePath: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from("sessions-audio")
    .remove([filePath])

  if (error) {
    console.error("Failed to delete audio:", error)
    throw new Error("Failed to delete audio")
  }
}