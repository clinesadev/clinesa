export const dynamic = "force-dynamic"

export async function GET() {
  const mask = (v?: string) => (v ? `${v.slice(0, 6)}…(${v.length})` : null)
  const body = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DIRECT_URL: !!process.env.DIRECT_URL,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    _sample: {
      DATABASE_URL: mask(process.env.DATABASE_URL),
      DIRECT_URL: mask(process.env.DIRECT_URL),
    },
  }
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "content-type": "application/json" },
  })
}
