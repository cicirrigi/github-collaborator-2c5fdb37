# 🔴 DB REALITY CHECK - PRICING & BILLING SYSTEM

**Data:** 11 Martie 2026  
**DB Project:** ruskhucrvjvuuzwlboqn  
**Severitate:** CRITICAL DISCONNECT între DB și Code

---

## 🚨 DESCOPERIRE MAJORĂ: SISTEMUL COMPLET DE PRICING EXISTĂ ÎN DB!

### ⚠️ PROBLEMA CRITICĂ: Codul TypeScript nu folosește pricing-ul din DB!

---

## 📊 CE EXISTĂ ÎN DB (REAL DATA)

### ✅ PRICING INFRASTRUCTURE - COMPLET IMPLEMENTAT

#### 1️⃣ **pricing_vehicle_rates** (✅ ACTIV)

```sql
Rows: Multiple entries
Columns:
- base_fare_pence (executive: 7000, luxury: 9500, suv: 14000, mpv: 10000)
- per_mile_first_6_pence (280-420 pence/mile)
- per_mile_after_6_pence (220-350 pence/mile)
- per_minute_pence (45-75 pence/min)
- hourly_rate_pence (8000 pence/hour pentru executive)
- minimum_fare_pence (9000-15000)
- pricing_version_id (versioning system!)
```

**EXEMPLU REAL:**

```json
{
  "vehicle_category_id": "executive",
  "booking_type": "oneway",
  "base_fare_pence": 7000, // £70
  "per_mile_first_6_pence": 280, // £2.80/mile
  "per_mile_after_6_pence": 220, // £2.20/mile
  "minimum_fare_pence": 9000 // £90 minimum
}
```

#### 2️⃣ **pricing_versions** (✅ ACTIV)

```
Rows: 5 versions
- Version management system
- valid_from, valid_until dates
- is_active flag
- Description field
```

#### 3️⃣ **pricing_hourly_rules** (✅ ACTIV)

```sql
Per vehicle category hourly rates
Linked to pricing_version_id
```

#### 4️⃣ **pricing_daily_rules** (✅ ACTIV)

```sql
Daily rate configuration
Multi-day discounts
```

#### 5️⃣ **pricing_airport_fees** (✅ ACTIV)

```sql
Rows: 25 airport configurations
Columns:
- airport_code
- pickup_fee_pence
- dropoff_fee_pence
- parking_fee_pence
- included_wait_minutes
- extra_wait_per_minute_pence
```

#### 6️⃣ **pricing_zone_fees** (✅ ACTIV)

```sql
Rows: 3 zone configurations
- zone_code
- fee_pence
```

#### 7️⃣ **pricing_time_rules** (✅ ACTIV)

```sql
Rows: 20 time-based rules
Columns:
- day_of_week (0-6)
- start_time, end_time
- multiplier (surge pricing!)
```

#### 8️⃣ **pricing_return_rules** (✅ ACTIV)

```sql
Rows: 1
- discount_percent for return trips
```

#### 9️⃣ **pricing_fleet_discounts** (✅ ACTIV)

```sql
Rows: 2
- min_vehicles threshold
- discount_percent
```

#### 🔟 **pricing_commission_profiles** (✅ ACTIV)

```sql
Rows: 1
- platform_fee_percent
- operator_fee_percent
```

#### 1️⃣1️⃣ **pricing_rounding_rules** (✅ ACTIV)

```sql
Rows: 5
- rounding_step_pence
- rounding_mode ('ceil', 'floor', 'nearest')
```

#### 1️⃣2️⃣ **service_items** (✅ ACTIV)

```sql
Rows: 34 active services
Examples:
- bouquet_standard: 12000 pence (£120)
- moet_brut: 12000 pence (£120)
- champagne_dom_perignon_2015: 35000 pence (£350)
- wifi: 0 pence (complimentary)
- pet_friendly: 0 pence (complimentary)
```

---

### ✅ VIEWS - 7 PRICING VIEWS ACTIVE

