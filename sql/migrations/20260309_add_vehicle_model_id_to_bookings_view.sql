-- Migration: Add vehicle_model_id to client_bookings_list_v2 view
-- Date: 2026-03-09
-- Purpose: Enable dashboard and booking list to display correct vehicle images per model (BMW vs Mercedes)

-- Drop existing view
DROP VIEW IF EXISTS client_bookings_list_v2;

-- Recreate view with vehicle_model_id column
CREATE VIEW client_bookings_list_v2 AS
SELECT DISTINCT ON (b.id) 
  b.id,
  b.reference,
  b.currency,
  b.status AS booking_status,
  b.booking_type,
  b.created_at,
  b.organization_id,
  b.customer_id,
  c.auth_user_id,
  bp.status AS payment_status,
  bp.amount_pence,
  bl.pickup_address,
  bl.dropoff_address,
  bl.scheduled_at,
  bl.vehicle_category_id,
  bl.vehicle_model_id        -- ADDED: Enable specific vehicle model identification
FROM bookings b
JOIN customers c ON (c.id = b.customer_id)
LEFT JOIN booking_payments bp ON (bp.booking_id = b.id)
LEFT JOIN booking_legs bl ON (bl.booking_id = b.id AND bl.leg_number = 1)
ORDER BY b.id, bp.created_at DESC NULLS LAST;
