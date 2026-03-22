# ⚖️ DECISION MATRIX V2 - BAZAT PE REALITATE

**Data:** 18 Martie 2026  
**Bazat pe:** Verificare DB reală + Schema corectată V2 + Gap Analysis V2

---

## 🎯 LEGEND

| Decizie          | Acțiune                                                     | Când                 |
| ---------------- | ----------------------------------------------------------- | -------------------- |
| **KEEP**         | Păstrează exact, folosește în continuare                    | Acum                 |
| **EXTEND MINOR** | Adaugă 1-3 coloane/indexes                                  | Wave specific        |
| **EXTEND MAJOR** | Adaugă multe coloane, modifică structură parțial            | Wave specific        |
| **REMODEL**      | Modificări structurale majore (rename, conversii, refactor) | Wave specific        |
| **CREATE**       | Creează tabelă nouă                                         | Wave specific        |
| **MIGRATE**      | Transformă date din format vechi → nou                      | Wave specific        |
| **DEPRECATE**    | Marchează read-only, nu mai populate                        | După migrare         |
| **DELETE**       | Șterge (DOAR dacă 0 records și sigur inutilizabil)          | Never pentru pricing |

---

## 📊 DECISION MATRIX COMPLETĂ

### 🔵 CATEGORIA: Pricing Configuration

---

#### **1. pricing_config** [LEGACY JSONB]

**Status actual:** ✅ EXISTĂ (1 record)  
**Records:** 1 activ cu toate regulile în JSONB  
**Folosit de:** Nimeni acum (Backend cere VIEWS care nu există)

**DECIZIE:** 🟡 **MIGRATE → DEPRECATE**

**Motivație:**

- Date valoroase (singura sursă acum)
- Backend nou cere tabele normalize
- JSONB monolitic imposibil de query eficient
- Tarife în POUNDS (trebuie conversie → pence)

**Acțiuni:**

```
WAVE 1:
1. ✅ KEEP temporar (pentru migrare)
2. 📦 MIGRATE date → 7 tabele normalize
   - pricing_vehicle_rates: extract vehicle_types, conversie £ → pence
   - pricing_time_rules: extract time_multipliers
   - pricing_airport_fees: extract airport_fees
   - pricing_zone_fees: extract zone_fees
   - pricing_service_catalog: extract premium_services
   - pricing_policies: extract general_policies
3. 🔴 DEPRECATE după migrare (mark read-only)
   - COMMENT 'LEGACY - folosește pricing_versions + normalize'
4. ❌ NU DELETE (keep pentru history/backup)
```

**Prioritate:** 🔴 CRITICAL (WAVE 1)  
**Timp:** 1 zi (migrare + conversie + validare)

---

#### **2. pricing_versions** [NOU]

**Status actual:** ❌ NU EXISTĂ  
**Backend așteaptă:** Da (PricingDataService.getVehicleRates → pricing_version_id)

**DECIZIE:** ✅ **CREATE**

**Motivație:**

- Master versioning pentru toate regulile
- Backend le cere explicit
- Necesare pentru FK în toate tabelele pricing\_\*

**Acțiuni:**

```
WAVE 1:
1. CREATE table cu schema definită
2. INSERT v1 cu date din pricing_config
   - version_number: 1
   - version_name: 'Initial Migration'
   - is_active: true
   - is_published: true
   - effective_from: pricing_config.created_at
3. CAPTURE pricing_version_id pentru FK în alte tabele
```

**Prioritate:** 🔴 CRITICAL (WAVE 1 - primul!)  
**Timp:** 1 oră

---

#### **3. pricing_vehicle_rates** [NOU]

**Status actual:** ❌ NU EXISTĂ  
**Backend așteaptă:** Da (v_pricing_vehicle_rates VIEW)

**DECIZIE:** ✅ **CREATE + MIGRATE**

**Motivație:**

- Core pricing calculation
- Backend Pricing Engine nu funcționează fără
- Normalize din pricing_config.vehicle_types

