-- =========================================================
-- RADICAL CLEANUP: Keep Last 10 Bookings + Service Items Canonization
-- =========================================================
-- Date: 2026-03-16
-- Description:
--   1. Keep ONLY last 10 bookings (most recent by created_at)
--   2. Delete ALL older bookings and their dependencies
--   3. Keep only 21 official service items (18 kebab-case + 3 preferences)
--   4. Deactivate all duplicate service items
-- =========================================================

BEGIN;

-- =========================================================
-- STEP 1: DELETE OLD BOOKINGS & ALL DEPENDENCIES
-- =========================================================
-- Keep only these 10 most recent booking IDs:
-- CB-000201, CB-000200, CB-000199, CB-000198, CB-000197,
-- CB-000196, CB-000195, CB-000194, CB-000193, E2E-TEST-1773669786882

-- Delete stripe_events for old bookings
DELETE FROM stripe_events
WHERE booking_id NOT IN (
  '2b74d61a-7320-4da6-b624-28fec58f45fd', -- CB-000201
  '4e1ed071-c5f3-46c5-9ed3-ae1beb6cb384', -- CB-000200
  '37d86b96-14d0-40f7-9879-c812d468e168', -- CB-000199
  '21dcbe82-a071-4541-b817-e2124829d837', -- CB-000198
  '7107f579-47bc-4b28-9859-31933706d965', -- CB-000197
  'eccb4c6b-bc6b-4673-8ab7-5d4fa97f0416', -- CB-000196
  '96586625-c3b8-4608-878e-470feb2fda3f', -- CB-000195
  '48e18b0d-c234-462d-b264-594befce4be3', -- CB-000194
  'd4ff081b-a415-4257-b456-ab2f972f7e29', -- CB-000193
  '6ccb35f9-47f3-4f8e-828d-b714a8feeb10'  -- E2E-TEST
);

-- Delete booking_payments for old bookings
DELETE FROM booking_payments
WHERE booking_id NOT IN (
  '2b74d61a-7320-4da6-b624-28fec58f45fd',
  '4e1ed071-c5f3-46c5-9ed3-ae1beb6cb384',
  '37d86b96-14d0-40f7-9879-c812d468e168',
  '21dcbe82-a071-4541-b817-e2124829d837',
  '7107f579-47bc-4b28-9859-31933706d965',
  'eccb4c6b-bc6b-4673-8ab7-5d4fa97f0416',
  '96586625-c3b8-4608-878e-470feb2fda3f',
  '48e18b0d-c234-462d-b264-594befce4be3',
  'd4ff081b-a415-4257-b456-ab2f972f7e29',
  '6ccb35f9-47f3-4f8e-828d-b714a8feeb10'
);

-- Delete client_leg_quotes for old bookings
DELETE FROM client_leg_quotes
WHERE booking_id NOT IN (
  '2b74d61a-7320-4da6-b624-28fec58f45fd',
  '4e1ed071-c5f3-46c5-9ed3-ae1beb6cb384',
  '37d86b96-14d0-40f7-9879-c812d468e168',
  '21dcbe82-a071-4541-b817-e2124829d837',
  '7107f579-47bc-4b28-9859-31933706d965',
  'eccb4c6b-bc6b-4673-8ab7-5d4fa97f0416',
  '96586625-c3b8-4608-878e-470feb2fda3f',
  '48e18b0d-c234-462d-b264-594befce4be3',
  'd4ff081b-a415-4257-b456-ab2f972f7e29',
  '6ccb35f9-47f3-4f8e-828d-b714a8feeb10'
);

