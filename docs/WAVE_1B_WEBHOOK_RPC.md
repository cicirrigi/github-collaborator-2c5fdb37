# Wave 1B: Stripe Webhook RPC Processing

**Status:** ✅ Production Ready  
**Date:** March 7, 2026  
**Test Booking:** CB-000157

---

## 🎯 Overview

Wave 1B implements atomic, idempotent Stripe webhook processing using PostgreSQL RPC functions. This replaces direct database operations in the webhook route with a single RPC call that handles all event processing, status transitions, and error handling.

---

## 🏗️ Architecture

### Components

1. **Webhook Route** (`src/app/api/stripe/webhook/route.ts`)
   - Verifies Stripe signatures
   - Routes to RPC or old flow based on `USE_WEBHOOK_RPC` flag
   - Handles errors and returns appropriate HTTP status codes

2. **TypeScript Wrapper** (`src/lib/supabase/rpc/payment.rpc.ts`)
   - Type-safe interface to `apply_stripe_payment_event` RPC
   - Passes through RPC responses unchanged
   - No message transformation

3. **SQL RPC Function** (`sql/migrations/20260307_create_apply_stripe_payment_event_rpc.sql`)
   - Atomic webhook event processing
   - Idempotency via `stripe_events.stripe_event_id` unique constraint
   - Defensive status transitions (no downgrades)
   - Structured JSONB return values

4. **Trigger Fix** (`sql/migrations/20260307_fix_booking_lock_trigger.sql`)
   - Allows legitimate payment confirmation transitions
   - Preserves lock protection for other updates

---

## 🔑 Key Features

### Idempotency

- RPC inserts event into `stripe_events` with `ON CONFLICT DO NOTHING`
- Returns `already_processed` if event exists and is processed
- No duplicate processing even with Stripe retries

### Defensive Status Transitions

- **Payment Succeeded:** Only updates from `pending/processing/authorized` to `succeeded`
- **Payment Failed:** Cannot downgrade `succeeded` payments
- **Payment Canceled:** Cannot downgrade `succeeded` payments
- **Booking Confirmation:** Only from `PENDING_PAYMENT/PAYMENT_FAILED` to `CONFIRMED`
- **Terminal States:** `CONFIRMED/IN_PROGRESS/COMPLETED` bookings protected

### Error Handling

- RPC failures return structured error JSONB
- Webhook route returns 500 on errors (triggers Stripe retry)
- Old flow tracks errors in `processing_error` field
- No more silent 200 responses on failures

### Trigger Protection

- `block_booking_updates_when_locked()` allows payment confirmation
- Allowlist for `PENDING_PAYMENT → CONFIRMED` transition
- Allowlist for `PAYMENT_FAILED → CONFIRMED` (retry success)
- Lock protection preserved for other updates

---

## 📊 Flow Diagram

```
Stripe Webhook Event
       ↓
Verify Signature
       ↓
Check Feature Flag
       ↓
   ┌───┴────┐
   │        │
RPC Mode   Old Flow
   │        │
   ↓        ↓
Apply RPC  Direct DB Ops
   │        │
   ↓        ↓
Handle     Track Errors
Result     │
   │       ↓
   │    Mark Processed
   │       │
   └───┬───┘
       ↓
Return 200/500
```

---

## 🔧 Configuration

### Environment Variables

```env
# Enable Wave 1B RPC webhook processing
USE_WEBHOOK_RPC=true

# Supabase credentials (required)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe credentials (required)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Feature Flag

Set `USE_WEBHOOK_RPC=true` in `.env.local` to enable RPC mode.

**Default:** `false` (old flow for backwards compatibility)

---

## 🧪 Testing

### Test Booking Flow

1. Create booking at `http://localhost:3002`
2. Complete payment with test card `4242 4242 4242 4242`
3. Verify webhook processing in logs
4. Check booking status in database

### Expected Logs (RPC Mode)

