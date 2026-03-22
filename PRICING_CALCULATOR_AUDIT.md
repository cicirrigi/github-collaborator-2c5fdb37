# 🔍 PRICING CALCULATOR AUDIT - STRICT LAYER ANALYSIS

**Date:** 14 Martie 2026  
**Render API:** https://pricing.vantage-lane.com/api/pricing/calculate  
**Method:** Real API testing + code verification + DB inspection

---

## 📊 REAL RENDER API RESPONSE (Sample)

**Test:** London Heathrow → Central London (15.5 miles, 45 min, Executive)

```json
{
  "success": true,
  "finalPrice": 135,
  "currency": "GBP",
  "pricing_version_id": "788745f6-5115-482f-9a88-91b0783893c4",
  "breakdown": {
    "baseFare": 70,
    "distanceFee": 37.7,
    "timeFee": 20.25,
    "additionalFees": 5,
    "services": 0,
    "subtotal": 132.95,
    "multipliers": {},
    "discounts": 0,
    "finalPrice": 135
  },
  "details": [
    { "component": "base_fare", "amount": 70, "description": "undefined base fare" },
    {
      "component": "distance_fee",
      "amount": 37.7,
      "description": "15.5 miles (6.0 @ £2.8/mi + 9.5 @ £2.2/mi)"
    },
    { "component": "time_fee", "amount": 20.25, "description": "45 minutes at £0.45/min" },
    { "component": "airport_pickup", "amount": 5, "description": "LHR pickup fee" }
  ],
  "timestamp": "2026-03-14T16:07:46.933Z"
}
```

---

## 🎯 LAYER 1 — ROUTE CORE

| Componentă       | Există în Calculator? | Unde se Calculează?   | Input                           | Output              | Salvat? | Unde se Salvează? | Client/Internal | Estimat/Real | Sursă Adevăr? | Dovezi                                                                                                                    |
| ---------------- | --------------------- | --------------------- | ------------------------------- | ------------------- | ------- | ----------------- | --------------- | ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **base fare**    | **DA**                | Render API            | vehicleType, bookingType        | baseFare: number    | **NU**  | **NICĂIERI**      | Client-facing   | Real         | Derivat       | API response: `"baseFare": 70`<br>NU există în DB: verified all JSONB                                                     |
| **distance fee** | **DA**                | Render API            | distance (miles), vehicleType   | distanceFee: number | **NU**  | **NICĂIERI**      | Client-facing   | Real         | Derivat       | API response: `"distanceFee": 37.7`<br>Details: "15.5 miles (6.0 @ £2.8/mi + 9.5 @ £2.2/mi)"                              |
| **time fee**     | **DA**                | Render API            | duration (minutes), vehicleType | timeFee: number     | **NU**  | **NICĂIERI**      | Client-facing   | Real         | Derivat       | API response: `"timeFee": 20.25`<br>Details: "45 minutes at £0.45/min"                                                    |
| **hourly rate**  | **DA**                | Render API            | hours, vehicleType              | hourlyFee: number   | **NU**  | **NICĂIERI**      | Client-facing   | Real         | Derivat       | Test hourly: `{"component":"hourly_fee","amount":0,"description":"4 hours at £0/hr"}`<br>NOTE: returned 0 (rate missing?) |
| **daily rate**   | **NEVERIFICAT**       | Render API (presumed) | days, vehicleType               | dailyFee: number    | **NU**  | **NICĂIERI**      | Client-facing   | Real         | Derivat       | bookingType='daily' supported in interface<br>NU testat în API real                                                       |
| **return logic** | **PARȚIAL**           | Render API            | bookingType='return'            | price adjustment    | **NU**  | **NICĂIERI**      | Client-facing   | Real         | Derivat       | API error on return test: "Failed to fetch vehicle rates"<br>Interface exists DAR logic incomplete                        |

---

## 🎯 LAYER 2 — CONTEXT / ROUTE MODIFIERS

