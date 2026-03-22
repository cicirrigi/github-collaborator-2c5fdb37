# Vantage Lane 2.0 Deep Audit

Date: 2026-03-22
Repository: `/Users/cristianmacbookpro/CascadeProjects/vantage-lane-2.0`
Audit type: Read-only deep technical audit

## Scope

This audit reviewed:

- repository structure and active domains
- booking wizard architecture
- booking creation flow
- billing flow
- Stripe payment flow
- bookings read paths and account dashboard/profile hooks
- SQL migrations and RPC write paths
- TypeScript, tests, and build readiness
- deprecated/backup/demo drift that affects maintainability

No application source code was modified during the audit.

## Commands Run

The audit used local read-only inspection and the following validation commands:

```bash
npm run audit:types
npm run audit:test
npm run audit:build
```

Observed outcomes:

- `audit:types` failed with multiple real TypeScript errors
- `audit:test` partially passed, but overall failed
- `audit:build` failed before code compilation completed because `next/font/google` attempted to fetch `Inter` from `fonts.googleapis.com` and network access was unavailable in this environment

## Executive Summary

The repository has strong ambition and some mature pieces, especially in payment idempotency and multi-tenant thinking. However, the current codebase is not in a clean release-ready state.

The biggest themes are:

1. The architecture described by the docs does not match the current implementation.
2. There is active drift between old booking models and new booking models.
3. The payment flow is more mature than the booking flow around it.
4. Type safety and test status are currently overstated by the repository docs.
5. The repository contains too much active parallel code: new, old, deprecated, backup, demo, and test-only paths all coexist and leak into validation.

If this were a production readiness review, the project would currently be blocked by:

- failing TypeScript validation
- broken/partially broken test setup
- at least one likely fleet data consistency bug
- stale and contradictory architecture documentation
- unfinished booking domain consolidation

## Method

The audit was done in five passes:

1. map structure and active modules
2. inspect booking, payment, billing, and account flows
3. inspect SQL and RPC write paths
4. run quality gates
5. compare code reality against internal docs

## Repository Reality vs Internal Documentation

One of the most important findings is that the repository documents do not currently reflect the true state of the code.

### README is overly optimistic

The main README claims:

- "Production Ready"
- "Type Safe"
- "Build Passing"
- "100% TypeScript coverage with strict checking"

References:

- `README.md:21`
- `README.md:24`
- `README.md:26`
- `README.md:11`

That does not match current reality:

- `audit:types` fails
- `audit:test` fails overall
- `audit:build` is not locally robust in a restricted environment because it depends on fetching Google Fonts

### Booking system docs are stale

`BOOKING_SYSTEM_MAP.md` describes a simplified single-table booking architecture and explicitly says `booking_legs` is unused and empty.

References:

- `BOOKING_SYSTEM_MAP.md:8`
- `BOOKING_SYSTEM_MAP.md:24`
- `BOOKING_SYSTEM_MAP.md:34`
- `BOOKING_SYSTEM_MAP.md:71`

That no longer matches the codebase:

- current booking API writes via `create_booking_with_legs`
- current mapping layer builds multi-leg payloads
- current SQL contains new atomic booking RPCs and payment RPCs

This is not a cosmetic mismatch. It changes how engineers reason about the system and increases the chance of introducing bad fixes based on obsolete assumptions.

### Testing docs are stale

`tests/README.md` claims `66/66 tests passing (100%)` and describes `tests/config.test.ts` as test utilities.

References:

- `tests/README.md:3`
- `tests/README.md:22`
- `tests/README.md:69`

Current state:

- `tests/config.test.ts` is being collected as a test file but contains no suite
- multiple UI test files fail because the runtime cannot resolve `@testing-library/dom`
- one auth test is out of sync with the current response shape

## Architecture Assessment

### High-level architecture

The project has a broad modern structure:

- `src/app` for routes and API handlers
- `src/features` for feature slices
- `src/hooks` for state and booking store
- `src/lib` for utilities, pricing, Google services, Supabase, booking session logic
- `src/services` for domain-to-DB mapping and backend-oriented helpers
- `sql` for migrations and RPCs

This is a reasonable large-scale layout.

### The real architecture problem

The issue is not top-level folder structure. The issue is that booking logic is split across too many overlapping layers:

- `src/hooks/booking-store/*`
- `src/hooks/useBookingState/*`
- `src/lib/booking/*`
- `src/services/booking-mapping/*`
- API routes under `src/app/api/bookings/*`
- SQL RPCs in `sql/migrations/*`

This would still be manageable if there were a single active path. There is not.

The repository currently contains:

- current flow code
- `.deprecated` files
- `.BACKUP` files
- `.old` files
- dev demo pages
- test pages
- placeholder files

That combination creates domain ambiguity.

### Active booking UI path vs experimental path

The wizard currently renders:

- `Step1BookingDetails`
- `Step2Services`
- `Step3Summary`
- `Step4Confirmation`

Reference:

- `src/features/booking/wizard/BookingWizard.tsx:120`

But:

- Step 1 active route uses `BookingFormCard`, not `PremiumBookingFormCard`
- `PremiumBookingFormCard` currently appears to be demo-level or alternative UI, not the active step

References:

- `src/features/booking/wizard/steps/Step1BookingDetails.tsx:3`
- `src/features/booking/components/step1/PremiumBookingFormCard.tsx`
- `src/app/dev-demos/premium-booking-form-test/page.tsx`

This matters because the repo contains polished booking UI that is not actually integrated into the primary flow.

## Booking Flow Audit

### Finding 1: Fleet write path is likely inconsistent

Severity: Critical

Files:

- `src/services/booking-mapping/dbPayload.ts`
- `src/app/api/bookings/route.ts`

What the code does:

- `buildLegsPayload()` creates one leg per fleet vehicle quantity
- then `POST /api/bookings` inserts `booking_vehicle_requests`
- after that, it queries only `leg_number = 1`
- all created jobs are attached to that single leg

References:

- `src/services/booking-mapping/dbPayload.ts:291`
- `src/services/booking-mapping/dbPayload.ts:303`
- `src/app/api/bookings/route.ts:203`
- `src/app/api/bookings/route.ts:226`

Risk:

- legs and jobs do not represent the same booking structure
- dispatching or downstream analytics may misread fleet bookings
- later code may assume one job per leg or one leg per job and break silently

Assessment:

- this is the most important application-level bug found in the audit

### Finding 2: Booking API input validation is too weak

Severity: High

File:

- `src/app/api/bookings/route.ts`

The route validates:

- `tripConfiguration: z.any()`
- `pricingSnapshot.breakdown: z.any()`

References:

- `src/app/api/bookings/route.ts:15`
- `src/app/api/bookings/route.ts:22`

Implication:

- core booking payload shape is not actually enforced at the route boundary
- deeper logic is forced to rely on runtime assumptions and throw ad hoc errors later
- this reduces confidence in the write path and makes error reporting uneven

### Finding 3: Booking flow still contains old mapper/service branches

Severity: High

Files:

- `src/services/booking.service.ts`
- `src/services/booking-mapping/index.ts`
- `src/services/booking-mapping/base-mapping.ts`
- `src/services/booking-mapping/validation.ts`

Problem:

- there is a newer booking API path using `buildBookingPayload` and RPC insertion
- but `src/services/booking.service.ts` still contains a separate browser-side insertion flow using old mapping concepts such as `trip_type`
- the non-deprecated mapper entrypoint only supports `oneway` and `return`
- parts of the "non-deprecated" mapping layer are still aligned to an older DB contract

References:

- `src/services/booking.service.ts:57`
- `src/services/booking.service.ts:73`
- `src/services/booking-mapping/index.ts:24`
- `src/services/booking-mapping/base-mapping.ts:39`
- `src/services/booking-mapping/validation.ts:17`

Assessment:

- the repository has not fully chosen one booking model
- old and new models coexist and are both visible to tooling

### Finding 4: Step 4 confirmation is still fallback-heavy and session-storage driven

Severity: Medium

File:

- `src/features/booking/wizard/steps/Step4Confirmation.tsx`

Observations:

- reads booking/payment data from `sessionStorage`
- logs raw booking/payment session contents to console
- falls back to fake reference, fake payment method, fake transaction ID
- falls back to hardcoded amount defaults like `250.0`
- "Download Receipt" button is UI only

References:

- `src/features/booking/wizard/steps/Step4Confirmation.tsx:28`
- `src/features/booking/wizard/steps/Step4Confirmation.tsx:31`
- `src/features/booking/wizard/steps/Step4Confirmation.tsx:64`
- `src/features/booking/wizard/steps/Step4Confirmation.tsx:91`
- `src/features/booking/wizard/steps/Step4Confirmation.tsx:145`

