/**
 * 📧 UnsubscribeModal Content - Success/Error States
 * Modal content states following project architecture
 */

'use client';

import { motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import { unsubscribeModalTokens } from './UnsubscribeModal.tokens';

interface SuccessContentProps {
  message?: string;
}

export function SuccessContent({
  message = "You've been successfully unsubscribed. We're sorry to see you go!",
}: SuccessContentProps) {
  const tokens = unsubscribeModalTokens;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className='text-center py-4'
    >
      <div
        className='mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4'
        style={{ backgroundColor: tokens.states.success.backgroundColor }}
      >
        <Check className='w-6 h-6' style={{ color: tokens.states.success.iconColor }} />
      </div>
      <p style={{ color: tokens.states.success.textColor, fontSize: '0.875rem' }}>{message}</p>
    </motion.div>
  );
}

interface ErrorContentProps {
  error: string;
}

export function ErrorContent({ error }: ErrorContentProps) {
  const tokens = unsubscribeModalTokens;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className='flex items-center gap-2 p-3 rounded-lg mb-4'
      style={{ backgroundColor: tokens.states.error.backgroundColor }}
    >
      <AlertCircle className='w-5 h-5' style={{ color: tokens.states.error.iconColor }} />
      <p style={{ color: tokens.states.error.textColor, fontSize: '0.875rem', margin: 0 }}>
        {error}
      </p>
    </motion.div>
  );
}

interface FormContentProps {
  description: string;
  error?: string;
  children: React.ReactNode;
}

export function FormContent({ description, error, children }: FormContentProps) {
  const tokens = unsubscribeModalTokens;

  return (
    <>
      <p
        className='mb-6'
        style={{ color: tokens.description.color, fontSize: tokens.description.fontSize }}
      >
        {description}
      </p>

      {error && <ErrorContent error={error} />}

      {children}
    </>
  );
}
