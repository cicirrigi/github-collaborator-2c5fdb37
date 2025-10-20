'use client';

import React, { useState } from 'react';
import { TravelPlanner } from './index';
import { BookingTabs } from '../booking-tabs';
import { BookingTabType } from '../booking-tabs/types';
import { TravelPlan } from './types';

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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Travel Planning System
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Advanced travel planning with smart date selection, dynamic stops management, 
          and enterprise-grade UX. Built with modular architecture and full TypeScript support.
        </p>
      </div>

      {/* Booking Type Selector */}
      <div className="flex justify-center">
        <BookingTabs
          activeTab={bookingType}
          onTabChange={handleBookingTypeChange}
          variant="default"
          size="lg"
        />
      </div>

      {/* Travel Planner */}
      <TravelPlanner
        bookingType={bookingType}
        onPlanChange={handlePlanChange}
        showMapPreview={true}
        enableWeatherHints={true}
        size="md"
      />

      {/* Debug Panel (for development) */}
      {travelPlan && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Current Travel Plan (Debug)
          </h3>
          <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
            {JSON.stringify(travelPlan, null, 2)}
          </pre>
        </div>
      )}

      {/* Features Overview */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
          <div className="w-12 h-12 bg-gradient-to-r from-[#CBB26A] to-[#D4AF37] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold">📅</span>
          </div>
          <h4 className="font-semibold mb-2">Smart Calendar</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Range selection, past date blocking, and return time filtering
          </p>
        </div>

        <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
          <div className="w-12 h-12 bg-gradient-to-r from-[#CBB26A] to-[#D4AF37] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold">🗺️</span>
          </div>
          <h4 className="font-semibold mb-2">Dynamic Stops</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add up to 10 stops with location autocomplete and reordering
          </p>
        </div>

        <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
          <div className="w-12 h-12 bg-gradient-to-r from-[#CBB26A] to-[#D4AF37] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold">⚡</span>
          </div>
          <h4 className="font-semibold mb-2">Enterprise UX</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Orchestration hooks, modular architecture, and zero prop drilling
          </p>
        </div>
      </div>
    </div>
  );
};
