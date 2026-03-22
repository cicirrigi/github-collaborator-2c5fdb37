# 📐 PRICING & PAYMENTS - SCHEMA DB FINALĂ

**Versiune:** 1.0  
**Data:** 18 Martie 2026  
**Scop:** Arhitectură completă și definitivă pentru pricing, quotes, payments, discounts, financials

---

## 🎯 PRINCIPII DE DESIGN

### Single Source of Truth (SSOT)

- **Pricing Config** = SSOT pentru reguli de pricing
- **Client Quote** = SSOT pentru ce trebuie plătit de client
- **Payment Transaction** = SSOT pentru ce s-a plătit efectiv
- **Financial Snapshot** = SSOT pentru financials la momentul T
- **Driver Breakdown** = SSOT pentru ce primește șoferul

### Immutability & Auditability

- Quotes = immutable după lock
- Payments = append-only (nu se modifică, se creează noi)
- Snapshots = frozen în timp (read-only după creare)
- Toate tabelele au `created_at`, `updated_at`, `deleted_at`

### Versioning & Traceability

- Pricing config versioning (pentru history)
- Quote versioning (dacă clientul renegociază)
- Traceability completă: quote → payment → financial snapshot

---

## 📊 PASUL 1: SCHEMA FINALĂ - TOATE TABELELE

### 🔵 MASTER TABLES (Source of Truth)

#### **1. pricing_versions**

**Rol:** Master versioning pentru toate regulile de pricing  
**Tip:** Master configuration  
**Immutable:** Da (după publish)

```sql
pricing_versions
├─ id (uuid, PK)
├─ version_number (integer, UNIQUE) -- 1, 2, 3...
├─ version_name (varchar) -- "Winter 2026", "Q1 2026"
├─ is_active (boolean) -- doar 1 poate fi active
├─ is_published (boolean) -- draft vs published
├─ effective_from (timestamptz) -- când intră în vigoare
├─ effective_until (timestamptz, nullable) -- când expiră
├─ created_by (uuid, FK → admin_users)
├─ published_by (uuid, FK → admin_users, nullable)
├─ published_at (timestamptz, nullable)
├─ notes (text)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)
```

**Relații OUT:**

- → `pricing_vehicle_rates` (1:N)
- → `pricing_time_rules` (1:N)
- → `pricing_airport_fees` (1:N)
- → `pricing_zone_fees` (1:N)
- → `client_booking_quotes` (1:N) - quotes folosesc version_id

---

#### **2. pricing_vehicle_rates**

**Rol:** Tarife per vehicul și booking type (normalize din pricing_config.vehicle_types)  
**Tip:** Master configuration  
**Immutable:** Da (după publish version)

```sql
pricing_vehicle_rates
├─ id (uuid, PK)
├─ pricing_version_id (uuid, FK → pricing_versions)
├─ organization_id (uuid, FK → organizations, nullable) -- per-org overrides
├─ vehicle_category_id (varchar) -- 'executive', 'luxury', 'suv', 'mpv'
├─ booking_type (varchar) -- 'oneway', 'return', 'hourly', 'daily', 'fleet'
├─ base_fare_pence (integer) -- £70 → 7000 pence
├─ per_mile_first_6_pence (integer) -- £2.80 → 280 pence
├─ per_mile_after_6_pence (integer) -- £2.20 → 220 pence
├─ per_minute_pence (integer) -- £0.45 → 45 pence
├─ minimum_fare_pence (integer) -- £90 → 9000 pence
├─ hourly_in_town_pence (integer, nullable) -- for hourly bookings
├─ hourly_out_town_pence (integer, nullable)
├─ daily_rate_pence (integer, nullable) -- for daily bookings
├─ active (boolean, default: true)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

UNIQUE (pricing_version_id, vehicle_category_id, booking_type, organization_id)
INDEX (pricing_version_id, vehicle_category_id, booking_type, active)
INDEX (organization_id) WHERE organization_id IS NOT NULL
```

