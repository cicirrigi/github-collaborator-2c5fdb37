# ⚖️ PASUL 3: DECISION MATRIX - KEEP / EXTEND / REPLACE / DEPRECATE

**Data:** 18 Martie 2026  
**Scop:** Decizie clară pentru fiecare tabelă existentă și lipsă

---

## 🎯 LEGENDA DECIZIILOR

| Decizie       | Semnificație                                   | Acțiune                                     |
| ------------- | ---------------------------------------------- | ------------------------------------------- |
| **KEEP**      | Păstrează exact cum e, folosește în continuare | Nimic - e perfect                           |
| **EXTEND**    | Păstrează dar adaugă coloane/FK-uri            | ALTER TABLE ADD COLUMN                      |
| **MIGRATE**   | Transformă/migrează într-o formă nouă          | CREATE new + data migration + deprecate old |
| **DEPRECATE** | Marchează read-only, nu mai populate           | ALTER comment, UPDATE policies              |
| **DELETE**    | Șterge complet (doar dacă 0 records și sigur)  | DROP TABLE (cu precauție)                   |

---

## 📊 DECISION MATRIX - TOATE TABELELE

### 🔵 CATEGORIA: Pricing Configuration

#### **1. pricing_config** [LEGACY JSONB]

- **Status actual:** ✅ EXISTĂ (1 record)
- **Records:** 1 (toate regulile actuali în JSONB)
- **Folosit de:** Backend (theoretic, dar cere VIEWS)

**DECIZIE:** 🟡 **MIGRATE → DEPRECATE**

**Motivație:**

- Arhitectură veche (JSONB monolitic)
- Backend nou cere tabele normalize
- Imposibil de query-uit eficient
- Nu permite versioning
- Datele sunt valoroase (singura sursă acum)

**Pași:**

1. ✅ KEEP temporar (pentru migrare)
2. 📦 MIGRATE date → 7 tabele normalize + pricing_versions
3. 🔴 DEPRECATE după migrare (mark read-only)
4. ❌ NU DELETE (keep pentru history/backup)

**Migration plan:**

```sql
-- 1. CREATE pricing_versions v1
INSERT INTO pricing_versions (version_number, version_name, is_active, is_published)
VALUES (1, 'Initial Config', true, true);

-- 2. EXTRACT și INSERT în pricing_vehicle_rates
-- din pricing_config.vehicle_types JSONB
-- Pentru executive, luxury, suv, mpv x oneway/hourly/daily

-- 3. EXTRACT pricing_time_rules din time_multipliers
-- 4. EXTRACT pricing_airport_fees din airport_fees
-- 5. EXTRACT pricing_zone_fees din zone_fees
-- 6. EXTRACT pricing_service_catalog din premium_services
-- 7. EXTRACT pricing_policies din general_policies + return/fleet/hourly/daily settings

-- 8. Mark legacy
COMMENT ON TABLE pricing_config IS 'LEGACY - Deprecated. Use pricing_versions + normalize tables';
```

---

#### **2-8. Tabele normalize noi**

`pricing_versions`, `pricing_vehicle_rates`, `pricing_time_rules`, `pricing_airport_fees`, `pricing_zone_fees`, `pricing_service_catalog`, `pricing_policies`

- **Status actual:** ❌ NU EXISTĂ
- **Records:** 0

**DECIZIE:** ✅ **CREATE**

**Motivație:**

- Backend le așteaptă
- Normalize architecture
- Query-abil eficient
- Versioning posibil
- Extensibil pentru viitor

**Pași:**

1. CREATE toate tabelele cu schema definită
2. POPULATE din pricing_config (migration)
3. CREATE VIEWS pentru Backend compatibility
4. TEST Backend cu noul sistem

---

#### **9. organization_settings**

- **Status actual:** ❌ NU EXISTĂ
- **Records:** 0

**DECIZIE:** ✅ **CREATE**

**Motivație:**

- VAT rate CRITICAL (hardcoded acum = bad)
- Commissions per org (flexibilitate)
- Backend OrganizationSettingsService le cere
- Multi-tenant architecture

**Pași:**

1. CREATE tabelă
2. POPULATE cu defaults pentru toate org-urile active
3. LINK din organizations (1:1 relationship)

