-- Migration: Create billing view and RPCs (multi-tenant ready)
-- Purpose: READ view and WRITE RPCs for billing_entities management
-- Date: 2026-03-11

-- =====================================================
-- VIEW: customer_billing_profiles_v1
-- =====================================================
-- Purpose: Read-only view for fetching billing profiles
-- Security: Uses security_invoker (RLS protection)
-- Note: auth_user_id removed to keep contract clean
-- =====================================================

CREATE OR REPLACE VIEW customer_billing_profiles_v1
WITH (security_invoker = true)
AS
SELECT
  be.id,
  be.customer_id,
  be.organization_id,
  be.entity_type,
  be.is_default,
  be.individual_data,
  be.company_data,
  be.created_at,
  be.updated_at,
  -- Computed display fields for convenience
  CASE
    WHEN be.entity_type = 'individual'
    THEN be.individual_data->>'email'
    ELSE be.company_data->>'billing_email'
  END as email,
  CASE
    WHEN be.entity_type = 'individual'
    THEN CONCAT(
      be.individual_data->>'first_name',
      ' ',
      be.individual_data->>'last_name'
    )
    ELSE be.company_data->>'company_name'
  END as display_name
FROM billing_entities be
JOIN customers c ON c.id = be.customer_id
WHERE be.deleted_at IS NULL
  AND c.deleted_at IS NULL;

-- Grant access to authenticated users (RLS via security_invoker)
GRANT SELECT ON customer_billing_profiles_v1 TO authenticated;

COMMENT ON VIEW customer_billing_profiles_v1 IS
'Read-only view for billing profiles. Automatically filtered by RLS.
Use customer_id for explicit filtering in queries.';

-- =====================================================
-- RPC: create_billing_profile
-- =====================================================
-- Purpose: Create new billing profile for customer
-- Features:
--   - Validates ownership (customer belongs to caller)
--   - Validates JSONB structure completeness
--   - Auto-sets first profile as default
--   - Enforces entity_type consistency
-- =====================================================

