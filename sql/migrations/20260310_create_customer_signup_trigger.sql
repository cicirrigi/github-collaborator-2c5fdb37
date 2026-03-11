-- Migration: Create customer signup trigger
-- Purpose: Auto-create customer record on signup for non-driver users
-- Forward-only: does NOT repair existing users, only handles new signups
-- Date: 2026-03-10

-- ============================================================================
-- FUNCTION: handle_new_customer_signup
-- ============================================================================
-- Creates customer record when new user signs up (non-driver only)
-- Uses STRICT mode - fails if default organization doesn't exist
-- Extracts metadata from auth.users.raw_user_meta_data
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_customer_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_first_name text;
  v_last_name text;
  v_phone text;
  v_role text;
  v_org_id uuid;
BEGIN
  -- Extract metadata from new user
  v_first_name := NEW.raw_user_meta_data->>'first_name';
  v_last_name := NEW.raw_user_meta_data->>'last_name';
  v_phone := NEW.raw_user_meta_data->>'phone';
  v_role := NEW.raw_user_meta_data->>'role';

  -- Create customer ONLY if NOT driver
  IF v_role IS DISTINCT FROM 'driver' THEN

    -- Get default organization (STRICT - fail if not found)
    SELECT id INTO STRICT v_org_id
    FROM public.organizations
    WHERE is_default = true;

    -- Insert customer with real metadata
    INSERT INTO public.customers (
      auth_user_id,
      organization_id,
      email,
      first_name,
      last_name,
      phone,
      is_active
    )
    VALUES (
      NEW.id,
      v_org_id,
      NEW.email,
      COALESCE(NULLIF(TRIM(v_first_name), ''), 'Guest'),
      COALESCE(NULLIF(TRIM(v_last_name), ''), ''),
      v_phone,
      true
    )
    ON CONFLICT (organization_id, auth_user_id) DO NOTHING;

  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================================
-- TRIGGER: on_auth_user_created_customer
-- ============================================================================
-- Fires AFTER INSERT on auth.users to create customer record
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created_customer ON auth.users;

CREATE TRIGGER on_auth_user_created_customer
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_customer_signup();

-- ============================================================================
-- END MIGRATION
-- ============================================================================