```sql
CREATE TABLE organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  vat_rate numeric(4,2) DEFAULT 0.20,
  platform_commission_pct numeric(4,2) DEFAULT 0.10,
  operator_commission_pct numeric(4,2) DEFAULT 0.10,
  currency varchar(3) DEFAULT 'GBP',
  timezone varchar DEFAULT 'Europe/London',
  booking_lead_time_hours integer DEFAULT 2,
  max_advance_booking_days integer DEFAULT 365,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Populate pentru toate org-urile existente
INSERT INTO organization_settings (organization_id)
SELECT id FROM organizations WHERE is_active = true;
```

---

### 🟢 CATEGORIA: Quotes & Transactions

#### **10. client_booking_quotes**

- **Status actual:** ✅ EXISTĂ (creat de mine)
- **Records:** 0 (niciodată folosit)
- **Schema:** Perfect, complet

**DECIZIE:** ✅ **KEEP**

**Motivație:**

- Schema corectă și completă
- Exact ce trebuie pentru SSOT pricing
- FK-uri corecte (bookings, organizations, pricing_versions)
- Lifecycle management (is_locked, quote_valid_until)
- Breakdown JSONB pentru detalii

**Pași:**

1. ✅ KEEP exact cum e
2. ✅ START folosit în flow (frontend + backend)
3. ✅ TEST cu date reale

**NU TREBUIE MODIFICAT - E PERFECT**

---

#### **11. quote_service_items**

- **Status actual:** ❌ NU EXISTĂ
- **Records:** 0

**DECIZIE:** ✅ **CREATE**

**Motivație:**

- Normalize services din quote.line_items
- Query-able pentru analytics
- Link explicit quote → services
- Complementar cu client_booking_quotes

**Pași:**

1. CREATE tabelă
2. POPULATE trigger: când se creează quote cu services, auto-populate quote_service_items
3. OPTIONAL: Populate și în quote.line_items JSONB pentru backwards compatibility

---

#### **12. payment_transactions**

- **Status actual:** 🟡 EXISTĂ PARȚIAL
- **Records:** 0 (niciodată folosit!)
- **Schema:** Incompletă (lipsesc FK-uri critice)

**DECIZIE:** 🟡 **EXTEND**

**Motivație:**

- Baza e bună dar lipsesc link-uri esențiale
- Trebuie să știm ce quote a generat payment-ul
- Trebuie organization_id pentru multi-tenant
- Trebuie idempotency_key pentru Stripe safety

**Pași:**

```sql
ALTER TABLE payment_transactions
ADD COLUMN quote_id uuid REFERENCES client_booking_quotes(id),
ADD COLUMN organization_id uuid REFERENCES organizations(id),
ADD COLUMN idempotency_key varchar UNIQUE;

-- Indexes pentru performance
CREATE INDEX idx_payment_transactions_quote_id ON payment_transactions(quote_id);
CREATE INDEX idx_payment_transactions_org_id ON payment_transactions(organization_id, created_at DESC);
CREATE INDEX idx_payment_transactions_idempotency ON payment_transactions(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Update pentru 0 records existente = NIMIC de făcut
-- Gata pentru usage viitor
```

**REZULTAT:** Tabelă completă și gata de folosit

---

#### **13. booking_financial_snapshots**

- **Status actual:** ❌ NU EXISTĂ
- **Records:** 0

**DECIZIE:** ✅ **CREATE + TRIGGER**

**Motivație:**

- CRITICAL pentru frozen financials
- Audit trail pentru accounting
- Immutable snapshot la momentul payment
- Revenue splits transparente

**Pași:**

1. CREATE tabelă cu schema definită
2. CREATE trigger `on_payment_success_create_snapshot`
3. POPULATE retroactiv pentru 95 bookings existente (din booking_pricing)

```sql
-- Trigger care creează automat snapshot când payment reușește
CREATE OR REPLACE FUNCTION create_financial_snapshot_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Când payment.status devine 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO booking_financial_snapshots (
      booking_id,
      quote_id,
      payment_transaction_id,
      organization_id,
      client_total_pence,
      -- ... toate coloanele calculate
      snapshot_reason,
      snapshotted_by
    )
    SELECT
      NEW.booking_id,
      NEW.quote_id,
      NEW.id,
      NEW.organization_id,
      q.total_pence,
      -- Calculate all revenue splits here
      'payment_success',
      'system'
    FROM client_booking_quotes q
    WHERE q.id = NEW.quote_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_success_create_snapshot
AFTER INSERT OR UPDATE ON payment_transactions
FOR EACH ROW
EXECUTE FUNCTION create_financial_snapshot_on_payment();
```

