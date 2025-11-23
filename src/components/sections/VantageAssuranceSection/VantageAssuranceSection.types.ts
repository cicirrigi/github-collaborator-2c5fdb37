/**
 * 🛡️ VantageAssuranceSection Types
 * Type definitions for the trust & prestige section
 */

import type { LucideIcon } from 'lucide-react';

/**
 * Single assurance item with icon and text
 */
export interface AssuranceItem {
  /** Unique identifier */
  id: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Main label text */
  label: string;
  /** Supporting subtext */
  subtext: string;
}

/**
 * Headline part (for bicolor effect)
 */
export interface HeadlinePart {
  /** Text content */
  text: string;
  /** Whether this part should be accent colored */
  accent: boolean;
}

/**
 * Logo item for prestige band
 */
export interface LogoItem {
  /** Logo name/text */
  name: string;
  /** Optional image path */
  imagePath?: string;
}

/**
 * Main section props
 */
export interface VantageAssuranceSectionProps {
  /** Custom CSS class */
  className?: string;
  /** Hide the section */
  hide?: boolean;
}
