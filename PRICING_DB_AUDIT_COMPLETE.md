# 🗄️ PRICING DATABASE AUDIT COMPLET - 4 NIVELURI

**DB:** `ruskhucrvjvuuzwlboqn` (shared între Backend-VantageLane- și vantage-lane-2.0)  
**Data:** 2026-03-17 04:55 AM  
**Metodă:** Structură → Conținut → Surse → Rol

---

## 📊 NIVEL 1: client_booking_quotes

### STRUCTURĂ (21 coloane)

| Coloană                | Tip       | Nullable | Default           | Rol                       |
| ---------------------- | --------- | -------- | ----------------- | ------------------------- |
| **id**                 | uuid      | NO       | gen_random_uuid() | PK                        |
| **booking_id**         | uuid      | NO       | -                 | FK → bookings             |
| **version**            | integer   | NO       | 1                 | Versioning quotes         |
| **is_locked**          | boolean   | NO       | false             | Lock mechanism            |
| **locked_at**          | timestamp | YES      | -                 | Când s-a blocat           |
| **quote_valid_until**  | timestamp | YES      | -                 | Expirare quote            |
| **currency**           | text      | NO       | 'GBP'             | Moneda                    |
| **subtotal_pence**     | integer   | NO       | 0                 | **SUBTOTAL OFICIAL**      |
| **discount_pence**     | integer   | NO       | 0                 | Total discounts           |
| **vat_rate**           | numeric   | NO       | 0                 | VAT rate (0.20)           |
| **vat_pence**          | integer   | NO       | 0                 | **VAT OFICIAL**           |
| **total_pence**        | integer   | NO       | 0                 | **TOTAL OFICIAL**         |
| **line_items**         | jsonb     | NO       | '[]'              | **BREAKDOWN COMPLET**     |
| **calc_source**        | text      | NO       | 'pricing-api'     | Sursa calculului          |
| **calc_version**       | text      | YES      | -                 | Versiune pricing engine   |
| **calculated_at**      | timestamp | NO       | now()             | Când s-a calculat         |
| **created_at**         | timestamp | NO       | now()             | -                         |
| **updated_at**         | timestamp | NO       | now()             | -                         |
| **deleted_at**         | timestamp | YES      | -                 | Soft delete               |
| **organization_id**    | uuid      | NO       | -                 | FK → organizations        |
| **pricing_version_id** | uuid      | YES      | -                 | **FK → pricing_versions** |

### CONSTRAINTS

- **PK:** id
- **FK:** booking_id → bookings.id
- **FK:** organization_id → organizations.id
- **UNIQUE:** (booking_id, version) — permite multiple versions per booking
- **NU EXISTĂ FK:** pricing_version_id (doar coloană, nu e enforced!)

### CONȚINUT REAL (1 row / 11 bookings = 9%)

```json
{
  "id": "8bf402d1-f3ee-4731-a371-33515e4c1159",
  "booking_id": "6ccb35f9-47f3-4f8e-828d-b714a8feeb10",
  "version": 1,
  "is_locked": false,
  "quote_valid_until": "2026-03-17 14:03:07+00",
  "subtotal_pence": 28237,
  "vat_pence": 5647,
  "total_pence": 33884,
  "calc_source": "pricing_engine_v2",
  "calc_version": "2.0.0",
  "pricing_version_id": null,

  "line_items": {
    "meta": {
      "calc_source": "pricing_engine_v2",
      "calc_version": "2.0.0"
    },
    "summary": {
      "subtotal_pence": 28237,
      "discount_pence": 0,
      "vat_pence": 5647,
      "total_pence": 33884
    },
    "components": [
      { "code": "base_fare", "amount_pence": 12000 },
      { "code": "distance_fee", "amount_pence": 13037 },
      { "code": "time_fee", "amount_pence": 2700 },
      { "code": "additional_fees", "amount_pence": 500 }
    ],
    "multipliers": [],
    "discounts": []
  }
}
```

### SURSA DATELOR

**Cine scrie:**