CREATE OR REPLACE FUNCTION create_billing_profile(
  p_customer_id UUID,
  p_entity_type TEXT,
  p_individual_data JSONB DEFAULT NULL,
  p_company_data JSONB DEFAULT NULL,
  p_set_as_default BOOLEAN DEFAULT false
)
RETURNS TABLE(
  id UUID,
  entity_type TEXT,
  is_default BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_organization_id UUID;
  v_billing_id UUID;
  v_existing_count INT;
BEGIN
  -- Verify ownership: customer belongs to caller
  SELECT c.organization_id INTO v_organization_id
  FROM customers c
  WHERE c.id = p_customer_id
    AND c.auth_user_id = auth.uid()
    AND c.deleted_at IS NULL;

  IF v_organization_id IS NULL THEN
    RAISE EXCEPTION 'Customer not found or access denied';
  END IF;

  -- Validate entity_type
  IF p_entity_type NOT IN ('individual', 'company') THEN
    RAISE EXCEPTION 'entity_type must be individual or company';
  END IF;

  -- Validate COMPLETE JSONB structure based on entity_type
  IF p_entity_type = 'individual' THEN
    IF p_individual_data IS NULL THEN
      RAISE EXCEPTION 'individual_data is required for individual entity_type';
    END IF;

    -- Validate required fields
    IF NOT (p_individual_data ? 'first_name')
      OR NOT (p_individual_data ? 'last_name')
      OR NOT (p_individual_data ? 'email')
      OR NOT (p_individual_data ? 'phone')
      OR NOT (p_individual_data ? 'billing_address')
    THEN
      RAISE EXCEPTION 'individual_data requires complete structure: first_name, last_name, email, phone, billing_address';
    END IF;

    -- Validate billing_address type and completeness
    IF jsonb_typeof(p_individual_data->'billing_address') != 'object' THEN
      RAISE EXCEPTION 'billing_address must be a JSON object';
    END IF;

    IF NOT (p_individual_data->'billing_address' ? 'street_line_1')
      OR NOT (p_individual_data->'billing_address' ? 'city')
      OR NOT (p_individual_data->'billing_address' ? 'postal_code')
      OR NOT (p_individual_data->'billing_address' ? 'country')
      OR NOT (p_individual_data->'billing_address' ? 'country_code')
    THEN
      RAISE EXCEPTION 'billing_address requires: street_line_1, city, postal_code, country, country_code';
    END IF;

    -- Force company_data to NULL
    p_company_data := NULL;
  END IF;

  IF p_entity_type = 'company' THEN
    IF p_company_data IS NULL THEN
      RAISE EXCEPTION 'company_data is required for company entity_type';
    END IF;

    -- Validate required fields
    IF NOT (p_company_data ? 'company_name')
      OR NOT (p_company_data ? 'billing_email')
      OR NOT (p_company_data ? 'phone')
      OR NOT (p_company_data ? 'billing_address')
    THEN
      RAISE EXCEPTION 'company_data requires complete structure: company_name, billing_email, phone, billing_address';
    END IF;

    -- Validate billing_address type and completeness
    IF jsonb_typeof(p_company_data->'billing_address') != 'object' THEN
      RAISE EXCEPTION 'billing_address must be a JSON object';
    END IF;

    IF NOT (p_company_data->'billing_address' ? 'street_line_1')
      OR NOT (p_company_data->'billing_address' ? 'city')
      OR NOT (p_company_data->'billing_address' ? 'postal_code')
      OR NOT (p_company_data->'billing_address' ? 'country')
      OR NOT (p_company_data->'billing_address' ? 'country_code')
    THEN
      RAISE EXCEPTION 'billing_address requires: street_line_1, city, postal_code, country, country_code';
    END IF;

    -- Force individual_data to NULL
    p_individual_data := NULL;
  END IF;

  -- Check if this is the first profile for customer
  SELECT COUNT(*) INTO v_existing_count
  FROM billing_entities
  WHERE customer_id = p_customer_id
    AND deleted_at IS NULL;

  -- Auto-set as default if first profile
  IF v_existing_count = 0 THEN
    p_set_as_default := true;
  END IF;

  -- If set_as_default, unset other defaults
  IF p_set_as_default THEN
    UPDATE billing_entities
    SET is_default = false
    WHERE customer_id = p_customer_id
      AND deleted_at IS NULL;
  END IF;

  -- Insert new billing profile
  INSERT INTO billing_entities (
    customer_id,
    organization_id,
    entity_type,
    individual_data,
    company_data,
    is_default
  ) VALUES (
    p_customer_id,
    v_organization_id,
    p_entity_type,
    p_individual_data,
    p_company_data,
    p_set_as_default
  )
  RETURNING billing_entities.id INTO v_billing_id;

  RETURN QUERY
  SELECT
    be.id,
    be.entity_type::TEXT,
    be.is_default
  FROM billing_entities be
  WHERE be.id = v_billing_id;
END;
$$;

COMMENT ON FUNCTION create_billing_profile IS
'Creates new billing profile with complete validation.
First profile is automatically set as default.
Requires COMPLETE individual_data or company_data payload.';

-- Restrict function execution to authenticated users only
REVOKE ALL ON FUNCTION create_billing_profile(UUID, TEXT, JSONB, JSONB, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_billing_profile(UUID, TEXT, JSONB, JSONB, BOOLEAN) TO authenticated;

-- =====================================================
-- RPC: update_billing_profile
-- =====================================================
-- Purpose: Update existing billing profile
-- Features:
--   - Requires COMPLETE payload (not partial)
--   - Validates entity_type consistency
--   - Prevents mixed data corruption
-- =====================================================

CREATE OR REPLACE FUNCTION update_billing_profile(
  p_billing_id UUID,
  p_individual_data JSONB DEFAULT NULL,
  p_company_data JSONB DEFAULT NULL,
  p_set_as_default BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_entity_type TEXT;
BEGIN
  -- Guard against empty update
  IF p_individual_data IS NULL
     AND p_company_data IS NULL
     AND p_set_as_default IS NULL THEN
    RAISE EXCEPTION 'No update payload provided';
  END IF;

  -- Verify ownership and get entity_type
  SELECT be.customer_id, be.entity_type INTO v_customer_id, v_entity_type
  FROM billing_entities be
  JOIN customers c ON c.id = be.customer_id
  WHERE be.id = p_billing_id
    AND c.auth_user_id = auth.uid()
    AND be.deleted_at IS NULL
    AND c.deleted_at IS NULL;

  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'Billing profile not found or access denied';
  END IF;

  -- ENFORCE entity_type consistency and COMPLETE payload
  IF v_entity_type = 'individual' THEN
    IF p_company_data IS NOT NULL THEN
      RAISE EXCEPTION 'Cannot update company_data on individual profile';
    END IF;

    -- If updating individual_data, validate type and COMPLETE structure
    IF p_individual_data IS NOT NULL THEN
      IF jsonb_typeof(p_individual_data) != 'object' THEN
        RAISE EXCEPTION 'individual_data must be a JSON object';
      END IF;

      IF NOT (p_individual_data ? 'first_name')
        OR NOT (p_individual_data ? 'last_name')
        OR NOT (p_individual_data ? 'email')
        OR NOT (p_individual_data ? 'phone')
        OR NOT (p_individual_data ? 'billing_address')
      THEN
        RAISE EXCEPTION 'individual_data requires COMPLETE structure: first_name, last_name, email, phone, billing_address';
      END IF;

      -- Validate billing_address type and completeness
      IF jsonb_typeof(p_individual_data->'billing_address') != 'object' THEN
        RAISE EXCEPTION 'billing_address must be a JSON object';
      END IF;

      IF NOT (p_individual_data->'billing_address' ? 'street_line_1')
        OR NOT (p_individual_data->'billing_address' ? 'city')
        OR NOT (p_individual_data->'billing_address' ? 'postal_code')
        OR NOT (p_individual_data->'billing_address' ? 'country')
        OR NOT (p_individual_data->'billing_address' ? 'country_code')
      THEN
        RAISE EXCEPTION 'billing_address requires: street_line_1, city, postal_code, country, country_code';
      END IF;
    END IF;
  END IF;

  IF v_entity_type = 'company' THEN
    IF p_individual_data IS NOT NULL THEN
      RAISE EXCEPTION 'Cannot update individual_data on company profile';
    END IF;

    -- If updating company_data, validate type and COMPLETE structure
    IF p_company_data IS NOT NULL THEN
      IF jsonb_typeof(p_company_data) != 'object' THEN
        RAISE EXCEPTION 'company_data must be a JSON object';
      END IF;

      IF NOT (p_company_data ? 'company_name')
        OR NOT (p_company_data ? 'billing_email')
        OR NOT (p_company_data ? 'phone')
        OR NOT (p_company_data ? 'billing_address')
      THEN
        RAISE EXCEPTION 'company_data requires COMPLETE structure: company_name, billing_email, phone, billing_address';
      END IF;

      -- Validate billing_address type and completeness
      IF jsonb_typeof(p_company_data->'billing_address') != 'object' THEN
        RAISE EXCEPTION 'billing_address must be a JSON object';
      END IF;

      IF NOT (p_company_data->'billing_address' ? 'street_line_1')
        OR NOT (p_company_data->'billing_address' ? 'city')
        OR NOT (p_company_data->'billing_address' ? 'postal_code')
        OR NOT (p_company_data->'billing_address' ? 'country')
        OR NOT (p_company_data->'billing_address' ? 'country_code')
      THEN
        RAISE EXCEPTION 'billing_address requires: street_line_1, city, postal_code, country, country_code';
      END IF;
    END IF;
  END IF;

  -- Handle set_as_default
  IF p_set_as_default = true THEN
    UPDATE billing_entities
    SET is_default = false
    WHERE customer_id = v_customer_id
      AND id != p_billing_id
      AND deleted_at IS NULL;
  END IF;

  -- Update fields (only replace if provided)
  UPDATE billing_entities
  SET
    individual_data = COALESCE(p_individual_data, individual_data),
    company_data = COALESCE(p_company_data, company_data),
    is_default = COALESCE(p_set_as_default, is_default),
    updated_at = NOW()
  WHERE id = p_billing_id;

  RETURN true;
END;
$$;

COMMENT ON FUNCTION update_billing_profile IS
'Updates billing profile with COMPLETE payload validation.
Prevents partial updates that could corrupt data.
Enforces entity_type consistency.';

-- =====================================================
-- RPC: set_default_billing_profile
-- =====================================================
-- Purpose: Set a profile as default
-- =====================================================

CREATE OR REPLACE FUNCTION set_default_billing_profile(
  p_billing_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
BEGIN
  -- Verify ownership
  SELECT be.customer_id INTO v_customer_id
  FROM billing_entities be
  JOIN customers c ON c.id = be.customer_id
  WHERE be.id = p_billing_id
    AND c.auth_user_id = auth.uid()
    AND be.deleted_at IS NULL
    AND c.deleted_at IS NULL;

  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'Billing profile not found or access denied';
  END IF;

  -- Unset other defaults
  UPDATE billing_entities
  SET is_default = false
  WHERE customer_id = v_customer_id
    AND id != p_billing_id
    AND deleted_at IS NULL;

  -- Set new default
  UPDATE billing_entities
  SET is_default = true
  WHERE id = p_billing_id;

  RETURN true;
END;
$$;

COMMENT ON FUNCTION set_default_billing_profile IS
'Sets specified profile as default for customer.
Automatically unsets other defaults.';

-- Restrict function execution to authenticated users only
REVOKE ALL ON FUNCTION set_default_billing_profile(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION set_default_billing_profile(UUID) TO authenticated;

-- =====================================================
-- RPC: delete_billing_profile
-- =====================================================
-- Purpose: Soft delete billing profile
-- Features:
--   - Sets is_default = false on deletion
--   - Auto-promotes next profile if deleted was default
-- =====================================================

CREATE OR REPLACE FUNCTION delete_billing_profile(
  p_billing_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_was_default BOOLEAN;
  v_next_profile_id UUID;
BEGIN
  -- Verify ownership and check if it's default
  SELECT be.customer_id, be.is_default
  INTO v_customer_id, v_was_default
  FROM billing_entities be
  JOIN customers c ON c.id = be.customer_id
  WHERE be.id = p_billing_id
    AND c.auth_user_id = auth.uid()
    AND be.deleted_at IS NULL
    AND c.deleted_at IS NULL;

  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'Billing profile not found or access denied';
  END IF;

  -- Soft delete AND clear is_default flag
  UPDATE billing_entities
  SET
    deleted_at = NOW(),
    is_default = false
  WHERE id = p_billing_id;

  -- If deleted profile was default, promote another active profile
  -- Strategy: Promote the OLDEST remaining profile (created_at ASC)
  -- Rationale: The oldest profile is likely the original/primary one
  IF v_was_default THEN
    SELECT id INTO v_next_profile_id
    FROM billing_entities
    WHERE customer_id = v_customer_id
      AND deleted_at IS NULL
      AND id != p_billing_id
    ORDER BY created_at ASC  -- Oldest profile becomes new default
    LIMIT 1;

    -- If another profile exists, make it default
    IF v_next_profile_id IS NOT NULL THEN
      UPDATE billing_entities
      SET is_default = true
      WHERE id = v_next_profile_id;
    END IF;
    -- If no other profile exists, customer is left without default (acceptable)
  END IF;

  RETURN true;
END;
$$;

COMMENT ON FUNCTION delete_billing_profile IS
'Soft deletes billing profile and clears is_default flag.
Auto-promotes oldest remaining profile to default if needed.';

-- Restrict function execution to authenticated users only
REVOKE ALL ON FUNCTION delete_billing_profile(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION delete_billing_profile(UUID) TO authenticated;
