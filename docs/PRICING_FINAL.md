# 💰 PRICING DEFINITIVO — CLINESA

**Versión:** 2.0 (Ajustada)
**Fecha:** 2025-09-29
**Modelo:** Créditos consumibles por uso de IA
**Naming:** SOLO / PRACTICE / PROFESSIONAL

---

## 🎯 ESTRUCTURA DE PLANES FINAL

### **Plan SOLO** (antes "FREE")
```yaml
Precio mensual:        €9/mes
Créditos/mes:          250 créditos
Equivalente sesiones:  ~6 sesiones de 30min
Pacientes:             Hasta 10 pacientes
Sesiones almacenadas:  Ilimitadas
Storage audio:         200 MB
Análisis IA:           ✅ SÍ (consume créditos)
Renovación créditos:   Mensual (250 nuevos)
Carry-over créditos:   ✅ SÍ (no expiran)
Soporte:               Email (48-72h)
```

**Target:** Terapeuta independiente, práctica ocasional o inicio.
**Perfil:** 5-10 pacientes, 1-2 sesiones/semana.

**Margen:**
- Costo IA real (6.5 sesiones × €0.38): **€2.47**
- Costo Stripe (2.9% + €0.25): **€0.51**
- Costo infra: **€0.50**
- **Margen bruto**: **€5.52** (61%) ✅

**Restricciones vs PRACTICE:**
- ❌ Solo 10 pacientes máx
- ❌ Storage limitado (200 MB vs 2 GB)
- ❌ Soporte más lento
- ❌ No exportación masiva

---

### **Plan PRACTICE** (antes "STARTER")
```yaml
Precio mensual:        €29/mes
Créditos/mes:          1,200 créditos
Equivalente sesiones:  ~31 sesiones de 30min
Pacientes:             Ilimitados
Sesiones almacenadas:  Ilimitadas
Storage audio:         3 GB
Análisis IA:           ✅ SÍ (consume créditos)
Créditos extras:       €15 por 1,000 créditos
Renovación créditos:   Mensual (1,200 nuevos)
Carry-over créditos:   ✅ SÍ (no expiran)
Soporte:               Email prioritario (24h)
Exportación:           ✅ CSV
```

**Target:** Consultorio en crecimiento, profesional establecido.
**Perfil:** 20-40 pacientes, práctica regular.

**Margen:**
- Costo IA real (31 sesiones × €0.38): **€11.78**
- Costo Stripe (2.9% + €0.25): **€1.09**
- Costo infra: **€1.50**
- **Margen bruto**: **€14.63** (50%) ✅

**Mejoras vs SOLO:**
- ✅ Pacientes ilimitados
- ✅ 15× más storage (3 GB vs 200 MB)
- ✅ Soporte prioritario
- ✅ Exportación CSV
- ✅ 20% más créditos/€ (1,200 créditos vs 250)

---

### **Plan PROFESSIONAL** (antes "PRO")
```yaml
Precio mensual:        €49/mes
Créditos/mes:          3,200 créditos
Equivalente sesiones:  ~84 sesiones de 30min
Pacientes:             Ilimitados
Sesiones almacenadas:  Ilimitadas
Storage audio:         10 GB
Análisis IA:           ✅ SÍ (consume créditos)
Créditos extras:       €12 por 1,000 créditos (20% off)
Renovación créditos:   Mensual (3,200 nuevos)
Carry-over créditos:   ✅ SÍ (no expiran)
Soporte:               Email prioritario (<12h) + Chat
Exportación:           ✅ CSV + JSON + PDF
Integraciones:         ✅ API access (beta)
White-label:           ✅ Logo personalizado
```

**Target:** Profesional full-time, consultorio intensivo.
**Perfil:** 50-80 pacientes, múltiples sesiones diarias.

**Margen:**
- Costo IA real (84 sesiones × €0.38): **€31.92**
- Costo Stripe (2.9% + €0.25): **€1.67**
- Costo infra: **€2.50**
- **Margen bruto**: **€12.91** (26%) ✅

**Mejoras vs PRACTICE:**
- ✅ 2.7× más créditos (3,200 vs 1,200)
- ✅ 3× más storage (10 GB vs 3 GB)
- ✅ Soporte chat en tiempo real
- ✅ Exportación avanzada (JSON + PDF)
- ✅ API access (beta)
- ✅ Logo personalizado

---

## 🆓 PLAN GRATUITO (Trial 14 días)

Para no perder usuarios que quieren probar antes de pagar, mantener un **trial de 14 días**:

```yaml
Duración:              14 días (una sola vez)
Créditos:              100 créditos (2-3 sesiones)
Pacientes:             Hasta 3
Storage:               50 MB
Análisis IA:           ✅ SÍ
Tarjeta requerida:     ❌ NO
Upgrade manual:        A SOLO, PRACTICE o PROFESSIONAL
```

**Post-trial:**
- Usuario debe elegir plan de pago
- O cuenta queda en "read-only" (puede ver datos, no crear nuevos)

---

## 📊 COMPARATIVA DE PLANES

