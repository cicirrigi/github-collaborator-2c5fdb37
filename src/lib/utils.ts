/**
 * 🛠️ Utility Functions - Vantage Lane 2.0
 * Common utility functions used across the application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 * Combines clsx for conditional classes with tailwind-merge for conflict resolution
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500', { 'text-white': active })
 * cn('px-2', 'px-4') // Result: 'px-4' (conflict resolved)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