Assessment:

- Step 4 is presentationally complete but not yet a trustworthy final-state surface
- it behaves more like a resilient mock/fallback layer than a fully authoritative confirmation screen

### Finding 5: PremiumBookingFormCard is not production-safe yet

Severity: Medium

File:

- `src/features/booking/components/step1/PremiumBookingFormCard.tsx`

Problems:

- active step can be marked effectively done based on step 1 validation only
- dynamic `totalSteps` is paired with hardcoded 4 labels
- `currentStep` is only loosely guarded
- button lacks `type="button"`

References:

- `src/features/booking/components/step1/PremiumBookingFormCard.tsx:39`
- `src/features/booking/components/step1/PremiumBookingFormCard.tsx:41`
- `src/features/booking/components/step1/PremiumBookingFormCard.tsx:94`
- `src/features/booking/components/step1/PremiumBookingFormCard.tsx:112`
- `src/features/booking/components/step1/PremiumBookingFormCard.tsx:159`

Assessment:

- good UI base
- not yet robust enough to be considered a clean canonical step implementation

## Billing Flow Audit

### Finding 6: Billing helper is reasonably structured, but error classification is still string-based

Severity: Medium

Files:

- `src/utils/booking/billing-helper.ts`
- `src/app/api/bookings/route.ts`

Good:

- explicit billing profile path validates `customer_id`
- validates `organization_id`
- supports fallback to default profile
- supports no-billing path

Concern:

- booking API distinguishes infra failure from "no default profile" by inspecting the thrown error message text

References:

- `src/utils/booking/billing-helper.ts:27`
- `src/utils/booking/billing-helper.ts:55`
- `src/app/api/bookings/route.ts:109`

Assessment:

- functionally acceptable
- structurally fragile
- should move toward structured errors rather than message parsing

### Finding 7: Billing hook expects secure customer context but trust boundary is external

Severity: Medium

File:

- `src/features/account/hooks/useBilling.ts`

The hook is documented correctly: `customerId` must come from secure session context.

Reference:

- `src/features/account/hooks/useBilling.ts:3`

But the hook itself cannot enforce the trust boundary beyond `if (!customerId) throw`.

Assessment:

- not a bug by itself
- but the security of the flow depends entirely on how callers obtain `customerId`

## Payment Flow Audit

### Finding 8: Payment flow is one of the strongest parts of the codebase

Severity: Positive finding

Files:

- `src/app/api/stripe/payment-intent/route.ts`
- `src/app/api/stripe/webhook/route.ts`
- `src/lib/supabase/rpc/payment.rpc.ts`
- `sql/migrations/20260307_create_payment_intent_record_rpc.sql`
- `sql/migrations/20260307_create_apply_stripe_payment_event_rpc.sql`

Strengths:

- ownership check before creating payment intent
- booking status guardrails
- idempotency key generation
- support for retry attempts
- webhook idempotency
- defensive payment and booking status transitions
- explicit audit/event processing model

References:

- `src/app/api/stripe/payment-intent/route.ts:51`
- `src/app/api/stripe/payment-intent/route.ts:98`
- `src/app/api/stripe/payment-intent/route.ts:121`
- `src/app/api/stripe/webhook/route.ts:46`
- `src/app/api/stripe/webhook/route.ts:100`
- `sql/migrations/20260307_create_payment_intent_record_rpc.sql`
- `sql/migrations/20260307_create_apply_stripe_payment_event_rpc.sql`

Assessment:

- this area is ahead of the rest of the booking domain in maturity

### Finding 9: Payment system still has dual-mode complexity

Severity: Medium

Files:

- `src/app/api/stripe/payment-intent/route.ts`
- `src/app/api/stripe/webhook/route.ts`

Problem:

- payment creation and webhook handling both support old direct DB mode and new RPC mode
- behavior depends on env flags

References:

- `src/app/api/stripe/payment-intent/route.ts:121`
- `src/app/api/stripe/webhook/route.ts:42`

Risk:

- production and local environments may exercise different logic paths
- regressions can hide behind feature flags
- auditability is reduced because there is not one canonical flow

Assessment:

- understandable during migration
- should not remain long-term

### Finding 10: Client-side payment session model is operational but not authoritative

