/**
 * 🧪 Flip Test Page - Debug 3D Cards
 */

'use client';

import { FleetCard3D } from '@/components/sections/FleetSection/FleetCard3D';
import { fleetConfig } from '@/components/sections/FleetSection/FleetSection.config';

export default function FlipTestPage() {
  const testVehicle = fleetConfig.vehicles[2]!; // BMW 7 Series (popular)

  return (
    <div className='min-h-screen bg-gray-900 p-16'>
      <div className='text-center mb-16'>
        <h1 className='text-4xl font-bold mb-4 text-white'>🎪 3D Flip Test</h1>
        <p className='text-gray-300'>Single card test pentru debug hover effect</p>
      </div>

      {/* Test Card Container */}
      <div className='max-w-sm mx-auto'>
        <FleetCard3D
          vehicle={testVehicle}
          onSelect={_vehicle => {
            // TODO: Handle vehicle selection
          }}
          showPrice={true}
        />
      </div>

      {/* CSS Debug Info */}
      <div className='text-center mt-16 text-gray-400 text-sm'>
        <p>CSS Classes Applied:</p>
        <ul className='space-y-1 mt-4'>
          <li>✅ group [perspective:1000px]</li>
          <li>✅ group-hover:[transform:rotateY(180deg)]</li>
          <li>✅ [backface-visibility:hidden]</li>
          <li>✅ transform-gpu [transform-style:preserve-3d]</li>
        </ul>
      </div>
    </div>
  );
}
