# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm run vercel-build` - CI build script for Vercel deployment
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run check` - Run linting and TypeScript type checking

### Database Commands

- `npm run prisma:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations (development)
- `npm run db:push` - Push schema changes to database

## Architecture Overview

This is a Next.js 15 application with App Router, built for a clinical management system called "clinesa". The system manages patient records, therapy sessions, and subscriptions with enterprise-grade security features.

### Tech Stack

- **Framework**: Next.js 15 with App Router and React Server Components
- **Database**: PostgreSQL via Prisma ORM with pooled connections (PgBouncer)
- **Authentication**: NextAuth v5 (beta.29) with Google/GitHub OAuth providers
- **UI**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand stores for client-side state
- **Language**: TypeScript with strict mode
- **Deployment**: Vercel with Supabase for PostgreSQL

### Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/        # Main dashboard with stats
│   │   ├── patients/         # Patient management
│   │   ├── billing/          # Subscription management
│   │   └── settings/         # User settings
│   ├── api/
│   │   ├── auth/            # NextAuth handlers
│   │   ├── patients/        # Patient CRUD endpoints
│   │   ├── sessions/        # Patient session endpoints
│   │   └── health/          # Health check endpoints (env, crypto, db, auth)
│   └── layout.tsx           # Root layout with fonts
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── nav/                 # Navigation components (Sidebar)
├── lib/
│   ├── auth/               # Authentication config and session utilities
│   ├── billing/            # Subscription limits (FREE_MAX_SESSIONS = 10)
│   ├── stores/             # Zustand stores
│   ├── crypto.ts           # Field-level encryption (AES-256-GCM with KEK/DEK)
│   ├── ownership.ts        # Resource ownership validation
│   ├── prisma.ts           # Prisma client singleton
│   └── env.ts              # Server-only environment variable validation
├── middleware.ts           # Route protection for dashboard routes
└── hooks/                  # Custom React hooks
```

### Database Schema

The application uses Prisma with PostgreSQL. Key models:

- **User**: Core user model with `credits` balance, `maxPatients` limit, `trialEndsAt`/`trialUsed` for trial tracking, and NextAuth relations (`Account`, `AuthSession`)
- **Patient**: Patient records with encrypted notes (`notesSecure`)
- **PatientSession**: Therapy sessions with encrypted content (`noteDocSecure`, `transcriptSecure`, `analysisJsonSecure`) and `creditsUsed` tracking
- **Subscription**: Stripe-based subscriptions with plans (SOLO/PRACTICE/PROFESSIONAL)
- **CreditTransaction**: Ledger for credit grants/consumption with atomicity guarantees
- **Consent**: Patient consent tracking
- **AuditLog**: Comprehensive audit trail for compliance

Enums: `Plan` (SOLO, PRACTICE, PROFESSIONAL), `SessionStatus` (DRAFT, PROCESSING, READY, ERROR), `CreditTransactionType` (GRANT, CONSUME, REFUND, ADJUSTMENT)

**Important**: Prisma client is generated to `generated/prisma` directory (not default `node_modules`).

### Security Architecture

#### Field-Level Encryption
- Implements envelope encryption using `crypto.ts`
- **KEK** (Key Encryption Key): 32-byte base64 key in `ENCRYPTION_KEK` env var
- **DEK** (Data Encryption Key): Random per-field, encrypted with KEK
- Algorithm: AES-256-GCM with authenticated encryption
- Encrypted fields return `EncryptedField` type with `{dek, dekIv, iv, ciphertext, v}`
- Used for: patient notes, session transcripts, analysis data

#### Authentication & Authorization
- NextAuth v5 with database sessions (not JWT)
- OAuth providers: Google and GitHub (conditionally enabled via env vars)
- Session includes user ID via custom callback
- Middleware protects dashboard routes: redirects to `/api/auth/signin` if not authenticated
- Resource ownership enforced via `ownership.ts` (`isOwner`, `assertOwner`)

#### Environment Variables
- `env.ts` validates required variables at runtime (server-only)
- Supports multiple database URL env var names for Vercel/Supabase compatibility
- Critical vars: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `ENCRYPTION_KEK`, Supabase URLs

### API Routes

All API routes follow REST conventions with proper HTTP methods:

- `GET/POST /api/patients` - List/create patients (user-scoped)
- `GET/PATCH/DELETE /api/patients/[id]` - Individual patient operations
- `GET/POST /api/sessions` - List/create patient sessions
- `GET/PATCH/DELETE /api/sessions/[id]` - Individual session operations
- `GET /api/health/*` - Health checks for env, crypto, db, auth

All API routes enforce ownership validation using `assertOwner` before mutations.

### Subscription & Billing (Credit-Based System v2)

The application uses a **credit-based pricing model** where AI analysis consumes credits:

- **Credits per minute**: ~1.27 credits/min of audio (based on Deepgram + Claude API costs)
- **Monthly credit allocation by plan**:
  - SOLO: 250 credits/month (~6 sessions of 30min) + 10 patient limit
  - PRACTICE: 1200 credits/month (~31 sessions)
  - PROFESSIONAL: 3200 credits/month (~84 sessions)
- **Trial system**: 14-day trial with 100 credits and 3 patient limit
- **Credit operations** (via `billing/credits.ts`):
  - `consumeCredits()`: Atomic deduction with transaction logging
  - `grantCredits()`: Add credits (purchase, refill, trial)
  - `getUserCredits()`: Get current balance
  - `calculateCreditsForAudio()`: Estimate cost before processing
- **Trial operations** (via `billing/trial.ts`):
  - `startTrial()`: Initialize 14-day trial
  - `isTrialActive()`: Check trial status
  - `convertTrialToPaid()`: Upgrade to paid plan

All credit operations use database transactions for consistency. The `CreditTransaction` model maintains a complete audit trail.

### Key Patterns

- **Path aliases**: `@/` maps to `src/`
- **Server-only modules**: `env.ts`, `crypto.ts` must never be imported in Client Components
- **Authentication**: Use `auth()` from `lib/auth/config.ts` to get session
- **Ownership checks**: Always call `assertOwner(user, resource)` before mutations
- **Encrypted fields**: Use `encryptField(value)` and `decryptField(encrypted)` from `crypto.ts`
- **Database**: Use `prisma` singleton from `lib/prisma.ts`. Prisma client generates to `generated/prisma/`
- **UI state**: Zustand stores for loading/toast (`useUIStore`) and plans (`usePlanStore`)
- **Credit consumption**: Always use `consumeCredits()` for atomic transactions with audit logging
- **Styling**: Tailwind with dark mode ('class' strategy), shadcn/ui with slate theme
- **i18n**: UI uses Spanish labels ("Pacientes", "Suscripción", "Ajustes")

### Health Check Endpoints

Monitor application health via `/api/health/*`:
- `/api/health/env` - Validates required environment variables
- `/api/health/crypto` - Tests encryption/decryption roundtrip
- `/api/health/db` - Tests database connectivity
- `/api/health/auth` - Tests NextAuth configuration

### Configuration Files

- `components.json` - shadcn/ui with RSC, default style, slate base
- `prisma/schema.prisma` - Database schema with pooled/direct URLs, generates to `generated/prisma/`
- `tailwind.config.js` - Tailwind with dark mode and content paths
- `tsconfig.json` - TypeScript with path aliases and strict mode
- `next.config.ts` - Next.js configuration
- Prettier configured with import sorting and Tailwind plugin
- `scripts/ci-build.mjs` - CI build orchestration (prebuild checks → prisma generate → migrate/push → next build)
- `scripts/ci-prebuild-check.mjs` - Validates DATABASE_URL (pooler:6543) and DIRECT_URL (db host:5432) format

### Manual Database Operations

**IMPORTANT**: Prisma migrations are not functional in this project. Database schema changes must be applied manually to Supabase:

1. **Schema Reset**: Use [prisma/reset.sql](prisma/reset.sql) to drop all tables, enums, and migrations
2. **Schema Creation**: Generate CREATE statements from `prisma/schema.prisma` and execute directly in Supabase SQL editor
3. **Schema Changes**: When modifying the schema:
   - Update `prisma/schema.prisma`
   - Generate full DROP and CREATE SQL scripts
   - Apply manually to Supabase
   - Run `npm run prisma:generate` to update TypeScript client

Scripts available:
- `scripts/reset-database.mjs` - Automated reset workflow
- `scripts/check-tables.mjs` - Verify current database state

**Never use `prisma migrate` or `prisma db push`** - these commands will fail or produce inconsistent state.

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.