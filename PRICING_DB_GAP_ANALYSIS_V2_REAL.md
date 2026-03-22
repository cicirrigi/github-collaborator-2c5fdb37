# 🔍 GAP ANALYSIS V2 - BAZAT PE REALITATE VERIFICATĂ

**Data:** 18 Martie 2026  
**Bazat pe:** Verificare reală DB + Audit proiect + Schema corectată V2

---

## 🎯 METODOLOGIE

**NU presupuneri** - doar facts verificate prin:

1. ✅ SQL queries directe în DB real (via MCP)
2. ✅ Verificare schema exactă cu information_schema
3. ✅ Verificare constraints, FK-uri, indexes
4. ✅ Verificare records existente (count + sample)
5. ✅ Verificare proiect (Frontend, Backend, Engine)

---

## 📊 INVENTAR COMPLET - CE EXISTĂ EFECTIV

### 🟢 EXISTĂ ȘI FUNCȚIONAL

#### 1. **client_booking_quotes** ✅

**Status:** EXISTĂ cu schema bună (creat de mine)  
**Records:** 0 (niciodată folosit încă)  
**Schema verificată:**

- ✅ `UNIQUE (booking_id, version)` - versioning corect!
- ✅ organization_id FK
- ✅ pricing_version_id FK (pregătit pentru viitor)
- ✅ subtotal_pence, vat_pence, total_pence (pence consistency)
- ✅ line_items JSONB pentru breakdown
- ✅ is_locked, quote_valid_until pentru lifecycle

**Ce LIPSEȘTE (minor):**

- ❌ `is_current` boolean pentru quick access
- ❌ `superseded_by_quote_id` pentru history chain
- ❌ Index parțial `WHERE is_current = true`

**DECIZIE:** **EXTEND MINOR** (nu KEEP simplu)

---

#### 2. **payment_transactions** ⚠️

**Status:** EXISTĂ dar INCOMPLET și cu probleme GRAVE  
**Records:** 0 (niciodată folosit)  
**Probleme identificate:**

**GRAV - Unități greșite:**

```sql
amount numeric  -- în POUNDS nu pence! ❌
stripe_fee numeric  -- în POUNDS! ❌
net_amount numeric  -- în POUNDS! ❌
```

**Frontend folosește PENCE pretutindeni!** (verificat în PaymentCard.tsx, payment.rpc.ts)

**LIPSESC FK-uri critice:**

- ❌ quote_id → client_booking_quotes
- ❌ organization_id → organizations
- ❌ idempotency_key UNIQUE

**LIPSESC coloane pentru multi-payment flows:**

- ❌ payment_kind ('full', 'deposit', 'balance', 'retry')
- ❌ payment_sequence (1, 2, 3...)
- ❌ parent_payment_transaction_id (pentru balance after deposit)

**LIPSESC detalii Stripe:**

- ❌ stripe_charge_id
- ❌ payment_method_last4
- ❌ payment_method_brand

**GREȘIT - Refunds în aceeași tabelă:**

- Există coloane refund\_\* care trebuie mutate în tabel separat

**DECIZIE:** **REMODEL PARȚIAL** (nu doar EXTEND)  
**Acțiuni:** Rename amounts → pence, ADD 10+ coloane, conversie date existente

---

#### 3. **organizations** ✅⚠️

**Status:** EXISTĂ parțial  
**Ce ARE:**

- ✅ driver_commission_pct (numeric)
- ✅ pricing_json (jsonb) - posibil per-org overrides?

**Ce NU ARE:**

- ❌ vat_rate (CRITICAL!)
- ❌ platform_commission_pct
- ❌ operator_commission_pct
- ❌ booking_lead_time_hours
- ❌ max_advance_booking_days

**Backend OrganizationSettingsService.ts** așteaptă tabel `organization_settings` separat!

**DECIZIE:** CREATE `organization_settings` (1:1 cu organizations)

---

#### 4. **booking_assignment_new** ✅

**Status:** EXISTĂ - SSOT pentru assignment  
**Schema verificată:**

```sql
- booking_id FK
- assigned_driver_id FK
- assigned_vehicle_id FK
- assigned_by FK (admin)
- assigned_at timestamp
```