**Migrare retroactivă:**

```sql
-- Pentru 95 bookings existente, creează snapshots din booking_pricing
INSERT INTO booking_financial_snapshots (
  booking_id,
  organization_id,
  client_total_pence,
  platform_fee_pence,
  operator_net_pence,
  driver_payout_pence,
  snapshot_reason,
  snapshotted_by,
  snapshotted_at
)
SELECT
  bp.booking_id,
  b.organization_id,
  (bp.price * 100)::integer, -- convert to pence
  (bp.platform_fee * 100)::integer,
  (bp.operator_net * 100)::integer,
  (bp.driver_payout * 100)::integer,
  'retroactive_migration',
  'system',
  bp.created_at
FROM booking_pricing bp
JOIN bookings b ON bp.booking_id = b.id;

-- Link booking_pricing → financial_snapshot
UPDATE booking_pricing bp
SET financial_snapshot_id = fs.id
FROM booking_financial_snapshots fs
WHERE bp.booking_id = fs.booking_id
AND fs.snapshot_reason = 'retroactive_migration';
```

---

#### **14. driver_payout_breakdowns**

- **Status actual:** ❌ NU EXISTĂ
- **Records:** 0

**DECIZIE:** ✅ **CREATE + AUTO-POPULATE**

**Motivație:**

- Transparent breakdown pentru șoferi
- Separate tips, bonuses, deductions
- Payout tracking (status, method, paid_at)
- Link 1:1 cu financial_snapshot

**Pași:**

1. CREATE tabelă
2. CREATE trigger: după financial_snapshot, creează driver_payout_breakdown
3. POPULATE retroactiv pentru 95 bookings

```sql
-- Trigger după snapshot creation
CREATE OR REPLACE FUNCTION create_driver_breakdown_after_snapshot()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-create driver breakdown când snapshot e creat
  INSERT INTO driver_payout_breakdowns (
    booking_id,
    driver_id,
    financial_snapshot_id,
    base_payout_pence,
    total_payout_pence,
    payout_breakdown,
    payout_status
  )
  SELECT
    NEW.booking_id,
    bl.assigned_driver_id, -- din booking_legs
    NEW.id,
    NEW.driver_payout_pence,
    NEW.driver_payout_pence, -- deocamdată fără bonuses/deductions
    jsonb_build_object(
      'vehicle_earnings', NEW.driver_payout_pence,
      'services_earnings', 0,
      'tips', 0,
      'total_gross', NEW.driver_payout_pence
    ),
    'pending'
  FROM booking_legs bl
  WHERE bl.parent_booking_id = NEW.booking_id
  LIMIT 1; -- presupunem 1 driver per booking (pentru acum)

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER snapshot_create_driver_breakdown
AFTER INSERT ON booking_financial_snapshots
FOR EACH ROW
EXECUTE FUNCTION create_driver_breakdown_after_snapshot();
```

---

### 🔴 CATEGORIA: Legacy Tables

#### **15. booking_pricing** [LEGACY]

- **Status actual:** ✅ EXISTĂ
- **Records:** 95 (date reale valoroase)
- **Used by:** Sistem vechi (probabil queries existente)

**DECIZIE:** 🔴 **DEPRECATE (nu DELETE)**

**Motivație:**

- Date valoroase pentru 95 bookings
- Posibil să fie queries/reports care le folosesc
- NU mai populate pentru bookings noi
- Păstrează read-only pentru history

**Pași:**

