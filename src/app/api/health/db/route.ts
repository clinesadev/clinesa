import { prisma } from "@/lib/prisma"
export const runtime = "nodejs"

export async function GET() {
  try {
    const r = await prisma.$queryRaw`SELECT 1 as ok`
    return new Response(JSON.stringify({ ok: true }, null, 2), {
      headers: { "content-type": "application/json" },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }, null, 2), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}
