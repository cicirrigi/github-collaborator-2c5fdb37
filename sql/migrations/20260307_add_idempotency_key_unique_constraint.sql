-- Migration: Add UNIQUE constraint on booking_payments.idempotency_key
-- Date: 2026-03-07
-- Purpose: Ensure idempotency protection for payment intent creation
-- Related: Wave 1A RPC preparation for payment flow

-- Add UNIQUE constraint on idempotency_key to prevent duplicate payment records
ALTER TABLE booking_payments
ADD CONSTRAINT booking_payments_idempotency_key_key
UNIQUE (idempotency_key);

-- NOTES:
-- 1. This constraint is essential for idempotent payment creation
-- 2. Existing constraint on stripe_payment_intent_id remains (prevents PI reuse)
-- 3. Multiple attempts per booking are allowed (different idempotency_keys)
-- 4. Verified no duplicate idempotency_keys exist before applying constraint

-- VERIFICATION QUERY (run before applying):
-- SELECT idempotency_key, count(*)
-- FROM booking_payments
-- WHERE idempotency_key IS NOT NULL
-- GROUP BY idempotency_key
-- HAVING count(*) > 1;
-- Expected result: 0 rows (no duplicates)
