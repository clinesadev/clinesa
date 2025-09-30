-- =====================================================
-- 02_enums.sql - CREAR ENUMS
-- =====================================================
-- Ejecutar PRIMERO, antes de crear las tablas
-- Los enums deben existir antes de usarlos en las tablas
-- =====================================================

-- Plan de suscripción
CREATE TYPE "Plan" AS ENUM (
  'SOLO',
  'PRACTICE',
  'PROFESSIONAL'
);

-- Tipo de transacción de créditos
CREATE TYPE "CreditTransactionType" AS ENUM (
  'GRANT',      -- Créditos añadidos (suscripción, compra)
  'CONSUME',    -- Créditos consumidos (análisis IA)
  'REFUND',     -- Reembolso
  'ADJUSTMENT'  -- Ajuste manual
);

-- Estado de sesión de paciente
CREATE TYPE "SessionStatus" AS ENUM (
  'DRAFT',      -- Borrador, sin procesar
  'PROCESSING', -- En proceso de transcripción/análisis
  'READY',      -- Completada, lista para visualizar
  'ERROR'       -- Error en el procesamiento
);

-- Verificar que se crearon correctamente
SELECT
  typname as enum_name,
  array_agg(enumlabel ORDER BY enumsortorder) as values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname IN ('Plan', 'CreditTransactionType', 'SessionStatus')
GROUP BY typname
ORDER BY typname;