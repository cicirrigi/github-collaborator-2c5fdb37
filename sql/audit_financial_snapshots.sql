-- ============================================================================
-- Audit Query: Financial Snapshots Side-by-Side Comparison
-- Purpose: Compare old (30% platform) vs new (10% platform) snapshots
-- ============================================================================

-- Query 1: Side-by-side comparison of all snapshots
SELECT 
  id,
  booking_id,
  version,
  pricing_source,
  
  -- Financial breakdown
  gross_amount_pence,
  platform_fee_rate_bp,
  operator_fee_rate_bp,
  platform_fee_pence,
  operator_fee_pence,
  driver_payout_pence,
  
  -- Metadata
  line_items->>'calculation_method' as calc_method,
  
  -- Classification
  CASE 
    WHEN platform_fee_rate_bp = 3000 THEN '❌ OLD (30%)'
    WHEN platform_fee_rate_bp = 1000 THEN '✅ NEW (10%)'
    WHEN platform_fee_rate_bp = 2000 THEN '⚠️ UNKNOWN (20%)'
    ELSE '? OTHER'
  END as snapshot_type,
  
  created_at
FROM internal_booking_financials
ORDER BY created_at DESC
LIMIT 50;

-- ============================================================================

-- Query 2: Count by snapshot type
SELECT 
  CASE 
    WHEN platform_fee_rate_bp = 3000 THEN 'OLD (30% platform / 0% operator)'
    WHEN platform_fee_rate_bp = 1000 THEN 'NEW (10% platform / 9% operator)'
    WHEN platform_fee_rate_bp = 2000 THEN 'UNKNOWN (20% platform)'
    ELSE 'OTHER'
  END as snapshot_type,
  platform_fee_rate_bp,
  operator_fee_rate_bp,
  COUNT(*) as count,
  MIN(created_at) as first_created,
  MAX(created_at) as last_created
FROM internal_booking_financials
GROUP BY platform_fee_rate_bp, operator_fee_rate_bp
ORDER BY platform_fee_rate_bp DESC;

-- ============================================================================

-- Query 3: Detailed breakdown for new snapshots (after migration)
SELECT 
  ibf.id,
  ibf.booking_id,
  bp.stripe_payment_intent_id,
  
  -- Amounts
  ibf.gross_amount_pence,
  ibf.platform_fee_pence,
  ibf.operator_fee_pence,
  ibf.driver_payout_pence,
  
  -- Rates
  ibf.platform_fee_rate_bp,
  ibf.operator_fee_rate_bp,
  
  -- Validation: fees should sum to gross (minus processor fee if any)
  (ibf.platform_fee_pence + ibf.operator_fee_pence + ibf.driver_payout_pence) as sum_of_fees,
  ibf.gross_amount_pence - (ibf.platform_fee_pence + ibf.operator_fee_pence + ibf.driver_payout_pence) as difference,
  
  -- Metadata
  ibf.pricing_source,
  ibf.line_items->>'calculation_method' as calc_method,
  ibf.line_items->>'had_booking_override' as had_override,
  
  ibf.created_at
FROM internal_booking_financials ibf
LEFT JOIN booking_payments bp ON bp.id = ibf.booking_payment_id
WHERE ibf.created_at > NOW() - INTERVAL '24 hours'
ORDER BY ibf.created_at DESC;

-- ============================================================================

-- Query 4: Test specific payment (replace <payment_id> with actual ID)
-- SELECT 
--   id,
--   booking_id,
--   version,
--   gross_amount_pence,
--   platform_fee_rate_bp,
--   operator_fee_rate_bp,
--   platform_fee_pence,
--   operator_fee_pence,
--   driver_payout_pence,
--   pricing_source,
--   line_items,
--   created_at
-- FROM internal_booking_financials
-- WHERE booking_payment_id = '<payment_id>'
-- ORDER BY version;

-- ============================================================================
