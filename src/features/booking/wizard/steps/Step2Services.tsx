'use client';

import IncludedServicesCardV2 from '@/features/booking/components/step2/IncludedServicesCardV2';
import { PaidUpgradesCardV2 } from '@/features/booking/components/step2/PaidUpgradesCardV2';
import PremiumFeaturesCardV2 from '@/features/booking/components/step2/PremiumFeaturesCardV2';
import { TripPreferencesSlim } from '@/features/booking/components/step2/TripPreferencesSlim';
import { useBookingState } from '@/hooks/useBookingState';
import { VehicleCategoriesV2 } from '../../components/step2/VehicleCategories_v2';
import { VehicleModelGrid } from '../../components/step2/VehicleModelGrid';

export function Step2Services() {
  const { bookingType } = useBookingState();

  return (
    <div
      className='
      w-full
      sm:max-w-[1440px]
      bg-black/40 backdrop-blur-xl
      border border-white/10
      rounded-3xl
      shadow-[0_18px_60px_rgba(0,0,0,0.6)]
      pt-4 pb-10 px-2 space-y-14
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

          {/* MAIN GRID: 2 coloane – stânga mașini fix 350px, dreapta servicii restul */}
          <div className='grid grid-cols-[350px_minmax(0,1fr)] gap-4 items-start'>
            {/* STÂNGA – VEHICLES (fix 350px) */}
            <div className='w-[350px]'>
              <VehicleModelGrid />
            </div>

            {/* DREAPTA – SERVICES */}
            <div className='flex flex-col gap-6 mt-10'>
              {/* GRID SUS: 2 coloane – stânga Included+Premium, dreapta PaidUpgrades (row-span-2) */}
              <div className='grid grid-cols-[320px_minmax(0,1fr)] gap-4 items-start'>
                {/* Included Services – micșorat un pic, dar identic vizual */}
                <div className='scale-[1.0] origin-top-left'>
                  <IncludedServicesCardV2 />
                </div>

                {/* Paid Upgrades – card înalt, ocupă 2 rânduri */}
                <div className='row-span-2 min-w-0 w-full'>
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
        <div className='text-white/40 text-center py-20'>FLEET MODE - NOT IMPLEMENTED YET</div>
      )}
    </div>
  );
}
