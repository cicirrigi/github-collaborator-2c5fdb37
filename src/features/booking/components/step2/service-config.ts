// 🎁 STEP 2 SERVICE CONFIGURATION - OFFICIAL DATA
// Conform specificației oficiale Step 2 - toate serviciile și prețurile

import type { LucideIcon } from 'lucide-react';
import {
  Car,
  Clock,
  Droplets,
  Eye,
  Flower,
  Heart,
  Luggage,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  ShieldCheck,
  Thermometer,
  Users,
  Volume2,
  Wifi,
  Wind,
  Wine,
} from 'lucide-react';

// 🟦 A. INCLUDED SERVICES (ALL CLASSES) - 9 servicii
export interface IncludedService {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const INCLUDED_SERVICES: IncludedService[] = [
  {
    id: 'meet-greet',
    title: 'Greeting',
    description: 'Personal welcome service at pickup location',
    icon: Users,
  },
  {
    id: 'onboard-wifi',
    title: 'WiFi',
    description: 'Stay connected during your journey',
    icon: Wifi,
  },
  {
    id: 'phone-chargers',
    title: 'Chargers',
    description: 'Charging cables for all major devices',
    icon: Phone,
  },
  {
    id: 'refreshments',
    title: 'Refreshments',
    description: 'Premium bottled water (still or sparkling)',
    icon: Droplets,
  },
  {
    id: 'luggage-assistance',
    title: 'Assistance',
    description: 'Help with your bags',
    icon: Luggage,
  },
  {
    id: 'pet-friendly',
    title: 'Pet-Friendly',
    description: 'Small pets (up to 8kg) in carriers',
    icon: Heart,
  },
  {
    id: 'airport-wait-time',
    title: 'Waiting Time',
    description: 'Complimentary included waiting time',
    icon: Clock,
  },
  {
    id: 'extra-stops',
    title: 'Extra Stops',
    description: 'Short stops on-route within reasonable time',
    icon: MapPin,
  },
];

// 🟨 B. FREE PREMIUM OPTIONS (Luxury/SUV/MPV only) - 4 opțiuni
export interface PremiumFeature {
  id: 'paparazziSafeMode' | 'frontSeatRequest' | 'comfortRideMode' | 'personalLuggagePrivacy';
  title: string;
  description: string;
  icon: LucideIcon;
}

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: 'paparazziSafeMode',
    title: 'Paparazzi Safe Mode',
    description: 'Lights off, no photos, no public name calling, driver stays inside',
    icon: Eye,
  },
  {
    id: 'frontSeatRequest',
    title: 'Front Seat Request',
    description: 'Ride in the front passenger seat for comfort or sensitivity',
    icon: Car,
  },
  {
    id: 'comfortRideMode',
    title: 'Comfort Ride Mode',
    description: 'Smoother, gentle driving with soft acceleration & minimal braking',
    icon: Wind,
  },
  {
    id: 'personalLuggagePrivacy',
    title: 'Personal Luggage Privacy',
    description: 'Driver will NOT touch bags or doors. Full privacy',
    icon: Shield,
  },
];

// 🟩 C. UNIVERSAL TRIP PREFERENCES (ALL CLASSES) - 3 grupe
export interface PreferenceOption {
  value: string;
  label: string;
}

export interface TripPreference {
  id: 'music' | 'temperature' | 'communication';
  title: string;
  icon: LucideIcon;
  options: PreferenceOption[];
}

export const TRIP_PREFERENCES: TripPreference[] = [
  {
    id: 'music',
    title: 'Music Preference',
    icon: Volume2,
    options: [
      { value: 'no-preference', label: 'No Preference' },
      { value: 'classical', label: 'Classical' },
      { value: 'jazz', label: 'Jazz' },
      { value: 'pop', label: 'Pop' },
      { value: 'rock', label: 'Rock' },
      { value: 'silence', label: 'Prefer Silence' },
    ],
  },
  {
    id: 'temperature',
    title: 'Temperature Preference',
    icon: Thermometer,
    options: [
      { value: 'no-preference', label: 'No Preference' },
      { value: 'cool', label: 'Cool (18–20°C)' },
      { value: 'comfortable', label: 'Comfortable (21–23°C)' },
      { value: 'warm', label: 'Warm (24–26°C)' },
    ],
  },
  {
    id: 'communication',
    title: 'Communication Style',
    icon: MessageCircle,
    options: [
      { value: 'no-preference', label: 'No Preference' },
      { value: 'friendly', label: 'Friendly Chat' },
      { value: 'professional', label: 'Professional Only' },
      { value: 'minimal', label: 'Minimal' },
    ],
  },
];

// 🟥 D. PAID PREMIUM UPGRADES (ALL CLASSES) - 5 upgrade-uri
export interface PaidUpgrade {
  category: 'flowers' | 'champagne' | 'security';
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  icon: LucideIcon;
}

export const PAID_UPGRADES: PaidUpgrade[] = [
  // Flowers
  {
    category: 'flowers',
    id: 'standard',
    title: 'Standard Luxury Bouquet',
    description: 'Hand-tied seasonal bouquet',
    price: 120,
    currency: '£',
    icon: Flower,
  },
  {
    category: 'flowers',
    id: 'exclusive',
    title: 'Exclusive Grand Bouquet',
    description: 'Luxury roses & exotic flowers',
    price: 250,
    currency: '£',
    icon: Flower,
  },
  // Champagne
  {
    category: 'champagne',
    id: 'moet',
    title: 'Moët & Chandon Brut Imperial',
    description: 'Chilled 750ml, 4h notice',
    price: 120,
    currency: '£',
    icon: Wine,
  },
  {
    category: 'champagne',
    id: 'dom-perignon',
    title: 'Dom Pérignon 2015',
    description: 'Prestige champagne, limited availability',
    price: 350,
    currency: '£',
    icon: Wine,
  },
  // Security
  {
    category: 'security',
    id: 'escort',
    title: 'Security Escort',
    description: 'SIA-certified protection 6–8h',
    price: 750,
    currency: '£',
    icon: ShieldCheck,
  },
];