**DECIZIE:** **KEEP as-is** (e perfect pentru driver payout link)

---

#### 5. **booking_legs** ✅

**Status:** EXISTĂ cu coloane relevante  
**Schema verificată:**

```sql
- assigned_driver_id FK
- assigned_vehicle_id FK
- vehicle_category, vehicle_model
- driver_payout (numeric - în pounds?)
```

**DECIZIE:** **KEEP** (legacy pentru 105 legs existente)

---

#### 6. **booking_pricing** ✅ [LEGACY]

**Status:** EXISTĂ cu 95 records reale  
**Conține:** price, platform_fee, operator_net, driver_payout, payment_status  
**Unități:** În POUNDS (nu pence)

**DECIZIE:** **DEPRECATE** (mark read-only, nu DELETE)

---

#### 7. **booking_leg_pricing** ✅ [LEGACY]

**Status:** EXISTĂ cu 105 records  
**DECIZIE:** **DEPRECATE** (mark read-only)

---

#### 8. **pricing_config** ✅ [LEGACY]

**Status:** EXISTĂ cu 1 record activ  
**Verificat JSONB structure:**

```json
{
  "vehicle_types": {
    "executive": {
      "base_fare": 22,  // £22 în POUNDS!
      "per_minute": 0.25,
      "minimum_fare": 40,
      "hourly_in_town": 85,
      "per_mile_first_6": 2.5
    }
  },
  "time_multipliers": {...},
  "airport_fees": {...},
  "premium_services": {...}
}
```

**CRITICAL:** Tarife în POUNDS, nu pence! Migrarea trebuie să convertească \* 100!

**DECIZIE:** **MIGRATION SOURCE** → apoi DEPRECATE

---

### ❌ NU EXISTĂ DELOC

#### 9-15. **Pricing Configuration Tables** (7 tabele)

**Status:** LIPSESC 100%  
**Backend PricingDataService.ts** le cere EXPLICIT:

```typescript
getVehicleRates() → v_pricing_vehicle_rates
getHourlyRules() → v_pricing_hourly_rules (sau pricing_vehicle_rates)
getTimeRules() → v_pricing_time_rules
getAirportFees() → v_pricing_airport_fees
getZoneFees() → v_pricing_zone_fees
```

**LIPSESC:**

- ❌ pricing_versions (master versioning)
- ❌ pricing_vehicle_rates (normalize din vehicle_types)
- ❌ pricing_time_rules (normalize din time_multipliers)
- ❌ pricing_airport_fees (normalize din airport_fees)
- ❌ pricing_zone_fees (normalize din zone_fees)
- ❌ pricing_service_catalog (normalize din premium_services)
- ❌ pricing_policies (normalize din general_policies)

**IMPACT:** Backend Pricing Engine NU funcționează deloc fără acestea!

**DECIZIE:** **CREATE ALL** (migrare din pricing_config JSONB)

---

#### 16. **organization_settings**

**Status:** LIPSEȘTE 100%  
**DECIZIE:** **CREATE** (CRITICAL pentru VAT rate!)

---

#### 17. **quote_service_items**

**Status:** LIPSEȘTE  
**DECIZIE:** **CREATE** (normalize services din quote.line_items)

---

#### 18. **booking_financial_snapshots**

**Status:** LIPSEȘTE  
**DECIZIE:** **CREATE + TRIGGER** (frozen financials la payment success)

---

#### 19. **driver_payout_breakdowns**

**Status:** LIPSEȘTE  
**DECIZIE:** **CREATE + TRIGGER** (breakdown transparent pentru șoferi)

---

#### 20. **payment_refunds**

**Status:** LIPSEȘTE (refunds în payment_transactions acum)  
**DECIZIE:** **CREATE** + MIGRATE refund columns

---

#### 21. **manual_financial_adjustments**

**Status:** LIPSEȘTE  
**DECIZIE:** **CREATE** (pentru goodwill, penalties, corrections)

---

#### 22-23. **Discount Tables**

**Status:** LIPSESC  
**DECIZIE:** **CREATE LATER** (faza 2, nu blocker)

