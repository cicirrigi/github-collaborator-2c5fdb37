/**
 * 🌓 Theme Test Page - Light/Dark Mode Fleet Cards
 */

'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { FleetCard3D } from '@/components/sections/FleetSection/FleetCard3D';
import { fleetConfig } from '@/components/sections/FleetSection/FleetSection.config';

export default function ThemeTestPage() {
  const [isDark, setIsDark] = useState(true);
  const testVehicle = fleetConfig.vehicles[2]!; // BMW 7 Series (popular)

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className='p-16'>
        <div className='text-center mb-16'>
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🌓 Theme Test - Fleet 3D Cards
          </h1>
          <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Testează flip cards pe light și dark mode
          </p>

          <button
            onClick={toggleTheme}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isDark
                ? 'bg-white text-gray-900 hover:bg-gray-100'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {isDark ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
          </button>
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

        {/* Instructions */}
        <div className={`text-center mt-16 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className='mb-4'>🎪 Hover pe card pentru flip effect</p>
          <p>🌓 Toggle theme să vezi adaptarea background-ului</p>
        </div>
      </div>
    </div>
  );
}
