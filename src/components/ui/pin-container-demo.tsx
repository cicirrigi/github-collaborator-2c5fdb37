'use client';

import Image from 'next/image';

import { PinContainer } from './pin-container';

const vehicleData = [
  {
    title: 'BMW 5 Series Executive',
    href: 'https://www.bmw.com/en/models/5-series.html',
    image: '/images/models/BMW-5-Series.webp',
    name: 'BMW 5 Series',
    description: 'Premium executive sedan with cutting-edge technology and luxury comfort.',
    category: 'Executive Class',
  },
  {
    title: 'BMW 7 Series Luxury',
    href: 'https://www.bmw.com/en/models/7-series.html',
    image: '/images/models/BMW-7-Series.png',
    name: 'BMW 7 Series',
    description: 'Ultimate luxury sedan with innovative technology and supreme comfort.',
    category: 'Luxury Class',
  },
  {
    title: 'Mercedes S-Class Premium',
    href: 'https://www.mercedes-benz.com/en/vehicles/passenger-cars/s-class/',
    image: '/images/models/Mercedes-S-Class.webp',
    name: 'Mercedes S-Class',
    description: 'The pinnacle of luxury and innovation in automotive engineering.',
    category: 'Premium Class',
  },
  {
    title: 'Range Rover SUV',
    href: 'https://www.landrover.com/vehicles/range-rover/index.html',
    image: '/images/models/Range-Rover.webp',
    name: 'Range Rover',
    description: 'Luxury SUV combining capability, comfort and sophisticated design.',
    category: 'SUV Class',
  },
];

export function PinContainerDemo() {
  return (
    <div className='flex h-[40rem] w-full items-center justify-center'>
      <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-4'>
        {vehicleData.map((vehicle, index) => (
          <PinContainer
            key={index}
            title={vehicle.title}
            href={vehicle.href}
            className='relative h-[15rem] w-[15rem] overflow-hidden'
          >
            {/* Imaginea ca fundal pentru tot cardul */}
            <Image
              src={vehicle.image}
              alt={`${vehicle.name} - Luxury Vehicle`}
              fill
              className='rounded-2xl object-cover'
              sizes='(max-width: 768px) 240px, 240px'
            />

            {/* Overlay gradient pentru text readability */}
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

            {/* Content peste imagine */}
            <div className='relative z-10 flex h-full flex-col justify-between p-4'>
              {/* Badge în colțul din dreapta */}
              <div className='self-end rounded bg-black/50 px-2 py-1 text-xs font-medium text-white/80'>
                {vehicle.category}
              </div>

              {/* Text în partea de jos */}
              <div className='space-y-2'>
                <h3 className='text-lg font-bold text-white'>{vehicle.name}</h3>
                <p className='text-sm text-white/90'>{vehicle.description}</p>
              </div>
            </div>
          </PinContainer>
        ))}
      </div>
    </div>
  );
}
