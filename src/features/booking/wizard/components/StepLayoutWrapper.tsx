'use client';

import { ZustandBookingTypeDock } from '@/components/booking/ZustandBookingTypeDock';
import React from 'react';

interface StepLayoutWrapperProps {
  title?: string;
  subtitle?: string;
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  showTripTypeDock?: boolean;
}

export function StepLayoutWrapper({
  title = 'Book Your Journey',
  subtitle = 'Premium chauffeur service in London',
  leftColumn,
  rightColumn,
  showTripTypeDock = true,
}: StepLayoutWrapperProps) {
  return (
    <div className='w-full space-y-12'>
      {/* Title Section - Centrat */}
      <div className='text-center space-y-3'>
        <h1 className='text-3xl md:text-4xl font-bold text-white'>{title}</h1>
        <p className='text-lg text-white/70 max-w-2xl mx-auto'>{subtitle}</p>
      </div>

      {/* Trip Type Dock - Centrat */}
      {showTripTypeDock && (
        <div className='flex justify-center'>
          <div className='w-full max-w-4xl'>
            <ZustandBookingTypeDock />
          </div>
        </div>
      )}

      {/* 2-Column Premium Grid */}
      <div className='w-full max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12'>
          {/* Left Column */}
          <div className='space-y-6'>
            <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all duration-300'>
              {leftColumn}
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all duration-300'>
              {rightColumn}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