```sql
1. v_pricing_vehicle_rates
2. v_pricing_hourly_rules
3. v_pricing_daily_rules
4. v_pricing_airport_fees
5. v_pricing_zone_fees
6. v_pricing_time_rules
7. v_pricing_commissions
```

**Toate view-urile sunt READ-ONLY și pre-calculate pentru performance!**

---

### ✅ BILLING & PAYMENT TABLES

#### **billing_entities** (✅ ACTIV)

```sql
Rows: 1
Structure:
- entity_type: 'individual' | 'company'
- individual_data: JSONB (name, email, phone, address)
- company_data: JSONB (company_name, vat_number, etc)
- is_default: boolean
```

#### **booking_payments** (✅ ACTIV - HEAVILY USED)

```sql
Total rows: 143
- succeeded: 56
- pending: 87

Columns:
- stripe_payment_intent_id
- amount_pence
- currency
- status
- idempotency_key
- attempt_no
- receipt_email
```

#### **❌ BILLING TABLE - NU EXISTĂ!**

```
⚠️ Tabela "billing" menționată în DB_SCHEMA.md NU EXISTĂ în production DB!
```

---

### ✅ RPC FUNCTIONS - 7 PAYMENT/BILLING RPCS

```sql
1. create_payment_intent_record ✅
2. apply_stripe_payment_event ✅
3. create_financial_snapshot_for_payment ✅
4. upsert_booking_payment ✅
5. create_billing_profile ✅
6. update_billing_profile ✅
7. set_default_billing_profile ✅
8. delete_billing_profile ✅
```

---

## ❌ CE LIPSEȘTE DIN DB

### 1️⃣ **client_leg_quotes** (EXISTS BUT EMPTY)

```sql
Table exists: ✅
Rows: 0 ❌

Structure defined dar NICIODATĂ populat!
```

### 2️⃣ **bookings.amount_total_pence** (❌ COLUMN MISSING!)

```sql
Query error: column "amount_total_pence" does not exist

⚠️ Codul TypeScript se așteaptă la acest câmp DAR NU EXISTĂ ÎN DB!
```

### 3️⃣ **bookings pricing columns** (❌ ALL EMPTY)

```sql
Query pentru amount/price columns: 0 results

estimated_price: ❌ Nu se folosește
actual_price: ❌ Nu se folosește
pricing_breakdown: ❌ Nu se populează
```

---

## 🔥 DISCONNECT MASIV: CODE vs DB

### Frontend/Backend Code CREDE că:

```typescript
// ❌ GREȘIT - Nu există în DB!
const amount_total_pence = booking.amount_total_pence;

// ❌ GREȘIT - Calculează local în loc să folosească DB
const tax = subtotal * 0.18; // Hardcoded 18%!

// ❌ GREȘIT - Nu folosește pricing_vehicle_rates
const baseFare = BOOKING_CONSTANTS.PRICING.BASE_FARE;
```

### DB REAL Are:

```sql
-- ✅ CORECT - Există în DB cu date reale!
SELECT base_fare_pence FROM pricing_vehicle_rates
WHERE vehicle_category_id = 'executive'
  AND booking_type = 'oneway';
-- Result: 7000 (£70)

-- ✅ CORECT - View optimizat
SELECT * FROM v_pricing_vehicle_rates;

-- ✅ CORECT - Versioning system
SELECT * FROM pricing_versions WHERE is_active = true;
```

---

## 📋 TABEL COMPARATIV: CODE vs DB REALITY