---

#### 24-28. **VIEWS pentru Backend** (5 views)

**Status:** LIPSESC 100%  
**Verificat:** Doar customer_billing_complete și vehicle_service_summary există (irelevante)

**LIPSESC:**

- ❌ v_active_pricing_version
- ❌ v_pricing_vehicle_rates
- ❌ v_pricing_time_rules
- ❌ v_pricing_airport_fees
- ❌ v_pricing_zone_fees

**DECIZIE:** **CREATE** după populate tabele

---

## 📈 STATISTICI REALE

### Completare pe noua arhitectură target:

| Categorie                 | Total | Există Complet | Există Parțial | Lipsește | % Ready  |
| ------------------------- | ----- | -------------- | -------------- | -------- | -------- |
| **Pricing Config**        | 8     | 0              | 0              | 8        | **0%**   |
| **Quotes & Transactions** | 5     | 1              | 1              | 3        | **20%**  |
| **Financial Snapshots**   | 3     | 0              | 0              | 3        | **0%**   |
| **Auxiliary**             | 2     | 0              | 0              | 2        | **0%**   |
| **Legacy (keep)**         | 3     | 3              | 0              | 0        | **100%** |
| **Views**                 | 5     | 0              | 0              | 5        | **0%**   |
| **TOTAL**                 | 26    | 4              | 1              | 21       | **19%**  |

### Dar din cele 4 "există complet":

- 3 sunt LEGACY (nu noul sistem)
- 1 este booking_assignment_new (util dar auxiliar)

### Reality check:

**Noua arhitectură operațională:** ~**5% ready** (doar client_booking_quotes parțial pregătit)

---

## 🔴 PRIORITIZARE REALISTĂ

### WAVE 1 - CRITICAL BLOCKERS (fără astea nimic nu merge)

**1.1 Pricing Configuration Foundation** 🔴

```
CREATE pricing_versions (v1 cu date din pricing_config)
CREATE pricing_vehicle_rates + MIGRATE din vehicle_types
CREATE pricing_time_rules + MIGRATE din time_multipliers
CREATE pricing_airport_fees + MIGRATE din airport_fees
CREATE pricing_zone_fees + MIGRATE din zone_fees
CREATE pricing_service_catalog + MIGRATE din premium_services
CREATE pricing_policies + MIGRATE din general_policies
```

**Timp estimat:** 1 zi (migrare + conversie pounds → pence)

**1.2 Organization Context** 🔴

```
CREATE organization_settings
POPULATE cu defaults (VAT 20%, platform 10%, operator 10%)
```

**Timp estimat:** 2 ore

**1.3 Backend Compatibility Layer** 🔴

```
CREATE 5x VIEWS (v_pricing_*)
TEST Backend PricingDataService
```

**Timp estimat:** 3 ore

**BLOCKER:** Fără Wave 1 complete, pricing engine NU calculează nimic!

---

### WAVE 2 - QUOTE & PAYMENT CHAIN

**2.1 Quote System Adjustments** 🟡

```
ALTER client_booking_quotes ADD is_current, superseded_by_quote_id
CREATE INDEX parțial pentru is_current
CREATE quote_service_items
```

**Timp estimat:** 2 ore

**2.2 Payment Transactions Remodel** 🔴

```
ALTER payment_transactions:
  - RENAME amount/fees → *_pence
  - ADD quote_id, organization_id, idempotency_key
  - ADD payment_kind, sequence, parent_id
  - ADD stripe_charge_id, payment_method_*
  - DROP refund_* columns
UPDATE existing records (conversie * 100) - dacă există
```

**Timp estimat:** 4 ore (ATENȚIE: modificări pe tabel cu posibile date!)

**2.3 Refunds Separate** 🟡

```
CREATE payment_refunds
MIGRATE refund logic din payment_transactions (dacă există)
```

**Timp estimat:** 2 ore

---

### WAVE 3 - FINANCIAL SNAPSHOTS

**3.1 Snapshots Core** 🔴

```
CREATE booking_financial_snapshots
CREATE TRIGGER on_payment_success_create_snapshot
TEST trigger cu dummy payment
```

