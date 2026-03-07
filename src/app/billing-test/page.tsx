'use client';

import { BillingAddressAccordion } from '@/features/booking/components/step3/BillingAddressAccordion';

export default function BillingTestPage() {
  const handleAddressChange = (
    address: { street: string; city: string; postalCode: string; country: string } | null
  ) => {
    // eslint-disable-next-line no-console
    console.log('Selected billing address:', address);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8'>
      <div className='max-w-2xl mx-auto space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold text-white'>Billing Address Accordion</h1>
          <p className='text-neutral-400'>Preview component before integration</p>
        </div>

        {/* Accordion Preview */}
        <div className='backdrop-filter backdrop-blur-md bg-neutral-800/40 rounded-lg border border-neutral-700/50 p-6'>
          <h2 className='text-white font-medium mb-4'>Component Preview:</h2>
          <BillingAddressAccordion onAddressChange={handleAddressChange} />
        </div>

        {/* Instructions */}
        <div className='backdrop-filter backdrop-blur-md bg-amber-500/5 border border-amber-500/20 rounded-lg p-4'>
          <h3 className='text-amber-200 font-medium mb-2'>Test Instructions:</h3>
          <ul className='text-amber-200/80 text-sm space-y-1'>
            <li>• Click accordion to expand/collapse</li>
            <li>• Select from saved addresses dropdown</li>
            <li>• Choose &quot;Enter new address&quot; to see form</li>
            <li>• Check console for selected address data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
