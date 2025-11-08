'use client';

import { useState } from 'react';
import type { FormState, NewsletterFormHook } from './NewsletterSection.types';

/**
 * 🧠 useNewsletterForm Hook
 * Manages newsletter subscription form state and logic
 * - Email validation
 * - Submission states
 * - Auto-reset timers
 * - Error handling
 */
export function useNewsletterForm(): NewsletterFormHook {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');

  const validate = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!validate(email)) {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
      return;
    }

    setState('loading');

    // Simulate API call
    setTimeout(() => {
      setState('success');
      setEmail('');
      setTimeout(() => setState('idle'), 4000);
    }, 1500);
  };

  return { email, setEmail, state, handleSubmit };
}
