/**
 * 📧 Newsletter Section Types
 * TypeScript definitions for newsletter section
 */

export type FormState = 'idle' | 'loading' | 'success' | 'error';

export interface NewsletterSectionProps {
  /** Custom styling */
  readonly className?: string;
  /** Hide the section completely */
  readonly hide?: boolean;
}

export interface NewsletterFormHook {
  /** Current email value */
  readonly email: string;
  /** Email setter */
  readonly setEmail: (email: string) => void;
  /** Current form state */
  readonly state: FormState;
  /** Form submission handler */
  readonly handleSubmit: (e: React.FormEvent) => void;
}
