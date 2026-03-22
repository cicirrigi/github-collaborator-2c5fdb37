# 🎯 BILLING IMPLEMENTATION - COMPLETE

## ✅ STATUS: READY FOR DB MIGRATION

All code has been implemented following the approved multi-tenant design with final refinements from GPT feedback.

---

## 📦 WHAT WAS IMPLEMENTED

### **FAZA 1: Database Schema ✅**

**Files Created:**

1. `/sql/migrations/20260311_add_billing_snapshot_to_bookings.sql`
   - Adds `billing_snapshot JSONB` column to `bookings` table
   - GIN index for JSONB queries
   - Index on captured_at for audit queries
   - Complete documentation of structure

### **FAZA 2: Database Layer (View + RPCs) ✅**

**Files Created:** 2. `/sql/migrations/20260311_create_billing_view_and_rpcs.sql`

- `customer_billing_profiles_v1` view (read-only, security_invoker)
- `create_billing_profile()` RPC - creates with COMPLETE validation, auto-sets first as default
- `update_billing_profile()` RPC - requires COMPLETE payload, prevents partial corruption
- `set_default_billing_profile()` RPC - sets default explicitly
- `delete_billing_profile()` RPC - soft delete with is_default cleanup, auto-promotes next

**Key Features:**

- ✅ Validates COMPLETE JSONB structure (no partial updates)
- ✅ First profile automatically becomes default
- ✅ Explicit tenant context via `p_customer_id` (no `LIMIT 1` on auth_user_id)
- ✅ Entity_type consistency enforced
- ✅ Delete clears `is_default = false` and promotes next profile

### **FAZA 3: Frontend Layer ✅**

**Files Created:** 3. `/src/types/billing/billing.types.ts`

- Complete TypeScript types for billing entities
- `BillingAddress`, `IndividualBillingData`, `CompanyBillingData`
- `BillingProfile` (from view)
- `BillingSnapshot` (for bookings)
- Input types for create/update operations

4. `/src/features/account/hooks/useBilling.ts`
   - CRUD hook with explicit `customerId` parameter
   - `getProfiles()`, `getDefaultProfile()`, `getProfile()`
   - `createProfile()`, `updateProfile()`, `setDefault()`, `deleteProfile()`
   - All operations tenant-aware with customer context

### **FAZA 4: Booking Integration ✅**

**Files Modified:** 5. `/src/services/booking-mapping/dbPayload.ts`

- Added `billingEntityId` and `billingSnapshot` parameters
- Uses values from params instead of hardcoded null

**Files Created:** 6. `/src/utils/booking/billing-helper.ts`

- `fetchBillingForBooking()` helper function
- Priority logic: explicit ID → default → null
- **EXPLICIT ERROR** if UI sends invalid billing ID
- Fallback to null only if no ID provided

**Files Modified:** 7. `/src/app/api/bookings/route.ts`

- Added `billingEntityId` to request schema
- Calls `fetchBillingForBooking()` with validation
- Throws 400 error if explicit billing ID is invalid
- Continues without billing if no ID and no default (acceptable)

---

## 🎯 KEY DESIGN DECISIONS (GPT-APPROVED)

### **1. ✅ Index NOT Modified**

```sql
-- KEPT AS IS (already correct for multi-tenant):
UNIQUE INDEX uq_billing_entities_one_default ON (customer_id)
WHERE (is_default = true) AND (deleted_at IS NULL)
```

**Reason:** `customer_id` is already org-scoped via `UNIQUE (organization_id, auth_user_id)` in customers table.

### **2. ✅ COMPLETE Payload Updates**

- `update_billing_profile()` requires COMPLETE `individual_data` or `company_data`
- No partial updates that could corrupt JSONB structure
- Entity_type consistency enforced

### **3. ✅ Auto-Default First Profile**

- `create_billing_profile()` automatically sets first profile as `is_default = true`
- User doesn't need to specify on first profile

### **4. ✅ Delete Cleans Up Default**

- `delete_billing_profile()` sets `is_default = false` on soft delete
- Auto-promotes next oldest profile to default if needed

### **5. ✅ Explicit Billing Validation**

**Priority flow:**

```typescript
if (explicitBillingId) {
  // Validate ownership + tenant → ERROR if invalid
} else {
  // Try default → null if none exists (acceptable)
}
```

### **6. ✅ Tenant Context Explicit**

- All RPCs use `p_customer_id` parameter
- NO `LIMIT 1` on `auth_user_id` queries
- Customer ID from secure session context only

---

## 📋 NEXT STEPS TO RUN MIGRATIONS

### **Step 1: Apply DB Migrations**

```bash
# Connect to Supabase project
cd sql/migrations

# Apply billing_snapshot migration
supabase db execute -f 20260311_add_billing_snapshot_to_bookings.sql

# Apply view and RPCs migration
supabase db execute -f 20260311_create_billing_view_and_rpcs.sql
```

**Or via Supabase Dashboard:**

1. Go to SQL Editor
2. Copy/paste each migration file
3. Execute in order

### **Step 2: Verify Migrations**

```sql
-- Verify billing_snapshot column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'bookings' AND column_name = 'billing_snapshot';

-- Verify view exists
SELECT * FROM customer_billing_profiles_v1 LIMIT 1;

-- Verify RPCs exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_name LIKE '%billing%';
```

### **Step 3: Test Billing CRUD**

```typescript
// In your app, test the useBilling hook:
const { customerId } = await createCustomerWithOrganization(user.id);
const billing = useBilling(customerId);

// Create first profile (auto-default)
await billing.createProfile({
  entityType: 'individual',
  individualData: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '+44 7700 900000',
    billing_address: {
      street_line_1: '10 Downing Street',
      city: 'London',
      postal_code: 'SW1A 2AA',
      country: 'United Kingdom',
      country_code: 'GB',
    },
  },
});

// Get all profiles
const { data: profiles } = await billing.getProfiles();
console.log(profiles);
```

### **Step 4: Test Booking with Billing**

```typescript
// In booking flow, send billingEntityId:
POST /api/bookings
{
  "tripConfiguration": {...},
  "bookingType": "oneway",
  "billingEntityId": "uuid-of-billing-profile", // Optional
  "pricingSnapshot": {...}
}

// Backend will:
// 1. Validate ownership if billingEntityId provided
// 2. Throw 400 error if invalid
// 3. Fallback to default if not provided
// 4. Create billing_snapshot in bookings table
```

---

## 🔧 KNOWN LINT WARNINGS (Non-blocking)

- Console statements in `organizationResolver.ts` (pre-existing, not related to billing)
- Console statement in `dbPayload.ts` line 18 (coordinate validation warning, pre-existing)
- Console.warn in booking API for missing billing (intentional for debugging)

These are informational and don't block functionality.

---

## 📝 IMPLEMENTATION CHECKLIST

- [x] billing_snapshot migration created
- [x] View + RPCs migration created
- [x] TypeScript types defined
- [x] useBilling hook created
- [x] dbPayload updated for billing support
- [x] Billing helper with explicit validation
- [x] Booking API integrated with billing
- [x] Documentation complete

**Status: READY FOR DB MIGRATION AND TESTING** ✅

---

## 🎯 WHAT TO BUILD NEXT (After Testing)

### **UI Components (Not Implemented Yet):**

1. **Account Billing Management Page**
   - List all billing profiles
   - Create/Edit/Delete profiles
   - Set default profile
   - Uses `useBilling` hook

2. **Booking Flow Billing Selector**
   - Dropdown to select billing profile
   - "Use default" option
   - "Add new profile" button
   - Passes `billingEntityId` to booking API

3. **Separate Passenger from Billing**
   - Remove "booking for someone else" from billing accordion
   - Create separate PassengerDetails component
   - Create separate ContactDetails component

These UI components can be built AFTER migrations are applied and tested.

---

## 📚 REFERENCES

- Billing types: `/src/types/billing/billing.types.ts`
- Billing hook: `/src/features/account/hooks/useBilling.ts`
- Billing helper: `/src/utils/booking/billing-helper.ts`
- Booking API: `/src/app/api/bookings/route.ts`
- DB migrations: `/sql/migrations/20260311_*.sql`
