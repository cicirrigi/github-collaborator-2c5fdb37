# 🔧 V3 FINAL FREEZE PATCH LIST

**Data:** 20 Martie 2026  
**Status:** Must-fix înainte de implementare  
**Scope:** 7 corecții tehnice critice pentru integritate și consistency

---

## 🎯 CONTEXT

V3 Schema este **very strong design** și **aproape freeze-ready**.  
Aceste patch-uri NU schimbă arhitectura - doar corectează probleme tehnice de integritate, NULL semantics și consistency.

**După aplicarea acestor 7 patch-uri → V3 FINAL FREEZE READY 100%**

---

## ✅ PATCH 1: UNIQUE pe pricing_vehicle_rates cu organization_id NULL

### ❌ PROBLEMA

```sql
UNIQUE (pricing_version_id, vehicle_category_id, booking_type, organization_id)
```

**Issue:** În Postgres, `NULL != NULL` în unique semantics.  
**Risc:** Poți baga multiple rate globale (`organization_id IS NULL`) pentru aceeași combinație.

### ✅ FIX

Split în **2 partial unique indexes** - un pentru global, unul pentru org-specific:

```sql
-- În CREATE TABLE pricing_vehicle_rates, ȘTERGE:
-- UNIQUE (pricing_version_id, vehicle_category_id, booking_type, organization_id)

-- ADAUGĂ după CREATE TABLE:

-- Global rates (organization_id IS NULL)
CREATE UNIQUE INDEX uq_vehicle_rates_global
ON pricing_vehicle_rates(pricing_version_id, vehicle_category_id, booking_type)
WHERE organization_id IS NULL;

-- Org-specific rates
CREATE UNIQUE INDEX uq_vehicle_rates_org_specific
ON pricing_vehicle_rates(pricing_version_id, organization_id, vehicle_category_id, booking_type)
WHERE organization_id IS NOT NULL;
```

**Rezultat:** Integritate garantată pentru ambele cazuri (global și org-specific).

---

## ✅ PATCH 2: booking_financial_snapshots partial unique inline → CREATE INDEX separat

### ❌ PROBLEMA

```sql
CREATE TABLE booking_financial_snapshots (
  ...
  UNIQUE (payment_transaction_id) WHERE payment_transaction_id IS NOT NULL,
  ...
);
```

**Issue:** Sintaxă invalidă - partial unique constraints nu merg inline în CREATE TABLE standard Postgres.

### ✅ FIX

```sql
-- În CREATE TABLE booking_financial_snapshots, ȘTERGE:
-- UNIQUE (payment_transaction_id) WHERE payment_transaction_id IS NOT NULL,

-- ADAUGĂ după CREATE TABLE:
CREATE UNIQUE INDEX uq_snapshot_payment_transaction
ON booking_financial_snapshots(payment_transaction_id)
WHERE payment_transaction_id IS NOT NULL;
```

**Rezultat:** Sintaxă validă, integritate păstrată.

---

## ✅ PATCH 3: client_booking_quotes.locked_by varchar → FK explicit

### ❌ PROBLEMA

```sql
locked_by varchar
```

**Issue:** Inconsistent cu designul tău la snapshots (unde ai FK explicit la admin_users).  
**Risc:** Peste 6 luni nu știi cine a lock-uit, zero integritate referențială.

### ✅ FIX

```sql
-- În CREATE TABLE client_booking_quotes, ÎNLOCUIEȘTE:
-- locked_by varchar,
-- CU:
locked_by_type varchar DEFAULT 'system',
locked_by_admin_user_id uuid REFERENCES admin_users(id),

-- ADD constraint:
CONSTRAINT chk_locked_by_type CHECK (
  locked_by_type IN ('system', 'admin_user', 'automation')
)
```

**UPDATE la locked_at logic:**

```sql
-- Când lock quote:
UPDATE client_booking_quotes
SET
  is_locked = true,
  locked_at = now(),
  locked_by_type = 'admin_user',
  locked_by_admin_user_id = <current_admin_user_id>
WHERE id = <quote_id>;
```

**Rezultat:** FK integritate + consistency cu snapshot design.

---

## ✅ PATCH 4: payment_transactions - ADD payment_status enum explicit

### ❌ PROBLEMA

Ai `payment_kind` (full/deposit/balance/retry) dar **lipsește payment_status** pentru lifecycle.

**Issue:** Cum știi dacă payment e pending/succeeded/failed/refunded?  
**Risc:** Logică ambiguă în cod, fără single source of truth pentru status.

### ✅ FIX