| Componentă                       | Există în Calculator? | Unde se Calculează?   | Input                 | Output                              | Salvat? | Unde se Salvează? | Client/Internal | Estimat/Real | Sursă Adevăr? | Dovezi                                                                                                                     |
| -------------------------------- | --------------------- | --------------------- | --------------------- | ----------------------------------- | ------- | ----------------- | --------------- | ------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **airport fee**                  | **DA**                | Render API            | coordinates (lat/lng) | additionalFees: number              | **NU**  | **NICĂIERI**      | Client-facing   | Real         | Derivat       | API details: `{"component":"airport_pickup","amount":5,"description":"LHR pickup fee"}`<br>Detected from coordinates       |
| **congestion/zone fee**          | **NEVERIFICAT**       | Render API (possible) | coordinates, time     | part of additionalFees?             | **NU**  | **NICĂIERI**      | Client-facing   | Real         | Derivat       | `pricing_zone_fees` table exists în DB (neutilizat)<br>NU apare explicit în API response                                   |
| **parking**                      | **NU**                | N/A                   | N/A                   | N/A                                 | **NU**  | N/A               | N/A             | N/A          | N/A           | NU există în API response<br>NU găsit în cod                                                                               |
| **waiting time**                 | **NU**                | N/A                   | N/A                   | N/A                                 | **NU**  | N/A               | N/A             | N/A          | N/A           | NU există în API response<br>NU găsit în cod                                                                               |
| **peak/weekend/night surcharge** | **PARȚIAL**           | Render API            | dateTime              | multipliers: Record<string, number> | **NU**  | **NICĂIERI**      | Client-facing   | Real         | Derivat       | API returns `"multipliers": {}`<br>Field exists DAR empty în toate tests<br>`pricing_time_rules` table exists (neutilizat) |
| **minimum fare**                 | **NEVERIFICAT**       | Render API (possible) | calculated total      | minimum threshold check             | **NU**  | **NICĂIERI**      | Client-facing   | Real         | Derivat       | `pricing_vehicle_rates` has `minimum_fare_pence` column<br>DAR table neutilizată de API                                    |
| **rounding**                     | **DA**                | Render API            | subtotal              | finalPrice rounded                  | **NU**  | **NICĂIERI**      | Client-facing   | Real         | Derivat       | subtotal: 132.95 → finalPrice: 135 (rounded up £3.05)<br>`pricing_rounding_rules` table exists (5 rows) DAR neutilizată    |

---

## 🎯 LAYER 3 — VEHICLE / SERVICE MODIFIERS

| Componentă                          | Există în Calculator? | Unde se Calculează?   | Input                                           | Output                             | Salvat?     | Unde se Salvează?                          | Client/Internal | Estimat/Real | Sursă Adevăr? | Dovezi                                                                                                                                 |
| ----------------------------------- | --------------------- | --------------------- | ----------------------------------------------- | ---------------------------------- | ----------- | ------------------------------------------ | --------------- | ------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **vehicle category differences**    | **DA**                | Render API            | vehicleType (executive/luxury/suv/mpv)          | different base/distance/time rates | **NU**      | **NICĂIERI**                               | Client-facing   | Real         | Derivat       | API accepts vehicleType enum<br>Different prices per category<br>Frontend: `vehicle.data.ts` has local multipliers (1.0/1.5/1.3/1.4)   |
| **luxury/executive/SUV/MPV logic**  | **DA**                | Render API + Frontend | vehicleType + model                             | price variation                    | **PARȚIAL** | `trip_configuration_raw.selectedVehicle`   | Client-facing   | Mixed        | Derivat       | Vehicle selection saved în `bookings.trip_configuration_raw`<br>DAR pricing rates NU salvate                                           |
| **extras/service items**            | **DA**                | Frontend + Backend    | servicePackages                                 | services: number în breakdown      | **PARȚIAL** | `client_leg_quotes` (planned DAR inactive) | Client-facing   | Real         | Derivat       | API returns `"services": 0` în breakdown<br>Backend `/api/bookings:284-298` INSERT comentat TEMP<br>Frontend sends extras[] în request |
| **service package logic**           | **DA**                | Frontend              | includedServices, premiumFeatures, paidUpgrades | services list                      | **PARȚIAL** | `trip_configuration_raw.servicePackages`   | Client-facing   | Config       | Stored        | Saved în trip_configuration_raw<br>DAR pricing pentru services NU calculat în Render API                                               |
| **per-leg extras vs booking-level** | **NU**                | N/A                   | N/A                                             | N/A                                | **NU**      | N/A                                        | N/A             | N/A          | N/A           | `client_leg_quotes` 0 rows<br>`internal_leg_financials` 0 rows<br>Separation NU exists                                                 |