**Acțiuni:**

```
WAVE 1:
1. CREATE table
2. MIGRATE din pricing_config.vehicle_types:
   FOR EACH vehicle (executive, luxury, suv, mpv):
     FOR EACH booking_type (oneway, return, hourly, daily):
       INSERT cu conversie £ → pence (* 100)
       - base_fare: 22 → 2200
       - per_mile_first_6: 2.5 → 250
       etc.
3. VALIDATE migrated data
```

**Prioritate:** 🔴 CRITICAL (WAVE 1)  
**Timp:** 3 ore (migrare + conversie)

---

#### **4-7. pricing_time_rules, pricing_airport_fees, pricing_zone_fees, pricing_service_catalog** [NOI]

**Status:** ❌ NU EXISTĂ  
**Backend:** Necesare pentru calcule complete

**DECIZIE:** ✅ **CREATE + MIGRATE** (similar cu vehicle_rates)

**Prioritate:** 🔴 CRITICAL (WAVE 1)  
**Timp:** 2 ore fiecare = 8 ore total

---

#### **8. pricing_policies** [NOU]

**Status:** ❌ NU EXISTĂ

**DECIZIE:** ✅ **CREATE + MIGRATE**

**Acțiuni:**

```
WAVE 1:
1. CREATE table
2. MIGRATE policies din pricing_config:
   - rounding: din general_policies.rounding
   - return_discount: din return_settings.discount
   - fleet_discount: din fleet_settings.discounts
   - cancellation: din general_policies.cancellation
```

**Prioritate:** 🟡 HIGH (WAVE 1)  
**Timp:** 2 ore

---

### 🟢 CATEGORIA: Organization Settings

---

#### **9. organizations** [EXISTENT]

**Status:** ✅ EXISTĂ  
**Are:** driver_commission_pct, pricing_json  
**NU are:** vat_rate, platform_commission_pct, operator_commission_pct

**DECIZIE:** 🟢 **KEEP** (nu modifica)

**Motivație:**

- Tabelă core stabilă
- Noul organization_settings va complementa (1:1)
- driver_commission_pct poate rămâne aici deocamdată

**Acțiuni:** NIMIC (perfect cum e)

**Prioritate:** ✅ DONE

---

#### **10. organization_settings** [NOU]

**Status:** ❌ NU EXISTĂ  
**Backend:** OrganizationSettingsService le cere explicit

**DECIZIE:** ✅ **CREATE + POPULATE**

**Motivație:**

- VAT rate CRITICAL (acum hardcoded 20%!)
- Platform/operator commissions configurabile
- Multi-tenant flexibility

**Acțiuni:**

```
WAVE 1:
1. CREATE table (1:1 cu organizations)
2. POPULATE defaults:
   INSERT INTO organization_settings (organization_id, vat_rate, platform_commission_pct, operator_commission_pct)
   SELECT id, 0.20, 0.10, 0.10
   FROM organizations
   WHERE is_active = true;
3. CREATE FK constraint
```

**Prioritate:** 🔴 CRITICAL (WAVE 1)  
**Timp:** 1 oră

---

### 🟠 CATEGORIA: Quotes & Transactions

---

#### **11. client_booking_quotes** [EXISTENT]

**Status:** ✅ EXISTĂ (creat de mine, 0 records)  
**Schema:** UNIQUE(booking_id, version) ✅ - versioning corect!

**DECIZIE:** 🟡 **EXTEND MINOR**

**Motivație:**

- Base schema e bună
- Versioning deja corect
- Lipsesc doar markere pentru "current quote"

**Acțiuni:**

```
WAVE 2:
1. ALTER ADD COLUMN:
   - is_current boolean DEFAULT true
   - superseded_by_quote_id uuid REFERENCES client_booking_quotes(id)
2. CREATE partial unique index:
   CREATE UNIQUE INDEX idx_current_quote_per_booking
   ON client_booking_quotes(booking_id)
   WHERE is_current = true AND deleted_at IS NULL;
3. COMMENT 'versioning: (booking_id, version) UNIQUE allows requoting'
```

