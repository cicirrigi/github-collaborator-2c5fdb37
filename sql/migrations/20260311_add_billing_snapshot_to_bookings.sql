-- Migration: Add billing_snapshot to bookings table
-- Purpose: Immutable audit trail of billing data at booking creation time
-- Date: 2026-03-11

-- Add billing_snapshot column (idempotent)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS billing_snapshot JSONB;

-- Add comment explaining structure
COMMENT ON COLUMN bookings.billing_snapshot IS
'Immutable snapshot of billing data at booking creation time. Prevents data drift when billing profiles are updated.

Structure:
{
  "entity_type": "individual" | "company",
  "individual_data": {...} | null,
  "company_data": {...} | null,
  "captured_at": "ISO 8601 timestamp"
}

Example (individual):
{
  "entity_type": "individual",
  "individual_data": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+44 7700 900000",
    "billing_address": {
      "street_line_1": "10 Downing Street",
      "street_line_2": null,
      "city": "London",
      "county": "Greater London",
      "postal_code": "SW1A 2AA",
      "country": "United Kingdom",
      "country_code": "GB"
    }
  },
  "company_data": null,
  "captured_at": "2026-03-11T06:00:00Z"
}

Example (company):
{
  "entity_type": "company",
  "individual_data": null,
  "company_data": {
    "company_name": "Acme Corporation Ltd",
    "vat_number": "GB123456789",
    "registration_number": "12345678",
    "billing_email": "billing@acme.com",
    "phone": "+44 20 1234 5678",
    "contact_name": "Jane Smith",
    "billing_address": {
      "street_line_1": "123 Business Park",
      "street_line_2": "Suite 400",
      "city": "London",
      "county": "Greater London",
      "postal_code": "EC1A 1BB",
      "country": "United Kingdom",
      "country_code": "GB"
    }
  },
  "captured_at": "2026-03-11T06:00:00Z"
}';

-- Create GIN index for querying JSONB snapshots (idempotent)
CREATE INDEX IF NOT EXISTS idx_bookings_billing_snapshot
ON bookings USING gin(billing_snapshot)
WHERE billing_snapshot IS NOT NULL;

-- Create index for captured_at within snapshot (for audit queries, idempotent)
CREATE INDEX IF NOT EXISTS idx_bookings_billing_snapshot_captured_at
ON bookings ((billing_snapshot->>'captured_at'))
WHERE billing_snapshot IS NOT NULL;

-- Add CHECK constraint to validate billing_snapshot structure
-- Prevents completely malformed payloads from being stored
ALTER TABLE bookings
ADD CONSTRAINT IF NOT EXISTS bookings_billing_snapshot_shape_chk
CHECK (
  billing_snapshot IS NULL
  OR (
    jsonb_typeof(billing_snapshot) = 'object'
    AND billing_snapshot ? 'entity_type'
    AND billing_snapshot ? 'individual_data'
    AND billing_snapshot ? 'company_data'
    AND billing_snapshot ? 'captured_at'
    AND (billing_snapshot->>'entity_type') IN ('individual', 'company')
  )
);

COMMENT ON CONSTRAINT bookings_billing_snapshot_shape_chk ON bookings IS
'Validates minimal structure of billing_snapshot JSONB:
- Must be object type
- Must have required keys: entity_type, individual_data, company_data, captured_at
- entity_type must be individual or company';
