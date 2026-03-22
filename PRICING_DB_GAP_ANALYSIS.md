# 🔍 PASUL 2: GAP ANALYSIS - CE EXISTĂ VS CE LIPSEȘTE

**Data:** 18 Martie 2026  
**Bazat pe:** Audit complet DB + Schema finală definită

---

## 📊 MATRICEA COMPLETĂ: EXISTĂ vs LIPSEȘTE

### 🔵 MASTER TABLES - Pricing Configuration

| #   | Tabelă                    | Status          | Records | Acțiune Necesară                                           |
| --- | ------------------------- | --------------- | ------- | ---------------------------------------------------------- |
| 1   | `pricing_versions`        | ❌ **LIPSEȘTE** | 0       | **CREATE** - Tabelă nouă pentru versioning                 |
| 2   | `pricing_vehicle_rates`   | ❌ **LIPSEȘTE** | 0       | **CREATE** - Normalize din pricing_config.vehicle_types    |
| 3   | `pricing_time_rules`      | ❌ **LIPSEȘTE** | 0       | **CREATE** - Normalize din pricing_config.time_multipliers |
| 4   | `pricing_airport_fees`    | ❌ **LIPSEȘTE** | 0       | **CREATE** - Normalize din pricing_config.airport_fees     |
| 5   | `pricing_zone_fees`       | ❌ **LIPSEȘTE** | 0       | **CREATE** - Normalize din pricing_config.zone_fees        |
| 6   | `pricing_service_catalog` | ❌ **LIPSEȘTE** | 0       | **CREATE** - Normalize din pricing_config.premium_services |
| 7   | `pricing_policies`        | ❌ **LIPSEȘTE** | 0       | **CREATE** - Normalize din pricing_config.general_policies |
| 8   | `organization_settings`   | ❌ **LIPSEȘTE** | 0       | **CREATE** - Nou pentru VAT/commissions per org            |

---

### 🟢 MASTER TABLES - Quotes & Transactions

| #   | Tabelă                        | Status          | Records | Acțiune Necesară                                                 |
| --- | ----------------------------- | --------------- | ------- | ---------------------------------------------------------------- |
| 9   | `client_booking_quotes`       | ✅ **EXISTĂ**   | 0       | **KEEP** - Creat corect, gata de folosit                         |
| 10  | `quote_service_items`         | ❌ **LIPSEȘTE** | 0       | **CREATE** - Link quotes → services                              |
| 11  | `payment_transactions`        | 🟡 **PARȚIAL**  | 0       | **EXTEND** - Există dar incomplet, trebuie adăugat `quote_id` FK |
| 12  | `booking_financial_snapshots` | ❌ **LIPSEȘTE** | 0       | **CREATE** - Nou pentru frozen financials                        |
| 13  | `driver_payout_breakdowns`    | ❌ **LIPSEȘTE** | 0       | **CREATE** - Nou pentru driver earnings                          |

---

### 🟡 AUXILIARY TABLES

| #   | Tabelă                  | Status          | Records | Acțiune Necesară                             |
| --- | ----------------------- | --------------- | ------- | -------------------------------------------- |
| 14  | `discount_campaigns`    | ❌ **LIPSEȘTE** | 0       | **CREATE** - Viitor pentru promo codes       |
| 15  | `discount_applications` | ❌ **LIPSEȘTE** | 0       | **CREATE** - Viitor pentru discount tracking |

---

### 🔴 LEGACY TABLES

| #   | Tabelă                | Status        | Records | Acțiune Necesară                                         |
| --- | --------------------- | ------------- | ------- | -------------------------------------------------------- |
| 16  | `booking_pricing`     | ✅ **EXISTĂ** | 95      | **DEPRECATE** - Păstrează read-only, nu mai populate     |
| 17  | `booking_leg_pricing` | ✅ **EXISTĂ** | 105     | **DEPRECATE** - Păstrează read-only                      |
| 18  | `pricing_config`      | ✅ **EXISTĂ** | 1       | **DEPRECATE** - Folosește pentru migrare, apoi read-only |

