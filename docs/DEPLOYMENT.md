# 🚀 Guía Completa de Deployment - Clinesa

Esta guía contiene **todos los pasos externos** necesarios para que el código funcione en Vercel.

---

## 📋 Checklist General

- [ ] 1. Base de datos Supabase configurada
- [ ] 2. Bucket de Storage creado
- [ ] 3. Variables de entorno en Vercel
- [ ] 4. OAuth providers configurados (opcional)
- [ ] 5. Productos Stripe creados
- [ ] 6. Webhook Stripe configurado
- [ ] 7. Deployment en Vercel

---

## 1️⃣ SUPABASE - Base de Datos y Storage

### 1.1 Crear Proyecto Supabase
1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Guardar:
   - **Project URL**: `https://xxxxxxxx.supabase.co`
   - **Anon Key**: `eyJhbGc...` (público)
   - **Service Role Key**: `eyJhbGc...` (⚠️ SECRETO)

### 1.2 Obtener URLs de Base de Datos
En Supabase → Settings → Database:

**CONNECTION POOLING (Pooled):**
```
postgresql://postgres.xxxxxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```
👉 Copiar como `DATABASE_URL`

**CONNECTION STRING (Direct):**
```
postgresql://postgres.xxxxxxxx:[PASSWORD]@db.xxxxxxxx.supabase.co:5432/postgres
```
👉 Copiar como `DIRECT_URL`

### 1.3 Crear Schema de Base de Datos

**⚠️ IMPORTANTE:** Las migraciones de Prisma NO funcionan. Debes aplicar el schema manualmente.

**Opción A: Usar Prisma para generar SQL (recomendado)**
```bash
# Generar SQL desde schema.prisma
npx prisma migrate dev --name init --create-only
# Esto crea el archivo en prisma/migrations/XXX_init/migration.sql
# Copiar ese SQL y ejecutarlo en Supabase SQL Editor
```

**Opción B: Crear tablas manualmente en Supabase SQL Editor**

Ejecutar en Supabase → SQL Editor:

```sql
-- Crear ENUMS primero
CREATE TYPE "Plan" AS ENUM ('SOLO', 'PRACTICE', 'PROFESSIONAL');
CREATE TYPE "CreditTransactionType" AS ENUM ('GRANT', 'CONSUME', 'REFUND', 'ADJUSTMENT');
CREATE TYPE "SessionStatus" AS ENUM ('DRAFT', 'PROCESSING', 'READY', 'ERROR');

-- Tabla User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "stripeCustomerId" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "maxPatients" INTEGER,
    "trialEndsAt" TIMESTAMP(3),
    "trialUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Tabla Patient
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "birthDate" TIMESTAMP(3),
    "notesSecure" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Tabla PatientSession
CREATE TABLE "PatientSession" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "noteDocSecure" TEXT,
    "audioUrl" TEXT,
    "audioBytesSec" INTEGER,
    "audioDurationMin" INTEGER,
    "transcriptSecure" TEXT,
    "analysisJsonSecure" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'DRAFT',
    "creditsUsed" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PatientSession_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PatientSession_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE
);

-- Tabla Subscription
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSubId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'PROFESSIONAL',
    "status" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "Subscription_stripeSubId_key" ON "Subscription"("stripeSubId");

-- Tabla Consent
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Consent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Consent_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE
);

-- Tabla AuditLog
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "patientId" TEXT,
    "sessionId" TEXT,
    "action" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id"),
    CONSTRAINT "AuditLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id"),
    CONSTRAINT "AuditLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PatientSession"("id")
);

-- Tablas NextAuth
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "AuthSession_sessionToken_key" ON "AuthSession"("sessionToken");

-- Tabla CreditTransaction
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT,
    "type" "CreditTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "reason" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "CreditTransaction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PatientSession"("id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX "CreditTransaction_sessionId_key" ON "CreditTransaction"("sessionId");
CREATE INDEX "CreditTransaction_userId_createdAt_idx" ON "CreditTransaction"("userId", "createdAt");
```

### 1.4 Crear Bucket de Storage

Ejecutar en Supabase → SQL Editor:

```sql
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

---

## 2️⃣ NEXTAUTH - OAuth Providers (Opcional)

### 2.1 Google OAuth (Opcional)
1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto o seleccionar existente
3. APIs & Services → Credentials → Create OAuth 2.0 Client ID
4. Application type: Web application
5. Authorized redirect URIs:
   ```
   https://tu-dominio.vercel.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
