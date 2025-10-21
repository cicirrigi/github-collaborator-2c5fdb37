'use client';

import { useState } from 'react';

import { BookingTabs } from '@/components/ui/booking-tabs';
import { type BookingTabType } from '@/components/ui/booking-tabs/types';

import { TravelPlanner } from './index';
import { type TravelPlan } from './types';

export const TravelPlannerDemo = () => {
  const [bookingType, setBookingType] = useState<BookingTabType>('oneway');
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);

  const handleBookingTypeChange = (newType: BookingTabType) => {
    setBookingType(newType);
    setTravelPlan(null); // Reset plan when changing booking type
  };

  const handlePlanChange = (plan: TravelPlan) => {
    setTravelPlan(plan);
  };

  return (
    <div className='mx-auto max-w-6xl space-y-8 p-6'>
      {/* Header */}
      <div className='space-y-4 text-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
          Travel Planning System
        </h1>
        <p className='mx-auto max-w-2xl text-gray-600 dark:text-gray-400'>
          Advanced travel planning with smart date selection, dynamic stops management, and
          enterprise-grade UX. Built with modular architecture and full TypeScript support.
        </p>
      </div>

      {/* Booking Type Selector */}
      <div className='flex justify-center'>
        <BookingTabs
          activeTab={bookingType}
          onTabChange={handleBookingTypeChange}
          variant='default'
          size='lg'
        />
      </div>

      {/* Travel Planner */}
      <TravelPlanner
        bookingType={bookingType}
        onPlanChange={handlePlanChange}
        showMapPreview={true}
        enableWeatherHints={true}
        size='md'
      />

      {/* Debug Panel (for development) */}
      {travelPlan && (
        <div className='rounded-xl bg-gray-50 p-6 dark:bg-gray-800/50'>
          <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200'>
            Current Travel Plan (Debug)
          </h3>
          <pre className='overflow-auto text-xs text-gray-600 dark:text-gray-400'>
            {JSON.stringify(travelPlan, null, 2)}
          </pre>
        </div>
      )}

      {/* Features Overview */}
      <div className='mt-12 grid gap-6 md:grid-cols-3'>
        <div className='rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-800'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#CBB26A] to-[#D4AF37]'>
            <span className='font-bold text-white'>📅</span>
          </div>
          <h4 className='mb-2 font-semibold'>Smart Calendar</h4>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Range selection, past date blocking, and return time filtering
          </p>
        </div>

        <div className='rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-800'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#CBB26A] to-[#D4AF37]'>
            <span className='font-bold text-white'>🗺️</span>
          </div>
          <h4 className='mb-2 font-semibold'>Dynamic Stops</h4>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Add up to 10 stops with location autocomplete and reordering
          </p>
        </div>

        <div className='rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-800'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#CBB26A] to-[#D4AF37]'>
            <span className='font-bold text-white'>⚡</span>
          </div>
          <h4 className='mb-2 font-semibold'>Enterprise UX</h4>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Orchestration hooks, modular architecture, and zero prop drilling
          </p>
        </div>
      </div>
    </div>
  );
};
