'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ValidationAlert } from './ValidationAlert';

export interface ValidationFeedbackProps {
  errors?: string[];
  warnings?: string[];
  success?: string[];
  onDismissErrors?: () => void;
  onDismissWarnings?: () => void;
  onDismissSuccess?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
  autoDismissAfter?: number;
  showPriorityOnly?: boolean; // Afișează doar cel mai important tip de mesaj
}

/**
 * 🎯 ValidationFeedbackContainer - Smart validation display
 *
 * Features:
 * - Integrare cu validateStepResult din @/lib/booking
 * - Prioritate vizuală: errors > warnings > success
 * - Dark mode compatible
 * - Auto-dismiss cu timer
 * - Compact variant pentru spații mici
 */
export const ValidationFeedbackContainer = ({
  errors = [],
  warnings = [],
  success = [],
  onDismissErrors,
  onDismissWarnings,
  onDismissSuccess,
  className,
  variant = 'default',
  autoDismissAfter,
  showPriorityOnly = false,
}: ValidationFeedbackProps) => {
  const [visible, setVisible] = useState({
    errors: true,
    warnings: true,
    success: true,
  });

  // Auto-dismiss logic
  useEffect(() => {
    if (autoDismissAfter) {
      const timer = setTimeout(() => {
        setVisible({ errors: false, warnings: false, success: false });
      }, autoDismissAfter);
      return () => clearTimeout(timer);
    }
    return undefined; // Explicit return for all code paths
  }, [autoDismissAfter]);

  // Determine what to show based on priority
  const hasErrors = errors.length > 0 && visible.errors;
  const hasWarnings = warnings.length > 0 && visible.warnings;
  const hasSuccess = success.length > 0 && visible.success;

  // Priority logic: only show highest priority if showPriorityOnly is true
  const showErrors = hasErrors;
  const showWarnings = showPriorityOnly ? hasWarnings && !hasErrors : hasWarnings;
  const showSuccess = showPriorityOnly ? hasSuccess && !hasErrors && !hasWarnings : hasSuccess;

  const hasAnyFeedback = showErrors || showWarnings || showSuccess;

  if (!hasAnyFeedback) return null;

  const compactClasses = variant === 'compact' ? 'p-2 text-xs space-y-2' : 'space-y-3';

  return (
    <div className={cn('w-full', compactClasses, className)}>
      {/* Errors - Highest Priority */}
      {showErrors && (
        <ValidationAlert
          type='error'
          messages={errors}
          onDismiss={() => {
            setVisible(prev => ({ ...prev, errors: false }));
            onDismissErrors?.();
          }}
          variant={variant}
        />
      )}

      {/* Warnings - Medium Priority */}
      {showWarnings && (
        <ValidationAlert
          type='warning'
          messages={warnings}
          onDismiss={() => {
            setVisible(prev => ({ ...prev, warnings: false }));
            onDismissWarnings?.();
          }}
          variant={variant}
        />
      )}

      {/* Success - Lowest Priority */}
      {showSuccess && (
        <ValidationAlert
          type='success'
          messages={success}
          onDismiss={() => {
            setVisible(prev => ({ ...prev, success: false }));
            onDismissSuccess?.();
          }}
          variant={variant}
        />
      )}
    </div>
  );
};
