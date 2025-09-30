-- =====================================================
-- 01_reset.sql - ELIMINAR TODO (usar con precaución)
-- =====================================================
-- Este archivo elimina TODAS las tablas, enums y el bucket de storage
-- Ejecutar SOLO si quieres empezar desde cero
-- ⚠️ ESTO BORRARÁ TODOS LOS DATOS ⚠️
-- =====================================================

-- Eliminar tablas (en orden inverso por dependencias)
DROP TABLE IF EXISTS "CreditTransaction" CASCADE;
DROP TABLE IF EXISTS "AuditLog" CASCADE;
DROP TABLE IF EXISTS "Consent" CASCADE;
DROP TABLE IF EXISTS "Subscription" CASCADE;
DROP TABLE IF EXISTS "PatientSession" CASCADE;
DROP TABLE IF EXISTS "Patient" CASCADE;
DROP TABLE IF EXISTS "AuthSession" CASCADE;
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Eliminar enums
DROP TYPE IF EXISTS "SessionStatus";
DROP TYPE IF EXISTS "CreditTransactionType";
DROP TYPE IF EXISTS "Plan";

-- Eliminar bucket de storage (si existe)
DELETE FROM storage.objects WHERE bucket_id = 'sessions-audio';
DELETE FROM storage.buckets WHERE id = 'sessions-audio';

-- Verificar que todo se eliminó
SELECT
  'Tables' as type,
  COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('User', 'Patient', 'PatientSession', 'Subscription', 'Consent', 'AuditLog', 'Account', 'AuthSession', 'CreditTransaction')

UNION ALL

SELECT
  'Enums' as type,
  COUNT(*) as count
FROM pg_type
WHERE typname IN ('Plan', 'CreditTransactionType', 'SessionStatus')

UNION ALL

SELECT
  'Buckets' as type,
  COUNT(*) as count
FROM storage.buckets
WHERE id = 'sessions-audio';

-- Resultado esperado: todas las filas deben tener count = 0