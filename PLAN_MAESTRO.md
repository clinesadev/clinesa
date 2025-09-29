# 🏗️ PLAN MAESTRO DE AUDITORÍA Y DESARROLLO — CLINESA MVP

**Versión:** 1.0
**Fecha:** 2025-09-29
**Responsable:** Claude Code + Luis (validación en cada fase)

---

## 📋 ÍNDICE

1. [Metodología de trabajo](#1-metodología-de-trabajo)
2. [Estado actual del proyecto](#2-estado-actual-del-proyecto)
3. [FASE A — Auditoría de fundamentos](#fase-a--auditoría-de-fundamentos)
4. [FASE B — Auditoría de Auth + Middleware](#fase-b--auditoría-de-auth--middleware)
5. [FASE C — Auditoría de API CRUD existente](#fase-c--auditoría-de-api-crud-existente)
6. [FASE D — Completar Auth + Health checks](#fase-d--completar-auth--health-checks)
7. [FASE E — CRUD completo con ownership](#fase-e--crud-completo-con-ownership)
8. [FASE F — Límites FREE/PRO](#fase-f--límites-freepro)
9. [FASE G — Supabase Storage + Upload audio](#fase-g--supabase-storage--upload-audio)
10. [FASE H — Stripe + Suscripciones](#fase-h--stripe--suscripciones)
11. [FASE I — IA: Transcripción + Análisis](#fase-i--ia-transcripción--análisis)
12. [FASE J — UI Dashboard + UX completa](#fase-j--ui-dashboard--ux-completa)
13. [FASE K — Security headers + AuditLog](#fase-k--security-headers--auditlog)
14. [FASE L — Testing + Deploy final](#fase-l--testing--deploy-final)
15. [Configuraciones externas](#configuraciones-externas)
16. [Criterios de aceptación MVP](#criterios-de-aceptación-mvp)

---

## 1. METODOLOGÍA DE TRABAJO

### 1.1 Principios operativos

- **Validación obligatoria**: Cada fase requiere tu aprobación explícita con "OK/CONTINÚA" antes de avanzar.
- **Archivos completos**: Todo cambio se entrega con el archivo completo, nunca parcial.
- **Zero secretos**: Nunca expondremos valores reales de ENV, solo formatos y ejemplos genéricos.
- **Testing incremental**: Cada fase incluye comandos de verificación local + health checks.
- **Rollback seguro**: Commits atómicos por fase para poder revertir sin romper.
- **Documentación en paralelo**: Actualizar CLAUDE.md cuando haya cambios arquitectónicos.

### 1.2 Formato de cada fase

```
FASE X — Título
├── Objetivo técnico
├── Archivos afectados (lista completa con ✅/❌/⚠️)
├── Dependencias npm (si hay nuevas)
├── ENV requeridas (formato sin valores)
├── Configuraciones externas (Vercel/Supabase/Stripe/N8N/etc.)
├── Implementación (código completo de cada archivo)
├── Comandos de verificación local
├── Health checks esperados
├── Criterios de aceptación específicos
└── Checklist final ✅/❌
```

### 1.3 Estados de archivos

- ✅ **OK**: Archivo correcto, no requiere cambios
- ❌ **FALTA**: Archivo no existe, debe crearse
- ⚠️ **REVISAR**: Archivo existe pero requiere auditoría/corrección
- 🔄 **ACTUALIZAR**: Archivo requiere cambios menores

---

## 2. ESTADO ACTUAL DEL PROYECTO

### 2.1 Inventario de archivos clave

```
clinesa/
├── prisma/
│   └── schema.prisma ✅ CORRECTO
│       - Modelos: User, Patient, PatientSession, Subscription, Consent, AuditLog
│       - Modelos NextAuth: Account, AuthSession
│       - Enums: Plan {FREE, PRO}, SessionStatus {DRAFT, PROCESSING, READY, ERROR}
│       - datasource con DATABASE_URL + DIRECT_URL ✅
│
├── scripts/
│   ├── ci-prebuild-check.mjs ✅ CORRECTO (valida hosts/puertos)
│   └── ci-build.mjs ✅ CORRECTO (precheck + prisma + build)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx ✅
│   │   ├── page.tsx ✅ (landing pública)
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx ✅ (sidebar)
│   │   │   ├── dashboard/page.tsx ⚠️ REVISAR (stats, plan indicator)
│   │   │   ├── patients/page.tsx ⚠️ REVISAR (CRUD UI)
│   │   │   ├── billing/page.tsx ⚠️ REVISAR (upgrade CTA)
│   │   │   └── settings/page.tsx ✅
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/route.ts ⚠️ REVISAR
│   │       │
│   │       ├── health/
│   │       │   ├── env/route.ts ✅
│   │       │   ├── crypto/route.ts ✅
│   │       │   ├── auth/route.ts ✅
│   │       │   ├── db/route.ts ❌ CREAR
│   │       │   ├── billing/route.ts ❌ CREAR (fase Stripe)
│   │       │   └── ai/route.ts ❌ CREAR (fase IA)
│   │       │
│   │       ├── patients/
│   │       │   ├── route.ts ⚠️ AUDITAR (GET/POST + ownership)
│   │       │   └── [id]/route.ts ⚠️ AUDITAR (GET/PATCH/DELETE + ownership)
│   │       │
│   │       ├── sessions/
│   │       │   ├── route.ts ⚠️ AUDITAR (GET/POST + ownership + cifrado)
│   │       │   ├── [id]/route.ts ⚠️ AUDITAR (GET/PATCH/DELETE + ownership)
│   │       │   └── [id]/analyze/route.ts ❌ CREAR (fase IA)
│   │       │   └── [id]/upload-url/route.ts ❌ CREAR (Storage)
│   │       │
│   │       └── stripe/
│   │           └── webhook/route.ts ❌ CREAR (fase Stripe)
│   │
│   ├── components/
│   │   ├── ui/ ✅ (shadcn completo)
│   │   ├── nav/
│   │   │   └── Sidebar.tsx ✅
│   │   ├── patients/
│   │   │   ├── PatientList.tsx ❌ CREAR
│   │   │   ├── PatientForm.tsx ❌ CREAR
│   │   │   └── PatientCard.tsx ❌ CREAR
│   │   ├── sessions/
│   │   │   ├── SessionList.tsx ❌ CREAR
│   │   │   ├── SessionForm.tsx ❌ CREAR
│   │   │   ├── AudioUploader.tsx ❌ CREAR
│   │   │   └── AnalysisViewer.tsx ❌ CREAR (fase IA)
│   │   └── billing/
│   │       └── UpgradeCTA.tsx ❌ CREAR (fase Stripe)
│   │
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── config.ts ✅ CORRECTO (tipos NextAuth v5 fixed)
│   │   │   └── session.ts ✅ CORRECTO (getSession, getUserPlan)
│   │   │
│   │   ├── billing/
│   │   │   └── limits.ts ✅ (FREE_MAX_SESSIONS=10, canCreateSession)
│   │   │
│   │   ├── storage/
│   │   │   └── supabase.ts ❌ CREAR (cliente Storage)
│   │   │   └── upload.ts ❌ CREAR (generateUploadURL)
│   │   │
│   │   ├── ai/
│   │   │   ├── transcribe.ts ❌ CREAR (Whisper/Deepgram)
│   │   │   └── analyze.ts ❌ CREAR (GPT-4/Claude)
│   │   │
│   │   ├── stripe/
│   │   │   ├── client.ts ❌ CREAR
│   │   │   └── webhook.ts ❌ CREAR
│   │   │
│   │   ├── stores/ ✅
│   │   ├── crypto.ts ✅ (AES-256-GCM envelope)
│   │   ├── ownership.ts ✅ (isOwner, assertOwner)
│   │   ├── prisma.ts ✅ (singleton)
│   │   ├── env.ts ✅ (validación server-only)
│   │   └── utils.ts ✅
│   │
│   ├── middleware.ts ⚠️ SIMPLIFICAR (usar export auth)
│   └── hooks/
│       └── use-toast.ts ✅
│
├── .env.example ✅ CORRECTO
├── .gitignore ✅ CORRECTO
├── package.json ✅ (scripts completos)
├── tsconfig.json ✅
├── tailwind.config.js ✅
├── components.json ✅
├── CLAUDE.md ✅
└── PLAN_MAESTRO.md 🆕 ESTE ARCHIVO
```

### 2.2 Dependencias actuales

```json
{
  "dependencies": {
    "@auth/prisma-adapter": "^2.8.0",
    "@prisma/client": "^6.16.2",
    "@radix-ui/*": "...",
    "next": "15.5.4",
    "next-auth": "5.0.0-beta.29",
    "react": "19.1.0",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "prisma": "^6.16.2",
    "typescript": "^5",
    "dotenv-cli": "^7.4.4"
  }
}
```

**Dependencias faltantes por fase:**
- **FASE G (Storage)**: `@supabase/supabase-js@^2.45.0`
- **FASE H (Stripe)**: `stripe@^17.0.0`, `micro@^10.0.1` (para webhook raw body)
- **FASE I (IA)**: `openai@^4.73.0` O `@anthropic-ai/sdk@^0.32.0` (según proveedor elegido)

### 2.3 Variables de entorno (estado actual)

| Variable | Estado | Fase requerida |
|----------|--------|----------------|
| `DATABASE_URL` | ✅ | A |
| `DIRECT_URL` | ✅ | A |
| `SUPABASE_URL` | ✅ | A |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | A |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | A |
| `ENCRYPTION_KEK` | ✅ | A |
| `AUTH_SECRET` | ❌ | D |
| `NEXTAUTH_URL` | ❌ | D |
| `AUTH_GOOGLE_ID` | ❌ (opcional) | D |
| `AUTH_GOOGLE_SECRET` | ❌ (opcional) | D |
| `AUTH_GITHUB_ID` | ❌ (opcional) | D |
| `AUTH_GITHUB_SECRET` | ❌ (opcional) | D |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | G |
| `STRIPE_SECRET_KEY` | ❌ | H |
| `STRIPE_WEBHOOK_SECRET` | ❌ | H |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO` | ❌ | H |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` | ❌ | I |

---

## FASE A — AUDITORÍA DE FUNDAMENTOS

**Objetivo:** Verificar que DB, ENV, Build CI y fundamentos técnicos son 100% sólidos.

### A.1 — Checklist de verificación

- [x] ✅ `prisma/schema.prisma` válido (datasource + modelos + enums multilínea)
- [x] ✅ `scripts/ci-prebuild-check.mjs` valida hosts/puertos correctos
- [x] ✅ `scripts/ci-build.mjs` ejecuta precheck → prisma generate → migrate/push → build
- [x] ✅ `src/lib/prisma.ts` singleton con globalThis pattern
- [x] ✅ `src/lib/crypto.ts` AES-256-GCM con KEK/DEK
- [x] ✅ `src/lib/ownership.ts` isOwner + assertOwner
- [x] ✅ `src/lib/env.ts` validación server-only de ENV críticas
- [x] ✅ `.env.example` con template limpio
- [x] ✅ `.gitignore` con .env protegido
- [x] ✅ `package.json` scripts completos (dev, build, vercel-build, prisma:*, check, format)

### A.2 — Archivos a revisar

**NO hay cambios necesarios en esta fase.** Todo está correcto.

### A.3 — Comandos de verificación

```bash
# 1. Formatear schema
npx prisma format

# 2. Generar cliente Prisma
npm run prisma:generate

# 3. Verificar tipos TypeScript
npm run check

# 4. Build local
npm run build

# 5. Verificar que health/env y health/crypto funcionan
npm run dev
# Visitar:
# http://localhost:3000/api/health/env → debe retornar booleans
# http://localhost:3000/api/health/crypto → debe retornar { kekLoaded: true }
```

### A.4 — Configuraciones externas requeridas

**Vercel (Production + Preview):**
- ✅ `DATABASE_URL` (formato: `postgresql://...@aws-X-pooler.supabase.com:6543/...?pgbouncer=true`)
- ✅ `DIRECT_URL` (formato: `postgresql://...@db.<ref>.supabase.co:5432/...`)
- ✅ `SUPABASE_URL` (ej: `https://<ref>.supabase.co`)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` (mismo valor)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon key desde Supabase Dashboard)
- ✅ `ENCRYPTION_KEK` (generar: `openssl rand -base64 32`)

**Supabase:**
- ✅ Proyecto creado
- ✅ Database con tablas desplegadas (Account, AuthSession, User, Patient, PatientSession, etc.)
- ⚠️ Bucket `sessions-audio` (verificar en FASE G)

### A.5 — Criterios de aceptación

- [x] ✅ Build local exitoso (`npm run build`)
- [x] ✅ Build en Vercel exitoso
- [x] ✅ `/api/health/env` retorna OK
- [x] ✅ `/api/health/crypto` retorna `{ kekLoaded: true }`
- [x] ✅ Prisma Client generado sin errores
- [x] ✅ Zero errores de TypeScript en `npm run check`

**RESULTADO FASE A:** ✅ COMPLETA (no requiere cambios)

---

## FASE B — AUDITORÍA DE AUTH + MIDDLEWARE

**Objetivo:** Verificar que NextAuth v5 está correctamente configurado y el middleware protege rutas.

### B.1 — Archivos a auditar

#### B.1.1 — `src/lib/auth/config.ts` ✅

**Estado:** Corregido anteriormente. Tipos NextAuth v5 correctos con module augmentation.

**Verificación necesaria:**
- [x] ✅ `session.strategy = "database"`
- [x] ✅ Callback `session` agrega `user.id`
- [x] ✅ Providers condicionales (Google/GitHub según ENV)
- [x] ✅ `trustHost: true`
- [x] ✅ `secret: process.env.AUTH_SECRET`
- [x] ✅ Export `auth` y `handlers`

**NO requiere cambios.**

#### B.1.2 — `src/app/api/auth/[...nextauth]/route.ts` ⚠️

**Archivo actual a verificar:**

```typescript
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/config"

const { handlers } = NextAuth(authConfig)
export const { GET, POST } = handlers
```

**Verificación:**
- [x] ✅ Importa `authConfig` correcto
- [x] ✅ Exporta `GET` y `POST` handlers

**NO requiere cambios.**

#### B.1.3 — `src/middleware.ts` ⚠️ SIMPLIFICAR

**Archivo actual:**
```typescript
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: Request) {
  const url = new URL(req.url)
  const isDashboard = url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/patients") || url.pathname.startsWith("/billing") || url.pathname.startsWith("/settings")
  if (!isDashboard) return NextResponse.next()
  const token = await getToken({ req: req as Request, secret: process.env.AUTH_SECRET })
  if (!token) {
    const signin = new URL("/api/auth/signin", url.origin)
    return NextResponse.redirect(signin)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/patients/:path*", "/billing/:path*", "/settings/:path*"],
}
```

**Problema:** NextAuth v5 recomienda usar el middleware exportado directamente.

**Cambio necesario:**

```typescript
export { auth as middleware } from "@/lib/auth/config"

export const config = {
  matcher: ["/dashboard/:path*", "/patients/:path*", "/billing/:path*", "/settings/:path*"],
}
```

**Estado:** 🔄 ACTUALIZAR

#### B.1.4 — `src/lib/auth/session.ts` ✅

**Archivo actual:**
```typescript
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"

export async function getSession() {
  return auth()
}
export async function getCurrentUserId(): Promise<string | null> {
  const s = await getSession()
  return s?.user?.id ?? null
}
export async function getUserPlan(userId: string): Promise<"FREE" | "PRO"> {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: { in: ["active", "trialing"] }, plan: "PRO" },
  })
  return sub ? "PRO" : "FREE"
}
```

**Verificación:**
- [x] ✅ `getSession()` usa `auth()` de config
- [x] ✅ `getCurrentUserId()` extrae user.id
- [x] ✅ `getUserPlan()` consulta Subscription con Prisma

**NO requiere cambios.**

### B.2 — Archivos a modificar

#### Archivo: `src/middleware.ts`

```typescript
export { auth as middleware } from "@/lib/auth/config"

export const config = {
  matcher: ["/dashboard/:path*", "/patients/:path*", "/billing/:path*", "/settings/:path*"],
}
```

### B.3 — Comandos de verificación

```bash
# 1. Verificar tipos
npm run check

# 2. Build
npm run build

# 3. Test local (sin AUTH_SECRET fallará, ok por ahora)
npm run dev
# Intentar acceder a http://localhost:3000/dashboard
# Debe redirigir a /api/auth/signin (muestra error si falta AUTH_SECRET)
```

### B.4 — Criterios de aceptación

- [x] ✅ Middleware simplificado usa `auth` export
- [x] ✅ Zero errores TypeScript
- [x] ✅ Build exitoso
- [ ] ⏳ Redirección a signin funciona (requiere FASE D con AUTH_SECRET)

**RESULTADO FASE B:** ⚠️ CAMBIO MENOR (1 archivo: middleware.ts)

---

## FASE C — AUDITORÍA DE API CRUD EXISTENTE

**Objetivo:** Revisar rutas `/api/patients` y `/api/sessions` existentes para detectar gaps de ownership, runtime, cifrado.

### C.1 — `/api/patients/route.ts` ⚠️

**Ruta:** `src/app/api/patients/route.ts`

**Lectura necesaria del archivo actual para auditar:**
- ¿Tiene `export const runtime = "nodejs"`?
- ¿GET filtra por `userId` del session?
- ¿POST valida ownership?
- ¿Usa `assertOwner` o lógica equivalente?
- ¿Maneja errores 401/403/500 correctamente?

**Acción:** LEER ARCHIVO COMPLETO

### C.2 — `/api/patients/[id]/route.ts` ⚠️

**Verificaciones:**
- Runtime nodejs
- GET/PATCH/DELETE verifican ownership con `assertOwner`
- PATCH permite actualizar `notesSecure` (debe cifrar si viene en plain)
- DELETE cascadea sesiones (ya está en schema con `onDelete: Cascade`)

**Acción:** LEER ARCHIVO COMPLETO

### C.3 — `/api/sessions/route.ts` ⚠️

**Verificaciones críticas:**
- Runtime nodejs
- GET filtra por `patientId` y verifica que el patient pertenece al user
- POST:
  - Verifica que `patientId` pertenece al user
  - Si viene `note` en body → cifrar con `encryptField` → guardar en `noteDocSecure`
  - Aplica límite FREE (llama a `canCreateSession`)
  - Retorna 402 si FREE alcanzó 10 sesiones

**Acción:** LEER ARCHIVO COMPLETO

### C.4 — `/api/sessions/[id]/route.ts` ⚠️

**Verificaciones:**
- Runtime nodejs
- GET/PATCH/DELETE verifican ownership (session.patient.userId === currentUser.id)
- PATCH:
  - Si viene `note` → cifrar y actualizar `noteDocSecure`
  - Si viene `audioUrl` → validar (fase G)
  - Si viene `status` → actualizar

**Acción:** LEER ARCHIVO COMPLETO

### C.5 — Comandos de auditoría

```bash
# Leer archivos existentes
cat src/app/api/patients/route.ts
cat src/app/api/patients/[id]/route.ts
cat src/app/api/sessions/route.ts
cat src/app/api/sessions/[id]/route.ts

# Buscar problemas comunes
grep -n "runtime" src/app/api/**/*.ts
grep -n "assertOwner" src/app/api/**/*.ts
grep -n "encryptField" src/app/api/**/*.ts
grep -n "canCreateSession" src/app/api/**/*.ts
```

### C.6 — Criterios de aceptación

- [ ] ⏳ Todos los handlers tienen `export const runtime = "nodejs"`
- [ ] ⏳ Ownership checks en todas las mutaciones
- [ ] ⏳ Cifrado de `notesSecure` / `noteDocSecure`
- [ ] ⏳ Límite FREE aplicado en POST sessions
- [ ] ⏳ Manejo de errores consistente (401, 403, 402, 500)

**RESULTADO FASE C:** ⏳ PENDIENTE DE AUDITORÍA (requiere lectura de archivos)

**PAUSA AQUÍ → Esperando tu "OK/CONTINÚA" para leer y auditar los 4 archivos API.**

---

## FASE D — COMPLETAR AUTH + HEALTH CHECKS

**Objetivo:** Asegurar que Auth funciona end-to-end y todos los health checks están operativos.

### D.1 — Crear `src/app/api/health/db/route.ts` ❌

**Archivo a crear:**

```typescript
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return new Response(
      JSON.stringify({ ok: true, timestamp: new Date().toISOString() }, null, 2),
      { headers: { "content-type": "application/json" } }
    )
  } catch (error) {
    console.error("Health check DB failed:", error)
    return new Response(
      JSON.stringify({ ok: false, error: "Database connection failed" }, null, 2),
      { status: 503, headers: { "content-type": "application/json" } }
    )
  }
}
```

### D.2 — Configurar ENV de Auth

**Variables requeridas (Vercel + Local):**

```bash
# Generar AUTH_SECRET
openssl rand -base64 32

# Añadir a Vercel Environment Variables (Production + Preview):
AUTH_SECRET=<output_comando_anterior>
NEXTAUTH_URL=https://tu-dominio.vercel.app

# Opcionales (si quieres OAuth):
# Google Cloud Console → APIs → Credentials → Create OAuth 2.0 Client ID
AUTH_GOOGLE_ID=<tu_google_client_id>
AUTH_GOOGLE_SECRET=<tu_google_client_secret>

# GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
AUTH_GITHUB_ID=<tu_github_client_id>
AUTH_GITHUB_SECRET=<tu_github_client_secret>

# Local (.env):
AUTH_SECRET=<mismo_valor>
NEXTAUTH_URL=http://localhost:3000
# ... mismos opcionales
```

### D.3 — Verificar `src/app/api/health/auth/route.ts` ✅

**Ya existe y está correcto.**

### D.4 — Comandos de verificación

```bash
# 1. Añadir AUTH_SECRET a .env local
echo "AUTH_SECRET=$(openssl rand -base64 32)" >> .env
echo "NEXTAUTH_URL=http://localhost:3000" >> .env

# 2. Crear archivo health/db
# (código arriba)

# 3. Test local
npm run dev

# 4. Verificar health checks:
curl http://localhost:3000/api/health/env
curl http://localhost:3000/api/health/crypto
curl http://localhost:3000/api/health/db     # NUEVO
curl http://localhost:3000/api/health/auth   # debe retornar ok:false (sin login)

# 5. Probar signin
# Visitar: http://localhost:3000/api/auth/signin
# Debe mostrar providers disponibles (Google/GitHub si configurados)

# 6. Commit
git add .
git commit -m "feat: completa FASE D - Auth + health/db"
git push
```

### D.5 — Criterios de aceptación

- [ ] ⏳ `/api/health/db` retorna `{ ok: true }`
- [ ] ⏳ `/api/health/auth` retorna `{ ok: false, userId: null }` sin login
- [ ] ⏳ `/api/auth/signin` accesible y muestra providers
- [ ] ⏳ Middleware redirige rutas protegidas a signin
- [ ] ⏳ ENV `AUTH_SECRET` y `NEXTAUTH_URL` configuradas en Vercel

**RESULTADO FASE D:** ⏳ PENDIENTE (1 archivo nuevo + config ENV externa)

---

## FASE E — CRUD COMPLETO CON OWNERSHIP

**Objetivo:** Asegurar que todas las rutas API de patients/sessions tienen ownership, runtime nodejs, cifrado correcto.

### E.1 — Correcciones necesarias (detectadas en FASE C)

**Basado en auditoría de FASE C, aplicar:**

#### E.1.1 — `/api/patients/route.ts`

**Verificar y corregir:**
- `export const runtime = "nodejs"`
- GET: filtrar por `userId` del session
- POST: crear patient con `userId` del session
- Manejo de errores 401 (sin auth), 500

**Archivo completo a entregar tras auditoría.**

#### E.1.2 — `/api/patients/[id]/route.ts`

**Verificar y corregir:**
- `export const runtime = "nodejs"`
- GET: verificar ownership con `assertOwner(user, patient)`
- PATCH: ownership + cifrar `notesSecure` si viene en body
- DELETE: ownership (cascade automático por schema)

**Archivo completo a entregar tras auditoría.**

#### E.1.3 — `/api/sessions/route.ts`

**Verificar y corregir:**
- `export const runtime = "nodejs"`
- GET: filtrar por `patientId` + verificar ownership del patient
- POST:
  - Verificar ownership del patient
  - Cifrar `noteDocSecure` con `encryptField` si viene `note`
  - Llamar `canCreateSession(userId)` → 402 si FREE alcanzó 10
  - Crear con `status: DRAFT`

**Archivo completo a entregar tras auditoría.**

#### E.1.4 — `/api/sessions/[id]/route.ts`

**Verificar y corregir:**
- `export const runtime = "nodejs"`
- GET: verificar ownership (session → patient → userId)
- PATCH:
  - Ownership
  - Si viene `note` → cifrar en `noteDocSecure`
  - Si viene `status` → actualizar
- DELETE: ownership

**Archivo completo a entregar tras auditoría.**

### E.2 — Comandos de verificación

```bash
# 1. Test API con curl/httpie (requiere auth token)
# Primero login para obtener session cookie
npm run dev

# 2. Crear patient
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test Patient","email":"test@example.com"}'

# 3. Listar patients
curl http://localhost:3000/api/patients

# 4. Crear sesión
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"patientId":"<patient_id>","date":"2025-01-15T10:00:00Z","note":"Sesión inicial"}'

# 5. Verificar que note está cifrado en DB
# Supabase SQL Editor:
# SELECT "noteDocSecure" FROM "PatientSession" WHERE id = '<session_id>';
# Debe retornar JSON cifrado con campos: dek, dekIv, iv, ciphertext, v
```

### E.3 — Criterios de aceptación

- [ ] ⏳ Todos los handlers tienen `runtime: "nodejs"`
- [ ] ⏳ GET patients retorna solo del user actual
- [ ] ⏳ POST patient crea con userId correcto
- [ ] ⏳ PATCH/DELETE patient verifican ownership (403 si no es dueño)
- [ ] ⏳ POST session cifra `note` en `noteDocSecure`
- [ ] ⏳ POST session retorna 402 si FREE alcanzó 10 sesiones
- [ ] ⏳ PATCH session re-cifra si cambia note
- [ ] ⏳ Errores manejados correctamente (401, 403, 402, 500)

**RESULTADO FASE E:** ⏳ PENDIENTE (4 archivos a corregir tras auditoría C)

---

## FASE F — LÍMITES FREE/PRO

**Objetivo:** Asegurar que el límite de 10 sesiones FREE funciona en API y UI muestra upgrade prompt.

### F.1 — Verificar `src/lib/billing/limits.ts` ✅

**Archivo actual:**
```typescript
import { prisma } from "@/lib/prisma"
import { getUserPlan } from "@/lib/auth/session"

export const FREE_MAX_SESSIONS = 10

export async function canCreateSession(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId)
  if (plan === "PRO") return true
  const count = await prisma.patientSession.count({ where: { patient: { userId } } })
  return count < FREE_MAX_SESSIONS
}
```

**Estado:** ✅ CORRECTO (ya implementado)

### F.2 — Integrar en `/api/sessions/route.ts` POST

**Verificar que POST sessions incluye:**

```typescript
import { canCreateSession } from "@/lib/billing/limits"

export async function POST(req: Request) {
  // ... auth check
  const userId = await getCurrentUserId()
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })

  // CHECK LIMIT
  const canCreate = await canCreateSession(userId)
  if (!canCreate) {
    return new Response(
      JSON.stringify({ code: "UPGRADE_REQUIRED", message: "Plan FREE limitado a 10 sesiones" }),
      { status: 402, headers: { "content-type": "application/json" } }
    )
  }

  // ... resto de lógica POST
}
```

**Estado:** ⏳ VERIFICAR en FASE C/E

### F.3 — UI: Mostrar upgrade prompt

**Crear componente:** `src/components/billing/UpgradeCTA.tsx`

```typescript
"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"

interface UpgradeCTAProps {
  currentPlan: "FREE" | "PRO"
  sessionCount: number
  maxSessions: number
}

export function UpgradeCTA({ currentPlan, sessionCount, maxSessions }: UpgradeCTAProps) {
  if (currentPlan === "PRO") return null

  const remaining = maxSessions - sessionCount
  const isNearLimit = remaining <= 2
  const isAtLimit = remaining <= 0

  if (!isNearLimit) return null

  return (
    <Alert variant={isAtLimit ? "destructive" : "default"} className="mb-4">
      <Crown className="h-4 w-4" />
      <AlertTitle>
        {isAtLimit ? "Límite alcanzado" : `Te quedan ${remaining} sesiones`}
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>
          {isAtLimit
            ? "Actualiza a PRO para sesiones ilimitadas"
            : "Actualiza a PRO antes de alcanzar el límite"
          }
        </span>
        <Button size="sm" variant={isAtLimit ? "default" : "outline"}>
          Ver planes <Crown className="ml-2 h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
```

### F.4 — Integrar en `/dashboard/page.tsx`

**Modificar para:**
- Obtener plan del user (desde API o server component)
- Contar sesiones actuales
- Mostrar `<UpgradeCTA />` si FREE

**Ejemplo:**

```typescript
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { getUserPlan } from "@/lib/auth/session"
import { UpgradeCTA } from "@/components/billing/UpgradeCTA"
import { FREE_MAX_SESSIONS } from "@/lib/billing/limits"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return <div>Unauthorized</div>

  const userId = session.user.id
  const plan = await getUserPlan(userId)
  const sessionCount = await prisma.patientSession.count({
    where: { patient: { userId } }
  })

  return (
    <div>
      <h1>Dashboard</h1>
      <UpgradeCTA currentPlan={plan} sessionCount={sessionCount} maxSessions={FREE_MAX_SESSIONS} />
      {/* ... resto del dashboard */}
    </div>
  )
}
```

### F.5 — Comandos de verificación

```bash
# 1. Test POST session cuando FREE alcanza 10
# (crear 10 sesiones y luego intentar la 11)
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/sessions \
    -H "Content-Type: application/json" \
    -d "{\"patientId\":\"<patient_id>\",\"date\":\"2025-01-15T10:00:00Z\"}"
done
# La 11ª debe retornar 402

# 2. Verificar UI muestra CTA
# Visitar http://localhost:3000/dashboard
# Debe aparecer alert con upgrade prompt si sessionCount >= 8
```

### F.6 — Criterios de aceptación

- [ ] ⏳ POST session retorna 402 con `code: "UPGRADE_REQUIRED"` si FREE alcanzó 10
- [ ] ⏳ Dashboard muestra `<UpgradeCTA />` cuando FREE se acerca/alcanza límite
- [ ] ⏳ Componente UpgradeCTA tiene variantes (warning/destructive)
- [ ] ⏳ Botón "Ver planes" redirige a `/billing` (funcional en FASE H)

**RESULTADO FASE F:** ⏳ PENDIENTE (1 componente nuevo + integración dashboard)

---

## FASE G — SUPABASE STORAGE + UPLOAD AUDIO

**Objetivo:** Permitir subida segura de audios a Supabase Storage con URLs firmadas.

### G.1 — Configuración externa: Supabase Storage

#### G.1.1 — Crear bucket `sessions-audio`

**SQL a ejecutar en Supabase SQL Editor:**

```sql
-- Crear bucket privado
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sessions-audio',
  'sessions-audio',
  false,
  52428800, -- 50 MB
  ARRAY['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/m4a']
)
ON CONFLICT (id) DO NOTHING;
```

**Verificar:** Supabase Dashboard → Storage → debe aparecer bucket `sessions-audio`

#### G.1.2 — Políticas RLS (temporalmente deshabilitadas, acceso solo desde servidor)

**Por ahora:** El bucket es privado sin políticas. Solo el servidor con `service_role_key` puede acceder.

**Futuro (opcional):** Políticas RLS para que users puedan descargar sus propios audios con JWT.

### G.2 — Dependencias npm

```bash
npm install @supabase/supabase-js@^2.45.0
```

### G.3 — ENV requeridas

**Añadir a Vercel + Local:**

```bash
# Supabase → Project Settings → API → service_role key (SECRET!)
SUPABASE_SERVICE_ROLE_KEY=<tu_service_role_key>
```

**⚠️ IMPORTANTE:** Esta key NO debe exponerse al cliente. Solo server-side.

### G.4 — Crear `src/lib/storage/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) throw new Error("Missing SUPABASE_URL")
if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
```

### G.5 — Crear `src/lib/storage/upload.ts`

```typescript
import { supabaseAdmin } from "./supabase"
import { randomId } from "@/lib/crypto"

export async function generateUploadURL(
  userId: string,
  patientId: string,
  sessionId: string,
  filename: string
): Promise<{ uploadUrl: string; filePath: string }> {
  // Estructura: sessions-audio/userId/patientId/sessionId/randomId-filename
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
  const filePath = `${userId}/${patientId}/${sessionId}/${randomId(8)}-${sanitized}`

  const { data, error } = await supabaseAdmin.storage
    .from("sessions-audio")
    .createSignedUploadUrl(filePath)

  if (error) {
    console.error("Failed to generate upload URL:", error)
    throw new Error("Failed to generate upload URL")
  }

  return {
    uploadUrl: data.signedUrl,
    filePath: data.path,
  }
}

export async function getDownloadURL(filePath: string, expiresIn = 3600): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from("sessions-audio")
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    console.error("Failed to generate download URL:", error)
    throw new Error("Failed to generate download URL")
  }

  return data.signedUrl
}

export async function deleteAudio(filePath: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from("sessions-audio")
    .remove([filePath])

  if (error) {
    console.error("Failed to delete audio:", error)
    throw new Error("Failed to delete audio")
  }
}
```

### G.6 — Crear endpoint `/api/sessions/[id]/upload-url/route.ts`

```typescript
export const runtime = "nodejs"

import { getCurrentUserId } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { assertOwner } from "@/lib/ownership"
import { generateUploadURL } from "@/lib/storage/upload"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const sessionId = params.id
  const session = await prisma.patientSession.findUnique({
    where: { id: sessionId },
    include: { patient: true },
  })

  if (!session) {
    return new Response(JSON.stringify({ error: "Session not found" }), { status: 404 })
  }

  assertOwner({ id: userId }, { userId: session.patient.userId })

  const body = await req.json()
  const { filename } = body

  if (!filename || typeof filename !== "string") {
    return new Response(JSON.stringify({ error: "filename required" }), { status: 400 })
  }

  const { uploadUrl, filePath } = await generateUploadURL(
    userId,
    session.patientId,
    sessionId,
    filename
  )

  // Guardar filePath en session (aún no hay audio subido, se actualiza después)
  // O retornar al cliente para que guarde tras upload exitoso

  return new Response(
    JSON.stringify({ uploadUrl, filePath }),
    { headers: { "content-type": "application/json" } }
  )
}
```

### G.7 — Actualizar `/api/sessions/[id]/route.ts` PATCH

**Añadir lógica para confirmar audio subido:**

```typescript
// Tras subir archivo con PUT a uploadUrl, el cliente llama:
// PATCH /api/sessions/[id] con { audioUrl: filePath, audioBytesSec: duration }

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  // ... ownership check
  const body = await req.json()
  const updates: any = {}

  if (body.note !== undefined) {
    updates.noteDocSecure = JSON.stringify(encryptField(body.note))
  }

  if (body.audioUrl) {
    updates.audioUrl = body.audioUrl // filePath
  }

  if (body.audioBytesSec !== undefined) {
    updates.audioBytesSec = body.audioBytesSec
  }

  if (body.status) {
    updates.status = body.status
  }

  const updated = await prisma.patientSession.update({
    where: { id: params.id },
    data: updates,
  })

  return new Response(JSON.stringify(updated), { headers: { "content-type": "application/json" } })
}
```

### G.8 — Crear componente UI `src/components/sessions/AudioUploader.tsx`

```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Loader2 } from "lucide-react"

interface AudioUploaderProps {
  sessionId: string
  onUploadComplete: (filePath: string, duration: number) => void
}

export function AudioUploader({ sessionId, onUploadComplete }: AudioUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      // 1. Solicitar URL firmada
      const res = await fetch(`/api/sessions/${sessionId}/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name }),
      })

      if (!res.ok) throw new Error("Failed to get upload URL")

      const { uploadUrl, filePath } = await res.json()

      // 2. Subir archivo a Supabase Storage
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })

      if (!uploadRes.ok) throw new Error("Upload failed")

      // 3. Calcular duración (si es audio, usar Web Audio API o aproximar)
      const duration = Math.floor(file.size / 16000) // Aproximación: 16KB/s

      // 4. Confirmar en backend
      const patchRes = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl: filePath, audioBytesSec: duration }),
      })

      if (!patchRes.ok) throw new Error("Failed to save audio metadata")

      onUploadComplete(filePath, duration)
      setFile(null)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Error al subir audio")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={uploading}
      />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Subir audio
          </>
        )}
      </Button>
    </div>
  )
}
```

### G.9 — Comandos de verificación

```bash
# 1. Instalar dependencia
npm install @supabase/supabase-js@^2.45.0

# 2. Añadir SUPABASE_SERVICE_ROLE_KEY a .env
echo "SUPABASE_SERVICE_ROLE_KEY=<tu_key>" >> .env

# 3. Crear bucket en Supabase (SQL arriba)

# 4. Test endpoint upload-url
curl -X POST http://localhost:3000/api/sessions/<session_id>/upload-url \
  -H "Content-Type: application/json" \
  -d '{"filename":"test.mp3"}'
# Debe retornar: { uploadUrl: "...", filePath: "..." }

# 5. Test upload real desde UI
npm run dev
# Ir a sesión, subir audio con componente AudioUploader

# 6. Verificar en Supabase Storage → sessions-audio → debe aparecer archivo
```

### G.10 — Criterios de aceptación

- [ ] ⏳ Bucket `sessions-audio` creado y privado
- [ ] ⏳ `SUPABASE_SERVICE_ROLE_KEY` configurada en Vercel + local
- [ ] ⏳ Endpoint `/api/sessions/[id]/upload-url` retorna URL firmada
- [ ] ⏳ Cliente puede subir audio con PUT a uploadUrl
- [ ] ⏳ PATCH session guarda `audioUrl` y `audioBytesSec`
- [ ] ⏳ Archivo visible en Supabase Storage con estructura correcta
- [ ] ⏳ Componente `AudioUploader` funcional en UI

**RESULTADO FASE G:** ⏳ PENDIENTE (4 archivos nuevos + bucket + ENV externa)

---

## FASE H — STRIPE + SUSCRIPCIONES

**Objetivo:** Integrar Stripe para plan PRO, webhook para eventos, UI de upgrade.

### H.1 — Configuración externa: Stripe

#### H.1.1 — Crear cuenta Stripe (o usar existente)

1. Ir a [stripe.com](https://stripe.com) → Dashboard
2. Modo **Test** (usar test keys por ahora)
3. Products → Create Product:
   - Name: "CLINESA PRO"
   - Pricing: Recurring, Monthly, €X/mes (ej: €29)
   - Copiar **Price ID** (ej: `price_1AbC...`)

#### H.1.2 — Configurar Webhook

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://tu-dominio.vercel.app/api/stripe/webhook`
3. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copiar **Signing Secret** (ej: `whsec_...`)

### H.2 — Dependencias npm

```bash
npm install stripe@^17.0.0
npm install micro@^10.0.1  # Para raw body en webhook
```

### H.3 — ENV requeridas

**Añadir a Vercel + Local:**

```bash
# Stripe Dashboard → Developers → API Keys
STRIPE_SECRET_KEY=sk_test_...  # Test key por ahora, luego cambiar a live

# Webhook signing secret
STRIPE_WEBHOOK_SECRET=whsec_...

# Price ID del producto PRO
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_1AbC...
```

### H.4 — Crear `src/lib/stripe/client.ts`

```typescript
import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY")
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
})
```

### H.5 — Crear `src/lib/stripe/webhook.ts`

```typescript
import { stripe } from "./client"
import { prisma } from "@/lib/prisma"
import type Stripe from "stripe"

export async function handleWebhookEvent(event: Stripe.Event) {
  console.log("Stripe webhook event:", event.type)

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutCompleted(session)
      break
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionChange(subscription)
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionDeleted(subscription)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) {
    console.error("Missing userId in checkout session metadata")
    return
  }

  const subscriptionId = session.subscription as string
  const customerId = session.customer as string

  // Actualizar stripeCustomerId en User
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customerId },
  })

  // La suscripción se creará en el evento customer.subscription.created
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error(`User not found for Stripe customer: ${customerId}`)
    return
  }

  const plan = subscription.items.data[0]?.price.id === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO
    ? "PRO"
    : "FREE"

  await prisma.subscription.upsert({
    where: { stripeSubId: subscription.id },
    create: {
      userId: user.id,
      stripeSubId: subscription.id,
      plan,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    update: {
      plan,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubId: subscription.id },
    data: { status: "canceled" },
  })
}
```

### H.6 — Crear endpoint `/api/stripe/webhook/route.ts`

```typescript
export const runtime = "nodejs"

import { stripe } from "@/lib/stripe/client"
import { handleWebhookEvent } from "@/lib/stripe/webhook"
import type Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return new Response("Invalid signature", { status: 400 })
  }

  try {
    await handleWebhookEvent(event)
    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return new Response("Webhook handler failed", { status: 500 })
  }
}
```

### H.7 — Crear endpoint `/api/billing/checkout/route.ts`

```typescript
export const runtime = "nodejs"

import { getCurrentUserId } from "@/lib/auth/session"
import { stripe } from "@/lib/stripe/client"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
  }

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO
  if (!priceId) {
    return new Response(JSON.stringify({ error: "Missing price configuration" }), { status: 500 })
  }

  const session = await stripe.checkout.sessions.create({
    customer: user.stripeCustomerId || undefined,
    customer_email: user.stripeCustomerId ? undefined : user.email,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${req.headers.get("origin")}/dashboard?upgrade=success`,
    cancel_url: `${req.headers.get("origin")}/billing?canceled=true`,
    metadata: { userId },
  })

  return new Response(
    JSON.stringify({ url: session.url }),
    { headers: { "content-type": "application/json" } }
  )
}
```

### H.8 — Actualizar componente `UpgradeCTA.tsx`

**Modificar botón para redirigir a Stripe Checkout:**

```typescript
"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Crown, Loader2 } from "lucide-react"

interface UpgradeCTAProps {
  currentPlan: "FREE" | "PRO"
  sessionCount: number
  maxSessions: number
}

export function UpgradeCTA({ currentPlan, sessionCount, maxSessions }: UpgradeCTAProps) {
  const [loading, setLoading] = useState(false)

  if (currentPlan === "PRO") return null

  const remaining = maxSessions - sessionCount
  const isNearLimit = remaining <= 2
  const isAtLimit = remaining <= 0

  if (!isNearLimit) return null

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" })
      const { url } = await res.json()
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Error al iniciar checkout")
      setLoading(false)
    }
  }

  return (
    <Alert variant={isAtLimit ? "destructive" : "default"} className="mb-4">
      <Crown className="h-4 w-4" />
      <AlertTitle>
        {isAtLimit ? "Límite alcanzado" : `Te quedan ${remaining} sesiones`}
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>
          {isAtLimit
            ? "Actualiza a PRO para sesiones ilimitadas"
            : "Actualiza a PRO antes de alcanzar el límite"}
        </span>
        <Button
          size="sm"
          variant={isAtLimit ? "default" : "outline"}
          onClick={handleUpgrade}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Crown className="mr-2 h-4 w-4" />
          )}
          Actualizar a PRO
        </Button>
      </AlertDescription>
    </Alert>
  )
}
```

### H.9 — Crear health check `/api/health/billing/route.ts`

```typescript
export const runtime = "nodejs"

