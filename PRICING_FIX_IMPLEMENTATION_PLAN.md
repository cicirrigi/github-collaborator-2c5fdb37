# 🔐 PRICING SECURITY FIX - IMPLEMENTATION PLAN

**Data:** 2026-03-17 05:26 AM  
**Prioritate:** 🔴 CRITICAL SECURITY  
**Strategie:** Fază atomică (quote + payment împreună)

---

## 🎯 PROBLEMA IDENTIFICATĂ

### 🚨 Security Vulnerability (CRITICAL)

```typescript
// /api/stripe/payment-intent/route.ts:82-83
const rawAmount = body?.amount ?? body?.amount_total_pence;
const amount = Number(rawAmount);
```

**Impact:**

- Client poate trimite orice sumă la payment
- Amount vine UNCHECKED din frontend
- Zero validation cu pricing oficial

### 📊 Quote Coverage: 9%

- 11 bookings în DB
- Doar 1 cu `client_booking_quotes`
- 10 fără pricing snapshot audit trail

---

## 🏗️ ARHITECTURĂ ACTUALĂ

```
┌─────────────────────────────────────────────┐
│  vantage-lane-2.0 (Frontend + API Routes)  │
│  Status: Local development                  │
│                                             │
│  ┌──────────────┐      ┌─────────────────┐│
│  │ /api/bookings│ ───▶ │ Backend Pricing ││
│  │              │ HTTP │ API (Render)    ││
│  └──────────────┘      └─────────────────┘│
│         │                                   │
│         ▼                                   │
│  ┌──────────────────────┐                  │
│  │ /api/stripe/payment  │                  │
│  │ amount = body.amount │ ❌ UNCHECKED     │
│  └──────────────────────┘                  │
└─────────────────────────────────────────────┘
                │
                ▼
        ┌──────────────────┐
        │  Supabase DB     │
        │  client_booking_ │
        │  quotes: 9% only │
        └──────────────────┘
```

---

## ✅ ARHITECTURĂ ȚINTĂ

```
┌─────────────────────────────────────────────┐
│  vantage-lane-2.0 (Frontend + API Routes)  │
│                                             │
│  ┌──────────────┐      ┌─────────────────┐│
│  │ /api/bookings│ ───▶ │ Backend Pricing ││
│  │              │ HTTP │ API (Render)    ││
│  └──────┬───────┘      └─────────────────┘│
│         │                                   │
│         ▼                                   │
│  ┌─────────────────────────────────────┐   │
│  │ SAVE client_booking_quotes          │   │
│  │ - subtotal_pence                    │   │
│  │ - vat_pence                         │   │
│  │ - total_pence ✅ SOURCE OF TRUTH    │   │
│  │ - pricing_version_id                │   │
│  │ - line_items (full breakdown)       │   │
│  └─────────────┬───────────────────────┘   │
│                │                             │
│                ▼                             │
│  ┌──────────────────────────────────────┐   │
│  │ /api/stripe/payment-intent           │   │
│  │ amount = quote.total_pence ✅ FROM DB│   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 📝 MODIFICĂRI NECESARE

### 1️⃣ BACKEND-VANTAGELANE- (Pricing API)

**Fișier:** `/src/controllers/PricingController.ts`

**Modificare:** Asigură că response include `pricing_version_id`

```typescript
// ÎNAINTE:
return {
  finalPrice: 145,
  currency: 'GBP',
  breakdown: {
    /* ... */
  },
};

// DUPĂ:
return {
  finalPrice: 145,
  currency: 'GBP',
  pricing_version_id: 'uuid-from-db', // ✅ ADĂUGAT
  breakdown: {
    /* ... */
  },
};
```

**Note:**

- PricingEngine deja capturează pricing_version_id din queries
- Doar trebuie expus în response

---

### 2️⃣ VANTAGE-LANE-2.0 - `/api/bookings`

**Fișier:** `/src/app/api/bookings/route.ts`

**Modificare:** Salvează `client_booking_quotes` ÎNAINTE de return

**Location:** După linia 319 (după services quote calculation)

```typescript
// ===========================
// PRICING SNAPSHOT - FULL QUOTE
// ===========================

