# 🗄️ PRICING V2 - DATABASE MIGRATIONS

**Data:** 18 Martie 2026  
**Scop:** Migrare completă la arhitectura pricing v2 normalize

---

## 📋 ORDINE EXECUȚIE

Migrations trebuie rulate **în ordine**:

### WAVE 1: Foundation (CRITICAL)

```
01_create_organization_settings.sql
02_create_pricing_versions.sql
03_create_pricing_vehicle_rates.sql
04_create_pricing_time_rules.sql
05_create_pricing_airport_fees.sql
06_create_pricing_zone_fees.sql
```

### WAVE 2: Services & Policies (HIGH)

```
07_create_pricing_service_catalog.sql
08_create_pricing_policies.sql
09_create_quote_service_items.sql
```

### WAVE 3: Financial Core (CRITICAL)

```
10_extend_payment_transactions.sql
11_create_booking_financial_snapshots.sql
12_create_driver_payout_breakdowns.sql
```

### WAVE 4: Data Migration (HIGH)

```
13_migrate_pricing_config_to_normalize.sql
14_populate_retroactive_snapshots.sql
15_deprecate_legacy_tables.sql
```

### WAVE 5: Views & Compatibility (CRITICAL)

```
16_create_pricing_views.sql
```

---

## ⚙️ EXECUȚIE

### Manual (Supabase Dashboard):

1. Deschide SQL Editor
2. Copiază conținutul fiecărui migration în ordine
3. Execută
4. Verifică success

### Automated (MCP):

```javascript
// Via Supabase MCP tool
mcp0_apply_migration({
  project_id: 'fmeonuvmlopkutbjejlo',
  name: '01_create_organization_settings',
  query: '<SQL content>',
});
```

---

## ✅ VALIDATION

După fiecare wave, verifică:

**WAVE 1:**

- [ ] organization_settings exists + populated
- [ ] pricing_versions v1 exists
- [ ] 4 tabele pricing\_\* exists și goale (gata pentru populate)

**WAVE 2:**

- [ ] pricing_service_catalog exists
- [ ] pricing_policies exists
- [ ] quote_service_items exists

**WAVE 3:**

- [ ] payment_transactions are coloane noi (quote_id, organization_id, idempotency_key)
- [ ] booking_financial_snapshots exists + trigger functional
- [ ] driver_payout_breakdowns exists + trigger functional

**WAVE 4:**

- [ ] pricing_versions v1 populat cu date
- [ ] pricing_vehicle_rates are ~16 records (4 vehicles x 4 booking types)
- [ ] pricing_time_rules are ~5 records
- [ ] pricing_airport_fees are ~5 records
- [ ] pricing_zone_fees are ~5 records
- [ ] 95 booking_financial_snapshots create
- [ ] 95 driver_payout_breakdowns create
- [ ] Legacy tables marcate DEPRECATED

**WAVE 5:**

- [ ] 5 views create și query-able
- [ ] Backend poate accesa views

---

## 🔄 ROLLBACK

Dacă ceva merge prost:

```sql
-- Rollback wave specific
-- WAVE 1
DROP TABLE IF EXISTS pricing_zone_fees CASCADE;
DROP TABLE IF EXISTS pricing_airport_fees CASCADE;
DROP TABLE IF EXISTS pricing_time_rules CASCADE;
DROP TABLE IF EXISTS pricing_vehicle_rates CASCADE;
DROP TABLE IF EXISTS pricing_versions CASCADE;
DROP TABLE IF EXISTS organization_settings CASCADE;

-- WAVE 2
DROP TABLE IF EXISTS quote_service_items CASCADE;
DROP TABLE IF EXISTS pricing_policies CASCADE;
DROP TABLE IF EXISTS pricing_service_catalog CASCADE;

-- WAVE 3 (ATENȚIE: nu șterge coloane dacă ai date!)
-- ALTER TABLE payment_transactions DROP COLUMN quote_id;
-- etc.

-- WAVE 5
DROP VIEW IF EXISTS v_pricing_zone_fees;
DROP VIEW IF EXISTS v_pricing_airport_fees;
DROP VIEW IF EXISTS v_pricing_time_rules;
DROP VIEW IF EXISTS v_pricing_vehicle_rates;
DROP VIEW IF EXISTS v_active_pricing_version;
```

---

## 📊 STATUS TRACKING

| Migration | Status | Records Created | Errors | Notes |
| --------- | ------ | --------------- | ------ | ----- |
| 01        | ⏳     | -               | -      | -     |
| 02        | ⏳     | -               | -      | -     |
| 03        | ⏳     | -               | -      | -     |
| ...       |        |                 |        |       |

Completează pe măsură ce execuți.

---

**NEXT:** Execută migrations în ordine și validează fiecare wave.