**Prioritate:** 🟡 HIGH (WAVE 2)  
**Timp:** 1 oră

---

#### **12. quote_service_items** [NOU]

**Status:** ❌ NU EXISTĂ

**DECIZIE:** ✅ **CREATE**

**Motivație:**

- Normalize services din quote.line_items
- FK la catalog pentru traceability
- Query-able pentru analytics

**Acțiuni:**

```
WAVE 2:
1. CREATE table cu FK la:
   - quote_id (cascade DELETE)
   - service_catalog_id (nullable pentru discontinued)
2. Snapshot fields: service_code, service_name, unit_price_pence
3. POPULATE trigger (optional): auto-insert când quote created
```

**Prioritate:** 🟡 HIGH (WAVE 2)  
**Timp:** 2 ore

---

#### **13. payment_transactions** [EXISTENT dar GRAV INCOMPLET]

**Status:** ⚠️ EXISTĂ (0 records)  
**Probleme:** Amount în POUNDS, lipsesc FK-uri, lipsesc multi-payment columns

**DECIZIE:** 🔴 **REMODEL PARȚIAL**

**Motivație:**

- Unități greșite (pounds vs pence)
- Frontend folosește pence
- Lipsesc FK-uri critice (quote_id, org_id)
- Nu suportă multi-payment flows

**Acțiuni:**

```
WAVE 2 (ATENȚIE: DESTRUCTIV dacă există date!):
1. CHECK records count:
   IF count > 0: BACKUP first!

2. RENAME columns (conversie unități):
   ALTER TABLE payment_transactions
   RENAME COLUMN amount TO amount_pence;
   -- similar pentru stripe_fee, net_amount

3. UPDATE existing data (dacă există):
   UPDATE payment_transactions
   SET amount_pence = amount_pence * 100,
       stripe_fee_pence = stripe_fee_pence * 100,
       net_amount_pence = net_amount_pence * 100;

4. ADD coloane noi:
   ADD COLUMN quote_id uuid REFERENCES client_booking_quotes(id),
   ADD COLUMN organization_id uuid REFERENCES organizations(id),
   ADD COLUMN idempotency_key varchar UNIQUE,
   ADD COLUMN payment_kind varchar DEFAULT 'full',
   ADD COLUMN payment_sequence integer DEFAULT 1,
   ADD COLUMN parent_payment_transaction_id uuid REFERENCES payment_transactions(id),
   ADD COLUMN stripe_charge_id varchar,
   ADD COLUMN payment_method_last4 varchar(4),
   ADD COLUMN payment_method_brand varchar(50);

5. DROP refund columns:
   DROP COLUMN IF EXISTS refund_amount,
   DROP COLUMN IF EXISTS refund_reason,
   DROP COLUMN IF EXISTS refunded_at;

6. CREATE indexes:
   - idx_payment_quote_id
   - idx_payment_org_id
   - idx_payment_idempotency
```

**Prioritate:** 🔴 CRITICAL (WAVE 2)  
**Timp:** 4 ore (cu testing extensiv)

---

#### **14. payment_refunds** [NOU]

**Status:** ❌ NU EXISTĂ

**DECIZIE:** ✅ **CREATE + MIGRATE**

**Motivație:**

- Refunds trebuie separate (append-only child)
- Multiple partial refunds posibile
- Audit trail curat

**Acțiuni:**

```
WAVE 2:
1. CREATE table cu schema definită
2. MIGRATE existing refund data:
   IF EXISTS refund columns în payment_transactions:
     INSERT INTO payment_refunds
     SELECT ... FROM payment_transactions
     WHERE refund_amount > 0;
```

**Prioritate:** 🟡 HIGH (WAVE 2)  
**Timp:** 2 ore

---

