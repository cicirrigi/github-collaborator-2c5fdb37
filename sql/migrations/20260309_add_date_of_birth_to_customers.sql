-- Migration: Add date_of_birth column to customers table
-- Date: 2026-03-09
-- Purpose: Enable users to save their date of birth in profile

-- Add date_of_birth column (nullable - existing users won't have it)
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Add comment for documentation
COMMENT ON COLUMN customers.date_of_birth IS 'User date of birth for profile information';