```
🔍 USE_WEBHOOK_RPC runtime = true
🔍 Webhook RPC enabled? true
💰 Payment succeeded: pi_xxx
✅ Running NEW webhook RPC flow for payment_intent.succeeded
✅ Payment processed successfully via RPC: <booking_id>
```

### Database Verification

```sql
-- 1. Check booking status
SELECT id, reference, status, updated_at
FROM bookings
WHERE reference = 'CB-000157';
-- Expected: status = 'CONFIRMED'

-- 2. Check payment details
SELECT status, captured_at, stripe_charge_id
FROM booking_payments
WHERE booking_id = '<booking_id>';
-- Expected: status = 'succeeded', captured_at populated

-- 3. Check stripe events
SELECT event_type, processed_at, processing_error
FROM stripe_events
WHERE booking_id = '<booking_id>'
ORDER BY received_at DESC;
-- Expected: processed_at populated, processing_error = null
```

---

## 🐛 Troubleshooting

### Booking Stuck in PENDING_PAYMENT

**Symptoms:** Booking remains `PENDING_PAYMENT` after successful payment

**Causes:**

1. Trigger blocking payment confirmation (fixed in Wave 1B)
2. Webhook not reaching server (check Stripe CLI)
3. RPC returning error (check `stripe_events.processing_error`)

**Solutions:**

1. Apply trigger fix migration: `20260307_fix_booking_lock_trigger.sql`
2. Start Stripe CLI: `stripe listen --forward-to localhost:3002/api/stripe/webhook`
3. Check webhook route logs for RPC errors

### RPC Returns "Booking is locked"

**Cause:** Old trigger version blocking legitimate transitions

**Solution:** Apply trigger fix migration

### Webhook Returns 500

**Check:**

1. Server logs for RPC error details
2. `stripe_events.processing_error` field
3. Booking/payment exists and is in valid state

---

## 📈 Performance

### Metrics (Booking CB-000157)

- **Webhook Processing:** 8 seconds (creation to confirmation)
- **RPC Execution:** Sub-second
- **UI Polling:** 1 attempt (instant detection)
- **Auto-redirect:** Immediate after status update

### Scalability

- **Atomic Operations:** All DB updates in single transaction
- **Connection Pooling:** Service role client per webhook request
- **Idempotency:** Zero duplicate processing overhead
- **Lock Protection:** Concurrent webhook safety

---

## 🔐 Security

### Authentication

- Stripe signature verification (SHA256 HMAC)
- Supabase service role key (bypasses RLS)
- No user-facing credentials

### Data Protection

- Webhook events stored with full audit trail
- Payment IDs logged for reconciliation
- Error messages sanitized in responses

### Rate Limiting

- Handled by Stripe (automatic retry with exponential backoff)
- No custom rate limiting needed

---

## 🚀 Deployment Checklist

- [ ] Apply SQL migrations in order:
  - [ ] `20260307_create_apply_stripe_payment_event_rpc.sql`
  - [ ] `20260307_fix_booking_lock_trigger.sql`
- [ ] Set `USE_WEBHOOK_RPC=true` in production environment
- [ ] Configure Stripe webhook endpoint in dashboard
- [ ] Verify webhook secret matches `STRIPE_WEBHOOK_SECRET`
- [ ] Test with live mode test payment
- [ ] Monitor `stripe_events.processing_error` for issues
- [ ] Set up alerts for webhook 500 responses

---

## 📚 Related Documentation

- **Wave 1A:** Payment Intent Record Creation RPC
- **Stripe Webhooks:** https://stripe.com/docs/webhooks
- **Supabase RPC:** https://supabase.com/docs/guides/database/functions

---

## 🏆 Success Criteria

✅ Bookings auto-confirm after successful payment  
✅ Webhook events process atomically via RPC  
✅ UI auto-redirects to Step 4 without manual intervention  
✅ No false 200 responses on processing errors  
✅ Proper Stripe retry behavior on failures  
✅ Database consistency maintained (no partial updates)  
✅ Idempotency guarantees (no duplicate processing)

---

**Wave 1B Status:** Production Ready ✅