- ❌ NU găsit în vantage-lane-2.0 codebase (grep failed)
- ✅ Probabil: Backend-VantageLane- `/api/pricing/calculate-with-commissions`
- ✅ QuoteService.createQuote() (din test-end-to-end-pricing.ts)

**Când se scrie:**

- La pricing calculation (dar doar 9% coverage!)

### ROL ȘI VERDICT

| Criteriu             | Status                                 |
| -------------------- | -------------------------------------- |
| **Rol intenționat**  | 🎯 MASTER - Quote snapshot oficial     |
| **Rol actual**       | ⚠️ SUBUTILIZAT - doar 9% bookings      |
| **Source of truth**  | ✅ DA - are totals + breakdown complet |
| **Versioning**       | ✅ DA - (booking_id, version) unique   |
| **Locking**          | ⚠️ Column exists dar NU folosit        |
| **Pricing snapshot** | ✅ COMPLET în line_items JSONB         |

**DECIZIE:** MASTER CANDIDATE dar SUBUTILIZAT MASIV!

---

## 📊 NIVEL 2: client_leg_quotes

### STRUCTURĂ (20 coloane)

Identică cu `client_booking_quotes` dar la nivel de LEG:

- `booking_leg_id` în loc de doar `booking_id`
- Same: subtotal_pence, vat_pence, total_pence, line_items
- ❌ NU ARE: pricing_version_id!

### CONȚINUT REAL (3 rows)

**DOAR PENTRU SERVICES, NU PENTRU LEG PRICING!**

```json
{
  "booking_leg_id": "45fdf7bd-2a7e-48c8-ad5b-fbe6f1b1028c",
  "subtotal_pence": 135000, // £1,350 DOAR services!
  "total_pence": 162000, // cu VAT
  "calc_source": "server",
  "calc_version": "pricing_v1",

  "line_items": [
    { "service_code": "paparazzi-safe-mode", "unit_price_pence": 0, "is_complimentary": true },
    { "service_code": "flowers-exclusive", "unit_price_pence": 25000, "is_complimentary": false },
    {
      "service_code": "champagne-dom-perignon",
      "unit_price_pence": 35000,
      "is_complimentary": false
    },
    { "service_code": "security-escort", "unit_price_pence": 75000, "is_complimentary": false }
  ]
}
```

### ROL ȘI VERDICT

| Criteriu                 | Status                            |
| ------------------------ | --------------------------------- |
| **Rol intenționat**      | 📦 AUXILIAR - Services per leg    |
| **Rol actual**           | ✅ CORECT FOLOSIT - services only |
| **Are leg pricing?**     | ❌ NU - doar services + extras    |
| **Are vehicle pricing?** | ❌ NU - lipsește complet          |

**DECIZIE:** AUXILIAR pentru services, NU pentru leg total pricing!

---

## 📊 NIVEL 3: bookings

### COLOANE RELEVANTE PRICING (doar 4!)

| Coloană              | Tip   | Nullable | Conținut                             |
| -------------------- | ----- | -------- | ------------------------------------ |
| **currency**         | text  | NO       | 'GBP'                                |
| **billing_snapshot** | jsonb | YES      | **Billing entity data, NU pricing!** |

**billing_snapshot conține:**

```json
{
  "captured_at": "2026-03-16T22:16:56.788Z",
  "entity_type": "individual",
  "individual_data": {
    "email": "...",
    "phone": "...",
    "first_name": "...",
    "billing_address": {...}
  }
}
```

**❌ NU CONȚINE:**

- Total amount
- Pricing breakdown
- Quote reference
- VAT
- pricing_version_id

### ROL ȘI VERDICT

| Criteriu                | Status                        |
| ----------------------- | ----------------------------- |
| **Are pricing fields?** | ❌ NU                         |
| **Are quote_id?**       | ❌ NU                         |
| **Are total?**          | ❌ NU                         |
| **billing_snapshot?**   | ✅ DA dar DOAR billing entity |

**DECIZIE:** NU E PRICING MASTER - doar billing entity snapshot!

---

## 📊 NIVEL 4: booking_payments

### STRUCTURĂ (21 coloane)