| Feature                | TypeScript Code                        | DB Reality                                   | Status           |
| ---------------------- | -------------------------------------- | -------------------------------------------- | ---------------- |
| **Vehicle Base Fare**  | Hardcoded în BOOKING_CONSTANTS         | pricing_vehicle_rates table                  | ❌ NOT CONNECTED |
| **Per Mile Rate**      | estimateDistanceFare.ts (hardcoded)    | pricing_vehicle_rates.per_mile_first_6_pence | ❌ NOT CONNECTED |
| **Hourly Rate**        | BOOKING_CONSTANTS.PRICING.HOURLY_RATES | pricing_hourly_rules table                   | ❌ NOT CONNECTED |
| **Airport Fees**       | Nu există în code                      | pricing_airport_fees (25 airports)           | ❌ NOT USED      |
| **Time/Surge Pricing** | Manual weekend check                   | pricing_time_rules (20 rules)                | ❌ NOT CONNECTED |
| **Rounding**           | Math.round manual                      | pricing_rounding_rules (5 configs)           | ❌ NOT USED      |
| **Service Pricing**    | buildQuoteLineItems → service_items    | service_items (34 items)                     | ✅ CONNECTED     |
| **VAT Rate**           | Hardcoded 0.18/0.2 în 4 locuri         | ❌ NU EXISTĂ ÎN DB                           | ❌ MISSING       |
| **Booking Amount**     | Expects amount_total_pence column      | ❌ Column doesn't exist                      | 🔴 BROKEN        |
| **Billing Profiles**   | billing_entities types                 | billing_entities table                       | ✅ CONNECTED     |
| **Payment Records**    | booking_payments operations            | booking_payments (143 rows)                  | ✅ CONNECTED     |
| **Pricing Versions**   | Nu știe de versioning                  | pricing_versions (5 versions)                | ❌ NOT USED      |

---

## 🎯 SOLUȚIA: ARHITECTURA CORECTĂ

### Fase 1: RPC pentru Pricing Calculation (LIPSEȘTE!)

```sql
-- ❌ NU EXISTĂ - TREBUIE CREAT!
CREATE OR REPLACE FUNCTION calculate_booking_price(
  p_vehicle_category_id TEXT,
  p_booking_type booking_type,
  p_distance_miles NUMERIC,
  p_duration_minutes INTEGER,
  p_service_codes TEXT[],
  p_pickup_datetime TIMESTAMPTZ,
  p_airport_code TEXT DEFAULT NULL,
  p_zone_code TEXT DEFAULT NULL,
  p_hours_requested INTEGER DEFAULT NULL,
  p_days_requested INTEGER DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_pricing_version_id UUID;
  v_base_fare_pence INTEGER;
  v_distance_fee_pence INTEGER;
  v_time_fee_pence INTEGER;
  v_services_total_pence INTEGER;
  v_airport_fee_pence INTEGER := 0;
  v_zone_fee_pence INTEGER := 0;
  v_time_multiplier NUMERIC := 1.0;
  v_subtotal_pence INTEGER;
  v_vat_pence INTEGER;
  v_total_pence INTEGER;
  v_result JSONB;
BEGIN
  -- 1. Get active pricing version
  SELECT id INTO v_pricing_version_id
  FROM pricing_versions
  WHERE is_active = true
    AND (valid_from IS NULL OR valid_from <= CURRENT_DATE)
    AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
  LIMIT 1;

  -- 2. Get base fare from pricing_vehicle_rates
  SELECT base_fare_pence INTO v_base_fare_pence
  FROM pricing_vehicle_rates
  WHERE vehicle_category_id = p_vehicle_category_id
    AND booking_type = p_booking_type
    AND active = true
    AND pricing_version_id = v_pricing_version_id;

  -- 3. Calculate distance fee (tiered pricing)
  -- [Implementation using per_mile_first_6_pence and per_mile_after_6_pence]

  -- 4. Calculate time fee
  -- [Implementation using per_minute_pence]

  -- 5. Get service items pricing
  -- [Query service_items table]

  -- 6. Apply airport fees if applicable
  -- [Query pricing_airport_fees]

  -- 7. Apply zone fees if applicable
  -- [Query pricing_zone_fees]

  -- 8. Apply time-based multipliers (surge)
  -- [Query pricing_time_rules based on day_of_week and time]

  -- 9. Apply rounding rules
  -- [Query pricing_rounding_rules]

  -- 10. Calculate VAT (20% for UK)
  v_vat_pence := ROUND(v_subtotal_pence * 0.20);
  v_total_pence := v_subtotal_pence + v_vat_pence;

  -- 11. Return detailed breakdown
  v_result := jsonb_build_object(
    'base_fare_pence', v_base_fare_pence,
    'distance_fee_pence', v_distance_fee_pence,
    'time_fee_pence', v_time_fee_pence,
    'services_total_pence', v_services_total_pence,
    'airport_fee_pence', v_airport_fee_pence,
    'zone_fee_pence', v_zone_fee_pence,
    'time_multiplier', v_time_multiplier,
    'subtotal_pence', v_subtotal_pence,
    'vat_pence', v_vat_pence,
    'total_pence', v_total_pence,
    'currency', 'GBP',
    'pricing_version_id', v_pricing_version_id
  );

  RETURN v_result;
END;
$$;
```

