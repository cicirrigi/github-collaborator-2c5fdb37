'use client';

import { useBookingState } from '@/hooks/useBookingState';
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
  const { bookingType } = useBookingState();

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
              {/* SERVICES GRID: 1 col mobile, 2 cols desktop */}
              <div className='grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-4 lg:gap-6 items-start'>
                {/* Included Services – micșorat un pic, dar identic vizual */}
                <div className='scale-[1.0] origin-top-left'>
                  <IncludedServicesCardV2 />
                </div>

                {/* Paid Upgrades – 2 rows desktop, normal mobile */}
                <div className='lg:row-span-2 min-w-0 w-full'>
                  <PaidUpgradesCardV2 />
                </div>

                {/* Premium Features – sub Included, aceeași lățime, același scale */}
                <div className='scale-[1.0] origin-top-left -mt-2'>
                  <PremiumFeaturesCardV2 />
                </div>
              </div>

              {/* Jos pe toată lățimea – Trip Preferences Slim */}
              <div>
                <TripPreferencesSlim />
              </div>
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