Severity: Medium

Files:

- `src/lib/booking/session/BookingSessionManager.ts`
- `src/lib/booking/session/PaymentIntentManager.ts`

Good:

- tab-specific isolation
- session persistence
- payment intent reuse

Concerns:

- local browser session generates booking-like IDs unrelated to DB IDs
- authority still lives server-side, but some UI logic appears to treat local session state as workflow truth
- stats methods use optional fields in a way that currently contributes to type friction

References:

- `src/lib/booking/session/BookingSessionManager.ts:74`
- `src/lib/booking/session/BookingSessionManager.ts:88`
- `src/lib/booking/session/PaymentIntentManager.ts:47`
- `src/lib/booking/session/PaymentIntentManager.ts:171`

Assessment:

- okay as UX/session support
- should not become a hidden source of business truth

## Account, Auth, and Read Path Audit

### Finding 11: Account read paths are more coherent than booking write paths

Severity: Positive finding

Files:

- `src/app/account/page.tsx`
- `src/app/account/bookings/page.tsx`
- `src/app/api/bookings_v1/route.ts`
- `src/app/api/bookings_v1/[id]/route.ts`

Good:

- repeated use of session-aware Supabase client
- explicit `auth_user_id` filters on views
- views appear to be the intended stable read model

References:

- `src/app/account/page.tsx:28`
- `src/app/account/bookings/page.tsx:29`
- `src/app/api/bookings_v1/route.ts:29`
- `src/app/api/bookings_v1/[id]/route.ts:33`

Assessment:

- read-model direction is cleaner than write-model direction

### Finding 12: Account dashboard layout is brittle and heavily positional

Severity: Medium

File:

- `src/app/account/page.tsx`

Problem:

- layout relies on fixed widths and a large negative top margin for recent activity

References:

- `src/app/account/page.tsx:145`
- `src/app/account/page.tsx:168`

Assessment:

- visually controllable
- likely fragile under content growth, localization, or responsive edge cases

### Finding 13: AuthProvider is operational but noisy and defensive in a way that suggests prior instability

Severity: Medium

File:

- `src/features/auth/context/AuthProvider.tsx`

Observations:

- aggressive cookie cleanup logic
- localStorage cleanup for keys starting with `sb-`
- multiple console warnings/errors/logs in auth lifecycle
- `onAuthStateChange` logs every event

References:

- `src/features/auth/context/AuthProvider.tsx:62`
- `src/features/auth/context/AuthProvider.tsx:78`
- `src/features/auth/context/AuthProvider.tsx:132`

Assessment:

- this often means the team has been fighting session corruption or auth synchronization issues
- not necessarily wrong, but a sign of accumulated auth complexity

### Finding 14: Verify email page contains a typecheck issue and redirect logic is not fully explicit

Severity: Medium

File:

- `src/app/auth/verify-email/page.tsx`

Observed:

- `audit:types` reports "Not all code paths return a value"
- page redirects client-side if no `email`, but still returns `null` for that case

Reference:

- `src/app/auth/verify-email/page.tsx`

Assessment:

- small issue
- but another signal that route/page contracts are not being kept green

## SQL and Data Write Path Audit

### Finding 15: SQL layer shows active migration toward a more explicit transactional model

Severity: Positive finding

Files:

- `sql/fix_create_booking_with_legs.sql`
- `sql/migrations/20260318_create_booking_with_quote_atomic.sql`

Good:

- booking RPC updated to accept `billing_snapshot`
- new atomic RPC exists for booking + legs + mandatory quote

References:

- `sql/fix_create_booking_with_legs.sql`
- `sql/migrations/20260318_create_booking_with_quote_atomic.sql`

Assessment:

- this is the correct direction
- but the application route currently still calls `create_booking_with_legs`, not the newer `create_booking_with_quote_atomic`

### Finding 16: The application has not yet converged on the atomic booking + quote RPC

Severity: High

Files:

- `sql/migrations/20260318_create_booking_with_quote_atomic.sql`
- `src/app/api/bookings/route.ts`

Problem:

- DB contains a stronger atomic flow
- current booking API still creates booking first, then fleet requests/jobs, then later attempts quote insertion logic separately

References:

- `sql/migrations/20260318_create_booking_with_quote_atomic.sql`
- `src/app/api/bookings/route.ts:146`
- `src/app/api/bookings/route.ts:297`

