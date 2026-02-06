/**
 * 🎯 BookingStepper Component
 * Enterprise-grade progress stepper cu Zustand integration + Responsive Scaling
 */

'use client';

import { injectStepperStyles } from '@/lib/animations/stepper.animations';
import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';
import { StepItem } from './StepItem';
import type { BookingStepperProps, StepState } from './stepper.types';
import { connectorVariants, stepperContainerVariants } from './stepper.variants';

export const BookingStepper: React.FC<BookingStepperProps> = ({
  steps,
  currentStep,
  completedSteps = [],
  onStepClick,
  size = 'md',
  orientation = 'horizontal',
  spacing = 'normal',
  showLabels = true,
  labelPosition = 'bottom',
  animated = true,
  pulseOnCurrent = true,
  ariaLabel = 'Booking progress',
  className,
  stepClassName,
  connectorClassName,
}) => {
  // 🎭 Inject keyframes pentru animations
  useEffect(() => {
    if (animated) {
      injectStepperStyles();
    }
  }, [animated]);

  // Calculate step state
  const getStepState = (stepId: number): StepState => {
    if (completedSteps.includes(stepId)) {
      return 'completed';
    }

    if (stepId === currentStep) {
      return 'current';
    }

    // Check if step is accessible (can go to this step)
    if (stepId < currentStep || completedSteps.includes(stepId - 1)) {
      return 'pending';
    }

    return 'disabled';
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 🎯 Clean Container - no more JavaScript scaling */}
      <div className={cn('relative z-[1] flex w-full justify-center overflow-hidden !max-w-none')}>
        <div className='w-full max-w-[min(1400px,95vw)] px-2 sm:px-4 md:px-8 overflow-hidden flex justify-center'>
          {/* Progress Info - HIDDEN */}

          {/* Steps Container */}
          <div
            className={cn(
              stepperContainerVariants({
                orientation,
                spacing: orientation === 'horizontal' ? spacing : undefined,
              })
            )}
            role='progressbar'
            aria-label={ariaLabel}
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuetext={`Step ${currentStep} of ${steps.length}: ${steps.find(s => s.id === currentStep)?.label || ''}`}
          >
            {steps.map((step, index) => {
              const stepState = getStepState(step.id);
              const isLast = index === steps.length - 1;

              // Get connector state logic
              const getConnectorState = () => {
                if (stepState === 'completed') return 'completed';
                if (stepState === 'current') return 'active';
                return 'pending';
              };

              // Get filling state logic
              const getConnectorFilling = () => {
                if (stepState === 'completed') return 'completed';
                if (stepState === 'current') return 'active';
                return 'none';
              };

              return (
                <React.Fragment key={step.id}>
                  {/* Step cu pulse animation */}
                  <div className='relative'>
                    <StepItem
                      config={step}
                      state={stepState}
                      size={size || 'md'}
                      showLabels={showLabels}
                      labelPosition={labelPosition || 'bottom'}
                      onStepClick={onStepClick || (() => {})}
                      className={cn(
                        stepClassName,
                        animated && `animate-in duration-300`,
                        animated && `delay-[${index * 100}ms]`
                      )}
                    />
                    {/* Pulse animation pentru current step */}
                    {stepState === 'current' && pulseOnCurrent && (
                      <span
                        className='absolute inset-0 rounded-full animate-[stepperPulse_2.5s_ease_infinite] pointer-events-none'
                        style={{
                          boxShadow: '0 0 0 0 rgba(203, 178, 106, 0.4)',
                        }}
                      />
                    )}
                  </div>

                  {/* Connector cu lungime fixă */}
                  {!isLast && (
                    <div
                      className={cn(
                        connectorVariants({
                          state: getConnectorState(),
                          filling: getConnectorFilling(),
                        }),
                        'w-4 sm:w-6 md:w-8 lg:w-10 h-px mx-0.5 sm:mx-1 md:mx-1.5 lg:mx-2 rounded-full transition-all duration-500 ease-in-out',
                        connectorClassName
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Accessibility: Screen reader progress announcement */}
          <div className='sr-only' aria-live='polite' aria-atomic='true'>
            Step {currentStep} of {steps.length}: {steps.find(s => s.id === currentStep)?.label}
            {completedSteps.length > 0 && `, ${completedSteps.length} steps completed`}
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export with display name
BookingStepper.displayName = 'BookingStepper';
export default BookingStepper;