**Relații IN:**

- `pricing_versions` → (N:1)
- `organizations` → (N:1, nullable)

---

#### **3. pricing_time_rules**

**Rol:** Time multipliers (night, peak, weekend) (normalize din pricing_config.time_multipliers)  
**Tip:** Master configuration  
**Immutable:** Da

```sql
pricing_time_rules
├─ id (uuid, PK)
├─ pricing_version_id (uuid, FK → pricing_versions)
├─ time_period (varchar) -- 'night', 'peak_morning', 'peak_evening', 'weekend', 'day'
├─ label (varchar) -- "Night (22:00-06:00)"
├─ multiplier (numeric(4,2)) -- 1.30 pentru night
├─ start_time (time, nullable) -- "22:00"
├─ end_time (time, nullable) -- "06:00"
├─ days_of_week (integer[], nullable) -- [1,2,3,4,5] pentru weekdays, [0,6] pentru weekend
├─ priority (integer) -- pentru overlap resolution (mai mare = mai prioritar)
├─ active (boolean, default: true)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

UNIQUE (pricing_version_id, time_period)
INDEX (pricing_version_id, active)
```

---

#### **4. pricing_airport_fees**

**Rol:** Airport pickup/dropoff fees (normalize din pricing_config.airport_fees)  
**Tip:** Master configuration  
**Immutable:** Da

```sql
pricing_airport_fees
├─ id (uuid, PK)
├─ pricing_version_id (uuid, FK → pricing_versions)
├─ airport_code (varchar(3)) -- 'LHR', 'LGW', 'STN', 'LTN', 'LCY'
├─ airport_name (varchar) -- "London Heathrow"
├─ pickup_fee_pence (integer) -- £5 → 500 pence
├─ dropoff_fee_pence (integer)
├─ free_wait_minutes (integer) -- 45 minutes
├─ active (boolean, default: true)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

UNIQUE (pricing_version_id, airport_code)
INDEX (pricing_version_id, active)
INDEX (airport_code)
```

---

#### **5. pricing_zone_fees**

**Rol:** Congestion/toll zone fees (normalize din pricing_config.zone_fees)  
**Tip:** Master configuration  
**Immutable:** Da

```sql
pricing_zone_fees
├─ id (uuid, PK)
├─ pricing_version_id (uuid, FK → pricing_versions)
├─ zone_code (varchar) -- 'ulez', 'lez', 'central_london', 'm6', 'dartford'
├─ zone_name (varchar) -- "ULEZ Zone"
├─ fee_type (varchar) -- 'congestion', 'toll'
├─ fee_pence (integer) -- £12.50 → 1250 pence
├─ active (boolean, default: true)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

UNIQUE (pricing_version_id, zone_code)
INDEX (pricing_version_id, active)
INDEX (zone_code)
```

---

#### **6. pricing_service_catalog**

**Rol:** Catalog servicii premium (flowers, champagne, child_seat, etc.)  
**Tip:** Master catalog  
**Immutable:** Nu (prețurile se pot schimba)

```sql
pricing_service_catalog
├─ id (uuid, PK)
├─ pricing_version_id (uuid, FK → pricing_versions)
├─ service_code (varchar, UNIQUE) -- 'CHILD_SEAT', 'FLOWERS_STD', 'CHAMPAGNE_PREM'
├─ service_category (varchar) -- 'child_safety', 'flowers', 'champagne', 'security', 'meet_greet'
├─ service_name (varchar) -- "Child Safety Seat"
├─ service_variant (varchar, nullable) -- "standard", "premium", "exclusive"
├─ unit_price_pence (integer) -- £15 → 1500 pence
├─ is_taxable (boolean, default: true) -- VAT aplicabil?
├─ requires_advance_booking (boolean, default: false)
├─ min_advance_hours (integer, nullable)
├─ max_quantity (integer, default: 1)
├─ active (boolean, default: true)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

UNIQUE (pricing_version_id, service_code)
INDEX (pricing_version_id, service_category, active)
INDEX (service_code)
```

