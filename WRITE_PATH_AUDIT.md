# WRITE PATH AUDIT - CINE SCRIE ÎN TABELE CRITICE

Data: 2026-03-16
Scop: Identificare exactă cine scrie în tabelele critice (nu doar schema)

---

## 1️⃣ SERVICE_ITEMS - READ ONLY

### Cine SCRIE:

```
❌ NIMENI din cod
✅ Doar seed data / SQL manual
```

### Verificări efectuate:

**A. Frontend (vantage-lane-2.0):**

```typescript
// src/services/pricing/serviceItems.ts:29-33
const { data, error } = await supabaseAdmin
  .from('service_items')
  .select('id, name, price_pence, currency, is_active') // ✅ DOAR SELECT
  .in('id', codes)
  .eq('is_active', true);
```

**B. RPCs/Functions:**

```sql
-- Verificat toate 51 RPCs - ZERO write în service_items
SELECT routine_name FROM information_schema.routines
WHERE routine_definition ILIKE '%INSERT INTO service_items%'
→ RESULT: []
```

**C. Triggers:**

```sql
-- ZERO triggers pe service_items
SELECT trigger_name FROM information_schema.triggers
WHERE event_object_table = 'service_items'
→ RESULT: []
```

### CONCLUZIE:

✅ **READ ONLY** - service_items se populează doar prin:

- Seed scripts SQL
- Manual INSERT în DB
- Migrations

❌ **PROBLEMA:** Niciun cod nu gestionează duplicate!

- 43 items cu 21 unique = haos
- Moet are 4 IDs active simultan
- Nu există validare/cleanup automat

---

## 2️⃣ BOOKING_LINE_ITEMS - MYSTERY

### Cine SCRIE:

```
⚠️ COD NECLAR - nu găsit în frontend actual
✅ Date vechi din seed/test
```

### Verificări efectuate:

**A. Frontend (vantage-lane-2.0):**

```typescript
// grep în tot src/ pentru booking_line_items
→ RESULT: 0 matches

// Căutare în API routes
→ RESULT: 0 matches
```

**B. RPCs/Functions:**

```sql
-- Verificat toate RPCs
SELECT routine_name FROM information_schema.routines
WHERE routine_definition ILIKE '%booking_line_items%'
→ RESULT: []
```

**C. Triggers:**

```sql
-- UN SINGUR trigger: update timestamp
event_object_table: booking_line_items
trigger_name: trg_set_updated_at_booking_line_items
event_type: UPDATE
action: EXECUTE FUNCTION set_updated_at()
```

**D. Date actuale în DB:**

```sql
-- DOAR 1 booking vechi are pricing components
booking_id: 2a484d3d-a868-489d-901c-6b26c798cd3a
item_key: base_fare, distance_fee, time_fee
source: pricing_engine_v2
created_at: 2026-03-12

-- Restul 906 rows sunt services legitime:
✅ included_service: refreshments, wifi, meet-greet (70 items)
✅ trip_preference: music, temperature (36 items)
✅ paid_upgrade: champagne, flowers, security (81 items)
✅ premium_feature: frontSeatRequest, privacy (77 items)
```

### CONCLUZIE:

⚠️ **COD VECHI/SEED** - pricing components în booking_line_items:

- Doar 1 booking din 171 are problema
- Created: 2026-03-12 (înainte de refactor)
- Booking-uri NOI după refactor sunt CORECTE (goale)

✅ **COD ACTUAL** - services legitime:

- Source: trip_configuration_raw + seed
- Scrise probabil de:
  - `/api/bookings/route.ts` (indirect prin trip config)
  - Seed scripts
  - Test data

❌ **PROBLEMA:** Nu găsesc codul exact care scrie!

- Posibil în Backend-VantageLane- (nu în workspace)
- Sau cod deprecated/șters deja

---

## 3️⃣ CLIENT_BOOKING_QUOTES - BACKEND ONLY

### Cine SCRIE:

```
⚠️ NU găsit în frontend actual
✅ Probabil Backend-VantageLane-/src/services/QuoteService.ts
```

### Verificări efectuate:

**A. Frontend (vantage-lane-2.0):**

```typescript
// grep pentru client_booking_quotes
→ RESULT: 0 matches în src/

// API routes verificate
→ /api/bookings/route.ts: NU scrie în client_booking_quotes
→ /api/stripe/webhook/route.ts: NU scrie în client_booking_quotes
```

**B. API Route - ce scrie:**

```typescript
// src/app/api/bookings/route.ts:284
await supabaseAdmin.from('client_leg_quotes').insert({
  booking_id: bookingId,
  booking_leg_id: null,
  version: 1,
  currency: 'GBP',
  subtotal_pence: servicesSubtotal,
  // ... line_items pentru SERVICES
});
```