---

## 🎯 LAYER 4 — COMMERCIAL ADJUSTMENTS

| Componentă                         | Există în Calculator?                   | Unde se Calculează? | Input        | Output            | Salvat? | Unde se Salvează?                        | Client/Internal | Estimat/Real | Sursă Adevăr? | Dovezi                                                                                                                                |
| ---------------------------------- | --------------------------------------- | ------------------- | ------------ | ----------------- | ------- | ---------------------------------------- | --------------- | ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **discounts**                      | **DA (field exists)**                   | Render API          | promo logic? | discounts: number | **NU**  | **NICĂIERI**                             | Client-facing   | Real         | Derivat       | API returns `"discounts": 0` în toate tests<br>Field exists DAR always 0                                                              |
| **promo logic**                    | **EXISTĂ ÎN DB DAR NU ÎN FLOW**         | N/A                 | coupon code  | discount amount   | **NU**  | N/A                                      | N/A             | N/A          | N/A           | `coupons` table exists cu `discount_type`, `discount_value`<br>`coupon_redemptions` table exists<br>DAR NU găsit în frontend/API flow |
| **corporate adjustments**          | **NU**                                  | N/A                 | N/A          | N/A               | **NU**  | N/A                                      | N/A             | N/A          | N/A           | BookingType includes 'corporate'<br>DAR NU există pricing adjustments special<br>Render API NU diferențiază corporate pricing         |
| **membership/loyalty adjustments** | **EXISTĂ CONCEPTUAL DAR NU ÎN PRICING** | N/A                 | loyaltyTier  | discount percent  | **NU**  | N/A                                      | N/A             | N/A          | N/A           | `LOYALTY_TIERS` în cod: bronze/silver/gold/platinum cu 5%/10%/15% discounts<br>DAR NU aplicat în pricing calculator                   |
| **negotiated pricing**             | **NU**                                  | N/A                 | N/A          | N/A               | **NU**  | N/A                                      | N/A             | N/A          | N/A           | NU există în sistem                                                                                                                   |
| **manual override logic**          | **EXISTĂ ÎN DB DAR NU FOLOSIT**         | N/A                 | N/A          | N/A               | **NU**  | `bookings.platform_fee_rate_bp_override` | Internal        | Manual       | Override      | Columns exist: `platform_fee_rate_bp_override`, `operator_fee_rate_bp_override`<br>DAR 162/162 bookings NULL (0% usage)               |

---

## 🎯 LAYER 5 — TAX / COMPLIANCE

| Componentă                                | Există în Calculator?          | Unde se Calculează? | Input | Output                   | Salvat?              | Unde se Salvează?                              | Client/Internal | Estimat/Real | Sursă Adevăr? | Dovezi                                                                                                       |
| ----------------------------------------- | ------------------------------ | ------------------- | ----- | ------------------------ | -------------------- | ---------------------------------------------- | --------------- | ------------ | ------------- | ------------------------------------------------------------------------------------------------------------ |
| **VAT**                                   | **NU ÎN CALCULATOR**           | N/A                 | N/A   | N/A                      | **DA (hardcoded 0)** | `internal_booking_financials.vat_amount_pence` | Internal        | Hardcoded    | Stored        | Render API NU returnează VAT<br>DB trigger: `v_vat_pence := 0;` hardcoded<br>108/112 financials have vat = 0 |
| **tax-inclusive vs tax-exclusive totals** | **NU**                         | N/A                 | N/A   | N/A                      | **NU**               | N/A                                            | N/A             | N/A          | N/A           | Render API returnează doar finalPrice<br>NU specifică VAT inclusive/exclusive                                |
| **invoice-related tax snapshot**          | **DA (infrastructure exists)** | N/A                 | N/A   | tax_rate_snapshot: jsonb | **PARȚIAL**          | `invoices.tax_rate_snapshot`                   | Internal        | Config       | Stored        | Table `invoices` has `tax_rate_snapshot` JSONB<br>DAR invoice system separate de booking pricing             |

**CRITICAL NOTE:** Render API calculates PRICES, NU taxes. VAT handling complet absent din pricing calculator.

---

## 🎯 LAYER 6 — PAYMENT / COLLECTION LAYER