---

### 📊 VIEWS

| #   | View                       | Status          | Acțiune Necesară                        |
| --- | -------------------------- | --------------- | --------------------------------------- |
| 1   | `v_active_pricing_version` | ❌ **LIPSEȘTE** | **CREATE** după pricing_versions        |
| 2   | `v_pricing_vehicle_rates`  | ❌ **LIPSEȘTE** | **CREATE** pentru Backend compatibility |
| 3   | `v_pricing_time_rules`     | ❌ **LIPSEȘTE** | **CREATE** pentru Backend               |
| 4   | `v_pricing_airport_fees`   | ❌ **LIPSEȘTE** | **CREATE** pentru Backend               |
| 5   | `v_pricing_zone_fees`      | ❌ **LIPSEȘTE** | **CREATE** pentru Backend               |

---

## 🔍 DETALII GAP ANALYSIS

### 1️⃣ PRICING CONFIGURATION - 100% LIPSEȘTE

**CE EXISTĂ:**

```
✅ pricing_config (JSONB monolitic)
   - vehicle_types (executive/luxury/suv/mpv)
   - time_multipliers (night/peak/weekend)
   - airport_fees (LHR/LGW/STN/LTN/LCY)
   - zone_fees (ULEZ/LEZ/congestion/tolls)
   - premium_services (flowers/champagne/child_seat)
   - hourly_settings, daily_settings, fleet_settings, return_settings
   - service_policies (multi-stop, waiting)
   - general_policies (rounding, cancellation, corporate)
```

**CE LIPSEȘTE:**

```
❌ pricing_versions - versioning master table
❌ pricing_vehicle_rates - tabele normalize per vehicle/booking type
❌ pricing_time_rules - time multipliers normalize
❌ pricing_airport_fees - airport fees normalize
❌ pricing_zone_fees - zone fees normalize
❌ pricing_service_catalog - service items normalize
❌ pricing_policies - policies normalize
```

**ACȚIUNE:**

- Migrare date din `pricing_config` JSONB → 7 tabele normalize
- Creare `pricing_versions` v1 cu datele actuale
- Mark `pricing_config` ca LEGACY

---

### 2️⃣ ORGANIZATION SETTINGS - 100% LIPSEȘTE

**CE EXISTĂ:**

```
✅ organizations table
   - id, code, name, org_type
   - pricing_json (nullable JSONB) - ❓ NECLAR cum se folosește
   - driver_commission_pct
   - is_active, contact_email, contact_phone
```

**CE LIPSEȘTE:**

```
❌ organization_settings table
   - vat_rate (critical pentru VAT calculation!)
   - platform_commission_pct
   - operator_commission_pct
   - currency, timezone
   - booking_lead_time_hours, max_advance_booking_days
```

**IMPACT:**

- ❌ Backend OrganizationSettingsService NU funcționează
- ❌ VAT rate folosește hardcoded 20% default
- ❌ Commissions nu sunt configurabile per org

**ACȚIUNE:**

- CREATE `organization_settings` (1:1 cu organizations)
- Populate cu defaults: VAT 20%, platform 10%, operator 10%
- Link din `organizations.driver_commission_pct` → `organization_settings`

---

### 3️⃣ QUOTES SYSTEM - 50% COMPLET

**CE EXISTĂ:**

```
✅ client_booking_quotes (creat corect)
   - Schema completă cu toate coloanele necesare
   - FK la bookings, organizations, pricing_version_id
   - line_items JSONB pentru breakdown
   - Lifecycle fields (is_locked, quote_valid_until)
   - 0 records (niciodată folosit)
```

**CE LIPSEȘTE:**

```
❌ quote_service_items table
   - Link explicit între quote și servicii comandate
   - Normalizare din line_items.services[]

❌ Usage în flow
   - Frontend NU creează quotes
   - Backend NU folosește quotes
   - Booking creation NU cere quote_id
```

**ACȚIUNE:**

