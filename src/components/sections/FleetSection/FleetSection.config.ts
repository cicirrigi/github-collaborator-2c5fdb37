/**
 * 🚗 Fleet Section Configuration - Vantage Lane 2.0
 *
 * Centralized configuration for fleet vehicles and section content.
 * Config-driven approach eliminates hardcoding and enables easy updates.
 */

import type { FleetSectionConfig } from './FleetSection.types';

export const fleetConfig: FleetSectionConfig = {
  title: {
    primary: 'The Vantage Lane',
    accent: 'Fleet',
  },
  subtitle:
    'A curated selection of meticulously maintained prestige vehicles — tailored for every journey, from executive transfers to special occasions. Hover to discover more.',

  vehicles: [
    {
      id: 'bmw-5-series',
      name: 'BMW 5 Series',
      category: 'Executive',
      image: '/images/vehicles-webp/5 Series Left side angle.webp',
      description: 'Perfect for business meetings and airport transfers',
      passengers: 4,
      features: [
        { text: '4 Passengers' },
        { text: 'Premium Leather' },
        { text: 'Climate Control' },
        { text: 'Business WiFi' },
      ],
      priceFrom: 'From £45/hour',
      availability: 'available',
    },
    {
      id: 'mercedes-e-class',
      name: 'Mercedes E-Class',
      category: 'Executive',
      image: '/images/vehicles-webp/E class Left side angle.webp',
      description: 'Sophisticated comfort for discerning clients',
      passengers: 4,
      features: [
        { text: '4 Passengers' },
        { text: 'Advanced Safety' },
        { text: 'Luxury Interior' },
        { text: 'Premium Sound' },
      ],
      priceFrom: 'From £45/hour',
      availability: 'available',
    },
    {
      id: 'bmw-7-series',
      name: 'BMW 7 Series',
      category: 'Luxury',
      image: '/images/vehicles-webp/7 Series Left side angle.webp',
      description: 'Ultimate luxury for special occasions',
      passengers: 4,
      features: [
        { text: '4 Passengers' },
        { text: 'Massage Seats' },
        { text: 'Premium Sound' },
        { text: 'Executive Lounge' },
      ],
      priceFrom: 'From £65/hour',
      availability: 'available',
      popular: true,
    },
    {
      id: 'mercedes-s-class',
      name: 'Mercedes S-Class',
      category: 'Luxury',
      image: '/images/vehicles-webp/S class Left side angle.webp',
      description: 'The pinnacle of automotive luxury',
      passengers: 4,
      features: [
        { text: '4 Passengers' },
        { text: 'Executive Rear' },
        { text: 'Chauffeur Partition' },
        { text: 'Champagne Service' },
      ],
      priceFrom: 'From £65/hour',
      availability: 'available',
    },
    {
      id: 'range-rover',
      name: 'Range Rover',
      category: 'SUV',
      image: '/images/vehicles-webp/Range Rover Left side angle.webp',
      description: 'Versatile luxury for groups and families',
      passengers: 7,
      features: [
        { text: '7 Passengers' },
        { text: 'All-Terrain' },
        { text: 'Premium Space' },
        { text: 'Extra Luggage' },
      ],
      priceFrom: 'From £55/hour',
      availability: 'available',
    },
    {
      id: 'mercedes-v-class',
      name: 'Mercedes V-Class',
      category: 'MPV',
      image: '/images/vehicles-webp/V class Left side angle.webp',
      description: 'Spacious comfort for larger groups',
      passengers: 8,
      features: [
        { text: '8 Passengers' },
        { text: 'Conference Setup' },
        { text: 'Extra Luggage' },
        { text: 'Group Comfort' },
      ],
      priceFrom: 'From £55/hour',
      availability: 'available',
    },
  ] as const,

  cta: {
    text: 'Contact Our Fleet Manager',
    description: 'Need a custom solution? We offer bespoke services for special requirements.',
    action: () => {
      // Navigation to contact or booking page
      // TODO: Implement navigation to fleet manager contact
    },
  },
} as const;

// Export individual vehicle categories for filtering
export const vehicleCategories = ['Executive', 'Luxury', 'SUV', 'MPV'] as const;

// Export vehicles by category helper
export const getVehiclesByCategory = (category: string) =>
  fleetConfig.vehicles.filter(vehicle => vehicle.category === category);

// Export popular vehicles helper
export const getPopularVehicles = () => fleetConfig.vehicles.filter(vehicle => vehicle.popular);