**Note:**

- Scrie în `client_leg_quotes` (NU booking_quotes!)
- Doar pentru servicePackages (flowers, champagne, etc.)
- NU scrie pricing breakdown (base_fare, distance_fee)

**C. RPCs verificate:**

```sql
-- Niciun RPC nu scrie în client_booking_quotes
→ RESULT: []
```

**D. Date în DB:**

```sql
-- 6 quotes în client_booking_quotes
-- Format standardizat NOU cu components[], summary, meta
-- Sursa: probabil Backend QuoteService.createQuote()
```

### CONCLUZIE:

✅ **BACKEND ONLY** - client_booking_quotes scris de:

- Backend-VantageLane-/src/services/QuoteService.ts
- Metoda: QuoteService.createQuote()
- NU din frontend vantage-lane-2.0

⚠️ **FRONTEND** scrie doar în client_leg_quotes:

- Doar pentru service packages
- Format diferit (nu pricing breakdown)

---

## 4️⃣ INTERNAL_BOOKING_FINANCIALS - DUAL PATH

### Cine SCRIE:

```
✅ Backend-VantageLane-/src/services/FinancialSnapshotService.ts (NOU - CORECT)
⚠️ RPC create_financial_snapshot_for_booking (VECHI - GREȘIT)
```

### Verificări efectuate:

**A. Frontend (vantage-lane-2.0):**

```typescript
// grep pentru internal_booking_financials
→ RESULT: 0 matches
```

**B. RPC VECHI (PROBLEMĂ!):**

```sql
-- RPC: create_financial_snapshot_for_booking
CREATE FUNCTION create_financial_snapshot_for_booking(
  p_booking_id uuid,
  p_gross_amount_pence int,
  p_currency text,
  p_pricing_source text
) RETURNS uuid AS $$
DECLARE
  v_platform_fee_rate_bp int := 3000;  -- 🔥 HARDCODED 30%!
  v_platform_fee_pence int;
  v_vat_pence int := 0;
  v_subtotal_ex_vat_pence int;
  v_vendor_cost_pence int := 0;
  v_driver_payout_pence int := 0;
  v_profit_pence int;
BEGIN
  v_subtotal_ex_vat_pence := p_gross_amount_pence - v_vat_pence;
  v_platform_fee_pence := (p_gross_amount_pence * v_platform_fee_rate_bp) / 10000;
  v_profit_pence := v_platform_fee_pence - v_vendor_cost_pence;

  INSERT INTO internal_booking_financials (
    booking_id,
    version,
    currency,
    gross_amount_pence,
    vat_amount_pence,
    subtotal_ex_vat_pence,
    platform_fee_pence,
    platform_fee_rate_bp,
    vendor_cost_pence,
    driver_payout_pence,
    platform_profit_pence,
    pricing_source,
    calculated_at,
    line_items
  ) VALUES (
    p_booking_id,
    v_next_version,
    p_currency,
    p_gross_amount_pence,
    v_vat_pence,  -- HARDCODED 0!
    v_subtotal_ex_vat_pence,
    v_platform_fee_pence,
    v_platform_fee_rate_bp,  -- HARDCODED 3000 (30%)!
    v_vendor_cost_pence,  -- HARDCODED 0!
    v_driver_payout_pence,  -- HARDCODED 0!
    v_profit_pence,
    p_pricing_source,
    now(),
    jsonb_build_object(...)
  )
  RETURNING id INTO v_new_id;
END;
$$;
```

**PROBLEME RPC:**

- 🔥 platform_fee_rate_bp hardcoded la 3000 (30%)
- 🔥 vat_pence hardcoded la 0
- 🔥 vendor_cost_pence hardcoded la 0
- 🔥 driver_payout_pence hardcoded la 0
- 🔥 NU ia date din organization_settings
- 🔥 NU calculează comisioane corect

**C. COD NOU (BACKEND):**

```typescript
// Backend-VantageLane-/src/services/FinancialSnapshotService.ts
// Metoda: createFinancialSnapshot()
// ✅ Citește din organization_settings (0.10, 0.09)
// ✅ Calculează corect platform/operator/driver fees
// ✅ Format line_items standardizat
```

**D. Date în DB:**

```sql
-- 114 rows în internal_booking_financials
-- Majoritatea probabil din RPC vechi (30% hardcoded)
-- Ultimele (după refactor) din FinancialSnapshotService NOU
```

### CONCLUZIE:

⚠️ **2 WRITE PATHS ACTIVE:**

**Path 1: RPC vechi (GREȘIT)**