**Timp estimat:** 4 ore

**3.2 Retroactive Population** 🟡

```
POPULATE snapshots pentru 95 bookings existente din booking_pricing
LINK booking_pricing.financial_snapshot_id
```

**Timp estimat:** 3 ore (conversie + validare)

---

### WAVE 4 - DRIVER PAYOUTS

**4.1 Payout Breakdowns** 🟡

```
CREATE driver_payout_breakdowns (cu link la booking_assignment_new)
CREATE TRIGGER after snapshot
```

**Timp estimat:** 3 ore

**4.2 Retroactive Population** 🟡

```
POPULATE pentru 95 bookings din booking_pricing.driver_payout
LINK la booking_assignment_new sau booking_legs
```

**Timp estimat:** 3 ore

---

### WAVE 5 - EXTRAS & POLISH

**5.1 Manual Adjustments** 🟢

```
CREATE manual_financial_adjustments
```

**Timp estimat:** 1 oră

**5.2 Discount System** 🟢 (SKIP pentru MVP)

```
CREATE discount_campaigns
CREATE discount_applications
```

**Timp estimat:** 2 ore (când e nevoie)

---

## ⚠️ DEPENDENȚE CRITICE

### Nu poți face X înainte de Y:

```
pricing_versions
  └─→ pricing_vehicle_rates, pricing_time_rules, etc (toate au FK)
      └─→ VIEWS (citesc din tabele)
          └─→ Backend funcționează
              └─→ Quote creation posibilă
                  └─→ Bookings noi cu quotes
                      └─→ Payments cu quote_id
                          └─→ Financial snapshots
                              └─→ Driver payouts
```

**CONCLUZIE:** Trebuie în ORDINE strictă, nu parallel random!

---

## 🎯 MVP MINIM FUNCȚIONAL

### Ce trebuie NEAPĂRAT pentru primul booking cu noul sistem:

✅ **MUST HAVE:**

1. pricing_versions v1
2. pricing_vehicle_rates (minim pentru vehicle categories folosite)
3. pricing_time_rules (pentru night/peak multipliers)
4. pricing_airport_fees (dacă faci airport pickups)
5. pricing_zone_fees (pentru ULEZ/congestion)
6. organization_settings (VAT rate!)
7. client_booking_quotes (deja există, doar ADD is_current)
8. quote_service_items
9. payment_transactions REMODEL
10. booking_financial_snapshots + trigger
11. 5x VIEWS pentru Backend

⚠️ **SHOULD HAVE (poate veni după MVP):** 12. payment_refunds (poate mai târziu) 13. driver_payout_breakdowns (poate manual populate) 14. manual_adjustments (când apar excepții)

🟢 **NICE TO HAVE (faza 2):** 15. discount_campaigns/applications

---

## 📋 REZUMAT EXECUTIV

### Status real:

- **Pricing config layer:** 0% (totul de creat + migrat)
- **Quote layer:** 40% (quotes OK, services lipsă)
- **Payment layer:** 30% (există dar greșit, trebuie remodel)
- **Financial snapshot layer:** 0%
- **Driver payout layer:** 0%
- **Backend compatibility:** 0% (VIEWS lipsesc)

### Volumul real de muncă:

- **CREATE:** 15 tabele noi
- **ALTER/EXTEND:** 2 tabele (quotes, payments)
- **MIGRATE data:** pricing_config → 7 tabele + conversie pounds→pence
- **POPULATE retroactive:** 95 bookings → snapshots + payouts
- **CREATE VIEWS:** 5 views
- **CREATE TRIGGERS:** 2 triggers (snapshot, payout)
- **DEPRECATE:** 3 tabele legacy (mark only)

### Timp estimat total:

- **Wave 1 (blockers):** 1.5 zile
- **Wave 2 (quote/payment):** 1 zi
- **Wave 3 (snapshots):** 1 zi
- **Wave 4 (payouts):** 0.5 zi
- **TOTAL MVP:** **4 zile** (cu testing)

---

**NEXT:** Decision Matrix cu acțiuni concrete per tabelă