| Coloană                      | Tip     | Rol                          |
| ---------------------------- | ------- | ---------------------------- |
| **amount_pence**             | integer | **SUMA PLĂTITĂ**             |
| **stripe_payment_intent_id** | text    | Stripe PI ID                 |
| **status**                   | enum    | pending/succeeded/failed     |
| **metadata**                 | jsonb   | **Stripe fee + idempotency** |

### CONȚINUT REAL

```json
{
  "booking_id": "9eb6a2b2-f0ab-40da-ae51-ae93f75967b0",
  "amount_pence": 364500, // £3,645 — VINE DIN FRONTEND!
  "status": "succeeded",
  "metadata": {
    "stripe_fee_pence": 11866,
    "stripe_fee_source": "stripe_api",
    "idempotencyKey": "pi_9eb6a2b2-..._364500_1"
  }
}
```

### SURSA amount_pence

**🔴 CRITICAL SECURITY ISSUE:**

- ❌ Amount vine din FRONTEND la `/api/stripe/payment-intent`
- ❌ NU se verifică cu client_booking_quotes.total_pence
- ❌ NU se verifică că quote e valid
- ❌ Client poate trimite orice sumă!

### ROL ȘI VERDICT

| Criteriu             | Status                       |
| -------------------- | ---------------------------- |
| **Rol**              | 💳 EXECUTION ONLY            |
| **Source of truth?** | ❌ NU - doar execution log   |
| **Verifică quote?**  | ❌ NU                        |
| **Security issue?**  | 🔴 DA - amount not validated |

**DECIZIE:** EXECUTION LOG, NU SOURCE OF TRUTH!

---

## 📊 NIVEL 5: internal_booking_financials

### STRUCTURĂ (27 coloane - MOST COMPLETE!)

| Coloană                   | Tip     | Default | Rol                      |
| ------------------------- | ------- | ------- | ------------------------ |
| **gross_amount_pence**    | integer | 0       | Total cu VAT             |
| **vat_amount_pence**      | integer | 0       | VAT                      |
| **subtotal_ex_vat_pence** | integer | 0       | Subtotal fără VAT        |
| **platform_fee_pence**    | integer | 0       | Platform commission      |
| **platform_fee_rate_bp**  | integer | 0       | Rate în basis points     |
| **operator_fee_pence**    | integer | 0       | Operator commission      |
| **operator_fee_rate_bp**  | integer | 0       | Rate în basis points     |
| **driver_payout_pence**   | integer | 0       | Driver payout            |
| **processor_fee_pence**   | integer | 0       | **Stripe fee ACTUAL**    |
| **net_collected_pence**   | integer | 0       | După Stripe fee          |
| **net_to_platform_pence** | integer | 0       | Platform net             |
| **net_to_operator_pence** | integer | 0       | Operator net             |
| **net_to_driver_pence**   | integer | 0       | Driver net               |
| **quote_id**              | uuid    | NULL    | ❌ LIPSEȘTE în practică! |
| **booking_payment_id**    | uuid    | NULL    | Link la payment          |
| **pricing_version_id**    | uuid    | NULL    | ❌ LIPSEȘTE în practică! |
| **pricing_source**        | text    | 'quote' | Sursa datelor            |

### CONȚINUT REAL

```json
{
  "booking_id": "9eb6a2b2-f0ab-40da-ae51-ae93f75967b0",
  "version": 2,
  "quote_id": null, // ❌ NULL!
  "pricing_version_id": null, // ❌ NULL!
  "gross_amount_pence": 364500, // £3,645
  "vat_amount_pence": 0, // ❌ Treated as 0!
  "subtotal_ex_vat_pence": 364500, // Same as gross
  "platform_fee_pence": 36450, // 10%
  "operator_fee_pence": 32805, // 9%
  "driver_payout_pence": 295245,
  "processor_fee_pence": 11866, // ✅ Stripe fee real
  "net_collected_pence": 352634, // După Stripe
  "pricing_source": "payment_fee_finalized" // ❌ Din payment, NU quote!
}
```

### SURSA DATELOR

**Version 1:** Imediat după payment succeeded
**Version 2:** După retrieval Stripe fee

