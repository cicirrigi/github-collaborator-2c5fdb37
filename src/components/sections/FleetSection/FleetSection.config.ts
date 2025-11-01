/**
 * 🚗 Fleet Section Configuration - Vantage Lane 2.0
 *
 * Centralized configuration for fleet vehicles and section content.
 * Config-driven approach eliminates hardcoding and enables easy updates.
 */

import type { FleetSectionConfig } from './FleetSection.types';

export const fleetConfig: FleetSectionConfig = {
  title: {
    primary: 'Our Premium',
    accent: 'Fleet',
  },
  subtitle:
    'Meticulously maintained prestige vehicles for every occasion, from executive transfers to special celebrations.',

  vehicles: [
    {
      id: 'bmw-5-series',
      name: 'BMW 5 Series',
      category: 'Executive',
      image:
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center',
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
      image:
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center',
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
      image:
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=300&fit=crop&crop=center',
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
      image:
        'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&crop=center',
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
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
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
      category: 'Van',
      image:
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center',
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
export const vehicleCategories = ['Executive', 'Luxury', 'SUV', 'Van'] as const;

// Export vehicles by category helper
export const getVehiclesByCategory = (category: string) =>
  fleetConfig.vehicles.filter(vehicle => vehicle.category === category);

// Export popular vehicles helper
export const getPopularVehicles = () => fleetConfig.vehicles.filter(vehicle => vehicle.popular);
