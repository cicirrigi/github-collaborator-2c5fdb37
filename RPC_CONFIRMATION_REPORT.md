# 🔥 RPC CONFIRMATION REPORT - SURSA GĂSITĂ

**Data:** 2026-03-16 16:30
**Status:** PROBLEMĂ ACTIVĂ CONFIRMATĂ - SCRIE DATE GREȘITE ACUM

---

## ✅ CONFIRMARE: RPC VECHI ESTE ACTIV ȘI SCRIE GREȘIT

### **SURSA EXACTĂ:**

```
TRIGGER → RPC → DB Write (GREȘIT)

booking_payments.status = 'succeeded'
  ↓
TRIGGER: booking_payment_succeeded_snapshot (AFTER UPDATE/INSERT)
  ↓
FUNCTION: trg_booking_payment_succeeded_snapshot()
  ↓
APELEAZĂ: create_financial_snapshot_for_payment(payment_id, 'payment_succeeded')
  ↓
SCRIE în internal_booking_financials cu:
  - platform_fee_rate_bp := 3000 (30% HARDCODED!)
  - operator_fee_rate_bp := 0 (0% HARDCODED!)
```

---

## 🔥 COD EXACT DIN DB (HARDCODED GREȘIT)

### **RPC: create_financial_snapshot_for_payment**

```sql
DECLARE
  v_platform_fee_rate_bp int := 3000;  -- 🔥 HARDCODED 30%!
  v_operator_fee_rate_bp int := 0;     -- 🔥 HARDCODED 0%!

  v_gross int;
  v_vat_pence int := 0;                -- 🔥 HARDCODED 0!
  v_driver_payout_pence int := 0;
  v_vendor_cost_pence int := 0;
BEGIN
  -- Citește override-uri din bookings (dar default rămâne 30%, 0%)
  SELECT
    platform_fee_rate_bp_override,
    operator_fee_rate_bp_override
  INTO v_booking
  FROM bookings
  WHERE id = v_payment.booking_id;

  -- Override (dar majoritatea booking-uri NU au override!)
  v_platform_fee_rate_bp := coalesce(v_booking.platform_fee_rate_bp_override, v_platform_fee_rate_bp);
  v_operator_fee_rate_bp := coalesce(v_booking.operator_fee_rate_bp_override, v_operator_fee_rate_bp);

  -- Calculează fees GREȘIT (30% + 0%)
  v_platform_fee_pence := round(v_gross * (v_platform_fee_rate_bp / 10000.0))::int;
  v_operator_fee_pence := round(v_gross * (v_operator_fee_rate_bp / 10000.0))::int;

  -- INSERT în internal_booking_financials
  INSERT INTO internal_booking_financials (
    booking_id,
    platform_fee_rate_bp,  -- 3000 (30%)
    operator_fee_rate_bp,  -- 0 (0%)
    platform_fee_pence,
    operator_fee_pence,
    ...
  ) VALUES (...);
END;
```

---

## 🔥 TRIGGER EXACT (DECLANȘARE AUTOMATĂ)

### **Trigger 1: booking_payment_succeeded_snapshot**

```sql
CREATE TRIGGER booking_payment_succeeded_snapshot
AFTER UPDATE ON booking_payments
FOR EACH ROW
EXECUTE FUNCTION trg_booking_payment_succeeded_snapshot();
```

```sql
-- Function: trg_booking_payment_succeeded_snapshot
BEGIN
  -- Case 1: INSERT direct cu succeeded
  IF (tg_op = 'INSERT') THEN
    IF new.status = 'succeeded' THEN
      PERFORM public.create_financial_snapshot_for_payment(new.id, 'payment_succeeded');
    END IF;
    RETURN new;
  END IF;

  -- Case 2: UPDATE către succeeded
  IF (tg_op = 'UPDATE')
     AND old.status IS DISTINCT FROM new.status
     AND new.status = 'succeeded' THEN
    PERFORM public.create_financial_snapshot_for_payment(new.id, 'payment_succeeded');
  END IF;

  RETURN new;
END;
```

### **Trigger 2: trg_booking_payments_fee_finalized**

```sql
CREATE TRIGGER trg_booking_payments_fee_finalized
AFTER UPDATE ON booking_payments
FOR EACH ROW
EXECUTE FUNCTION trg_create_fee_finalized_snapshot();
```

```sql
-- Function: trg_create_fee_finalized_snapshot
DECLARE
  v_old_fee text;
  v_new_fee text;
BEGIN
  v_old_fee := coalesce(old.metadata->>'stripe_fee_pence', '');
  v_new_fee := coalesce(new.metadata->>'stripe_fee_pence', '');

  -- Rulează doar când fee apare (din gol → are valoare)
  IF (v_old_fee = '' OR v_old_fee IS NULL)
     AND (v_new_fee <> '' AND v_new_fee IS NOT NULL) THEN
    PERFORM public.create_financial_snapshot_for_payment(new.id, 'payment_fee_finalized');
  END IF;

  RETURN new;
END;
```

---