---

#### **7. pricing_policies**

**Rol:** Global policies (rounding, cancellation, corporate discounts)  
**Tip:** Master configuration  
**Immutable:** Da

```sql
pricing_policies
├─ id (uuid, PK)
├─ pricing_version_id (uuid, FK → pricing_versions)
├─ policy_type (varchar) -- 'rounding', 'cancellation', 'corporate_discount', 'return_discount', 'fleet_discount'
├─ policy_config (jsonb) -- flexible JSON pentru orice policy
├─ active (boolean, default: true)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

-- Exemple policy_config:
-- Rounding: {"round_to_pence": 500, "direction": "up"}
-- Cancellation: {"free_hours": 2, "charge_rate": 1.0}
-- Corporate: {"tier1_discount": 0.10, "tier2_discount": 0.15}
-- Return: {"discount_rate": 0.10, "minimum_hours_between": 2}
-- Fleet: {"tier1": {"min_vehicles": 3, "discount": 0.05}, "tier2": {"min_vehicles": 5, "discount": 0.10}}

UNIQUE (pricing_version_id, policy_type)
INDEX (pricing_version_id, active)
```

---

#### **8. organization_settings**

**Rol:** Settings per organization (VAT, commissions, timezone)  
**Tip:** Master configuration per-org  
**Immutable:** Nu (se pot modifica)

```sql
organization_settings
├─ id (uuid, PK)
├─ organization_id (uuid, FK → organizations, UNIQUE)
├─ vat_rate (numeric(4,2), default: 0.20) -- 20% UK VAT
├─ platform_commission_pct (numeric(4,2), default: 0.10) -- 10%
├─ operator_commission_pct (numeric(4,2), default: 0.10) -- 10%
├─ currency (varchar(3), default: 'GBP')
├─ timezone (varchar, default: 'Europe/London')
├─ booking_lead_time_hours (integer, default: 2) -- minimum notice
├─ max_advance_booking_days (integer, default: 365)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

UNIQUE (organization_id)
```

**Relații IN:**

- `organizations` → (1:1)

---

#### **9. client_booking_quotes** ⭐

**Rol:** MASTER TRUTH pentru pricing către client (ce trebuie plătit)  
**Tip:** Master transactional  
**Immutable:** Da (după lock)

