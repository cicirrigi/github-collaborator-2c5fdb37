/**
 * 📝 BookingStepper Types
 * Type-safe interfaces (zero any types)
 */

import type {
  StepVariants,
  ConnectorVariants,
  StepperContainerVariants,
  StepLabelVariants,
} from './stepper.variants';

// Step state enum
export type StepState = 'pending' | 'current' | 'completed' | 'disabled';

// Individual step configuration
export interface StepConfig {
  /** Unique step identifier */
  id: number;

  /** Display label for the step */
  label: string;

  /** Optional description */
  description?: string;

  /** Whether step can be clicked */
  clickable?: boolean;

  /** Custom icon component */
  icon?: React.ComponentType<{ className?: string }>;

  /** Step validation function */
  isValid?: () => boolean;
}

// Main stepper props
export interface BookingStepperProps {
  /** Array of step configurations */
  steps: StepConfig[];

  /** Current active step (1-based) */
  currentStep: number;

  /** Array of completed step numbers */
  completedSteps?: number[];

  /** Callback when step is clicked */
  onStepClick?: (stepNumber: number) => void;

  /** Visual variants */
  size?: StepVariants['size'];
  orientation?: StepperContainerVariants['orientation'];
  spacing?: StepperContainerVariants['spacing'];

  /** Show step labels */
  showLabels?: boolean;
  labelPosition?: StepLabelVariants['position'];

  /** Animation preferences */
  animated?: boolean;
  pulseOnCurrent?: boolean;

  /** Accessibility */
  ariaLabel?: string;

  /** Custom styling */
  className?: string;
  stepClassName?: string;
  connectorClassName?: string;
}

// Individual step component props
export interface StepItemProps {
  config: StepConfig;
  state: StepState;
  size: NonNullable<StepVariants['size']>;
  showLabels: boolean;
  labelPosition: NonNullable<StepLabelVariants['position']>;
  onStepClick?: (stepNumber: number) => void;
  className?: string;
  // Removed unused props: index, isLast, animated, pulseOnCurrent, connectorClassName
}

// Hook return type pentru step management
export interface UseStepperReturn {
  currentStep: number;
  completedSteps: number[];
  canGoToStep: (step: number) => boolean;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number; // 0-100 percentage
}
