import { prisma } from "@/lib/prisma"
export const runtime = "nodejs"

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1 as ok`
    return new Response(JSON.stringify({ ok: true }, null, 2), {
      headers: { "content-type": "application/json" },
    })
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e)
    return new Response(JSON.stringify({ ok: false, error }, null, 2), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}