// 1. Call Backend Pricing API pentru vehicle pricing
let vehiclePricingResult = null;
if (tripConfiguration.selectedVehicle && pricingSnapshot?.routeData) {
  try {
    const pricingApiUrl = process.env.PRICING_API_URL || 'http://localhost:3001';
    const response = await fetch(`${pricingApiUrl}/api/pricing/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingType,
        vehicleType: tripConfiguration.selectedVehicle.category?.id,
        distance: pricingSnapshot.routeData.distance,
        duration: pricingSnapshot.routeData.duration,
        // ... alte date necesare
      }),
    });

    if (response.ok) {
      vehiclePricingResult = await response.json();
    }
  } catch (err) {
    console.error('[BOOKING_CREATE] Vehicle pricing failed:', err);
  }
}

// 2. Combine vehicle + services pricing
const vehicleSubtotal = vehiclePricingResult?.breakdown?.subtotal || 0;
const servicesSubtotal = finalAmountPence - (pricingSnapshot?.finalPricePence || 0);
const totalSubtotal = vehicleSubtotal + servicesSubtotal;

// 3. Calculate VAT
const vatRate = 0.2;
const vatPence = Math.round(totalSubtotal * vatRate);
const totalPence = totalSubtotal + vatPence;

// 4. Build line_items with full breakdown
const quoteLineItems = {
  meta: {
    calc_source: 'pricing_engine_v2',
    calc_version: '2.0.0',
    calculated_at: new Date().toISOString(),
  },
  vehicle_pricing: vehiclePricingResult?.breakdown || null,
  services_pricing: {
    subtotal_pence: servicesSubtotal,
    items: [], // from client_leg_quotes if exists
  },
  summary: {
    subtotal_pence: totalSubtotal,
    vat_pence: vatPence,
    total_pence: totalPence,
  },
};

// 5. SAVE client_booking_quotes (MANDATORY!)
const { data: savedQuote, error: quoteError } = await supabaseAdmin
  .from('client_booking_quotes')
  .insert({
    booking_id: bookingId,
    organization_id: organizationId,
    version: 1,
    currency: 'GBP',
    subtotal_pence: totalSubtotal,
    discount_pence: 0,
    vat_rate: vatRate,
    vat_pence: vatPence,
    total_pence: totalPence,
    line_items: quoteLineItems,
    calc_source: 'pricing_engine_v2',
    calc_version: '2.0.0',
    pricing_version_id: vehiclePricingResult?.pricing_version_id || null,
    quote_valid_until: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
    calculated_at: new Date().toISOString(),
  })
  .select('id, total_pence')
  .single();

if (quoteError) {
  console.error('[BOOKING_CREATE] Failed to save quote:', quoteError);
  // CRITICAL: Nu permitem booking fără quote!
  return NextResponse.json(
    { success: false, error: 'Failed to create pricing quote' },
    { status: 500 }
  );
}

// 6. Update finalAmountPence cu total oficial din quote
finalAmountPence = savedQuote.total_pence;
```

**Return response modificat:**

```typescript
return NextResponse.json({
  success: true,
  bookingId,
  reference: created?.reference ?? null,
  quoteId: savedQuote.id, // ✅ ADĂUGAT
  amount_total_pence: savedQuote.total_pence, // ✅ DIN QUOTE, NU CALCULATION
  currency: created?.currency ?? 'GBP',
});
```

---

### 3️⃣ VANTAGE-LANE-2.0 - `/api/stripe/payment-intent`

**Fișier:** `/src/app/api/stripe/payment-intent/route.ts`

**Modificare:** Citește amount din `client_booking_quotes`, NU din request body

**Location:** Înlocuiește liniile 81-87

```typescript
// ❌ ȘTERS: Get amount from frontend
// const rawAmount = body?.amount ?? body?.amount_total_pence;
// const amount = Number(rawAmount);

// ✅ NOU: Get amount from client_booking_quotes
const { data: quote, error: quoteError } = await supabaseAdmin
  .from('client_booking_quotes')
  .select('id, total_pence, quote_valid_until, is_locked, version')
  .eq('booking_id', bookingId)
  .order('version', { ascending: false })
  .limit(1)
  .single();

if (quoteError || !quote) {
  return NextResponse.json(
    {
      error: 'No valid pricing quote found for this booking',
      details: 'Please complete booking creation first',
    },
    { status: 400 }
  );
}

// Verificare expirare quote (dacă e setat)
if (quote.quote_valid_until) {
  const expiresAt = new Date(quote.quote_valid_until);
  if (expiresAt < new Date()) {
    return NextResponse.json(
      {
        error: 'Pricing quote has expired',
        details: 'Please restart booking process for updated pricing',
      },
      { status: 410 } // Gone
    );
  }
}

// Verificare lock (future implementation)
if (quote.is_locked) {
  return NextResponse.json(
    {
      error: 'Quote is locked',
      details: 'A payment is already in progress',
    },
    { status: 409 } // Conflict
  );
}

const amount = quote.total_pence; // ✅ SOURCE OF TRUTH FROM DB!

// Validare amount (sanity check)
if (!Number.isInteger(amount) || amount <= 0) {
  return NextResponse.json(
    {
      error: 'Invalid quote amount',
      details: `Quote total: ${amount} pence is invalid`,
    },
    { status: 500 }
  );
}
```

**Bonus - Optional Lock Quote (future):**

```typescript
// După crearea payment intent, lock quote
await supabaseAdmin
  .from('client_booking_quotes')
  .update({
    is_locked: true,
    locked_at: new Date().toISOString(),
  })
  .eq('id', quote.id);
```

---

## 🧪 TESTING WORKFLOW

### Local Testing (Pre-Deploy)

**1. Start Backend Local:**

```bash
cd /Users/cristianmacbookpro/CascadeProjects/Backend-VantageLane-
npm run dev  # Port 3001
```

**2. Set Environment Variable în vantage-lane-2.0:**

```bash
# .env.local
PRICING_API_URL=http://localhost:3001
```

**3. Start vantage-lane-2.0:**

```bash
cd /Users/cristianmacbookpro/CascadeProjects/vantage-lane-2.0
npm run dev  # Port 3000
```

**4. Test Flow Complet:**

- Create booking → verify `client_booking_quotes` created
- Check DB: `SELECT * FROM client_booking_quotes ORDER BY created_at DESC LIMIT 1;`
- Verify: `total_pence` populated
- Verify: `pricing_version_id` NOT NULL
- Attempt payment → verify amount matches quote

---

## 🚀 DEPLOY WORKFLOW

### Backend-VantageLane- Deploy

```bash
cd /Users/cristianmacbookpro/CascadeProjects/Backend-VantageLane-

# 1. Create feature branch
git checkout -b fix/pricing-version-id-response

# 2. Make changes
# ... modify PricingController.ts

# 3. Commit
git add .
git commit -m "fix: expose pricing_version_id in API response"

# 4. Push to GitHub
git push origin fix/pricing-version-id-response

# 5. Test pe branch în Render (dacă Render suportă branch deploys)
# SAU merge direct după code review

# 6. Merge to main
git checkout main
git merge fix/pricing-version-id-response
git push origin main

# 7. Render auto-deploy from main branch
```

### vantage-lane-2.0 Deploy

```bash
cd /Users/cristianmacbookpro/CascadeProjects/vantage-lane-2.0

# 1. Create feature branch
git checkout -b fix/quote-mandatory-payment-validation

# 2. Make changes
# ... modify /api/bookings and /api/stripe/payment-intent

# 3. Update environment variable
# Production .env must have:
# PRICING_API_URL=https://backend-vantagelane.onrender.com

# 4. Commit
git add .
git commit -m "fix: enforce client_booking_quotes + validate payment from quote"

# 5. Push și deploy
git push origin fix/quote-mandatory-payment-validation

# 6. Merge după testing
```

---

## ✅ ACCEPTANCE CRITERIA

### Înainte de merge:

**Backend:**

- [ ] `pricing_version_id` returnat în response
- [ ] Backend tests pass
- [ ] API documentation updated

**vantage-lane-2.0:**

- [ ] `client_booking_quotes` created pentru TOATE bookings noi
- [ ] Coverage crește de la 9% la 100% pentru new bookings
- [ ] Payment amount citește din `quote.total_pence`, NU din request
- [ ] Validation quote expiry funcționează
- [ ] Error messages clare pentru missing/expired quotes

**Testing:**

- [ ] Test local: booking creation → quote saved
- [ ] Test local: payment intent → amount din quote
- [ ] Test local: expired quote → 410 error
- [ ] Test local: missing quote → 400 error
- [ ] DB check: `pricing_version_id` NOT NULL în new quotes

---

## 🚨 ROLLBACK PLAN

Dacă ceva se strică:

**Backend:**

```bash
git revert HEAD
git push origin main
# Render auto-deploy previous version
```

**vantage-lane-2.0:**

```bash
git revert HEAD
git push origin main
# Vercel/deploy auto-deploy previous version
```

**DB Cleanup (dacă e nevoie):**

```sql
-- Dacă trebuie să revenim, quotes parțiale pot fi păstrate
-- Nu ștergem nimic, doar marcăm ca invalid
UPDATE client_booking_quotes
SET deleted_at = NOW()
WHERE pricing_version_id IS NULL
  AND created_at > '2026-03-17 05:00:00';
```

---

## 📊 SUCCESS METRICS

**Post-Deploy (după 24h):**

- [ ] Coverage `client_booking_quotes`: 9% → 100% pentru new bookings
- [ ] Zero payment intents cu amount din frontend
- [ ] Zero Stripe payments cu amount mismatch
- [ ] `pricing_version_id` populated în 100% new quotes

**Monitoring:**

```sql
-- Quote coverage pentru bookings noi
SELECT
  COUNT(DISTINCT b.id) as total_bookings,
  COUNT(DISTINCT q.booking_id) as bookings_with_quotes,
  ROUND(COUNT(DISTINCT q.booking_id)::numeric / NULLIF(COUNT(DISTINCT b.id), 0) * 100, 2) as coverage_percent
FROM bookings b
LEFT JOIN client_booking_quotes q ON q.booking_id = b.id
WHERE b.created_at > '2026-03-17 05:00:00';

-- Pricing version tracking
SELECT
  COUNT(*) as total_quotes,
  COUNT(pricing_version_id) as with_version_id,
  ROUND(COUNT(pricing_version_id)::numeric / NULLIF(COUNT(*), 0) * 100, 2) as version_coverage
FROM client_booking_quotes
WHERE created_at > '2026-03-17 05:00:00';
```

---

## 🎯 NEXT PHASES (DUPĂ FIX ATOMIC)

**Faza 2:** Link internal_booking_financials cu quote
**Faza 3:** Implement quote locking mechanism
**Faza 4:** Premium services în pricing engine
**Faza 5:** Extended discount framework

**Dar ACUM:** Focus 100% pe nucleu - quote mandatory + payment validation!
