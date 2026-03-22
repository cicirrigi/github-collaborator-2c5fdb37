# 🗄️ PRICING V2 FINAL - MIGRATIONS EXECUTABILE

**Versiune:** 2.0 FINAL  
**Data:** 18 Martie 2026  
**Bazat pe:** DB real verificat + Schema corectată + Decision Matrix

---

## 📋 WAVE STRUCTURE

Migrations organizate în **5 WAVES** executabile strict secvențial:

### WAVE 1: Foundation (CRITICAL) - 1.5 zile

```
01_create_pricing_versions.sql
02_create_organization_settings.sql
03_create_pricing_vehicle_rates.sql
04_create_pricing_time_rules.sql
05_create_pricing_airport_fees.sql
06_create_pricing_zone_fees.sql
07_create_pricing_service_catalog.sql
08_create_pricing_policies.sql
09_migrate_pricing_config_data.sql (MARE - conversie pounds → pence)
10_create_pricing_views.sql
```

### WAVE 2: Quote & Payment Chain (CRITICAL) - 1 zi

```
11_extend_client_booking_quotes.sql
12_create_quote_service_items.sql
13_remodel_payment_transactions.sql (ATENȚIE: DESTRUCTIV)
14_create_payment_refunds.sql
```

### WAVE 3: Financial Snapshots (CRITICAL) - 1 zi

```
15_create_booking_financial_snapshots.sql
16_create_snapshot_trigger.sql
17_populate_retroactive_snapshots.sql (95 bookings)
18_deprecate_booking_pricing.sql
```

### WAVE 4: Driver Payouts (HIGH) - 0.5 zi

```
19_create_driver_payout_breakdowns.sql
20_create_payout_trigger.sql
21_populate_retroactive_payouts.sql (95 bookings)
```

### WAVE 5: Polish & Extras (MEDIUM) - 0.25 zi

```
22_create_manual_adjustments.sql
23_deprecate_booking_leg_pricing.sql
24_create_discount_tables.sql (OPTIONAL - skip pentru MVP)
```

---

## ⚠️ CRITICAL WARNINGS

### 1. **WAVE 1 trebuie completat 100% înainte de WAVE 2**

- Backend Pricing Engine NU funcționează fără WAVE 1 complete
- VIEWS trebuie create ultimele (după tabele populate)

### 2. **Migration 13 (payment_transactions remodel) E DESTRUCTIV**

```sql
-- VERIFICĂ records count ÎNAINTE!
SELECT COUNT(*) FROM payment_transactions; -- trebuie să fie 0

-- Dacă > 0: BACKUP complet înainte de ALTER!
```

### 3. **Migration 09 (pricing config data) e COMPLEXĂ**

- Conversie pounds → pence (\* 100)
- Extragere din JSONB
- Populate ~50+ records
- VALIDARE CRITICĂ după

### 4. **Migrations 17 & 21 (retroactive) sunt LENTE**

- 95 bookings x 2 operații = ~3-5 minute
- Nu întrerupe!

---

## 📊 VALIDARE OBLIGATORIE

După fiecare migration, rulează validările din comments-uri!

### Post-WAVE 1:

```sql
-- Verifică pricing_versions
SELECT * FROM pricing_versions WHERE is_active = true; -- trebuie 1 record

-- Verifică vehicle rates
SELECT COUNT(*) FROM pricing_vehicle_rates; -- trebuie ~16

-- Verifică views
SELECT * FROM v_active_pricing_version; -- trebuie să returneze v1

-- TEST Backend
-- În Backend, rulează:
-- const rates = await PricingDataService.getVehicleRates('executive', 'oneway');
-- console.log(rates); // trebuie să returneze date
```

### Post-WAVE 2:

```sql
-- Verifică payment_transactions columns
SELECT column_name FROM information_schema.columns
WHERE table_name = 'payment_transactions'
AND column_name IN ('quote_id', 'amount_pence', 'idempotency_key');
-- trebuie 3 results

-- Verifică refunds table
SELECT COUNT(*) FROM payment_refunds; -- poate fi 0 (OK)
```

### Post-WAVE 3:

```sql
-- Verifică snapshots retroactive
SELECT COUNT(*) FROM booking_financial_snapshots
WHERE snapshot_reason = 'retroactive_migration'; -- trebuie 95

-- Verifică link legacy
SELECT COUNT(*) FROM booking_pricing
WHERE financial_snapshot_id IS NOT NULL; -- trebuie 95
```

---

## 🔄 ROLLBACK STRATEGY

### Dacă ceva merge prost:

**WAVE 1 rollback:**

```sql
DROP VIEW IF EXISTS v_pricing_zone_fees CASCADE;
DROP VIEW IF EXISTS v_pricing_airport_fees CASCADE;
DROP VIEW IF EXISTS v_pricing_time_rules CASCADE;
DROP VIEW IF EXISTS v_pricing_vehicle_rates CASCADE;
DROP VIEW IF EXISTS v_active_pricing_version CASCADE;

DROP TABLE IF EXISTS pricing_policies CASCADE;
DROP TABLE IF EXISTS pricing_service_catalog CASCADE;
DROP TABLE IF EXISTS pricing_zone_fees CASCADE;
DROP TABLE IF EXISTS pricing_airport_fees CASCADE;
DROP TABLE IF EXISTS pricing_time_rules CASCADE;
DROP TABLE IF EXISTS pricing_vehicle_rates CASCADE;
DROP TABLE IF EXISTS organization_settings CASCADE;
DROP TABLE IF EXISTS pricing_versions CASCADE;
```

**WAVE 2 rollback (PARȚIAL - payment_transactions e complicat!):**

```sql
-- NU poți rollback ALTER COLUMN RENAME ușor!
-- Trebuie restore din backup dacă ai date!

DROP TABLE IF EXISTS payment_refunds CASCADE;
DROP TABLE IF EXISTS quote_service_items CASCADE;
-- client_booking_quotes: DROP COLUMN is_current, superseded_by_quote_id
```

**WAVE 3+ rollback:**

```sql
DROP TABLE IF EXISTS driver_payout_breakdowns CASCADE;
DROP TABLE IF EXISTS booking_financial_snapshots CASCADE;
-- Restaurează booking_pricing.financial_snapshot_id = NULL
```

---

## ⚙️ EXECUȚIE

### Opțiune A: Manual (Supabase Dashboard)

1. Deschide SQL Editor
2. Copiază conținutul migration
3. Citește comments ATENT
4. Execută
5. Verifică output
6. Rulează validările

### Opțiune B: Via MCP (Automated)

```typescript
import { mcp0_apply_migration } from './supabase-mcp';

// Wave 1
await mcp0_apply_migration({
  project_id: 'fmeonuvmlopkutbjejlo',
  name: '01_create_pricing_versions',
  query: fs.readFileSync('./01_create_pricing_versions.sql', 'utf8'),
});
```

### Opțiune C: Via Supabase CLI

```bash
supabase db push --linked
```

---

## 📝 STATUS TRACKING

| Wave | Migration | Status | Duration | Errors | Notes |
| ---- | --------- | ------ | -------- | ------ | ----- |
| 1    | 01        | ⏳     | -        | -      | -     |
| 1    | 02        | ⏳     | -        | -      | -     |
| 1    | 03        | ⏳     | -        | -      | -     |
| ...  |           |        |          |        |       |

Completează pe măsură ce execuți.

---

## 🎯 SUCCESS CRITERIA

### MVP Minim Funcțional (după WAVE 1-3):

- [ ] Backend Pricing Engine funcționează
- [ ] Frontend poate crea quotes
- [ ] Booking creation cu quote_id funcționează
- [ ] Payment transactions cu quote link
- [ ] Financial snapshots create automat
- [ ] Legacy data preserved și linked

### Production Ready (după WAVE 4-5):

- [ ] Driver payouts calculate corect
- [ ] Manual adjustments posibile
- [ ] Legacy tables marcate DEPRECATED
- [ ] Toate indexes create
- [ ] Toate triggers functional
- [ ] Zero performance issues

---

**ESTIMARE TOTALĂ:** 4.25 zile = ~34 ore (cu testing complet)

**RISC:** Mediu (migrations bine documentate, rollback definit)

**NEXT:** Execută Wave 1 complet, validează, apoi Wave 2.