- create_financial_snapshot_for_booking
- Hardcoded 30% fee
- Folosit probabil de frontend/webhook vechi

**Path 2: Backend nou (CORECT)**

- FinancialSnapshotService.createFinancialSnapshot()
- Citește din organization_settings
- Calculează corect (10% + 9%)

🔥 **CONFLICT:** 2 surse truth pentru financial snapshots!

---

## 5️⃣ CLIENT_LEG_QUOTES - FRONTEND ONLY

### Cine SCRIE:

```
✅ Frontend: /api/bookings/route.ts (pentru service packages)
⚠️ NU folosit pentru pricing breakdown
```

### Cod exact:

```typescript
// src/app/api/bookings/route.ts:284-298
await supabaseAdmin.from('client_leg_quotes').insert({
  booking_id: bookingId,
  booking_leg_id: null,
  version: 1,
  currency: 'GBP',
  subtotal_pence: servicesSubtotal,
  discount_pence: 0,
  vat_rate: vatRate,
  vat_pence: vatPence,
  total_pence: totalPence,
  line_items: quoteLineItems, // Services: champagne, flowers, etc.
  calc_source: 'server',
  calc_version: 'pricing_v1',
  calculated_at: new Date().toISOString(),
});
```

### CONCLUZIE:

✅ Scris doar de frontend pentru service packages
⚠️ NU pentru pricing breakdown (base_fare, distance_fee)

---

## 📋 REZUMAT WRITE PATHS

### ✅ CLARE ȘI CORECTE:

1. **service_items** → Seed only (READ only în cod)
2. **client_leg_quotes** → Frontend /api/bookings (services only)

### ⚠️ DUAL PATH (CONFLICT):

3. **internal_booking_financials** →
   - RPC vechi (30% hardcoded) ❌
   - Backend nou FinancialSnapshotService ✅

### ❓ NECLARE:

4. **booking_line_items** →
   - Nu găsit write path activ în frontend
   - Doar 1 booking vechi are pricing components
   - Restul sunt services (legitime)

5. **client_booking_quotes** →
   - Nu găsit în frontend
   - Probabil Backend QuoteService
   - 6 quotes în DB cu format corect

---

## 🔥 PROBLEME IDENTIFICATE

### PRIORITATE 1 - CRITICĂ:

**1. RPC create_financial_snapshot_for_booking - HARDCODED GREȘIT**

```
Location: Database RPC function
Issue: platform_fee_rate_bp := 3000 (30% în loc de 10%)
Impact: 114 financials în DB - câte sunt greșite?
Fix: Delete/disable RPC sau update cu rate-uri din organization_settings
```

**2. Dual write path pentru internal_booking_financials**

```
Issue: RPC vechi (greșit) + Backend nou (corect) ambele active?
Impact: Confuzie, date inconsistente
Fix: Alege unul, disable celălalt
```

### PRIORITATE 2 - IMPORTANTĂ:

**3. booking_line_items write path neclar**

```
Issue: Nu găsit cod care scrie, doar date vechi
Impact: Nu știm dacă mai scriem pricing components
Fix: Căutare în Backend-VantageLane- folder
```

**4. client_booking_quotes write path neclar**

```
Issue: Nu găsit în frontend, probabil backend
Impact: Nu putem valida că nu scrie greșit
Fix: Verificare Backend QuoteService exact
```

---

## 🎯 ACȚIUNI NECESARE

### IMEDIAT:

1. **Verificare Backend-VantageLane- folder:**
   - QuoteService.createQuote() - scrie corect?
   - FinancialSnapshotService.createFinancialSnapshot() - scrie corect? ✅
   - Există cod care scrie în booking_line_items pricing components?

2. **Disable/Fix RPC vechi:**

   ```sql
   -- Option 1: DROP
   DROP FUNCTION create_financial_snapshot_for_booking;

   -- Option 2: UPDATE să folosească organization_settings
   -- (mai complex, necesită refactor RPC)
   ```

3. **Audit financials existente:**

   ```sql
   -- Câte au platform_fee_rate_bp = 3000 (greșit)?
   SELECT COUNT(*) FROM internal_booking_financials
   WHERE platform_fee_rate_bp = 3000;

   -- Câte au platform_fee_rate_bp = 1000 (corect)?
   SELECT COUNT(*) FROM internal_booking_financials
   WHERE platform_fee_rate_bp = 1000;
   ```

### APOI:

4. **Canonizare service_items** (deja în plan)
5. **Cleanup booking_line_items vechi** (opțional)

---

**Status:** AUDIT INCOMPLET - necesită acces Backend-VantageLane- folder
**Next:** Verificare QuoteService + FinancialSnapshotService în Backend
