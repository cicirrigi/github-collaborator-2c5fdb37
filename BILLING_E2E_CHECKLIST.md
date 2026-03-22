# ✅ BILLING END-TO-END VALIDATION CHECKLIST

Use this checklist to verify the complete billing integration works from UI to DB.

---

## 🔍 QUICK 5-MINUTE VERIFICATION

### **1. Verify `buildBookingPayload` Transmits Billing Fields**

**File:** `src/services/booking-mapping/dbPayload.ts`

**Check:**

```typescript
// Around line 84-95
return {
  customer_id: customerId,
  organization_id: organizationId || null,
  booking_type: bookingType,
  // ... other fields ...

  // ✅ MUST HAVE THESE TWO:
  billing_entity_id: billingEntityId ?? null,
  billing_snapshot: billingSnapshot ?? null,

  // ... rest of fields
};
```

**Status:** ⬜ Not checked yet

---

### **2. Verify `create_booking_with_legs` RPC Accepts Billing Fields**

**File:** `sql/functions/create_booking_with_legs.sql` or similar

**Check:**

```sql
-- RPC function signature should accept p_booking with structure:
CREATE OR REPLACE FUNCTION create_booking_with_legs(
  p_booking JSONB,  -- Must include billing_entity_id and billing_snapshot
  p_legs JSONB[]
)
```

**And the INSERT should include:**

```sql
INSERT INTO bookings (
  customer_id,
  organization_id,
  booking_type,
  -- ... other columns ...
  billing_entity_id,    -- ✅ MUST BE HERE
  billing_snapshot,     -- ✅ MUST BE HERE
  -- ... other columns ...
)
VALUES (
  (p_booking->>'customer_id')::uuid,
  (p_booking->>'organization_id')::uuid,
  (p_booking->>'booking_type')::text,
  -- ... other values ...
  (p_booking->>'billing_entity_id')::uuid,           -- ✅ MUST BE HERE
  (p_booking->'billing_snapshot')::jsonb,            -- ✅ MUST BE HERE
  -- ... other values ...
);
```

**Status:** ⬜ Not checked yet

---

### **3. Manual Test: Create Booking Without Billing**

**Steps:**

1. Create booking through UI without selecting billing profile
2. Check POST response: `billingEntityId: null, billingSnapshot: null`
3. Query DB: `SELECT billing_entity_id, billing_snapshot FROM bookings WHERE id = ?`
4. **Expected:** Both fields should be NULL

**Status:** ⬜ Not tested yet

---

### **4. Manual Test: Create Booking With Explicit Billing**

**Steps:**

1. Create a billing profile first (individual or company)
2. Create booking and select that billing profile
3. Check POST response: `billingEntityId: "<uuid>", billingSnapshot: { ... }`
4. Query DB: `SELECT billing_entity_id, billing_snapshot FROM bookings WHERE id = ?`
5. **Expected:**
   - `billing_entity_id` = the profile UUID
   - `billing_snapshot` = JSONB with `entity_type`, `individual_data/company_data`, `captured_at`

**Status:** ⬜ Not tested yet

---

### **5. Manual Test: Create Booking With Default Billing**

**Steps:**

1. Create a billing profile and set as default
2. Create booking WITHOUT explicitly selecting billing profile
3. Check POST response: `billingEntityId: "<uuid>", billingSnapshot: { ... }`
4. **Expected:** Should use default profile automatically

**Status:** ⬜ Not tested yet

---

### **6. Manual Test: Invalid Billing ID**

**Steps:**

1. POST booking with `billingEntityId: "00000000-0000-0000-0000-000000000000"` (fake UUID)
2. **Expected:** HTTP 400 with error message "Invalid billing profile"

**Status:** ⬜ Not tested yet

---

### **7. Manual Test: Multi-Tenant Isolation**

**Steps:**

1. User A creates billing profile
2. User B (different org) tries to book with User A's billing ID
3. **Expected:** HTTP 400 - ownership validation should fail

**Status:** ⬜ Not tested yet

---

## 📝 DETAILED VERIFICATION STEPS

### **A. Check SQL Migration Applied**

```sql
-- Run in Supabase SQL Editor
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings'
  AND column_name IN ('billing_entity_id', 'billing_snapshot');
```

**Expected Result:**

```
billing_entity_id | uuid  | YES
billing_snapshot  | jsonb | YES
```

**Status:** ⬜ Not checked

---

### **B. Check View Includes Billing Fields**

```sql
-- Run in Supabase SQL Editor
SELECT * FROM customer_billing_profiles_v1 LIMIT 1;
```

**Expected:** Should return rows with `id`, `customer_id`, `organization_id`, `entity_type`, `individual_data`, `company_data`, `email`, `display_name`

**Status:** ⬜ Not checked

---

### **C. Check RPCs Exist**

```sql
-- Run in Supabase SQL Editor
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%billing%';
```

**Expected:**

- `create_billing_profile`
- `update_billing_profile`
- `set_default_billing_profile`
- `delete_billing_profile`

**Status:** ⬜ Not checked

---

### **D. Test RPC Permissions**

```sql
-- Try calling as authenticated user
SELECT create_billing_profile(
  p_customer_id := '<your-customer-id>'::uuid,
  p_entity_type := 'individual',
  p_individual_data := '{"first_name": "Test", ...}'::jsonb,
  p_company_data := null,
  p_set_as_default := false
);
```

**Expected:** Should work for authenticated users, fail for public

**Status:** ⬜ Not checked

---

## 🎯 INTEGRATION TEST SCENARIOS

### **Scenario 1: Happy Path - Individual Billing**

```typescript
// Frontend test
const response = await fetch('/api/bookings', {
  method: 'POST',
  body: JSON.stringify({
    tripConfiguration: {
      /* ... */
    },
    bookingType: 'oneway',
    billingEntityId: '<individual-profile-uuid>',
    pricingSnapshot: {
      /* ... */
    },
  }),
});

// Expected: 200 OK with bookingId
```

**Status:** ⬜ Not tested

---

### **Scenario 2: Happy Path - Company Billing**

Same as above but with company profile UUID.

**Status:** ⬜ Not tested

---

### **Scenario 3: No Billing Profile Exists**

```typescript
// User has NO billing profiles at all
const response = await fetch('/api/bookings', {
  method: 'POST',
  body: JSON.stringify({
    tripConfiguration: {
      /* ... */
    },
    bookingType: 'oneway',
    // No billingEntityId provided
    pricingSnapshot: {
      /* ... */
    },
  }),
});

// Expected: 200 OK, booking created with billing_entity_id=null
```

**Status:** ⬜ Not tested

---

### **Scenario 4: Cross-Org Attack**

```typescript
// User from Org A tries to use billing profile from Org B
const response = await fetch('/api/bookings', {
  method: 'POST',
  body: JSON.stringify({
    tripConfiguration: {
      /* ... */
    },
    bookingType: 'oneway',
    billingEntityId: '<org-b-profile-uuid>',
    pricingSnapshot: {
      /* ... */
    },
  }),
});

// Expected: 400 Bad Request - ownership validation fails
```

**Status:** ⬜ Not tested

---

## ✅ FINAL CHECKLIST

Before considering billing DONE:

- [ ] `buildBookingPayload` includes `billing_entity_id` and `billing_snapshot` in return
- [ ] `create_booking_with_legs` RPC accepts and inserts billing fields
- [ ] Booking without billing works (NULL values)
- [ ] Booking with explicit billing works (UUID + snapshot)
- [ ] Booking with default billing works (auto-fallback)
- [ ] Invalid billing ID returns 400 error
- [ ] Cross-org billing ID returns 400 error
- [ ] SQL migrations applied successfully
- [ ] View returns correct data
- [ ] RPCs callable by authenticated users only
- [ ] GET /api/bookings is multi-tenant safe
- [ ] POST /api/bookings is multi-tenant safe

---

## 🚨 KNOWN ISSUES TO FIX

Based on GPT feedback, the following were identified:

1. ✅ **FIXED:** `createCustomerWithOrganization` signature inconsistency
2. ✅ **FIXED:** `finalBillingSnapshot` type not explicit (now `BillingSnapshot | null`)
3. ✅ **FIXED:** Billing error handling not distinguishing 400 vs 500
4. ✅ **FIXED:** `fetchBillingForBooking` not handling default profile errors
5. ⬜ **TO VERIFY:** `buildBookingPayload` actually transmits billing fields
6. ⬜ **TO VERIFY:** `create_booking_with_legs` RPC accepts billing fields

---

## 📞 IF SOMETHING FAILS

### **Symptom: Booking created but billing_snapshot is NULL**

**Likely cause:** `create_booking_with_legs` RPC doesn't extract billing fields from JSONB

**Fix:** Update RPC to include:

```sql
billing_entity_id = (p_booking->>'billing_entity_id')::uuid,
billing_snapshot = (p_booking->'billing_snapshot')::jsonb
```

---

### **Symptom: 500 error when creating booking with billing**

**Likely cause:** Missing imports or type mismatches

**Fix:** Check:

1. `import type { BillingSnapshot } from '@/types/billing/billing.types'` in route.ts
2. `buildBookingPayload` signature accepts `billingSnapshot?: BillingSnapshot | null`

---

### **Symptom: Default billing not working**

**Likely cause:** `fetchBillingForBooking` query error

**Fix:** Check:

1. View `customer_billing_profiles_v1` exists
2. Query filters by `customer_id`, `organization_id`, `is_default = true`
3. No infrastructure errors in logs

---

## 🎉 SUCCESS CRITERIA

**Billing integration is DONE when:**

1. ✅ All GPT corrections applied
2. ✅ All TypeScript errors resolved
3. ⬜ All manual tests pass
4. ⬜ DB contains correct billing_snapshot after booking creation
5. ⬜ Multi-tenant isolation verified
6. ⬜ Error handling verified (400 vs 500)

**Current Status:** 🟡 Code complete, awaiting E2E testing
