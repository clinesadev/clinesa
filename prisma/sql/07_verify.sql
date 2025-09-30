-- =====================================================
-- 07_verify.sql - VERIFICACIÓN COMPLETA DEL SCHEMA
-- =====================================================
-- Ejecutar DESPUÉS de todos los scripts de creación
-- Verifica que todas las tablas, enums, índices y
-- el bucket de storage se hayan creado correctamente
-- =====================================================

-- =====================================================
-- 1. VERIFICAR ENUMS
-- =====================================================
SELECT
  'ENUMS' as check_type,
  enumtypid::regtype AS enum_name,
  array_agg(enumlabel ORDER BY enumsortorder) AS enum_values
FROM pg_enum
WHERE enumtypid::regtype::text IN ('Plan', 'CreditTransactionType', 'SessionStatus')
GROUP BY enumtypid
ORDER BY enum_name;

-- =====================================================
-- 2. VERIFICAR TABLAS CREADAS
-- =====================================================
SELECT
  'TABLES' as check_type,
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_schema = 'public'
   AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =====================================================
-- 3. VERIFICAR ÍNDICES
-- =====================================================
SELECT
  'INDEXES' as check_type,
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- 4. VERIFICAR FOREIGN KEYS
-- =====================================================
SELECT
  'FOREIGN_KEYS' as check_type,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- =====================================================
-- 5. VERIFICAR COMENTARIOS EN COLUMNAS
-- =====================================================
SELECT
  'COMMENTS' as check_type,
  c.table_name,
  c.column_name,
  pgd.description
FROM pg_catalog.pg_class cls
INNER JOIN pg_catalog.pg_namespace n ON n.oid = cls.relnamespace
INNER JOIN pg_catalog.pg_description pgd ON pgd.objoid = cls.oid
INNER JOIN information_schema.columns c ON (
  pgd.objsubid = c.ordinal_position
  AND c.table_schema = n.nspname
  AND c.table_name = cls.relname
)
WHERE n.nspname = 'public'
ORDER BY c.table_name, c.ordinal_position;

-- =====================================================
-- 6. VERIFICAR STORAGE BUCKET
-- =====================================================
SELECT
  'STORAGE_BUCKET' as check_type,
  id,
  name,
  public,
  file_size_limit,
  pg_size_pretty(file_size_limit::bigint) as max_file_size,
  array_length(allowed_mime_types, 1) as allowed_types_count,
  created_at
FROM storage.buckets
WHERE id = 'sessions-audio';

-- =====================================================
-- 7. VERIFICAR MIME TYPES DEL BUCKET
-- =====================================================
SELECT
  'STORAGE_MIME_TYPES' as check_type,
  id as bucket_id,
  unnest(allowed_mime_types) as mime_type
FROM storage.buckets
WHERE id = 'sessions-audio';

-- =====================================================
-- 8. RESUMEN FINAL
-- =====================================================
SELECT
  'SUMMARY' as check_type,
  (SELECT COUNT(*) FROM pg_type WHERE typname IN ('Plan', 'CreditTransactionType', 'SessionStatus')) as total_enums,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') as total_tables,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as total_indexes,
  (SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public') as total_foreign_keys,
  (SELECT COUNT(*) FROM storage.buckets WHERE id = 'sessions-audio') as storage_buckets;

-- =====================================================
-- VALORES ESPERADOS:
-- =====================================================
-- total_enums: 3 (Plan, CreditTransactionType, SessionStatus)
-- total_tables: 8 (User, Patient, PatientSession, Subscription, Consent, AuditLog, CreditTransaction, Account, AuthSession)
-- total_indexes: ~15+ (incluyendo PKs, unique constraints, custom indexes)
-- total_foreign_keys: 11
-- storage_buckets: 1 (sessions-audio)
-- =====================================================