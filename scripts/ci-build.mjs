import { execSync } from "node:child_process"
import { existsSync, readdirSync } from "node:fs"

function run(cmd) {
  console.log("▶", cmd)
  execSync(cmd, { stdio: "inherit" })
}

run("node scripts/ci-prebuild-check.mjs")
run("prisma generate")

// El schema se aplica manualmente en Supabase usando prisma/sql/*.sql
// No usamos migraciones de Prisma porque no funcionan correctamente con Supabase
console.log("ℹ️  Schema gestionado manualmente en Supabase (ver prisma/sql/*.sql)")
console.log("✅ Prisma client generado correctamente")

run("next build")