### 🟣 CATEGORIA: Financial Snapshots

---

#### **15. booking_financial_snapshots** [NOU]

**Status:** ❌ NU EXISTĂ

**DECIZIE:** ✅ **CREATE + TRIGGER + POPULATE RETROACTIVE**

**Motivație:**

- Frozen financials CRITICAL pentru accounting
- Audit trail complet
- Immutable snapshot la momentul payment

**Acțiuni:**

```
WAVE 3:
1. CREATE table
2. CREATE TRIGGER:
   CREATE FUNCTION create_snapshot_on_payment_success()
   -- trigger când payment.status → 'completed'

3. POPULATE retroactiv pentru 95 bookings:
   INSERT INTO booking_financial_snapshots
   SELECT ... FROM booking_pricing bp
   JOIN bookings b ON bp.booking_id = b.id
   -- conversie pounds → pence
   -- snapshot_reason: 'retroactive_migration'

4. LINK legacy:
   ALTER booking_pricing ADD financial_snapshot_id uuid;
   UPDATE booking_pricing SET financial_snapshot_id = ...;
```

**Prioritate:** 🔴 CRITICAL (WAVE 3)  
**Timp:** 4 ore (create) + 3 ore (retroactive)

---

#### **16. driver_payout_breakdowns** [NOU]

**Status:** ❌ NU EXISTĂ

**DECIZIE:** ✅ **CREATE + TRIGGER + POPULATE RETROACTIVE**

**Motivație:**

- Transparent breakdown pentru șoferi
- Link la booking_assignment_new SSOT
- Separate tips, bonuses, deductions

**Acțiuni:**

```
WAVE 4:
1. CREATE table cu FK la:
   - financial_snapshot_id (1:1)
   - booking_assignment_id (pentru SSOT)

2. CREATE TRIGGER:
   CREATE FUNCTION create_payout_after_snapshot()
   -- trigger după snapshot creation

3. POPULATE retroactiv:
   INSERT INTO driver_payout_breakdowns
   SELECT ... FROM booking_pricing
   JOIN booking_assignment_new ...
   -- link corect la assignment
```

**Prioritate:** 🟡 HIGH (WAVE 4)  
**Timp:** 3 ore (create) + 3 ore (retroactive)

---

#### **17. manual_financial_adjustments** [NOU]

**Status:** ❌ NU EXISTĂ

**DECIZIE:** ✅ **CREATE**

**Motivație:**

- Goodwill, penalties, corrections
- Audit trail pentru excepții
- Prevent dirty updates la snapshots

**Acțiuni:**

```
WAVE 5:
1. CREATE table
2. Nu populate (se va folosi când apar excepții)
```

**Prioritate:** 🟢 MEDIUM (WAVE 5)  
**Timp:** 1 oră

---

### 🔴 CATEGORIA: Legacy Tables

---

#### **18. booking_pricing** [LEGACY]

**Status:** ✅ EXISTĂ (95 records)

**DECIZIE:** 🔴 **DEPRECATE** (nu DELETE!)

**Motivație:**

- Date valoroase pentru 95 bookings
- Posibil queries/reports existente le folosesc
- NU mai populate pentru bookings noi
- Păstrează read-only pentru history

**Acțiuni:**

```
WAVE 3 (după snapshots create):
1. ADD FK la noul sistem:
   ALTER booking_pricing
   ADD COLUMN financial_snapshot_id uuid REFERENCES booking_financial_snapshots(id);

2. LINK la snapshots:
   UPDATE booking_pricing bp
   SET financial_snapshot_id = fs.id
   FROM booking_financial_snapshots fs
   WHERE bp.booking_id = fs.booking_id
   AND fs.snapshot_reason = 'retroactive_migration';

3. COMMENT table:
   COMMENT ON TABLE booking_pricing IS
   '⚠️ DEPRECATED - Read-only legacy table.
   New bookings use: client_booking_quotes + booking_financial_snapshots.
   Keep for historical data only.';

4. CREATE VIEW pentru backwards compatibility:
   CREATE VIEW v_booking_pricing_legacy AS ...;
```

