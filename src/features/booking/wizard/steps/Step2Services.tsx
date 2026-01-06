'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Car } from 'lucide-react';
import { FleetModeSelector } from '../../components/step2/FleetModeSelector';
import { FleetSummaryCard } from '../../components/step2/FleetSummaryCard';
import { FleetVehicleSelector } from '../../components/step2/FleetVehicleSelector';
import IncludedServicesCardV2 from '../../components/step2/IncludedServicesCardV2';
import { PaidUpgradesCardV2 } from '../../components/step2/PaidUpgradesCardV2';
import PremiumFeaturesCardV2 from '../../components/step2/PremiumFeaturesCardV2';
import { TripPreferencesSlim } from '../../components/step2/TripPreferencesSlim';
import { VehicleCategoriesV2 } from '../../components/step2/VehicleCategories_v2';
import { VehicleModelGrid } from '../../components/step2/VehicleModelGrid';

export function Step2Services() {
  const { bookingType, tripConfiguration } = useBookingState();

  // ✅ CONDITIONAL LOGIC - Pentru flow progresiv corect
  const hasSelectedCategory = tripConfiguration.selectedVehicle?.category;
  const hasSelectedVehicle = tripConfiguration.selectedVehicle?.model;

  // Trip Preferences positioning logic - Executive vs other categories
  const selectedVehicle = tripConfiguration.selectedVehicle;
  const selectedModel = selectedVehicle?.model;

  // Check if selected model is from executive category (Mercedes E-Class, BMW 5 Series)
  const modelName = selectedModel?.name || '';
  const isExecutive = modelName.includes('E-Class') || modelName.includes('5 Series');

  return (
    <div
      className='
      w-full
      max-w-[1440px]
      mx-auto
      bg-black/40 backdrop-blur-xl
      border border-white/10
      rounded-3xl
      shadow-[0_18px_60px_rgba(0,0,0,0.6)]
      pt-4 pb-6 lg:pb-10 px-2 lg:px-4 space-y-8 lg:space-y-14
      mx-auto
    '
    >
      {/* STANDARD BOOKING ONLY */}
      {bookingType !== 'fleet' && (
        <div className='space-y-8'>
          {/* VEHICLE CATEGORIES - CENTERED */}
          <div className='w-full max-w-4xl mx-auto'>
            <VehicleCategoriesV2 />
          </div>

          {/* MAIN GRID: 2 coloane desktop, 1 coloană mobile */}
          <div className='grid grid-cols-1 lg:grid-cols-[350px_minmax(0,1fr)] gap-4 lg:gap-6 items-start'>
            {/* VEHICLES - full width mobile, fix 350px desktop */}
            <div className='w-full lg:w-[350px]'>
              <VehicleModelGrid />
            </div>

            {/* SERVICES - responsive layout */}
            <div className='flex flex-col gap-6 mt-0 lg:mt-10'>
              {/* ✅ CONDITIONAL SERVICES - Apar doar după vehicle selection */}
              {hasSelectedVehicle ? (
                <div className='animate-slideIn'>
                  {/* SERVICES GRID: 1 col mobile, 2 cols desktop */}
                  <div className='grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-4 lg:gap-6 items-start'>
                    {/* Coloana 1 - Included Services + Premium Features + Trip Preferences */}
                    <div className='space-y-4'>
                      {/* Included Services */}
                      <div className='scale-[1.0] origin-top-left'>
                        <IncludedServicesCardV2 />
                      </div>

                      {/* Premium Features */}
                      <div className='scale-[1.0] origin-top-left'>
                        <PremiumFeaturesCardV2 />
                      </div>

                      {/* Trip Preferences - pentru Executive (desktop: stânga, mobil: ascuns) */}
                      {isExecutive && hasSelectedVehicle && (
                        <div className='scale-[1.0] origin-top-left hidden lg:block'>
                          <TripPreferencesSlim />
                        </div>
                      )}
                    </div>

                    {/* Coloana 2 - Paid Upgrades + Trip Preferences pentru non-Executive */}
                    <div className='min-w-0 w-full space-y-4'>
                      <PaidUpgradesCardV2 />

                      {/* Trip Preferences - pentru Executive (mobil: dreapta, desktop: ascuns) */}
                      {isExecutive && hasSelectedVehicle && (
                        <div className='scale-[1.0] origin-top-left block lg:hidden'>
                          <TripPreferencesSlim />
                        </div>
                      )}

                      {/* Trip Preferences - pentru Luxury/SUV/MPV (evită 4 casete în stânga) */}
                      {!isExecutive && hasSelectedVehicle && (
                        <div className='scale-[1.0] origin-top-left'>
                          <TripPreferencesSlim />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : hasSelectedCategory ? (
                /* PREMIUM MESSAGE - Doar după category selection */
                <div className='flex items-center justify-center h-64 lg:h-80'>
                  <div className='text-center space-y-4 max-w-md mx-auto'>
                    <div
                      className='w-16 h-16 mx-auto rounded-2xl flex items-center justify-center'
                      style={{
                        background:
                          'linear-gradient(145deg, rgba(203,178,106,0.15), rgba(203,178,106,0.08))',
                        border: '1px solid rgba(203,178,106,0.25)',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 25px rgba(203,178,106,0.15)',
                      }}
                    >
                      <Car className='w-8 h-8' style={{ color: '#CBB26A' }} />
                    </div>

                    <div className='space-y-2'>
                      <h3 className='text-white font-semibold text-lg tracking-wide'>
                        Select Your Vehicle
                      </h3>
                      <p className='text-amber-200/70 text-sm leading-relaxed'>
                        Please choose your preferred vehicle model to unlock premium services and
                        customization options
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* FLEET MODE */}
      {bookingType === 'fleet' && (
        <div className='space-y-6 lg:space-y-8'>
          {/* Fleet Header - responsive text */}
          <div className='text-center space-y-2 px-4'>
            <h2 className='text-white font-medium text-lg lg:text-xl'>Fleet Selection</h2>
            <p className='text-amber-200/70 text-xs lg:text-sm'>
              Select multiple vehicles with quantities
            </p>
          </div>

          {/* Fleet Components */}
          <FleetModeSelector />
          <FleetVehicleSelector />
          <FleetSummaryCard />
        </div>
      )}
    </div>
  );
}