```sql
client_booking_quotes
├─ id (uuid, PK)
├─ booking_id (uuid, FK → bookings, UNIQUE) -- 1:1 cu booking
├─ organization_id (uuid, FK → organizations)
├─ pricing_version_id (uuid, FK → pricing_versions) -- traceability
├─ version (integer, default: 1) -- pentru requote
├─ quote_number (varchar, UNIQUE) -- "QT-2026-001234"
│
├─ -- VEHICLE PRICING
├─ vehicle_subtotal_pence (integer) -- înainte de VAT
├─ vehicle_discount_pence (integer, default: 0) -- return/fleet/corporate
│
├─ -- SERVICES PRICING
├─ services_subtotal_pence (integer) -- total services înainte VAT
├─ services_discount_pence (integer, default: 0) -- dacă există
│
├─ -- TOTALS
├─ subtotal_pence (integer) -- vehicle + services după discounts
├─ vat_rate (numeric(4,2)) -- 0.20 (copiat din org settings)
├─ vat_pence (integer) -- calculat
├─ total_pence (integer) -- final amount
├─ currency (varchar(3), default: 'GBP')
│
├─ -- BREAKDOWN JSONB
├─ line_items (jsonb) -- detailed breakdown
│   /*
│   {
│     "vehicle": {
│       "base_fare": 7000,
│       "distance_charge": 4500,
│       "time_multipliers": [{"type": "night", "amount": 2000}],
│       "airport_fees": [{"airport": "LHR", "amount": 500}],
│       "zone_fees": [{"zone": "ulez", "amount": 1250}],
│       "subtotal_before_discount": 15250,
│       "discount": {"type": "return", "rate": 0.10, "amount": 1525},
│       "subtotal_after_discount": 13725
│     },
│     "services": [
│       {"code": "CHILD_SEAT", "name": "Child Safety Seat", "qty": 1, "unit_price": 1500, "subtotal": 1500},
│       {"code": "FLOWERS_STD", "name": "Standard Bouquet", "qty": 1, "unit_price": 12000, "subtotal": 12000}
│     ],
│     "summary": {
│       "vehicle_subtotal": 13725,
│       "services_subtotal": 13500,
│       "total_before_vat": 27225,
│       "vat": 5445,
│       "total": 32670
│     }
│   }
│   */
│
├─ -- METADATA
├─ calc_source (varchar, default: 'pricing_engine_v2')
├─ calc_version (varchar, default: '2.0.0')
├─ calculated_at (timestamptz)
│
├─ -- LIFECYCLE
├─ quote_valid_until (timestamptz) -- expiry (24h default)
├─ is_locked (boolean, default: false) -- locked după payment confirm
├─ locked_at (timestamptz, nullable)
├─ locked_by (varchar, nullable) -- 'payment', 'admin', etc.
│
├─ created_at (timestamptz)
├─ updated_at (timestamptz)
└─ deleted_at (timestamptz, nullable) -- soft delete

UNIQUE (booking_id)
INDEX (organization_id, created_at DESC)
INDEX (pricing_version_id)
INDEX (is_locked, quote_valid_until)
INDEX (quote_number)
```

**Relații IN:**

- `bookings` → (1:1)
- `organizations` → (N:1)
- `pricing_versions` → (N:1)

**Relații OUT:**

- → `quote_service_items` (1:N)
- → `payment_transactions` (1:N)
- → `booking_financial_snapshots` (1:N)

---

#### **10. quote_service_items**

**Rol:** Link între quote și service items comandate  
**Tip:** Auxiliary transactional  
**Immutable:** Da (după quote lock)

```sql
quote_service_items
├─ id (uuid, PK)
├─ quote_id (uuid, FK → client_booking_quotes)
├─ service_code (varchar) -- din pricing_service_catalog
├─ service_name (varchar) -- snapshot name
├─ quantity (integer, default: 1)
├─ unit_price_pence (integer) -- snapshot price
├─ subtotal_pence (integer) -- qty * unit_price
├─ is_taxable (boolean) -- pentru VAT calculation
├─ sort_order (integer) -- display order
├─ created_at (timestamptz)

INDEX (quote_id, sort_order)
INDEX (service_code)
```

**Relații IN:**

- `client_booking_quotes` → (N:1)

---

#### **11. payment_transactions** ⭐

**Rol:** MASTER TRUTH pentru payments Stripe (ce s-a plătit efectiv)  
**Tip:** Master transactional  
**Immutable:** Da (append-only)

