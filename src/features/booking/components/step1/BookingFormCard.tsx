'use client';

import { Route } from 'lucide-react';
import { CalendarPlaceholder } from './CalendarPlaceholder';
import { CardHeader } from './CardHeader';
import { FlightInformationSection } from './FlightInformationSection';
import { JourneyEstimateDisplay } from './JourneyEstimateDisplay';
import { PassengerLuggageSelector } from './PassengerLuggageSelector';
import { TravelRouteSection } from './TravelRouteSection';

export function BookingFormCard() {
  return (
    <div className='vl-card-flex col-span-1 lg:col-span-2'>
      <CardHeader
        icon={Route}
        title='Luxury Trip Manager'
        subtitle='Premium all-in-one booking experience'
        showWeather={true}
      />
      <div className='vl-card-inner'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 h-full relative'>
          {/* Left Side - Trip Details */}
          <div className='space-y-6'>
            <TravelRouteSection />
            <PassengerLuggageSelector />
            <JourneyEstimateDisplay />
          </div>

          {/* Refined Divider - Desktop Only */}
          <div className='hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-amber-200/15 to-transparent transform -translate-x-1/2'></div>

          {/* Right Side - Calendar PLACEHOLDER + Flight Numbers */}
          <div className='flex flex-col gap-4'>
            <CalendarPlaceholder />
            <FlightInformationSection />
          </div>
        </div>
      </div>
    </div>
  );
}
