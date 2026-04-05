# 📋 FINANCIAL COLUMN BUSINESS DEFINITIONS

**CRITICAL: Define business meaning BEFORE implementation**

**Status:** 🔴 DRAFT - Requires business decision

**Purpose:** Clarify exact business meaning of ambiguous financial columns in `internal_booking_financials` and `internal_leg_financials` to prevent incorrect implementation.

---

## ⚠️ AMBIGUOUS COLUMNS REQUIRING DEFINITION

### 1. `driver_payout_pence`

**Current Implementation:**

```typescript
driver_payout_pence = subtotal_ex_vat - platform_fee - operator_fee;
```

**Current Status:** Calculated residual after platform and operator fees

**Business Question:** What does this represent?

**Option A: Calculated Target Payout** ✅ (Current behavior)

- This is what the driver SHOULD receive based on commission split
- Calculated at booking confirmation time
- Does NOT reflect actual payment execution
- Used for: Financial planning, driver expectations

**Option B: Final Confirmed Payout**

- This is what the driver WILL/DID receive
- May differ from calculated due to adjustments
- Updated after payout execution
- Used for: Actual accounting, payout records

**Option C: Estimated Payout**

- This is an estimate before final calculation
- May change based on actual trip details
- Preliminary value only

**DECISION NEEDED:**

- [ ] Option A: Keep as "calculated target payout"
- [ ] Option B: Change to "final confirmed payout"
- [ ] Option C: Change to "estimated payout"
- [ ] Other: **********\_\_\_**********

**If Option A chosen:**

- Column name: ✅ Keep `driver_payout_pence` OR rename to `driver_target_payout_pence`
- Add new column: `driver_final_payout_pence` for actual execution

**If Option B chosen:**

- Column name: Rename to `driver_final_payout_pence`
- Add new column: `driver_calculated_payout_pence` for initial calculation

---

### 2. `vendor_cost_pence`

**Current Implementation:**

```typescript
vendor_cost_pence = driver_payout_pence;
```

**Current Status:** Set equal to driver payout (comment: "Driver payout is main operational cost")

**Business Question:** What is a "vendor" in your business model?

**Option A: Vendor = Driver** ✅ (Current behavior)

- Driver is the service provider (vendor)
- Vendor cost = driver payout
- No other vendors in the model
- Used for: Cost of goods sold (COGS)

**Option B: Vendor = External Service Provider**

- Vendor is a third-party supplier (not driver)
- Driver payout tracked separately
- Vendor cost for external services only
- Used for: Third-party service costs

**Option C: Vendor = Total Supply Cost**

- Vendor cost includes driver + other suppliers
- May include multiple cost components
- Aggregate of all supply-side costs
- Used for: Total operational cost

**DECISION NEEDED:**

- [ ] Option A: Vendor = Driver (keep current)
- [ ] Option B: Vendor = External provider (change logic)
- [ ] Option C: Vendor = Total supply cost (extend)
- [ ] Other: **********\_\_\_**********

**If Option A chosen:**

- Column name: Rename to `driver_cost_pence` for clarity OR keep `vendor_cost_pence` with clear documentation
- Logic: Keep as-is

**If Option B chosen:**

- Column name: Keep `vendor_cost_pence`
- Logic: Change to track external vendor costs only
- Add: `driver_cost_pence` as separate column

**If Option C chosen:**

- Column name: Keep `vendor_cost_pence`
- Logic: Sum of driver_cost + other supply costs
- Add: Breakdown columns for components

---

### 3. `platform_profit_pence`

**Current Implementation:**

```typescript
platform_profit_pence = platform_fee_pence;
```

**Current Status:** Set equal to platform fee (comment: "simplified for now")

**Business Question:** What costs should reduce platform profit?

**Option A: Gross Margin (Before Costs)** ✅ (Current behavior)

- Platform profit = platform fee (no deductions)
- Does NOT account for Stripe fees
- Does NOT account for operating expenses
- Used for: Revenue tracking

**Option B: Contribution Margin (After Direct Costs)**

- Platform profit = platform fee - processor fee
- Accounts for Stripe/payment fees
- Does NOT account for operating expenses
- Used for: Margin after transaction costs

**Option C: Net Margin (After All Costs)**

- Platform profit = platform fee - processor fee - allocated overhead
- Accounts for all costs
- True net profit per booking
- Used for: True profitability

**DECISION NEEDED:**

- [ ] Option A: Gross margin (keep current)
- [ ] Option B: Contribution margin (deduct processor fee)
- [ ] Option C: Net margin (deduct all costs)
- [ ] Other: **********\_\_\_**********