**Prioritate:** 🟡 HIGH (WAVE 3)  
**Timp:** 2 ore

---

#### **19. booking_leg_pricing** [LEGACY]

**Status:** ✅ EXISTĂ (105 records)

**DECIZIE:** 🔴 **DEPRECATE**

**Acțiuni:**

```
WAVE 3:
COMMENT ON TABLE booking_leg_pricing IS
'⚠️ DEPRECATED - Read-only legacy table.
Leg-level pricing moved to booking_financial_snapshots.revenue_split_snapshot.
Keep for historical data only.';
```

**Prioritate:** 🟢 MEDIUM (WAVE 3)  
**Timp:** 30 min

---

### 🟡 CATEGORIA: Auxiliary

---

#### **20. booking_assignment_new** [EXISTENT]

**Status:** ✅ EXISTĂ

**DECIZIE:** ✅ **KEEP**

**Motivație:**

- Perfect pentru SSOT assignment
- Driver payout va linka aici

**Acțiuni:** NIMIC (perfect cum e)

**Prioritate:** ✅ DONE

---

#### **21-22. discount_campaigns, discount_applications** [NOI]

**Status:** ❌ NU EXISTĂ

**DECIZIE:** ⏸️ **CREATE LATER** (Faza 2, nu MVP)

**Motivație:**

- Discount system complex
- Pentru acum: hardcoded în pricing engine (return, fleet, corporate)
- Future: promo codes, loyalty, seasonal

**Acțiuni:**

```
WAVE 6 (SKIP pentru MVP):
CREATE când business e gata pentru promo codes
Schema deja definită în SCHEMA_FINAL_V2
```

**Prioritate:** 🟢 LOW (faza 2)  
**Timp:** 2 ore (când e nevoie)

---

### 📊 CATEGORIA: Views

---

#### **23-27. VIEWS pentru Backend** [5 views]

**Status:** ❌ NU EXISTĂ

**DECIZIE:** ✅ **CREATE**

**Motivație:**

- Backend PricingDataService le așteaptă EXPLICIT
- Abstraction layer peste tabele
- Performance (pre-joined cu version info)

**Acțiuni:**

```
WAVE 1 (după tabele populate):
CREATE VIEW v_active_pricing_version AS
SELECT * FROM pricing_versions
WHERE is_active = true AND is_published = true
LIMIT 1;

CREATE VIEW v_pricing_vehicle_rates AS
SELECT r.*, v.version_number, v.version_name
FROM pricing_vehicle_rates r
JOIN pricing_versions v ON r.pricing_version_id = v.id
WHERE v.is_active = true AND r.active = true;

-- Similar pentru celelalte 3 views
```

**Prioritate:** 🔴 CRITICAL (WAVE 1 - ultima)  
**Timp:** 2 ore (toate 5)

---

## 📋 REZUMAT DECISIONS