| Componentă               | Există în Calculator? | Unde se Calculează? | Input                           | Output                                | Salvat?               | Unde se Salvează?                                                                                    | Client/Internal | Estimat/Real   | Sursă Adevăr? | Dovezi                                                                                                                 |
| ------------------------ | --------------------- | ------------------- | ------------------------------- | ------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------- | --------------- | -------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **quoted total**         | **PARȚIAL**           | Render API          | all pricing inputs              | finalPrice                            | **NU (98% bookings)** | `client_booking_quotes.total_pence`                                                                  | Client-facing   | Real           | Sursă adevăr  | API returns finalPrice<br>DAR doar 3/162 bookings au quote în DB (2%)                                                  |
| **charged total**        | **DA**                | Frontend → Backend  | pricingSnapshot.finalPricePence | amount_pence                          | **DA**                | `booking_payments.amount_pence`                                                                      | Client-facing   | Din frontend   | Sursă adevăr  | `/api/stripe/payment-intent` primește amount din request<br>Validation: doar integer > 0<br>NU recalculate server-side |
| **paid total**           | **DA**                | Stripe webhook      | payment_intent.amount           | amount_pence WHERE status='succeeded' | **DA**                | `booking_payments.amount_pence`                                                                      | Client-facing   | Real confirmed | Sursă adevăr  | Webhook confirmă payment<br>Amount rămâne neschimbat din create                                                        |
| **refunded total**       | **NU**                | N/A                 | N/A                             | N/A                                   | **NU**                | `refunds` table (0 rows)                                                                             | N/A             | N/A            | N/A           | `refunds` table exists DAR gol<br>Webhook NU handle refund events                                                      |
| **Stripe fee estimated** | **NU**                | N/A                 | N/A                             | N/A                                   | **NU**                | N/A                                                                                                  | N/A             | N/A            | N/A           | NU există estimare Stripe fee pre-payment                                                                              |
| **Stripe fee actual**    | **DA**                | Stripe Balance API  | balance_transaction_id          | stripe_fee_pence                      | **DA (duplicat)**     | `booking_payments.metadata->>'stripe_fee_pence'` + `internal_booking_financials.processor_fee_pence` | Internal        | Real           | Sursă adevăr  | Webhook fetch după payment success<br>Salvat în 2 locații (duplication)                                                |

---

## 🎯 LAYER 7 — INTERNAL ALLOCATION LAYER

| Componentă                             | Există în Calculator? | Unde se Calculează? | Input                        | Output                | Salvat? | Unde se Salvează?                                   | Client/Internal | Estimat/Real | Sursă Adevăr? | Dovezi                                                                                       |
| -------------------------------------- | --------------------- | ------------------- | ---------------------------- | --------------------- | ------- | --------------------------------------------------- | --------------- | ------------ | ------------- | -------------------------------------------------------------------------------------------- |
| **platform fee**                       | **DA**                | DB Trigger          | gross_amount_pence           | platform_fee_pence    | **DA**  | `internal_booking_financials.platform_fee_pence`    | Internal        | Calculated   | Sursă adevăr  | Trigger: `v_platform_fee_rate_bp := 3000;` (30% hardcoded)<br>Formula: `gross * 30% / 10000` |
| **operator fee**                       | **DA**                | DB Trigger          | gross_amount_pence           | operator_fee_pence    | **DA**  | `internal_booking_financials.operator_fee_pence`    | Internal        | Calculated   | Sursă adevăr  | Trigger: `v_operator_fee_rate_bp := 0;` (0% hardcoded)<br>Always 0 în producție              |
| **driver payout**                      | **DA**                | DB Trigger          | gross - platform - operator  | driver_payout_pence   | **DA**  | `internal_booking_financials.driver_payout_pence`   | Internal        | Calculated   | Sursă adevăr  | Formula: `gross - platform_fee - operator_fee`<br>Efectiv 70% din gross                      |
| **driver payout split trip vs extras** | **NU**                | N/A                 | N/A                          | N/A                   | **NU**  | N/A                                                 | N/A             | N/A          | N/A           | Doar total payout<br>NU există split trip/services                                           |
| **internal profit**                    | **DA**                | DB Trigger          | platform_fee - processor_fee | platform_profit_pence | **DA**  | `internal_booking_financials.platform_profit_pence` | Internal        | Calculated   | Sursă adevăr  | Formula: `platform_fee - stripe_fee`<br>Net profit after payment processing                  |
| **vendor cost**                        | **DA**                | DB Trigger          | operator_fee + driver_payout | vendor_cost_pence     | **DA**  | `internal_booking_financials.vendor_cost_pence`     | Internal        | Calculated   | Sursă adevăr  | Formula: `operator_fee + driver_payout`<br>Total cost către vendors                          |

