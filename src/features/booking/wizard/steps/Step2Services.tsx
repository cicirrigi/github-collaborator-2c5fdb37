'use client';

import { IncludedServicesV2 } from '../../components/step2/IncludedServices_v2';
import { PaidUpgradesV2 } from '../../components/step2/PaidUpgradesV2';
import { PremiumFeaturesV2 } from '../../components/step2/PremiumFeatures_v2';
import { TripPreferencesV2 } from '../../components/step2/TripPreferences_v2';
import { VehicleCategoriesV2 } from '../../components/step2/VehicleCategories_v2';
import { VehicleModelsV2 } from '../../components/step2/VehicleModels_v2';

// Step2Services.tsx - Add-ons & pricing
export function Step2Services() {
  return (
    <div className='w-full max-w-4xl mx-auto space-y-8 p-6'>
      {/* 🎯 Header */}
      <div className='text-center space-y-2'>
        <h2 className='text-white font-medium text-xl'>Service Packages</h2>
        <p className='text-amber-200/70 text-sm'>Customize your luxury experience</p>
      </div>

      {/* 🚗 1. Vehicle Categories - COMPACT */}
      <VehicleCategoriesV2 />

      {/* 🔧 2. Vehicle Models - CONDITIONAL */}
      <VehicleModelsV2 />

      {/* 🟦 3. Included Services - COMPACT V2 */}
      <IncludedServicesV2 />

      {/* 🟨 4. Premium Features - CONDITIONAL (Luxury/SUV/MPV only) */}
      <PremiumFeaturesV2 />

      {/* 🟩 5. Trip Preferences - UNIVERSAL (Music, Temperature, Communication) */}
      <TripPreferencesV2 />

      {/* 🟥 6. Paid Upgrades - UNIVERSAL (Flowers, Champagne, Security) */}
      <PaidUpgradesV2 />
    </div>
  );
}
