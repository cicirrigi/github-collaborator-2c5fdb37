/**
 * 🎯 Validation Feedback - Modular Components
 * Clean exports pentru validation feedback system
 */

// Main Components
export { ValidationFeedbackContainer } from './ValidationFeedbackContainer';
export { ValidationAlert } from './ValidationAlert';

// Configuration
export { validationConfig } from './validationConfig';

// Hooks
export { useValidationFeedback, useStepValidation } from './useValidationFeedback';

// Types
export type { ValidationFeedbackProps } from './ValidationFeedbackContainer';
export type { ValidationFeedbackState } from './useValidationFeedback';

// Re-export pentru backward compatibility
export { ValidationFeedbackContainer as ValidationErrors } from './ValidationFeedbackContainer';
