-- =====================================================
-- 03_tables_core.sql - TABLAS PRINCIPALES
-- =====================================================
-- Tablas core del sistema: User, Patient, PatientSession, Subscription
-- Ejecutar DESPUÉS de 02_enums.sql
-- =====================================================

-- =====================================================
-- Tabla: User
-- =====================================================
CREATE TABLE "User" (
  id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  image TEXT,
  "stripeCustomerId" TEXT,
  credits INTEGER NOT NULL DEFAULT 0,
  "maxPatients" INTEGER,
  "trialEndsAt" TIMESTAMP(3),
  "trialUsed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "User_pkey" PRIMARY KEY (id)
);

-- Índices para User
CREATE UNIQUE INDEX "User_email_key" ON "User"(email);
CREATE INDEX "User_stripeCustomerId_idx" ON "User"("stripeCustomerId") WHERE "stripeCustomerId" IS NOT NULL;

COMMENT ON TABLE "User" IS 'Usuarios del sistema con información de billing y créditos';
COMMENT ON COLUMN "User".credits IS 'Créditos disponibles para análisis IA';
COMMENT ON COLUMN "User"."maxPatients" IS 'Límite de pacientes (NULL = ilimitado, 10 para SOLO)';
COMMENT ON COLUMN "User"."trialEndsAt" IS 'Fecha fin del trial de 14 días';
COMMENT ON COLUMN "User"."trialUsed" IS 'Si ya usó el trial gratuito';

-- =====================================================
-- Tabla: Patient
-- =====================================================
CREATE TABLE "Patient" (
  id TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  "birthDate" TIMESTAMP(3),
  "notesSecure" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Patient_pkey" PRIMARY KEY (id),
  CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices para Patient
CREATE INDEX "Patient_userId_idx" ON "Patient"("userId");
CREATE INDEX "Patient_fullName_idx" ON "Patient"("fullName");

COMMENT ON TABLE "Patient" IS 'Pacientes del sistema con información personal';
COMMENT ON COLUMN "Patient"."notesSecure" IS 'Notas cifradas con AES-256-GCM (formato JSON con dek, iv, ciphertext)';

-- =====================================================
-- Tabla: PatientSession
-- =====================================================
CREATE TABLE "PatientSession" (
  id TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  date TIMESTAMP(3) NOT NULL,
  "noteDocSecure" TEXT,
  "audioUrl" TEXT,
  "audioBytesSec" INTEGER,
  "audioDurationMin" INTEGER,
  "transcriptSecure" TEXT,
  "analysisJsonSecure" TEXT,
  status "SessionStatus" NOT NULL DEFAULT 'DRAFT',
  "creditsUsed" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PatientSession_pkey" PRIMARY KEY (id),
  CONSTRAINT "PatientSession_patientId_fkey" FOREIGN KEY ("patientId")
    REFERENCES "Patient"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices para PatientSession
CREATE INDEX "PatientSession_patientId_idx" ON "PatientSession"("patientId");
CREATE INDEX "PatientSession_date_idx" ON "PatientSession"(date DESC);
CREATE INDEX "PatientSession_status_idx" ON "PatientSession"(status);

COMMENT ON TABLE "PatientSession" IS 'Sesiones de terapia con audio, transcripción y análisis IA';
COMMENT ON COLUMN "PatientSession"."noteDocSecure" IS 'Notas de sesión cifradas';
COMMENT ON COLUMN "PatientSession"."audioUrl" IS 'Path del audio en Supabase Storage (userId/patientId/sessionId/file.mp3)';
COMMENT ON COLUMN "PatientSession"."audioDurationMin" IS 'Duración en minutos calculada del audio';
COMMENT ON COLUMN "PatientSession"."transcriptSecure" IS 'Transcripción cifrada del audio';
COMMENT ON COLUMN "PatientSession"."analysisJsonSecure" IS 'Análisis IA cifrado en formato JSON';
COMMENT ON COLUMN "PatientSession"."creditsUsed" IS 'Créditos consumidos en el análisis IA';

-- =====================================================
-- Tabla: Subscription
-- =====================================================
CREATE TABLE "Subscription" (
  id TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "stripeSubId" TEXT NOT NULL,
  plan "Plan" NOT NULL DEFAULT 'PROFESSIONAL',
  status TEXT NOT NULL,
  "currentPeriodEnd" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Subscription_pkey" PRIMARY KEY (id),
  CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices para Subscription
CREATE UNIQUE INDEX "Subscription_stripeSubId_key" ON "Subscription"("stripeSubId");
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_status_idx" ON "Subscription"(status);

COMMENT ON TABLE "Subscription" IS 'Suscripciones de Stripe por usuario';
COMMENT ON COLUMN "Subscription".status IS 'Estado de Stripe: active, trialing, canceled, past_due, etc.';
COMMENT ON COLUMN "Subscription"."currentPeriodEnd" IS 'Fecha de renovación de la suscripción';

-- Verificar que las tablas se crearon
SELECT
  c.relname as tablename,
  pg_size_pretty(pg_total_relation_size(c.oid)) AS size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN ('User', 'Patient', 'PatientSession', 'Subscription')
ORDER BY c.relname;