```sql
-- 1. ADD FK la noul sistem (dacă nu există)
ALTER TABLE booking_pricing
ADD COLUMN IF NOT EXISTS financial_snapshot_id uuid REFERENCES booking_financial_snapshots(id);

-- 2. Mark DEPRECATED
COMMENT ON TABLE booking_pricing IS
'⚠️ DEPRECATED - Read-only legacy table.
New bookings use: client_booking_quotes + booking_financial_snapshots.
Keep for historical data only.';

-- 3. CREATE VIEW pentru backwards compatibility
CREATE VIEW v_booking_pricing_legacy AS
SELECT
  bp.*,
  fs.id as new_snapshot_id,
  'Use booking_financial_snapshots for new data' as migration_note
FROM booking_pricing bp
LEFT JOIN booking_financial_snapshots fs ON bp.financial_snapshot_id = fs.id;

-- 4. UPDATE policies - nu mai INSERT direct în booking_pricing
-- Toate INSERT-urile noi vor merge în booking_financial_snapshots
```

**NU DELETE:** Păstrează pentru historical data

---

#### **16. booking_leg_pricing** [LEGACY]

- **Status actual:** ✅ EXISTĂ
- **Records:** 105 (date reale)
- **Used by:** Posibil leg-level analytics

**DECIZIE:** 🔴 **DEPRECATE (nu DELETE)**

**Motivație:**

- Similar cu booking_pricing
- Date valoroase pentru 105 legs
- Leg-level pricing va fi în breakdown JSONB în viitor
- Păstrează read-only

**Pași:**

```sql
COMMENT ON TABLE booking_leg_pricing IS
'⚠️ DEPRECATED - Read-only legacy table.
Leg-level pricing moved to booking_financial_snapshots.revenue_split_snapshot.
Keep for historical data only.';

-- NU mai populate pentru legs noi
-- Leg pricing va fi în snapshot breakdown
```

---

### 🟡 CATEGORIA: Auxiliary (Viitor)

#### **17. discount_campaigns**

#### **18. discount_applications**

- **Status actual:** ❌ NU EXISTĂ
- **Priority:** Medium (faza 2, nu MVP)

**DECIZIE:** ⏸️ **CREATE LATER (Faza 2)**

**Motivație:**

- Discount system e complex
- Pentru acum: hardcoded discounts în pricing engine (return, fleet, corporate)
- Future: promo codes, loyalty, seasonal campaigns
- Nu blocante pentru MVP

**Pași:**

1. Skip pentru MVP
2. CREATE în faza 2 când avem nevoie de promo codes
3. Schema deja definită în PRICING_DB_SCHEMA_FINAL.md

---

### 📊 CATEGORIA: Views

#### **19-23. VIEWS pentru Backend**

`v_active_pricing_version`, `v_pricing_vehicle_rates`, `v_pricing_time_rules`, `v_pricing_airport_fees`, `v_pricing_zone_fees`

- **Status actual:** ❌ NU EXISTĂ
- **Critical:** Da (Backend-ul nu funcționează fără ele)

**DECIZIE:** ✅ **CREATE imediat după tabele**

**Motivație:**

- Backend PricingDataService le așteaptă
- Abstraction layer peste tabele
- Backwards compatibility dacă schema se schimbă
- Performance (pre-joined cu version info)

**Pași:**

```sql
-- După ce tabelele sunt populate, CREATE views

CREATE VIEW v_active_pricing_version AS
SELECT * FROM pricing_versions
WHERE is_active = true AND is_published = true
LIMIT 1;

CREATE VIEW v_pricing_vehicle_rates AS
SELECT
  r.*,
  v.version_number,
  v.version_name,
  v.effective_from
FROM pricing_vehicle_rates r
JOIN pricing_versions v ON r.pricing_version_id = v.id
WHERE v.is_active = true AND r.active = true;

-- Similar pentru celelalte 3 views
```

---

## 📊 SUMMARY DECISION MATRIX

