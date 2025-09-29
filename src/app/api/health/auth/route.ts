import { getCurrentUserId } from "@/lib/auth/session"
export const runtime = "nodejs"
export async function GET() {
  const uid = await getCurrentUserId()
  return new Response(JSON.stringify({ ok: !!uid, userId: uid ?? null }, null, 2), { headers: { "content-type": "application/json" } })
}