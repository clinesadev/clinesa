-- =====================================================
-- 06_storage.sql - SUPABASE STORAGE BUCKET
-- =====================================================
-- Bucket privado para archivos de audio de sesiones
-- Ejecutar DESPUÉS de todas las tablas
-- =====================================================

-- =====================================================
-- Crear bucket privado para audio
-- =====================================================
-- Nota: Si el bucket ya existe, este INSERT fallará silenciosamente
-- debido a ON CONFLICT DO NOTHING
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'sessions-audio',
  'sessions-audio',
  false,                     -- Bucket privado
  52428800,                  -- 50 MB por archivo
  ARRAY[
    'audio/mpeg',            -- .mp3
    'audio/mp4',             -- .m4a, .mp4
    'audio/wav',             -- .wav
    'audio/webm',            -- .webm
    'audio/ogg',             -- .ogg
    'audio/x-m4a'            -- .m4a (alternativo)
  ]::text[]
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Estructura de rutas:
-- sessions-audio/
--   ├── {userId}/
--   │   ├── {patientId}/
--   │   │   ├── {sessionId}/
--   │   │   │   ├── {randomId}-audio.mp3
--   │   │   │   └── {randomId}-audio.wav
-- =====================================================

-- ⚠️ IMPORTANTE: No configuramos RLS policies porque:
-- 1. Usamos NextAuth (no Supabase Auth)
-- 2. Todo el acceso es vía servidor con SERVICE_ROLE_KEY
-- 3. Generamos URLs firmadas temporales para upload/download

-- Si en el futuro integramos Supabase Auth, añadir policies:
-- CREATE POLICY "Users can upload own files"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'sessions-audio' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Users can read own files"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'sessions-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Verificar que el bucket se creó
SELECT
  id,
  name,
  public,
  file_size_limit,
  pg_size_pretty(file_size_limit::bigint) as max_file_size,
  array_length(allowed_mime_types, 1) as allowed_types_count,
  created_at
FROM storage.buckets
WHERE id = 'sessions-audio';

-- Ver tipos MIME permitidos
SELECT
  id,
  unnest(allowed_mime_types) as mime_type
FROM storage.buckets
WHERE id = 'sessions-audio';