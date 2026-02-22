-- 🔧 VANTAGE LANE BOOKING SYSTEM - SQL FIX PACK
-- Execute in Supabase SQL Editor for bulletproof booking system

-- ==========================================
-- 1. CRITICAL UNIQUE CONSTRAINTS
-- ==========================================

-- Prevent duplicate customers per auth user
ALTER TABLE customers 
ADD CONSTRAINT IF NOT EXISTS customers_auth_user_id_key UNIQUE (auth_user_id);

-- Prevent duplicate payment records per Stripe PaymentIntent
ALTER TABLE booking_payments 
ADD CONSTRAINT IF NOT EXISTS booking_payments_pi_key UNIQUE (stripe_payment_intent_id);

-- Prevent duplicate booking references (if using auto-generated references)
ALTER TABLE bookings 
ADD CONSTRAINT IF NOT EXISTS bookings_reference_key UNIQUE (reference);

-- ==========================================
-- 2. ESSENTIAL FOREIGN KEY CONSTRAINTS
-- ==========================================

-- Bookings -> Customers relationship
ALTER TABLE bookings 
ADD CONSTRAINT IF NOT EXISTS bookings_customer_id_fkey 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Booking legs -> Bookings relationship  
ALTER TABLE booking_legs 
ADD CONSTRAINT IF NOT EXISTS booking_legs_booking_id_fkey 
FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

-- Booking payments -> Bookings relationship
ALTER TABLE booking_payments 
ADD CONSTRAINT IF NOT EXISTS booking_payments_booking_id_fkey 
FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

-- Booking metadata -> Bookings relationship (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'booking_metadata') THEN
        ALTER TABLE booking_metadata 
        ADD CONSTRAINT IF NOT EXISTS booking_metadata_booking_id_fkey 
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;
    END IF;
END $$;

-- ==========================================
-- 3. MISSING COLUMNS (Add if not exist)
-- ==========================================

-- Add expires_at for abandoned booking cleanup
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ NULL;

-- Add trip_configuration_raw for full TripConfiguration storage
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS trip_configuration_raw JSONB NULL;

-- Add booking_type if missing (enum constraint)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_type_enum') THEN
        CREATE TYPE booking_type_enum AS ENUM (
            'oneway', 'return', 'hourly', 'daily', 'fleet', 'bespoke', 'events', 'corporate'
        );
    END IF;
END $$;

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_type booking_type_enum DEFAULT 'oneway';

-- Add payment_status enum if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
        CREATE TYPE payment_status_enum AS ENUM (
            'unpaid', 'pending', 'succeeded', 'failed', 'refunded', 'canceled'
        );
    END IF;
END $$;

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_status payment_status_enum DEFAULT 'pending';

-- Add booking status enum if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status_enum') THEN
        CREATE TYPE booking_status_enum AS ENUM (
            'NEW', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
        );
    END IF;
END $$;

ALTER TABLE bookings 
ALTER COLUMN status TYPE booking_status_enum USING status::booking_status_enum;

-- ==========================================
-- 4. PERFORMANCE INDEXES
-- ==========================================

-- High-frequency lookups
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Expiration cleanup queries
CREATE INDEX IF NOT EXISTS idx_bookings_expires_at ON bookings(expires_at) 
WHERE expires_at IS NOT NULL AND payment_status = 'pending';

-- Customer lookups
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id);

