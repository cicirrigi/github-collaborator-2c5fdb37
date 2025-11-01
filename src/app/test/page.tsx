/**
 * 🧪 Test Page - Vantage Lane 2.0
 *
 * Pagină de test pentru componente în dezvoltare.
 * Aici testăm FleetSection nou creat.
 */

import { FleetSection } from '@/components/sections/FleetSection';

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

        {/* Fleet Section Test - Full */}
        <FleetSection />

        {/* Fleet Section Test - Luxury Only */}
        <div className='mt-32'>
          <FleetSection
            categories={['Luxury']}
            maxVehicles={2}
            config={{
              title: {
                primary: 'Luxury',
                accent: 'Collection',
              },
              subtitle: 'Our most exclusive vehicles for VIP experiences.',
              vehicles: [], // Va folosi config default filtrat
              cta: {
                text: 'Book Luxury Service',
                description: 'Experience the pinnacle of automotive luxury.',
                action: () => {
                  // TODO: Navigate to luxury booking
                },
              },
            }}
          />
        </div>

        {/* Fleet Section Test - Compact */}
        <div className='mt-32'>
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
