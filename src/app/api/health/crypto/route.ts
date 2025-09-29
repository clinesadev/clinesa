export const runtime = "nodejs"

export async function GET() {
  return new Response(JSON.stringify({ kekLoaded: !!process.env.ENCRYPTION_KEK }, null, 2), {
    headers: { "content-type": "application/json" },
  })
}