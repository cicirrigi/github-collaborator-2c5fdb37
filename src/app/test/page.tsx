/**
 * 🧪 Test Page - Vantage Lane 2.0
 *
 * Pagină de test pentru componente în dezvoltare.
 * Aici testăm FleetSection nou creat.
 */

import { FleetSection } from '@/components/sections/FleetSection';
import { FleetSection3D } from '@/components/sections/FleetSection/FleetSection3D';

export default function TestPage() {
  return (
    <div className='min-h-screen'>
      <div className='py-16'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold mb-4 text-[var(--text-primary)]'>🧪 Test Page</h1>
          <p className='text-[var(--text-secondary)]'>
            Testare Fleet Section cu design nou refactorizat
          </p>
        </div>

        {/* Fleet Section 3D Test - Full with Flip Cards */}
        <div className='mb-32'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-[var(--brand-primary)]'>
              🎪 Fleet Section 3D - Flip Cards
            </h2>
            <p className='text-[var(--text-secondary)]'>Hover pe carduri pentru flip effect</p>
          </div>
          <FleetSection3D maxVehicles={6} />
        </div>

        {/* Fleet Section Test - Regular */}
        <div className='mb-32'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-[var(--brand-primary)]'>
              📄 Fleet Section - Regular
            </h2>
            <p className='text-[var(--text-secondary)]'>Design standard fără flip</p>
          </div>
          <FleetSection maxVehicles={3} />
        </div>

        {/* Fleet Section 3D Test - Luxury Only */}
        <div className='mt-32'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-[var(--brand-primary)]'>
              💎 Luxury Collection 3D
            </h2>
          </div>
          <FleetSection3D categories={['Luxury']} maxVehicles={2} />
        </div>

        {/* Fleet Section Test - Compact Regular */}
        <div className='mt-32'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-[var(--brand-primary)]'>
              📱 Compact Fleet - No Title
            </h2>
          </div>
          <FleetSection
            hideTitle={true}
            maxVehicles={3}
            className='bg-[var(--background-elevated)] p-8 rounded-xl'
          />
        </div>
      </div>
    </div>
  );
}
