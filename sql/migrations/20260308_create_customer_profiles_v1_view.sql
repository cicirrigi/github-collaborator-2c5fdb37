-- Customer Profiles v1 View
-- READ contract for customer profile data (web + mobile)
-- Consistent with bookings_v1 architecture
-- Based on real schema: customers + customer_preferences (no customer_metadata table)

CREATE OR REPLACE VIEW customer_profiles_v1 AS
SELECT
    -- Customer core data
    c.id AS customer_id,
    c.auth_user_id,
    c.email,
    c.first_name,
    c.last_name,
    c.phone,
    c.profile_photo_url,
    c.saved_address,
    c.is_active,
    c.organization_id,
    c.created_at AS customer_created_at,
    c.updated_at AS customer_updated_at,
    c.deleted_at AS customer_deleted_at,

    -- Customer preferences (trip preferences)
    cp.temperature_preference,
    cp.music_preference,
    cp.communication_style,
    cp.pet_friendly_default,
    cp.created_at AS preferences_created_at,
    cp.updated_at AS preferences_updated_at

FROM customers c
LEFT JOIN customer_preferences cp ON cp.customer_id = c.id;

-- Add comment for documentation
COMMENT ON VIEW customer_profiles_v1 IS
'Customer Profiles v1 - Complete customer profile data for web and mobile apps.
READ contract consistent with bookings_v1 architecture.
Joins customers + customer_preferences.
Uses security_definer (default) to avoid RLS recursion with org helper functions.
Base table RLS policies still apply.
Use this view for all profile read operations.';

-- Grant access (adjust based on your RLS strategy)
GRANT SELECT ON customer_profiles_v1 TO authenticated;
GRANT SELECT ON customer_profiles_v1 TO service_role;