**Calculat din:**

- ❌ NU din client_booking_quotes
- ✅ Din booking_payments.amount_pence (care vine din frontend!)
- ✅ Stripe fee din Stripe API

### ROL ȘI VERDICT

| Criteriu             | Status                  |
| -------------------- | ----------------------- |
| **Rol**              | 💰 FINANCIAL SNAPSHOT   |
| **Source?**          | ⚠️ DERIVED din payment  |
| **Quote link?**      | ❌ NULL în practică     |
| **Pricing version?** | ❌ NULL în practică     |
| **Stripe fee?**      | ✅ DA - real din Stripe |

**DECIZIE:** DERIVED FINANCIAL SNAPSHOT din payment, NU din quote!

---

## 📊 NIVEL 6: service_items + booking_line_items

### service_items (21 rows active)

**STRUCTURĂ:**

- `id` (text PK): service code
- `name`: Display name
- `price_pence`: Unit price
- `item_group`: included_service | paid_upgrade | premium_feature | trip_preference
- `pricing_mode`: included | fixed

**CONȚINUT:**

```
included_service (9):   meet-greet, wifi, chargers, refreshments, luggage-assistance, pet-friendly, airport-wait, extra-stops, priority-support
paid_upgrade (5):       flowers-standard (£120), flowers-exclusive (£250), champagne-moet (£120), champagne-dom-perignon (£350), security-escort (£750)
premium_feature (4):    paparazzi-safe, front-seat, comfort-ride, luggage-privacy
trip_preference (3):    music, temperature, communication
```

### booking_line_items (EXISTS!)

**STRUCTURĂ:**

- `booking_id`, `booking_leg_id`
- `item_group`, `item_key`, `item_value`
- `unit_price_pence`, `total_price_pence`
- `is_included`
- `service_item_id` (FK → service_items)
- `snapshot` (jsonb)

**ROL:** Salvează services selectate per booking/leg

---

## 🎯 MAPARE COMPLETE: TABEL → ROL → SURSA → TRUTH TYPE

| Tabel                           | Rol                  | Populat de          | Când                 | Truth Type                    |
| ------------------------------- | -------------------- | ------------------- | -------------------- | ----------------------------- |
| **client_booking_quotes**       | 🎯 MASTER Quote      | Backend API pricing | La quote calc        | **MASTER (dar 9% usage!)**    |
| **client_leg_quotes**           | 📦 Services per leg  | Frontend booking    | La confirmation      | **AUXILIAR**                  |
| **bookings**                    | 📝 Booking entity    | Frontend booking    | La creation          | **MASTER entity, NU pricing** |
| **booking_payments**            | 💳 Payment execution | Frontend payment    | La payment attempt   | **EXECUTION LOG**             |
| **internal_booking_financials** | 💰 Financial calc    | Backend webhook     | După payment success | **DERIVED FINANCIAL**         |
| **service_items**               | 📋 Service catalog   | Manual/migration    | Setup                | **CONFIGURATION**             |
| **booking_line_items**          | 🛒 Services selected | Frontend booking    | La confirmation      | **AUXILIAR SNAPSHOT**         |
| **pricing_vehicle_rates**       | ⚙️ Pricing config    | Manual/migration    | Setup                | **CONFIGURATION**             |
| **pricing_versions**            | 🔢 Version control   | Manual              | Setup                | **CONFIGURATION**             |

---

## ⚖️ DECIZIE FINALĂ: MASTER vs AUXILIAR vs DEPRECATED

### 🎯 MASTER (Source of Truth)

```
✅ client_booking_quotes
   - ROL: Pricing snapshot oficial cu breakdown complet
   - STRUCTURĂ: Perfect pentru role
   - PROBLEMA: Doar 9% bookings îl folosesc!
   - ACȚIUNE: Enforce 100% coverage

❌ NU EXISTĂ ALT MASTER!
   - bookings: NU are pricing
   - booking_payments: Doar execution
   - internal_booking_financials: Derived din payment
```

### 📦 AUXILIAR (Supporting Data)

```
client_leg_quotes - Services per leg
booking_line_items - Services snapshot
service_items - Service catalog
```

