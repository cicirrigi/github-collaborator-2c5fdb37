-- Migration: Create customer_dashboard_v1 view
-- Created: 2026-03-08
-- Purpose: Dashboard overview with loyalty tiers for customer accounts

-- Drop existing view if exists
DROP VIEW IF EXISTS customer_dashboard_v1;

-- Create comprehensive dashboard view for customers
CREATE OR REPLACE VIEW customer_dashboard_v1 AS
SELECT 
    c.id as customer_id,
    c.auth_user_id,
    c.email,
    c.first_name,
    c.last_name,
    c.phone,
    c.profile_photo_url,
    c.created_at as member_since,
    c.is_active,
    
    -- Booking statistics
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT CASE WHEN b.status = 'COMPLETED' THEN b.id END) as completed_rides,
    COUNT(DISTINCT CASE WHEN b.status = 'CONFIRMED' THEN b.id END) as upcoming_rides,
    COUNT(DISTINCT CASE WHEN b.status = 'PENDING_PAYMENT' THEN b.id END) as pending_payment_count,
    COUNT(DISTINCT CASE WHEN b.status = 'CANCELLED' THEN b.id END) as cancelled_rides,
    
    -- Payment statistics
    COALESCE(SUM(CASE WHEN bp.status = 'succeeded' THEN bp.amount_pence ELSE 0 END), 0) as total_spent_pence,
    COALESCE(SUM(CASE WHEN bp.status = 'succeeded' THEN bp.amount_pence ELSE 0 END), 0) / 100.0 as total_spent_pounds,
    
    -- Loyalty tier calculation based on total spent
    -- Tiers: bronze (£0+), silver (£1,000+), gold (£5,000+), platinum (£15,000+)
    CASE 
        WHEN COALESCE(SUM(CASE WHEN bp.status = 'succeeded' THEN bp.amount_pence ELSE 0 END), 0) / 100.0 >= 15000 THEN 'platinum'
        WHEN COALESCE(SUM(CASE WHEN bp.status = 'succeeded' THEN bp.amount_pence ELSE 0 END), 0) / 100.0 >= 5000 THEN 'gold'
        WHEN COALESCE(SUM(CASE WHEN bp.status = 'succeeded' THEN bp.amount_pence ELSE 0 END), 0) / 100.0 >= 1000 THEN 'silver'
        ELSE 'bronze'
    END as loyalty_tier,
    
    -- Last activity
    MAX(b.created_at) as last_booking_date,
    MAX(CASE WHEN b.status = 'COMPLETED' THEN b.created_at END) as last_completed_ride_date,
    
    -- Customer preferences (if exists)
    cp.temperature_preference,
    cp.music_preference,
    cp.communication_style,
    cp.pet_friendly_default

FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.id AND b.deleted_at IS NULL
LEFT JOIN booking_payments bp ON bp.booking_id = b.id AND bp.deleted_at IS NULL
LEFT JOIN customer_preferences cp ON cp.customer_id = c.id AND cp.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY 
    c.id, 
    c.auth_user_id,
    c.email,
    c.first_name,
    c.last_name,
    c.phone,
    c.profile_photo_url,
    c.created_at,
    c.is_active,
    cp.temperature_preference,
    cp.music_preference,
    cp.communication_style,
    cp.pet_friendly_default;

-- Comment on view
COMMENT ON VIEW customer_dashboard_v1 IS 'Dashboard overview for customer accounts with loyalty tier calculation. Inherits RLS from customers table (auth_user_id = auth.uid()).';

-- Grant access to authenticated users
GRANT SELECT ON customer_dashboard_v1 TO authenticated;