```sql
payment_transactions
├─ id (uuid, PK)
├─ booking_id (uuid, FK → bookings)
├─ quote_id (uuid, FK → client_booking_quotes) -- link la quote
├─ organization_id (uuid, FK → organizations)
│
├─ -- AMOUNTS
├─ amount_pence (integer) -- should match quote.total_pence
├─ currency (varchar(3), default: 'GBP')
│
├─ -- STRIPE
├─ stripe_payment_intent_id (varchar, UNIQUE)
├─ stripe_charge_id (varchar, nullable)
├─ stripe_status (varchar) -- 'requires_payment_method', 'succeeded', 'canceled', etc.
├─ stripe_fee_pence (integer, default: 0) -- Stripe commission
├─ net_amount_pence (integer) -- amount - stripe_fee
│
├─ -- PAYMENT DETAILS
├─ payment_method_type (varchar) -- 'card', 'wallet', 'bank_transfer'
├─ payment_method_last4 (varchar, nullable)
├─ payment_method_brand (varchar, nullable) -- 'visa', 'mastercard'
│
├─ -- STATUS
├─ status (varchar) -- 'pending', 'processing', 'completed', 'failed', 'refunded'
├─ failure_reason (text, nullable)
├─ refund_amount_pence (integer, default: 0)
├─ refund_reason (text, nullable)
│
├─ -- METADATA
├─ metadata (jsonb) -- extra Stripe metadata
├─ idempotency_key (varchar, UNIQUE) -- pentru retry safety
│
├─ -- TIMESTAMPS
├─ processed_at (timestamptz, nullable) -- când Stripe confirmă
├─ refunded_at (timestamptz, nullable)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

INDEX (booking_id, created_at DESC)
INDEX (quote_id)
INDEX (organization_id, created_at DESC)
INDEX (stripe_payment_intent_id)
INDEX (status, created_at DESC)
INDEX (idempotency_key)
```

**Relații IN:**

- `bookings` → (N:1) -- multiple payments possible (deposit + final)
- `client_booking_quotes` → (N:1)
- `organizations` → (N:1)

**Relații OUT:**

- → `booking_financial_snapshots` (1:1) -- trigger after payment success

---

#### **12. booking_financial_snapshots** ⭐

**Rol:** FROZEN TRUTH la momentul payment (pentru audit & accounting)  
**Tip:** Derived snapshot (immutable)  
**Immutable:** Da (frozen în timp)

```sql
booking_financial_snapshots
├─ id (uuid, PK)
├─ booking_id (uuid, FK → bookings)
├─ quote_id (uuid, FK → client_booking_quotes)
├─ payment_transaction_id (uuid, FK → payment_transactions, UNIQUE)
├─ organization_id (uuid, FK → organizations)
├─ snapshot_version (integer, default: 1) -- pentru future revisions
│
├─ -- CLIENT SIDE (ce a plătit clientul)
├─ client_total_pence (integer) -- din quote
├─ client_vat_pence (integer)
├─ client_net_pence (integer) -- total - vat
│
├─ -- REVENUE SPLITS (calculat la snapshot time)
├─ gross_revenue_pence (integer) -- = client_total_pence
├─ platform_fee_pence (integer) -- platform commission
├─ operator_net_pence (integer) -- ce rămâne operator-ului
├─ driver_payout_pence (integer) -- ce primește șoferul
├─ stripe_fee_pence (integer) -- Stripe cut
│
├─ -- PERCENTAGES USED (snapshot pentru audit)
├─ platform_commission_pct (numeric(4,2))
├─ operator_commission_pct (numeric(4,2))
├─ driver_commission_pct (numeric(4,2))
├─ vat_rate (numeric(4,2))
│
├─ -- BREAKDOWN SNAPSHOTS (frozen JSONB)
├─ client_breakdown_snapshot (jsonb) -- copy din quote.line_items
├─ revenue_split_snapshot (jsonb)
│   /*
│   {
│     "gross_revenue": 32670,
│     "stripe_fee": 1015,
│     "net_after_stripe": 31655,
│     "platform_fee": 3166,
│     "operator_gross": 28489,
│     "driver_payout": 25640,
│     "operator_net": 2849
│   }
│   */
│
├─ -- METADATA
├─ snapshot_reason (varchar) -- 'payment_success', 'manual_adjustment'
├─ snapshotted_at (timestamptz) -- când s-a făcut snapshot
├─ snapshotted_by (varchar) -- 'system', 'admin_user_id'
│
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

UNIQUE (payment_transaction_id) -- 1:1 cu payment
INDEX (booking_id, created_at DESC)
INDEX (quote_id)
INDEX (organization_id, snapshotted_at DESC)
```

**Relații IN:**