### ⚙️ CONFIGURATION

```
pricing_vehicle_rates, pricing_time_rules, pricing_airport_fees, etc.
pricing_versions
```

### 💳 EXECUTION LOG

```
booking_payments - Payment attempts
```

### 💰 DERIVED

```
internal_booking_financials - Calculat din payment
```

### ❌ DEPRECATED

```
NONE - toate tabelele sunt folosite
```

---

## 🚨 PROBLEME CRITICE IDENTIFICATE

### 1. client_booking_quotes SUBUTILIZAT (9%)

**Problema:**

- 11 bookings în DB
- DOAR 1 are quote salvat
- 10 bookings fără pricing snapshot!

**Impact:**

- ❌ NU există audit trail pentru pricing
- ❌ NU poți recalcula sau verifica prețuri vechi
- ❌ Payment amount vine din frontend UNCHECKED

**Cauză:**

- Cod lipsește în vantage-lane-2.0
- Probabil doar Backend-VantageLane- creează quotes
- Frontend nu salvează quote înainte de payment

### 2. PAYMENT AMOUNT NU E VALIDAT

**Flow actual:**

```
Frontend → /api/stripe/payment-intent cu amount_pence
  ↓
Backend creează PI cu amount din request
  ↓
❌ NU verifică cu client_booking_quotes
```

**Security Issue:**

- Client poate trimite orice sumă
- Pot plăti mai puțin decât quote-ul
- Zero validation!

### 3. pricing_version_id NULL PESTE TOT

**În client_booking_quotes:**

- Column exists
- Dar e NULL în singura row!

**În internal_booking_financials:**

- Column exists
- Dar e NULL în toate rows!

**Impact:**

- ❌ NU știi ce pricing version a fost folosită
- ❌ NU poți face audit când se schimbă pricing rules

### 4. internal_booking_financials CALCULAT DIN PAYMENT

**Problema:**

- `quote_id` = NULL
- `pricing_source` = "payment_succeeded"
- Calculat din `booking_payments.amount_pence`
- Care vine din frontend!

**Impact:**

- Financial snapshot bazat pe amount nevaridat
- NU link către pricing engine result

---

## 📋 ACȚIUNI NECESARE - PRIORITY ORDER

### 🔴 CRITICAL (Fix acum)

1. **Enforce quote creation 100%**

   ```
   Modifică /api/bookings să salveze ÎNTOTDEAUNA quote
   ÎNAINTE de a permite payment
   ```

2. **Validate payment amount**

   ```
   /api/stripe/payment-intent TREBUIE să:
   - Citească client_booking_quotes.total_pence
   - Verifice că quote nu e expired
   - Verifice că quote e pentru booking-ul corect
   - Folosească amount din quote, NU din request
   ```

3. **Populate pricing_version_id**
   ```
   Backend pricing engine TREBUIE să returneze pricing_version_id
   Salvat în client_booking_quotes.pricing_version_id (column)
   ȘI în line_items.pricing_version_id (jsonb)
   ```

### 🟡 IMPORTANT (Fix în următoarea iterație)

4. **Link financials cu quote**

   ```
   internal_booking_financials.quote_id = POPULATE
   pricing_source = "quote" nu "payment"
   ```

5. **Implement quote locking**

   ```
   is_locked = true la payment attempt
   Validate locked quote la webhook
   ```

6. **Populate pricing_version_id în financials**
   ```
   Copy din client_booking_quotes
   ```

---

## ✅ CONCLUZIE AUDIT

**CE AM AFLAT:**

1. **MASTER candidat există:** `client_booking_quotes` perfect structurat
2. **DAR e subutilizat:** Doar 9% coverage
3. **Payment amount UNCHECKED:** Vine direct din frontend
4. **Versioning incomplet:** pricing_version_id NULL peste tot
5. **Financials derived wrong:** Din payment, nu din quote

**NEXT STEPS:**

Implement în ordine:

1. Quote creation mandatory
2. Payment validation din quote
3. Pricing version tracking
4. Link financials cu quote
5. Locking enforcement
