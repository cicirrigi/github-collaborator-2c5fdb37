import { formatCategoryName, getVehicleIcon } from '../utils/vehicleIcons';

// 🚗 Vehicle Breakdown Item
export interface VehicleBreakdownItemProps {
  categoryId: string;
  count: number;
  models: Record<string, number>;
}

export function VehicleBreakdownItem({ categoryId, count, models }: VehicleBreakdownItemProps) {
  const categoryName = formatCategoryName(categoryId);
  const VehicleIcon = getVehicleIcon(categoryId);

  return (
    <div className='flex flex-col items-center py-3 text-center px-2'>
      <div className='flex items-center gap-1.5 mb-1'>
        <VehicleIcon className='w-3.5 h-3.5 text-amber-200/70' />
        <span className='text-white text-sm font-medium'>
          {count}x {categoryName}
        </span>
      </div>
      <div className='text-white/50 text-xs'>
        {Object.entries(models).map(([modelName, modelCount], index) => (
          <span key={modelName}>
            {index > 0 && ', '}
            {modelCount}x {modelName}
          </span>
        ))}
      </div>
    </div>
  );
}
