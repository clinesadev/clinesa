import { config } from "dotenv"
import { PrismaClient } from "../generated/prisma/index.js"

// Cargar .env.local primero (tiene prioridad)
config({ path: ".env.local" })
config({ path: ".env" })

const prisma = new PrismaClient()

async function resetDatabase() {
  console.log("🗑️  Eliminando todos los datos de la base de datos...")

  try {
    // Eliminar en orden inverso de dependencias
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "CreditTransaction" CASCADE;')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "AuthSession" CASCADE;')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Account" CASCADE;')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "AuditLog" CASCADE;')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Consent" CASCADE;')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Subscription" CASCADE;')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "PatientSession" CASCADE;')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Patient" CASCADE;')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE;')

    console.log("✅ Base de datos limpiada exitosamente!")
  } catch (error) {
    console.error("❌ Error al limpiar la base de datos:", error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetDatabase()