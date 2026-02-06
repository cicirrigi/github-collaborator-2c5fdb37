'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { getAvailableCategoriesForBookingType } from '@/hooks/useBookingState/vehicle.data';
import type { VehicleCategory, VehicleModel } from '@/hooks/useBookingState/vehicle.types';
import { Briefcase, Crown, Minus, Plus, Truck, Users } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

// 🎯 Category Icons Mapping
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  executive: Briefcase,
  luxury: Crown,
  suv: Truck,
  mpv: Users,
};

interface FleetVehicleSelectorProps {
  className?: string;
}

export function FleetVehicleSelector({ className = '' }: FleetVehicleSelectorProps) {
  const { bookingType, tripConfiguration, addFleetVehicle, updateFleetVehicleQuantity } =
    useBookingState();

  // Get available categories for fleet bookings
  const availableCategories = getAvailableCategoriesForBookingType(bookingType);

  // Filter only categories that have fleet support
  const fleetCategories = availableCategories.filter(category =>
    ['executive', 'luxury', 'suv', 'mpv'].includes(category.id)
  );

  // Get current fleet selection
  const fleetSelection = tripConfiguration.fleetSelection;

  // Helper to get quantity for specific vehicle
  const getVehicleQuantity = (category: VehicleCategory, model: VehicleModel): number => {
    const item = fleetSelection.vehicles.find(
      v => v.category.id === category.id && v.model.id === model.id
    );
    return item?.quantity || 0;
  };

  // Handle quantity change
  const handleQuantityChange = (category: VehicleCategory, model: VehicleModel, delta: number) => {
    const currentQuantity = getVehicleQuantity(category, model);
    const newQuantity = Math.max(0, Math.min(10, currentQuantity + delta)); // Limit 0-10

    if (newQuantity === 0 && currentQuantity > 0) {
      // Remove vehicle if quantity becomes 0
      const item = fleetSelection.vehicles.find(
        v => v.category.id === category.id && v.model.id === model.id
      );
      if (item) {
        updateFleetVehicleQuantity(item.id, 0);
      }
    } else if (newQuantity > 0) {
      if (currentQuantity === 0) {
        // Add new vehicle
        addFleetVehicle(category, model, newQuantity);
      } else {
        // Update existing quantity
        const item = fleetSelection.vehicles.find(
          v => v.category.id === category.id && v.model.id === model.id
        );
        if (item) {
          updateFleetVehicleQuantity(item.id, newQuantity);
        }
      }
    }
  };

  return (
    <section className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className='flex items-center gap-2'>
        <Truck className='w-5 h-5 text-amber-400' />
        <h3 className='text-white font-medium text-lg'>Fleet Vehicle Selection</h3>
      </div>

      {/* Categories - Custom Layout */}
      {fleetCategories
        .filter(cat => ['executive', 'luxury'].includes(cat.id))
        .map(category => (
          <CategorySection
            key={category.id}
            category={category}
            onQuantityChange={handleQuantityChange}
            getVehicleQuantity={getVehicleQuantity}
          />
        ))}

      {/* SUV + MPV Combined Section */}
      <CombinedCategorySection
        categories={fleetCategories.filter(cat => ['suv', 'mpv'].includes(cat.id))}
        onQuantityChange={handleQuantityChange}
        getVehicleQuantity={getVehicleQuantity}
      />
    </section>
  );
}

// 📦 Reusable Category Section Component
interface CategorySectionProps {
  category: VehicleCategory;
  onQuantityChange: (category: VehicleCategory, model: VehicleModel, delta: number) => void;
  getVehicleQuantity: (category: VehicleCategory, model: VehicleModel) => number;
}

function CategorySection({ category, onQuantityChange, getVehicleQuantity }: CategorySectionProps) {
  const IconComponent = CATEGORY_ICONS[category.id];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {category.models.map(model => (
        <div key={model.id} className='space-y-3'>
          {/* Individual Category Header per Vehicle */}
          <div className='flex items-center gap-2'>
            {IconComponent && <IconComponent className='w-4 h-4 text-amber-200/80' />}
            <h4 className='text-amber-200/80 text-xs font-medium tracking-wider uppercase'>
              {category.id === 'luxury' ? 'First Class' : category.name}
            </h4>
          </div>

          {/* Vehicle Card */}
          <VehicleCard
            category={category}
            model={model}
            quantity={getVehicleQuantity(category, model)}
            onQuantityChange={onQuantityChange}
          />
        </div>
      ))}
    </div>
  );
}

