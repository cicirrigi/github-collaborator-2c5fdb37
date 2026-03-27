'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { vehicleCategories } from '@/hooks/useBookingState/vehicle.data';
import type { VehicleCategory, VehicleModel } from '@/hooks/useBookingState/vehicle.types';
import { Car, Check, Crown, Shield, Users } from 'lucide-react';
import Image from 'next/image';

interface VehicleModelGridProps {
  className?: string;
}

export function VehicleModelGrid({ className = '' }: VehicleModelGridProps) {
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
      {/* Header */}
      <div className='flex items-center gap-2'>
        <Car className='w-5 h-5 text-yellow-400' />
        <h3 className='text-white font-medium text-lg'>Choose {selectedCategory.name} Model</h3>
      </div>

      {/* Vertical Stack Layout - One Under Another */}
      <div className='space-y-4 ml-0'>
        {models
          .filter(model => {
            // Mobile-only UX: when a vehicle is selected, hide others for cleaner UI
            // Desktop: always show all vehicles (unchanged behavior)
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              return !selectedModel || model.id === selectedModel.id;
            }
            return true; // Desktop - show all models
          })
          .map((model, index) => (
            <VehicleModelCard
              key={model.id}
              model={model}
              index={index}
              category={selectedCategory}
              isSelected={selectedModel?.id === model.id}
              onSelect={() => {
                if (selectedModel?.id === model.id) {
                  selectVehicleModel(null); // Deselect if already selected
                } else {
                  selectVehicleModel(model); // Select new model
                }
              }}
            />
          ))}
      </div>
    </section>
  );
}

// 🚗 Vehicle Model Card Component
interface VehicleModelCardProps {
  model: VehicleModel;
  category: VehicleCategory;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function VehicleModelCard({ model, category, isSelected, onSelect, index }: VehicleModelCardProps) {
  const { pricingState, getPriceForVehicle } = useBookingState();

  // Get real price from backend quote ONLY - no fallback to avoid showing wrong prices
  const backendPrice = getPriceForVehicle ? getPriceForVehicle(category.id) : null;

  // Round price to whole number (no decimals)
  const price = typeof backendPrice === 'number' ? Math.round(backendPrice) : null;

  // Debug logging
  console.log('🚗 VehicleCard Debug:', {
    categoryId: category.id,
    backendPrice,
    formattedPrice: price,
    pricingState: pricingState?.vehiclePrices,
    hasGetPriceForVehicle: !!getPriceForVehicle,
  });

  // Get category icon
  const getCategoryIcon = () => {
    switch (category.id) {
      case 'luxury':
        return Crown;
      case 'suv':
        return Shield;
      case 'mpv':
        return Users;
      default:
        return Car;
    }
  };

  const CategoryIcon = getCategoryIcon();

  return (
    <div
      className={`relative rounded-xl backdrop-blur-sm cursor-pointer transition-all duration-300 w-full hover:scale-[1.02] animate-slideIn ${
        isSelected ? 'ring-2 ring-yellow-400/80' : ''
      }`}
      style={{
        animationDelay: `${index * 120}ms`,
        animationFillMode: 'both',
        backgroundColor: isSelected ? 'rgba(250, 204, 21, 0.08)' : 'rgba(255,255,255,0.04)',
        border: isSelected
          ? '1px solid rgba(250, 204, 21, 0.4)'
          : '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
        boxShadow: isSelected
          ? 'inset 0 1px 0 rgba(250, 204, 21, 0.12), 0 8px 20px rgba(0,0,0,0.3)'
          : 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.2)',
      }}
      onClick={onSelect}
    >
      <div className='p-3 space-y-2'>
        {/* Vehicle Image */}
        <div className='relative w-full h-44 bg-gradient-to-br from-stone-700 to-stone-950 rounded-lg overflow-hidden'>
          {model.image ? (
            <Image
              src={model.image}
              alt={model.name}
              fill
              className={
                category.id === 'suv'
                  ? 'object-contain scale-[1.85]'
                  : category.id === 'mpv'
                    ? 'object-contain scale-[2.0]'
                    : 'object-cover'
              }
              style={
                model.name === 'BMW 5 Series'
                  ? { objectPosition: 'center calc(50% + 10px)' }
                  : category.id === 'luxury'
                    ? { objectPosition: 'center calc(50% + 7px)' }
                    : category.id === 'mpv'
                      ? { objectPosition: 'center calc(50% + 2px)' }
                      : category.id === 'suv'
                        ? { objectPosition: 'center calc(50% + 3px)' }
                        : undefined
              }
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          ) : (
            <div className='absolute inset-0 flex items-center justify-center'>
              <CategoryIcon className='w-8 h-8 text-gray-500' />
            </div>
          )}
        </div>

        {/* Model Info - Compact Layout */}
        <div className='space-y-1'>
          {/* Title and Price Row */}
          <div className='flex items-center justify-between'>
            <h4 className='text-white font-medium text-sm leading-tight'>{model.name}</h4>
            <div className='text-right'>
              <div className='text-amber-200/70 text-xs font-medium'>Your Tailored Fare</div>
              {price !== null ? (
                <div className='text-yellow-400 font-bold text-2xl'>£{price}</div>
              ) : (
                <div className='text-yellow-400/50 font-bold text-sm'>Calculating...</div>
              )}
            </div>
          </div>

          {/* Info Rows - Clean Layout */}
          <div className='space-y-2'>
            {/* First Row - Basic Info */}
            <div className='flex items-center gap-4 text-xs text-white/60'>
              <div className='flex items-center gap-1'>
                <Users className='w-3 h-3' />
                <span>{model.capacity.passengers} passengers</span>
              </div>
              <div className='flex items-center gap-1'>
                <CategoryIcon className='w-3 h-3' />
                <span>{category.name}</span>
              </div>
            </div>

            {/* Second Row - Features + Select Button */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                {model.specifications && (
                  <>
                    <span className='text-xs bg-white/5 text-white/60 px-1.5 py-0.5 rounded'>
                      Leather Seats
                    </span>
                    {model.specifications.transmission && (
                      <span className='text-xs bg-white/5 text-white/60 px-1.5 py-0.5 rounded'>
                        {model.specifications.transmission}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Select Button with Check */}
              <button
                className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${
                  isSelected
                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40'
                    : 'bg-yellow-400/10 text-yellow-400/80 border border-yellow-400/20 hover:bg-yellow-400/15 hover:text-yellow-400'
                }
              `}
                style={{
                  animation: !isSelected ? 'scalePulse 2s ease-in-out infinite' : undefined,
                }}
              >
                {isSelected && <Check className='w-4 h-4' />}
                {isSelected ? 'Selected' : 'Select'}
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes scalePulse {
                      0%, 100% { transform: scale(1); }
                      50% { transform: scale(1.05); }
                    }
                  `,
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
