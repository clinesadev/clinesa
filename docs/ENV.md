# Variables necesarias para Prisma CLI

Añade al final de tu `.env` (y/o `.env.local`) estas dos líneas con tus valores REALES:

DATABASE_URL="postgres://postgres.qzcaiooarrggvekrjhli:RqFD1C4Y7OIdM8GB@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgres://postgres.qzcaiooarrggvekrjhli:RqFD1C4Y7OIdM8GB@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

> La CLI de Prisma requiere estas variables explícitas. No subas `.env` a git.

## Clave de Cifrado

### ENCRYPTION_KEK

Para cifrar campos médicos sensibles, necesitas generar una **Key Encryption Key (KEK)** de 32 bytes en Base64:

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Añade el resultado a tu `.env`:
```env
ENCRYPTION_KEK="tu_clave_base64_de_32_bytes_aqui"
```

⚠️ **NUNCA expongas esta clave en el cliente** - solo se usa en servidor para cifrado de campos médicos.

⚠️ **En producción**, almacena esta clave en un gestor de secretos (Vercel Environment Variables, AWS Secrets Manager, etc.).