-- Delete booking_line_items for old bookings
DELETE FROM booking_line_items
WHERE booking_id NOT IN (
  '2b74d61a-7320-4da6-b624-28fec58f45fd',
  '4e1ed071-c5f3-46c5-9ed3-ae1beb6cb384',
  '37d86b96-14d0-40f7-9879-c812d468e168',
  '21dcbe82-a071-4541-b817-e2124829d837',
  '7107f579-47bc-4b28-9859-31933706d965',
  'eccb4c6b-bc6b-4673-8ab7-5d4fa97f0416',
  '96586625-c3b8-4608-878e-470feb2fda3f',
  '48e18b0d-c234-462d-b264-594befce4be3',
  'd4ff081b-a415-4257-b456-ab2f972f7e29',
  '6ccb35f9-47f3-4f8e-828d-b714a8feeb10'
);

-- Delete booking_legs for old bookings
DELETE FROM booking_legs
WHERE booking_id NOT IN (
  '2b74d61a-7320-4da6-b624-28fec58f45fd',
  '4e1ed071-c5f3-46c5-9ed3-ae1beb6cb384',
  '37d86b96-14d0-40f7-9879-c812d468e168',
  '21dcbe82-a071-4541-b817-e2124829d837',
  '7107f579-47bc-4b28-9859-31933706d965',
  'eccb4c6b-bc6b-4673-8ab7-5d4fa97f0416',
  '96586625-c3b8-4608-878e-470feb2fda3f',
  '48e18b0d-c234-462d-b264-594befce4be3',
  'd4ff081b-a415-4257-b456-ab2f972f7e29',
  '6ccb35f9-47f3-4f8e-828d-b714a8feeb10'
);

-- Delete old bookings (keep only last 10)
DELETE FROM bookings
WHERE id NOT IN (
  '2b74d61a-7320-4da6-b624-28fec58f45fd',
  '4e1ed071-c5f3-46c5-9ed3-ae1beb6cb384',
  '37d86b96-14d0-40f7-9879-c812d468e168',
  '21dcbe82-a071-4541-b817-e2124829d837',
  '7107f579-47bc-4b28-9859-31933706d965',
  'eccb4c6b-bc6b-4673-8ab7-5d4fa97f0416',
  '96586625-c3b8-4608-878e-470feb2fda3f',
  '48e18b0d-c234-462d-b264-594befce4be3',
  'd4ff081b-a415-4257-b456-ab2f972f7e29',
  '6ccb35f9-47f3-4f8e-828d-b714a8feeb10'
);

-- =========================================================
-- STEP 2: DEACTIVATE ALL SERVICE_ITEMS EXCEPT OFFICIAL 21
-- =========================================================

-- First, deactivate ALL items
UPDATE service_items SET is_active = false;

-- Then, activate ONLY the official 21 items
UPDATE service_items
SET is_active = true
WHERE id IN (
  -- ✅ INCLUDED SERVICES (9 items) - kebab-case
  'meet-greet',
  'onboard-wifi',
  'phone-chargers',
  'refreshments',
  'luggage-assistance',
  'pet-friendly',
  'airport-wait-time',
  'extra-stops',
  'priority-support',

  -- ✅ PAID ADD-ONS (5 items) - kebab-case
  'flowers-standard',
  'flowers-exclusive',
  'champagne-moet',
  'champagne-dom-perignon',
  'security-escort',

  -- ✅ PREMIUM FEATURES (4 items) - kebab-case
  'paparazzi-safe-mode',
  'front-seat-request',
  'comfort-ride-mode',
  'personal-luggage-privacy',

  -- ✅ TRIP PREFERENCES (3 items) - single-word
  'music',
  'temperature',
  'communication'
);

-- =========================================================
-- VERIFICATION QUERIES (run these after migration)
-- =========================================================

-- Should return 0 (all test bookings deleted)
-- SELECT COUNT(*) FROM bookings WHERE reference >= 'CB-000196' OR reference LIKE 'TEST-%' OR reference LIKE 'E2E-%';

-- Should return 21 (only official items active)
-- SELECT COUNT(*) FROM service_items WHERE is_active = true;

-- Should list the 21 official items
-- SELECT id, name, item_group, is_active FROM service_items WHERE is_active = true ORDER BY item_group, id;

COMMIT;
