# 🔴 AUDIT CRITIC: PRICING & FINANCE SYSTEM

**Data Audit:** 11 Martie 2026  
**Severitate:** CRITICĂ - Probleme majore de consistență și duplicare  
**Status:** PRODUCTION BLOCKER - Necesită remediere imediată

---

## 📊 REZUMAT EXECUTIV

### Probleme Critice Identificate: 7

### Duplicări Majore: 5

### Inconsistențe VAT/Tax: 3

### Sisteme Paralele: 4

### Risc Financiar: **FOARTE RIDICAT** ⚠️

---

## 🚨 PROBLEMA #1: CONFLICT VAT RATE - CRITICAL

### Severitate: 🔴 CRITICAL - Risc de facturare incorectă

**SITUAȚIE ACTUALĂ:**

```typescript
// LOCAȚIE 1: types/booking/index.ts (LINE 171)
TAX_RATE: 0.18; // 18% VAT ❌

// LOCAȚIE 2: app/api/bookings/route.ts (LINE 280)
const vatRate = 0.2; // 20% VAT ❌

// LOCAȚIE 3: features/booking/components/PricingBreakdownCard.tsx (LINE 32)
const VAT_RATE = 0.2; // 20% VAT ❌

// LOCAȚIE 4: features/booking/wizard/components/step3/PaymentCard.tsx (LINE 327)
const subtotalNet = totalWithVat / 1.2; // Hardcoded 20% ❌
```

**IMPACT:**

- ❌ Calcule diferite în frontend vs backend
- ❌ UK VAT standard = 20%, dar BOOKING_CONSTANTS folosește 18%
- ❌ Client vede un preț, DB salvează altul
- ❌ Risc legal pentru TVA incorect

**CAUZA:**

- Zero single source of truth pentru VAT rate
- Hardcodare în 4+ locuri diferite
- Nu există config centralizat pentru taxes

**RECOMANDARE:**

```typescript
// Creează config centralizat
export const TAX_CONFIG = {
  UK_VAT_RATE: 0.2, // 20% - UK standard VAT
  VAT_INCLUSIVE: true,
  CURRENCY: 'GBP',
} as const;
```

---

## 🚨 PROBLEMA #2: SISTEME PARALELE DE PRICING - CRITICAL

### Severitate: 🔴 CRITICAL - Arhitectură fragmentată

**SISTEME IDENTIFICATE:**

### 1️⃣ Frontend Calculator (Legacy)

```typescript
// lib/booking/pricing/calculateBookingPricing.ts
- Folosește BOOKING_CONSTANTS.PRICING
- Calcul local în browser
- Nu se sincronizează cu DB
- TAX_RATE = 0.18 (GREȘIT!)
```

### 2️⃣ External Render API

```typescript
// lib/pricing/render-pricing.service.ts
- API extern pentru pricing real
- Proxy prin /api/pricing
- NOT USED în production flow
- Duplicate logic
```

### 3️⃣ DB Service Items Pricing

```typescript
// services/pricing/serviceItems.ts
- Prețuri din service_items table
- buildQuoteLineItems() + calculateQuoteTotal()
- DOAR pentru services (nu vehicle base fare)
```

### 4️⃣ Hardcoded în Booking API

```typescript
// app/api/bookings/route.ts (LINE 280-282)
const vatRate = 0.2;
const vatPence = Math.round(servicesSubtotal * vatRate);
const totalPence = servicesSubtotal + vatPence;
```

**PROBLEMA:**

- ❌ 4 sisteme diferite calculează pricing
- ❌ Nu comunică între ele
- ❌ Fiecare cu logica proprie
- ❌ Imposibil de menținut

**RECOMANDARE:**

- Elimină calculateBookingPricing.ts (deprecated)
- Unifică toată logica în Render API SAU DB-based
- Single source of truth pentru pricing

---

## 🚨 PROBLEMA #3: AMBIGUITATE AMOUNT FIELDS

### Severitate: 🟠 HIGH - Confuzie în flow-ul de plată

**CÂMPURI MULTIPLE:**

