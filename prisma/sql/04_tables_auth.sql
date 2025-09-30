-- =====================================================
-- 04_tables_auth.sql - TABLAS DE NEXTAUTH
-- =====================================================
-- Tablas requeridas por NextAuth v5 con database sessions
-- Ejecutar DESPUÉS de 03_tables_core.sql
-- =====================================================

-- =====================================================
-- Tabla: Account (OAuth providers)
-- =====================================================
CREATE TABLE "Account" (
  id TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,

  CONSTRAINT "Account_pkey" PRIMARY KEY (id),
  CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices para Account
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key"
  ON "Account"(provider, "providerAccountId");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

COMMENT ON TABLE "Account" IS 'Cuentas OAuth vinculadas (Google, GitHub, etc.)';

-- =====================================================
-- Tabla: AuthSession (Database sessions)
-- =====================================================
CREATE TABLE "AuthSession" (
  id TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  expires TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AuthSession_pkey" PRIMARY KEY (id),
  CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices para AuthSession
CREATE UNIQUE INDEX "AuthSession_sessionToken_key" ON "AuthSession"("sessionToken");
CREATE INDEX "AuthSession_userId_idx" ON "AuthSession"("userId");
CREATE INDEX "AuthSession_expires_idx" ON "AuthSession"(expires);

COMMENT ON TABLE "AuthSession" IS 'Sesiones activas de NextAuth (database strategy)';

-- Verificar que las tablas se crearon
SELECT
  c.relname as tablename,
  pg_size_pretty(pg_total_relation_size(c.oid)) AS size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN ('Account', 'AuthSession')
ORDER BY c.relname;