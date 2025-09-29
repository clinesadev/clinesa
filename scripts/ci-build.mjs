import { execSync } from "node:child_process"
import { existsSync, readdirSync } from "node:fs"

function run(cmd) {
  console.log("▶", cmd)
  execSync(cmd, { stdio: "inherit" })
}

run("node scripts/ci-prebuild-check.mjs")
run("prisma generate")

const hasMigrations = existsSync("prisma/migrations") &&
  readdirSync("prisma/migrations").filter((d) => d !== ".cache").length > 0

if (hasMigrations) {
  console.log("ℹ️  Se detectaron migraciones. Ejecutando prisma migrate deploy…")
  run("prisma migrate deploy")
} else {
  console.log("ℹ️  No hay migraciones. Ejecutando prisma db push (MVP)…")
  // Usar --accept-data-loss en CI porque ya migramos manualmente en Supabase
  run("prisma db push --accept-data-loss --skip-generate")
}

run("next build")