- CREATE `quote_service_items` table
- UPDATE `create_booking_with_quote_atomic` RPC să funcționeze
- IMPLEMENT frontend quote creation flow

---

### 4️⃣ PAYMENT TRANSACTIONS - INCOMPLET

**CE EXISTĂ:**

```
✅ payment_transactions table
   - booking_id FK
   - amount, currency
   - stripe_payment_intent_id, stripe_status, stripe_fee
   - payment_method, status
   - metadata JSONB
   - 0 records (niciodată folosit!)
```

**CE LIPSEȘTE:**

```
❌ quote_id FK → client_booking_quotes
   - Cum știm ce quote a generat payment-ul?
   - Nu există link între quote și payment

❌ organization_id FK
   - Pentru multi-tenant queries

❌ idempotency_key
   - Pentru retry safety Stripe
```

**IMPACT:**

- ❌ Nu putem lega payment de quote
- ❌ Nu putem valida că amount-ul plătit = quote total
- ❌ Nu putem face audit trail complet

**ACȚIUNE:**

- ALTER TABLE `payment_transactions` ADD COLUMNS:
  - `quote_id` uuid FK
  - `organization_id` uuid FK
  - `idempotency_key` varchar UNIQUE

---

### 5️⃣ FINANCIAL SNAPSHOTS - 100% LIPSEȘTE

**CE EXISTĂ:**

```
❌ NIMIC - concept complet nou
```

**CE LIPSEȘTE:**

```
❌ booking_financial_snapshots table
   - Frozen snapshot la momentul payment
   - Revenue splits (platform/operator/driver)
   - Percentages used (pentru audit)
   - Client + revenue breakdown JSONB

❌ Trigger după payment success
   - Auto-create snapshot când payment.status = 'completed'
```

**IMPACT:**

- ❌ Nu avem frozen financials pentru accounting
- ❌ Nu putem face audit la ce commissions s-au aplicat
- ❌ Dacă se schimbă org settings, pierdem history

**ACȚIUNE:**

- CREATE `booking_financial_snapshots` table
- CREATE trigger `on_payment_success_create_snapshot`
- Populate retroactiv pentru 95 bookings existente (din booking_pricing)

---

### 6️⃣ DRIVER PAYOUTS - 100% LIPSEȘTE

**CE EXISTĂ:**

```
🟡 booking_pricing.driver_payout (95 records) - doar suma
🟡 booking_leg_pricing.driver_payout (105 records) - doar suma

❌ ZERO breakdown pentru șofer
   - Nu știe de ce primește X suma
   - Nu are detalii vehicle vs services
   - Nu are tips, bonuses, deductions
```

**CE LIPSEȘTE:**

```
❌ driver_payout_breakdowns table
   - Base payout (din booking)
   - Bonus (tips, incentives)
   - Deductions (penalties)
   - Total payout
   - Breakdown JSONB (vehicle earnings, services earnings)
   - Payout status, method, reference, paid_at
```

**IMPACT:**

- ❌ Șoferul nu vede breakdown transparent
- ❌ Nu putem track tips separate
- ❌ Nu putem track payout status
- ❌ Nu putem face reconciliation driver payments

**ACȚIUNE:**

- CREATE `driver_payout_breakdowns` table
- Link 1:1 cu `booking_financial_snapshots`
- Populate retroactiv pentru 95 bookings

---

### 7️⃣ DISCOUNT SYSTEM - 100% LIPSEȘTE (Viitor)

**CE EXISTĂ:**

```
🟡 client_booking_quotes.discount_pence (field există)
🟡 pricing_config.general_policies.corporate_discounts (JSONB)

❌ ZERO tabele pentru discount management
```

**CE LIPSEȘTE:**

```
❌ discount_campaigns table (promo codes, loyalty, seasonal)
❌ discount_applications table (tracking usage)
```

**PRIORITATE:** Medium (nu pentru MVP, dar pentru viitor)

**ACȚIUNE:**

- CREATE tables în faza 2
- Pentru acum: discounts hardcoded în pricing engine (return, fleet, corporate)