```typescript
// 1. În bookings API response
amount_total_pence: number; // Calculat server-side

// 2. În pricingSnapshot (frontend)
finalPricePence: number; // Poate diferi de DB

// 3. În Stripe payment intent
amount: number; // Venit din frontend body

// 4. În booking_payments table
amount_pence: number; // Storage pentru Stripe amount

// 5. În bookings table (DB_SCHEMA.md)
estimated_price: numeric; // NU se folosește
actual_price: numeric; // NU se folosește
```

**FLOW ACTUAL:**

```
Frontend → pricingSnapshot.finalPricePence
       ↓
POST /api/bookings → calculates amount_total_pence
       ↓
Frontend → amount_total_pence
       ↓
POST /api/stripe/payment-intent → amount (din body)
       ↓
Stripe PaymentIntent.amount
```

**PROBLEME:**

- ❌ Frontend trimite amount la Stripe (nu backend)
- ❌ bookings.estimated_price/actual_price NU se folosesc
- ❌ Confuzie între amount_total_pence și finalPricePence
- ❌ Multiple field names pentru același concept

**RECOMANDARE:**

- Standardizează: `total_amount_pence` peste tot
- Backend = single source pentru amount
- Elimină câmpuri nefolosite din bookings

---

## 🚨 PROBLEMA #4: BILLING vs PAYMENT CONFUSION

### Severitate: 🟠 HIGH - Suprapunere conceptuală

**TABELE PARALELE:**

### `billing` Table (DB_SCHEMA.md LINE 250-268)

```sql
- booking_id (UNIQUE)
- amount, tax_amount, discount_amount
- payment_status, payment_method
- invoice_number
```

### `booking_payments` Table (SQL migrations)

```sql
- booking_id (NOT unique - multiple attempts)
- stripe_payment_intent_id
- amount_pence
- status, idempotency_key
```

**CONFUZIE:**

- ❌ `billing.payment_status` vs `booking_payments.status`
- ❌ `billing.amount` vs `booking_payments.amount_pence`
- ❌ Două sisteme pentru aceeași funcționalitate?
- ❌ Nu e clar care e folosit în production

**OBSERVAȚIE:**

- `booking_payments` = activ în production (Stripe flow)
- `billing` = legacy? invoicing? nu e clar
- Fără foreign key între ele

**RECOMANDARE:**

- Clarifică: billing = invoicing, booking_payments = transactions
- SAU unifică într-un singur sistem
- Documentează separation of concerns

---

## 🚨 PROBLEMA #5: DUPLICATE VAT CALCULATION LOGIC

### Severitate: 🟡 MEDIUM - Code duplication

**LOCAȚII:**

### PricingBreakdownCard.tsx (LINE 36-51)

```typescript
const calculateVATBreakdown = () => {
  const subtotalNet = totalAmount / VAT_MULTIPLIER; // 1.2
  const vatAmount = totalAmount - subtotalNet;
  // ...reverse VAT calculation
};
```

### PaymentCard.tsx (LINE 314-369)

```typescript
const calculatePricingBreakdown = () => {
  const subtotalNet = totalWithVat / 1.2; // Hardcoded!
  const vatAmount = totalWithVat - subtotalNet;
  // ...EXACT same logic
};
```

**PROBLEME:**

- ❌ Același algoritm copiat în 2 fișiere
- ❌ Hardcoded 1.2 multiplier (20% VAT)
- ❌ Dacă VAT rate se schimbă → update în 2 locuri
- ❌ Zero reusability

**RECOMANDARE:**

```typescript
// utils/pricing/vat-calculator.ts
export function reverseVAT(totalInclusive: number, vatRate: number) {
  const multiplier = 1 + vatRate;
  const net = totalInclusive / multiplier;
  const vat = totalInclusive - net;
  return { net, vat, total: totalInclusive };
}
```

---

## 🚨 PROBLEMA #6: MISSING MODULARIZATION

### Severitate: 🟡 MEDIUM - Scalability issues

**PROBLEME ARHITECTURALE:**

### 1. Nu există serviciu centralizat de pricing

```
❌ calculateBookingPricing.ts - partial, outdated
❌ render-pricing.service.ts - nu e integrat
❌ Logic scattered în API routes
```

### 2. Tax logic hardcoded peste tot

```
❌ VAT calculation în 3+ componente
❌ No tax service/utility
❌ Multi-currency support absent
```

### 3. Billing logic în API route

```typescript
// app/api/bookings/route.ts (LINE 256-305)
// 50 linii de pricing logic DIRECT în route handler
// Imposibil de testat isolated
```