-- Booking legs lookups
CREATE INDEX IF NOT EXISTS idx_booking_legs_booking_id ON booking_legs(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_legs_scheduled_at ON booking_legs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_booking_legs_status ON booking_legs(status);

-- Payment lookups
CREATE INDEX IF NOT EXISTS idx_booking_payments_booking_id ON booking_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_payments_stripe_pi_id ON booking_payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_booking_payments_status ON booking_payments(status);

-- ==========================================
-- 5. DATA CLEANUP & VALIDATION
-- ==========================================

-- Set default currency for existing bookings
UPDATE bookings 
SET currency = 'GBP' 
WHERE currency IS NULL;

-- Set default source for existing bookings  
UPDATE bookings 
SET source = 'web' 
WHERE source IS NULL;

-- Set default booking_source for existing bookings (if column exists)
UPDATE bookings 
SET booking_source = 'web' 
WHERE booking_source IS NULL;

-- ==========================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on sensitive tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_legs ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bookings
CREATE POLICY IF NOT EXISTS "Users can view own bookings" ON bookings
FOR SELECT USING (
    customer_id IN (
        SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
);

-- Policy: Users can create bookings for themselves
CREATE POLICY IF NOT EXISTS "Users can create own bookings" ON bookings
FOR INSERT WITH CHECK (
    customer_id IN (
        SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
);

-- Policy: Users can view their own booking legs
CREATE POLICY IF NOT EXISTS "Users can view own booking legs" ON booking_legs
FOR SELECT USING (
    booking_id IN (
        SELECT b.id FROM bookings b 
        JOIN customers c ON b.customer_id = c.id 
        WHERE c.auth_user_id = auth.uid()
    )
);

-- Policy: Service role has full access (bypass RLS)
CREATE POLICY IF NOT EXISTS "Service role full access bookings" ON bookings
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role full access legs" ON booking_legs  
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role full access payments" ON booking_payments
FOR ALL USING (auth.role() = 'service_role');

-- ==========================================
-- 7. CLEANUP FUNCTION FOR ABANDONED BOOKINGS
-- ==========================================

CREATE OR REPLACE FUNCTION cleanup_abandoned_bookings()
RETURNS INTEGER 
LANGUAGE plpgsql
AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    -- Mark expired bookings as ABANDONED
    UPDATE bookings 
    SET 
        status = 'CANCELLED',
        payment_status = 'canceled',
        updated_at = NOW()
    WHERE 
        payment_status = 'pending'
        AND expires_at IS NOT NULL 
        AND expires_at < NOW()
        AND status NOT IN ('COMPLETED', 'CANCELLED');
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    -- Log cleanup action
    INSERT INTO audit_logs (action, table_name, details)
    VALUES (
        'CLEANUP_ABANDONED',
        'bookings', 
        jsonb_build_object('affected_count', affected_count)
    );
    
    RETURN affected_count;
END;
$$;

-- ==========================================
-- 8. VALIDATION CONSTRAINTS
-- ==========================================

-- Ensure positive amounts
ALTER TABLE bookings 
ADD CONSTRAINT IF NOT EXISTS bookings_amount_positive 
CHECK (amount_total_pence IS NULL OR amount_total_pence >= 0);

-- Ensure positive passenger counts
ALTER TABLE bookings 
ADD CONSTRAINT IF NOT EXISTS bookings_passenger_count_positive 
CHECK (passenger_count IS NULL OR passenger_count > 0);

-- Ensure positive bag counts
ALTER TABLE bookings 
ADD CONSTRAINT IF NOT EXISTS bookings_bag_count_positive 
CHECK (bag_count IS NULL OR bag_count >= 0);

-- Ensure positive leg amounts
ALTER TABLE booking_legs 
ADD CONSTRAINT IF NOT EXISTS booking_legs_amount_positive 
CHECK (leg_amount_pence IS NULL OR leg_amount_pence >= 0);

-- ==========================================
-- 9. AUDIT & LOGGING SETUP
-- ==========================================

-- Create audit trigger function if not exists
CREATE OR REPLACE FUNCTION audit_booking_changes()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- Only log significant changes
        IF OLD.status != NEW.status OR OLD.payment_status != NEW.payment_status THEN
            INSERT INTO audit_logs (
                action, 
                table_name, 
                record_id, 
                old_values, 
                new_values,
                user_id
            ) VALUES (
                TG_OP,
                TG_TABLE_NAME,
                NEW.id,
                to_jsonb(OLD),
                to_jsonb(NEW),
                COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
            );
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (
            action, 
            table_name, 
            record_id, 
            new_values,
            user_id
        ) VALUES (
            TG_OP,
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(NEW),
            COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;

-- Add audit triggers to critical tables
DROP TRIGGER IF EXISTS audit_bookings_trigger ON bookings;
CREATE TRIGGER audit_bookings_trigger
    AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION audit_booking_changes();

-- ==========================================
-- 10. FINAL VERIFICATION
-- ==========================================

-- Verify all constraints exist
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid IN ('bookings'::regclass, 'booking_legs'::regclass, 'booking_payments'::regclass)
    AND contype IN ('u', 'f', 'c')
ORDER BY conrelid, contype;

-- Verify all indexes exist
SELECT 
    schemaname,
    tablename, 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('bookings', 'booking_legs', 'booking_payments', 'customers')
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Success message
SELECT 'Vantage Lane Booking System - SQL Fix Pack completed successfully!' as status;