## 🎯 FLOW EXACT - CUM SE DECLANȘEAZĂ

### **Path 1: Payment Succeeded (59 financials)**

```
1. Stripe webhook → payment_intent.succeeded
   ↓
2. Frontend /api/stripe/webhook/route.ts
   ↓
3. RPC apply_stripe_payment_event SAU
   Direct UPDATE booking_payments SET status = 'succeeded'
   ↓
4. TRIGGER booking_payment_succeeded_snapshot se DECLANȘEAZĂ AUTOMAT
   ↓
5. Apelează create_financial_snapshot_for_payment(payment_id, 'payment_succeeded')
   ↓
6. SCRIE în internal_booking_financials cu 30%, 0% GREȘIT
```

### **Path 2: Fee Finalized (42 financials)**

```
1. Stripe webhook → charge.updated
   ↓
2. Frontend /api/stripe/webhook/route.ts
   ↓
3. Retrieve balance_transaction de la Stripe API
   ↓
4. UPDATE booking_payments.metadata = { stripe_fee_pence: 123 }
   ↓
5. TRIGGER trg_booking_payments_fee_finalized se DECLANȘEAZĂ AUTOMAT
   ↓
6. Apelează create_financial_snapshot_for_payment(payment_id, 'payment_fee_finalized')
   ↓
7. SCRIE AGAIN în internal_booking_financials (versiune nouă) cu 30%, 0% GREȘIT
```

---

## 📊 AUDIT DATABASE - CONFIRMARE PAGUBĂ

### **Breakdown per pricing_source:**

```sql
-- TOTAL: 114 financials

-- ✅ CORECTE (10% platform):
pricing_source: 'pricing_engine_v2', platform_fee_rate_bp: 1000 → 2 financials
pricing_source: 'quote_snapshot', platform_fee_rate_bp: 1000 → 2 financials
Total corect: 4 financials (3.5%)

-- ⚠️ UNKNOWN (20% - de unde?):
pricing_source: 'manual_injected', platform_fee_rate_bp: 2000 → 3 financials

-- 🔥 GREȘITE (30% platform):
pricing_source: 'payment_succeeded', platform_fee_rate_bp: 3000 → 59 financials
pricing_source: 'payment_fee_finalized', platform_fee_rate_bp: 3000 → 42 financials
pricing_source: 'backfill_payment_succeeded', platform_fee_rate_bp: 3000 → 6 financials
Total greșit: 107 financials (93.8%!)
```

### **Timeline:**

```
Primul financial greșit: 2026-02-26 03:04:53 (18 zile în urmă)
Ultimul financial greșit: 2026-03-14 00:56:02 (2 zile în urmă!)
Ultimul financial corect: 2026-03-16 14:03:08 (azi - din Backend nou)
```

---

## 🔍 FRONTEND - NU APELEAZĂ DIRECT RPC VECHI

### **Verificare completă:**

```typescript
// ❌ NU există în frontend vantage-lane-2.0:
.rpc('create_financial_snapshot_for_booking') → 0 matches
.rpc('create_financial_snapshot_for_payment') → 0 matches

// ✅ Ce EXISTĂ în frontend:
.rpc('create_booking_with_legs') → /api/bookings/route.ts
.rpc('apply_stripe_payment_event') → /api/stripe/webhook/route.ts
.rpc('create_payment_intent_record') → /lib/supabase/rpc/payment.rpc.ts
.rpc('create_billing_profile') → /features/account/hooks/useBilling.ts
```

### **Webhook flow actual:**

```typescript
// src/app/api/stripe/webhook/route.ts:95-142

if (useWebhookRpc) {
  // NEW PATH: apelează apply_stripe_payment_event
  // NU apelează create_financial_snapshot
  const rpcResult = await applyStripePaymentEvent(supabase, {
    stripe_event_id: event.id,
    event_type: 'payment_intent.succeeded',
    ...
  });
} else {
  // OLD PATH: direct UPDATE booking_payments
  await supabase
    .from('booking_payments')
    .update({ status: 'succeeded' })  // ← TRIGGER SE DECLANȘEAZĂ AICI!
    .eq('stripe_payment_intent_id', paymentIntent.id);
}
```

**IMPORTANT:**

- apply_stripe_payment_event RPC NU apelează create_financial_snapshot
- DAR modifică booking_payments.status = 'succeeded'
- TRIGGER-ul se declanșează AUTOMAT la UPDATE
- Apelează RPC vechi cu 30% hardcoded

---

## ❌ DE CE NU CITEȘTE DIN organization_settings?

### **RPC vechi:**

```sql
-- ❌ NU citește din organization_settings!
v_platform_fee_rate_bp int := 3000;  -- HARDCODED
v_operator_fee_rate_bp int := 0;     -- HARDCODED

-- Citește doar override-uri din bookings (dacă există)
SELECT platform_fee_rate_bp_override, operator_fee_rate_bp_override
FROM bookings
WHERE id = v_payment.booking_id;

-- Majoritatea booking-uri NU au override → folosește 3000, 0
```

### **Backend nou (CORECT):**