| Feature | SOLO | PRACTICE | PROFESSIONAL |
|---------|------|----------|--------------|
| **Precio/mes** | €9 | €29 | €49 |
| **Créditos/mes** | 250 | 1,200 | 3,200 |
| **Sesiones ~30min** | ~6 | ~31 | ~84 |
| **Pacientes máx** | 10 | ∞ | ∞ |
| **Storage audio** | 200 MB | 3 GB | 10 GB |
| **Costo/sesión** | €1.50 | €0.94 | €0.58 |
| **Soporte** | 48-72h | <24h | <12h + Chat |
| **Exportación** | ❌ | CSV | CSV+JSON+PDF |
| **API access** | ❌ | ❌ | ✅ Beta |
| **White-label** | ❌ | ❌ | ✅ |
| **Margen bruto** | 61% | 50% | 26% |

---

## 🎁 PACKS DE CRÉDITOS (Add-ons)

| Pack | Créditos | Precio | €/crédito | Sesiones ~30min |
|------|----------|--------|-----------|-----------------|
| **Pack 500** | 500 | €10 | €0.020 | ~13 |
| **Pack 1,200** | 1,200 | €22 | €0.018 | ~31 |
| **Pack 3,000** | 3,000 | €48 | €0.016 | ~79 |

**Uso:** Para usuarios que superan su cuota mensual.

---

## 💡 LÓGICA DE UPSELL

### **Trial → SOLO:**
- Banner día 7: "Te quedan 7 días. Continúa con SOLO por solo €9/mes"
- Email día 10: "4 días para decidir. SOLO incluye 250 créditos/mes"
- Día 14: Modal bloqueante con 3 opciones de planes

### **SOLO → PRACTICE:**

**Triggers:**
1. Usuario alcanza 10 pacientes → "Desbloquea pacientes ilimitados con PRACTICE"
2. Consume 200 créditos (80%) → "Actualiza a PRACTICE y obtén 1,200 créditos/mes"
3. Storage >150 MB → "Amplía a 3 GB con PRACTICE"

**CTA:** "Actualizar por solo €20/mes adicionales"

### **PRACTICE → PROFESSIONAL:**

**Triggers:**
1. Consume >1,000 créditos/mes durante 2 meses → "Ahorra con PROFESSIONAL"
2. Compra 2+ packs de créditos → "PROFESSIONAL incluye 3,200 créditos base"
3. Storage >2.5 GB → "10 GB con PROFESSIONAL"

**CTA:** "Actualizar por €20/mes y obtén 2,000 créditos extra"

---

## 📈 PROYECCIÓN FINANCIERA

### Escenario realista (250 usuarios a 12 meses)

| Plan | Usuarios | MRR | Costo IA/mes | Margen/mes |
|------|----------|-----|--------------|------------|
| **Trial** | 50 | €0 | €190 | -€190 |
| **SOLO** | 120 | €1,080 | €296 | €784 |
| **PRACTICE** | 60 | €1,740 | €707 | €1,033 |
| **PROFESSIONAL** | 20 | €980 | €638 | €342 |
| **TOTAL** | 250 | **€3,800** | €1,831 | **€1,969** (52%) |

**ARR:** €45,600
**CAC objetivo:** <€30 (Google Ads + content marketing)
**LTV/CAC:** >5

**Conversión estimada:**
- Trial → SOLO: 40%
- SOLO → PRACTICE: 15% (18 usuarios)
- PRACTICE → PROFESSIONAL: 10% (6 usuarios)

---

## 🎯 VENTAJAS COMPETITIVAS

| Feature | CLINESA | SimplePractice | TherapyNotes |
|---------|---------|----------------|--------------|
| **Precio inicio** | €9 | $29 | $49 |
| **IA incluida** | ✅ | ❌ | ❌ |
| **Transcripción audio** | ✅ | ❌ | ❌ |
| **Pay-per-use** | ✅ | ❌ (flat) | ❌ (flat) |
| **Créditos no expiran** | ✅ | N/A | N/A |
| **Trial sin tarjeta** | ✅ | ❌ | ❌ |

---

## 🔧 CAMBIOS TÉCNICOS REQUERIDOS

### 1. **Actualizar `prisma/schema.prisma`:**

```typescript
enum Plan {
  SOLO          // antes FREE
  PRACTICE      // antes STARTER
  PROFESSIONAL  // antes PRO
}

model User {
  credits: Int @default(0) // Ya no 100 por defecto (trial aparte)
  maxPatients: Int? // NULL = ilimitado, 10 para SOLO
  trialEndsAt: DateTime? // Para gestionar trial de 14 días
  trialUsed: Boolean @default(false)
}
```

### 2. **Actualizar `src/lib/billing/credits.ts`:**

```typescript
export const PLAN_CREDITS = {
  SOLO: 250,           // antes FREE: 100
  PRACTICE: 1200,      // antes STARTER: 1000
  PROFESSIONAL: 3200,  // antes PRO: 3000
} as const

export const STORAGE_LIMITS = {
  SOLO: 200 * 1024 * 1024,            // 200 MB
  PRACTICE: 3 * 1024 * 1024 * 1024,   // 3 GB
  PROFESSIONAL: 10 * 1024 * 1024 * 1024, // 10 GB
} as const

export const MAX_PATIENTS = {
  SOLO: 10,
  PRACTICE: null,  // ilimitado
  PROFESSIONAL: null,
} as const
```