- `bookings` → (N:1)
- `client_booking_quotes` → (N:1)
- `payment_transactions` → (1:1)
- `organizations` → (N:1)

---

#### **13. driver_payout_breakdowns**

**Rol:** BREAKDOWN pentru șofer (ce primește și de ce)  
**Tip:** Derived (calculat din snapshot)  
**Immutable:** Da

```sql
driver_payout_breakdowns
├─ id (uuid, PK)
├─ booking_id (uuid, FK → bookings)
├─ driver_id (uuid, FK → drivers)
├─ financial_snapshot_id (uuid, FK → booking_financial_snapshots, UNIQUE)
│
├─ -- DRIVER EARNINGS
├─ base_payout_pence (integer) -- booking price * driver_commission
├─ bonus_pence (integer, default: 0) -- tips, bonuses
├─ deductions_pence (integer, default: 0) -- penalties, fees
├─ total_payout_pence (integer) -- base + bonus - deductions
│
├─ -- BREAKDOWN
├─ payout_breakdown (jsonb)
│   /*
│   {
│     "vehicle_earnings": 13000,
│     "services_earnings": 2000,
│     "time_multiplier_bonus": 500,
│     "tips": 0,
│     "total_gross": 15500,
│     "platform_fee": 1550,
│     "net_payout": 13950
│   }
│   */
│
├─ -- STATUS
├─ payout_status (varchar) -- 'pending', 'processing', 'paid', 'held'
├─ payout_method (varchar) -- 'bank_transfer', 'stripe_connect'
├─ payout_reference (varchar, nullable) -- external payout ID
├─ paid_at (timestamptz, nullable)
│
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

UNIQUE (financial_snapshot_id)
INDEX (driver_id, payout_status, created_at DESC)
INDEX (booking_id)
```

**Relații IN:**

- `bookings` → (N:1)
- `drivers` → (N:1)
- `booking_financial_snapshots` → (1:1)

---

### 🟡 AUXILIARY TABLES (Support)

#### **14. discount_campaigns**

**Rol:** Campanii de discount (promo codes, loyalty, seasonal)  
**Tip:** Auxiliary configuration  
**Immutable:** Nu

```sql
discount_campaigns
├─ id (uuid, PK)
├─ organization_id (uuid, FK → organizations)
├─ campaign_code (varchar, UNIQUE) -- "SUMMER2026"
├─ campaign_name (varchar)
├─ campaign_type (varchar) -- 'promo_code', 'loyalty', 'seasonal', 'corporate'
├─ discount_type (varchar) -- 'percentage', 'fixed_amount'
├─ discount_value (numeric) -- 0.10 sau 1000 pence
├─ min_booking_value_pence (integer, nullable)
├─ max_discount_pence (integer, nullable)
├─ applicable_booking_types (varchar[]) -- ['oneway', 'return']
├─ valid_from (timestamptz)
├─ valid_until (timestamptz)
├─ max_uses_total (integer, nullable)
├─ max_uses_per_customer (integer, default: 1)
├─ current_uses (integer, default: 0)
├─ is_active (boolean, default: true)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

UNIQUE (campaign_code)
INDEX (organization_id, is_active, valid_from, valid_until)
```

---

#### **15. discount_applications**

**Rol:** Track când și unde s-au aplicat discount-uri  
**Tip:** Auxiliary transactional  
**Immutable:** Da

```sql
discount_applications
├─ id (uuid, PK)
├─ quote_id (uuid, FK → client_booking_quotes)
├─ booking_id (uuid, FK → bookings)
├─ discount_campaign_id (uuid, FK → discount_campaigns)
├─ customer_id (uuid, FK → customers)
├─ discount_amount_pence (integer) -- cât s-a redus
├─ applied_at (timestamptz)
├─ created_at (timestamptz)

INDEX (quote_id)
INDEX (discount_campaign_id, applied_at)
INDEX (customer_id, applied_at)
```

---

