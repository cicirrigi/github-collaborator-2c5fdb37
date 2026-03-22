# 📐 PRICING & PAYMENTS - SCHEMA DB FINALĂ V2 (CORECTATĂ)

**Versiune:** 2.0 CORRECTED  
**Data:** 18 Martie 2026  
**Bazat pe:** Verificare reală DB + Feedback critic + Audit proiect

---

## 🔍 REALITATEA VERIFICATĂ DIN DB

### CE EXISTĂ DEJA (nu presupuneri!):

✅ **client_booking_quotes** - DEJA ARE versioning corect!

```sql
UNIQUE (booking_id, version) ✅
```

❌ LIPSEȘTE: is_current, superseded_by_quote_id

✅ **booking_assignment_new** - SSOT pentru driver assignment
✅ **organizations** - ARE driver_commission_pct, pricing_json
❌ **organizations** - NU ARE vat_rate, platform_commission_pct!

❌ **payment_transactions** - în POUNDS nu pence! (GRAV)
❌ **payment_transactions** - LIPSEȘTE quote_id, org_id, idempotency_key, payment_kind

✅ **pricing_config** - tarife în POUNDS (executive.base_fare = 22, NU 2200)

---

## 🔧 CORECȚII CRITICE INTEGRATE

### 1. Quote Versioning - EXTEND MINOR (nu KEEP)

**Status actual:** Are UNIQUE(booking_id, version) ✅  
**Lipsește:** Markere pentru quote curent activ

```sql
ALTER TABLE client_booking_quotes
ADD COLUMN is_current boolean DEFAULT true,
ADD COLUMN superseded_by_quote_id uuid REFERENCES client_booking_quotes(id);

-- Partial unique pentru quick access
CREATE UNIQUE INDEX idx_current_quote_per_booking
ON client_booking_quotes(booking_id)
WHERE is_current = true AND deleted_at IS NULL;
```

---

### 2. Payment Transactions - REMODEL PARȚIAL (nu doar EXTEND)

**Probleme critice găsite:**

- ❌ `amount` în pounds nu pence!
- ❌ Lipsesc FK-uri esențiale
- ❌ Lipsesc coloane pentru multi-payment flows
- ❌ Refunds în aceeași tabelă (greșit!)

**Corecții necesare:**

```sql
-- ADD coloane noi
ALTER TABLE payment_transactions
ADD COLUMN quote_id uuid REFERENCES client_booking_quotes(id),
ADD COLUMN organization_id uuid REFERENCES organizations(id),
ADD COLUMN idempotency_key varchar UNIQUE,
ADD COLUMN payment_kind varchar DEFAULT 'full', -- 'full', 'deposit', 'balance', 'retry'
ADD COLUMN payment_sequence integer DEFAULT 1,
ADD COLUMN parent_payment_transaction_id uuid REFERENCES payment_transactions(id),
ADD COLUMN stripe_charge_id varchar,
ADD COLUMN payment_method_last4 varchar(4),
ADD COLUMN payment_method_brand varchar(50);

-- RENAME pentru clarity (pounds → pence consistency)
-- ATENȚIE: Trebuie conversie date existente * 100!
ALTER TABLE payment_transactions RENAME COLUMN amount TO amount_pence;
ALTER TABLE payment_transactions RENAME COLUMN stripe_fee TO stripe_fee_pence;
ALTER TABLE payment_transactions RENAME COLUMN net_amount TO net_amount_pence;

-- UPDATE existing data (dacă există records)
UPDATE payment_transactions
SET amount_pence = amount_pence * 100,
    stripe_fee_pence = stripe_fee_pence * 100,
    net_amount_pence = net_amount_pence * 100;

-- DROP refund columns (vor merge în tabel separat)
ALTER TABLE payment_transactions
DROP COLUMN IF EXISTS refund_amount,
DROP COLUMN IF EXISTS refund_reason,
DROP COLUMN IF EXISTS refunded_at;
```

---

### 3. Payment Refunds - TABEL NOU SEPARAT

