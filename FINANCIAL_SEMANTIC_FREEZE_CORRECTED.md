# 🔒 PHASE 1: SEMANTIC FREEZE - CORRECTED DEFINITIONS

**NO CODE | NO MIGRATIONS | NO DB CHANGES | DEFINITIONS ONLY**

**Status:** 🟡 CORRECTED - Semantic definitions revised per business clarifications

---

## OFFICIAL CONFIRMATION

### ✅ Primary Booking Financial Snapshot Table

**`internal_booking_financials`** is confirmed as the main booking financial snapshot table.

**Decision:** ✅ **KEEP AND EXTEND**

---

## PART 1: EXISTING COLUMNS - CORRECTED SEMANTIC DEFINITIONS

### 1. `driver_payout_pence` ✅ FROZEN

**Current Behavior:**

```typescript
driver_payout_pence = subtotal_ex_vat - platform_fee - operator_fee;
```

**FINAL SEMANTIC DEFINITION:**

**`driver_payout_pence` = CALCULATED TARGET PAYOUT TO DRIVER**

**Business Meaning:**

- This is the **business supply cost** paid to the driver/vendor
- Calculated at booking confirmation time based on commission split
- Represents what the **business pays** to the driver for service delivery
- This is the **vendor cost from business perspective**
- Does NOT represent driver's internal economic cost (fuel, wear, etc.)
- Does NOT include post-booking adjustments (tips, bonuses, penalties)

**Critical Distinction:**