// 🚗 Reusable Vehicle Card Component
interface VehicleCardProps {
  category: VehicleCategory;
  model: VehicleModel;
  quantity: number;
  onQuantityChange: (category: VehicleCategory, model: VehicleModel, delta: number) => void;
}

function VehicleCard({ category, model, quantity, onQuantityChange }: VehicleCardProps) {
  return (
    <div
      className='relative p-3 rounded-xl backdrop-blur-sm transition-all duration-200'
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* Vehicle Info - Extended Image Layout */}
      <div className='relative mb-2' style={{ height: '6rem' }}>
        {/* Extended Vehicle Image */}
        <div
          className='absolute w-full rounded-lg overflow-hidden bg-gradient-to-br from-stone-700 to-stone-950'
          style={{ height: 'calc(6rem + 3mm)' }}
        >
          {model.image ? (
            <Image
              src={model.image}
              alt={model.name}
              width={128}
              height={80}
              className={`w-full h-full ${
                category.id === 'suv'
                  ? 'object-contain scale-[1.85]'
                  : category.id === 'mpv'
                    ? 'object-contain scale-[2.0]'
                    : 'object-contain scale-[2.2]'
              }`}
              style={
                model.name === 'BMW 7 Series' || model.name === 'Mercedes S-Class'
                  ? { objectPosition: 'center center' }
                  : model.name === 'BMW 5 Series'
                    ? { objectPosition: 'center calc(50% + 3px)' }
                    : category.id === 'luxury'
                      ? { objectPosition: 'center calc(50% + 7px)' }
                      : undefined
              }
              priority
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <Crown className='w-10 h-10 text-amber-400/60' />
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Info & Quantity Controls */}
      <div className='flex items-center justify-between' style={{ transform: 'translateY(2mm)' }}>
        <div className='flex items-center gap-2 flex-1'>
          <h5 className='text-white font-medium text-sm'>{model.name}</h5>
          <span className='text-white/40 text-xs'>• {model.capacity.passengers} passengers</span>
        </div>

        <div className='flex items-center gap-2'>
          <QuantityButton
            icon={Minus}
            onClick={() => onQuantityChange(category, model, -1)}
            disabled={quantity === 0}
          />

          <span className='text-white font-medium text-sm w-8 text-center'>{quantity}</span>

          <QuantityButton
            icon={Plus}
            onClick={() => onQuantityChange(category, model, 1)}
            disabled={quantity >= 10}
          />
        </div>
      </div>
    </div>
  );
}

// ⚡ Reusable Quantity Button Component
interface QuantityButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled: boolean;
}

function QuantityButton({ icon: Icon, onClick, disabled }: QuantityButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className='w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed'
      style={{
        backgroundColor: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Icon className='w-4 h-4 text-white' />
    </button>
  );
}

// 🚙 Combined Category Section (SUV + MPV on same row)
interface CombinedCategorySectionProps {
  categories: VehicleCategory[];
  onQuantityChange: (category: VehicleCategory, model: VehicleModel, delta: number) => void;
  getVehicleQuantity: (category: VehicleCategory, model: VehicleModel) => number;
}

function CombinedCategorySection({
  categories,
  onQuantityChange,
  getVehicleQuantity,
}: CombinedCategorySectionProps) {
  if (categories.length === 0) return null;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {categories.map(category => {
        const IconComponent = CATEGORY_ICONS[category.id];
        return (
          <div key={category.id} className='space-y-3'>
            {/* Individual Category Header */}
            <div className='flex items-center gap-2'>
              {IconComponent && <IconComponent className='w-4 h-4 text-amber-200/80' />}
              <h4 className='text-amber-200/80 text-xs font-medium tracking-wider uppercase'>
                {category.id === 'luxury' ? 'First Class' : category.name}
              </h4>
            </div>

            {/* Vehicle Card */}
            {category.models.map(model => (
              <VehicleCard
                key={`${category.id}-${model.id}`}
                category={category}
                model={model}
                quantity={getVehicleQuantity(category, model)}
                onQuantityChange={onQuantityChange}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