6. Guardar:
   - **Client ID** → `AUTH_GOOGLE_ID`
   - **Client Secret** → `AUTH_GOOGLE_SECRET`

### 2.2 GitHub OAuth (Opcional)
1. Ir a GitHub → Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Homepage URL: `https://tu-dominio.vercel.app`
4. Authorization callback URL: `https://tu-dominio.vercel.app/api/auth/callback/github`
5. Guardar:
   - **Client ID** → `AUTH_GITHUB_ID`
   - **Client Secret** → `AUTH_GITHUB_SECRET`

---

## 3️⃣ STRIPE - Suscripciones y Pagos

### 3.1 Crear Cuenta Stripe
1. Ir a [stripe.com](https://stripe.com)
2. Crear cuenta o iniciar sesión
3. **Modo Test** (usar test keys por ahora)
4. Dashboard → Developers → API Keys:
   - **Secret key**: `sk_test_...` → `STRIPE_SECRET_KEY`

### 3.2 Crear Productos y Precios

**Stripe Dashboard → Products → Add Product**

**Producto 1: SOLO**
- Name: "Clinesa Solo"
- Description: "250 créditos mensuales, hasta 10 pacientes"
- Pricing: Recurring, Monthly, **€9.00**
- Copiar **Price ID**: `price_xxx` → `NEXT_PUBLIC_STRIPE_PRICE_SOLO`

**Producto 2: PRACTICE** ⭐
- Name: "Clinesa Practice"
- Description: "1200 créditos mensuales, pacientes ilimitados"
- Pricing: Recurring, Monthly, **€29.00**
- Copiar **Price ID**: `price_xxx` → `NEXT_PUBLIC_STRIPE_PRICE_PRACTICE`

**Producto 3: PROFESSIONAL**
- Name: "Clinesa Professional"
- Description: "3200 créditos mensuales, pacientes ilimitados"
- Pricing: Recurring, Monthly, **€49.00**
- Copiar **Price ID**: `price_xxx` → `NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL`

### 3.3 Configurar Webhook

**⚠️ IMPORTANTE:** Hacer esto DESPUÉS del primer deploy en Vercel

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://tu-dominio.vercel.app/api/stripe/webhook`
3. Events to send (seleccionar):
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
4. Add endpoint
5. Copiar **Signing Secret**: `whsec_...` → `STRIPE_WEBHOOK_SECRET`

---

## 4️⃣ VERCEL - Deployment

### 4.1 Conectar Repositorio
1. Ir a [vercel.com](https://vercel.com)
2. New Project
3. Import Git Repository (GitHub/GitLab/Bitbucket)
4. Seleccionar repositorio `clinesa`

### 4.2 Configurar Variables de Entorno

**Vercel Dashboard → tu proyecto → Settings → Environment Variables**

Añadir las siguientes (para **Production** y **Preview**):

#### 🔐 Base de Datos (Supabase)
```bash
DATABASE_URL=postgresql://postgres.xxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:[PASSWORD]@db.xxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (SECRET)
```

#### 🔒 Seguridad
```bash
# Generar con: openssl rand -base64 32
ENCRYPTION_KEK=tu_clave_32bytes_base64_aqui
AUTH_SECRET=tu_secreto_nextauth_base64_aqui
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

#### 🎨 OAuth (Opcional)
```bash
AUTH_GOOGLE_ID=xxx.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-xxx
AUTH_GITHUB_ID=Ov23xxx
AUTH_GITHUB_SECRET=xxx
```

#### 💳 Stripe
```bash
STRIPE_SECRET_KEY=sk_test_xxx (cambiar a sk_live_xxx en producción)
STRIPE_WEBHOOK_SECRET=whsec_xxx (configurar DESPUÉS del primer deploy)
NEXT_PUBLIC_STRIPE_PRICE_SOLO=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRACTICE=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_xxx
```

#### 🤖 IA Providers (Para FASE I - aún no implementada)
```bash
# DEEPGRAM_API_KEY=xxx
# ANTHROPIC_API_KEY=xxx
```

#### 🌐 Deployment
```bash
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

### 4.3 Build Settings

**Framework Preset:** Next.js
**Build Command:** `npm run vercel-build`
**Output Directory:** `.next`
**Install Command:** `npm install`

### 4.4 Deploy

1. Click **Deploy**
2. Esperar a que termine el build (~2-3 min)
3. Copiar URL de producción (ej: `https://clinesa-xxx.vercel.app`)

### 4.5 Post-Deploy: Configurar Webhook Stripe

1. Volver a Stripe Dashboard → Webhooks
2. Editar endpoint creado anteriormente
3. Actualizar URL a: `https://tu-dominio-real.vercel.app/api/stripe/webhook`
4. Copiar nuevo **Signing Secret** (si cambió)
5. Actualizar `STRIPE_WEBHOOK_SECRET` en Vercel
6. Redeploy si es necesario

---

## 5️⃣ VERIFICACIÓN - Health Checks

Una vez desplegado, verificar que todo funciona:

### Health Check Endpoints

```bash
# 1. Environment Variables
curl https://tu-dominio.vercel.app/api/health/env
# Debe retornar: { DATABASE_URL: true, SUPABASE_URL: true, ... }

# 2. Encryption
curl https://tu-dominio.vercel.app/api/health/crypto
# Debe retornar: { kekLoaded: true }

# 3. Database
curl https://tu-dominio.vercel.app/api/health/db
# Debe retornar: { ok: true }

# 4. Auth
curl https://tu-dominio.vercel.app/api/health/auth
# Debe retornar: { ok: false, userId: null } (sin login es correcto)

# 5. Billing
curl https://tu-dominio.vercel.app/api/health/billing
# Debe retornar: { ok: true, pricesConfigured: true, webhookSecret: true }
```

### Prueba Manual

1. **Visitar:** `https://tu-dominio.vercel.app`
2. **Login:** Click en "Sign in" → Probar con Google/GitHub
3. **Dashboard:** Debe cargar con créditos: 0, plan: FREE
4. **Billing:** Ir a `/billing` → Deben aparecer 3 planes
5. **Checkout:** Click en un plan → Debe redirigir a Stripe
6. **Pagar:** Usar tarjeta de test: `4242 4242 4242 4242` (cualquier fecha/CVV)
7. **Verificar:** Volver a `/dashboard` → Debe mostrar nuevo plan y créditos

---

## 6️⃣ TESTING LOCAL (Opcional)

### 6.1 Configurar .env local

```bash
cp .env.example .env
```

Rellenar con las mismas variables que en Vercel (usar valores de test)

### 6.2 Comandos útiles

```bash
# Generar cliente Prisma
npm run prisma:generate

# Verificar tipos
npm run check

# Build local
npm run build

# Dev server
npm run dev
```

### 6.3 Test Webhook Stripe localmente

Instalar Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

Ejecutar:
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Forward webhooks
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Terminal 3: Trigger test event
stripe trigger checkout.session.completed
```

---

## 📝 RESUMEN - Orden Recomendado

1. ✅ Crear proyecto Supabase
2. ✅ Ejecutar SQL para crear schema
3. ✅ Crear bucket de storage
4. ✅ Crear productos Stripe (3 planes)
5. ✅ Configurar variables en Vercel
6. ✅ Deploy en Vercel
7. ✅ Configurar webhook Stripe con URL real
8. ✅ Verificar health checks
9. ✅ Prueba manual de checkout

---

## 🚨 TROUBLESHOOTING

### Error: "Missing STRIPE_SECRET_KEY"
- Verificar que la variable está en Vercel (sin espacios)
- Redeploy después de añadir variables

### Webhook no funciona
- Verificar URL del webhook es la correcta (con https://)
- Verificar `STRIPE_WEBHOOK_SECRET` coincide
- Ver logs en Stripe Dashboard → Webhooks → evento → ver detalles

### Error de base de datos
- Verificar `DATABASE_URL` tiene `?pgbouncer=true`
- Verificar `DIRECT_URL` NO tiene pgbouncer
- Verificar que el schema está creado en Supabase

### NextAuth no funciona
- Verificar `AUTH_SECRET` está configurado
- Verificar `NEXTAUTH_URL` es la URL correcta de Vercel
- Verificar callbacks de OAuth incluyen la URL de Vercel

---

## 📚 RECURSOS

- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [NextAuth.js v5](https://authjs.dev)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)

---

**✨ ¡Deployment completo! Tu aplicación debería estar funcionando en producción.**