```sql
CREATE TABLE payment_refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_transaction_id uuid NOT NULL REFERENCES payment_transactions(id) ON DELETE RESTRICT,
  booking_id uuid NOT NULL REFERENCES bookings(id),

  -- Stripe refund details
  stripe_refund_id varchar UNIQUE NOT NULL,
  refund_amount_pence integer NOT NULL,
  currency varchar(3) DEFAULT 'GBP',

  -- Reason & status
  refund_reason varchar NOT NULL, -- 'customer_request', 'goodwill', 'error', 'chargeback'
  refund_status varchar NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'succeeded', 'failed', 'canceled'
  failure_reason text,

  -- Who initiated
  initiated_by varchar, -- 'customer', 'admin', 'system', 'stripe'
  initiated_by_user_id uuid REFERENCES admin_users(id),

  -- Metadata
  metadata jsonb,
  notes text,

  -- Timestamps
  refund_requested_at timestamptz DEFAULT now(),
  refund_processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_refunds_payment_id ON payment_refunds(payment_transaction_id);
CREATE INDEX idx_refunds_booking_id ON payment_refunds(booking_id);
CREATE INDEX idx_refunds_status ON payment_refunds(refund_status, created_at DESC);
CREATE INDEX idx_refunds_stripe_id ON payment_refunds(stripe_refund_id);
```

---

### 4. Quote Service Items - ADD FK LA CATALOG

```sql
CREATE TABLE quote_service_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES client_booking_quotes(id) ON DELETE CASCADE,

  -- FK la catalog pentru traceability
  service_catalog_id uuid REFERENCES pricing_service_catalog(id), -- poate fi NULL pentru discontinued services

  -- Snapshot values (immutable)
  service_code varchar NOT NULL, -- snapshot code
  service_name varchar NOT NULL, -- snapshot name
  quantity integer DEFAULT 1,
  unit_price_pence integer NOT NULL,
  subtotal_pence integer NOT NULL,
  is_taxable boolean DEFAULT true,

  -- Display order
  sort_order integer DEFAULT 0,

  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_quote_services_quote_id ON quote_service_items(quote_id, sort_order);
CREATE INDEX idx_quote_services_catalog_id ON quote_service_items(service_catalog_id) WHERE service_catalog_id IS NOT NULL;
```

---

### 5. Driver Payout Breakdowns - LINK LA ASSIGNMENT REAL

```sql
CREATE TABLE driver_payout_breakdowns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  driver_id uuid NOT NULL REFERENCES drivers(id),
  financial_snapshot_id uuid UNIQUE NOT NULL REFERENCES booking_financial_snapshots(id),

  -- CRITICAL: Link la assignment SSOT
  booking_assignment_id uuid REFERENCES booking_assignment_new(id), -- SSOT pentru cine e șoferul plătit

  -- Driver earnings
  base_payout_pence integer NOT NULL,
  bonus_pence integer DEFAULT 0, -- tips, incentives
  deductions_pence integer DEFAULT 0, -- penalties, fees
  total_payout_pence integer NOT NULL,

  -- Breakdown JSONB
  payout_breakdown jsonb NOT NULL DEFAULT '{}',

  -- Payout status
  payout_status varchar DEFAULT 'pending', -- 'pending', 'processing', 'paid', 'held', 'disputed'
  payout_method varchar, -- 'bank_transfer', 'stripe_connect', 'manual'
  payout_reference varchar, -- external payout ID
  paid_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_driver_payout_driver_id ON driver_payout_breakdowns(driver_id, payout_status, created_at DESC);
CREATE INDEX idx_driver_payout_booking_id ON driver_payout_breakdowns(booking_id);
CREATE INDEX idx_driver_payout_assignment_id ON driver_payout_breakdowns(booking_assignment_id);
```

---

### 6. Pricing Service Catalog - FIX UNIQUE CONFLICT

