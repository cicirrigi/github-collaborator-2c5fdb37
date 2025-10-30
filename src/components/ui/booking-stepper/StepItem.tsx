/**
 * 🔘 StepItem Component
 * Individual step cu animații și efecte (reutilizabil)
 */

'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { stepVariants, stepLabelVariants } from './stepper.variants';
import type { StepItemProps, StepState } from './stepper.types';

export const StepItem: React.FC<StepItemProps> = ({
  config,
  state,
  size,
  showLabels,
  labelPosition,
  onStepClick,
  className,
}) => {
  // Click handler
  const handleClick = () => {
    if (config.clickable !== false && onStepClick && state !== 'disabled') {
      onStepClick(config.id);
    }
  };

  // Render step icon
  const renderStepIcon = () => {
    if (state === 'completed') {
      return <Check className='w-6 h-6' />;
    }

    if (config.icon) {
      const IconComponent = config.icon;
      return <IconComponent className='w-6 h-6' />;
    }

    return config.id;
  };

  return (
    <div className='flex items-center'>
      {/* Step Circle + Label Container */}
      <div className='relative flex flex-col items-center'>
        {/* Step Circle */}
        <div
          className={cn(
            stepVariants({
              state: state,
              size: size,
              interactive: config.clickable !== false && state !== 'disabled',
            }),
            className
          )}
          onClick={handleClick}
          role='button'
          tabIndex={config.clickable !== false ? 0 : -1}
          aria-label={`Step ${config.id}: ${config.label}`}
          aria-current={state === 'current' ? 'step' : undefined}
          onKeyDown={e => {
            if ((e.key === 'Enter' || e.key === ' ') && config.clickable !== false) {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          {renderStepIcon()}
        </div>

        {/* Step Label */}
        {showLabels && (
          <div
            className={cn(
              stepLabelVariants({
                state: state,
                position: labelPosition,
              })
            )}
          >
            <div className='font-medium'>{config.label}</div>
            {config.description && (
              <div className='text-xs opacity-75 mt-1'>{config.description}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
