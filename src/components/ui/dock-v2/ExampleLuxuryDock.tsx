'use client';
import { Dock, DockIcon, DockSeparator } from '.';
import { ArrowRight, RefreshCw, Clock, Car } from 'lucide-react';

export default function ExampleLuxuryDock() {
  return (
    <div className='min-h-[50vh] w-full bg-gradient-to-b from-neutral-900 to-black grid place-items-center'>
      <Dock aria-label='Booking mode selector'>
        <DockIcon
          label='One Way'
          onClick={() => {
            /* console.log('One Way') */
          }}
        >
          <ArrowRight className='h-6 w-6' />
        </DockIcon>
        <DockIcon
          label='Return'
          onClick={() => {
            /* console.log('Return') */
          }}
        >
          <RefreshCw className='h-6 w-6' />
        </DockIcon>
        <DockSeparator />
        <DockIcon
          label='By Hour'
          onClick={() => {
            /* console.log('By Hour') */
          }}
        >
          <Clock className='h-6 w-6' />
        </DockIcon>
        <DockIcon
          label='Fleet'
          onClick={() => {
            /* console.log('Fleet') */
          }}
        >
          <Car className='h-6 w-6' />
        </DockIcon>
      </Dock>
    </div>
  );
}
