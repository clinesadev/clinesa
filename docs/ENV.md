# Variables necesarias para Prisma CLI

Añade al final de tu `.env` (y/o `.env.local`) estas dos líneas con tus valores REALES:

DATABASE_URL="postgres://postgres.qzcaiooarrggvekrjhli:RqFD1C4Y7OIdM8GB@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgres://postgres.qzcaiooarrggvekrjhli:RqFD1C4Y7OIdM8GB@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

> La CLI de Prisma requiere estas variables explícitas. No subas `.env` a git.