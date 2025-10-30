/**
 * 📦 BookingStepper Library Exports
 * Clean API pentru reutilizare în întregul proiect
 */

// Main components
export { BookingStepper as default } from './BookingStepper';
export { BookingStepper } from './BookingStepper';
export { StepItem } from './StepItem';

// Hooks
export { useBookingStepper, useStepValidation, DEFAULT_BOOKING_STEPS } from './useBookingStepper';

// Types (pentru extensibilitate)
export type {
  BookingStepperProps,
  StepConfig,
  StepItemProps,
  StepState,
  UseStepperReturn,
} from './stepper.types';

// Variants (pentru customizare)
export {
  stepVariants,
  connectorVariants,
  stepperContainerVariants,
  stepLabelVariants,
} from './stepper.variants';

// Animation utilities
export {
  stepperAnimations,
  stepperKeyframes,
  injectStepperStyles,
} from '@/lib/animations/stepper.animations';
