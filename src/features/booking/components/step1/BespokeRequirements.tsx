'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Calculator, FileText, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { CardHeader } from './CardHeader';

export function BespokeRequirements() {
  const { tripConfiguration, setCustomRequirements, setBudgetRange } = useBookingState();

  const [budgetMin, setBudgetMin] = useState(tripConfiguration.bespoke?.budgetMinGBP || '');
  const [budgetMax, setBudgetMax] = useState(tripConfiguration.bespoke?.budgetMaxGBP || '');

  const handleBudgetChange = (min: string, max: string) => {
    setBudgetMin(min);
    setBudgetMax(max);
    setBudgetRange(min, max);
  };

  return (
    <div className='w-full max-w-full overflow-hidden'>
      <CardHeader
        icon={MessageSquare}
        title='Custom Requirements'
        subtitle='Describe your bespoke service needs'
      />

      <div className='vl-card-inner w-full max-w-full'>
        <div className='space-y-4 w-full max-w-full'>
          {/* Info message */}
          <div className='bg-amber-400/5 border border-amber-200/20 rounded-lg p-3'>
            <p className='text-amber-200/80 text-xs font-light leading-relaxed'>
              Describe your preferences, and our team will curate a custom quote exclusively for
              you.
            </p>
          </div>

          {/* Large textarea */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <FileText className='w-4 h-4 text-amber-200/60' />
              <label className='text-amber-200/80 text-xs font-medium tracking-wider'>
                DESCRIBE YOUR REQUIREMENTS
              </label>
            </div>
            <textarea
              value={tripConfiguration.customRequirements}
              onChange={e => setCustomRequirements(e.target.value)}
              placeholder='Please describe your custom requirements:

• Number and type of vehicles needed
• Special amenities or services required
• Event details and timeline
• Any specific requests or preferences'
              className='w-full max-w-full bg-transparent border border-amber-200/20 rounded-md px-2 py-3 text-amber-50 text-sm font-light placeholder:text-amber-200/25 focus:border-amber-300/40 focus:outline-none transition-colors resize-none box-border'
              rows={4}
            />
          </div>

          {/* Budget Range Section */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Calculator className='w-4 h-4 text-amber-200/60' />
              <label className='text-amber-200/80 text-xs font-medium tracking-wider'>
                BUDGET RANGE (OPTIONAL)
              </label>
            </div>
            <div className='grid grid-cols-2 gap-2 w-full'>
              <div className='space-y-1 min-w-0'>
                <label className='text-amber-200/60 text-xs'>From:</label>
                <input
                  type='text'
                  placeholder='£500'
                  value={budgetMin}
                  onChange={e => handleBudgetChange(e.target.value, budgetMax)}
                  className='w-full min-w-0 bg-transparent border border-amber-200/20 rounded-md px-2 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/25 focus:border-amber-300/40 focus:outline-none transition-colors'
                />
              </div>
              <div className='space-y-1 min-w-0'>
                <label className='text-amber-200/60 text-xs'>To:</label>
                <input
                  type='text'
                  placeholder='£5,000'
                  value={budgetMax}
                  onChange={e => handleBudgetChange(budgetMin, e.target.value)}
                  className='w-full min-w-0 bg-transparent border border-amber-200/20 rounded-md px-2 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/25 focus:border-amber-300/40 focus:outline-none transition-colors'
                />
              </div>
            </div>
            <p className='text-amber-200/60 text-xs font-light leading-relaxed'>
              This helps us prepare the most accurate tailored quote.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