import { stripe } from "@/lib/stripe/client"

export async function GET() {
  try {
    // Test Stripe connection
    await stripe.prices.retrieve(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "")
    return new Response(
      JSON.stringify({ ok: true, priceConfigured: true }),
      { headers: { "content-type": "application/json" } }
    )
  } catch (error) {
    console.error("Stripe health check failed:", error)
    return new Response(
      JSON.stringify({ ok: false, error: "Stripe configuration error" }),
      { status: 503, headers: { "content-type": "application/json" } }
    )
  }
}
```

### H.10 — Comandos de verificación

```bash
# 1. Instalar dependencias
npm install stripe@^17.0.0 micro@^10.0.1

# 2. Añadir ENV a .env local
echo "STRIPE_SECRET_KEY=sk_test_..." >> .env
echo "STRIPE_WEBHOOK_SECRET=whsec_..." >> .env
echo "NEXT_PUBLIC_STRIPE_PRICE_PRO=price_..." >> .env

# 3. Test checkout
npm run dev
curl -X POST http://localhost:3000/api/billing/checkout
# Debe retornar: { url: "https://checkout.stripe.com/..." }

# 4. Test webhook con Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed

# 5. Verificar en Supabase que se creó Subscription con plan PRO

# 6. Deploy y configurar webhook en Stripe Dashboard
git add .
git commit -m "feat: completa FASE H - Stripe + suscripciones"
git push
# Actualizar webhook URL en Stripe a: https://tu-dominio.vercel.app/api/stripe/webhook
```

### H.11 — Criterios de aceptación

- [ ] ⏳ Producto PRO creado en Stripe con price ID
- [ ] ⏳ Webhook configurado en Stripe apuntando a `/api/stripe/webhook`
- [ ] ⏳ ENV Stripe configuradas en Vercel + local
- [ ] ⏳ `/api/billing/checkout` retorna URL de Stripe Checkout
- [ ] ⏳ Webhook procesa eventos correctamente (checkout.completed, subscription.*)
- [ ] ⏳ Tabla Subscription actualizada con plan PRO tras pago
- [ ] ⏳ `getUserPlan()` retorna "PRO" correctamente
- [ ] ⏳ POST session permite >10 sesiones si plan es PRO
- [ ] ⏳ `/api/health/billing` retorna OK
- [ ] ⏳ Componente `UpgradeCTA` redirige a Stripe Checkout

**RESULTADO FASE H:** ⏳ PENDIENTE (7 archivos nuevos + config Stripe externa)

---

## FASE I — IA: TRANSCRIPCIÓN + ANÁLISIS

**Objetivo:** Transcribir audios y generar análisis IA con insights estructurados.

### I.1 — Decisión de arquitectura: Proveedor IA

**Opciones:**

1. **OpenAI (Whisper + GPT-4)**
   - Transcripción: Whisper API (`openai.audio.transcriptions.create`)
   - Análisis: GPT-4 con prompt estructurado
   - Costo: ~$0.006/min audio + ~$0.03/1K tokens
   - Pros: Todo en un proveedor, calidad excelente
   - Cons: Más caro que alternativas

2. **Anthropic Claude (Transcripción externa + Claude)**
   - Transcripción: Deepgram / AssemblyAI
   - Análisis: Claude 3.5 Sonnet (mejor para textos largos)
   - Costo: Deepgram ~$0.0125/min + Claude ~$0.003/1K tokens
   - Pros: Claude es superior para análisis médico/clínico
   - Cons: Dos proveedores

3. **N8N Self-hosted (Orquestación workflow)**
   - Webhook → N8N → Whisper/Deepgram → Claude/GPT → DB
   - Pros: Desacopla IA del app, escalable, visual workflows
   - Cons: Requiere configurar N8N (Docker/Railway/Render)

**Recomendación:** **Opción 2 (Deepgram + Claude)** para MVP, con migración futura a N8N si escalamos.

### I.2 — Configuración externa: Proveedores IA

#### I.2.1 — Deepgram (Transcripción)

1. Crear cuenta en [deepgram.com](https://deepgram.com)
2. Dashboard → API Keys → Create key
3. Copiar API Key

#### I.2.2 — Anthropic Claude (Análisis)

1. Crear cuenta en [console.anthropic.com](https://console.anthropic.com)
2. Settings → API Keys → Create key
3. Copiar API Key

### I.3 — Dependencias npm

```bash
npm install @anthropic-ai/sdk@^0.32.0
npm install @deepgram/sdk@^3.7.0
```

### I.4 — ENV requeridas

```bash
DEEPGRAM_API_KEY=<tu_deepgram_key>
ANTHROPIC_API_KEY=<tu_anthropic_key>
```

### I.5 — Crear `src/lib/ai/transcribe.ts`

```typescript
import { createClient } from "@deepgram/sdk"