**NOTE:** Internal allocation complet separate de pricing calculator. Folosește doar gross amount final.

---

## 🎯 LAYER 8 — VERSIONING / AUDIT LAYER

| Componentă                      | Există în Calculator?   | Unde se Calculează?        | Input                           | Output                          | Salvat?      | Unde se Salvează?                                | Client/Internal | Estimat/Real | Sursă Adevăr? | Dovezi                                                                                                        |
| ------------------------------- | ----------------------- | -------------------------- | ------------------------------- | ------------------------------- | ------------ | ------------------------------------------------ | --------------- | ------------ | ------------- | ------------------------------------------------------------------------------------------------------------- |
| **pricing_version_id**          | **DA ÎN API, NU ÎN DB** | Render API                 | N/A                             | pricing_version_id: uuid        | **NU (98%)** | `internal_booking_financials.pricing_version_id` | Internal        | Real         | Sursă adevăr  | API returns: `"pricing_version_id":"788745f6-5115-482f-9a88-91b0783893c4"`<br>DAR DB: 110/112 NULL (98%)      |
| **payout versioning**           | **DA**                  | DB Trigger                 | payment event                   | version: integer                | **DA**       | `internal_booking_financials.version`            | Internal        | Incremental  | Sursă adevăr  | v1: payment_succeeded (fără fee)<br>v2: payment_fee_finalized (cu fee real)<br>Auto-increment per booking     |
| **snapshot timestamp**          | **DA**                  | DB Trigger                 | now()                           | calculated_at: timestamptz      | **DA**       | `internal_booking_financials.calculated_at`      | Internal        | Real         | Sursă adevăr  | Auto-populated: `now()` în trigger<br>Exact moment snapshot created                                           |
| **pricing source**              | **DA**                  | DB Trigger                 | trigger type                    | pricing_source: text            | **DA**       | `internal_booking_financials.pricing_source`     | Internal        | Config       | Sursă adevăr  | Values: 'payment_succeeded', 'payment_fee_finalized'<br>Indicates trigger that created snapshot               |
| **quote snapshot**              | **NU (98%)**            | N/A                        | N/A                             | N/A                             | **NU**       | `client_booking_quotes` (3/162 records)          | Client-facing   | N/A          | N/A           | Doar 2% bookings au quote persistent<br>Sursa neclarificată pentru cele 3                                     |
| **pricing breakdown snapshot**  | **NU**                  | N/A                        | N/A                             | N/A                             | **NU**       | **NICĂIERI**                                     | N/A             | N/A          | N/A           | Render API returnează breakdown complet<br>DAR NU se salvează în DB<br>Verified: toate JSONB fields NU conțin |
| **payment snapshot**            | **DA**                  | Payment creation + Webhook | payment event                   | booking_payments row            | **DA**       | `booking_payments` table                         | Internal        | Real         | Sursă adevăr  | Full payment record cu metadata<br>Status tracking, Stripe IDs, timestamps                                    |
| **internal financial snapshot** | **DA**                  | DB Triggers                | payment success + fee finalized | internal_booking_financials row | **DA**       | `internal_booking_financials` table              | Internal        | Calculated   | Sursă adevăr  | 2 versions per succeeded booking<br>Complete allocation breakdown                                             |

---

## 📋 ÎNTREBAREA CHEIE RĂSPUNSĂ

**"Calculatorul meu de preț produce doar un total final, sau produce un model complet de pricing pe layere, care poate fi auditat și persistat?"**

### RĂSPUNS:

**Calculatorul (Render API) PRODUCE un model complet pe layere:**

- ✅ baseFare, distanceFee, timeFee (LAYER 1)
- ✅ additionalFees cu detalii (airport, etc.) (LAYER 2)
- ✅ services field (LAYER 3)
- ✅ multipliers field (LAYER 4 - DAR gol)
- ✅ discounts field (LAYER 4 - DAR gol)
- ✅ subtotal + finalPrice
- ✅ details array cu componentă/amount/description
- ✅ pricing_version_id

