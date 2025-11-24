'use client';

import { CheckCircle, Crown, Shield, Users } from 'lucide-react';

// 🚗 VEHICLE IMAGES MAPPING
const VEHICLE_IMAGES = {
  'mercedes-e-class': '/images/vehicles/mercedes-e-class.jpg',
  'bmw-5-series': '/images/vehicles/bmw-5-series.jpg',
  'mercedes-s-class': '/images/vehicles/mercedes-s-class.jpg',
  'bmw-7-series': '/images/vehicles/bmw-7-series.jpg',
  'mercedes-v-class': '/images/vehicles/mercedes-v-class.jpg',
  'range-rover': '/images/vehicles/range-rover.jpg',
  'range-rover-sport': '/images/vehicles/range-rover-sport.jpg',
};

import type { VehicleModel } from '@/hooks/useBookingState/vehicle.types';

interface VehiclePreviewV2Props {
  selectedModel: VehicleModel | null;
  selectedCategory: string;
  className?: string;
}

export function VehiclePreviewV2({
  selectedModel,
  selectedCategory: _selectedCategory,
  className = '',
}: VehiclePreviewV2Props) {
  if (!selectedModel) {
    return null;
  }

  const vehicleImage = VEHICLE_IMAGES[selectedModel.id as keyof typeof VEHICLE_IMAGES];

  return (
    <section className={`space-y-4 ${className}`}>
      {/* 🎯 Header */}
      <div className='flex items-center gap-2'>
        <CheckCircle className='w-5 h-5 text-yellow-400' />
        <h3 className='text-white font-medium text-lg'>Selected Vehicle</h3>
      </div>

      {/* 🚗 Compact Vehicle Preview */}
      <div
        className='relative p-4 rounded-xl backdrop-blur-sm'
        style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: 'none',
          backdropFilter: 'blur(16px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 6px 20px rgba(0,0,0,0.2)',
        }}
      >
        <div className='flex items-center justify-between'>
          {/* 📝 Left - Compact Details */}
          <div className='flex items-center gap-4'>
            {/* Icon */}
            <div
              className='w-10 h-10 rounded-lg flex items-center justify-center'
              style={{
                backgroundColor: 'rgba(60,60,60,0.8)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <Crown className='w-5 h-5' style={{ color: '#CBB26A' }} />
            </div>

            {/* Info */}
            <div>
              <div className='flex items-center gap-2'>
                <h4 className='text-white font-medium text-base'>{selectedModel.name}</h4>
                <div className='px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-medium'>
                  Selected
                </div>
              </div>
              <div className='flex items-center gap-4 mt-1'>
                <span className='text-white/60 text-xs flex items-center gap-1'>
                  <Users className='w-3 h-3' />
                  {selectedModel.capacity.passengers} passengers
                </span>
                <span className='text-white/60 text-xs flex items-center gap-1'>
                  <Shield className='w-3 h-3' />
                  From £{Math.round(50 * selectedModel.priceMultiplier)}/hr
                </span>
              </div>
            </div>
          </div>

          {/* 🖼️ Right - Mini Preview */}
          <div className='relative'>
            <div
              className='w-16 h-12 rounded-lg overflow-hidden flex items-center justify-center'
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {vehicleImage ? (
                <img
                  src={vehicleImage}
                  alt={selectedModel.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <Crown className='w-4 h-4 text-yellow-400/60' />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
