/**
 * 📧 NewsletterCard Component Types
 * Type definitions for newsletter subscription card
 */

import type { ReactNode } from 'react';

export interface NewsletterFormData {
  firstName: string;
  lastName: string;
  email: string;
  consent: boolean;
}

export interface NewsletterCardProps {
  /** Card title */
  title?: string;
  
  /** Card subtitle/description */
  subtitle?: string;
  
  /** Submit button text */
  submitText?: string;
  
  /** Loading state */
  isLoading?: boolean;
  
  /** Error message */
  error?: string;
  
  /** Success message */
  success?: string;
  
  /** Custom className */
  className?: string;
  
  /** Form submission handler */
  onSubmit?: (data: NewsletterFormData) => void | Promise<void>;
  
  /** Show consent checkbox */
  showConsent?: boolean;
  
  /** Consent text */
  consentText?: string;
  
  /** Additional content below form */
  children?: ReactNode;
}

export type NewsletterFormState = 'idle' | 'loading' | 'success' | 'error';