```sql
-- În CREATE TABLE payment_transactions, ADAUGĂ:
payment_status varchar NOT NULL DEFAULT 'pending',
provider_status varchar, -- raw Stripe status pentru audit

-- ADD constraint:
CONSTRAINT chk_payment_status CHECK (
  payment_status IN (
    'pending',
    'processing',
    'authorized',
    'succeeded',
    'failed',
    'canceled',
    'refunded_partial',
    'refunded_full'
  )
)
```

**Separare clară:**

- `payment_kind` = TIP payment (full, deposit, balance, retry)
- `payment_status` = LIFECYCLE status (pending, succeeded, failed, etc)
- `provider_status` = raw Stripe status pentru debug

**Rezultat:** Model clar de status, fără ambiguitate.

---

## ✅ PATCH 5: driver_payout_breakdowns - Validare model 1 snapshot = 1 payout

### ❌ PROBLEMA

```sql
financial_snapshot_id uuid UNIQUE NOT NULL
```

**Issue:** Dacă `financial_snapshot_id UNIQUE`, atunci **1 snapshot = 1 payout driver**.

**Risc:** Dacă în viitor ai:

- Split payout între 2 drivers
- Reassignment mid-ride
- Relief driver / second driver
- Multi-leg cu drivers diferiti

Structura devine prea strânsă.

### ✅ FIX (2 opțiuni)

**Opțiunea A: CONFIRM model 1:1** (dacă business e sigur 1 booking = 1 driver principal)

```sql
-- KEEP UNIQUE, ADD comment explicit:
COMMENT ON COLUMN driver_payout_breakdowns.financial_snapshot_id IS
'UNIQUE constraint enforces 1 payout per financial snapshot.
BUSINESS RULE: 1 booking = 1 primary driver = 1 payout breakdown.
Pentru multi-driver bookings (viitor): va trebui payout split mechanism separat.';
```

**Opțiunea B: PERMITE multiple payouts per snapshot** (dacă prevezi multi-driver)

```sql
-- ȘTERGE UNIQUE de pe financial_snapshot_id
-- ADAUGĂ:
UNIQUE (financial_snapshot_id, driver_id)

-- Asta permite multiple drivers per snapshot dar fiecare driver doar 1x
```

**DECIZIE NECESARĂ:** Confirmă modelul business:

- [ ] 1 booking = mereu 1 driver = KEEP UNIQUE
- [ ] 1 booking = posibil multiple drivers = SWITCH la Opțiunea B

**Rezultat:** Model clar aliniat cu realitatea operațională.

---

## ✅ PATCH 6: discount_campaigns.current_uses - SSOT vs Cache

### ❌ PROBLEMA

```sql
current_uses integer DEFAULT 0
```

**Issue:** E SSOT sau cache?

**Risc:** Dacă nu e atomic update:

- `discount_applications` spune 23 uses
- `current_uses` spune 21
- Inconsistență financiară

### ✅ FIX

**Opțiunea A: SSOT via trigger** (dacă vrei să păstrezi current_uses)

```sql
-- CREATE trigger pentru atomic update
CREATE FUNCTION update_campaign_uses()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE discount_campaigns
    SET current_uses = current_uses + 1
    WHERE id = NEW.campaign_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE discount_campaigns
    SET current_uses = current_uses - 1
    WHERE id = OLD.campaign_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_campaign_uses
AFTER INSERT OR DELETE ON discount_applications
FOR EACH ROW
EXECUTE FUNCTION update_campaign_uses();
```

**Opțiunea B: ELIMINĂ current_uses** (mai safe - SSOT = discount_applications)

```sql
-- ȘTERGE current_uses din discount_campaigns

-- Query count când e nevoie:
SELECT COUNT(*)
FROM discount_applications
WHERE campaign_id = <id>;

-- Sau CREATE VIEW materializată pentru performance
```

**RECOMANDARE:** Opțiunea B (elimină current_uses, SSOT = discount_applications).

**Rezultat:** Fără risc de inconsistență.

---

## ✅ PATCH 7: booking_financial_snapshots.snapshot_version - Contract explicit increment

### ❌ PROBLEMA

```sql
snapshot_version integer DEFAULT 1,
UNIQUE (booking_id, snapshot_version)
```

**Issue:** Cine incrementează? Trigger? Service layer? Manual?

**Risc:** Fiecare developer interpretează diferit → race conditions, duplicate versions.

### ✅ FIX

**Contract explicit via DB function:**