```typescript
// Backend-VantageLane-/src/services/FinancialSnapshotService.ts

// ✅ Citește din organization_settings
const { data: settings } = await supabase
  .from('organization_settings')
  .select('platform_commission_pct, operator_commission_pct')
  .eq('organization_id', organizationId)
  .single();

// ✅ Folosește valori corecte (0.10, 0.09)
const platformFeePence = Math.round(subtotalExVatPence * settings.platform_commission_pct);
```

---

## 🎯 CONFIRMARE FINALĂ

### **ÎNTREBĂRILE USER:**

**Q1: Este RPC-ul vechi apelat?**
✅ **DA** - prin 2 TRIGGERS pe booking_payments

**Q2: Când se apelează?**
✅ Când booking_payments.status devine 'succeeded' (AUTOMAT)
✅ Când booking_payments.metadata.stripe_fee_pence apare (AUTOMAT)

**Q3: De unde vine apelul?**
✅ NU din frontend direct
✅ Din TRIGGERS database care se declanșează la UPDATE booking_payments
✅ Frontend modifică booking_payments → trigger se declanșează → RPC greșit

**Q4: Câte date greșite?**
✅ 107 din 114 financials (93.8%)
✅ Ultimul scris: acum 2 zile (2026-03-14)
✅ Încă ACTIV

**Q5: De ce scrie greșit?**
✅ platform_fee_rate_bp := 3000 (30% HARDCODED în RPC)
✅ operator_fee_rate_bp := 0 (0% HARDCODED în RPC)
✅ NU citește din organization_settings
✅ Citește doar override-uri din bookings (majoritatea NU au)

---

## 🚨 DUAL WRITE PATH CONFIRMAT

### **Path 1: RPC vechi (GREȘIT - 30%, 0%)**

```
Trigger → create_financial_snapshot_for_payment
Folosit: AUTOMAT la payment success
Rate: 30% platform, 0% operator (HARDCODED)
Financials: 107 (93.8%)
Status: ACTIV ACUM
```

### **Path 2: Backend nou (CORECT - 10%, 9%)**

```
Manual call → FinancialSnapshotService.createFinancialSnapshot()
Folosit: Manual din Backend test scripts
Rate: 10% platform, 9% operator (din organization_settings)
Financials: 4 (3.5%)
Status: Folosit doar în teste
```

---

## 📋 ACȚIUNI NECESARE URGENTE

### **PRIORITATE 1 - DISABLE TRIGGERS:**

```sql
-- Option 1: Disable triggers complet
ALTER TABLE booking_payments DISABLE TRIGGER booking_payment_succeeded_snapshot;
ALTER TABLE booking_payments DISABLE TRIGGER booking_payment_succeeded_snapshot_insert;
ALTER TABLE booking_payments DISABLE TRIGGER trg_booking_payments_fee_finalized;

-- Option 2: DROP triggers
DROP TRIGGER IF EXISTS booking_payment_succeeded_snapshot ON booking_payments;
DROP TRIGGER IF EXISTS booking_payment_succeeded_snapshot_insert ON booking_payments;
DROP TRIGGER IF EXISTS trg_booking_payments_fee_finalized ON booking_payments;
```

### **PRIORITATE 2 - FIX SAU DELETE RPC:**

```sql
-- Option 1: DROP RPC complet
DROP FUNCTION IF EXISTS create_financial_snapshot_for_payment(uuid, text);
DROP FUNCTION IF EXISTS create_financial_snapshot_for_booking(uuid, int, text, text);

-- Option 2: UPDATE RPC să citească din organization_settings
-- (mai complex - necesită refactor RPC complet)
```

### **PRIORITATE 3 - AUDIT FINANCIALS:**

```sql
-- Marchează financials greșite
UPDATE internal_booking_financials
SET pricing_source = 'DEPRECATED_30PCT_HARDCODED'
WHERE platform_fee_rate_bp = 3000;

-- SAU creează tabel de reconciliere
CREATE TABLE financial_reconciliation AS
SELECT
  id,
  booking_id,
  platform_fee_rate_bp,
  pricing_source,
  created_at,
  'needs_recalc' as status
FROM internal_booking_financials
WHERE platform_fee_rate_bp = 3000;
```

### **PRIORITATE 4 - DEPLOY BACKEND NOU:**

Declară oficial:

- ✅ FinancialSnapshotService = singur writer permis
- ❌ RPC vechi = deprecated/disabled
- 📝 Documentation update

---

## ✅ CONCLUZIE

**PROBLEMA CONFIRMATĂ ȘI ACTIVĂ:**

1. ✅ RPC vechi scrie DATE GREȘITE (30% în loc de 10%)
2. ✅ Apelat AUTOMAT prin TRIGGERS (nu direct din cod)
3. ✅ 107 din 114 financials afectate (93.8%)
4. ✅ Ultimul financial greșit: acum 2 zile
5. ✅ Dual write path confirmat (RPC vechi vs Backend nou)

**NEXT STEP:**
Disable triggers IMEDIAT pentru a opri write-urile greșite.
