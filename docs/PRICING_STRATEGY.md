# 💰 ESTRATEGIA DE PRICING — CLINESA

**Fecha:** 2025-09-29
**Modelo:** Créditos consumibles por uso de IA
**Moneda:** EUR (€)

---

## 📊 ANÁLISIS DE COSTOS REALES

### Proveedores de IA

| Proveedor | Servicio | Costo unitario | Notas |
|-----------|----------|----------------|-------|
| **Deepgram** | Transcripción audio (Nova-2, español) | **$0.0125/minuto** | ~€0.0115/min |
| **Anthropic Claude 3.5 Sonnet** | Análisis IA | **$3/1M tokens input** | ~6k tokens/sesión |
| **Anthropic Claude 3.5 Sonnet** | Análisis IA | **$15/1M tokens output** | ~1k tokens/sesión |

### Costo por sesión analizada

**Sesión tipo: 30 minutos de audio**

```
Transcripción:  30 min × $0.0125 = $0.375
Análisis input: 6k tokens × $3/1M  = $0.018
Análisis output: 1k tokens × $15/1M = $0.015
───────────────────────────────────────────
TOTAL:                             $0.408 (~€0.38)
```

**Conversión a créditos: 1 crédito = €0.01**
- **Sesión 30 min = 38 créditos**
- **Sesión 15 min = 19 créditos**
- **Sesión 60 min = 76 créditos**

---

## 🎯 PLANES DE SUSCRIPCIÓN

### **Plan FREE (Freemium)**

```yaml
Precio mensual:        €0 (gratis)
Créditos/mes:          100 créditos
Equivalente sesiones:  ~2-3 sesiones de 30min
Pacientes:             Ilimitados
Sesiones almacenadas:  Ilimitadas
Storage audio:         100 MB
Análisis IA:           ✅ SÍ (consume créditos)
Renovación créditos:   Automática cada mes
Carry-over créditos:   ✅ SÍ (no expiran)
```

**Objetivo:** Captar usuarios, probar producto sin riesgo.
**Perfil:** Terapeuta ocasional, <5 pacientes/mes.

**Margen:**
- Costo IA real (2.6 sesiones × €0.38): **€1.00**
- Margen: **-€1.00** (loss leader)

---

### **Plan STARTER (Profesional ligero)**

```yaml
Precio mensual:        €19/mes
Créditos/mes:          1,000 créditos
Equivalente sesiones:  ~26 sesiones de 30min
Pacientes:             Ilimitados
Sesiones almacenadas:  Ilimitadas
Storage audio:         2 GB
Análisis IA:           ✅ SÍ (consume créditos)
Créditos extras:       €15 por 1,000 créditos
Renovación créditos:   Mensual (1,000 nuevos)
Carry-over créditos:   ✅ SÍ (no expiran)
Soporte:               Email estándar
```

**Objetivo:** Monetizar terapeutas con práctica establecida.
**Perfil:** 20-30 pacientes/mes, ~1 sesión/semana por paciente.

**Margen:**
- Costo IA real (26 sesiones × €0.38): **€9.88**
- Costo Stripe (2.9% + €0.25): **€0.80**
- Costo infra (estimado): **€1.00**
- **Margen bruto**: **€7.32** (39%)

**ROI:**
- LTV (12 meses): €228
- Margen anual: **€87.84**

---

### **Plan PRO (Profesional intensivo)**

```yaml
Precio mensual:        €49/mes
Créditos/mes:          3,000 créditos
Equivalente sesiones:  ~79 sesiones de 30min
Pacientes:             Ilimitados
Sesiones almacenadas:  Ilimitadas
Storage audio:         10 GB
Análisis IA:           ✅ SÍ (consume créditos)
Créditos extras:       €12 por 1,000 créditos (descuento)
Renovación créditos:   Mensual (3,000 nuevos)
Carry-over créditos:   ✅ SÍ (no expiran)
Soporte:               Email prioritario (<24h)
Exportación datos:     ✅ SÍ (CSV/JSON)
```

**Objetivo:** Maximizar ARPU de terapeutas full-time.
**Perfil:** 40-60 pacientes/mes, consultorio establecido, múltiples sesiones/semana.

**Margen:**
- Costo IA real (79 sesiones × €0.38): **€30.02**
- Costo Stripe (2.9% + €0.25): **€1.67**
- Costo infra (estimado): **€2.00**
- **Margen bruto**: **€15.31** (31%)

