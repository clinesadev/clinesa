-- =====================================================
-- 05_tables_audit.sql - TABLAS DE AUDITORÍA Y COMPLIANCE
-- =====================================================
-- Tablas para tracking, compliance y billing
-- Ejecutar DESPUÉS de 04_tables_auth.sql
-- =====================================================

-- =====================================================
-- Tabla: Consent (GDPR compliance)
-- =====================================================
CREATE TABLE "Consent" (
  id TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  kind TEXT NOT NULL,
  "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),

  CONSTRAINT "Consent_pkey" PRIMARY KEY (id),
  CONSTRAINT "Consent_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Consent_patientId_fkey" FOREIGN KEY ("patientId")
    REFERENCES "Patient"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices para Consent
CREATE INDEX "Consent_userId_idx" ON "Consent"("userId");
CREATE INDEX "Consent_patientId_idx" ON "Consent"("patientId");
CREATE INDEX "Consent_kind_idx" ON "Consent"(kind);

COMMENT ON TABLE "Consent" IS 'Consentimientos de pacientes (GDPR, HIPAA compliance)';
COMMENT ON COLUMN "Consent".kind IS 'Tipo de consentimiento: data_processing, audio_recording, ai_analysis, etc.';

-- =====================================================
-- Tabla: AuditLog
-- =====================================================
CREATE TABLE "AuditLog" (
  id TEXT NOT NULL,
  "userId" TEXT,
  "patientId" TEXT,
  "sessionId" TEXT,
  action TEXT NOT NULL,
  meta JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id),
  CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "AuditLog_patientId_fkey" FOREIGN KEY ("patientId")
    REFERENCES "Patient"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "AuditLog_sessionId_fkey" FOREIGN KEY ("sessionId")
    REFERENCES "PatientSession"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Índices para AuditLog
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_patientId_idx" ON "AuditLog"("patientId");
CREATE INDEX "AuditLog_sessionId_idx" ON "AuditLog"("sessionId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"(action);
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt" DESC);

COMMENT ON TABLE "AuditLog" IS 'Log de auditoría para compliance y debugging';
COMMENT ON COLUMN "AuditLog".action IS 'Acción realizada: patient.create, session.update, audio.upload, etc.';
COMMENT ON COLUMN "AuditLog".meta IS 'Metadata adicional en formato JSON';

-- =====================================================
-- Tabla: CreditTransaction (Billing ledger)
-- =====================================================
CREATE TABLE "CreditTransaction" (
  id TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "sessionId" TEXT,
  type "CreditTransactionType" NOT NULL,
  amount INTEGER NOT NULL,
  balance INTEGER NOT NULL,
  reason TEXT,
  meta JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY (id),
  CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CreditTransaction_sessionId_fkey" FOREIGN KEY ("sessionId")
    REFERENCES "PatientSession"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Índices para CreditTransaction
CREATE UNIQUE INDEX "CreditTransaction_sessionId_key" ON "CreditTransaction"("sessionId") WHERE "sessionId" IS NOT NULL;
CREATE INDEX "CreditTransaction_userId_createdAt_idx" ON "CreditTransaction"("userId", "createdAt" DESC);
CREATE INDEX "CreditTransaction_type_idx" ON "CreditTransaction"(type);

COMMENT ON TABLE "CreditTransaction" IS 'Ledger de créditos con balance después de cada transacción';
COMMENT ON COLUMN "CreditTransaction".amount IS 'Positivo = añadido, Negativo = consumido';
COMMENT ON COLUMN "CreditTransaction".balance IS 'Balance del usuario después de esta transacción';
COMMENT ON COLUMN "CreditTransaction".reason IS 'Razón: monthly_refill_SOLO, ai_analysis, trial_grant, etc.';

-- Verificar que las tablas se crearon
SELECT
  c.relname as tablename,
  pg_size_pretty(pg_total_relation_size(c.oid)) AS size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN ('Consent', 'AuditLog', 'CreditTransaction')
ORDER BY c.relname;