### 🔴 LEGACY TABLES (Keep for backwards compatibility)

#### **16. booking_pricing** [LEGACY]

**Rol:** Vechiul sistem de pricing (păstrat pentru date existente)  
**Status:** DEPRECATE (nu se mai folosește pentru booking-uri noi)  
**Keep:** Da (pentru 95 bookings existente)

```sql
booking_pricing -- LEGACY
├─ booking_id (uuid, PK)
├─ price (numeric) -- keep as-is
├─ currency (varchar)
├─ platform_fee (numeric)
├─ operator_net (numeric)
├─ driver_payout (numeric)
├─ payment_method (varchar)
├─ payment_status (varchar)
├─ created_at (timestamp)
├─ platform_commission_pct (numeric)
├─ driver_commission_pct (numeric)
└─ extras_total (numeric)

-- MODIFICARE: Adaugă FK la noul sistem
ALTER TABLE booking_pricing ADD COLUMN financial_snapshot_id uuid REFERENCES booking_financial_snapshots(id);
```

---

#### **17. booking_leg_pricing** [LEGACY]

**Rol:** Pricing per leg (vechiul sistem)  
**Status:** DEPRECATE (va fi înlocuit de breakdown în snapshot)  
**Keep:** Da (pentru 105 legs existente)

```sql
booking_leg_pricing -- LEGACY
├─ id (uuid, PK)
├─ leg_id (uuid, FK → booking_legs)
├─ leg_price (numeric)
├─ driver_payout (numeric)
├─ platform_fee (numeric)
├─ operator_net (numeric)
├─ vat_amount (numeric)
├─ total_with_vat (numeric)
├─ payout_status (text)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

-- Păstrat read-only pentru date vechi
```

---

#### **18. pricing_config** [LEGACY]

**Rol:** Vechiul JSONB monolitic  
**Status:** DEPRECATE (va fi înlocuit de tabele normalize)  
**Keep:** Da (ca backup și pentru migrare)

```sql
pricing_config -- LEGACY
-- Schema existentă păstrată
-- Marcat ca read-only
-- Va fi folosit pentru populate pricing_versions + tabele normalize
```

---

### 📊 DERIVED TABLES & VIEWS

#### **VIEW: v_active_pricing_version**

**Rol:** Quick access la versiunea activă

```sql
CREATE VIEW v_active_pricing_version AS
SELECT * FROM pricing_versions
WHERE is_active = true AND is_published = true
LIMIT 1;
```

---

#### **VIEW: v_pricing_vehicle_rates**

**Rol:** Backend compatibility pentru PricingDataService

```sql
CREATE VIEW v_pricing_vehicle_rates AS
SELECT
  r.*,
  v.version_number,
  v.version_name
FROM pricing_vehicle_rates r
JOIN pricing_versions v ON r.pricing_version_id = v.id
WHERE v.is_active = true AND r.active = true;
```

---

#### **VIEW: v_pricing_time_rules**

```sql
CREATE VIEW v_pricing_time_rules AS
SELECT
  t.*,
  v.version_number
FROM pricing_time_rules t
JOIN pricing_versions v ON t.pricing_version_id = v.id
WHERE v.is_active = true AND t.active = true;
```

---

#### **VIEW: v_pricing_airport_fees**

```sql
CREATE VIEW v_pricing_airport_fees AS
SELECT
  a.*,
  v.version_number
FROM pricing_airport_fees a
JOIN pricing_versions v ON a.pricing_version_id = v.id
WHERE v.is_active = true AND a.active = true;
```

---

#### **VIEW: v_pricing_zone_fees**

```sql
CREATE VIEW v_pricing_zone_fees AS
SELECT
  z.*,
  v.version_number
FROM pricing_zone_fees z
JOIN pricing_versions v ON z.pricing_version_id = v.id
WHERE v.is_active = true AND z.active = true;
```

---

## 🎯 SURSE DE ADEVĂR (Single Source of Truth)