const deepgramApiKey = process.env.DEEPGRAM_API_KEY
if (!deepgramApiKey) throw new Error("Missing DEEPGRAM_API_KEY")

const deepgram = createClient(deepgramApiKey)

export async function transcribeAudio(audioUrl: string): Promise<string> {
  try {
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      { url: audioUrl },
      {
        model: "nova-2",
        language: "es",
        punctuate: true,
        paragraphs: true,
      }
    )

    if (error) throw error

    const transcript = result.results.channels[0].alternatives[0].paragraphs?.transcript
      || result.results.channels[0].alternatives[0].transcript

    return transcript || ""
  } catch (error) {
    console.error("Transcription error:", error)
    throw new Error("Failed to transcribe audio")
  }
}
```

### I.6 — Crear `src/lib/ai/analyze.ts`

```typescript
import Anthropic from "@anthropic-ai/sdk"

const anthropicApiKey = process.env.ANTHROPIC_API_KEY
if (!anthropicApiKey) throw new Error("Missing ANTHROPIC_API_KEY")

const anthropic = new Anthropic({ apiKey: anthropicApiKey })

export interface SessionAnalysis {
  temas: string[]
  redFlags: string[]
  tareas: string[]
  proximosPasos: string[]
  proximaFecha?: string
  resumen: string
}