**CE LIPSEȘTE:**

```
📂 services/
  📂 pricing/
    - PricingService.ts (centralized)
    - TaxCalculator.ts (VAT, multi-region)
    - CurrencyConverter.ts (GBP/EUR/USD)
  📂 billing/
    - InvoiceGenerator.ts
    - PaymentProcessor.ts
```

---

## 🚨 PROBLEMA #7: DB SCHEMA INCONSISTENCIES

### Severitate: 🟡 MEDIUM - Data model issues

**CÂMPURI NEFOLOSITE:**

### bookings table (DB_SCHEMA.md)

```sql
estimated_price NUMERIC   -- ❌ NU se setează nicăieri
actual_price NUMERIC      -- ❌ NU se setează nicăieri
estimated_distance NUMERIC -- ❌ NU se folosește
estimated_duration INTERVAL -- ❌ NU se folosește
pricing_breakdown JSONB   -- ❌ NU se populează
```

**IMPACT:**

- ❌ Dead columns în production DB
- ❌ Confuzie despre ce field să folosești
- ❌ Migrations inutile
- ❌ Storage wasted

**CÂMPURI CARE SE FOLOSESC:**

```
✅ amount_total_pence (via API, nu direct în migration)
✅ currency
✅ billing_snapshot (recent adăugat)
```

---

## 📋 TABEL COMPARATIV: SISTEME DE PRICING

| Sistem                  | Locație                                 | VAT Rate | Used In Production | Status           |
| ----------------------- | --------------------------------------- | -------- | ------------------ | ---------------- |
| BOOKING_CONSTANTS       | `types/booking/index.ts`                | 18% ❌   | ❌ Nu              | Deprecated       |
| calculateBookingPricing | `lib/booking/pricing/`                  | 18% ❌   | ❌ Nu              | Legacy           |
| Render Pricing API      | `lib/pricing/render-pricing.service.ts` | Unknown  | ❌ Nu              | Not Integrated   |
| Service Items DB        | `services/pricing/serviceItems.ts`      | N/A      | ✅ Da              | Active (partial) |
| Booking API hardcoded   | `app/api/bookings/route.ts`             | 20% ✅   | ✅ Da              | Active           |
| Payment Card UI         | `PaymentCard.tsx`                       | 20% ✅   | ✅ Da              | Active           |

---

## 🎯 PRIORITIZARE PROBLEME

### 🔴 P0 - URGENT (Production Blocker)

1. **Conflict VAT Rate** - Uniformizează la 20% peste tot
2. **Sisteme Paralele** - Elimină calculateBookingPricing.ts
3. **Amount Ambiguity** - Single source în backend

### 🟠 P1 - HIGH (Această săptămână)

4. **Billing vs Payment** - Clarifică separation
5. **Duplicate VAT Logic** - Creează utility shared

### 🟡 P2 - MEDIUM (Următoarele 2 săptămâni)

6. **Missing Modularization** - Creează PricingService
7. **DB Schema Cleanup** - Elimină dead columns

---

## 🛠️ PLAN DE REMEDIERE

### FAZA 1: Tax Rate Fix (1-2 ore) 🔴

```typescript
// 1. Creează config/tax.config.ts
export const TAX_CONFIG = {
  UK_VAT_RATE: 0.2,
  EU_VAT_RATE: 0.21,
  DEFAULT_REGION: 'UK',
} as const;

// 2. Update BOOKING_CONSTANTS.PRICING.TAX_RATE = 0.20
// 3. Replace toate hardcoded 0.2 și 1.2 cu TAX_CONFIG
// 4. Test end-to-end pricing flow
```

### FAZA 2: Pricing Unification (1 zi) 🔴

```
1. Șterge calculateBookingPricing.ts (unused)
2. Move logic din API route în PricingService
3. Integrate Render API SAU DB-based pricing
4. Single source of truth pentru toate calculele
```

### FAZA 3: Amount Field Standardization (4 ore) 🟠

```
1. Rename: pricingSnapshot.finalPricePence → total_amount_pence
2. Backend calculates authoritative amount
3. Frontend read-only pentru amount
4. Stripe receives amount from backend validation
```

### FAZA 4: Billing Separation (1 zi) 🟡