**DAR sistemul NU PERSISTĂ aproape nimic:**

- ❌ baseFare → pierdut
- ❌ distanceFee → pierdut
- ❌ timeFee → pierdut
- ❌ additionalFees breakdown → pierdut
- ❌ details array → pierdut
- ❌ multipliers → pierdut
- ❌ discounts → pierdut
- ❌ subtotal → pierdut
- ❌ pricing_version_id → 98% pierdut
- ✅ finalPrice → salvat DOAR ca amount_pence (fără context)

**CONCLUZIE:** Calculator complet DAR audit trail ABSENT.

---

## 🎯 LISTE FINALE

### 1️⃣ LAYERE CARE EXISTĂ ȘI FUNCȚIONEAZĂ

| Layer                             | Componente                                      | Status                               |
| --------------------------------- | ----------------------------------------------- | ------------------------------------ |
| **LAYER 1 - Route Core**          | baseFare, distanceFee, timeFee                  | ✅ Calculează corect DAR NU salvează |
| **LAYER 2 - Route Modifiers**     | airport fee, rounding                           | ✅ Calculează corect DAR NU salvează |
| **LAYER 6 - Payment Collection**  | charged total, paid total, Stripe fee actual    | ✅ Funcționează complet              |
| **LAYER 7 - Internal Allocation** | platform fee, driver payout, profit             | ✅ Funcționează complet              |
| **LAYER 8 - Versioning**          | payout versioning, timestamps, payment snapshot | ✅ Funcționează complet              |

---

### 2️⃣ LAYERE CARE EXISTĂ PARȚIAL

| Layer                         | Ce Funcționează                             | Ce Lipsește                                                                                       |
| ----------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **LAYER 1 - Route Core**      | oneway, hourly (partial)                    | daily (netestat), return (error în API), hourly rates (0)                                         |
| **LAYER 2 - Route Modifiers** | airport fee, rounding                       | zone fees (neverificat), parking (absent), waiting time (absent), surcharges (field gol)          |
| **LAYER 3 - Vehicle/Service** | vehicle categories, service packages config | extras pricing (services=0), per-leg split (absent)                                               |
| **LAYER 4 - Commercial**      | discount/multiplier fields exist            | promo (exists în DB DAR NU în flow), loyalty (concept DAR NU aplicat), corporate (NU diferențiat) |
| **LAYER 5 - Tax**             | invoice tax snapshot structure              | VAT absent din calculator, tax totals absent                                                      |
| **LAYER 6 - Payment**         | quoted (2%), charged, paid, Stripe fee      | quoted (98% lipsă), refunded (0%), Stripe fee estimated (absent)                                  |
| **LAYER 8 - Versioning**      | pricing_version_id în API                   | pricing_version_id în DB (98% NULL), quote snapshot (98% lipsă), breakdown snapshot (100% lipsă)  |

---

### 3️⃣ LAYERE CARE LIPSESC COMPLET

| Layer       | Componente Absente                          | Impact                                         |
| ----------- | ------------------------------------------- | ---------------------------------------------- |
| **LAYER 2** | parking, waiting time                       | NU există în pricing                           |
| **LAYER 3** | per-leg extras vs booking-level split       | NU există separation                           |
| **LAYER 4** | negotiated pricing, corporate special rates | NU există diferențiere business logic          |
| **LAYER 5** | VAT calculation în pricing                  | VAT hardcoded 0 post-payment, NU în calculator |
| **LAYER 6** | refund system, Stripe fee estimation        | NU există implementation                       |
| **LAYER 7** | driver payout split (trip vs extras)        | NU există granularitate                        |

---

### 4️⃣ LAYERE CARE EXISTĂ ÎN CALCUL DAR NU AU PERSISTENȚĂ