| Tabelă                      | Status       | Decizie             | Acțiune                 | Prioritate  |
| --------------------------- | ------------ | ------------------- | ----------------------- | ----------- |
| pricing_config              | EXISTĂ (1)   | MIGRATE → DEPRECATE | Migrare → mark legacy   | 🔴 CRITICAL |
| pricing_versions            | NU EXISTĂ    | CREATE              | Tabelă nouă             | 🔴 CRITICAL |
| pricing_vehicle_rates       | NU EXISTĂ    | CREATE              | Normalize din JSONB     | 🔴 CRITICAL |
| pricing_time_rules          | NU EXISTĂ    | CREATE              | Normalize din JSONB     | 🔴 CRITICAL |
| pricing_airport_fees        | NU EXISTĂ    | CREATE              | Normalize din JSONB     | 🔴 CRITICAL |
| pricing_zone_fees           | NU EXISTĂ    | CREATE              | Normalize din JSONB     | 🔴 CRITICAL |
| pricing_service_catalog     | NU EXISTĂ    | CREATE              | Normalize din JSONB     | 🟡 HIGH     |
| pricing_policies            | NU EXISTĂ    | CREATE              | Normalize din JSONB     | 🟡 HIGH     |
| organization_settings       | NU EXISTĂ    | CREATE              | Tabelă nouă             | 🔴 CRITICAL |
| client_booking_quotes       | EXISTĂ (0)   | **KEEP**            | Nimic - perfect         | ✅ DONE     |
| quote_service_items         | NU EXISTĂ    | CREATE              | Tabelă nouă             | 🟡 HIGH     |
| payment_transactions        | PARȚIAL (0)  | EXTEND              | ADD 3 columns + indexes | 🔴 CRITICAL |
| booking_financial_snapshots | NU EXISTĂ    | CREATE + TRIGGER    | Tabelă + auto-populate  | 🔴 CRITICAL |
| driver_payout_breakdowns    | NU EXISTĂ    | CREATE + TRIGGER    | Tabelă + auto-populate  | 🟡 HIGH     |
| booking_pricing             | EXISTĂ (95)  | DEPRECATE           | Mark legacy, ADD FK     | 🟡 HIGH     |
| booking_leg_pricing         | EXISTĂ (105) | DEPRECATE           | Mark legacy             | 🟢 MEDIUM   |
| discount_campaigns          | NU EXISTĂ    | CREATE LATER        | Faza 2                  | 🟢 MEDIUM   |
| discount_applications       | NU EXISTĂ    | CREATE LATER        | Faza 2                  | 🟢 MEDIUM   |
| 5x VIEWS                    | NU EXISTĂ    | CREATE              | După tabele populate    | 🔴 CRITICAL |

---

## 🎯 ORDINE EXECUȚIE (pentru Pasul 4 - Migrations)

### WAVE 1: Foundation (CRITICAL)

1. CREATE organization_settings
2. CREATE pricing_versions (v1)
3. CREATE pricing_vehicle_rates
4. CREATE pricing_time_rules
5. CREATE pricing_airport_fees
6. CREATE pricing_zone_fees

### WAVE 2: Services & Policies (HIGH)

7. CREATE pricing_service_catalog
8. CREATE pricing_policies
9. CREATE quote_service_items

### WAVE 3: Financial Core (CRITICAL)

10. EXTEND payment_transactions (ADD columns)
11. CREATE booking_financial_snapshots + TRIGGER
12. CREATE driver_payout_breakdowns + TRIGGER

### WAVE 4: Migration & Deprecation (HIGH)

13. MIGRATE data din pricing_config → normalize tables
14. POPULATE retroactiv financial_snapshots (95 bookings)
15. POPULATE retroactiv driver_breakdowns (95 bookings)
16. DEPRECATE booking_pricing, booking_leg_pricing, pricing_config

### WAVE 5: Views & Compatibility (CRITICAL)

17. CREATE 5x VIEWS pentru Backend
18. TEST Backend Pricing Engine cu noul sistem

### WAVE 6: Future (MEDIUM - Skip pentru MVP)

19. CREATE discount_campaigns (faza 2)
20. CREATE discount_applications (faza 2)

---

## ✅ VALIDATION CHECKLIST

După Pasul 4 (Migrations), trebuie validate:

- [ ] Toate tabelele CREATE-ate cu success
- [ ] Toate FK-urile funcționează
- [ ] pricing_versions v1 populat cu date din pricing_config
- [ ] Toate tabele normalize populate corect
- [ ] organization_settings populate pentru toate org-urile
- [ ] payment_transactions are coloane noi
- [ ] Triggers funcționează (snapshot + driver breakdown)
- [ ] 95 bookings au financial_snapshots retroactiv
- [ ] 95 bookings au driver_breakdowns retroactiv
- [ ] Legacy tables marcate DEPRECATED
- [ ] 5x VIEWS create și funcționale
- [ ] Backend poate query VIEWS cu success
- [ ] Zero queries sparte (check dependencies)

---

**NEXT:** Pasul 4 - Migrations DB (script-uri SQL concrete pentru executare)