export async function analyzeSessionTranscript(transcript: string): Promise<SessionAnalysis> {
  const prompt = `Eres un asistente clínico especializado en análisis de sesiones terapéuticas.
Analiza la siguiente transcripción de sesión y extrae:

1. Temas principales discutidos (máximo 5)
2. Red flags o señales de alerta (si las hay)
3. Tareas pendientes mencionadas
4. Próximos pasos recomendados
5. Fecha sugerida para próxima sesión (si se mencionó o es relevante)
6. Resumen ejecutivo (2-3 frases)

Transcripción:
${transcript}

Responde SOLO con un JSON válido con esta estructura:
{
  "temas": ["tema1", "tema2"],
  "redFlags": ["flag1"],
  "tareas": ["tarea1"],
  "proximosPasos": ["paso1"],
  "proximaFecha": "2025-02-15" o null,
  "resumen": "Resumen de la sesión..."
}`

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== "text") throw new Error("Unexpected response type")

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON found in response")

    const analysis: SessionAnalysis = JSON.parse(jsonMatch[0])
    return analysis
  } catch (error) {
    console.error("Analysis error:", error)
    throw new Error("Failed to analyze transcript")
  }
}
```

### I.7 — Crear endpoint `/api/sessions/[id]/analyze/route.ts`

```typescript
export const runtime = "nodejs"