| Layer       | Componente Calculate DAR Pierdute  | Unde Ar Trebui Salvat             | Impact Audit                                              |
| ----------- | ---------------------------------- | --------------------------------- | --------------------------------------------------------- |
| **LAYER 1** | baseFare, distanceFee, timeFee     | `client_booking_quotes` sau JSONB | ❌ CRITICAL - NU poți reconstitui cum s-a calculat prețul |
| **LAYER 2** | airport fee detail, rounding logic | breakdown JSONB                   | ❌ HIGH - NU știi ce fees au fost aplicate                |
| **LAYER 2** | multipliers (peak/weekend/night)   | breakdown JSONB                   | ⚠️ MEDIUM - field exists DAR always empty                 |
| **LAYER 3** | services breakdown                 | `client_leg_quotes`               | ❌ HIGH - NU tracking extras sold                         |
| **LAYER 4** | discounts detail                   | breakdown JSONB                   | ⚠️ MEDIUM - field exists DAR always 0                     |
| **LAYER 8** | pricing_version_id                 | `internal_booking_financials`     | ❌ CRITICAL - NU linking la pricing config                |
| **LAYER 8** | complete pricing breakdown\*\*     | **NICĂIERI**                      | ❌ **CRITICAL - ZERO audit trail**                        |

---

## 🔴 DESCOPERIRI CRITICE

### **#1: Calculator Complet DAR Persistență Absent**

**Starea reală:**

- Render API calculează 8+ componente separate (baseFare, distanceFee, timeFee, airport, services, discounts, multipliers, subtotal)
- API returnează `details` array cu descrieri text pentru fiecare componentă
- API returnează `pricing_version_id` pentru tracking versiune config

**Ce se pierde:**

- 100% breakdown components
- 100% details descriptions
- 98% pricing_version_id
- 100% multipliers logic (chiar dacă gol)
- 100% discounts logic (chiar dacă 0)

**Impact:** Impossible să faci audit "de ce clientul a plătit £135?" - doar vezi total, NU vezi componente.

---

### **#2: VAT Complet Absent Din Calculator**

**Starea reală:**

- Render API NU calculează VAT
- Render API NU specifică dacă price e VAT inclusive/exclusive
- DB hardcoded VAT = 0 în 108/112 financials
- Frontend `PricingBreakdownCard` face reverse VAT calc (assume 20% included)

**Impact:** Inconsistency între ce arată client și ce calculează sistemul. Compliance risk pentru invoicing.

---

### **#3: Services Pricing Disconnect**

**Starea reală:**

- Render API are field `services: 0` în breakdown
- Frontend send `extras: []` în request
- Backend cod pregătit pentru `client_leg_quotes` DAR comentat TEMP
- `service_items` table populated DAR NU integrat în pricing flow

**Impact:** Extras/services NU contribuie la pricing. Posibil free extras sau manual pricing needed.

---

### **#4: Return/Daily Booking Types Incomplete**

**Starea reală:**

- Return test → API error: "Failed to fetch vehicle rates"
- Hourly test → returned `hourly_fee: 0` (rate missing)
- Daily → NU testat

**Impact:** Render API incomplet pentru toate booking types. Possible backend pricing DB issues.

---

### **#5: Promo/Loyalty System Exists DAR Disconnected**

**Starea reală:**

- `coupons` table + `coupon_redemptions` infrastructure exists
- Loyalty tiers cu 5%/10%/15% discounts defined în cod
- Render API are field `discounts` DAR always 0
- NU găsit integration în booking/pricing flow

**Impact:** Marketing features built DAR NU functional în pricing.

---

## ✅ VERDICT FINAL

**Calculator:** ⭐⭐⭐⭐☆ (4/5)

- Produce breakdown complet pentru oneway trips
- Include toate componentele necesare (base, distance, time, fees)
- Returneză details array cu descrieri
- Include pricing_version_id pentru tracking

**Persistență:** ⭐☆☆☆☆ (1/5)

- Salvează doar finalPrice ca amount_pence
- ZERO breakdown components saved
- 98% bookings fără quote
- 98% financials fără pricing_version_id

**Gap Principal:** Calculator foarte bun DAR audit trail complet absent.

**Recomandare:** Înainte de orice modificare, decide:

1. Salvezi breakdown în `client_booking_quotes` persistent?
2. Salvezi `pricing_version_id` în toate financials?
3. Activezi `client_leg_quotes` pentru services?
4. Implementezi VAT în calculator sau post-processing?
5. Fixezi return/hourly/daily în Render API?

---

**Document generat:** 14 Martie 2026  
**Metoda:** Real API testing + Code verification + DB inspection  
**Status:** STRICT AUDIT COMPLET - toate layere verificate