---

### 8️⃣ VIEWS PENTRU BACKEND - 100% LIPSEȘTE

**CE EXISTĂ:**

```
❌ ZERO views pentru pricing
✅ customer_billing_complete (irelevant)
✅ vehicle_service_summary (irelevant)
```

**CE CERE BACKEND:**

```
Backend PricingDataService.ts așteaptă:
❌ v_active_pricing_version
❌ v_pricing_vehicle_rates
❌ v_pricing_hourly_rules (nu e în schema mea - pot folosi v_pricing_vehicle_rates)
❌ v_pricing_daily_rules (nu e în schema mea - pot folosi v_pricing_vehicle_rates)
❌ v_pricing_time_rules
❌ v_pricing_airport_fees
❌ v_pricing_zone_fees
❌ v_pricing_rounding_rules (pot folosi v_pricing_policies)
```

**IMPACT:**

- ❌ Backend Pricing Engine NU funcționează deloc
- ❌ Frontend nu poate calcula prețuri
- ❌ Quote creation imposibilă

**ACȚIUNE:**

- CREATE 5 views după ce tabelele sunt populate
- MODIFY Backend să folosească views (sau direct tabele)

---

## 📈 STATISTICI GAP ANALYSIS

### Tabele Necesare: 18 + 5 views = 23 total

| Categorie                | Total | Există | Parțial | Lipsește | % Complet |
| ------------------------ | ----- | ------ | ------- | -------- | --------- |
| **Master Config**        | 8     | 0      | 0       | 8        | 0%        |
| **Master Transactional** | 5     | 1      | 1       | 3        | 20%       |
| **Auxiliary**            | 2     | 0      | 0       | 2        | 0%        |
| **Legacy**               | 3     | 3      | 0       | 0        | 100%      |
| **Views**                | 5     | 0      | 0       | 5        | 0%        |
| **TOTAL**                | 23    | 4      | 1       | 18       | **22%**   |

---

## 🎯 PRIORITIZARE GAP-URI

### 🔴 CRITICAL (Blocker pentru sistem)

1. **pricing_versions** - fără asta nimic nu funcționează
2. **pricing_vehicle_rates** - core pricing calculation
3. **organization_settings** - VAT rate critical
4. **payment_transactions** ADD quote_id FK - link payment → quote
5. **booking_financial_snapshots** - frozen financials

### 🟡 HIGH (Necesar pentru flow complet)

6. **pricing_time_rules** - night/peak multipliers
7. **pricing_airport_fees** - airport pickups
8. **pricing_zone_fees** - ULEZ/congestion
9. **pricing_service_catalog** - premium services
10. **pricing_policies** - rounding, discounts
11. **quote_service_items** - service tracking
12. **driver_payout_breakdowns** - driver transparency
13. **5x VIEWS** - Backend compatibility

### 🟢 MEDIUM (Viitor)

14. **discount_campaigns** - promo codes (faza 2)
15. **discount_applications** - tracking (faza 2)

---

## 📋 REZUMAT ACȚIUNI

### CREATE (15 tabele noi):

1. pricing_versions
2. pricing_vehicle_rates
3. pricing_time_rules
4. pricing_airport_fees
5. pricing_zone_fees
6. pricing_service_catalog
7. pricing_policies
8. organization_settings
9. quote_service_items
10. booking_financial_snapshots
11. driver_payout_breakdowns
12. discount_campaigns
13. discount_applications
14. (+5 VIEWS)

### EXTEND (1 tabelă):

- payment_transactions (ADD quote_id, organization_id, idempotency_key)

### KEEP (1 tabelă):

- client_booking_quotes (deja corect)

### DEPRECATE (3 tabele):

- booking_pricing (read-only pentru date vechi)
- booking_leg_pricing (read-only)
- pricing_config (read-only, migrare → normalize)

---

**NEXT:** Pasul 3 - Decision Matrix (keep/extend/replace/deprecate pentru fiecare)
