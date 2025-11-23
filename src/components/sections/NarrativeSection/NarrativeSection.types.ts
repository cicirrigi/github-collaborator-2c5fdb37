/**
 * 📖 NarrativeSection Types
 * Brand philosophy and experience narrative section
 */

/**
 * Paragraph with emphasis
 */
export interface NarrativeParagraph {
  /** Text before emphasis */
  text: string;
  /** Emphasized word/phrase (gold) */
  emphasis: string;
  /** Text after emphasis */
  rest: string;
}

/**
 * Content block (group of paragraphs)
 */
export interface NarrativeBlock {
  /** Paragraphs in this block */
  paragraphs: NarrativeParagraph[];
}

/**
 * Call-to-action configuration
 */
export interface NarrativeCTA {
  /** CTA button/link text */
  text: string;
  /** Target URL or anchor */
  href: string;
  /** Whether to use smooth scroll for anchor links */
  scroll?: boolean;
}

/**
 * Visual/image configuration
 */
export interface NarrativeVisual {
  /** Image source path */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional blur data URL for loading placeholder */
  blurDataURL?: string;
}

/**
 * Main section configuration
 */
export interface NarrativeSectionConfig {
  /** Main title - bicolor */
  title: {
    /** First part (white) */
    primary: string;
    /** Second part (gold with glow) */
    accent: string;
  };
  /** Subheadline text */
  subheadline: string;
  /** Content blocks (separated visually) */
  blocks: NarrativeBlock[];
  /** Call-to-action */
  cta: NarrativeCTA;
  /** Visual content */
  visual: NarrativeVisual;
}

/**
 * Component props
 */
export interface NarrativeSectionProps {
  /** Optional CSS class name */
  className?: string;
  /** Hide the section */
  hide?: boolean;
}
