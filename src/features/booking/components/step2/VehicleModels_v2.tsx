'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { vehicleCategories } from '@/hooks/useBookingState/vehicle.data';
import type { VehicleCategory, VehicleModel } from '@/hooks/useBookingState/vehicle.types';
import { Car, Check, Crown, Shield, Users } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface VehicleModelsV2Props {
  className?: string;
}

export function VehicleModelsV2({ className = '' }: VehicleModelsV2Props) {
  const { tripConfiguration, selectVehicleModel } = useBookingState();
  const selectedCategory = tripConfiguration.selectedVehicle?.category;
  const selectedModel = tripConfiguration.selectedVehicle?.model;

  // Get models for selected category from official data
  const categoryData = vehicleCategories.find(cat => cat.id === selectedCategory?.id);
  const models = categoryData?.models || [];

  // Don't render if no category selected
  if (!selectedCategory || models.length === 0) {
    return null;
  }

  return (
    <section className={`space-y-4 ${className}`}>
      {/* 🎯 Header */}
      <div className='flex items-center gap-2'>
        <Car className='w-5 h-5 text-yellow-400' />
        <h3 className='text-white font-medium text-lg'>Choose {selectedCategory.name} Model</h3>
      </div>

      {/* 🚗 Models List - Compact vertical */}
      <div className='space-y-2'>
        {models.map(model => (
          <CompactModelCard
            key={model.id}
            model={model}
            category={selectedCategory}
            isSelected={selectedModel?.id === model.id}
            onSelect={() => {
              // Toggle functionality - dacă e deja selectat, îl deselectez dar rămân în meniu
              if (selectedModel?.id === model.id) {
                // Doar șterge modelul, păstrează categoria (rămâi în lista de modele)
                selectVehicleModel(null);
              } else {
                // Selectează modelul nou
                selectVehicleModel(model);
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}

// 🎁 Compact Model Card
interface CompactModelCardProps {
  model: VehicleModel;
  category: VehicleCategory;
  isSelected: boolean;
  onSelect: () => void;
}

function CompactModelCard({ model, category, isSelected, onSelect }: CompactModelCardProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const vehicleImage = model.image;

  return (
    <div
      className='relative group'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 🎨 Main Card - Expandable Layout */}
      <div
        className={`relative rounded-xl backdrop-blur-sm transition-all duration-300 cursor-pointer ${
          isSelected ? 'ring-2 ring-yellow-400/50' : ''
        }`}
        style={{
          backgroundColor: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          border: 'none',
          backdropFilter: 'blur(16px)',
          boxShadow: isSelected
            ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 20px rgba(0,0,0,0.3)'
            : 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.2)',
        }}
        onClick={onSelect}
      >
        {/* 🎯 Compact Row - Always Visible */}
        <div className='p-3 flex items-center justify-between'>
          {/* Left - Basic Info */}
          <div className='flex items-center gap-3'>
            <div
              className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{
                backgroundColor: 'rgba(60,60,60,0.8)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <Car className='w-4 h-4' style={{ color: '#CBB26A' }} />
            </div>

            <div>
              <h4 className='text-white font-medium text-sm'>{model.name}</h4>
              <div className='flex items-center gap-4 text-xs text-white/60'>
                <span>Capacity: {model.capacity.passengers} passengers</span>
                <span>From £{Math.round(category.basePrice * model.priceMultiplier)}/hr</span>
              </div>
            </div>
          </div>

          {/* Right - Selected Indicator */}
          <div className='flex items-center'>
            {isSelected && (
              <div className='flex items-center gap-2'>
                <span className='text-yellow-400 text-xs font-medium'>Selected</span>
                <Check className='w-4 h-4 text-yellow-400' />
              </div>
            )}
          </div>
        </div>

        {/* 🎨 Expanded Details - Smooth Height Transition */}
        <div
          className='border-t border-white/10 overflow-hidden transition-all duration-500 ease-out'
          style={{
            maxHeight: isSelected ? '200px' : '0px',
            opacity: isSelected ? 1 : 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
          }}
        >
          <div className='p-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
              {/* Left - Extended Details */}
              <div className='md:col-span-2 space-y-3'>
                <p className='text-white/70 text-sm leading-relaxed'>{category.description}</p>
                <div className='flex items-center gap-6'>
                  <div
                    className='flex items-center gap-2 px-3 py-2 rounded-lg'
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <Users className='w-4 h-4 text-yellow-400' />
                    <span className='text-white text-sm'>
                      {model.capacity.passengers} Passengers
                    </span>
                  </div>
                  <div
                    className='flex items-center gap-2 px-3 py-2 rounded-lg'
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <Crown className='w-4 h-4 text-yellow-400' />
                    <span className='text-white text-sm'>{model.features[0]}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Shield className='w-4 h-4 text-yellow-400' />
                    <span className='text-white text-sm'>
                      £{Math.round(category.basePrice * model.priceMultiplier)}/hour
                    </span>
                  </div>
                </div>
              </div>

              {/* Right - Vehicle Image */}
              <div className='relative'>
                <div
                  className='relative w-full h-24 rounded-lg overflow-hidden'
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.12) 100%)',
                  }}
                >
                  {vehicleImage ? (
                    <Image
                      src={vehicleImage}
                      alt={model.name}
                      width={120}
                      height={60}
                      className='w-full h-full object-contain scale-[2.2]'
                      priority
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <Crown className='w-8 h-8 text-yellow-400/60' />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 Hover Enhancement */}
        <div
          className='absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200'
          style={{
            background:
              'linear-gradient(135deg, rgba(203,178,106,0.08) 0%, rgba(203,178,106,0.02) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        />
      </div>

      {/* 💬 Tooltip */}
      {showTooltip && !isSelected && (
        <div
          className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded-lg pointer-events-none z-50'
          style={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            border: 'none',
            backdropFilter: 'blur(8px)',
          }}
        >
          Click to select {model.name}
        </div>
      )}
    </div>
  );
}
