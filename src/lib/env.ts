// server-only
// Este archivo NUNCA debe importarse en Client Components

const pick = (v?: string) => (v && v.trim().length ? v : undefined)

const DATABASE_URL =
  pick(process.env.DATABASE_URL) ??
  pick(process.env.POSTGRES_PRISMA_URL) ??
  pick(process.env.POSTGRES_URL) ??
  (() => { throw new Error("Missing DATABASE_URL/POSTGRES_PRISMA_URL/POSTGRES_URL") })()

const DIRECT_URL =
  pick(process.env.DIRECT_URL) ??
  pick(process.env.POSTGRES_URL_NON_POOLING) ??
  (() => { throw new Error("Missing DIRECT_URL/POSTGRES_URL_NON_POOLING") })()

export const env = {
  DATABASE_URL,
  DIRECT_URL,
  SUPABASE_URL: process.env.SUPABASE_URL ?? (()=>{ throw new Error("Missing SUPABASE_URL") })(),
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? (()=>{ throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY") })(),
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? (()=>{ throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL") })(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? (()=>{ throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY") })(),
  AUTH_SECRET: process.env.AUTH_SECRET ?? (()=>{ throw new Error("Missing AUTH_SECRET") })(),
  ENCRYPTION_KEK: process.env.ENCRYPTION_KEK ?? process.env.ENCRYPTION_KEY ?? (()=>{ throw new Error("Missing ENCRYPTION_KEK or ENCRYPTION_KEY") })(),
} as const