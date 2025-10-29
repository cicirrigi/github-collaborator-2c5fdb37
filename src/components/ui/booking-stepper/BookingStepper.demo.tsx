/**
 * 🎪 BookingStepper Demo
 * Usage examples pentru development
 */

'use client';

import React from 'react';
import { BookingStepper, useBookingStepper } from './index';

// Basic usage demo
export const BookingStepperDemo: React.FC = () => {
  const { steps, currentStep, completedSteps, onStepClick } = useBookingStepper();

  return (
    <div className='p-8 space-y-8'>
      <div>
        <h2 className='text-2xl font-bold mb-4'>BookingStepper Demo</h2>

        {/* Default Stepper */}
        <div className='mb-8'>
          <h3 className='text-lg font-semibold mb-4'>Default (Medium)</h3>
          <BookingStepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={onStepClick}
          />
        </div>

        {/* Small Stepper */}
        <div className='mb-8'>
          <h3 className='text-lg font-semibold mb-4'>Small Size</h3>
          <BookingStepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={onStepClick}
            size='sm'
            showLabels={false}
          />
        </div>

        {/* Large Stepper with custom spacing */}
        <div className='mb-8'>
          <h3 className='text-lg font-semibold mb-4'>Large with Spacious Layout</h3>
          <BookingStepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={onStepClick}
            size='lg'
            spacing='spacious'
            pulseOnCurrent={true}
          />
        </div>

        {/* Vertical Stepper */}
        <div className='mb-8'>
          <h3 className='text-lg font-semibold mb-4'>Vertical Orientation</h3>
          <div className='max-w-xs'>
            <BookingStepper
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={onStepClick}
              orientation='vertical'
              labelPosition='top'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Advanced usage with custom steps
export const CustomStepperDemo: React.FC = () => {
  const customSteps = [
    { id: 1, label: 'Start', description: 'Begin journey' },
    { id: 2, label: 'Configure', description: 'Setup options' },
    { id: 3, label: 'Complete', description: 'Finish process' },
  ];

  const { currentStep, completedSteps, onStepClick } = useBookingStepper(customSteps);

  return (
    <div className='p-8'>
      <h2 className='text-2xl font-bold mb-4'>Custom Steps Demo</h2>
      <BookingStepper
        steps={customSteps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={onStepClick}
        animated={true}
        className='max-w-md'
      />
    </div>
  );
};
