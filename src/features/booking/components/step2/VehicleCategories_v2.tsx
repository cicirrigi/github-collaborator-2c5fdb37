'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { vehicleCategories } from '@/hooks/useBookingState/vehicle.data';
import { Briefcase, Car, Crown, Truck, Users } from 'lucide-react';
import React from 'react';

// 🎯 ICON MAPPING pentru categoriile oficiale
const CATEGORY_ICONS = {
  executive: Briefcase,
  luxury: Crown,
  mpv: Users,
  suv: Truck,
};

interface VehicleCategoriesV2Props {
  className?: string;
}

export function VehicleCategoriesV2({ className = '' }: VehicleCategoriesV2Props) {
  // 🎮 Use Zustand store for selection
  const { bookingType, tripConfiguration, selectVehicleCategory, clearVehicleSelection } =
    useBookingState();
  const selectedCategory = tripConfiguration.selectedVehicle?.category;

  // 🚗 Filter categories based on booking type rules - ENTERPRISE LOGIC
  const allowedCategoryIds = (() => {
    switch (bookingType) {
      case 'oneway':
      case 'return':
        return ['executive', 'luxury', 'suv', 'mpv']; // All categories allowed
      case 'hourly':
        return ['executive', 'luxury', 'suv', 'mpv']; // All allowed, luxury/suv recommended
      case 'daily':
        return ['luxury', 'suv', 'mpv']; // Long-term comfort - no executive
      case 'fleet':
        return ['suv', 'mpv']; // Group capacity only - large vehicles
      case 'bespoke':
        return ['luxury', 'suv']; // Premium only for bespoke service
      case 'events':
        return ['luxury', 'suv', 'mpv']; // Special events - premium vehicles
      case 'corporate':
        return ['executive', 'luxury']; // Professional appearance
      default:
        return ['executive', 'luxury', 'suv', 'mpv']; // Fallback - all categories
    }
  })();

  // Filter available categories based on booking type
  const availableCategories = vehicleCategories.filter(category =>
    allowedCategoryIds.includes(category.id)
  );

  return (
    <section className={`space-y-4 ${className}`}>
      {/* 🎯 Header */}
      <div className='flex items-center gap-2'>
        <Car className='w-5 h-5 text-yellow-400' />
        <h3 className='text-white font-medium text-lg'>Choose Vehicle Category</h3>
      </div>

      {/* 🚗 Compact Categories Grid - 4 în linie */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        {availableCategories.map(category => (
          <CompactVehicleCard
            key={category.id}
            category={category}
            isSelected={selectedCategory?.id === category.id}
            onSelect={() => {
              // Toggle functionality - dacă e deja selectată, o deselectez
              if (selectedCategory?.id === category.id) {
                clearVehicleSelection();
              } else {
                selectVehicleCategory(category);
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}

// 🎁 Compact Vehicle Category Card
import type { VehicleCategory } from '@/hooks/useBookingState/vehicle.types';

interface CompactVehicleCardProps {
  category: VehicleCategory;
  isSelected: boolean;
  onSelect: () => void;
}

function CompactVehicleCard({ category, isSelected, onSelect }: CompactVehicleCardProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS];
  const { name } = category;

  return (
    <div
      className='relative group'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 🎨 Main Card - Compact Chrome Style */}
      <div
        className={`relative p-3 rounded-xl backdrop-blur-sm transition-all duration-200 cursor-pointer ${
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
        {/* ✅ Selected Indicator */}
        {isSelected && (
          <div className='absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full' />
        )}

        {/* 🎯 Content */}
        <div className='text-center space-y-2'>
          {/* Icon */}
          <div
            className='mx-auto w-8 h-8 rounded-lg flex items-center justify-center'
            style={{
              backgroundColor: 'rgba(60,60,60,0.8)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <Icon className='w-4 h-4' style={{ color: '#CBB26A' }} />
          </div>

          {/* Text */}
          <div className='mt-2 text-center'>
            <h4 className='text-white font-medium text-sm'>{name}</h4>
            <p className='text-white/60 text-xs mt-0.5'>{category.tagline}</p>
          </div>
        </div>

        {/* 🌟 Hover Enhancement */}
        <div
          className='absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200'
          style={{
            background:
              'linear-gradient(135deg, rgba(203,178,106,0.08) 0%, rgba(203,178,106,0.02) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(120,120,120,0.1)',
          }}
        />
      </div>

      {/* 💬 Tooltip */}
      {showTooltip && (
        <div
          className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded-lg pointer-events-none z-50'
          style={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            border: '1px solid rgba(120,120,120,0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          Select {name}
        </div>
      )}
    </div>
  );
}