**ROI:**
- LTV (12 meses): €588
- Margen anual: **€183.72**

---

## 🎁 PACKS DE CRÉDITOS (Sin suscripción)

Para usuarios que superan su cuota mensual sin querer upgrade permanente.

| Pack | Créditos | Precio | €/crédito | Sesiones ~30min | Ahorro |
|------|----------|--------|-----------|-----------------|--------|
| **Pack 500** | 500 | €10 | €0.020 | ~13 | 0% |
| **Pack 1,000** | 1,000 | €18 | €0.018 | ~26 | 10% |
| **Pack 3,000** | 3,000 | €45 | €0.015 | ~79 | 25% |

**Características:**
- ✅ Los créditos NO expiran
- ✅ Se suman al balance existente
- ✅ Pueden comprarse en cualquier momento
- ✅ No requieren suscripción activa

---

## 💡 MODELO DE CRÉDITOS

### Cálculo dinámico por duración

```typescript
const CREDITS_PER_MINUTE = 1.27 // créditos/minuto
const creditsNeeded = Math.ceil(audioMinutes * CREDITS_PER_MINUTE)
```

### Ejemplos:

| Duración audio | Créditos | Costo usuario (FREE) | Costo IA real |
|----------------|----------|----------------------|---------------|
| 10 min | 13 | €0.13 | €0.13 |
| 15 min | 19 | €0.19 | €0.19 |
| 30 min | 38 | €0.38 | €0.38 |
| 45 min | 57 | €0.57 | €0.57 |
| 60 min | 76 | €0.76 | €0.76 |

**Reglas:**
1. Créditos NO expiran (carry-over ilimitado)
2. Renovación mensual según plan activo
3. Downgrade: mantiene créditos acumulados
4. Cancelación: mantiene créditos (sin renovación)

---

## 📈 PROYECCIONES DE NEGOCIO

### Escenario conservador (100 usuarios a 12 meses)

| Métrica | FREE | STARTER | PRO | TOTAL |
|---------|------|---------|-----|-------|
| **Usuarios** | 60 | 30 | 10 | 100 |
| **MRR** | €0 | €570 | €490 | **€1,060** |
| **Costos IA/mes** | €60 | €296 | €300 | €656 |
| **Margen bruto/mes** | -€60 | €274 | €190 | **€404** (38%) |
| **ARR** | €0 | €6,840 | €5,880 | **€12,720** |

**Conversión FREE → STARTER estimada:** 10% (6 usuarios)

### Escenario optimista (500 usuarios a 24 meses)

| Métrica | FREE | STARTER | PRO | TOTAL |
|---------|------|---------|-----|-------|
| **Usuarios** | 250 | 200 | 50 | 500 |
| **MRR** | €0 | €3,800 | €2,450 | **€6,250** |
| **Costos IA/mes** | €250 | €1,976 | €1,501 | €3,727 |
| **Margen bruto/mes** | -€250 | €1,824 | €949 | **€2,523** (40%) |
| **ARR** | €0 | €45,600 | €29,400 | **€75,000** |

**Conversión FREE → STARTER estimada:** 20% (50 usuarios)

---

## 🔄 ESTRATEGIA DE UPSELL

### Triggers automáticos:

1. **Usuario FREE con 80 créditos consumidos (80%)**
   - Banner: "Te quedan 20 créditos. Actualiza a STARTER por €19/mes"

2. **Usuario FREE con 0 créditos**
   - Modal bloqueante: "Sin créditos. Actualiza a STARTER o compra pack de 500"

3. **Usuario STARTER con 200 créditos (80%)**
   - Banner: "Actualiza a PRO por €30/mes adicionales y obtén 2,000 créditos extra"

4. **Usuario PRO que compra packs frecuentemente (>2 packs/mes)**
   - Email: "Tu uso sugiere que necesitas más créditos incluidos. Contáctanos para plan Enterprise"

---

## 🎁 PROMOCIONES LANZAMIENTO

### Promo 1: Early Bird (primeros 100 usuarios)
- **STARTER**: €14/mes (26% off) de por vida
- **PRO**: €39/mes (20% off) de por vida
- **Duración**: Permanente mientras mantengan suscripción

### Promo 2: Refer-a-friend
- **Referidor**: 500 créditos gratis por cada usuario que se suscriba
- **Referido**: 200 créditos extra al suscribirse (STARTER/PRO)