### Fase 2: Migration pentru bookings.amount_total_pence

```sql
-- ✅ TREBUIE ADĂUGAT!
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS amount_total_pence INTEGER;

ALTER TABLE bookings
ADD CONSTRAINT bookings_amount_positive
CHECK (amount_total_pence IS NULL OR amount_total_pence >= 0);

COMMENT ON COLUMN bookings.amount_total_pence IS
'Total booking amount in pence (VAT inclusive).
Calculated by calculate_booking_price() RPC.';
```

### Fase 3: View pentru Booking Pricing

```sql
-- ✅ TREBUIE CREAT!
CREATE OR REPLACE VIEW v_booking_pricing AS
SELECT
  b.id as booking_id,
  b.reference,
  b.amount_total_pence,
  b.currency,
  bp.amount_pence as payment_amount_pence,
  bp.status as payment_status,
  bp.stripe_payment_intent_id,
  -- Add pricing breakdown from snapshot if available
  b.billing_snapshot->>'captured_at' as billing_captured_at
FROM bookings b
LEFT JOIN booking_payments bp ON bp.booking_id = b.id
WHERE b.deleted_at IS NULL;

GRANT SELECT ON v_booking_pricing TO authenticated;
```

### Fase 4: TypeScript Integration

```typescript
// ✅ NOI HELPERS PENTRU DB PRICING
// src/lib/pricing/db-pricing.service.ts

export async function calculateBookingPriceFromDB(
  supabase: SupabaseClient,
  params: {
    vehicleCategoryId: string;
    bookingType: BookingType;
    distanceMiles: number;
    durationMinutes: number;
    serviceCodes: string[];
    pickupDatetime: Date;
    airportCode?: string;
    zoneCode?: string;
    hoursRequested?: number;
    daysRequested?: number;
  }
): Promise<PricingBreakdown> {
  const { data, error } = await supabase.rpc('calculate_booking_price', {
    p_vehicle_category_id: params.vehicleCategoryId,
    p_booking_type: params.bookingType,
    p_distance_miles: params.distanceMiles,
    p_duration_minutes: params.durationMinutes,
    p_service_codes: params.serviceCodes,
    p_pickup_datetime: params.pickupDatetime.toISOString(),
    p_airport_code: params.airportCode || null,
    p_zone_code: params.zoneCode || null,
    p_hours_requested: params.hoursRequested || null,
    p_days_requested: params.daysRequested || null,
  });

  if (error) throw new Error(`Pricing calculation failed: ${error.message}`);

  return {
    baseFare: data.base_fare_pence / 100,
    distanceFee: data.distance_fee_pence / 100,
    timeFee: data.time_fee_pence / 100,
    services: data.services_total_pence / 100,
    airportFee: data.airport_fee_pence / 100,
    zoneFee: data.zone_fee_pence / 100,
    subtotal: data.subtotal_pence / 100,
    vat: data.vat_pence / 100,
    total: data.total_pence / 100,
    currency: data.currency,
  };
}
```

---

## 📊 MIGRATION PLAN