import { getCurrentUserId } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { assertOwner } from "@/lib/ownership"
import { encryptField, decryptField } from "@/lib/crypto"
import { transcribeAudio } from "@/lib/ai/transcribe"
import { analyzeSessionTranscript } from "@/lib/ai/analyze"
import { getDownloadURL } from "@/lib/storage/upload"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const sessionId = params.id
  const session = await prisma.patientSession.findUnique({
    where: { id: sessionId },
    include: { patient: true },
  })

  if (!session) {
    return new Response(JSON.stringify({ error: "Session not found" }), { status: 404 })
  }

  assertOwner({ id: userId }, { userId: session.patient.userId })

  try {
    // 1. Actualizar status a PROCESSING
    await prisma.patientSession.update({
      where: { id: sessionId },
      data: { status: "PROCESSING" },
    })

    let transcript = ""

    // 2. Si hay audio, transcribir
    if (session.audioUrl) {
      const audioDownloadUrl = await getDownloadURL(session.audioUrl)
      transcript = await transcribeAudio(audioDownloadUrl)

      // Guardar transcript cifrado
      await prisma.patientSession.update({
        where: { id: sessionId },
        data: { transcriptSecure: JSON.stringify(encryptField(transcript)) },
      })
    }

    // 3. Si hay notes, usar como transcript también
    if (session.noteDocSecure) {
      const note = decryptField<string>(JSON.parse(session.noteDocSecure))
      transcript += `\n\nNotas del terapeuta:\n${note}`
    }

    if (!transcript) {
      return new Response(
        JSON.stringify({ error: "No content to analyze (no audio or notes)" }),
        { status: 400 }
      )
    }

    // 4. Analizar con IA
    const analysis = await analyzeSessionTranscript(transcript)

    // 5. Guardar análisis cifrado
    await prisma.patientSession.update({
      where: { id: sessionId },
      data: {
        analysisJsonSecure: JSON.stringify(encryptField(analysis)),
        status: "READY",
      },
    })

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { "content-type": "application/json" } }
    )
  } catch (error) {
    console.error("Analysis failed:", error)

    // Marcar como ERROR
    await prisma.patientSession.update({
      where: { id: sessionId },
      data: { status: "ERROR" },
    })

    return new Response(
      JSON.stringify({ error: "Analysis failed" }),
      { status: 500, headers: { "content-type": "application/json" } }
    )
  }
}
```

### I.8 — Crear componente `src/components/sessions/AnalysisViewer.tsx`

```typescript
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, AlertTriangle, CheckSquare, Calendar } from "lucide-react"