- `driver_payout_pence` = What **business pays** driver (supply cost)
- `driver_estimated_cost_pence` = What **driver spends** to deliver service (driver's internal cost)

**Use Cases:**

- Business cost of service delivery
- Vendor payment baseline
- Commission calculation audit trail
- Financial planning

**DECISION:** ✅ **KEEP** - Clear purpose as calculated target payout (business supply cost to driver)

**Documentation:**

- Add comment: "Calculated target payout to driver based on commission split. Represents business supply cost. Does not reflect driver's internal operating costs or final executed payout with adjustments."

---

### 2. `vendor_cost_pence` ✅ FROZEN

**Current Behavior:**

```typescript
vendor_cost_pence = driver_payout_pence;
```

**FINAL SEMANTIC DEFINITION:**

**`vendor_cost_pence` = BUSINESS SUPPLY COST TO VENDOR/DRIVER**

**Business Meaning:**

- This represents the **cost to the business** for service delivery
- In current model: vendor = driver
- Equals `driver_payout_pence` (what business pays driver)
- This is **NOT** the driver's internal operating cost (fuel, maintenance, etc.)
- This is the **business's cost of goods sold (COGS)** for the booking
- Represents the **supply-side payment** from business to service provider

**Critical Distinction:**

- `vendor_cost_pence` = Business's cost to acquire service (what we pay vendor)
- `driver_estimated_cost_pence` = Driver's cost to deliver service (what driver spends)

**Example:**

- Business pays driver £300 → `vendor_cost_pence` = £300
- Driver spends £50 on fuel → `driver_estimated_cost_pence` = £50
- Driver's margin = £300 - £50 = £250

**Use Cases:**

- Business COGS tracking
- Gross margin calculation (revenue - vendor_cost)
- Accounting cost allocation
- Profitability analysis from business perspective

**DECISION:** ✅ **KEEP** - Clear purpose as business supply cost

**Documentation:**

- Add comment: "Business supply cost to vendor/driver. Represents what business pays for service delivery. In current model, equals driver_payout_pence. NOT the driver's internal operating cost."

---

### 3. `platform_profit_pence` ⚠️ NOT FROZEN

**Current Behavior:**

```typescript
platform_profit_pence = platform_fee_pence;
```

**Current Status:** AMBIGUOUS - Semantic meaning not finalized

**What It Currently Represents:**

- Set equal to platform fee
- Does NOT deduct any costs
- Unclear if this should be gross margin, contribution margin, or net margin

**SEMANTIC STATUS:** ⚠️ **DEPRECATED / AMBIGUOUS**

**Business Questions Still Open:**

1. Should this be gross margin (before all costs)?
2. Should this be contribution margin (after processor fee)?
3. Should this be net margin (after all costs)?
4. Or should this column be deprecated entirely?

**DECISION:** ⚠️ **DO NOT FREEZE YET**

**Likely Future Approach:**

- Deprecate `platform_profit_pence` (ambiguous term)
- Add explicit columns:
  - `platform_gross_margin_pence` = platform_fee_pence
  - `platform_contribution_margin_pence` = platform_fee_pence - processor_fee_pence
  - `platform_net_margin_pence` = platform_fee_pence - processor_fee_pence - allocated_overhead_pence

**Action:** Mark as ambiguous, do not use for new logic until business definition finalized

---

### 4. `net_collected_pence` ✅ FROZEN

**Current Behavior:**

```typescript
net_collected_pence = gross_amount_pence; // Placeholder
```

**FINAL SEMANTIC DEFINITION:**

**`net_collected_pence` = NET AMOUNT AFTER PROCESSOR FEE**

**Business Meaning:**

- This represents the **actual cash received** in bank account
- Equals gross amount charged MINUS processor fee (Stripe)
- Represents **net revenue** after payment processing costs
- Updated after payment success webhook

**Calculation:**

```typescript
net_collected_pence = gross_amount_pence - processor_fee_pence;
```

**Use Cases:**

- Cash flow tracking
- Actual revenue reporting
- Bank reconciliation
- Net revenue analysis

**DECISION:** ✅ **KEEP** - Clear purpose

**Integration Needed:** Update from `booking_payments.net_amount_pence` after payment webhook

---

### 5. `net_to_platform_pence` ⚠️ NOT FROZEN

**Current Behavior:**

```typescript
net_to_platform_pence = platform_fee_pence; // Placeholder
```

**Current Status:** AMBIGUOUS - Processor fee allocation policy not decided

**What It Currently Represents:**

- Currently set to platform fee
- Unclear how processor fee should be allocated

**SEMANTIC STATUS:** ⚠️ **NOT FROZEN - BUSINESS DECISION REQUIRED**

**Business Questions Still Open:**

1. Who bears the processor fee?
   - Platform only?
   - Split between platform/operator/driver?
   - Proportional to revenue share?

2. What does "net to platform" mean?
   - Platform fee minus platform's share of processor fee?
   - Platform fee minus entire processor fee?
   - Platform fee minus processor fee minus overhead?

**Possible Calculations (depends on policy):**

**Option A: Platform bears full processor fee**

```typescript
net_to_platform_pence = platform_fee_pence - processor_fee_pence;
```

**Option B: Processor fee split proportionally**

```typescript
platform_share_of_processor_fee =
  processor_fee_pence * (platform_fee_pence / subtotal_ex_vat_pence);
net_to_platform_pence = platform_fee_pence - platform_share_of_processor_fee;
```

**Option C: No processor fee deduction**

```typescript
net_to_platform_pence = platform_fee_pence;
```

**DECISION:** ⚠️ **DO NOT FREEZE YET**

**Required:** Business decision on processor fee allocation policy

**Action:** Mark as ambiguous, do not implement calculation until policy decided

---

### 6. `net_to_operator_pence` ⚠️ NOT FROZEN

**Current Behavior:**

```typescript
net_to_operator_pence = operator_fee_pence; // Placeholder
```

**Current Status:** AMBIGUOUS - Depends on processor fee allocation policy

**SEMANTIC STATUS:** ⚠️ **NOT FROZEN - DEPENDS ON PROCESSOR FEE POLICY**

**Business Questions:**

- Does operator share processor fee burden?
- If yes, how is it allocated?

**DECISION:** ⚠️ **DO NOT FREEZE YET**

**Depends on:** Same processor fee allocation policy as `net_to_platform_pence`

---

### 7. `net_to_driver_pence` ⚠️ NOT FROZEN

**Current Behavior:**

```typescript
net_to_driver_pence = driver_payout_pence; // Placeholder
```

**Current Status:** AMBIGUOUS - Purpose unclear

**SEMANTIC STATUS:** ⚠️ **NOT FROZEN - LIKELY REDUNDANT**

**Business Questions:**

1. Is this driver payout amount? (redundant with `driver_payout_pence`)
2. Is this driver net income after costs? (requires driver cost tracking)
3. Is this driver share after processor fee? (depends on fee allocation)

**DECISION:** ⚠️ **DO NOT FREEZE YET**

**Likely Action:** Deprecate as redundant with `driver_payout_pence`

---

### 8. `platform_revenue_gross_pence` ❌ DEPRECATED

**Current Behavior:** Never populated, always NULL

**DECISION:** ❌ **DEPRECATE** - No clear purpose, never used

---

### 9. `platform_revenue_net_pence` ❌ DEPRECATED

**Current Behavior:** Never populated, always NULL

**DECISION:** ❌ **DEPRECATE** - No clear purpose, never used

---

## PART 2: NEW DRIVER-SIDE CONCEPTS - FINAL DEFINITIONS

### Concept 1: `driver_estimated_cost_pence` ✅ FROZEN

**FINAL SEMANTIC DEFINITION:**

**`driver_estimated_cost_pence` = DRIVER'S ESTIMATED OPERATIONAL COST**

**Business Meaning:**

- This represents the **driver's internal economic cost** to deliver the service
- Includes: fuel, vehicle wear/depreciation, tolls (if not reimbursed), parking
- This is the **driver's cost**, NOT the business's cost to the driver
- Used for driver profitability analysis from driver's perspective
- Calculated based on distance, duration, vehicle type, fuel prices

**Critical Distinction:**

- `driver_estimated_cost_pence` = What **driver spends** (driver's internal cost)
- `vendor_cost_pence` = What **business pays** driver (business supply cost)
- `driver_payout_pence` = Same as `vendor_cost_pence` in current model

**Example:**

- Business pays driver £300 → `vendor_cost_pence` = £300, `driver_payout_pence` = £300
- Driver spends £50 on fuel/wear → `driver_estimated_cost_pence` = £50
- Driver's estimated margin = £300 - £50 = £250

**Calculation Approach:**

```typescript
driver_estimated_cost_pence =
  distance_miles * cost_per_mile_estimate +
  duration_min * cost_per_minute_estimate +
  estimated_tolls_pence;
```

**Use Cases:**

- Driver profitability analysis
- Driver margin tracking
- Pricing optimization (ensure driver margins are sustainable)
- Driver satisfaction metrics

**When Calculated:**

- At booking confirmation time (snapshot creation)
- Based on trip distance and duration
- Uses cost assumptions (e.g., £0.30/mile for fuel + wear)

**DECISION:** ✅ **ADD NEW COLUMN**

**Priority:** 🟡 MEDIUM - Important for driver economics analysis

---

### Concept 2: `driver_target_payout_pence` ⚠️ EVALUATION NEEDED

**Business Meaning:**

- This would represent the **intended payout** to driver based on commission split
- Calculated at booking confirmation time
- Baseline before adjustments

**SEMANTIC QUESTION:**

**Is this the same as current `driver_payout_pence`?**

**Option A: YES - `driver_payout_pence` already represents target payout**

- Keep `driver_payout_pence` as-is
- Document that it means "calculated target payout"
- Do NOT add `driver_target_payout_pence` (redundant)

**Option B: NO - Add explicit `driver_target_payout_pence` for clarity**

- Add new `driver_target_payout_pence` column
- Deprecate or repurpose `driver_payout_pence`
- More explicit naming

**EVALUATION:**

**Arguments for Option A (keep `driver_payout_pence` only):**

- `driver_payout_pence` already serves this purpose
- No redundancy
- Simpler schema
- Just needs better documentation

**Arguments for Option B (add explicit `driver_target_payout_pence`):**

- More explicit naming
- Clearer semantic separation from `driver_final_payout_pence`
- Better self-documenting schema
- Easier to understand for new developers

**RECOMMENDATION:** ⚠️ **BUSINESS DECISION REQUIRED**

**Questions to answer:**

1. Is the current name `driver_payout_pence` clear enough?
2. Or should we add explicit `driver_target_payout_pence` for clarity?
3. If we add it, what happens to `driver_payout_pence`?

**Possible Outcomes:**

**Outcome A: Keep `driver_payout_pence` only**

```
driver_payout_pence = calculated target payout (frozen)
driver_final_payout_pence = actual executed payout (new)
```

**Outcome B: Add explicit target column**

```
driver_target_payout_pence = calculated target payout (new)
driver_final_payout_pence = actual executed payout (new)
driver_payout_pence = deprecated or repurposed
```

**DECISION:** ⚠️ **NOT FROZEN YET** - Requires business decision on naming clarity

---

### Concept 3: `driver_final_payout_pence` ✅ FROZEN

**FINAL SEMANTIC DEFINITION:**

**`driver_final_payout_pence` = ACTUAL EXECUTED PAYOUT TO DRIVER**

**Business Meaning:**

- This represents the **actual amount paid** to the driver
- May differ from target payout due to:
  - Tips added
  - Bonuses applied
  - Penalties deducted
  - Manual adjustments
  - Cancellation fees
- Represents **final confirmed amount** for payout execution
- Updated after trip completion and adjustments

**Calculation:**

```typescript
driver_final_payout_pence =
  driver_target_payout_pence +
  tips_pence +
  bonuses_pence -
  penalties_pence +
  manual_adjustments_pence;
```

**Use Cases:**

- Actual payout tracking
- Driver payment execution
- Accounting reconciliation
- Driver earnings reporting

**When Calculated:**

- After trip completion
- After all adjustments applied
- Before/during payout execution

**Relationship to Other Columns:**

- Starts with target payout (either `driver_payout_pence` or `driver_target_payout_pence`)
- Adjusted for tips, bonuses, penalties
- Final value for payout execution

**DECISION:** ✅ **ADD NEW COLUMN**

**Priority:** 🔴 HIGH - Critical for payout execution tracking

---

## PART 3: CORRECTED SUMMARY OF DECISIONS

### Columns with FROZEN Semantics ✅

| Column                       | Final Semantic Definition                                 | Action                          |
| ---------------------------- | --------------------------------------------------------- | ------------------------------- |
| `driver_payout_pence`        | Calculated target payout (business supply cost to driver) | ✅ KEEP - Add documentation     |
| `vendor_cost_pence`          | Business supply cost to vendor/driver                     | ✅ KEEP - Add documentation     |
| `net_collected_pence`        | Net amount after processor fee                            | ✅ KEEP - Implement integration |
| `gross_amount_pence`         | Client total inc VAT                                      | ✅ KEEP (already clear)         |
| `vat_amount_pence`           | VAT amount                                                | ✅ KEEP (already clear)         |
| `subtotal_ex_vat_pence`      | Client subtotal ex VAT                                    | ✅ KEEP (already clear)         |
| `platform_fee_rate_bp`       | Platform commission rate                                  | ✅ KEEP (already clear)         |
| `operator_fee_rate_bp`       | Operator commission rate                                  | ✅ KEEP (already clear)         |
| `platform_fee_pence`         | Platform commission amount                                | ✅ KEEP (already clear)         |
| `operator_fee_pence`         | Operator commission amount                                | ✅ KEEP (already clear)         |
| `driver_base_payout_pence`   | Driver payout from vehicle portion                        | ✅ KEEP (already clear)         |
| `driver_extras_payout_pence` | Driver payout from service items                          | ✅ KEEP (already clear)         |
| `processor_fee_pence`        | Stripe/processor fee                                      | ✅ KEEP - Implement integration |
| `refund_amount_pence`        | Total refund amount                                       | ✅ KEEP - Implement integration |
| `net_after_refunds_pence`    | Net after refunds                                         | ✅ KEEP - Implement integration |

### Columns with AMBIGUOUS/NOT FROZEN Semantics ⚠️

| Column                  | Status        | Reason                                            |
| ----------------------- | ------------- | ------------------------------------------------- |
| `platform_profit_pence` | ⚠️ NOT FROZEN | Ambiguous - gross/contribution/net margin unclear |
| `net_to_platform_pence` | ⚠️ NOT FROZEN | Depends on processor fee allocation policy        |
| `net_to_operator_pence` | ⚠️ NOT FROZEN | Depends on processor fee allocation policy        |
| `net_to_driver_pence`   | ⚠️ NOT FROZEN | Purpose unclear, likely redundant                 |

### Columns to DEPRECATE ❌

| Column                         | Reason                       |
| ------------------------------ | ---------------------------- |
| `platform_revenue_gross_pence` | Never used, no clear purpose |
| `platform_revenue_net_pence`   | Never used, no clear purpose |

### New Columns - FROZEN Semantics ✅

| New Column                       | Semantic Definition                         | Priority  |
| -------------------------------- | ------------------------------------------- | --------- |
| `driver_estimated_cost_pence`    | Driver's internal operational cost estimate | 🟡 MEDIUM |
| `driver_final_payout_pence`      | Actual executed payout to driver            | 🔴 HIGH   |
| `operator_fee_pence` (leg table) | Operator fee at leg level                   | 🔴 HIGH   |

### New Columns - EVALUATION NEEDED ⚠️

| New Column                    | Question                                      | Decision Required                      |
| ----------------------------- | --------------------------------------------- | -------------------------------------- |
| `driver_target_payout_pence`  | Is this redundant with `driver_payout_pence`? | Business decision on naming clarity    |
| `platform_gross_margin_pence` | Should we add explicit margin columns?        | After `platform_profit_pence` decision |
| `platform_net_margin_pence`   | Should we add explicit margin columns?        | After `platform_profit_pence` decision |

---

## PART 4: CRITICAL DISTINCTIONS - CORRECTED

### Driver Economics Model

```
┌─────────────────────────────────────────────────────────┐
│ BUSINESS PERSPECTIVE                                     │
│                                                          │
│ vendor_cost_pence = driver_payout_pence                 │
│ = What BUSINESS PAYS to driver                          │
│ = Business supply cost / COGS                           │
│ = £300 (example)                                        │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ DRIVER PERSPECTIVE                                       │
│                                                          │
│ driver_estimated_cost_pence                             │
│ = What DRIVER SPENDS to deliver service                 │
│ = Driver's internal operational cost                    │
│ = £50 (fuel, wear, etc.)                                │
│                                                          │
│ Driver's estimated margin = £300 - £50 = £250          │
└─────────────────────────────────────────────────────────┘
```

### Payout Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: BOOKING CONFIRMATION                            │
│                                                          │
│ driver_payout_pence (or driver_target_payout_pence?)   │
│ = Calculated target based on commission split           │
│ = £300                                                  │
│                                                          │
│ Status: FROZEN ✅ (or EVALUATION NEEDED ⚠️)             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: TRIP COMPLETION + ADJUSTMENTS                   │
│                                                          │
│ driver_final_payout_pence                               │
│ = Target + tips + bonuses - penalties                   │
│ = £300 + £20 (tip) - £10 (penalty) = £310              │
│                                                          │
│ Status: FROZEN ✅ (NEW COLUMN)                          │
└─────────────────────────────────────────────────────────┘
```

---

## PART 5: OPEN BUSINESS DECISIONS REQUIRED

### Decision 1: Driver Payout Column Naming

**Question:** Should we keep `driver_payout_pence` or add explicit `driver_target_payout_pence`?

**Option A:** Keep `driver_payout_pence` (document as target payout)
**Option B:** Add `driver_target_payout_pence` (more explicit)

**Impact:** Schema clarity vs simplicity

**Required:** Business decision on naming preference

---

### Decision 2: Processor Fee Allocation Policy

**Question:** Who bears the processor fee and how is it allocated?

**Options:**

- Platform bears full fee
- Split proportionally between platform/operator/driver
- Other allocation method

**Impact:** Affects `net_to_platform_pence`, `net_to_operator_pence`, `net_to_driver_pence` calculations

**Required:** Business policy decision

---

### Decision 3: Platform Profit/Margin Columns

**Question:** How should platform profit/margin be tracked?

**Options:**

- Keep ambiguous `platform_profit_pence`
- Add explicit `platform_gross_margin_pence` + `platform_net_margin_pence`
- Deprecate `platform_profit_pence` entirely

**Impact:** Financial reporting clarity

**Required:** Business decision on margin tracking approach

---

## FINAL STATUS

### ✅ FROZEN (Ready for Implementation)

- `driver_payout_pence` (as calculated target payout / business supply cost)
- `vendor_cost_pence` (as business supply cost to driver)
- `net_collected_pence` (as net after processor fee)
- `driver_estimated_cost_pence` (NEW - driver's internal cost)
- `driver_final_payout_pence` (NEW - actual executed payout)
- All client pricing columns (gross, VAT, subtotal, etc.)
- All commission rate/amount columns (platform, operator)

### ⚠️ NOT FROZEN (Business Decisions Required)

- `platform_profit_pence` (ambiguous - gross/net margin unclear)
- `net_to_platform_pence` (depends on processor fee policy)
- `net_to_operator_pence` (depends on processor fee policy)
- `net_to_driver_pence` (purpose unclear, likely redundant)
- `driver_target_payout_pence` (evaluation needed - redundant with `driver_payout_pence`?)

### ❌ DEPRECATED

- `platform_revenue_gross_pence` (never used)
- `platform_revenue_net_pence` (never used)

---

**NO CODE WRITTEN**
**NO MIGRATIONS CREATED**
**NO DB CHANGES MADE**

**Next Phase:** Resolve open business decisions, then proceed to schema extension plan
