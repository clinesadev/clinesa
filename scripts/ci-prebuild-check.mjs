/* CI prebuild checker: valida DATABASE_URL (pooler 6543) y DIRECT_URL (db.<ref>.supabase.co:5432).
   Si algo no cuadra, imprime diagnostico claro y sale con código 1 para cortar el build. */

const mask = (s) => (s ? s.slice(0, 20) + "…(" + s.length + ")" : "null")

function fail(msg) {
  console.error("❌ PRECHECK FAILED:", msg)
  console.error("HINT: En Vercel → Project → Settings → Environment Variables")
  console.error(" - DATABASE_URL  → aws-*-pooler.supabase.com:6543 … &pgbouncer=true")
  console.error(" - DIRECT_URL    → db.<project-ref>.supabase.co:5432 O aws-*-pooler.supabase.com:5432")
  process.exit(1)
}

const DB = process.env.DATABASE_URL || ""
const DIR = process.env.DIRECT_URL || ""

console.log("🔎 PRECHECK ENV")
console.log("  DATABASE_URL:", mask(DB))
console.log("  DIRECT_URL  :", mask(DIR))

if (!DB) fail("Falta DATABASE_URL.")
if (!DIR) fail("Falta DIRECT_URL.")

let dbU, dirU
try { dbU = new URL(DB) } catch { fail("DATABASE_URL no es una URL válida.") }
try { dirU = new URL(DIR) } catch { fail("DIRECT_URL no es una URL válida.") }

// DATABASE_URL: host pooler + puerto 6543
if (!(dbU.hostname.includes("pooler.supabase.com"))) {
  fail(`DATABASE_URL hostname debe ser *pooler.supabase.com* (actual: ${dbU.hostname})`)
}
if (dbU.port !== "6543") {
  fail(`DATABASE_URL debe usar puerto 6543 (actual: ${dbU.port || "(vacío)"})`)
}

// DIRECT_URL: host db.<ref>.supabase.co O aws-*-pooler.supabase.com + puerto 5432
const isValidDirectHost = /^db\.[a-z0-9]{15,}\.supabase\.co$/.test(dirU.hostname) || 
                         dirU.hostname.includes("pooler.supabase.com")
if (!isValidDirectHost) {
  fail(`DIRECT_URL hostname debe ser tipo db.<ref>.supabase.co o *pooler.supabase.com* (actual: ${dirU.hostname})`)
}
if (dirU.port !== "5432") {
  fail(`DIRECT_URL debe usar puerto 5432 (actual: ${dirU.port || "(vacío)"})`)
}

console.log("✅ PRECHECK OK: hosts/puertos válidos")