```sql
-- CREATE function pentru next version
CREATE FUNCTION get_next_snapshot_version(p_booking_id uuid)
RETURNS integer AS $$
DECLARE
  v_next_version integer;
BEGIN
  SELECT COALESCE(MAX(snapshot_version), 0) + 1
  INTO v_next_version
  FROM booking_financial_snapshots
  WHERE booking_id = p_booking_id;

  RETURN v_next_version;
END;
$$ LANGUAGE plpgsql;

-- USAGE în trigger sau service:
INSERT INTO booking_financial_snapshots (
  booking_id,
  snapshot_version,
  ...
) VALUES (
  <booking_id>,
  get_next_snapshot_version(<booking_id>),
  ...
);
```

**ALTERNATIV:** Sequence per booking (mai complex dar atomic)

```sql
-- Nu recomand sequences aici; function e suficient
```

**COMMENT explicit:**

```sql
COMMENT ON COLUMN booking_financial_snapshots.snapshot_version IS
'Sequential version per booking (1, 2, 3...).
CRITICAL: ONLY increment via get_next_snapshot_version() function.
DO NOT manually set version - race condition risk!
Increment on: payment_success, manual_adjustment, correction, refund_impact.';
```

**Rezultat:** Contract clar, fără ambiguitate.

---

## 📋 BONUS PATCHES (Nice-to-have, nu blocker)

### BONUS A: payment_kind - Elimină 'refund_partial'

```sql
-- În payment_transactions constraint, ÎNLOCUIEȘTE:
-- payment_kind IN ('full', 'deposit', 'balance', 'retry', 'refund_partial')
-- CU:
payment_kind IN ('full', 'deposit', 'balance', 'retry')

-- Refunds DOAR în payment_refunds table (nu în payment_transactions)
```

### BONUS B: manual_financial_adjustments - ADD impact_target

```sql
-- ADAUGĂ pentru clarity:
impact_target varchar NOT NULL,

CONSTRAINT chk_impact_target CHECK (
  impact_target IN (
    'client_total',
    'platform_fee',
    'operator_net',
    'driver_payout',
    'vat',
    'informational'
  )
)
```

### BONUS C: Cleanup naming

```sql
-- Dacă vrei să cureți naming-uri temporare:
-- booking_assignment_new → booking_assignments (eventual migration)
-- calc_version '2.0.0' → clarify dacă e hardcoded sau config
```

---

## ✅ IMPLEMENTARE PATCH LIST

### Ordinea de aplicare:

1. **PATCH 1** - pricing_vehicle_rates unique indexes
2. **PATCH 2** - booking_financial_snapshots unique index
3. **PATCH 3** - client_booking_quotes.locked_by FK
4. **PATCH 4** - payment_transactions.payment_status
5. **PATCH 5** - driver_payout_breakdowns model validation (DECIZIE!)
6. **PATCH 6** - discount_campaigns.current_uses (RECOMANDARE: elimină)
7. **PATCH 7** - snapshot_version contract via function

### SQL patch files:

```
sql/migrations/pricing_v2_final/
  00_freeze_patch_01_vehicle_rates_unique.sql
  00_freeze_patch_02_snapshots_unique.sql
  00_freeze_patch_03_quotes_locked_by.sql
  00_freeze_patch_04_payment_status.sql
  00_freeze_patch_05_payout_model.sql (TBD - decizie business)
  00_freeze_patch_06_campaign_uses.sql
  00_freeze_patch_07_snapshot_version.sql
```

---

## 🎯 POST-PATCH STATUS

După aplicarea acestor 7 patch-uri:

### Integritate:

- [x] NULL semantics corectate (pricing_vehicle_rates)
- [x] Partial unique indexes sintaxă validă
- [x] FK consistency (locked_by)
- [x] Payment status model complet
- [x] Payout model validat cu business
- [x] SSOT clar pentru discount uses
- [x] Contract explicit pentru snapshot versioning

### Consistency:

- [x] Toate FK-uri explicite (nu varchar ambigu)
- [x] Enums/constraints complete
- [x] Trigger/function contracts documentate
- [x] Ambiguități eliminate

### Production-ready:

- [x] Schema freeze-ready 100%
- [x] Migration SQL executabil
- [x] Rollback procedures clare
- [x] Validation queries definite

---

## ✅ FREEZE DECISION CHECKLIST

După aplicarea patch-urilor, verifică:

- [ ] **PATCH 1-4:** Applied și validate
- [ ] **PATCH 5:** Business decision confirmată (1:1 vs multi-driver)
- [ ] **PATCH 6:** current_uses eliminat SAU trigger atomic creat
- [ ] **PATCH 7:** get_next_snapshot_version() function created
- [ ] Schema V3 updated în doc oficial
- [ ] Migration files updated cu patch-uri
- [ ] Decision matrix updated

**CÂND TOATE ✅ → V3 FINAL FREEZE READY 100% 🎯**

---

**NEXT:** Aplici patch-urile în schema V3 și migrații → FREEZE FINAL confirmat