**If Option A chosen:**

- Column name: Rename to `platform_gross_margin_pence`
- Add new column: `platform_net_margin_pence` for net profit

**If Option B chosen:**

- Column name: Rename to `platform_contribution_margin_pence`
- Logic: `platform_fee_pence - processor_fee_pence`
- Add new column: `platform_net_margin_pence` if overhead tracking needed

**If Option C chosen:**

- Column name: Keep as `platform_profit_pence` or rename to `platform_net_margin_pence`
- Logic: `platform_fee_pence - processor_fee_pence - allocated_overhead_pence`
- Requires: Overhead allocation logic

---

### 4. `net_collected_pence`

**Current Implementation:**

```typescript
net_collected_pence = gross_amount_pence; // Placeholder
```

**Current Status:** Set to full gross amount (comment: "Full amount collected")

**Business Question:** Is this before or after processor fee?

**Option A: Gross Collected (Before Processor Fee)**

- Net collected = gross amount charged to customer
- Does NOT deduct Stripe fee
- Same as `gross_amount_pence`
- Used for: Total revenue

**Option B: Net Collected (After Processor Fee)** ✅ (Recommended)

- Net collected = gross amount - Stripe fee
- Actual money received in bank
- Different from `gross_amount_pence`
- Used for: Cash flow tracking

**DECISION NEEDED:**

- [ ] Option A: Gross collected (before processor fee)
- [ ] Option B: Net collected (after processor fee) ✅ RECOMMENDED
- [ ] Other: **********\_\_\_**********

**If Option A chosen:**

- Column name: Rename to `gross_collected_pence` OR deprecate (duplicate of `gross_amount_pence`)

**If Option B chosen:**

- Column name: Keep `net_collected_pence`
- Logic: `gross_amount_pence - processor_fee_pence`
- Integration: Update from `booking_payments.net_amount_pence` after payment

---

### 5. `net_to_platform_pence`

**Current Implementation:**

```typescript
net_to_platform_pence = platform_fee_pence; // Placeholder
```

**Current Status:** Set equal to platform fee

**Business Question:** What is "net to platform"?

**Option A: Platform Fee Amount**

- Net to platform = platform fee (no deductions)
- Same as `platform_fee_pence`
- Duplicate column
- Used for: Revenue allocation

**Option B: Platform Share After Processor Fee**

- Net to platform = platform fee - (processor fee allocated to platform)
- Deducts platform's share of Stripe fee
- Actual platform net revenue
- Used for: True platform revenue

**Option C: Platform Share After All Costs**

- Net to platform = platform fee - processor fee - overhead
- Deducts all platform costs
- True platform profit
- Used for: Profitability

**DECISION NEEDED:**

- [ ] Option A: Platform fee (deprecate as duplicate)
- [ ] Option B: Platform share after processor fee ✅ RECOMMENDED
- [ ] Option C: Platform share after all costs
- [ ] Other: **********\_\_\_**********

**Recommended:** Option B with logic:

```typescript
net_to_platform_pence = platform_fee_pence - processor_fee_pence;
```

---

### 6. `net_to_operator_pence`

**Current Implementation:**

```typescript
net_to_operator_pence = operator_fee_pence; // Placeholder
```

**Current Status:** Set equal to operator fee

**Business Question:** What is "net to operator"?

**Option A: Operator Fee Amount** ✅ (Current - may be sufficient)

- Net to operator = operator fee (no deductions)
- Same as `operator_fee_pence`
- Operator has no direct costs in current model
- Used for: Revenue allocation

**Option B: Operator Share After Costs**

- Net to operator = operator fee - operator costs
- Deducts operator-specific costs (if any)
- Actual operator net revenue
- Used for: True operator revenue

**DECISION NEEDED:**

- [ ] Option A: Operator fee (keep as-is if no operator costs)
- [ ] Option B: Operator share after costs (if operator has costs)
- [ ] Deprecate: Remove if duplicate of `operator_fee_pence`
- [ ] Other: **********\_\_\_**********

**Recommended:** If operator has no costs, this column may be redundant. Consider deprecating or keeping for symmetry with other `net_to_*` columns.

---

### 7. `net_to_driver_pence`

**Current Implementation:**

```typescript
net_to_driver_pence = driver_payout_pence; // Placeholder
```

**Current Status:** Set equal to driver payout

**Business Question:** What is "net to driver"?

**Option A: Driver Payout Amount** ✅ (Current)

- Net to driver = driver payout (no deductions)
- Same as `driver_payout_pence`
- Driver costs not tracked separately
- Used for: Payout amount

**Option B: Driver Net After Costs**

