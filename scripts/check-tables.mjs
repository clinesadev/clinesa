import { config } from "dotenv"
import { PrismaClient } from "../generated/prisma/index.js"

// Cargar variables de entorno
config()

const prisma = new PrismaClient()

async function checkTables() {
  try {
    console.log("📊 Verificando tablas en la base de datos...")

    const tables = await prisma.$queryRaw`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `

    console.log("\n✅ Tablas encontradas:")
    tables.forEach((t) => console.log(`   - ${t.tablename}`))

    // Verificar conteo de registros
    console.log("\n📈 Conteo de registros:")
    const userCount = await prisma.user.count()
    const patientCount = await prisma.patient.count()
    const sessionCount = await prisma.patientSession.count()

    console.log(`   - Users: ${userCount}`)
    console.log(`   - Patients: ${patientCount}`)
    console.log(`   - Sessions: ${sessionCount}`)

  } catch (error) {
    console.error("❌ Error:", error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkTables()