# 🧪 VANTAGE LANE - Booking System Test Checklist

**Execute these 8 critical tests to verify bulletproof booking system**

---

## **✅ TEST 1: Customer Creation (Upsert Safety)**

```bash
# Test: Prevent duplicate customers
POST /api/bookings
- Same auth_user_id called multiple times
- Should upsert, not create duplicates
- Verify: only 1 customer record per auth_user_id
```

**Expected:**

- ✅ Single customer record
- ✅ No "duplicate key" errors
- ✅ Consistent customer_id returned

---

## **✅ TEST 2: Booking Creation (All Types)**

```bash
# Test each booking type with required fields
POST /api/bookings
Body: { tripConfiguration: {...}, bookingType: "oneway", pricingSnapshot: {...} }

Types to test:
- oneway: pickup + dropoff + pickupDateTime
- return: + returnDateTime
- hourly: pickup + pickupDateTime + hoursRequested
- daily: pickup + dailyRange + daysRequested
- fleet: pickup + dropoff + fleetSelection[]
- bespoke: customRequirements (min 10 chars)
```

**Expected:**

- ✅ booking record in `bookings` table
- ✅ booking_legs records created
- ✅ expires_at = now() + 30 minutes
- ✅ status='NEW', payment_status='pending'

---

## **✅ TEST 3: Payment Intent (Idempotent)**

```bash
# Test: Idempotent payment intent creation
POST /api/stripe/payment-intent
Body: { bookingId: "uuid" }
Headers: { "Idempotency-Key": "pi_${bookingId}" }

# Call same endpoint 3 times with same bookingId
```

**Expected:**

- ✅ Same PaymentIntent ID returned (Stripe idempotency)
- ✅ Only 1 record in booking_payments table (upsert safety)
- ✅ Amount matches booking.amount_total_pence
- ✅ booking.payment_status = 'pending'

---

## **✅ TEST 4: Ownership Validation**

```bash
# Test: User can't create payment for other user's booking
1. User A creates booking → bookingId_A
2. User B attempts payment intent for bookingId_A
POST /api/stripe/payment-intent { bookingId: bookingId_A }
```

**Expected:**

- ❌ 404 "Booking not found" (ownership failed)
- ✅ No payment record created
- ✅ User A still owns booking

---

## **✅ TEST 5: Stripe Webhook Updates**

```bash
# Test: Webhook properly updates booking status
1. Create booking + payment intent
2. Simulate Stripe webhook events:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - payment_intent.canceled

POST /api/stripe/webhook
Body: Stripe event payload
```

**Expected:**

- ✅ payment_intent.succeeded → booking.payment_status='succeeded'
- ✅ payment_intent.payment_failed → booking.payment_status='failed'
- ✅ payment_intent.canceled → booking.payment_status='canceled'
- ✅ booking_payments.status updated accordingly

---

## **✅ TEST 6: Abandoned Booking Expiration**

```bash
# Test: Bookings expire after 30 minutes
1. Create booking (expires_at = now + 30min)
2. Wait or manually set expires_at to past
3. Run cleanup function:
SELECT cleanup_abandoned_bookings();
```

**Expected:**

- ✅ Expired bookings → status='CANCELLED', payment_status='canceled'
- ✅ Function returns count of affected bookings
- ✅ Non-expired bookings unchanged

---

## **✅ TEST 7: React Strict Mode Safety**

```bash
# Test: No duplicate calls in React Strict Mode
1. Enable React Strict Mode
2. Navigate to payment step (card selected)
3. Click "Continue to Payment" button
4. Check database for duplicates
```

**Expected:**

- ✅ Only 1 booking created (useRef guard works)
- ✅ Only 1 payment intent created (idempotency works)
- ✅ Only 1 booking_payments record (upsert works)
- ✅ No console errors

---

## **✅ TEST 8: Full E2E Payment Flow**

```bash
# Test: Complete booking → payment → confirmation flow
1. User creates trip configuration (oneway)
2. User clicks "Continue to Payment"
3. User enters card details in Stripe Elements
4. User submits payment
5. Stripe webhook confirms payment
6. User sees confirmation page
```

**Expected:**

- ✅ Booking: status='NEW' → 'CONFIRMED'
- ✅ Payment: payment_status='pending' → 'succeeded'
- ✅ booking_payments: status='pending' → 'succeeded'
- ✅ expires_at cleared (no longer needed)
- ✅ User redirected to confirmation
- ✅ Email receipt sent (if configured)

---

## **🔧 DEBUGGING COMMANDS**

### Check Customer Duplicates

```sql
SELECT auth_user_id, COUNT(*)
FROM customers
GROUP BY auth_user_id
HAVING COUNT(*) > 1;
```

### Check Payment Duplicates

```sql
SELECT stripe_payment_intent_id, COUNT(*)
FROM booking_payments
GROUP BY stripe_payment_intent_id
HAVING COUNT(*) > 1;
```

### Check Expired Bookings

```sql
SELECT id, reference, expires_at, payment_status, status
FROM bookings
WHERE expires_at < NOW() AND payment_status = 'pending';
```

### Check Booking Flow Integrity

```sql
SELECT
  b.id,
  b.reference,
  b.status,
  b.payment_status,
  bp.stripe_payment_intent_id,
  bp.status as payment_record_status,
  COUNT(bl.id) as leg_count
FROM bookings b
LEFT JOIN booking_payments bp ON b.id = bp.booking_id
LEFT JOIN booking_legs bl ON b.id = bl.booking_id
GROUP BY b.id, b.reference, b.status, b.payment_status, bp.stripe_payment_intent_id, bp.status
ORDER BY b.created_at DESC
LIMIT 20;
```

---

## **🚨 CRITICAL SUCCESS CRITERIA**

- **Zero duplicate customers** per auth_user_id
- **Zero duplicate payments** per stripe_payment_intent_id
- **Zero orphaned bookings** (all have legs)
- **Zero ownership bypasses** (403/404 on wrong user)
- **100% webhook reliability** (payment status sync)
- **100% idempotency** (safe retries/refreshes)
- **Proper expiration cleanup** (abandoned bookings handled)
- **React Strict Mode safe** (no duplicate API calls)