```sql
-- ❌ GREȘIT: service_code UNIQUE global + UNIQUE(pricing_version_id, service_code)
-- ✅ CORECT: doar UNIQUE per version

CREATE TABLE pricing_service_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_version_id uuid NOT NULL REFERENCES pricing_versions(id),

  -- Cod serviciu (poate fi același în versiuni diferite)
  service_code varchar NOT NULL, -- 'CHILD_SEAT', 'FLOWERS_STD', etc
  service_category varchar NOT NULL, -- 'child_safety', 'flowers', 'champagne', 'security'
  service_name varchar NOT NULL,
  service_variant varchar, -- 'standard', 'premium', 'exclusive'

  -- Pricing
  unit_price_pence integer NOT NULL,
  is_taxable boolean DEFAULT true,

  -- Booking requirements
  requires_advance_booking boolean DEFAULT false,
  min_advance_hours integer,
  max_quantity integer DEFAULT 1,

  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- ✅ CORECT: doar UNIQUE per version
  UNIQUE (pricing_version_id, service_code)
);

CREATE INDEX idx_service_catalog_version ON pricing_service_catalog(pricing_version_id, service_category, active);
CREATE INDEX idx_service_catalog_code ON pricing_service_catalog(service_code); -- pentru lookup
```

---

### 7. Organization Settings - CONSOLIDARE RESPONSBILITĂȚI

```sql
CREATE TABLE organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- VAT & Commissions (CRITICAL - lipsea!)
  vat_rate numeric(4,2) NOT NULL DEFAULT 0.20, -- 20% UK VAT
  platform_commission_pct numeric(4,2) NOT NULL DEFAULT 0.10, -- 10%
  operator_commission_pct numeric(4,2) NOT NULL DEFAULT 0.10, -- 10%

  -- NOTĂ: driver_commission_pct există deja în organizations table
  -- Eventual va fi migrat aici mai târziu

  -- Business settings
  currency varchar(3) DEFAULT 'GBP',
  timezone varchar DEFAULT 'Europe/London',
  booking_lead_time_hours integer DEFAULT 2,
  max_advance_booking_days integer DEFAULT 365,

  -- Future: pricing overrides, discounts, etc.

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Populate cu defaults pentru toate org-urile existente
INSERT INTO organization_settings (organization_id)
SELECT id FROM organizations WHERE is_active = true
ON CONFLICT DO NOTHING;
```

**NOTĂ:** organizations.driver_commission_pct rămâne deocamdată în organizations. Eventual va fi mutat.

---

### 8. Pricing Policies - DOAR LIGHT CONFIG

```sql
CREATE TABLE pricing_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_version_id uuid NOT NULL REFERENCES pricing_versions(id),

  -- Policy type
  policy_type varchar NOT NULL, -- 'rounding', 'cancellation', 'return_discount', 'fleet_discount'

  -- Policy config JSONB (doar pentru light config!)
  policy_config jsonb NOT NULL DEFAULT '{}',

  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE (pricing_version_id, policy_type)
);

-- Exemple:
-- Rounding: {"round_to_pence": 500, "direction": "up"}
-- Cancellation: {"free_hours": 2, "charge_rate": 1.0}
-- Return: {"discount_rate": 0.10, "minimum_hours_between": 2}
-- Fleet: {"tier1": {"min": 3, "discount": 0.05}, "tier2": {"min": 5, "discount": 0.10}}
```

**ATENȚIE:** Nu băga logică critică operațională în JSONB! Doar config ușoară.

---

### 9. Manual Financial Adjustments - TABEL NOU

```sql
CREATE TABLE manual_financial_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),

  -- Link opțional la alte entități
  quote_id uuid REFERENCES client_booking_quotes(id),
  payment_transaction_id uuid REFERENCES payment_transactions(id),
  financial_snapshot_id uuid REFERENCES booking_financial_snapshots(id),

  -- Scope & type
  adjustment_scope varchar NOT NULL, -- 'quote', 'payment', 'snapshot', 'driver_payout'
  adjustment_type varchar NOT NULL, -- 'credit', 'debit', 'waiver', 'goodwill', 'penalty', 'correction'

  -- Amount
  amount_pence integer NOT NULL, -- poate fi negativ pentru credits
  currency varchar(3) DEFAULT 'GBP',

  -- Reason & approval
  reason varchar NOT NULL,
  notes text,
  created_by uuid NOT NULL REFERENCES admin_users(id),
  approved_by uuid REFERENCES admin_users(id),
  approved_at timestamptz,

  -- Status
  status varchar DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'applied'
  applied_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_adjustments_booking_id ON manual_financial_adjustments(booking_id, created_at DESC);
CREATE INDEX idx_adjustments_status ON manual_financial_adjustments(status);
CREATE INDEX idx_adjustments_created_by ON manual_financial_adjustments(created_by);
```

