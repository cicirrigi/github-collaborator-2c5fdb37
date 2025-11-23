// 🚗 VEHICLE DATA - Step 2 Vehicle Selection Data

import type { VehicleAvailabilityRule, VehicleCategory, VehicleModel } from './vehicle.types';

// 🏆 VEHICLE MODELS DATA
const executiveModels: VehicleModel[] = [
  {
    id: 'mercedes-e-class',
    name: 'Mercedes E-Class',
    brand: 'Mercedes',
    model: 'E-Class',
    image: '/images/vehicles/mercedes-e-class.jpg',
    features: ['Leather interior', 'Dual-zone climate', 'Premium sound', 'WiFi hotspot'],
    capacity: {
      passengers: 4,
      luggage: 2,
    },
    specifications: {
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      year: 2024,
    },
    priceMultiplier: 1.0,
  },
  {
    id: 'bmw-5-series',
    name: 'BMW 5 Series',
    brand: 'BMW',
    model: '5 Series',
    image: '/images/vehicles/bmw-5-series.jpg',
    features: ['Sport seats', 'Navigation', 'Heated seats', 'Premium audio'],
    capacity: {
      passengers: 4,
      luggage: 2,
    },
    specifications: {
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      year: 2024,
    },
    priceMultiplier: 1.0,
  },
];

const luxuryModels: VehicleModel[] = [
  {
    id: 'mercedes-s-class',
    name: 'Mercedes S-Class',
    brand: 'Mercedes',
    model: 'S-Class',
    image: '/images/vehicles/mercedes-s-class.jpg',
    features: ['Massage seats', 'Champagne service', 'Executive rear', 'Ambient lighting'],
    capacity: {
      passengers: 4,
      luggage: 3,
    },
    specifications: {
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      year: 2024,
    },
    priceMultiplier: 1.5,
  },
  {
    id: 'bmw-7-series',
    name: 'BMW 7 Series',
    brand: 'BMW',
    model: '7 Series',
    image: '/images/vehicles/bmw-7-series.jpg',
    features: ['Executive lounge', 'Sky lounge', 'Premium sound', 'Rear entertainment'],
    capacity: {
      passengers: 4,
      luggage: 3,
    },
    specifications: {
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      year: 2024,
    },
    priceMultiplier: 1.5,
  },
];

const suvModels: VehicleModel[] = [
  {
    id: 'range-rover',
    name: 'Range Rover',
    brand: 'Land Rover',
    model: 'Range Rover',
    image: '/images/vehicles/range-rover.jpg',
    features: ['All-terrain', '4WD capability', 'Premium interior', 'Panoramic roof'],
    capacity: {
      passengers: 5,
      luggage: 4,
    },
    specifications: {
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      year: 2024,
    },
    priceMultiplier: 1.3,
  },
];

const mpvModels: VehicleModel[] = [
  {
    id: 'mercedes-v-class',
    name: 'Mercedes V-Class',
    brand: 'Mercedes',
    model: 'V-Class',
    image: '/images/vehicles/mercedes-v-class.jpg',
    features: ['8 passenger seating', 'Conference layout', 'Premium interior', 'Extra luggage'],
    capacity: {
      passengers: 8,
      luggage: 6,
    },
    specifications: {
      fuelType: 'Diesel',
      transmission: 'Automatic',
      year: 2024,
    },
    priceMultiplier: 1.4,
  },
];

// 🎯 VEHICLE CATEGORIES
export const vehicleCategories: VehicleCategory[] = [
  {
    id: 'executive',
    name: 'Executive',
    description: 'Perfect for business travel and professional meetings',
    tagline: 'Professional & Comfortable',
    icon: 'Briefcase',
    models: executiveModels,
    basePrice: 120,
    priceMultiplier: 1.0,
    features: ['Professional chauffeur', 'Business amenities', 'WiFi included', 'Climate control'],
    recommended: true,
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Ultimate comfort and premium experience for special occasions',
    tagline: 'Premium & Exclusive',
    icon: 'Crown',
    models: luxuryModels,
    basePrice: 180,
    priceMultiplier: 1.5,
    features: ['VIP treatment', 'Champagne service', 'Massage seats', 'Privacy partition'],
    recommended: false,
  },
  {
    id: 'suv',
    name: 'SUV',
    description: 'Spacious and versatile for all weather conditions',
    tagline: 'Robust & Spacious',
    icon: 'Truck',
    models: suvModels,
    basePrice: 140,
    priceMultiplier: 1.3,
    features: ['All-weather capability', 'Extra space', 'Premium comfort', 'Safety features'],
    recommended: false,
  },
  {
    id: 'mpv',
    name: 'MPV',
    description: 'Perfect for group travel and events with maximum capacity',
    tagline: 'Group & Events',
    icon: 'Users',
    models: mpvModels,
    basePrice: 160,
    priceMultiplier: 1.4,
    features: ['8 passenger capacity', 'Group seating', 'Conference setup', 'Extra luggage space'],
    recommended: false,
  },
];

// 🔄 AVAILABILITY RULES FOR BOOKING TYPES
export const vehicleAvailabilityRules: VehicleAvailabilityRule[] = [
  {
    bookingTypes: ['oneway', 'return'],
    availableCategories: ['executive', 'luxury', 'suv', 'mpv'],
    defaultCategory: 'executive',
  },
  {
    bookingTypes: ['hourly'],
    availableCategories: ['executive', 'luxury', 'suv'],
    defaultCategory: 'executive',
  },
  {
    bookingTypes: ['daily'],
    availableCategories: ['executive', 'luxury', 'suv', 'mpv'],
    defaultCategory: 'executive',
  },
  {
    bookingTypes: ['fleet'],
    availableCategories: ['executive', 'mpv'],
    defaultCategory: 'mpv',
    restrictions: {
      minPassengers: 5,
    },
  },
  {
    bookingTypes: ['bespoke'],
    availableCategories: ['executive', 'luxury', 'suv', 'mpv'],
    defaultCategory: 'luxury',
  },
];

// 🔧 UTILITY FUNCTIONS
export function getAvailableCategoriesForBookingType(bookingType: string): VehicleCategory[] {
  const rule = vehicleAvailabilityRules.find(r =>
    r.bookingTypes.includes(
      bookingType as 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet' | 'bespoke'
    )
  );
  if (!rule) return vehicleCategories;

  return vehicleCategories.filter(cat => rule.availableCategories.includes(cat.id));
}

export function getDefaultCategoryForBookingType(bookingType: string): VehicleCategory | null {
  const rule = vehicleAvailabilityRules.find(r =>
    r.bookingTypes.includes(
      bookingType as 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet' | 'bespoke'
    )
  );
  if (!rule?.defaultCategory) return null;

  return vehicleCategories.find(cat => cat.id === rule.defaultCategory) || null;
}