### 3. **Crear helper para trial:**

`src/lib/billing/trial.ts`:
```typescript
export async function startTrial(userId: string) {
  const trialEnd = new Date()
  trialEnd.setDate(trialEnd.getDate() + 14)

  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: 100,
      trialEndsAt: trialEnd,
      trialUsed: true,
      maxPatients: 3,
    }
  })
}

export async function isTrialActive(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { trialEndsAt: true }
  })
  return user?.trialEndsAt ? user.trialEndsAt > new Date() : false
}
```

### 4. **Añadir check de límite de pacientes:**

En `/api/patients/route.ts` POST:
```typescript
const plan = await getUserPlan(userId)
const maxPatients = MAX_PATIENTS[plan]

if (maxPatients !== null) {
  const currentCount = await prisma.patient.count({ where: { userId } })
  if (currentCount >= maxPatients) {
    return NextResponse.json({
      error: "PATIENT_LIMIT_REACHED",
      message: `Plan ${plan} limitado a ${maxPatients} pacientes. Actualiza a PRACTICE para pacientes ilimitados.`
    }, { status: 402 })
  }
}
```

---

## 💰 PRICING EN STRIPE

### Productos a crear:

1. **SOLO Monthly**
   - Price: €9/mes
   - Price ID: `price_solo_monthly`
   - Metadata: `{ plan: "SOLO", credits: 250 }`

2. **PRACTICE Monthly**
   - Price: €29/mes
   - Price ID: `price_practice_monthly`
   - Metadata: `{ plan: "PRACTICE", credits: 1200 }`

3. **PROFESSIONAL Monthly**
   - Price: €49/mes
   - Price ID: `price_professional_monthly`
   - Metadata: `{ plan: "PROFESSIONAL", credits: 3200 }`

4. **Credit Pack 500**
   - Price: €10 (one-time)
   - Price ID: `price_credits_500`
   - Metadata: `{ credits: 500 }`

5. **Credit Pack 1200**
   - Price: €22 (one-time)
   - Price ID: `price_credits_1200`
   - Metadata: `{ credits: 1200 }`

6. **Credit Pack 3000**
   - Price: €48 (one-time)
   - Price ID: `price_credits_3000`
   - Metadata: `{ credits: 3000 }`

---

## 🎨 COPY PARA LANDING/DASHBOARD

### Headline principal:
> **Gestiona tu práctica terapéutica con IA**
> Transcripción automática, análisis inteligente, solo pagas por lo que usas.

### Pricing section:

```
Elige el plan perfecto para tu práctica

[SOLO]         [PRACTICE ⭐]      [PROFESSIONAL]
€9/mes         €29/mes            €49/mes
───────────────────────────────────────────────
✓ 250 créditos  ✓ 1,200 créditos  ✓ 3,200 créditos
✓ ~6 sesiones   ✓ ~31 sesiones    ✓ ~84 sesiones
✓ 10 pacientes  ✓ Ilimitados      ✓ Ilimitados
✓ 200 MB        ✓ 3 GB storage    ✓ 10 GB storage
✓ IA incluida   ✓ Exportar CSV    ✓ API access
                ✓ Soporte 24h     ✓ White-label

[Empezar]      [Empezar]         [Empezar]

💡 Prueba gratis 14 días. Sin tarjeta.
```

### FAQ pricing:

**¿Qué son los créditos?**
> 1 crédito = €0.01. Cada minuto de audio analizado consume ~1.3 créditos. Una sesión de 30 minutos = 38 créditos.

**¿Los créditos expiran?**
> No. Los créditos no expiran y se acumulan entre meses.

**¿Puedo cambiar de plan?**
> Sí, en cualquier momento. Al hacer upgrade, tus créditos se mantienen. Al hacer downgrade, también.

**¿Qué pasa si me quedo sin créditos?**
> Puedes comprar packs adicionales (€10-€48) o actualizar tu plan.

---

## ✅ RESUMEN DE CAMBIOS

### Naming:
- ❌ FREE → ✅ **SOLO** (€9/mes)
- ❌ STARTER → ✅ **PRACTICE** (€29/mes)
- ❌ PRO → ✅ **PROFESSIONAL** (€49/mes)

### Créditos ajustados:
- SOLO: 250 créditos (~6 sesiones)
- PRACTICE: 1,200 créditos (~31 sesiones)
- PROFESSIONAL: 3,200 créditos (~84 sesiones)

### Restricciones SOLO:
- ✅ Máximo 10 pacientes
- ✅ Storage 200 MB (reducido)
- ✅ Sin exportación
- ✅ Soporte 48-72h

### Trial gratuito:
- ✅ 14 días sin tarjeta
- ✅ 100 créditos iniciales
- ✅ Máximo 3 pacientes

---

**¿Apruebas esta versión?** Si sí, procedo a:
1. Actualizar schema Prisma
2. Actualizar helpers de billing
3. Crear checks de límites
4. Preparar integración Stripe