---

### 10. Booking Financial Snapshots - CLARIFICARE SCOPE

```sql
CREATE TABLE booking_financial_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  quote_id uuid NOT NULL REFERENCES client_booking_quotes(id),
  payment_transaction_id uuid REFERENCES payment_transactions(id), -- NULL pentru manual snapshots
  organization_id uuid NOT NULL REFERENCES organizations(id),

  -- Version pentru multiple snapshots per booking (rare, dar posibile)
  snapshot_version integer DEFAULT 1,
  snapshot_type varchar DEFAULT 'payment_success', -- 'payment_success', 'manual_adjustment', 'correction'

  -- CLIENT SIDE (frozen from quote)
  client_total_pence integer NOT NULL,
  client_vat_pence integer NOT NULL,
  client_net_pence integer NOT NULL, -- before VAT

  -- REVENUE SPLITS (calculated at snapshot time)
  gross_revenue_pence integer NOT NULL, -- = client_total_pence
  platform_fee_pence integer NOT NULL,
  operator_net_pence integer NOT NULL,
  driver_payout_pence integer NOT NULL,
  stripe_fee_pence integer DEFAULT 0,

  -- PERCENTAGES USED (audit trail - frozen!)
  platform_commission_pct numeric(4,2) NOT NULL,
  operator_commission_pct numeric(4,2) NOT NULL,
  driver_commission_pct numeric(4,2) NOT NULL,
  vat_rate numeric(4,2) NOT NULL,

  -- BREAKDOWN SNAPSHOTS (frozen JSONB)
  client_breakdown_snapshot jsonb NOT NULL, -- copy din quote.line_items
  revenue_split_snapshot jsonb NOT NULL,

  -- METADATA
  snapshot_reason varchar NOT NULL, -- 'payment_success', 'manual_adjustment', 'correction', 'refund_impact'
  snapshotted_at timestamptz NOT NULL DEFAULT now(),
  snapshotted_by varchar NOT NULL DEFAULT 'system', -- 'system', 'admin_user_id'

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- UNIQUE per payment (pentru primary snapshots)
  UNIQUE (payment_transaction_id) WHERE payment_transaction_id IS NOT NULL,

  -- sau multiple snapshots per booking
  UNIQUE (booking_id, snapshot_version)
);

CREATE INDEX idx_snapshot_booking ON booking_financial_snapshots(booking_id, created_at DESC);
CREATE INDEX idx_snapshot_quote ON booking_financial_snapshots(quote_id);
CREATE INDEX idx_snapshot_org ON booking_financial_snapshots(organization_id, snapshotted_at DESC);
```

**NOTĂ:**

- Primary snapshot: payment_success cu payment_transaction_id
- Secondary snapshots: manual adjustments, corrections (payment_transaction_id NULL)

---

### 11. Discounts - SEPARARE SISTEMICE VS PROMO

**Discounts sistemice** (în pricing engine):

- Return discount (pricing_policies.return_discount)
- Fleet discount (pricing_policies.fleet_discount)
- Corporate contract (din organization settings / contract tables)

**Discounts promo/manual** (separate tables):

