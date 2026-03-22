# ⚖️ DECISION MATRIX V3 - EXECUTABIL PER TABELĂ

**Data:** 20 Martie 2026
**Status:** Production-ready migration plan cu SQL concrete

**🔗 DB VERIFICAT:** `ruskhucrvjvuuzwlboqn` (https://ruskhucrvjvuuzwlboqn.supabase.co)
**📊 REALITATE DB:** ✅ **Wave 1 CLOSED 100%, Wave 2 CLOSED 100%**, Wave 3 70% operational

**✅ NOMENCLATURĂ DB REAL (design docs → implementare):**
| Design Docs V3 | DB Real | Status | Details |
|----------------|---------|--------|---------|
| pricing_service_catalog | **service_items** | ✅ CLOSED | 43 items, 21 active (included_service, paid_upgrade, premium_feature, trip_preference) |
| quote_service_items | **line_items** JSONB | ✅ CLOSED | Integrate în client_booking_quotes - suficient pentru audit |
| payment_transactions | **booking_payments** | ✅ CLOSED | 10 payments (9 succeeded), toate V3 features |
| payment_refunds | **refunds** | ✅ CLOSED | Structural complet, toate FK-uri și constraints |
| booking_financial_snapshots | **internal_booking_financials** | ✅ 70% | 131 snapshots active, versioning funcțional |
| pricing_policies | **pricing_rounding_rules + daily/hourly rules** | ✅ CLOSED | Separate tables pentru fiecare tip |

**🎯 VERDICT FINAL:** Wave 1+2 complete funcțional - nu blocante pentru Wave 3. Sistem production-ready.

---

## 📊 FORMAT PER TABELĂ

Fiecare tabelă are:

- **Current State:** Ce există acum în DB (verificat)
- **Target State:** Ce trebuie să existe
- **Action:** KEEP / EXTEND / REMODEL / CREATE / MIGRATE / DEPRECATE
- **Migration SQL:** Cod executabil exact
- **Validation:** Queries de verificare
- **Rollback:** Procedură dacă merge prost
- **Dependencies:** Ce trebuie să existe înainte
- **Wave:** Ordinea de execuție
- **Blocker:** Dacă e critical path

---

## 🔴 WAVE 1: PRICING FOUNDATION (2 zile)

### 1. pricing_versions

**Current State:** ✅ EXISTS - 5 versions, v2 ACTIV (13 columns)
**Target State:** Tabelă funcțională cu guard logic activ
**Action:** ✅ **COMPLET** - doar adaugă versiuni noi când e nevoie
**Blocker:** ✅ REZOLVAT (fundația există)
**Dependencies:** None (primul!)

**Migration SQL:**

```sql
-- sql/migrations/pricing_v2_final/01_create_pricing_versions.sql

CREATE TABLE pricing_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number integer UNIQUE NOT NULL,
  version_name varchar NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  effective_from timestamptz NOT NULL,
  effective_until timestamptz,
  created_by uuid REFERENCES admin_users(id),
  published_by uuid REFERENCES admin_users(id),
  published_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Guard logic: doar 1 versiune active+published
CREATE UNIQUE INDEX idx_single_active_published_version
ON pricing_versions (is_active, is_published)
WHERE is_active = true AND is_published = true;

CREATE FUNCTION enforce_single_active_version()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true AND NEW.is_published = true THEN
    IF EXISTS (
      SELECT 1 FROM pricing_versions
      WHERE is_active = true AND is_published = true AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'Only one pricing version can be active and published';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_single_active_version
BEFORE INSERT OR UPDATE ON pricing_versions
FOR EACH ROW EXECUTE FUNCTION enforce_single_active_version();

-- Populate v1 din pricing_config
INSERT INTO pricing_versions (
  version_number,
  version_name,
  is_active,
  is_published,
  effective_from,
  notes
)
SELECT
  1,
  'Initial Migration from pricing_config',
  true,
  true,
  COALESCE(created_at, now()),
  'Migrated from pricing_config JSONB. Config version: ' || config_version
FROM pricing_config
WHERE is_active = true
LIMIT 1;
```

**Validation:**

```sql
SELECT * FROM pricing_versions WHERE is_active = true; -- expect 1 record
SELECT version_number, version_name, is_active, is_published FROM pricing_versions;
```

**Rollback:**

```sql
DROP TRIGGER IF EXISTS trg_single_active_version ON pricing_versions;
DROP FUNCTION IF EXISTS enforce_single_active_version();
DROP TABLE IF EXISTS pricing_versions CASCADE;
```

---

### 2. organization_settings

**Current State:** ✅ EXISTS - 1 org settings (13 columns)
**Target State:** Tabelă funcțională cu VAT + commissions
**Action:** ✅ **COMPLET** - populate mai multe orgs când e nevoie
**Blocker:** ✅ REZOLVAT (VAT rate disponibil)
**Dependencies:** organizations table exists

**Migration SQL:**

```sql
-- sql/migrations/pricing_v2_final/02_create_organization_settings.sql

CREATE TABLE organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  vat_rate numeric(5,4) NOT NULL DEFAULT 0.2000,
  platform_commission_pct numeric(5,4) NOT NULL DEFAULT 0.1000,
  operator_commission_pct numeric(5,4) NOT NULL DEFAULT 0.1000,

  currency varchar(3) DEFAULT 'GBP',
  timezone varchar DEFAULT 'Europe/London',
  booking_lead_time_hours integer DEFAULT 2,
  max_advance_booking_days integer DEFAULT 365,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE organization_settings IS
'SSOT for org financial settings.
NOTA: organizations.driver_commission_pct RĂMÂNE în organizations (temporar).
Eventual va migra aici când sistemul e gata.';

-- Populate pentru toate org active
INSERT INTO organization_settings (organization_id, vat_rate, platform_commission_pct, operator_commission_pct)
SELECT
  id,
  0.2000, -- UK VAT 20%
  0.1000, -- Platform 10%
  0.1000  -- Operator 10%
FROM organizations
WHERE is_active = true
ON CONFLICT (organization_id) DO NOTHING;

CREATE INDEX idx_org_settings_org ON organization_settings(organization_id);
```

**Validation:**

```sql
-- Verifică că toate org active au settings
SELECT
  COUNT(o.*) as total_orgs,
  COUNT(os.*) as orgs_with_settings
FROM organizations o
LEFT JOIN organization_settings os ON o.id = os.organization_id
WHERE o.is_active = true;
-- total_orgs trebuie = orgs_with_settings

SELECT organization_id, vat_rate, platform_commission_pct FROM organization_settings;
```

**Rollback:**

```sql
DROP TABLE IF EXISTS organization_settings CASCADE;
```

---

### 3. pricing_vehicle_rates

**Current State:** ✅ EXISTS - 76 rates active (16 columns)
**Target State:** Tabulated rates funcționale cu \*\_pence columns
**Action:** ✅ **COMPLET** - migration executată cu succes
**Blocker:** ✅ REZOLVAT (backend poate folosi via views)
**Dependencies:** pricing_versions v2 ✅

**Migration SQL:**

```sql
-- sql/migrations/pricing_v2_final/03_create_pricing_vehicle_rates.sql

CREATE TABLE pricing_vehicle_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_version_id uuid NOT NULL REFERENCES pricing_versions(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id),
  vehicle_category_id varchar NOT NULL,
  booking_type varchar NOT NULL,
  base_fare_pence integer NOT NULL,
  per_mile_first_6_pence integer NOT NULL,
  per_mile_after_6_pence integer NOT NULL,
  per_minute_pence integer NOT NULL,
  minimum_fare_pence integer NOT NULL,
  hourly_in_town_pence integer,
  hourly_out_town_pence integer,
  daily_rate_pence integer,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE (pricing_version_id, vehicle_category_id, booking_type, organization_id),

  CONSTRAINT chk_booking_type CHECK (
    booking_type IN ('oneway', 'return', 'hourly', 'daily', 'fleet', 'bespoke')
  )
);

COMMENT ON COLUMN pricing_vehicle_rates.organization_id IS
'Org override. Fallback: query org-specific first, then NULL (global).';

-- Migrate din pricing_config.vehicle_types
-- CRITICAL: Conversie pounds → pence (* 100)
DO $$
DECLARE
  v_pricing_version_id uuid;
  v_vehicle record;
  v_vehicle_key text;
BEGIN
  -- Get pricing_version_id
  SELECT id INTO v_pricing_version_id
  FROM pricing_versions
  WHERE is_active = true
  LIMIT 1;

  IF v_pricing_version_id IS NULL THEN
    RAISE EXCEPTION 'No active pricing version found';
  END IF;

  -- Extract vehicles din pricing_config
  FOR v_vehicle_key IN
    SELECT jsonb_object_keys(vehicle_types)
    FROM pricing_config
    WHERE is_active = true
  LOOP
    -- Get vehicle data
    SELECT
      vehicle_types->v_vehicle_key->>'base_fare' as base_fare,
      vehicle_types->v_vehicle_key->>'per_mile_first_6' as per_mile_first_6,
      vehicle_types->v_vehicle_key->>'per_mile_after_6' as per_mile_after_6,
      vehicle_types->v_vehicle_key->>'per_minute' as per_minute,
      vehicle_types->v_vehicle_key->>'minimum_fare' as minimum_fare,
      vehicle_types->v_vehicle_key->>'hourly_in_town' as hourly_in_town,
      vehicle_types->v_vehicle_key->>'hourly_out_town' as hourly_out_town
    INTO v_vehicle
    FROM pricing_config
    WHERE is_active = true;

    -- Insert rates pentru fiecare booking type
    -- ONEWAY
    INSERT INTO pricing_vehicle_rates (
      pricing_version_id, organization_id, vehicle_category_id, booking_type,
      base_fare_pence, per_mile_first_6_pence, per_mile_after_6_pence,
      per_minute_pence, minimum_fare_pence
    ) VALUES (
      v_pricing_version_id, NULL, v_vehicle_key, 'oneway',
      ROUND((v_vehicle.base_fare)::numeric * 100)::integer,
      ROUND((v_vehicle.per_mile_first_6)::numeric * 100)::integer,
      ROUND((v_vehicle.per_mile_after_6)::numeric * 100)::integer,
      ROUND((v_vehicle.per_minute)::numeric * 100)::integer,
      ROUND((v_vehicle.minimum_fare)::numeric * 100)::integer
    );

    -- RETURN (same as oneway)
    INSERT INTO pricing_vehicle_rates (
      pricing_version_id, organization_id, vehicle_category_id, booking_type,
      base_fare_pence, per_mile_first_6_pence, per_mile_after_6_pence,
      per_minute_pence, minimum_fare_pence
    ) VALUES (
      v_pricing_version_id, NULL, v_vehicle_key, 'return',
      ROUND((v_vehicle.base_fare)::numeric * 100)::integer,
      ROUND((v_vehicle.per_mile_first_6)::numeric * 100)::integer,
      ROUND((v_vehicle.per_mile_after_6)::numeric * 100)::integer,
      ROUND((v_vehicle.per_minute)::numeric * 100)::integer,
      ROUND((v_vehicle.minimum_fare)::numeric * 100)::integer
    );

    -- HOURLY
    INSERT INTO pricing_vehicle_rates (
      pricing_version_id, organization_id, vehicle_category_id, booking_type,
      base_fare_pence, per_mile_first_6_pence, per_mile_after_6_pence,
      per_minute_pence, minimum_fare_pence,
      hourly_in_town_pence, hourly_out_town_pence
    ) VALUES (
      v_pricing_version_id, NULL, v_vehicle_key, 'hourly',
      ROUND((v_vehicle.base_fare)::numeric * 100)::integer,
      ROUND((v_vehicle.per_mile_first_6)::numeric * 100)::integer,
      ROUND((v_vehicle.per_mile_after_6)::numeric * 100)::integer,
      ROUND((v_vehicle.per_minute)::numeric * 100)::integer,
      ROUND((v_vehicle.minimum_fare)::numeric * 100)::integer,
      ROUND((v_vehicle.hourly_in_town)::numeric * 100)::integer,
      ROUND((v_vehicle.hourly_out_town)::numeric * 100)::integer
    );

    -- DAILY
    INSERT INTO pricing_vehicle_rates (
      pricing_version_id, organization_id, vehicle_category_id, booking_type,
      base_fare_pence, per_mile_first_6_pence, per_mile_after_6_pence,
      per_minute_pence, minimum_fare_pence,
      daily_rate_pence
    ) VALUES (
      v_pricing_version_id, NULL, v_vehicle_key, 'daily',
      ROUND((v_vehicle.base_fare)::numeric * 100)::integer,
      ROUND((v_vehicle.per_mile_first_6)::numeric * 100)::integer,
      ROUND((v_vehicle.per_mile_after_6)::numeric * 100)::integer,
      ROUND((v_vehicle.per_minute)::numeric * 100)::integer,
      ROUND((v_vehicle.minimum_fare)::numeric * 100)::integer,
      ROUND((v_vehicle.hourly_in_town)::numeric * 8 * 100)::integer -- 8h estimate
    );

  END LOOP;

  RAISE NOTICE 'Migrated % vehicles x 4 booking types',
    (SELECT COUNT(DISTINCT vehicle_category_id) FROM pricing_vehicle_rates);
END $$;

CREATE INDEX idx_vehicle_rates_lookup ON pricing_vehicle_rates(
  pricing_version_id, vehicle_category_id, booking_type, organization_id
);
```

**Validation:**

```sql
-- Expect ~16 records (4 vehicles x 4 booking types)
SELECT COUNT(*) FROM pricing_vehicle_rates;

-- Compare with pricing_config
SELECT
  vehicle_category_id,
  booking_type,
  base_fare_pence,
  base_fare_pence / 100.0 as base_fare_pounds_converted
FROM pricing_vehicle_rates
WHERE pricing_version_id = (SELECT id FROM pricing_versions WHERE is_active = true)
ORDER BY vehicle_category_id, booking_type;

-- Verifică pricing_config original
SELECT
  jsonb_object_keys(vehicle_types) as vehicle,
  vehicle_types->jsonb_object_keys(vehicle_types)->>'base_fare' as old_pounds
FROM pricing_config WHERE is_active = true;
```

**Rollback:**

```sql
DROP TABLE IF EXISTS pricing_vehicle_rates CASCADE;
```

---

### 4. pricing_time_rules

**Current State:** ✅ EXISTS - 20 rules active (10 columns)
**Target State:** Tabulated time multipliers funcționale
**Action:** ✅ **COMPLET** - migration executată
**Dependencies:** pricing_versions v2 ✅

---

### 5. pricing_airport_fees

**Current State:** ✅ EXISTS - 25 airports active (12 columns)
**Target State:** Tabulated airport fees funcționale
**Action:** ✅ **COMPLET** - migration executată
**Dependencies:** pricing_versions v2 ✅

---

### 6. pricing_zone_fees

**Current State:** ✅ EXISTS - 6 zones active (7 columns)
**Target State:** Tabulated zone fees funcționale
**Action:** ✅ **COMPLET** - migration executată
**Dependencies:** pricing_versions v2 ✅

---

### 7. pricing_service_catalog

**Current State:** ❌ LIPSEȘTE
**Target State:** Premium services catalog (meet & greet, child seats, etc)
**Action:** ⏸️ **CREATE PENDING** - Wave 1 incomplet
**Dependencies:** pricing_versions v2 ✅

---

### 8. pricing_policies

**Current State:** ❌ LIPSEȘTE
**Target State:** Rounding, cancellation, no-show policies
**Action:** ⏸️ **CREATE PENDING** - Wave 1 incomplet
**Dependencies:** pricing_versions v2 ✅

**Migration SQL:**

```sql
-- sql/migrations/pricing_v2_final/08_create_pricing_policies.sql
CREATE TABLE pricing_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_version_id uuid NOT NULL REFERENCES pricing_versions(id),
  policy_type varchar NOT NULL,
  policy_config jsonb NOT NULL DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

---

### 9. BACKEND COMPATIBILITY VIEWS

**Current State:** ✅ TOATE 5 VIEWS EXISTĂ
**Target State:** Views funcționale pentru Backend compatibility
**Action:** ✅ **COMPLET** - toate views create și funcționale
**Blocker:** ✅ REZOLVAT (Backend poate citi pricing data)
**Dependencies:** pricing\_\* tables ✅

**Views EXISTS în DB real:**

- ✅ v_active_pricing_version
- ✅ v_pricing_vehicle_rates
- ✅ v_pricing_time_rules
- ✅ v_pricing_airport_fees
- ✅ v_pricing_zone_fees

**Migration SQL:**

```sql
-- sql/migrations/pricing_v2_final/10_create_pricing_views.sql

-- View 1: Active version
CREATE VIEW v_active_pricing_version AS
SELECT * FROM pricing_versions
WHERE is_active = true AND is_published = true
LIMIT 1;

-- View 2: Vehicle rates cu version info
CREATE VIEW v_pricing_vehicle_rates AS
SELECT
  r.*,
  v.version_number,
  v.version_name,
  v.effective_from,
  CASE
    WHEN r.organization_id IS NOT NULL THEN 'org_specific'
    ELSE 'global'
  END as rate_type
FROM pricing_vehicle_rates r
JOIN pricing_versions v ON r.pricing_version_id = v.id
WHERE v.is_active = true
  AND v.is_published = true
  AND r.active = true;

COMMENT ON VIEW v_pricing_vehicle_rates IS
'Backend compatibility. FALLBACK LOGIC:
1. Query cu organization_id specific
2. If NOT FOUND, query cu organization_id IS NULL
3. Both from same pricing_version_id';

-- View 3-5: Similar pentru time_rules, airport_fees, zone_fees
CREATE VIEW v_pricing_time_rules AS
SELECT r.*, v.version_number
FROM pricing_time_rules r
JOIN pricing_versions v ON r.pricing_version_id = v.id
WHERE v.is_active = true AND r.active = true;

CREATE VIEW v_pricing_airport_fees AS
SELECT f.*, v.version_number
FROM pricing_airport_fees f
JOIN pricing_versions v ON f.pricing_version_id = v.id
WHERE v.is_active = true AND f.active = true;

CREATE VIEW v_pricing_zone_fees AS
SELECT z.*, v.version_number
FROM pricing_zone_fees z
JOIN pricing_versions v ON z.pricing_version_id = v.id
WHERE v.is_active = true AND z.active = true;
```

**Validation:**

```sql
-- Test views
SELECT * FROM v_active_pricing_version; -- expect 1 row
SELECT COUNT(*) FROM v_pricing_vehicle_rates; -- expect ~16
SELECT COUNT(*) FROM v_pricing_time_rules;
SELECT COUNT(*) FROM v_pricing_airport_fees;
SELECT COUNT(*) FROM v_pricing_zone_fees;

-- TEST Backend integration
-- În Backend PricingDataService:
-- const rates = await supabase.from('v_pricing_vehicle_rates').select('*');
-- console.log('Rates from view:', rates);
```

**Rollback:**

```sql
DROP VIEW IF EXISTS v_pricing_zone_fees CASCADE;
DROP VIEW IF EXISTS v_pricing_airport_fees CASCADE;
DROP VIEW IF EXISTS v_pricing_time_rules CASCADE;
DROP VIEW IF EXISTS v_pricing_vehicle_rates CASCADE;
DROP VIEW IF EXISTS v_active_pricing_version CASCADE;
```

---

---

## ⚠️ WAVE 1 SUMMARY - STATUS REAL DB COMPLET VERIFICAT

**✅ COMPLET (13 tabele + 9 views!):**

**Core Pricing (din docs):**

- pricing_versions (v2 activ, 5 versions, last: Mar 19)
- organization_settings (1 org)
- pricing_vehicle_rates (76 rates, 100% active)
- pricing_time_rules (20 rules)
- pricing_airport_fees (25 airports)
- pricing_zone_fees (6 zones)

**Extra Tables (NU în docs V3!):**

- pricing_commission_profiles (1 profile)
- pricing_daily_rules (20 rules)
- pricing_hourly_rules (20 rules)
- pricing_return_rules (1 rule)
- pricing_fleet_discounts (2 discounts)
- pricing_rounding_rules (5 rules)
- client_leg_quotes (3 quotes)

**Backend Views (9 total!):**

- v_active_pricing_version, v_pricing_vehicle_rates, v_pricing_time_rules, v_pricing_airport_fees, v_pricing_zone_fees
- v_pricing_commissions, v_pricing_daily_rules, v_pricing_hourly_rules (NEW!)

**❌ LIPSEȘTE doar:**

- pricing_service_catalog (dar line_items în quotes!)

**Verdict:** Wave 1 95% EXECUTAT - backend 100% operational!

---

## 🟡 WAVE 2: QUOTE & PAYMENT - STATUS REAL: 85% COMPLET! ✅

**✅ REALITATE DB:** booking_payments (10 payments!), refunds (structural ready), quotes (complet V3!)

**🚨 NOMENCLATURĂ:** DB folosește `booking_payments` NU `payment_transactions`, `refunds` NU `payment_refunds`!

### 10. client_booking_quotes (EXTEND COMPLET!)

**Current State:** ✅ EXISTS - 29 columns, 1 quote activ, TOATE V3 columns prezente!
**Target State:** Tabelă funcțională cu versioning complet
**Action:** ✅ **EXTEND COMPLET** - is_current, superseded_by_quote_id, locked_by_admin_user_id EXISTS!
**Blocker:** ✅ REZOLVAT structural (integrare operațională rămâne)
**Dependencies:** None

**Coloane V3 EXISTS în DB:**

- ✅ is_current (boolean, default true)
- ✅ superseded_by_quote_id (uuid)
- ✅ locked_by_admin_user_id (uuid FK) - PATCH 3 aplicat!
- ✅ vehicle_subtotal_pence, vehicle_discount_pence
- ✅ services_subtotal_pence, services_discount_pence
- ✅ pricing_version_id FK

**Migration SQL:**

```sql
-- sql/migrations/pricing_v2_final/11_extend_client_booking_quotes.sql

ALTER TABLE client_booking_quotes
ADD COLUMN is_current boolean DEFAULT true,
ADD COLUMN superseded_by_quote_id uuid REFERENCES client_booking_quotes(id);

-- Partial unique pentru current quote
CREATE UNIQUE INDEX idx_current_quote_per_booking
ON client_booking_quotes(booking_id)
WHERE is_current = true AND deleted_at IS NULL;

CREATE INDEX idx_quotes_superseded ON client_booking_quotes(superseded_by_quote_id)
WHERE superseded_by_quote_id IS NOT NULL;

COMMENT ON COLUMN client_booking_quotes.is_current IS
'Markează quote-ul activ pentru acest booking.
Doar un quote cu is_current=true per booking (enforced by partial index).';
```

**Validation:**

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'client_booking_quotes'
AND column_name IN ('is_current', 'superseded_by_quote_id');
-- expect 2 rows
```

**Rollback:**

```sql
DROP INDEX IF EXISTS idx_quotes_superseded;
DROP INDEX IF EXISTS idx_current_quote_per_booking;
ALTER TABLE client_booking_quotes
DROP COLUMN IF EXISTS superseded_by_quote_id,
DROP COLUMN IF EXISTS is_current;
```

---

### 11. quote_service_items

**Current State:** ❌ NU EXISTĂ
**Target State:** Normalized services cu VAT snapshot
**Action:** **CREATE**
**Dependencies:** client_booking_quotes, pricing_service_catalog

_(Migration file 12 - similar CREATE cu VAT fields)_

---

### 11. booking_payments (design: payment_transactions) ✅ COMPLET!

**Current State:** ✅ EXISTS - 25 columns, 10 payments (9 succeeded!), last: Mar 16
**Target State:** Tabelă funcțională V3 complet
**Action:** ✅ **COMPLET** - toate V3 features EXISTS!
**Blocker:** ✅ REZOLVAT - payment flow 100% operational!
**Dependencies:** client_booking_quotes ✅, organizations ✅

**🚨 DB folosește `booking_payments` NU `payment_transactions`!**

**Toate coloanele V3 EXISTS:**

- ✅ amount_pence (NOT NULL, CHECK > 0)
- ✅ quote_id (nullable, FK valid)
- ✅ payment_kind (CHECK: deposit, balance, full, manual, adjustment)
- ✅ stripe_fee_pence, net_amount_pence (cu CHECK constraints)
- ✅ idempotency_key (UNIQUE)
- ✅ status ENUM (unpaid, pending, succeeded, failed, refunded, canceled)
- ✅ TOATE FK-urile și indexes production-ready!

**Migration SQL (2 STEPS):**

```sql
-- sql/migrations/pricing_v2_final/13_remodel_payment_transactions_step1.sql

-- ⚠️ VERIFICĂ ÎNAINTE!
DO $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*) INTO v_count FROM payment_transactions;
  IF v_count > 0 THEN
    RAISE WARNING '⚠️ payment_transactions are % records! BACKUP recomandat înainte de continuare!', v_count;
    -- UNCOMMENT pentru safety check:
    -- RAISE EXCEPTION 'Backup required - aborting migration';
  ELSE
    RAISE NOTICE '✅ payment_transactions empty - safe to proceed';
  END IF;
END $$;

-- STEP 1: ADD new columns (nu rename!)
ALTER TABLE payment_transactions
ADD COLUMN IF NOT EXISTS amount_pence integer,
ADD COLUMN IF NOT EXISTS stripe_fee_pence integer,
ADD COLUMN IF NOT EXISTS net_amount_pence integer,
ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES client_booking_quotes(id),
ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id),
ADD COLUMN IF NOT EXISTS idempotency_key varchar,
ADD COLUMN IF NOT EXISTS payment_kind varchar DEFAULT 'full',
ADD COLUMN IF NOT EXISTS payment_sequence integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS parent_payment_transaction_id uuid REFERENCES payment_transactions(id),
ADD COLUMN IF NOT EXISTS stripe_charge_id varchar,
ADD COLUMN IF NOT EXISTS payment_method_last4 varchar(4),
ADD COLUMN IF NOT EXISTS payment_method_brand varchar(50);

-- Constraints
ALTER TABLE payment_transactions
ADD CONSTRAINT chk_payment_kind CHECK (
  payment_kind IN ('full', 'deposit', 'balance', 'retry', 'refund_partial')
);

-- STEP 2: Backfill (dacă există date)
UPDATE payment_transactions
SET
  amount_pence = ROUND(amount * 100)::integer,
  stripe_fee_pence = ROUND(COALESCE(stripe_fee, 0) * 100)::integer,
  net_amount_pence = ROUND(COALESCE(net_amount, 0) * 100)::integer
WHERE amount IS NOT NULL AND amount_pence IS NULL;

-- Validare backfill
DO $$
DECLARE
  v_mismatch integer;
BEGIN
  SELECT COUNT(*) INTO v_mismatch
  FROM payment_transactions
  WHERE amount IS NOT NULL
  AND ABS(amount_pence - (amount * 100)) > 1; -- tolerance 1 pence pentru rounding

  IF v_mismatch > 0 THEN
    RAISE WARNING '⚠️ % records au conversion mismatch!', v_mismatch;
  ELSE
    RAISE NOTICE '✅ Backfill validated - all conversions correct';
  END IF;
END $$;

-- STEP 3: Make NOT NULL (după validare!)
ALTER TABLE payment_transactions
ALTER COLUMN amount_pence SET NOT NULL;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_idempotency
ON payment_transactions(idempotency_key)
WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payment_quote
ON payment_transactions(quote_id);

CREATE INDEX IF NOT EXISTS idx_payment_org
ON payment_transactions(organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_sequence
ON payment_transactions(booking_id, payment_sequence);

COMMENT ON TABLE payment_transactions IS
'⚠️ MIGRATION IN PROGRESS:
- OLD columns (amount, stripe_fee, net_amount) în POUNDS - DEPRECATED
- NEW columns (*_pence) în PENCE - CURRENT SSOT
- Code MUST switch la *_pence columns
- Old columns vor fi dropped eventual (nu acum!)';

COMMENT ON COLUMN payment_transactions.amount_pence IS
'Amount în PENCE (SSOT). Ex: £50.00 = 5000 pence.
Înlocuiește payment_transactions.amount (pounds, deprecated).';
```

**Validation:**

```sql
-- Verifică coloane noi
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'payment_transactions'
AND column_name LIKE '%_pence';
-- expect 3: amount_pence, stripe_fee_pence, net_amount_pence

-- Verifică conversion accuracy (dacă există date)
SELECT
  id,
  amount as old_pounds,
  amount_pence as new_pence,
  amount_pence / 100.0 as pence_to_pounds_check,
  ABS(amount - (amount_pence / 100.0)) as diff
FROM payment_transactions
WHERE amount IS NOT NULL
ORDER BY diff DESC
LIMIT 10;
-- diff trebuie < 0.01 (rounding tolerance)

-- Verifică constraints
SELECT conname FROM pg_constraint
WHERE conrelid = 'payment_transactions'::regclass
AND conname = 'chk_payment_kind';
-- expect 1 row
```

---

## 🔵 WAVE 3-5: TOATE TABELELE LIPSESC - STATUS REAL: 0%

**⚠️ REALITATE DB (`ruskhucrvjvuuzwlboqn`):**

**❌ Wave 3 - Financial Snapshots (TOATE LIPSESC):**

- booking_financial_snapshots ❌
- Triggers pentru auto-snapshot ❌

**❌ Wave 4 - Payouts & Refunds (TOATE LIPSESC):**

- payment_refunds ❌
- driver_payout_breakdowns ❌
- manual_financial_adjustments ❌

**❌ Wave 5 - Discounts (TOATE LIPSESC):**

- discount_campaigns ❌
- discount_applications ❌

**Verdict:** Wave 3-5 = **0% executat** - toate tabelele trebuie CREATE from scratch!

**Migration files:** 13-20 din PRICING_DB_DECISION_MATRIX_V3 rămân valide pentru implementare.

---

**Rollback (payment_transactions):**

```sql
DROP TABLE IF EXISTS payment_transactions CASCADE;
-- Sau DROP doar coloanele noi dacă tabelă există parțial
DROP COLUMN IF EXISTS amount_pence;
```

---

### 13. payment_refunds

**Current State:** ❌ NU EXISTĂ
**Target State:** Separate refunds table
**Action:** **CREATE**
**Dependencies:** payment_transactions

_(Migration file 14 - CREATE similar cu enums)_

---

## 🔵 WAVE 3: FINANCIAL SNAPSHOTS (1.5 zile)

### 14. booking_financial_snapshots

**Current State:** ❌ NU EXISTĂ
**Target State:** Frozen financials cu trigger
**Action:** **CREATE + TRIGGER + RETROACTIVE**
**Blocker:** 🔴 YES (accounting compliance)
**Dependencies:** client_booking_quotes, payment_transactions, organization_settings

_(Migration files 15-17 cu trigger + retroactive populate)_

---

### 15. booking_pricing [LEGACY] (DEPRECATE)

**Current State:** ✅ EXISTĂ (95 records)
**Target State:** Read-only legacy cu link la snapshots
**Action:** **DEPRECATE (nu DELETE!)**
**Dependencies:** booking_financial_snapshots populated

**Migration SQL:**

```sql
-- sql/migrations/pricing_v2_final/18_deprecate_booking_pricing.sql

-- ADD FK la noul sistem
ALTER TABLE booking_pricing
ADD COLUMN IF NOT EXISTS financial_snapshot_id uuid REFERENCES booking_financial_snapshots(id);

-- LINK la snapshots retroactive
UPDATE booking_pricing bp
SET financial_snapshot_id = fs.id
FROM booking_financial_snapshots fs
WHERE bp.booking_id = fs.booking_id
AND fs.snapshot_type = 'retroactive_migration';

-- COMMENT deprecation
COMMENT ON TABLE booking_pricing IS
'⚠️ DEPRECATED - Read-only legacy table.
New bookings use: client_booking_quotes + booking_financial_snapshots.
Keep for historical data only.
Migration status: linked to booking_financial_snapshots via financial_snapshot_id.';

-- VIEW pentru backwards compatibility
CREATE VIEW v_booking_pricing_legacy AS
SELECT
  bp.*,
  fs.snapshot_version,
  fs.client_total_pence / 100.0 as new_total_pounds
FROM booking_pricing bp
LEFT JOIN booking_financial_snapshots fs ON bp.financial_snapshot_id = fs.id;
```

**Validation:**

```sql
-- Toate legacy records linked?
SELECT
  COUNT(*) as total_legacy,
  COUNT(financial_snapshot_id) as linked_to_new_system
FROM booking_pricing;
-- total_legacy = linked_to_new_system = 95
```

---

## 🟢 WAVE 4-5: OPERATIONAL FINANCE (1.5 zile)

Similar structure pentru driver_payout_breakdowns, manual_adjustments, etc.

---

## ⚙️ EXECUTION STRATEGY

### Manual (Supabase Dashboard):

1. Copy migration file content
2. Read comments ATENT
3. Execute în SQL Editor
4. Run validation queries
5. Mark done în tracking sheet

### Automated (via scripts):

```bash
cd sql/migrations/pricing_v2_final
./run_wave_1.sh  # runs migrations 01-10
./validate_wave_1.sh  # runs validation queries
```

---

## 📊 PROGRESS TRACKING

| #   | Migration             | Wave | Status | Duration | Validation | Issues |
| --- | --------------------- | ---- | ------ | -------- | ---------- | ------ |
| 01  | pricing_versions      | 1    | ⏳     | -        | ❌         | -      |
| 02  | organization_settings | 1    | ⏳     | -        | ❌         | -      |
| 03  | pricing_vehicle_rates | 1    | ⏳     | -        | ❌         | -      |
| ... |                       |      |        |          |            |        |

---

**STATUS:** Ready for execution. Toate migrations documentate cu SQL executabil.
