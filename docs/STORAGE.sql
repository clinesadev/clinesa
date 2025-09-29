insert into storage.buckets (id, name, public)
values ('sessions-audio', 'sessions-audio', false)
on conflict (id) do nothing;

-- Ruta: userId/patientId/sessionId/filename
-- Políticas ejemplo (cuando integremos Supabase Auth):
-- create policy "own files read" on storage.objects
--   for select using (auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "own files write" on storage.objects
--   for insert with check (auth.uid()::text = (storage.foldername(name))[1]);

-- Mientras usemos NextAuth/Prisma:
-- Subir desde servidor con SERVICE_ROLE y emitir URLs firmadas temporales.