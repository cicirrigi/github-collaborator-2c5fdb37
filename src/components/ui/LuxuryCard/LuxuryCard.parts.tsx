/**
 * 🎴 LuxuryCard Parts - Vantage Lane 2.0
 * Re-exports for backward compatibility - logic moved to separate files
 */

'use client';

// Re-export from modularized files
export { renderIcon } from './LuxuryCard.icon';
export { renderShimmerOverlay } from './LuxuryCard.overlay';  
export { renderContent } from './LuxuryCard.content';

// Re-export types for backward compatibility
export type { IconRenderProps } from './LuxuryCard.icon';
export type { OverlayRenderProps } from './LuxuryCard.overlay';
export type { ContentRenderProps } from './LuxuryCard.content';
