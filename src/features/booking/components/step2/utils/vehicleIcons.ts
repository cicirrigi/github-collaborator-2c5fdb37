import { Car, Crown, Truck, Users } from 'lucide-react';

// 🚗 Vehicle Category Icons Utility
export const getVehicleIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'luxury':
      return Crown;
    case 'suv':
      return Truck;
    case 'mpv':
      return Users;
    default:
      return Car;
  }
};

// Category Name Formatting
export const formatCategoryName = (categoryId: string): string => {
  return categoryId === 'luxury'
    ? 'First Class'
    : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
};