| Întrebare                                  | SSOT Table                                         |
| ------------------------------------------ | -------------------------------------------------- |
| **Ce reguli de pricing sunt active acum?** | `pricing_versions` (is_active=true)                |
| **Cât costă un Executive pentru oneway?**  | `pricing_vehicle_rates`                            |
| **Ce discount se aplică pentru return?**   | `pricing_policies` (policy_type='return_discount') |
| **Cât trebuie să plătească clientul?**     | `client_booking_quotes` ⭐                         |
| **Ce servicii a comandat?**                | `quote_service_items`                              |
| **Cât a plătit efectiv clientul?**         | `payment_transactions` ⭐                          |
| **Care e breakdown-ul financiar?**         | `booking_financial_snapshots` ⭐                   |
| **Cât primește șoferul?**                  | `driver_payout_breakdowns` ⭐                      |
| **Ce VAT rate folosește org-ul?**          | `organization_settings`                            |

---

## 🔗 RELAȚII ȘI FK-URI (Entity Relationship)

```
pricing_versions (master)
  ├─→ pricing_vehicle_rates (1:N)
  ├─→ pricing_time_rules (1:N)
  ├─→ pricing_airport_fees (1:N)
  ├─→ pricing_zone_fees (1:N)
  ├─→ pricing_service_catalog (1:N)
  ├─→ pricing_policies (1:N)
  └─→ client_booking_quotes (1:N)

organizations
  ├─→ organization_settings (1:1)
  ├─→ pricing_vehicle_rates (1:N, nullable override)
  ├─→ client_booking_quotes (1:N)
  ├─→ payment_transactions (1:N)
  ├─→ booking_financial_snapshots (1:N)
  └─→ discount_campaigns (1:N)

bookings (master)
  ├─→ client_booking_quotes (1:1) ⭐
  ├─→ payment_transactions (1:N)
  ├─→ booking_financial_snapshots (1:N)
  ├─→ driver_payout_breakdowns (1:N)
  └─→ booking_pricing [LEGACY] (1:1)

client_booking_quotes ⭐
  ├─→ quote_service_items (1:N)
  ├─→ payment_transactions (1:N)
  ├─→ booking_financial_snapshots (1:N)
  └─→ discount_applications (1:N)

payment_transactions ⭐
  └─→ booking_financial_snapshots (1:1) [via trigger]

booking_financial_snapshots ⭐
  └─→ driver_payout_breakdowns (1:1)
```

---

## ✅ REZUMAT SCHEMA

### Tabele MASTER (13):

1. ✅ `pricing_versions`
2. ✅ `pricing_vehicle_rates`
3. ✅ `pricing_time_rules`
4. ✅ `pricing_airport_fees`
5. ✅ `pricing_zone_fees`
6. ✅ `pricing_service_catalog`
7. ✅ `pricing_policies`
8. ✅ `organization_settings`
9. ✅ `client_booking_quotes` ⭐
10. ✅ `quote_service_items`
11. ✅ `payment_transactions` ⭐
12. ✅ `booking_financial_snapshots` ⭐
13. ✅ `driver_payout_breakdowns` ⭐

### Tabele AUXILIARY (2):

14. ✅ `discount_campaigns`
15. ✅ `discount_applications`

### Tabele LEGACY (3):

16. 🔴 `booking_pricing` [DEPRECATE]
17. 🔴 `booking_leg_pricing` [DEPRECATE]
18. 🔴 `pricing_config` [DEPRECATE]

### VIEWS (4):

- ✅ `v_active_pricing_version`
- ✅ `v_pricing_vehicle_rates`
- ✅ `v_pricing_time_rules`
- ✅ `v_pricing_airport_fees`
- ✅ `v_pricing_zone_fees`

**TOTAL:** 18 tabele + 5 views

---

**NEXT:** Pasul 2 - Gap Analysis (ce există vs ce lipsește)
