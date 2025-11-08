/**
 * 🎣 useBookingStepper Hook
 * Zustand integration pentru BookingStepper
 */

'use client';

import { useMemo } from 'react';
import { Route, Car, Star, CreditCard, BadgeCheck } from 'lucide-react';
import { useBookingState } from '@/hooks/useBookingState';
import type { StepConfig, UseStepperReturn } from './stepper.types';

// Default step configurations (reutilizabile)
export const DEFAULT_BOOKING_STEPS: StepConfig[] = [
  {
    id: 1,
    label: 'Trip Details',
    description: 'Pickup & destination',
    icon: Route,
    clickable: true,
  },
  {
    id: 2,
    label: 'Vehicle',
    description: 'Choose your ride',
    icon: Car,
    clickable: true,
  },
  {
    id: 3,
    label: 'Services',
    description: 'Add extras',
    icon: Star,
    clickable: true,
  },
  {
    id: 4,
    label: 'Payment',
    description: 'Secure checkout',
    icon: CreditCard,
    clickable: true,
  },
  {
    id: 5,
    label: 'Confirmation',
    description: 'Review & book',
    icon: BadgeCheck,
    clickable: true,
  },
];

/**
 * Hook pentru integrarea BookingStepper cu Zustand store
 */
export const useBookingStepper = (
  customSteps?: StepConfig[]
): UseStepperReturn & {
  steps: StepConfig[];
  onStepClick: (stepNumber: number) => void;
} => {
  const {
    currentStep,
    completedSteps,
    totalSteps,
    canProceedToStep,
    // goToStep, // Not available in current store
    nextStep,
    prevStep,
  } = useBookingState();

  // Use custom steps sau default
  const steps = customSteps || DEFAULT_BOOKING_STEPS;

  // Validează că avem numărul corect de pași
  const validatedSteps = useMemo(() => {
    if (steps.length !== totalSteps) {
      // Step count mismatch - using slice to ensure correct count
    }
    return steps.slice(0, totalSteps);
  }, [steps, totalSteps]);

  // Click handler cu validare și auto-completare
  const handleStepClick = (stepNumber: number) => {
    if (canProceedToStep(stepNumber)) {
      // Auto-completează pașii anteriori când selectezi un pas
      const newCompletedSteps = [];
      for (let i = 1; i < stepNumber; i++) {
        if (!completedSteps.includes(i)) {
          newCompletedSteps.push(i);
        }
      }

      useBookingState.setState({
        currentStep: stepNumber,
        completedSteps: [...completedSteps, ...newCompletedSteps],
      });
    }
  };

  // Progress calculation
  const progress = useMemo(() => {
    return Math.round((completedSteps.length / totalSteps) * 100);
  }, [completedSteps.length, totalSteps]);

  // Navigation helpers
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return {
    steps: validatedSteps,
    currentStep,
    completedSteps,
    canGoToStep: canProceedToStep,
    goToStep: (step: number) => handleStepClick(step),
    nextStep,
    prevStep,
    onStepClick: handleStepClick,
    isFirstStep,
    isLastStep,
    progress,
  };
};

/**
 * Hook pentru step validation (advanced)
 */
export const useStepValidation = () => {
  const { validateCurrentStep } = useBookingState();

  return {
    validateCurrentStep,
    // Poți adăuga alte validări specifice aici
  };
};
