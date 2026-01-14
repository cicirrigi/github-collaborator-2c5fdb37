/**
 * STEP 3 COMPONENTS - Unified Export Index
 *
 * Clean exports for Step 3 components:
 * - BookingSummaryCard: Unified summary (Trip + Vehicle + Services)
 * - PaymentCard: Payment form and pricing
 *
 * Space efficient design with elegant separators,
 * mobile friendly and uses design tokens
 */

export { default as BookingSummaryCard } from './BookingSummaryCard';
export { PaymentCard } from './PaymentCard';

// Legacy exports (deprecated - use BookingSummaryCard instead)
export { ServicesSummaryCard } from './ServicesSummaryCard';
export { TripSummaryCard } from './TripSummaryCard';
export { VehicleSummaryCard } from './VehicleSummaryCard';