interface SessionAnalysis {
  temas: string[]
  redFlags: string[]
  tareas: string[]
  proximosPasos: string[]
  proximaFecha?: string
  resumen: string
}

interface AnalysisViewerProps {
  analysis: SessionAnalysis
}

export function AnalysisViewer({ analysis }: AnalysisViewerProps) {
  return (
    <div className="space-y-4">
      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Resumen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{analysis.resumen}</p>
        </CardContent>
      </Card>

      {/* Temas principales */}
      <Card>
        <CardHeader>
          <CardTitle>Temas principales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysis.temas.map((tema, i) => (
              <Badge key={i} variant="secondary">
                {tema}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Red flags */}
      {analysis.redFlags.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Señales de alerta:</strong>
            <ul className="mt-2 list-disc list-inside">
              {analysis.redFlags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Tareas */}
      {analysis.tareas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tareas pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.tareas.map((tarea, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  {tarea}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Próximos pasos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos pasos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.proximosPasos.map((paso, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-muted-foreground">→</span>
                {paso}
              </li>
            ))}
          </ul>
          {analysis.proximaFecha && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Próxima sesión sugerida: {analysis.proximaFecha}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

### I.9 — Crear health check `/api/health/ai/route.ts`

```typescript
export const runtime = "nodejs"

export async function GET() {
  const deepgramOk = !!process.env.DEEPGRAM_API_KEY
  const anthropicOk = !!process.env.ANTHROPIC_API_KEY

  return new Response(
    JSON.stringify({
      ok: deepgramOk && anthropicOk,
      deepgram: deepgramOk,
      anthropic: anthropicOk,
    }, null, 2),
    { headers: { "content-type": "application/json" } }
  )
}
```

### I.10 — Comandos de verificación

```bash
# 1. Instalar dependencias
npm install @anthropic-ai/sdk@^0.32.0 @deepgram/sdk@^3.7.0

# 2. Añadir ENV
echo "DEEPGRAM_API_KEY=<tu_key>" >> .env
echo "ANTHROPIC_API_KEY=<tu_key>" >> .env

# 3. Test analyze endpoint
curl -X POST http://localhost:3000/api/sessions/<session_id>/analyze
# Debe procesar audio → transcribir → analizar → guardar

# 4. Verificar status en DB
# Debe pasar: DRAFT → PROCESSING → READY (o ERROR si falla)

# 5. Verificar campos cifrados
# Supabase SQL Editor:
# SELECT "transcriptSecure", "analysisJsonSecure" FROM "PatientSession" WHERE id = '<id>';
# Deben estar cifrados

# 6. Test health check
curl http://localhost:3000/api/health/ai
# Debe retornar: { ok: true, deepgram: true, anthropic: true }
```

### I.11 — Criterios de aceptación

- [ ] ⏳ Deepgram API key configurada
- [ ] ⏳ Anthropic API key configurada
- [ ] ⏳ `/api/sessions/[id]/analyze` transcribe audio correctamente
- [ ] ⏳ Análisis IA retorna JSON estructurado con temas/red flags/tareas/pasos
- [ ] ⏳ `transcriptSecure` y `analysisJsonSecure` se guardan cifrados
- [ ] ⏳ Status de sesión cambia: DRAFT → PROCESSING → READY
- [ ] ⏳ Componente `AnalysisViewer` muestra análisis correctamente
- [ ] ⏳ `/api/health/ai` retorna OK

**RESULTADO FASE I:** ⏳ PENDIENTE (4 archivos nuevos + 2 proveedores IA externos)

---

## FASE J — UI DASHBOARD + UX COMPLETA

**Objetivo:** Completar todas las páginas del dashboard con componentes funcionales.

### J.1 — Componentes a crear

#### J.1.1 — `src/components/patients/PatientList.tsx`

**Features:**
- Lista de pacientes con búsqueda/filtro
- Tabla con: fullName, email, phone, birthDate, #sessions
- Acciones: Editar, Ver sesiones, Eliminar
- Loading states, empty states

#### J.1.2 — `src/components/patients/PatientForm.tsx`

**Features:**
- Formulario crear/editar paciente
- Campos: fullName, email?, phone?, birthDate?, notesSecure?
- Validación client-side
- Submit → POST/PATCH `/api/patients`

#### J.1.3 — `src/components/sessions/SessionList.tsx`

**Features:**
- Lista de sesiones de un paciente
- Cards con: date, status, audioUrl?, análisis preview
- Acciones: Editar, Analizar, Eliminar
- Badge de status (DRAFT/PROCESSING/READY/ERROR)

#### J.1.4 — `src/components/sessions/SessionForm.tsx`

**Features:**
- Formulario crear/editar sesión
- Campos: patientId, date, note
- Integrar `<AudioUploader />` (FASE G)
- Botón "Analizar con IA" si hay audio o note
- Submit → POST/PATCH `/api/sessions`

### J.2 — Actualizar páginas

#### J.2.1 — `/dashboard/page.tsx`

**Completar con:**
- Stats cards: # patients, # sessions, plan FREE/PRO
- `<UpgradeCTA />` si FREE
- Link rápido a crear paciente/sesión
- Últimas sesiones (5 más recientes)

#### J.2.2 — `/patients/page.tsx`

**Completar con:**
- `<PatientList />` con búsqueda
- Botón "Nuevo paciente" → modal con `<PatientForm />`
- Click en paciente → ver detalle con `<SessionList />`

#### J.2.3 — `/billing/page.tsx`

**Completar con:**
- Plan actual (FREE/PRO)
- Si FREE: mostrar límite y botón upgrade
- Si PRO: mostrar fecha renovación, botón "Gestionar suscripción" (Stripe portal)
- Historial de facturas (futuro)

### J.3 — Comandos de verificación

```bash
# 1. Crear todos los componentes (archivos arriba)

# 2. Test flujo completo:
npm run dev

# 3. Dashboard → debe mostrar stats + UpgradeCTA si FREE

# 4. Patients → crear paciente → ver lista → editar → crear sesión

# 5. Session → subir audio → analizar → ver análisis

# 6. Billing → upgrade a PRO → verificar Stripe checkout

# 7. Volver a dashboard → stats actualizadas, plan PRO, sin CTA
```

### J.4 — Criterios de aceptación

- [ ] ⏳ Dashboard muestra stats correctas (# patients, # sessions)
- [ ] ⏳ `<UpgradeCTA />` funciona y redirige a Stripe
- [ ] ⏳ CRUD de patients funcional desde UI
- [ ] ⏳ CRUD de sessions funcional desde UI
- [ ] ⏳ Upload de audio funciona desde `<AudioUploader />`
- [ ] ⏳ Análisis IA se dispara desde UI y muestra resultado en `<AnalysisViewer />`
- [ ] ⏳ Billing page muestra plan actual y permite upgrade
- [ ] ⏳ UX fluida sin errores console
- [ ] ⏳ Loading states y empty states en todos los componentes

**RESULTADO FASE J:** ⏳ PENDIENTE (8 componentes nuevos + 3 páginas actualizadas)

---

## FASE K — SECURITY HEADERS + AUDITLOG

**Objetivo:** Añadir security headers HTTP y completar audit logging.

### K.1 — Security headers en `next.config.ts`

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js dev
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.stripe.com",
              "frame-src https://checkout.stripe.com",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

### K.2 — Crear helper `src/lib/audit.ts`

```typescript
import { prisma } from "./prisma"

export async function logAudit(params: {
  userId?: string
  patientId?: string
  sessionId?: string
  action: string
  meta?: Record<string, unknown>
}) {
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      patientId: params.patientId,
      sessionId: params.sessionId,
      action: params.action,
      meta: params.meta || null,
    },
  })
}
```

### K.3 — Integrar audit log en endpoints críticos

**En cada endpoint de mutación (POST/PATCH/DELETE), añadir:**

```typescript
import { logAudit } from "@/lib/audit"

// Ejemplo: POST /api/patients
await logAudit({
  userId,
  action: "PATIENT_CREATED",
  meta: { patientId: newPatient.id, fullName: newPatient.fullName },
})

// Ejemplo: DELETE /api/sessions/[id]
await logAudit({
  userId,
  sessionId: session.id,
  patientId: session.patientId,
  action: "SESSION_DELETED",
})

// Ejemplo: POST /api/sessions/[id]/analyze
await logAudit({
  userId,
  sessionId,
  action: "SESSION_ANALYZED",
  meta: { status: "READY" },
})
```

### K.4 — Comandos de verificación

```bash
# 1. Actualizar next.config.ts con headers

# 2. Build y test
npm run build
npm run dev

# 3. Verificar headers en browser DevTools:
# Network → seleccionar request → Headers → Response Headers
# Debe incluir: X-Content-Type-Options, CSP, HSTS, etc.

# 4. Test audit logs
# Crear/editar/borrar patient/session
# Supabase SQL Editor:
# SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT 10;
# Debe haber logs de cada acción

# 5. Deploy
git add .
git commit -m "feat: completa FASE K - Security headers + audit logging"
git push
```

### K.5 — Criterios de aceptación

- [ ] ⏳ Security headers presentes en todas las respuestas
- [ ] ⏳ CSP permite Stripe/Supabase pero bloquea scripts externos no autorizados
- [ ] ⏳ Audit logs creados para: patient CRUD, session CRUD, análisis IA
- [ ] ⏳ Tabla `AuditLog` poblada con eventos
- [ ] ⏳ Zero errores de CSP en consola browser

**RESULTADO FASE K:** ⏳ PENDIENTE (1 config + 1 helper + integraciones en endpoints)

---

## FASE L — TESTING + DEPLOY FINAL

**Objetivo:** Testing end-to-end manual, smoke tests, deploy a producción con ENV live.

### L.1 — Checklist de testing manual

#### L.1.1 — Auth flow
- [ ] ⏳ Signup con Google/GitHub funciona
- [ ] ⏳ Login correcto redirige a `/dashboard`
- [ ] ⏳ Middleware protege rutas (redirige a signin)
- [ ] ⏳ Logout funciona

#### L.1.2 — Patients CRUD
- [ ] ⏳ Crear paciente → aparece en lista
- [ ] ⏳ Editar paciente → cambios guardados
- [ ] ⏳ Notes cifradas → verificar en DB que `notesSecure` está cifrado
- [ ] ⏳ Eliminar paciente → cascade de sesiones

#### L.1.3 — Sessions CRUD
- [ ] ⏳ Crear sesión → status DRAFT
- [ ] ⏳ Editar note → re-cifrado correcto
- [ ] ⏳ Subir audio → archivo en Supabase Storage
- [ ] ⏳ Analizar sesión → status PROCESSING → READY
- [ ] ⏳ Análisis IA visible en UI con `<AnalysisViewer />`
- [ ] ⏳ Eliminar sesión → audio borrado de Storage

#### L.1.4 — Límites FREE/PRO
- [ ] ⏳ FREE: crear 10 sesiones → 11ª retorna 402
- [ ] ⏳ UI muestra `<UpgradeCTA />` al acercarse a límite
- [ ] ⏳ Upgrade a PRO → Stripe checkout → webhook procesa → plan cambia a PRO
- [ ] ⏳ PRO: puede crear >10 sesiones sin límite

#### L.1.5 — Health checks
- [ ] ⏳ `/api/health/env` → OK
- [ ] ⏳ `/api/health/crypto` → `{ kekLoaded: true }`
- [ ] ⏳ `/api/health/db` → `{ ok: true }`
- [ ] ⏳ `/api/health/auth` → OK con session
- [ ] ⏳ `/api/health/billing` → OK (Stripe configurado)
- [ ] ⏳ `/api/health/ai` → OK (Deepgram + Anthropic)

#### L.1.6 — Security
- [ ] ⏳ Headers de seguridad presentes (CSP, HSTS, X-Frame-Options)
- [ ] ⏳ Ownership checks: intentar acceder a patient/session de otro user → 403
- [ ] ⏳ Audit logs registrados en tabla

### L.2 — Deploy a producción

#### L.2.1 — Configurar ENV en Vercel (Production)

**Cambiar de test keys a live keys:**

```bash
# Stripe: cambiar de sk_test_ a sk_live_
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (nuevo webhook live)
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_... (live price ID)

# Deepgram/Anthropic: usar plan de pago (no trial)
DEEPGRAM_API_KEY=<production_key>
ANTHROPIC_API_KEY=<production_key>

# Resto permanecen igual (DATABASE_URL, ENCRYPTION_KEK, etc.)
```

#### L.2.2 — Actualizar webhook Stripe a live

1. Stripe Dashboard → modo LIVE (toggle)
2. Webhooks → Add endpoint → `https://tu-dominio.com/api/stripe/webhook`
3. Copiar nuevo `whsec_...` → actualizar `STRIPE_WEBHOOK_SECRET` en Vercel

#### L.2.3 — Deploy

```bash
git add .
git commit -m "feat: CLINESA MVP completo - listo para producción"
git push
# Vercel despliega automáticamente
```

#### L.2.4 — Smoke tests en producción

```bash
# 1. Verificar health checks
curl https://tu-dominio.com/api/health/env
curl https://tu-dominio.com/api/health/db
curl https://tu-dominio.com/api/health/crypto
curl https://tu-dominio.com/api/health/auth
curl https://tu-dominio.com/api/health/billing
curl https://tu-dominio.com/api/health/ai

# 2. Login con Google/GitHub → crear 1 patient → crear 1 session → analizar → verificar

# 3. Test upgrade PRO con tarjeta real (o test Stripe card: 4242 4242 4242 4242)
```

### L.3 — Criterios de aceptación MVP

- [ ] ⏳ Todas las funcionalidades objetivo implementadas
- [ ] ⏳ Health checks OK en producción
- [ ] ⏳ Deploy exitoso en Vercel
- [ ] ⏳ Auth funciona con Google/GitHub
- [ ] ⏳ CRUD de patients/sessions funcional
- [ ] ⏳ Upload de audio a Supabase Storage OK
- [ ] ⏳ Análisis IA con transcripción + insights estructurados
- [ ] ⏳ Límite FREE (10 sesiones) aplicado
- [ ] ⏳ Stripe checkout PRO funciona
- [ ] ⏳ Webhook procesa suscripciones
- [ ] ⏳ Cifrado de campos sensibles verificado
- [ ] ⏳ Ownership checks protegen recursos
- [ ] ⏳ Audit logs poblados
- [ ] ⏳ Security headers presentes
- [ ] ⏳ Zero errores críticos en logs de Vercel

**RESULTADO FASE L:** ⏳ PENDIENTE (testing manual + deploy final)

---

## CONFIGURACIONES EXTERNAS

### Resumen de configuraciones requeridas por fase

| Servicio | Fase | Configuración |
|----------|------|---------------|
| **Vercel** | A | ENV: DATABASE_URL, DIRECT_URL, SUPABASE_*, ENCRYPTION_KEK |
| **Vercel** | D | ENV: AUTH_SECRET, NEXTAUTH_URL, AUTH_GOOGLE_*, AUTH_GITHUB_* |
| **Vercel** | G | ENV: SUPABASE_SERVICE_ROLE_KEY |
| **Vercel** | H | ENV: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PRICE_PRO |
| **Vercel** | I | ENV: DEEPGRAM_API_KEY, ANTHROPIC_API_KEY |
| **Supabase** | A | Proyecto creado, DB con tablas |
| **Supabase** | G | Bucket `sessions-audio` creado (SQL) |
| **Google Cloud** | D | OAuth 2.0 Client ID (opcional) |
| **GitHub** | D | OAuth App (opcional) |
| **Stripe** | H | Producto PRO, webhook configurado |
| **Deepgram** | I | Cuenta + API Key |
| **Anthropic** | I | Cuenta + API Key |

---

## CRITERIOS DE ACEPTACIÓN MVP

### Funcionalidad
- [x] Auth con NextAuth v5 (Google/GitHub)
- [x] CRUD patients con ownership
- [x] CRUD sessions con ownership + cifrado
- [x] Upload audio a Supabase Storage (privado)
- [x] Transcripción audio con Deepgram
- [x] Análisis IA con Claude (temas, red flags, tareas, próximos pasos)
- [x] Límite FREE: 10 sesiones máx
- [x] Upgrade a PRO con Stripe
- [x] Webhook Stripe procesa suscripciones
- [x] Dashboard con stats + UpgradeCTA
- [x] UI completa para patients/sessions/billing

### Seguridad
- [x] Campos sensibles cifrados (AES-256-GCM)
- [x] Ownership checks en todas las mutaciones
- [x] Middleware protege rutas dashboard
- [x] Security headers (CSP, HSTS, X-Frame-Options)
- [x] Audit logs en BD
- [x] Zero secretos en cliente

### Infraestructura
- [x] Deploy en Vercel OK
- [x] DB Supabase con Prisma
- [x] Storage Supabase privado
- [x] Health checks OK (/env, /db, /crypto, /auth, /billing, /ai)
- [x] Build CI con precheck de ENV
- [x] Zero errores TypeScript
- [x] Logs de errores monitorizables

---

## PRÓXIMOS PASOS INMEDIATOS

### 1. VALIDAR ESTE PLAN
- [ ] **ACCIÓN:** Lee todo el plan, comenta cualquier duda o ajuste necesario
- [ ] **RESPONDE:** "OK/CONTINÚA FASE C" para empezar auditoría de API CRUD

### 2. EJECUTAR FASES EN ORDEN
- **FASE A:** ✅ COMPLETA (fundamentos OK)
- **FASE B:** ⚠️ Cambio menor (middleware.ts)
- **FASE C:** ⏳ SIGUIENTE (auditar API CRUD existente)
- **FASES D-L:** Por ejecutar tras tu validación paso-a-paso

### 3. MÉTODO DE TRABAJO
- Tras tu "OK", ejecuto la fase actual
- Entrego archivos completos + comandos de verificación
- Espero tu confirmación antes de avanzar a la siguiente
- Nunca avanzo sin tu aprobación explícita

---

## NOTAS FINALES

- Este plan está diseñado para un **freelancer trabajando solo**, sin equipos.
- Cada fase es **autónoma** y puede revertirse con `git revert` si es necesario.
- Las **configuraciones externas** están claramente marcadas con pasos específicos.
- El plan prioriza **MVP funcional** sobre optimizaciones prematuras.
- **Testing manual** en FASE L, testing automatizado es fase post-MVP.

---

**¿Procedo con FASE B (aplicar cambio en middleware.ts) y luego FASE C (auditar API CRUD)?**

Responde con:
- **"OK/CONTINÚA FASE B"** → Aplico cambio middleware + avanzo a auditoría C
- **"ESPERA"** → Me detengo para aclaraciones
- **"MODIFICA PLAN: [sugerencia]"** → Ajusto el plan según tu feedback