```sql
CREATE TABLE discount_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),

  campaign_code varchar UNIQUE NOT NULL, -- 'SUMMER2026', 'WELCOME10'
  campaign_name varchar NOT NULL,
  campaign_type varchar NOT NULL, -- 'promo_code', 'loyalty', 'seasonal', 'manual'

  -- Discount config
  discount_type varchar NOT NULL, -- 'percentage', 'fixed_amount'
  discount_value numeric NOT NULL, -- 0.10 sau 1000 pence
  min_booking_value_pence integer,
  max_discount_pence integer,

  -- Restrictions
  applicable_booking_types varchar[], -- ['oneway', 'return']
  applicable_vehicle_categories varchar[], -- ['executive', 'luxury']

  -- Validity
  valid_from timestamptz NOT NULL,
  valid_until timestamptz NOT NULL,

  -- Usage limits
  max_uses_total integer,
  max_uses_per_customer integer DEFAULT 1,
  current_uses integer DEFAULT 0,

  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_campaigns_code ON discount_campaigns(campaign_code);
CREATE INDEX idx_campaigns_active ON discount_campaigns(organization_id, is_active, valid_from, valid_until);

CREATE TABLE discount_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES client_booking_quotes(id),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  discount_campaign_id uuid NOT NULL REFERENCES discount_campaigns(id),
  customer_id uuid NOT NULL REFERENCES customers(id),

  -- Applied discount
  discount_amount_pence integer NOT NULL,
  discount_type varchar NOT NULL, -- copy from campaign for audit

  applied_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_discount_apps_quote ON discount_applications(quote_id);
CREATE INDEX idx_discount_apps_campaign ON discount_applications(discount_campaign_id, applied_at);
CREATE INDEX idx_discount_apps_customer ON discount_applications(customer_id, applied_at);
```

---

## 📊 SCHEMA FINALĂ CORECTATĂ - REZUMAT

### TABELE MASTER (15 - după corecții):

1. ✅ pricing_versions
2. ✅ pricing_vehicle_rates
3. ✅ pricing_time_rules
4. ✅ pricing_airport_fees
5. ✅ pricing_zone_fees
6. ✅ pricing_service_catalog (FIXED unique conflict)
7. ✅ pricing_policies (DOAR light config)
8. ✅ organization_settings (NOU - consolidare VAT/commissions)
9. ✅ client_booking_quotes (EXTEND MINOR - add is_current)
10. ✅ quote_service_items (ADD catalog FK)
11. ✅ payment_transactions (REMODEL PARȚIAL - pence + FK + flows)
12. ✅ payment_refunds (NOU - separate refunds)
13. ✅ booking_financial_snapshots (CLARIFICAT scope)
14. ✅ driver_payout_breakdowns (ADD assignment link)
15. ✅ manual_financial_adjustments (NOU - goodwill/penalties)

### TABELE AUXILIARY (2):

16. ✅ discount_campaigns
17. ✅ discount_applications

### TABELE LEGACY (3 - keep read-only):

18. 🔴 booking_pricing [DEPRECATE]
19. 🔴 booking_leg_pricing [DEPRECATE]
20. 🔴 pricing_config [MIGRATE → DEPRECATE]

### VIEWS (5):

21. ✅ v_active_pricing_version
22. ✅ v_pricing_vehicle_rates
23. ✅ v_pricing_time_rules
24. ✅ v_pricing_airport_fees
25. ✅ v_pricing_zone_fees

**TOTAL:** 20 tabele master/auxiliary + 3 legacy + 5 views = **28 entități**

---

## ✅ VALIDARE CORECTATĂ

### Corecții critice integrate:

✅ **Quote versioning** - deja corect UNIQUE(booking_id, version), doar add is_current  
✅ **Refunds separate** - payment_refunds tabel nou  
✅ **Payment flows** - payment_kind, sequence, parent pentru deposit/balance  
✅ **Service catalog unique** - doar per version, nu global  
✅ **Quote services** - FK la catalog pentru traceability  
✅ **Driver payout** - link la booking_assignment_new SSOT  
✅ **Org settings fallback** - documentat în comments  
✅ **Discounts separate** - sistemice vs promo/manual  
✅ **Manual adjustments** - tabel nou pentru exceptions  
✅ **Snapshot scope** - primary + secondary types clarified  
✅ **Payment pence** - consistency în tot sistemul

---

**NEXT:** Gap Analysis REAL bazat pe verificări DB + proiect
