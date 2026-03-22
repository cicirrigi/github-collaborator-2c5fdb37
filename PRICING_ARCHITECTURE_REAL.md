# 🎯 ARHITECTURA PRICING - REALITATE vs PERCEPȚIE

**Data:** 12 Martie 2026  
**Status:** CLARIFICARE COMPLETĂ după audit DB

---

## ⚠️ CORECTARE: Am înțeles GREȘIT în primul audit!

### Ce am presupus GREȘIT în DB_REALITY_CHECK.md:

❌ "Codul TypeScript nu folosește pricing din DB"  
❌ "Calculează totul local cu valori hardcoded"  
❌ "Trebuie să creăm RPC calculate_booking_price()"

### REALITATEA:

✅ **EXISTĂ UN PRICING ENGINE EXTERN pe Render.com**  
✅ **Tabelele pricing din DB sunt pentru MIGRARE, nu pentru producție**  
✅ **Frontend primește prețurile de la API EXTERN**

---

## 🏗️ ARHITECTURA REALĂ - PRICING FLOW

### 1️⃣ **EXTERNAL PRICING ENGINE** (https://pricing.vantage-lane.com)

```
┌─────────────────────────────────────────────────────────────┐
│  EXTERNAL PRICING API (Render.com)                          │
│  URL: https://pricing.vantage-lane.com/api/pricing/calculate│
│                                                              │
│  Input:                                                      │
│  - vehicle_category                                         │
│  - booking_type                                             │
│  - distance_miles                                           │
│  - duration_minutes                                         │
│  - pickup_datetime                                          │
│  - airport_code (optional)                                  │
│  - service_codes[]                                          │
│                                                              │
│  Output:                                                     │
│  {                                                          │
│    "success": true,                                         │
│    "pricing": {                                             │
│      "base_fare_pence": 7000,                              │
│      "distance_fee_pence": 2800,                           │
│      "time_fee_pence": 450,                                │
│      "airport_fee_pence": 500,                             │
│      "services_total_pence": 12000,                        │
│      "subtotal_pence": 22750,                              │
│      "vat_pence": 4550,                                    │
│      "total_pence": 27300,                                 │
│      "currency": "GBP"                                      │
│    }                                                         │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

### 2️⃣ **NEXT.JS PROXY** (/api/pricing/calculate)

```typescript
// src/app/api/pricing/calculate/route.ts
const RENDER_PRICING_API = 'https://pricing.vantage-lane.com';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Forward la External API
  const response = await fetch(`${RENDER_PRICING_API}/api/pricing/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return NextResponse.json(await response.json());
}
```

**SCOP:**

- Evită CORS issues (frontend nu poate chema direct Render API)
- Centralizează autentificare/logging (dacă e necesar)
- Permite schimbare URL fără rebuild frontend

### 3️⃣ **FRONTEND FLOW**

```
┌──────────────────────────────────────────────────────────┐
│  User interacționează cu Booking Wizard                 │
│  Step 1: Selectează vehicle, datetime, route            │
│  Step 2: Adaugă services (WiFi, champagne, etc)         │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│  Frontend calculează pricing prin API call               │
│                                                          │
│  const response = await fetch('/api/pricing/calculate', {│
│    method: 'POST',                                       │
│    body: JSON.stringify({                               │
│      vehicle_category: 'executive',                     │
│      booking_type: 'oneway',                            │
│      distance_miles: 15.2,                              │
│      duration_minutes: 45,                              │
│      service_codes: ['wifi', 'moet_brut']               │
│    })                                                    │
│  });                                                     │
│                                                          │
│  const { pricing } = await response.json();             │
│  // pricing.total_pence = 27300                         │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│  Frontend trimite booking cu pricingSnapshot             │
│                                                          │
│  await fetch('/api/bookings', {                         │
│    method: 'POST',                                       │
│    body: JSON.stringify({                               │
│      tripConfiguration: {...},                          │
│      bookingType: 'oneway',                             │
│      pricingSnapshot: {                                 │
│        finalPricePence: 27300, // From API             │
│        currency: 'GBP',                                 │
│        breakdown: pricing,                              │
│        routeData: {...}                                 │
│      }                                                   │
│    })                                                    │
│  });                                                     │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│  Backend /api/bookings/route.ts                         │
│                                                          │
│  const { pricingSnapshot } = req.body;                  │
│  let finalAmountPence = pricingSnapshot?.finalPricePence│
│                                                          │
│  // Store booking cu amount deja calculat               │
│  await supabase.rpc('create_booking_with_legs', {      │
│    p_booking: {                                         │
│      ...otherFields,                                    │
│      currency: pricingSnapshot.currency                 │
│    }                                                     │
│  });                                                     │
└──────────────────────────────────────────────────────────┘
```

---

## 📊 TABELELE PRICING DIN DB - SCOP REAL

### ✅ CLARIFICARE: Tabelele sunt pentru MIGRARE

```sql
-- Tabelele astea conțin date din VECHEA DB
-- Sunt folosite pentru IMPORT/SYNC, NU pentru calculul prețurilor!

pricing_vehicle_rates       -- Date din vechea DB
pricing_airport_fees        -- Date din vechea DB
pricing_time_rules          -- Date din vechea DB
pricing_zone_fees           -- Date din vechea DB
pricing_hourly_rules        -- Date din vechea DB
pricing_daily_rules         -- Date din vechea DB
pricing_return_rules        -- Date din vechea DB
pricing_fleet_discounts     -- Date din vechea DB
pricing_commission_profiles -- Date din vechea DB
pricing_versions            -- Versioning pentru migrare
pricing_rounding_rules      -- Date din vechea DB
```

**SCOP:**

1. **Migration tool** - Import din vechea bază de date
2. **Backup/Reference** - Păstrare date istorice
3. **Future sync** - Posibil sync periodic cu External API
4. **Audit trail** - Tracking schimbări pricing în timp

**NU SUNT FOLOSITE PENTRU:**

- ❌ Calculul prețurilor în production
- ❌ API responses către frontend
- ❌ Booking creation flow

---

## 🔍 CE ESTE HARDCODAT vs CE VINE DIN API

### ✅ VINE DIN EXTERNAL API (Correct):

```typescript
// Pricing calculation
- base_fare_pence
- per_mile_rates
- airport_fees
- time_multipliers (surge)
- service_items pricing
- VAT calculation
- Rounding rules
```

### ❌ HARDCODAT ÎN CODE (Probleme):

#### 1️⃣ **VAT Rate în mai multe locuri** (PROBLEMA #1 din audit)

```typescript
// ❌ HARDCODAT - app/api/bookings/route.ts:280
const vatRate = 0.2; // 20% VAT pentru services

// ❌ HARDCODAT - types/booking/index.ts:171
TAX_RATE: 0.18; // 18% VAT (GREȘIT!)

// ❌ HARDCODAT - PricingBreakdownCard.tsx:32
const VAT_RATE = 0.2; // 20% VAT

// ❌ HARDCODAT - PaymentCard.tsx:327
const subtotalNet = totalWithVat / 1.2; // Hardcoded 20%
```

**PROBLEMA:**

- VAT ar trebui să vină din External API sau config centralizat
- Nu ar trebui să fie în 4 locuri diferite
- 0.18 vs 0.2 inconsistency

#### 2️⃣ **Service Items - PARTIAL din DB** (CORECT!)

```typescript
// ✅ CORECT - service_items table în DB
await buildQuoteLineItems(serviceCodes, complimentarySet, configurations);
// Query-uiește service_items pentru prețuri

// DB: moet_brut = 12000 pence
// DB: wifi = 0 pence (complimentary)
```

**Acest flow E OK!** Services sunt în DB și se folosesc.

#### 3️⃣ **BOOKING_CONSTANTS - NU SE MAI FOLOSEȘTE** (Legacy)

```typescript
// ❌ LEGACY CODE - NU SE MAI FOLOSEȘTE în production!
export const BOOKING_CONSTANTS = {
  PRICING: {
    BASE_FARE: 8,  // IGNORAT - vine din External API
    BASE_RATE_PER_KM: {...},  // IGNORAT
    TAX_RATE: 0.18,  // IGNORAT (sau folosit greșit)
    HOURLY_RATES: {...},  // IGNORAT
  }
};
```

**OBSERVAȚIE:** Acest config NU se mai folosește pentru pricing real!

---

## 🚨 PROBLEME REALE IDENTIFICATE

### P0 - CRITICAL:

#### 1️⃣ **VAT Inconsistency** 🔴

```
PROBLEMA: VAT calculat în 4 locuri diferite cu 2 valori
- External API: probabil 20% (UK standard)
- Backend services: 20% (corect)
- BOOKING_CONSTANTS: 18% (greșit/legacy)
- Frontend display: 20% hardcoded

SOLUȚIE:
- Verifică ce returnează External API pentru VAT
- Șterge BOOKING_CONSTANTS.PRICING.TAX_RATE (nu se folosește)
- Creează TAX_CONFIG centralizat DOAR pentru display/validation
```

#### 2️⃣ **Duplicate VAT Calculation în Frontend** 🟠

```
PROBLEMA: PricingBreakdownCard.tsx și PaymentCard.tsx au același cod
- Ambele fac reverse VAT: amount / 1.2
- Cod duplicat în 2 componente

SOLUȚIE:
- Creează utility function calculateVATBreakdown()
- Refolosește în ambele componente
```

#### 3️⃣ **service_items + External API Overlap** 🟡

```
ÎNTREBARE: External API calculează și services?
- Frontend query-uiește service_items din DB
- Backend adaugă services la finalPricePence
- Dar External API primește service_codes[]?

RISC: Double-counting services dacă External API le include deja!

VERIFICARE NECESARĂ:
- Ce returnează External API când primește service_codes[]?
- Include prețurile services în total_pence?
- Sau returnează doar vehicle pricing și services se adaugă separat?
```

---

## 🎯 ARHITECTURA CORECTĂ - RECOMANDĂRI

### Scenario A: External API face TOTUL

```
┌────────────────────────────────────────┐
│  External API (Render)                 │
│  - Vehicle pricing                     │
│  - Airport fees                        │
│  - Time rules (surge)                  │
│  - Service items                       │
│  - VAT calculation                     │
│  - Rounding                            │
│  Returns: total_pence (all-inclusive)  │
└────────────────────────────────────────┘
           ↓
┌────────────────────────────────────────┐
│  Frontend                              │
│  - Primește total_pence                │
│  - Display breakdown                   │
│  - NU calculează nimic local           │
└────────────────────────────────────────┘
           ↓
┌────────────────────────────────────────┐
│  Backend /api/bookings                 │
│  - Primește pricingSnapshot            │
│  - Store finalPricePence AS-IS         │
│  - NU recalculează                     │
└────────────────────────────────────────┘
```

**AVANTAJE:**

- ✅ Single source of truth (External API)
- ✅ Zero business logic în frontend/backend
- ✅ Schimbări pricing = doar deploy External API
- ✅ Consistent across toate canalele

### Scenario B: Hybrid (CURRENT - RISC!)

```
┌────────────────────────────────────────┐
│  External API                          │
│  Returns: vehicle pricing DOAR         │
└────────────────────────────────────────┘
           ↓
┌────────────────────────────────────────┐
│  Frontend/Backend                      │
│  - Add service_items din DB            │
│  - Calculează VAT local (0.2)          │
│  - Total = API + services + VAT        │
└────────────────────────────────────────┘
```

**PROBLEME:**

- ❌ Business logic scattered
- ❌ Risc de inconsistency
- ❌ Maintenance nightmare

---

## 📋 ACȚIUNI NECESARE

### 1️⃣ **VERIFICARE URGENTĂ** (Astăzi)

```bash
# Test External API
curl -X POST https://pricing.vantage-lane.com/api/pricing/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_category": "executive",
    "booking_type": "oneway",
    "distance_miles": 10,
    "duration_minutes": 30,
    "service_codes": ["wifi", "moet_brut"]
  }'

# ÎNTREBĂRI:
# 1. Returnează service prices în total?
# 2. Include VAT în total_pence?
# 3. Ce breakdown returnează?
```

### 2️⃣ **DOCUMENTARE** (Urgent)

```markdown
TREBUIE DOCUMENTAT:

- External API contract (input/output)
- Ce calculează External API vs ce calculează local
- De ce există tabele pricing în DB dacă nu se folosesc
- Plan de migrare/sync între DB și External API
```

### 3️⃣ **CLEANUP CODE** (P1)

```typescript
// DELETE:
- BOOKING_CONSTANTS.PRICING (legacy, confusing)
- calculateBookingPricing.ts (dacă nu se folosește)
- estimateDistanceFare.ts (dacă nu se folosește)

// CREATE:
- TAX_CONFIG.ts (single source pentru UK VAT = 20%)
- calculateVATBreakdown() utility (reusable)

// REFACTOR:
- Consolidate VAT logic în 1 loc
```

### 4️⃣ **DB TABLES CLARIFICATION** (P2)

```sql
-- Add comments la tabele pentru claritate
COMMENT ON TABLE pricing_vehicle_rates IS
'Migration data from legacy DB.
NOT used for production pricing calculations.
External API (pricing.vantage-lane.com) is source of truth.
Used for: backup, audit trail, potential future sync.';

-- Similar pentru toate pricing_* tables
```

---

## 📝 CONCLUZII

### ✅ CORECT:

1. **EXISTĂ External Pricing Engine** pe Render.com
2. **Frontend primește prețuri de la API**, nu calculează hardcoded
3. **Tabelele pricing din DB** sunt pentru migrare, nu production

### ❌ PROBLEME:

1. **VAT hardcodat în 4 locuri** cu 2 valori diferite (18% vs 20%)
2. **Unclear**: External API include services sau nu?
3. **Legacy code** (BOOKING_CONSTANTS.PRICING) creează confuzie
4. **Duplicate logic** pentru VAT breakdown în 2 componente

### 🎯 NEXT STEPS:

1. ✅ Test External API pentru a înțelege exact ce returnează
2. ✅ Documentare contract External API
3. ✅ Cleanup legacy BOOKING_CONSTANTS
4. ✅ Consolidate VAT logic
5. ✅ Add DB table comments pentru claritate

---

**Scuze pentru confuzia din primul audit!** Acum arhitectura e clară.

**Întrebare pentru tine:**
Vrei să testăm External API împreună ca să vedem exact ce returnează pentru services și VAT?