Risk:

- quote creation is not yet truly mandatory in the active app write path
- the codebase has a better write strategy available than the route currently uses

## Type Safety Audit

### Finding 17: TypeScript baseline is red across multiple system layers

Severity: Critical

Command:

```bash
npm run audit:types
```

Main failure groups:

- Next route typing mismatch for dynamic params
- empty/invalid dev-demo module
- old booking mapper imports no longer matching exports
- booking store contract mismatch
- test files and demo files included in validation and failing
- type drift in booking domain

Representative files:

- `src/app/api/bookings/[id]/route.ts`
- `src/app/api/bookings_v1/[id]/route.ts`
- `src/hooks/booking-store/index.ts`
- `src/types/booking/step3.types.ts`
- `src/lib/booking/validation/step2.validation.ts`
- `src/services/booking-mapping/base-mapping.ts`
- `src/services/booking-mapping/validation.ts`

Assessment:

- this is not a “few errors” situation
- the codebase has lost its green typed baseline

### Finding 18: Store contract and domain types are out of sync

Severity: High

Files:

- `src/hooks/booking-store/index.ts`
- `src/hooks/useBookingState/booking.types.ts`

Problem:

- `BookingState` requires fields such as `confirmation`
- store initializer does not satisfy the full contract

References:

- `src/hooks/booking-store/index.ts:31`
- `src/hooks/useBookingState/booking.types.ts:107`

Assessment:

- central booking state is not type-stable
- this is a foundational issue, not a leaf issue

### Finding 19: Type drift exists between old and new booking schema concepts

Severity: High

Examples:

- newer booking route uses `booking_type`
- old mapping utilities still use `trip_type`
- some validators and step types refer to symbols or variants that no longer match reality

References:

- `src/app/api/bookings/route.ts`
- `src/services/booking-mapping/base-mapping.ts:39`
- `src/services/booking-mapping/validation.ts:17`
- `src/types/booking/step3.types.ts:8`

Assessment:

- this is classic refactor drift
- until normalized, the team will keep fighting symptoms instead of root causes

## Testing Audit

### Finding 20: Test suite status is materially worse than docs claim

Severity: High

Command:

```bash
npm run audit:test
```

Observed:

- many auth tests pass
- several suites fail because `@testing-library/dom` is missing
- `tests/config.test.ts` fails because it has no test suite
- one mocked auth test expects an old response shape

Key references:

- `package.json:114`
- `package.json:115`
- `tests/config.test.ts`
- `src/app/contact/Contact.test.tsx:1`
- `src/components/ui/PremiumButton/PremiumButton.test.tsx:7`
- `src/features/auth/services/__tests__/supabaseAuth.test.ts:156`

Assessment:

- test health is mixed, not strong
- passing tests mostly cover auth validation and mocked auth services
- booking/payment/integration confidence is still low

### Finding 21: Optional/test utility files are leaking into mandatory validation

Severity: Medium

Files:

- `tests/config.test.ts`
- `src/app/dev-demos/premium-features-card-test/page.tsx`
- multiple `.old`, `.backup`, `.deprecated` files across booking

Assessment:

- the repository lacks strong separation between production code, experiments, and inactive artifacts

## Build and Runtime Readiness Audit

### Finding 22: Build depends on fetching Google Fonts at build time

Severity: Medium

File:

- `src/app/layout.tsx`

Observation:

- root layout imports `Inter` from `next/font/google`
- local build failed on `fonts.googleapis.com`

References:

- `src/app/layout.tsx:4`
- `src/app/layout.tsx:13`

Assessment:

- this is not inherently wrong
- but it means build reproducibility depends on external network access unless fonts are self-hosted or cached

### Finding 23: Root layout metadata and head config are verbose and duplicated

Severity: Low

File:

- `src/app/layout.tsx`

Observation:

- metadata object defines many tags
- additional tags are also repeated manually in `<head>`

References:

- `src/app/layout.tsx:20`
- `src/app/layout.tsx:95`

Assessment:

- not a blocker
- but increases maintenance surface

## Code Hygiene and Maintainability Audit

### Finding 24: The repo contains too much residual code

Severity: High

Examples found:

- `.deprecated`
- `.BACKUP`
- `.old`
- empty demo page
- backup booking store files
- old booking service still present

Representative paths:

- `src/app/api/bookings/route.deprecated.ts`
- `src/services/booking.service.BACKUP.ts`
- `src/features/booking/wizard/steps/Step1BookingDetails.tsx.backup`
- `src/features/booking/wizard/steps/Step1BookingDetails.tsx.old`
- `src/hooks/useBookingState/createBookingStore.ts.BACKUP`
- `src/app/dev-demos/premium-features-card-test/page.tsx`

Assessment:

- maintainability cost is now significant
- these files are no longer harmless; they affect tooling, typing, and mental overhead

### Finding 25: Console logging is pervasive in production-facing paths

Severity: Medium

Areas with visible runtime logs:

- booking route and deprecated route
- webhook route
- pricing actions
- Google maps loader
- Step 4 confirmation
- auth provider
- organization resolver

Assessment:

- useful during development
- too noisy for a mature production codebase
- difficult to distinguish intentional observability from leftover debugging

### Finding 26: `any` still exists in important places

Severity: Medium

Examples:

- booking route payload handling
- fleet request/job payloads
- Google services wrappers
- test/demo tools

Assessment:

- not catastrophic in isolation
- but inconsistent with the project’s own stated “type-safe / zero any” standards

## Security and Multi-Tenancy Notes

### Positive observations

- several routes use session-aware Supabase client first
- explicit user/tenant filtering is often repeated even on top of views
- organization resolution logic exists and avoids hardcoded fallback on failure
- payment routes check booking ownership

Relevant files:

- `src/app/api/bookings_v1/route.ts`
- `src/app/api/bookings_v1/[id]/route.ts`
- `src/services/organization/organizationResolver.ts`
- `src/app/api/stripe/payment-intent/route.ts`

### Risk notes

- service-role clients are used in several paths
- that is expected for admin operations, but raises the bar for correctness
- stale docs and mixed flows make it harder to reason about whether every service-role usage is still justified and correctly filtered

## Overall Strengths

The codebase is not weak across the board. Some areas are clearly thoughtful.

### Strengths found

- payment RPC design and webhook idempotency are strong
- account read-model strategy via views is sensible
- multi-tenant awareness exists across multiple layers
- design system and premium UI ambition are evident
- booking service resolution logic is fairly disciplined and schema-driven

Relevant files:

- `src/domain/services/resolveBookingServices.ts`
- `src/domain/services/servicePackages.schema.ts`
- `src/app/api/stripe/payment-intent/route.ts`
- `src/app/api/stripe/webhook/route.ts`

## Overall Weaknesses

### Main systemic weaknesses

- booking domain has no single canonical implementation path
- docs do not match reality
- quality gates are red but project messaging still implies green
- production, demo, deprecated, and backup code are not sufficiently isolated
- refactors were started in several places but not fully finished

## Final Verdict

This is not a superficial or low-quality repo. It is a repo in transition.

There is enough solid engineering here to recover cleanly, but the current state reflects overlapping generations of architecture:

- old booking model
- new booking model
- stronger payment model
- incomplete type consolidation
- stale documentation and stale test claims

The project is not currently clean enough to treat the repository state as authoritative production truth.

## Recommended Priority Order

### P0: Must fix before calling the system stable

1. Fix fleet leg/job consistency in the booking write path.
2. Restore green TypeScript baseline.
3. Remove or complete the empty dev-demo page and exclude inactive artifacts from validation.
4. Decide and enforce one canonical booking write model.
5. Align route handler types with current Next.js expectations.

### P1: Should fix next

1. Converge onto the atomic booking + quote RPC if that is the intended architecture.
2. Repair test infra: `@testing-library/dom`, invalid test entries, and outdated assertions.
3. Clean old booking service/mapping paths or isolate them clearly.
4. Reduce debug logging in production-facing flows.
5. Replace string-based billing error classification with structured errors.

### P2: Maintainability and product hardening

1. Integrate the intended premium Step 1 UI into the real flow or archive it.
2. Make Step 4 confirmation authoritative instead of fallback-heavy.
3. Self-host fonts or reduce build dependence on external font fetches.
4. Reconcile README, booking docs, and testing docs with current reality.

## Suggested Next Deliverable

If you want to continue from this audit, the most useful next artifact would be a `FIX_PLAN.md` with:

- canonical architecture decision
- exact cleanup list
- P0/P1/P2 tasks
- owner/module mapping
- validation checklist to get back to a green repo baseline