```
1. Document: billing = invoicing, booking_payments = transactions
2. Create migration pentru foreign key dacă se leagă
3. SAU consider merge dacă e redundant
```

### FAZA 5: Code Modularization (2-3 zile) 🟡

```
1. Creează services/pricing/PricingService.ts
2. Creează utils/pricing/vat-calculator.ts
3. Extract billing logic din API routes
4. Unit tests pentru fiecare serviciu
```

---

## 📊 METRICI DE SUCCES

### Before

- ❌ 4 sisteme paralele de pricing
- ❌ 3 valori diferite pentru VAT (18%, 20%, hardcoded)
- ❌ 5+ field names pentru amount
- ❌ Logic scattered în 10+ fișiere
- ❌ Zero single source of truth

### After (Target)

- ✅ 1 sistem unificat de pricing
- ✅ 1 config centralizat pentru taxes
- ✅ 1 field standard: total_amount_pence
- ✅ Pricing logic în 1 serviciu modular
- ✅ Backend = authoritative source

---

## 🔒 RISCURI FINANCIARE

### Risc Actual: **FOARTE RIDICAT** ⚠️

**Scenarii Problematice:**

1. **VAT Mismatch**
   - Client vede £100 (cu 18% VAT)
   - Stripe charge £100 (cu 20% VAT)
   - Profit pierdut: £2 per booking
   - Legal risk: TVA incorect reportat

2. **Amount Discrepancy**
   - Frontend calculates £150
   - Backend calculates £155
   - Stripe receives £150
   - Business loss: £5 per booking

3. **Double Billing Systems**
   - billing table arată status X
   - booking_payments arată status Y
   - Customer service confusion
   - Potential refund disputes

---

## ✅ CHECKLIST IMPLEMENTARE

### Phase 1: Tax Config (P0)

- [ ] Creează `config/tax.config.ts` cu UK_VAT_RATE = 0.20
- [ ] Update `BOOKING_CONSTANTS.PRICING.TAX_RATE` la 0.20
- [ ] Replace hardcoded 0.2 în `app/api/bookings/route.ts`
- [ ] Replace hardcoded 1.2 în `PaymentCard.tsx`
- [ ] Replace hardcoded VAT_RATE în `PricingBreakdownCard.tsx`
- [ ] Test full booking flow cu pricing corect

### Phase 2: Cleanup (P0)

- [ ] Delete `lib/booking/pricing/calculateBookingPricing.ts`
- [ ] Delete `lib/booking/pricing/estimateDistanceFare.ts`
- [ ] Remove imports din componente
- [ ] Verify no broken references

### Phase 3: Pricing Service (P1)

- [ ] Creează `services/pricing/PricingService.ts`
- [ ] Move calculation logic din API routes
- [ ] Integrate cu service_items DB lookups
- [ ] Add unit tests pentru PricingService

### Phase 4: VAT Utilities (P1)

- [ ] Creează `utils/pricing/vat-calculator.ts`
- [ ] Extract duplicate VAT logic
- [ ] Update PricingBreakdownCard să folosească utility
- [ ] Update PaymentCard să folosească utility

### Phase 5: Documentation (P2)

- [ ] Document billing vs booking_payments separation
- [ ] Update DB_SCHEMA.md cu current usage
- [ ] Mark deprecated columns
- [ ] API documentation pentru pricing endpoints

---

## 📝 CONCLUZII

### Situația Actuală: **NESUSTENABILĂ** 🚨

Sistemul actual de pricing și finanțe prezintă:

- **Riscuri financiare critice** (VAT inconsistent)
- **Arhitectură fragmentată** (4 sisteme paralele)
- **Code duplication masivă** (VAT calculation în 3+ locuri)
- **Lack of single source of truth** (amount fields peste tot)

### Recomandare: **REFACTORING URGENT** 🔧

Necesită remediere IMEDIATĂ înainte de scaling sau production load crescut.
Estimate: **5-7 zile engineer** pentru remediere completă.

### Next Steps:

1. ✅ Audit completat
2. ⏳ Review cu echipa engineering
3. ⏳ Prioritize P0 fixes (Tax + Cleanup)
4. ⏳ Plan sprint pentru P1/P2 items

---

**Audit realizat de:** Cascade AI  
**Data:** 11 Martie 2026  
**Contact pentru clarificări:** Engineering Team