- Net to driver = driver payout - driver costs (fuel, maintenance, etc.)
- Deducts driver operational costs
- Driver's actual take-home
- Used for: Driver profitability

**DECISION NEEDED:**

- [ ] Option A: Driver payout (keep as-is if no cost tracking)
- [ ] Option B: Driver net after costs (if tracking driver costs)
- [ ] Deprecate: Remove if duplicate of `driver_payout_pence`
- [ ] Other: **********\_\_\_**********

**Recommended:** If driver costs are not tracked, this column may be redundant. Consider deprecating or keeping for symmetry.

---

### 8. `platform_revenue_gross_pence`

**Current Implementation:** ❌ Never populated

**Current Status:** Column exists but always NULL

**Business Question:** What is the intended purpose?

**Option A: Same as Platform Fee**

- Platform revenue gross = platform fee
- Duplicate of `platform_fee_pence`
- Should be deprecated

**Option B: Total Platform Revenue**

- Platform revenue gross = platform fee + other platform revenue streams
- Includes additional revenue sources
- Different from commission only

**Option C: Accounting-Specific Field**

- Platform revenue gross for specific accounting treatment
- May differ from operational `platform_fee_pence`
- Used for: Financial reporting

**DECISION NEEDED:**

- [ ] Option A: Deprecate (duplicate)
- [ ] Option B: Define as total platform revenue
- [ ] Option C: Define accounting purpose
- [ ] Other: **********\_\_\_**********

**Recommended:** Deprecate unless there's a specific accounting or multi-revenue-stream use case.

---

### 9. `platform_revenue_net_pence`

**Current Implementation:** ❌ Never populated

**Current Status:** Column exists but always NULL

**Business Question:** What is the intended purpose?

**Option A: Same as Platform Profit**

- Platform revenue net = platform profit
- Duplicate of `platform_profit_pence`
- Should be deprecated

**Option B: Platform Revenue After Processor Fee**

- Platform revenue net = platform fee - processor fee
- Net platform revenue after transaction costs
- Different from `platform_profit_pence`

**Option C: Accounting-Specific Field**

- Platform revenue net for specific accounting treatment
- May differ from operational `platform_profit_pence`
- Used for: Financial reporting

**DECISION NEEDED:**

- [ ] Option A: Deprecate (duplicate)
- [ ] Option B: Define as platform revenue after processor fee
- [ ] Option C: Define accounting purpose
- [ ] Other: **********\_\_\_**********

**Recommended:** Deprecate unless there's a specific accounting use case. If needed, clarify difference from `platform_profit_pence`.

---

## 🎯 DECISION SUMMARY TEMPLATE

**Fill this out to finalize definitions:**

### Core Definitions

| Column                         | Business Meaning   | Calculation Logic  | Keep/Rename/Deprecate |
| ------------------------------ | ------------------ | ------------------ | --------------------- |
| `driver_payout_pence`          | ********\_******** | ********\_******** | ********\_********    |
| `vendor_cost_pence`            | ********\_******** | ********\_******** | ********\_********    |
| `platform_profit_pence`        | ********\_******** | ********\_******** | ********\_********    |
| `net_collected_pence`          | ********\_******** | ********\_******** | ********\_********    |
| `net_to_platform_pence`        | ********\_******** | ********\_******** | ********\_********    |
| `net_to_operator_pence`        | ********\_******** | ********\_******** | ********\_********    |
| `net_to_driver_pence`          | ********\_******** | ********\_******** | ********\_********    |
| `platform_revenue_gross_pence` | ********\_******** | ********\_******** | ********\_********    |
| `platform_revenue_net_pence`   | ********\_******** | ********\_******** | ********\_********    |

### New Columns Needed

| New Column                 | Purpose                   | Calculation Logic                                  | Priority           |
| -------------------------- | ------------------------- | -------------------------------------------------- | ------------------ |
| `operator_fee_pence` (leg) | Operator fee at leg level | `(subtotal_ex_vat - platform_fee) * operator_rate` | 🔴 HIGH            |
| ********\_********         | ********\_********        | ********\_********                                 | ********\_******** |
| ********\_********         | ********\_********        | ********\_********                                 | ********\_******** |

---

## 📝 NEXT STEPS

1. **Review this document** with business stakeholders
2. **Fill out decision summary** with chosen options
3. **Document final definitions** in code comments
4. **Create schema migration plan** based on decisions
5. **Update FinancialSnapshotService** with correct logic
6. **Implement integration** for payment/refund updates

---

**DO NOT IMPLEMENT UNTIL DEFINITIONS ARE FINALIZED**