| #     | Tabelă                      | Decizie                  | Wave | Prioritate  | Timp |
| ----- | --------------------------- | ------------------------ | ---- | ----------- | ---- |
| 1     | pricing_config              | MIGRATE → DEPRECATE      | 1    | 🔴 CRITICAL | 1 zi |
| 2     | pricing_versions            | CREATE                   | 1    | 🔴 CRITICAL | 1h   |
| 3     | pricing_vehicle_rates       | CREATE + MIGRATE         | 1    | 🔴 CRITICAL | 3h   |
| 4     | pricing_time_rules          | CREATE + MIGRATE         | 1    | 🔴 CRITICAL | 2h   |
| 5     | pricing_airport_fees        | CREATE + MIGRATE         | 1    | 🔴 CRITICAL | 2h   |
| 6     | pricing_zone_fees           | CREATE + MIGRATE         | 1    | 🔴 CRITICAL | 2h   |
| 7     | pricing_service_catalog     | CREATE + MIGRATE         | 1    | 🟡 HIGH     | 2h   |
| 8     | pricing_policies            | CREATE + MIGRATE         | 1    | 🟡 HIGH     | 2h   |
| 9     | organizations               | KEEP                     | -    | ✅ DONE     | 0    |
| 10    | organization_settings       | CREATE + POPULATE        | 1    | 🔴 CRITICAL | 1h   |
| 11    | client_booking_quotes       | EXTEND MINOR             | 2    | 🟡 HIGH     | 1h   |
| 12    | quote_service_items         | CREATE                   | 2    | 🟡 HIGH     | 2h   |
| 13    | payment_transactions        | REMODEL PARȚIAL          | 2    | 🔴 CRITICAL | 4h   |
| 14    | payment_refunds             | CREATE + MIGRATE         | 2    | 🟡 HIGH     | 2h   |
| 15    | booking_financial_snapshots | CREATE + TRIGGER + RETRO | 3    | 🔴 CRITICAL | 7h   |
| 16    | driver_payout_breakdowns    | CREATE + TRIGGER + RETRO | 4    | 🟡 HIGH     | 6h   |
| 17    | manual_adjustments          | CREATE                   | 5    | 🟢 MEDIUM   | 1h   |
| 18    | booking_pricing             | DEPRECATE                | 3    | 🟡 HIGH     | 2h   |
| 19    | booking_leg_pricing         | DEPRECATE                | 3    | 🟢 MEDIUM   | 0.5h |
| 20    | booking_assignment_new      | KEEP                     | -    | ✅ DONE     | 0    |
| 21-22 | discount\_\*                | CREATE LATER             | 6    | 🟢 LOW      | 2h   |
| 23-27 | 5x VIEWS                    | CREATE                   | 1    | 🔴 CRITICAL | 2h   |

---

## ⏱️ TIMP TOTAL ESTIMAT

### Wave by wave:

- **WAVE 1 (Foundation):** 1.5 zile (pricing config + org settings + views)
- **WAVE 2 (Quote/Payment):** 1 zi (quotes extend + payments remodel + refunds)
- **WAVE 3 (Snapshots):** 1 zi (create + trigger + retroactive 95 bookings)
- **WAVE 4 (Payouts):** 0.5 zi (create + trigger + retroactive)
- **WAVE 5 (Polish):** 0.25 zi (manual adjustments + deprecations)

**TOTAL MVP:** **4.25 zile** = ~34 ore (cu testing)

---

## ✅ VALIDATION CHECKLIST

După fiecare wave:

### WAVE 1:

- [ ] pricing_versions v1 exists cu is_active=true
- [ ] pricing_vehicle_rates are ~16 records (4 vehicles x 4 booking types)
- [ ] pricing_time_rules are ~5 records
- [ ] pricing_airport_fees are ~5 records
- [ ] pricing_zone_fees are ~5 records
- [ ] pricing_service_catalog populat
- [ ] pricing_policies populat
- [ ] organization_settings populat pentru toate org-urile
- [ ] 5x VIEWS create și query-able
- [ ] Backend poate accesa VIEWS cu success

### WAVE 2:

- [ ] client_booking_quotes are is_current column
- [ ] quote_service_items table exists
- [ ] payment_transactions renamed to \*\_pence
- [ ] payment_transactions are toate coloanele noi
- [ ] payment_refunds table exists

### WAVE 3:

- [ ] booking_financial_snapshots exists + trigger functional
- [ ] 95 snapshots create pentru legacy bookings
- [ ] booking_pricing.financial_snapshot_id populated
- [ ] Legacy tables marcate DEPRECATED

### WAVE 4:

- [ ] driver_payout_breakdowns exists + trigger
- [ ] 95 payouts create pentru legacy bookings
- [ ] Link la booking_assignment_new corect

---

**NEXT:** SQL migration scripts executabile wave by wave