### Promo 3: Anual (lanzamiento 2026)
- **STARTER anual**: €190 (€15.83/mes, 17% off)
- **PRO anual**: €490 (€40.83/mes, 17% off)

---

## 🛡️ MITIGACIÓN DE RIESGOS

### Abuso de créditos FREE:
- **Límite**: 1 cuenta FREE por email verificado
- **Rate limit**: Máximo 5 análisis IA por día (FREE)
- **Revisión manual**: Cuentas con >10 sesiones/día

### Fraude de pagos:
- **Stripe Radar**: Activado para detección de fraude
- **Verificación email**: Obligatoria antes de primer análisis
- **Límite new users**: 3 análisis gratis, luego verificación

### Escalada de costos IA:
- **Alertas**: Si costo IA mensual > 45% MRR
- **Ajuste precios**: Revisión trimestral de CREDITS_PER_MINUTE
- **Provider backup**: OpenAI Whisper como alternativa a Deepgram

---

## 📊 MÉTRICAS CLAVE (KPIs)

| KPI | Target Mes 3 | Target Mes 6 | Target Año 1 |
|-----|--------------|--------------|--------------|
| **MRR** | €500 | €2,000 | €6,000 |
| **Usuarios totales** | 50 | 200 | 500 |
| **Conversión FREE→PAID** | 8% | 12% | 15% |
| **Churn mensual** | <8% | <5% | <4% |
| **CAC** | <€50 | <€40 | <€35 |
| **LTV/CAC** | >3 | >4 | >5 |
| **Margen bruto** | 35% | 38% | 40% |

---

## 🚀 ROADMAP DE PRICING

### Q1 2025 (MVP)
- ✅ Lanzar 3 planes (FREE, STARTER, PRO)
- ✅ Sistema de créditos funcional
- ✅ Packs de créditos one-time

### Q2 2025
- [ ] Plan ENTERPRISE (€199/mes, 15,000 créditos, multi-usuario)
- [ ] API access para integraciones
- [ ] Descuentos anuales

### Q3 2025
- [ ] Programa de referidos
- [ ] Marketplace de add-ons (análisis avanzados, reports AI)

### Q4 2025
- [ ] White-label para clínicas (€999/mes)
- [ ] Modelo de revenue-share con asociaciones profesionales

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### Cambios en DB (Prisma)
```typescript
model User {
  credits: Int @default(100)
  // ...
}

model PatientSession {
  audioDurationMin: Int?
  creditsUsed: Int?
  // ...
}

model CreditTransaction {
  type: CreditTransactionType
  amount: Int
  balance: Int
  reason: String?
  // ...
}

enum Plan {
  FREE
  STARTER
  PRO
}
```

### Helpers creados
- `src/lib/billing/credits.ts`
  - `calculateCreditsForAudio(minutes)`
  - `consumeCredits({ userId, amount, sessionId })`
  - `grantCredits({ userId, amount, reason })`
  - `getUserCredits(userId)`
  - `hasEnoughCredits(userId, amount)`

### Integración Stripe
- 2 productos en Stripe:
  - **STARTER**: `price_starter_monthly` (€19)
  - **PRO**: `price_pro_monthly` (€49)
- Webhook procesa:
  - `customer.subscription.created` → grant créditos según plan
  - `invoice.payment_succeeded` → monthly refill de créditos
  - `customer.subscription.deleted` → stop refill (mantener créditos)

---

## 💼 COMPARATIVA COMPETENCIA

| Producto | Modelo pricing | Precio/mes | Transcripción | Análisis IA |
|----------|----------------|------------|---------------|-------------|
| **CLINESA** | Créditos consumibles | €19-€49 | ✅ | ✅ |
| **Talkspace** | Flat fee | $65-$99 | ❌ | ❌ |
| **BetterHelp** | Flat fee | $60-$90 | ❌ | ❌ |
| **SimplePractice** | Flat fee + add-ons | $29-$99 | ❌ | ❌ |
| **TherapyNotes** | Flat fee | $49-$69 | ❌ | ❌ |

**Ventaja competitiva:**
- ✅ Único con IA incluida en el precio
- ✅ Pay-per-use (no desperdicio)
- ✅ Créditos no expiran

---

## 📞 CONTACTO Y SOPORTE

**Preguntas sobre pricing:** pricing@clinesa.com
**Solicitar plan Enterprise:** sales@clinesa.com
**Soporte técnico:** support@clinesa.com

---

**Última actualización:** 2025-09-29
**Próxima revisión:** 2025-12-29