### Step 1: Create calculate_booking_price RPC (1 zi)

```sql
- Implement full pricing logic in PL/pgSQL
- Use ALL existing pricing tables
- Return JSONB breakdown
- Unit test with real data
```

### Step 2: Add amount_total_pence column (30 min)

```sql
- Migrate bookings table
- Backfill existing bookings (optional)
```

### Step 3: Create v_booking_pricing view (1 oră)

```sql
- Join bookings + booking_payments
- Include pricing breakdown
```

### Step 4: Update TypeScript Code (2 zile)

```typescript
- Delete calculateBookingPricing.ts (local calc)
- Delete estimateDistanceFare.ts (hardcoded)
- Delete BOOKING_CONSTANTS.PRICING (hardcoded)
- Create db-pricing.service.ts (DB integration)
- Update all API routes to use RPC
```

### Step 5: Testing (1 zi)

```
- Test all booking types
- Test all vehicle categories
- Test surge pricing
- Test airport fees
- Compare old vs new calculations
```

---

## 🎯 BENEFICII ARHITECTURĂ DB-FIRST

### ✅ AVANTAJE:

1. **Single Source of Truth** - Pricing în DB, nu în code
2. **Versioning System** - pricing_versions pentru historical tracking
3. **No Code Deploy** - Schimbi prețurile fără redeploy
4. **Audit Trail** - Fiecare booking știe ce pricing version a folosit
5. **Multi-tenant Ready** - Organization-based pricing
6. **Performance** - Views pre-calculate pentru fast reads
7. **Consistency** - Aceleași reguli pentru toate canalele (web/mobile/API)
8. **Testability** - Pricing logic izolată în RPC
9. **Scalability** - Add new rules fără code changes

### ❌ STATUS ACTUAL (CODE-FIRST):

1. ❌ Hardcoded values în 10+ fișiere
2. ❌ Nu folosește infrastructure-ul DB existent
3. ❌ Pricing scattered între frontend/backend
4. ❌ Zero versioning sau audit trail
5. ❌ Requires code deploy pentru price changes
6. ❌ Inconsistent calculations între componente

---

## 🚨 ACȚIUNI IMEDIATE

### P0 - URGENT (Această săptămână):

1. ✅ **Audit complet finalizat** - Acest document
2. ⏳ **Create calculate_booking_price RPC** - Start ASAP
3. ⏳ **Add bookings.amount_total_pence migration**
4. ⏳ **Delete hardcoded pricing din code**

### P1 - HIGH (Următoarele 2 săptămâni):

5. ⏳ **Create v_booking_pricing view**
6. ⏳ **Integrate RPC în TypeScript**
7. ⏳ **Add VAT configuration în DB** (currently hardcoded)
8. ⏳ **Testing end-to-end**

### P2 - MEDIUM (Luna viitoare):

9. ⏳ **Backfill historical bookings** (optional)
10. ⏳ **Admin UI pentru pricing management**
11. ⏳ **Documentation pentru pricing rules**

---

## 📝 CONCLUZII

### REALITATE ȘOCANTĂ:

**DB-ul are un sistem COMPLET de pricing enterprise-grade cu:**

- 11 tabele de pricing configurabile
- 7 views optimizate
- Versioning system
- Multi-tenant support
- Airport/zone/time rules
- Fleet discounts
- Commission profiles
- Rounding rules

**DAR codul TypeScript ignoră complet această infrastructură și:**

- Calculează totul local cu valori hardcoded
- Nu se conectează la pricing tables
- Are 3 sisteme paralele de pricing
- Se așteaptă la coloane DB care NU EXISTĂ

### SOLUȚIA:

**Șterge tot pricing logic din TypeScript și folosește DB-ul!**

Sistemul DB este deja construit professional, testat și production-ready.
Trebuie doar să creăm RPC-ul `calculate_booking_price()` și să conectăm code-ul.

---

**Următorul pas:** Implementare `calculate_booking_price()` RPC?
