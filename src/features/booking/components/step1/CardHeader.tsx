import type { LucideIcon } from 'lucide-react';

export function CardHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon | string; // Acceptă emoji sau icon component
  title: string;
  subtitle: string;
}) {
  return (
    <div className='flex items-center space-x-3 mb-2'>
      <div className='w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center'>
        {typeof Icon === 'string' ? (
          <span className='text-xl'>{Icon}</span>
        ) : (
          <Icon className='w-6 h-6 text-white' />
        )}
      </div>
      <div>
        <h3 className='text-xl font-semibold text-white'>{title}</h3>
        <p className='text-sm text-white/60'>{subtitle}</p>
      </div>
    </div>
  );
}
